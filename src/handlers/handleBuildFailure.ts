import { getCommitInfo } from "../utils"
import { log } from "../utils/log"
import { uploadMetadata } from "../utils/requests"
import handleServerError from "./handleServerError"
import { CommitInfo, BuildInfo } from "../types"

const handleBuildFailure = async (sitename: string, api_key: string, build_info: BuildInfo) => {
  log("Gathering commit data")
  const commitInfo: CommitInfo = await getCommitInfo()

  log("Uploading commit data to Linc")
  const response = await uploadMetadata({
    sitename,
    api_key,
    commit_info: commitInfo,
    build_info,
  })

  if (response.ok) {
    log("Done!")
    process.exit(1)
  } else {
    handleServerError(response.error)
  }
}

export default handleBuildFailure

