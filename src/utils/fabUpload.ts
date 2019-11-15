import fetch from "node-fetch"
import { Commit, BuildInfo } from "../types"

const FAB_UPLOAD_ENDPOINT = "https://graphql.linc.sh/fab-upload"
const DEV_ENDPOINT = "http://localhost:3001/fab_upload"

type FabUploadPayload = {
  buildInfo: BuildInfo,
  commit: Commit,
  bundle_id: string
  api_key: string,
  sitename: string,
  repository: string,
  branch: string
}

const fabUpload = async (obj: FabUploadPayload) => {
  const data = JSON.stringify(obj)
  const response = await fetch(DEV_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    redirect: "follow",
    body: data
  })
  const json = await response.json()
  return json
}

export default fabUpload