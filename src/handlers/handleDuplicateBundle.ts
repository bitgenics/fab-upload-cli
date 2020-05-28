import handleServerError from "./handleServerError"

import { CommitInfo, BuildInfo, BundleInfo } from "../types"

import { logUrls, composeLincCommitPageUrl } from "../utils"
import { uploadMetadata } from "../utils/requests"
import { getCommitInfo } from "../utils"
import { log } from "../utils/log"

const duplicateBundle = async (
  sitename: string,
  api_key: string,
  bundle_info: BundleInfo,
  buildInfo: BuildInfo
) => {
  log("Gathering commit data")
  const commitInfo: CommitInfo = await getCommitInfo()

  log("Uploading commit data to Linc")
  const response = await uploadMetadata({
    sitename,
    api_key,
    bundle_info,
    commit_info: commitInfo,
    build_info: buildInfo,
  })

  if (response.ok) {
    log("Done!")
    const { preview_urls } = response
    if (preview_urls) {
      log("FAB preview URLs:")
      logUrls(response.preview_urls)
      log("View commit on Linc:")
      composeLincCommitPageUrl(sitename, commitInfo.commitHash)
    }
  } else {
    handleServerError(response.error)
  }
}

export default duplicateBundle