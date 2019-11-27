import { CommitMetadata, BuildInfo, BundleInfo } from "../types"
import { logUrls, composeLincCommitPageUrl } from "../utils"
import { getGitMetaData } from "../utils"
import { log } from "../utils/log"
import uploadMetadata from "../utils/uploadMetadata"

import handleServerError from "./handleServerError"

const duplicateBundle = async (sitename: string, api_key: string, bundle_info: BundleInfo, buildInfo: BuildInfo) => {
  log("Gathering commit data")
  const gitMetaData: CommitMetadata = await getGitMetaData()

  log("Uploading commit data to Linc")
  const response = await uploadMetadata({
    sitename,
    api_key,
    bundle_info,
    commit_info: gitMetaData,
    build_info: buildInfo,
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
}

export default duplicateBundle