import { error } from "../utils/log"
import { Errors } from "../enums"

const {
  NOT_AUTHED,
  FATAL_ERROR,
  INVALID_SITE_NAME,
  INVALID_ARGUMENTS,
} = Errors

const handleError = (errorCode: string) => {
  switch (errorCode) {
    case NOT_AUTHED:
      error(`Error: Not authorized. Please verify your api token.`)
      throw new Error('Authorization error.')

    case FATAL_ERROR:
      error(`Error: An error occured while attempting to upload FAB. Please try again later.`)
      throw new Error('FAB upload error.')

    case INVALID_SITE_NAME:
      error(`Error: Invalid sitename. Please verify the provided sitename.`)
      throw new Error('Invalid sitename error.')

    case INVALID_ARGUMENTS:
      error(`Error: Invalid arguments.`)
      throw new Error('Invalid arguments error.')

    default:
      break;
  }
}

export default handleError