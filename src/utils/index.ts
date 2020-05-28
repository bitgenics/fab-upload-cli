import * as fs from "fs"
import * as crypto from "crypto"
import { CommitInfo } from "../types"

import { getCIPlatform, getBranchFromPlatform, getRepoFromPlatform } from "./envVarUtils"
import { getLastCommit, getBranchFromGit, getRepositoryFromGit } from "./git"
import { note } from "./log"

export const doesFileExist = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      return true
    }
  } catch (err) {
    // console.error(err)
    return false
  }
}

export const checksumFile = (filePath: string) => {
  const data = fs.readFileSync(filePath)
  return crypto
    .createHash('md5')
    .update(data)
    .digest('hex')
}

export const logUrls = (urls: Array<string>) => urls.forEach(url => console.log(url));

export const composeLincCommitPageUrl = (
  sitename: string,
  commitHash: string
) => console.log(`https://app.linc.sh/sites/${sitename}/commit/${commitHash}`)


export const getCommitInfo = async (): Promise<CommitInfo> => {
  const platform = getCIPlatform()
  const supportedPlatform = platform !== "unknown"
  if (supportedPlatform) {
    // pull branch & repo from environment variables
    // using provided CI platform
    const lastCommit = await getLastCommit()
    const branch = getBranchFromPlatform(platform)
    const repository = getRepoFromPlatform(platform)
    const commitInfo = {
      ...lastCommit,
      branch,
      repository
    }
    return commitInfo
  } else {
    note("Note: Unsupported CI platform detected")
    const lastCommit = await getLastCommit()
    const branch = await getBranchFromGit()
    const repository = await getRepositoryFromGit()
    return {
      ...lastCommit,
      branch,
      repository,
    }
  }
}