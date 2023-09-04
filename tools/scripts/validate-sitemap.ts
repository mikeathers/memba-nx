/**
 * Sitemap Validator
 *
 * Should read a url (for example: https://www.cinch.co.uk/sitemap.xml) and determine and list any dead links or invalid urls.
 *
 * [usage]
 * to Generate a report on cinch's sitemap
 * ```sh
 * yarn run --silent validate-sitemap https://www.cinch.co.uk/sitemap.xml 1 30000 > sitemap-report.txt
 * ```
 *
 */
import {XMLParser} from 'fast-xml-parser'
import fetch, {Headers} from 'node-fetch'
import {exit} from 'process'
import {z} from 'zod'
import {program} from '@commander-js/extra-typings'
import {writeFileSync} from 'fs'
import path from 'path'

/**
 * This is where the fun begins
 */
const script = program
  .version('1.1.0')
  .argument('<sitemapUrl>', 'the URL to the sitemap that is to be validated')
  .requiredOption(
    '-C, --chunk-size <delay>',
    'the number of requests to do at the same time.',
    '25',
  )
  .requiredOption(
    '-D, --delay-between <delay>',
    'the delay between chunks of requests, in seconds',
    '60',
  )
  .option('--json', 'writes results to results.json', false)
  .action(async (sitemapUrl, {chunkSize, delayBetween, json}) => {
    const parsedChunkSize = numericalString().parse(chunkSize)
    const parsedDelayBetween = numericalString().parse(delayBetween) * 1000

    await initSitemapValidation({
      sitemapUrl,
      delay: parsedDelayBetween,
      chunkSize: parsedChunkSize,
      json,
    }).then((success) => {
      if (!success && json) {
        console.log('[FAIL] Sitemap validation failed! results written to ./results.json')
        exit(0)
      }

      if (!success) {
        console.error('[FAIL] Sitemap validation failed!')
        exit(1)
      }

      console.log('[SUCCESS] Sitemap validation Successful!')
    })
  })

const isNumericalString = (input: unknown) => parseInt(z.string().parse(input), 10)

const numericalString = (params?: Parameters<typeof z.number>[0]) =>
  z.preprocess(isNumericalString, z.number(params))

type SitemapEntry = {
  loc: string
  lastmod?: string
}

type SitemapIndex = {
  sitemap: SitemapEntry[]
}

type SitemapUrlSet = {
  url: SitemapEntry[]
}

type Sitemap = SitemapIndex | SitemapUrlSet
type IndexSitemap = {sitemapindex: SitemapIndex; urlset?: never}
type NormalSitemap = {sitemapindex?: never; urlset: SitemapUrlSet}

function guardIndexSitemap(input: unknown): input is IndexSitemap {
  return input ? Object.prototype.hasOwnProperty.call(input, 'sitemapindex') : false
}
function guardNormalSitemap(input: unknown): input is NormalSitemap {
  return input ? Object.prototype.hasOwnProperty.call(input, 'urlset') : false
}

type ValidTestResult = {url: string; valid: true; reason?: undefined}
type InvalidTestResult = {url: string; valid: false; reason: string}
type TestResult = ValidTestResult | InvalidTestResult

function guardInvalidTestResult(input: TestResult): input is InvalidTestResult {
  return input.valid === false
}

type failureJsonOutput = {
  success: false
  results: {sitemapUrl: string; urls: {url: string; reason: string}[]}[]
}

type successJsonOutput = {
  success: true
}

type JsonOutput = successJsonOutput | failureJsonOutput
type validatorFunction = () => Promise<JsonOutput>

async function fetchSitemap(url: string): Promise<string> {
  const request = await fetch(url)
  const input = await request.text()
  const parser = new XMLParser({
    trimValues: true,
    isArray(tagName, jPath, isLeafNode, isAttribute) {
      if (['urlset.url'].includes(jPath)) return true
      return false
    },
  })

  return parser.parse(input)
}

async function validateUrl(url: string): Promise<TestResult> {
  try {
    const headers = new Headers()
    headers.append('User-Agent', 'SEO Sitemap Validator')

    const response = await fetch(url, {
      headers,
    })

    const validStatus = /20[014]|304/
    const data = await response.text()
    const isValidStatus = validStatus.test(response.status.toString())
    const isEmptyResponse = data.length !== 0

    if (isValidStatus && isEmptyResponse) {
      return {url, valid: true}
    } else {
      return {
        url,
        valid: false,
        reason: isValidStatus ? `Empty Response` : `Invalid Status ${response.status}`,
      }
    }
  } catch (e) {
    let reason: string = {}.toString.call(e)

    if (e instanceof Error) {
      reason = e.message
    }

    return {
      url,
      valid: false,
      reason,
    }
  }
}

async function validateUrls(urls: string[]) {
  const urlTestResults = await Promise.all(urls.map((url) => validateUrl(url)))

  return urlTestResults.filter(guardInvalidTestResult)
}

async function initSitemapValidation({
  sitemapUrl,
  delay,
  chunkSize,
  json = false,
}: {
  sitemapUrl: string
  delay: number
  chunkSize: number
  json: boolean
}) {
  console.group(`Validating sitemap: ${sitemapUrl}`)
  const queue: validatorFunction[] = []
  const results: JsonOutput[] = [
    await doSitemapValidation({sitemapUrl, queue, delay, chunkSize}),
  ]

  for (let validator of queue) {
    const validatorResult = await validator()
    results.push(validatorResult)
  }
  console.groupEnd()

  if (json) {
    const json = results.reduce((acc, val) => {
      if (val.success) return acc

      return {
        ...acc,
        success: acc.success === false ? false : val.success, // if success = false, don't set it again.
        results: [...(acc.success === false ? acc?.results : []), ...val.results],
      }
    }, {} as JsonOutput)

    console.log('Writing Results to json file...')
    writeFileSync(path.join(process.cwd(), 'results.json'), JSON.stringify(json, null, 2))
  }

  return results.every((res) => res.success === true)
}

async function doSitemapValidation({
  sitemapUrl,
  queue,
  delay,
  chunkSize,
}: {
  sitemapUrl: string
  queue: validatorFunction[]
  delay: number
  chunkSize: number
}): Promise<JsonOutput> {
  try {
    const sitemap = await fetchSitemap(sitemapUrl)

    if (guardIndexSitemap(sitemap)) {
      console.log('--> Found a Sitemap Index.')
      const urls = sitemap.sitemapindex.sitemap.map((sm) => sm.loc)
      urls.forEach((url) => queueSitemapValidation(url, queue, delay, chunkSize))
    }

    if (guardNormalSitemap(sitemap)) {
      console.log(`--> Found ${sitemap.urlset.url.length} entries`)
      const URLs = sitemap.urlset.url.map((u) => u.loc)
      const originalNumberOfUrls = URLs.length
      const invalidUrls: InvalidTestResult[] = []
      const delayInSeconds = delay / 1000

      if (chunkSize === 0) {
        const validateURlsResults = await validateUrls(URLs)
        invalidUrls.push(...validateURlsResults)
      } else {
        console.log(
          `--> Checking in Batches of ${chunkSize} with delays between Batches of ${delayInSeconds} Seconds.`,
        )
        console.log(
          `----> Estimated Duration: ~${(
            (originalNumberOfUrls / chunkSize) *
            (delay / 60_000)
          ).toFixed(2)} Minutes`,
        )

        let numberOfUrlsChecked = 0

        while (URLs.length) {
          const chunked = URLs.splice(0, chunkSize)
          numberOfUrlsChecked += chunked.length
          const results = await validateUrls(chunked)
          invalidUrls.push(...results)

          if (numberOfUrlsChecked < originalNumberOfUrls) {
            console.log(
              `----> About ${((numberOfUrlsChecked / originalNumberOfUrls) * 100).toFixed(
                0,
              )}% Complete. waiting ${delayInSeconds} seconds before starting next batch`,
            )
            await wait(delay) // wait a few seconds to avoid ddos'ing the site.
          } else {
            console.log(`----> 100% Complete.`)
          }
        }
      }

      if (invalidUrls.length > 0) {
        console.log(
          `[FAIL] there are ${invalidUrls.length} invalid entries: `,
          `\n   - ${invalidUrls.map((u) => `${u.url} (${u.reason})`).join('\n   - ')}`,
        )
        return {
          success: false,
          results: [
            {
              sitemapUrl,
              urls: invalidUrls.map((u) => ({url: u.url, reason: u.reason})),
            },
          ],
        }
      }
    }

    return {
      success: true,
    }
  } catch (e) {
    let errorMessage = '[FAIL] Failed to parse sitemap. Reason: '

    if (typeof e === 'string') {
      errorMessage = `${errorMessage} ${e}`
    }

    if (e instanceof Error) {
      errorMessage = `${errorMessage} ${e.message}`
    }

    console.log(errorMessage)

    return {
      success: false,
      results: [{sitemapUrl, urls: [{url: sitemapUrl, reason: errorMessage}]}],
    }
  }
}

function queueSitemapValidation(
  sitemap: string,
  queue: validatorFunction[],
  delay: number,
  chunkSize: number,
) {
  console.log(`--> Queuing Sitemap: ${sitemap}`)

  queue.push(async () => {
    console.group(`Validating Queued Sitemap: ${sitemap}`)
    const results = await doSitemapValidation({
      sitemapUrl: sitemap,
      queue,
      delay,
      chunkSize,
    })
    console.groupEnd()
    return results
  })
}

function wait(timeout = 1000) {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

async function main() {
  await script.parseAsync(process.argv)
}

main()
