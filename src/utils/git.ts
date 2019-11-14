const util = require('util')
const exec = util.promisify(require('child_process').exec)

const prettyFormats = {
  commitHash: '%H',
  treeHash: '%T',
  authorName: '%an',
  committerDate: '%ct', // unix time stamp
  committerEmail: '%ce',
  subject: '%s', // commit message
}

const numberOfLogs = 1
const stringifyedFormats = JSON.stringify(prettyFormats)
const gitCommand = `git log -${numberOfLogs} --pretty=format:'${stringifyedFormats}'`

export const getLastCommit = async (pathToRepository: string) => {
  const command = `cd ${pathToRepository} && ${gitCommand}`
  const { stdout, stderr } = await exec(command)
  if (stdout) {
    const commit = JSON.parse(stdout)
    commit.committerDate = parseInt(commit.committerDate) // parse unix time stamp to Int
    return commit
  }
  if (stderr) {
    throw new Error(stderr)
  }
}
