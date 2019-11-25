import fetch from "node-fetch"
import { CommitMetadata, BuildInfo } from "../types"

const PROD_ENDPOINT = "https://graphql.linc.sh//fab_upload/upload_metadata"
const DEV_ENDPOINT = "http://localhost:3001/fab_upload/upload_metadata"

type MetadataPayload = {
  sitename: string,
  api_key: string,
  bundle_id?: string,
  commit_info: CommitMetadata,
  build_info: BuildInfo,
}

const uploadMetadata = async (metadataPayload: MetadataPayload) => {
  const response = await fetch(PROD_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    redirect: "follow",
    body: JSON.stringify(metadataPayload)
  })
  return await response.json()

}

export default uploadMetadata