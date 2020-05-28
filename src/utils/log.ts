import { gray, red, yellow, green } from "chalk"

const PROJECT_NAME = `[fab-upload]`
const _log = (colour: (str: string) => string) => (str: string) =>
  console.log(
    `${gray(PROJECT_NAME)} ${colour(
      str.split(/\n\s*/).join(`\n${PROJECT_NAME.replace(/./g, ' ')} `)
    )}`
  )
export const log = _log(str => str)
export const note = _log(yellow)
export const good = _log(green)
export const error = _log(red)