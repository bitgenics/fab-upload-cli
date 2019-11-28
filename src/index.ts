import { Command, flags } from '@oclif/command'
import { log, error } from "./utils/log"
import { doesFileExist, checksumFile } from "./utils"
import getSignedRequest from "./utils/getSignedRequest"
import generateFab from './utils/generateFab'
import { BuildStatus } from "./enums"

import handleServerError from "./handlers/handleServerError"
import handleDuplicateBundle from "./handlers/handleDuplicateBundle"
import handleUniqueBundle from "./handlers/handleUniqueBundle"
import handleBuildFailure from "./handlers/handleBuildFailure"

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
    const { LINC_SITE_NAME, LINC_API_KEY } = process.env
    if (LINC_SITE_NAME && LINC_API_KEY) {
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
          const srResponse = await getSignedRequest({ api_key: LINC_API_KEY, sitename: LINC_SITE_NAME, bundle_id })

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
      error(`Error: Missing LINC_SITE_NAME & LINC_API_KEY environment variables`)
      throw new Error('Environment vars errors.')
    }
  }
}

export = LincFabUpload
