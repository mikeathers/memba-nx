import React from 'react'

type TagInterpolationHandler = (text: string, index?: number) => string | React.ReactNode
type InterpolatedVars = Record<string, string | number>
type InterpolatedTags = Record<string, TagInterpolationHandler>

interface TagMatch {
  tag: string
  index: number
  fullMatch: string
  innerText: string
}

const matchTag = (val: string): TagMatch[] => {
  const regex = new RegExp(`\\{([^}]+)\\}(.*?)\\{/[^}]+\\}`, 'g')
  const matches: TagMatch[] = []

  do {
    const match = regex.exec(val)
    if (match) {
      matches.push({
        fullMatch: match[0],
        tag: match[1],
        innerText: match[2],
        index: match.index,
      })
    }
  } while (regex.lastIndex > 0)

  return matches
}

export function interpolateVars(val: string, vars?: InterpolatedVars): string {
  return vars
    ? Object.keys(vars).reduce((acc, v) => {
        return acc.replace(new RegExp(`\\{${v}\\}`, 'g'), vars[v].toString())
      }, val)
    : val
}

const interpolateTags = (
  val: string,
  tags?: InterpolatedTags,
): Array<string | React.ReactNode> => {
  if (tags) {
    const matches = matchTag(val)

    const interpolated = []
    let lastMatchEndIndex = 0
    matches.forEach((match) => {
      interpolated.push(val.substring(lastMatchEndIndex, match.index))
      const handler = tags[match.tag]
      interpolated.push(handler ? handler(match.innerText, match.index) : match.fullMatch)
      lastMatchEndIndex = match.index + match.fullMatch.length
    })
    interpolated.push(val.substring(lastMatchEndIndex))
    return interpolated
  }
  return [val]
}

export const interpolateContent = (
  val: string,
  vars?: InterpolatedVars,
  tags?: InterpolatedTags,
): Array<string | React.ReactNode> => interpolateTags(interpolateVars(val, vars), tags)
