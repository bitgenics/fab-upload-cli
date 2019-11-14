import { Command, flags } from '@oclif/command'
import { error } from "./utils/log"
import checksumFile from "./utils/checksumFile"
import { getLastCommit } from "./utils/git"
import fabUpload from "./utils/fabUpload"
import generateFab from './utils/generateFab'
import uploadBundleToS3 from "./utils/uploadBundleToS3"

const repositoryFilePath = "~/Work/linc-front-end"
const fabFilePath = "../fab.zip"

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
    const { args, flags } = this.parse(LincFabUpload)
    const { sitename, api_key } = args
    const commit = await getLastCommit(repositoryFilePath)
    const buildInfo = await generateFab()
    if (buildInfo.status === "success") {
      const bundle_id = checksumFile(fabFilePath)
      if (bundle_id) {
        if (commit) {
          // post to "/fab_uplaod"
          const response = await fabUpload({
            api_key, sitename, commit, buildInfo, bundle_id
          })
          // use returned signedRequest to upload FAB to S3
          if (response.s3 && response.s3.signedRequest) {
            const { signedRequest } = response.s3
            await uploadBundleToS3(signedRequest, "../fab.zip")
            console.log(response.previewUrls)
          }
        }
      }
    } else {
      throw new Error("Build failed")
    }
  }
}

export = LincFabUpload
