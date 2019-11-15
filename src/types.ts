import { BuildStatus } from "./enums"

export type Commit = {
  commitHash: string,
  treeHash: string,
  authorName: string,
  committerDate: number,
  committerEmail: string,
  subject: string
}

export type BuildInfo = {
  status: BuildStatus,
  log: string
}