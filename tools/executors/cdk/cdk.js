'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1]
          return t[1]
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this
        }),
      g
    )
    function verb(n) {
      return function (v) {
        return step([n, v])
      }
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.')
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t
          if (((y = 0), t)) op = [op[0] & 2, t.value]
          switch (op[0]) {
            case 0:
            case 1:
              t = op
              break
            case 4:
              _.label++
              return { value: op[1], done: false }
            case 5:
              _.label++
              y = op[1]
              op = [0]
              continue
            case 7:
              op = _.ops.pop()
              _.trys.pop()
              continue
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0
                continue
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1]
                break
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1]
                t = op
                break
              }
              if (t && _.label < t[2]) {
                _.label = t[2]
                _.ops.push(op)
                break
              }
              if (t[2]) _.ops.pop()
              _.trys.pop()
              continue
          }
          op = body.call(thisArg, _)
        } catch (e) {
          op = [6, e]
          y = 0
        } finally {
          f = t = 0
        }
      if (op[0] & 5) throw op[1]
      return { value: op[0] ? op[1] : void 0, done: true }
    }
  }
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i)
          ar[i] = from[i]
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from))
  }
exports.__esModule = true
var devkit_1 = require('@nrwl/devkit')
var child_process_1 = require('child_process')
var path = require('path')
var path_1 = require('path')
var isTruthy = function (input) {
  return !!input === true
}
/**
 * Checks the Input string whether or not the includes string is present, it does so in a case-insensitive way.
 * @param stderr string to check
 * @param includes string to check for
 * @returns {boolean} whether or not the string contains the likeness of `includes`
 */
var includes = function (stderr, strToCheck, ignore, ignoreSurrounding) {
  if (ignore === void 0) {
    ignore = []
  }
  if (ignoreSurrounding === void 0) {
    ignoreSurrounding = 10
  }
  var regex = new RegExp(strToCheck, 'gmi')
  var result = regex.exec(stderr)
  if (result !== null) {
    var surrounding_1 = stderr.substring(
      result.index - ignoreSurrounding,
      result.index + strToCheck.length + ignoreSurrounding,
    )
    if (
      ignore.some(function (ignoredInput) {
        return surrounding_1.includes(ignoredInput)
      })
    ) {
      return false
    }
  }
  return result !== null
}
var containsErrorMessage = function (stio) {
  var ERROR_MESSAGES = [
    'error',
    'Error',
    'ERROR',
    'fail',
    'Since this app includes more than a single stack, specify which stacks to use',
  ]
  var IGNORE = ['_error']
  return ERROR_MESSAGES.some(function (message) {
    return includes(stio, message, IGNORE)
  })
}
function runExecutor(options, context) {
  var _a, _b
  return __awaiter(this, void 0, void 0, function () {
    var projectName,
      pathRelativeToProject,
      projectRoot,
      outPath,
      appArg,
      profileArg,
      outputPathArg,
      outputsFile,
      traceArg,
      debugArg,
      jsonArg,
      forceArg,
      contextArg,
      allArg,
      arbitraryArgs,
      cdkArgs,
      success
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          projectName =
            (_a = context.projectName) !== null && _a !== void 0 ? _a : ''
          pathRelativeToProject = function (inputPath) {
            return path.join(
              (0, devkit_1.offsetFromRoot)(projectRoot),
              inputPath,
            )
          }
          if (!projectName) {
            console.error('Unable to determine Project Name')
            return [2 /*return*/, { success: false }]
          }
          projectRoot = context.workspace.projects[projectName].root
          outPath = pathRelativeToProject(
            (_b = options.outputPath) !== null && _b !== void 0 ? _b : '',
          )
          appArg = options.app ? '--app='.concat(options.app) : null
          profileArg = options.profile
            ? '--profile='.concat(options.profile)
            : null
          outputPathArg = options.outputPath
            ? '--output='.concat(outPath)
            : null
          outputsFile = options.outputsFile
            ? '--outputs-file='.concat(
                pathRelativeToProject(options.outputsFile),
              )
            : null
          traceArg = options.trace ? '--trace' : null
          debugArg = options.debug ? '--debug' : null
          jsonArg = options.json ? '--json' : null
          forceArg = options.force ? '--force' : null
          contextArg = options.context
            ? toKeyValuePairs(options.context).reduce(function (acc, kv) {
                return __spreadArray(
                  __spreadArray([], acc, true),
                  ['--context', kv],
                  false,
                )
              }, [])
            : []
          allArg = options.all ? '--all' : null
          arbitraryArgs = options.arbitrary ? options.arbitrary : null
          cdkArgs = __spreadArray(
            __spreadArray(
              [options.command, options.stacks, appArg],
              contextArg,
              true,
            ),
            [
              profileArg,
              traceArg,
              debugArg,
              jsonArg,
              forceArg,
              outputPathArg,
              outputsFile,
              allArg,
              arbitraryArgs,
            ],
            false,
          ).filter(isTruthy)
          return [4 /*yield*/, spawnCDK(cdkArgs, projectRoot)]
        case 1:
          success = _c.sent()
          return [2 /*return*/, { success: success }]
      }
    })
  })
}
exports['default'] = runExecutor
var toKeyValuePairs = function (input) {
  return Object.keys(input).map(function (key) {
    if (typeof input[key] !== 'string') {
      return ''.concat(key, '.').concat(toKeyValuePairs(input[key]))
    } else {
      return ''
        .concat(encodeURIComponent(key), '=')
        .concat(encodeURIComponent(input[key]))
    }
  })
}
var spawnCDK = function (args, cwd) {
  return new Promise(function (resolve) {
    var CDK_CMD = (0, path_1.join)(__dirname, '../../../node_modules/.bin/cdk')
    console.log('>> cdk '.concat(args.join(' '), '\n\n'))
    var cdk = (0, child_process_1.spawn)(
      'npx',
      __spreadArray([CDK_CMD], args, true),
      { cwd: cwd, stdio: 'pipe' },
    )
    var stderr
    var stdout
    cdk.stderr.pipe(process.stdout)
    cdk.stdout.pipe(process.stdout)
    cdk.stderr.on('data', function (data) {
      stderr += data.toString()
    })
    cdk.stdout.on('data', function (data) {
      stdout += data.toString()
    })
    cdk.on('error', function (error) {
      console.error(error)
      resolve(false)
    })
    cdk.on('exit', function (code) {
      console.log('>> Command exited with code: ' + code)
      var exitedCleanly = code === 0
      var hasNoErrorMessages =
        !containsErrorMessage(stdout) || containsErrorMessage(stderr)
      resolve(exitedCleanly && hasNoErrorMessages)
    })
  })
}
