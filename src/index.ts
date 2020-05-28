import { Command, flags } from '@oclif/command'

import { log, error, note } from "./utils/log"
import { doesFileExist, checksumFile } from "./utils"
import { getSignedRequest } from "./utils/requests"
import generateFab from './utils/generateFab'

import { BuildStatus } from "./enums"

import handleBuildFailure from "./handlers/handleBuildFailure"
import handleDuplicateBundle from "./handlers/handleDuplicateBundle"
import handleServerError from "./handlers/handleServerError"
import handleUniqueBundle from "./handlers/handleUniqueBundle"

import isGitDirty from "is-git-dirty"

const FAB_FILE_PATH = "./fab.zip"

class LincFabUpload extends Command {
  static description = 'Builds and then uploads a FAB to Linc, along with some related build and git data.'

  static examples = [
    `$ fab-upload my-site-name`,
    `$ fab-upload my-site-name -a my-api-key`
  ]

  static flags = {
    help: flags.help({ char: 'h' }),
    apiKey: flags.string({
      char: 'a',
      description: 'Your Linc site API key',
      env: "LINC_API_KEY",
      required: false,
    }),
  }

  static args = [
    {
      name: 'sitename',
      required: false,
    },
  ]

  async run() {
    const { args, flags } = this.parse(LincFabUpload)

    const gitDirty: null | boolean = isGitDirty()

    if (gitDirty === null) {
      error("Error: No git repository detected. Please verify fab-upload is running inside of a git repository.")
      throw new Error("Not a git directory")
    }

    if (gitDirty === true) {
      note("Warning: Uncommitted changes detected! Continuing in 5s...")
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    const LINC_SITE_NAME = args.sitename || process.env.LINC_SITE_NAME
    const LINC_API_KEY = flags.apiKey || process.env.LINC_API_KEY

    if (LINC_SITE_NAME) {
      if (LINC_API_KEY) {

        // generate FAB
        log("Executing build:fab script")
        const buildInfo = await generateFab()

        const buildPassed = buildInfo.status === BuildStatus.SUCCESS
        if (buildPassed) {
          log("FAB compile complete")
          const fabExists = doesFileExist(FAB_FILE_PATH)
          if (fabExists) {
            // Get signed url
            const bundle_id = checksumFile(FAB_FILE_PATH)
            log("Validating FAB with Linc")
            const srResponse = await getSignedRequest({
              api_key: LINC_API_KEY,
              sitename: LINC_SITE_NAME, bundle_id
            })

            if (srResponse.ok) {
              const { unique_bundle } = srResponse
              const bundle_info = {
                bundle_id,
                unique_bundle
              }
              if (unique_bundle === true) {
                log("Unique FAB detected!")
                await handleUniqueBundle(srResponse.signed_request, LINC_SITE_NAME, LINC_API_KEY, bundle_info, buildInfo)
              }
              if (unique_bundle === false) {
                log("Duplicate FAB detected")
                await handleDuplicateBundle(LINC_SITE_NAME, LINC_API_KEY, bundle_info, buildInfo)
              }
            } else {
              handleServerError(srResponse.error)
            }
          } else {
            error(`Error: Unable to locate FAB at specified file path`)
            throw new Error('Environment vars errors.')
          }
        } else {
          await handleBuildFailure(LINC_SITE_NAME, LINC_API_KEY, buildInfo)
        }
      } else {
        error(`Error: Missing API key.
        You can pass your API key to fab-upload by assigning it to the environment variable 'LINC_API_KEY' or via the flag '--apiKey' or '-a'. 
        For information on generating a Linc API key, visit the fab-upload docs: https://github.com/bitgenics/fab-upload-cli/blob/master/README.md`)
        throw new Error('Missing sitename error.')
      }
    } else {
      error(`Error: Missing [SITENAME]. 
        You can pass your sitename to fab-upload as an argument or by assigning it to the environment variable 'LINC_SITE_NAME'.`)
      throw new Error('Missing sitename error.')
    }
  }
}

export = LincFabUpload
