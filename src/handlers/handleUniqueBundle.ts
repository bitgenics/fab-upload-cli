import { logUrls, composeLincCommitPageUrl } from "../utils"
import { getGitData } from "../utils/git"
import { log, error } from "../utils/log"

import uploadMetadata from "../utils/uploadMetadata"
import uploadBundleToS3 from "../utils/uploadBundleToS3"

import handleServerError from "./handleServerError"

import { CommitMetadata, BuildInfo, BundleInfo } from "../types"

const handleUniqueBundle = async (
  signedRequest: string,
  sitename: string,
  api_key: string,
  bundle_info: BundleInfo,
  build_info: BuildInfo
) => {
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
      bundle_info,
      commit_info: gitMetaData,
      build_info,
    })

    if (response.ok) {
      log("Done!")
      const { preview_urls } = response
      if (preview_urls) {
        log("FAB preview URLs:")
        logUrls(response.preview_urls)
        log("View commit on Linc:")
        composeLincCommitPageUrl(sitename, gitMetaData.commitHash)
      }
    } else {
      handleServerError(response.error)
    }
  } else {
    error(`Error: An error occured while attempting to upload FAB to Linc. Please try again later.`)
    throw new Error('FAB upload error.')
  }
}

export default handleUniqueBundle