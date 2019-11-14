import * as fs from "fs"
import * as crypto from "crypto"

const checksumFile = (filePath: string) => {
  const data = fs.readFileSync(filePath)
  return crypto
    .createHash('md5')
    .update(data)
    .digest('hex')
}

export default checksumFile