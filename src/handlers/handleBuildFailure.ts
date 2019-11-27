import { getGitData } from "../utils/git"
import { log } from "../utils/log"
import uploadMetadata from "../utils/uploadMetadata"
import handleServerError from "./handleServerError"
import { CommitMetadata, BuildInfo } from "../types"

const handleBuildFailure = async (sitename: string, api_key: string, build_info: BuildInfo) => {
  log("Uploading Build record to Linc")
  const gitMetaData: CommitMetadata = await getGitData()

  log("Uploading commit data to Linc")
  const response = await uploadMetadata({
    sitename,
    api_key,
    commit_info: gitMetaData,
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

