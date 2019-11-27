import * as fs from "fs"
import * as crypto from "crypto"
import { getLastCommit } from "./git"
import { getCI, getBranch, getRepo } from "./environmentVariableUtils"
import { CommitMetadata } from "../types"
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


export const getGitMetaData = async () => {
  const platform = getCI()
  console.log({ platform })

  const supportedPlatform = platform !== "unknown"
  console.log({ supportedPlatform })

  if (supportedPlatform) {
    // pull branch & repo from environment variables
    // using provided CI platform
    const branch = getBranch(platform)
    const repository = getRepo(platform)

    const lastCommit = await getLastCommit()
    const commitMetadata: CommitMetadata = {
      ...lastCommit,
      branch,
      repository
    }

    console.log({ commitMetadata })
    return commitMetadata
  } else {
    note("Note: Unsupported CI platform detected")
    // fallback
    const lastCommit = await getLastCommit()
    return {
      ...lastCommit,
      branch: "unknown-branch",
      repository: "unkown-repository"
    }
  }
}