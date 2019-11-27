import { CommitMetadata, BuildInfo, BundleInfo } from "../types"
import { logUrls, composeLincCommitPageUrl } from "../utils"
import { getGitData } from "../utils/git"
import { log } from "../utils/log"
import uploadMetadata from "../utils/uploadMetadata"

import handleServerError from "./handleServerError"

const duplicateBundle = async (sitename: string, api_key: string, bundle_info: BundleInfo, buildInfo: BuildInfo) => {
  const gitMetaData: CommitMetadata = await getGitData()
  const response = await uploadMetadata({
    sitename,
    api_key,
    bundle_info,
    commit_info: gitMetaData,
    build_info: buildInfo,
  })
  console.log({ response })
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