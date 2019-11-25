import fetch from "node-fetch"

const PROD_ENDPOINT = "https://graphql.linc.sh/fab_upload/signed_request"
const DEV_ENDPOINT = "http://localhost:3001/fab_upload/signed_request"

type signedRequestPayload = {
  sitename: string,
  api_key: string,
  bundle_id: string
}

const getSignedRequest = async (data: signedRequestPayload) => {
  const response = await fetch(PROD_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    redirect: "follow",
    body: JSON.stringify(data)
  })
  return await response.json()
}

export default getSignedRequest