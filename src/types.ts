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

export type BuildInfo = {
  status: BuildStatus,
  log: string
}