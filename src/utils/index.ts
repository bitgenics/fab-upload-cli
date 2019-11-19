import * as fs from "fs"
import * as crypto from "crypto"

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