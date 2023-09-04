const core = require('@actions/core');

const { exec } = require('node:child_process')
const { join } = require('node:path')

const MONOREPO_ROOT = join(__dirname, '../../../')
const NODE_BIN = join(MONOREPO_ROOT, 'node_modules/.bin')

const assertUndefinedOrString = (inputName, inputValue) => { 
  if ( inputValue && typeof inputValue !== "string") {
    throw new Error(`value provided for ${inputName} expected to be string, received ${inputValue}`)
  }
}

const assertString = (inputName, inputValue) => { 
  if ( typeof inputValue !== "string") {
    throw new Error(`value provided for ${inputName} expected to be string, received ${inputValue}`)
  }
}

function printAffected(
    target,
    excludedProjects,
    configuration,
    type,
    select
  ) {
    assertString("target", target);
    assertUndefinedOrString("excludedProjects", excludedProjects);
    assertUndefinedOrString("configuration", excludedProjects);
    assertUndefinedOrString("type", type);
    assertUndefinedOrString("select", select)

    let cmd = `${NODE_BIN}/nx print-affected --target="${target}"`

    if ( excludedProjects ) {
      cmd += ` --exclude="${excludedProjects}"`
    }

    if ( configuration ) {
      cmd += ` --configuration="${configuration}"`
    }

    if ( type ) {
      cmd += ` --type="${type}"`
    }

    if ( select ) {
      cmd += ` --select="${select}"`
    }

    core.info(`❯ ${cmd.replace(`${NODE_BIN}/`, '')}`)
    return new Promise((resolve) =>
      exec(
        cmd,
        {
          cwd: MONOREPO_ROOT,
        },
        (err, stdout) => {
          if (err) {
            console.error(err.message)
          }
  
          if (stdout) {
            resolve(stdout)
          }
        },
      ),
    )
  }
  
  const cleanUpOutput = (input) => input.trim().split(',').map(projectName => projectName.trim()).filter(projectName => projectName.length > 0); 

  async function main() {
    const target = core.getInput('target')
    const configuration = core.getInput('configuration')
    const type = core.getInput('type')
    const exclude = core.getInput('exclude')
    const select = core.getInput('select')

    const affectedOutput = await printAffected(
        target,
        exclude,
        configuration,
        type,
        select
    )
    
    const cleanedOutput = cleanUpOutput(affectedOutput)

    core.info(`Affected Projects: ${ cleanedOutput.length !== 0 ? cleanedOutput : 'No Affected Projects for target ' + target }`)
    core.setOutput('has-projects', cleanedOutput.length !== 0)
    core.setOutput('projects',  JSON.stringify(cleanedOutput))
  }

try {
  main()
} catch (error) {
  core.setFailed(error.message)
}