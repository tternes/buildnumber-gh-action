import * as core from '@actions/core'
import axios from 'axios'

async function run() {
  try {
    const baseUrl = 'http://buildnumber.xyz'
    const buildId = core.getInput('build_id', { required: true })
    const increment = core.getInput('increment') === 'true'

    core.info(`Build ID: ${buildId}`)
    core.info(`Increment: ${increment}`)

    const url = `${baseUrl}/builds/${buildId}`
    let response

    if (increment) {
      core.info(`Requesting next version for build ${buildId}`)
      response = await axios.put(url)
    } else {
      core.info(`Requesting current version for build ${buildId}`)
      response = await axios.get(url)
    }

    if (response.status === 200) {
      const currentBuild = response.data.current
      core.info(`Service returned version ${currentBuild}`)
      core.setOutput('current_build', currentBuild)
    } else {
      core.error(`Unexpected response: ${response.status}`)
      core.setFailed(`Failed to fetch build number. Status: ${response.status}`)
    }
  } catch (error: any) {
    core.setFailed(`Error: ${error.message}`)
  }
}

run()
