import { Command, flags } from '@oclif/command'
import { error } from "./utils/log"
import { doesFileExist, checksumFile } from "./utils"
import getSignedRequest from "./utils/getSignedRequest"
import generateFab from './utils/generateFab'
import { BuildStatus, SignedReqStatusText } from "./enums"
import uploadBundleToS3 from "./utils/uploadBundleToS3"
import uploadMetadata from "./utils/uploadMetadata"
import { getGitData } from "./utils/git"
import { CommitMetadata } from "./types"

const logUrls = (urls) => array.forEach(url => console.log(url));

const FAB_FILE_PATH = "../fab.zip"

class LincFabUpload extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({ char: 'h' }),
    config: flags.string({
      char: 'c',
      description: 'Path to config file',
      default: 'fab.config.json'
    }),
  }

  static args = [{
    name: 'sitename',
    required: true,
    description: 'name of Linc site',
  }, {
    name: 'api_key',
    required: true,
    description: 'Linc API key',
  }]

  async run() {
    const { args } = this.parse(LincFabUpload)
    const { sitename, api_key } = args

    // generate FAB
    const buildInfo = await generateFab()

    const buildPassed = buildInfo.status === BuildStatus.SUCCESS
    if (buildPassed) {
      const fabExists = doesFileExist(FAB_FILE_PATH)
      if (fabExists) {
        // Get signed url
        const bundle_id = checksumFile(FAB_FILE_PATH)
        const signedRequestResponse = await getSignedRequest({ api_key, sitename, bundle_id })
        const { statusText } = signedRequestResponse
        const {
          NOT_AUTHORIZED,
          SERVER_ERROR,
          BUNDLE_UNIQUE,
          BUNDLE_EXISTS
        } = SignedReqStatusText

        // handle api repsonse
        switch (statusText) {
          case statusText === NOT_AUTHORIZED:
            error(`Error: Not authorized. Please verify your sitename and API key.`)
            throw new Error('Authorization error.')

          case statusText === SERVER_ERROR:
            error(`Error: An error occured while attempting to upload FAB. Please try again later.`)
            throw new Error('FAB upload error.')

          case statusText === BUNDLE_UNIQUE:
            const s3Response = await uploadBundleToS3(signedRequestResponse.signedRequest, "../fab.zip")
            if (s3Response.statusText === "OK") {
              const gitMetaData: CommitMetadata = await getGitData()
              const response = await uploadMetadata({
                sitename,
                api_key,
                bundle_id,
                commit_info: gitMetaData,
                build_info: buildInfo,
              })
              logUrls(response.urls)
            } else {
              error(`Error: An error occured while attempting to upload FAB. Please try again later.`)
              throw new Error('FAB upload error.')
            }
            break

          case statusText === BUNDLE_EXISTS:
            const gitMetaData: CommitMetadata = await getGitData()
            const response = await uploadMetadata({
              sitename,
              api_key,
              commit_info: gitMetaData,
              build_info: buildInfo,
            })
            logUrls(response.urls)
            break
        }
      }
    }
  }
}

export = LincFabUpload
