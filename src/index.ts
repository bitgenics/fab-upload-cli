import { Command, flags } from '@oclif/command'
import { log, error } from "./utils/log"
import { doesFileExist, checksumFile } from "./utils"
import getSignedRequest from "./utils/getSignedRequest"
import generateFab from './utils/generateFab'
import { BuildStatus } from "./enums"
import handleServerError from "./handlers/handleServerError"
import handleDuplicateBundle from "./handlers/handleDuplicateBundle"
import handleUniqueBundle from "./handlers/handleUniqueBundle"

const FAB_FILE_PATH = "./fab.zip"

class LincFabUpload extends Command {
  static description = 'describe the command here'
  static flags = {
    help: flags.help({ char: 'h' }),
  }

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
            if (unique_bundle === true) {
              log("Unique FAB detected!")
              await handleUniqueBundle(srResponse.signed_request, LINC_SITE_NAME, LINC_API_KEY, bundle_id, buildInfo)
            }
            if (unique_bundle === false) {
              log("Duplicate FAB detected")
              await handleDuplicateBundle(LINC_SITE_NAME, LINC_API_KEY, buildInfo)
            }
          } else {
            console.log({ srResponse })
            handleServerError(srResponse.error)
          }
        } else {
          error(`Error: Unable to locate FAB at specified file path`)
          throw new Error('Environment vars errors.')
        }
      }
    } else {
      error(`Error: Missing LINC_SITE_NAME & LINC_API_KEY environment variables`)
      throw new Error('Environment vars errors.')
    }
  }
}

export = LincFabUpload
