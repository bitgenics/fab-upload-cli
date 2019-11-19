import { logUrls } from "../utils"
import { getGitData } from "../utils/git"
import { log, error } from "../utils/log"

import uploadMetadata from "../utils/uploadMetadata"
import uploadBundleToS3 from "../utils/uploadBundleToS3"

import { CommitMetadata, BuildInfo } from "../types"
import { StatusTextOptions } from "../enums"

const {
  OK,
  NOT_AUTHORIZED,
  SERVER_ERROR,
} = StatusTextOptions

const handleUniqueBundle = async (signedRequest: string, sitename: string, api_key: string, bundle_id: string, build_info: BuildInfo) => {
  log("Uploading FAB to Linc")
  const s3Response = await uploadBundleToS3(signedRequest, "./fab.zip")

  if (s3Response.statusText === "OK") {
    log("FAB successfully uploaded!")

    log("Gathering commit data")
    const gitMetaData: CommitMetadata = await getGitData()

    log("Uploading commit data to Linc")
    const response = await uploadMetadata({
      sitename,
      api_key,
      bundle_id,
      commit_info: gitMetaData,
      build_info,
    })

    if (response.statusText === OK) {
      log("Done!")
      log("FAB preview URLs:")
      logUrls(response.urls)
    }

    if (response.statusText === NOT_AUTHORIZED) {
      error(`Error: Not authorized. Please verify your SITENAME and API_KEY.`)
      throw new Error('Authorization error.')
    }

    if (response.statusText === SERVER_ERROR) {
      error(`Error: An error occured while attempting to upload FAB. Please try again later.`)
      throw new Error('FAB upload error.')
    }
  } else {
    error(`Error: An error occured while attempting to upload FAB to Linc. Please try again later.`)
    throw new Error('FAB upload error.')
  }
}

export default handleUniqueBundle