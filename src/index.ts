import { Command, flags } from '@oclif/command'
import { log, error } from "./utils/log"
import { doesFileExist, checksumFile } from "./utils"
import getSignedRequest from "./utils/getSignedRequest"
import generateFab from './utils/generateFab'
import { BuildStatus, StatusTextOptions } from "./enums"
import handleDuplicateBundle from "./handlers/handleDuplicateBundle"
import handleUniqueBundle from "./handlers/handleUniqueBundle"

const { SITENAME, API_KEY } = process.env
const FAB_FILE_PATH = "./fab.zip"

const {
  DUPLICATE_BUNDLE,
  NOT_AUTHORIZED,
  SERVER_ERROR,
  OK,
} = StatusTextOptions

class LincFabUpload extends Command {
  static description = 'describe the command here'
  static flags = {
    help: flags.help({ char: 'h' }),
  }

  async run() {
    if (SITENAME && API_KEY) {
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
          const srResponse = await getSignedRequest({ api_key: API_KEY, sitename: SITENAME, bundle_id })

          switch (srResponse.statusText) {
            case OK:
              log("Unique FAB detected!")
              await handleUniqueBundle(srResponse.signedRequest, SITENAME, API_KEY, bundle_id, buildInfo)
              break

            case DUPLICATE_BUNDLE:
              log("Duplicate FAB detected")
              await handleDuplicateBundle(SITENAME, API_KEY, buildInfo)
              break

            case NOT_AUTHORIZED:
              error(`Error: Not authorized. Please verify your SITENAME and API_KEY.`)
              throw new Error('Authorization error.')

            case SERVER_ERROR:
              error(`Error: An error occured while attempting to upload FAB. Please try again later.`)
              throw new Error('FAB upload error.')
          }

        } else {
          error(`Error: Unable to locate FAB at specified file path`)
          throw new Error('Environment vars errors.')
        }
      }
    } else {
      error(`Error: Missing SITENAME & API_KEY environment variables`)
      throw new Error('Environment vars errors.')
    }
  }
}

export = LincFabUpload
