import * as fs from 'fs'
import fetch from "node-fetch"

const uploadBundleToS3 = async (signedRequest: string, pathToFab: string) => {
  const response = await fetch(signedRequest, {
    method: "PUT",
    headers: {
      "Content-Type": "application/octet-stream",
    },
    body: fs.readFileSync(pathToFab)
  })
  return response
}

export default uploadBundleToS3 