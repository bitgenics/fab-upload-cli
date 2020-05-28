import fetch from "node-fetch"
import * as fs from 'fs'

import { CommitInfo, BuildInfo, BundleInfo } from "../types"

const SIGNED_REQUEST_ENDPONT = "https://graphql.linc.sh/fab_upload/signed_request"
const UPLOAD_METADATA_ENDPONT = "https://graphql.linc.sh/fab_upload/upload_metadata"

type signedRequestPayload = {
  sitename: string,
  api_key: string,
  bundle_id: string
}

type MetadataPayload = {
  sitename: string,
  api_key: string,
  bundle_info?: BundleInfo,
  commit_info: CommitInfo,
  build_info: BuildInfo,
}

export const getSignedRequest = async (data: signedRequestPayload) => {
  const response = await fetch(SIGNED_REQUEST_ENDPONT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  return await response.json()
}

export const uploadBundleToS3 = async (signedRequest: string, pathToFab: string) => {
  const response = await fetch(signedRequest, {
    method: "PUT",
    headers: {
      "Content-Type": "application/octet-stream",
    },
    body: fs.readFileSync(pathToFab)
  })
  return response
}

export const uploadMetadata = async (metadataPayload: MetadataPayload) => {
  const response = await fetch(UPLOAD_METADATA_ENDPONT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(metadataPayload)
  })
  return await response.json()
}


