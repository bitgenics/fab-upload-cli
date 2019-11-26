import { BuildStatus } from "./enums"

export type CommitMetadata = {
  commitHash: string,
  treeHash: string,
  authorName: string,
  committerDate: number,
  committerEmail: string,
  subject: string,
  branch: string,
  repository: string,
}

type BuildLogType = {
  cmd: string,
  log: string
}

export type BuildInfo = {
  status: BuildStatus,
  logs: Array<BuildLogType>
}

export type BundleInfo = {
  unique_bundle: boolean,
  bundle_id: string
}