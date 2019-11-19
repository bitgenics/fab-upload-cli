import uploadMetadata from "../utils/uploadMetadata"
import { getGitData } from "../utils/git"
import { logUrls } from "../utils"
import { CommitMetadata, BuildInfo } from "../types"

const duplicateBundle = async (sitename: string, api_key: string, buildInfo: BuildInfo) => {
  const gitMetaData: CommitMetadata = await getGitData()
  const response = await uploadMetadata({
    sitename,
    api_key,
    commit_info: gitMetaData,
    build_info: buildInfo,
  })
  logUrls(response.urls)
}

export default duplicateBundle