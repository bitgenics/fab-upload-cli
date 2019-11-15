import { Command, flags } from '@oclif/command'
import { error } from "./utils/log"
import { doesFileExist, checksumFile } from "./utils"
import { getLastCommit, getRepository, getCurrentBranch } from "./utils/git"
import fabUpload from "./utils/fabUpload"
import generateFab from './utils/generateFab'
import uploadBundleToS3 from "./utils/uploadBundleToS3"
import { BuildStatus } from "./enums"

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
    const { args, flags } = this.parse(LincFabUpload)
    const { sitename, api_key } = args

    // gather commit metadata
    const commit = await getLastCommit()
    const branch = await getCurrentBranch()
    const repository = await getRepository()

    const buildInfo = await generateFab()

    const buildPassed = buildInfo.status === BuildStatus.SUCCESS
    if (buildPassed) {
      const fabExists = doesFileExist(FAB_FILE_PATH)
      if (fabExists) {
        // generate bundle_id
        const bundle_id = checksumFile(FAB_FILE_PATH)

        // post to "/fab_uplaod"
        const apiResponse = await fabUpload({
          api_key,
          sitename,
          branch,
          repository,
          commit,
          buildInfo,
          bundle_id
        })
        if (apiResponse.s3.success) {
          const s3Response = await uploadBundleToS3(apiResponse.s3.signedRequest, "../fab.zip")
          if (s3Response) { }
          console.log("Preview URLs:")
          apiResponse.previewUrls.forEach((url: string) => console.log(url));
        } else {
          error(`Error: Failed to upload bundle`)
          throw new Error('FAB upload error')
        }
      } else {
        error(`Error: No fab.zip found at provided path ${FAB_FILE_PATH}.`)
        throw new Error('Bad file path error')
      }
    } else {
      error(`Error: Build failed`)
      throw new Error("Build failed")
    }
  }
}

export = LincFabUpload
