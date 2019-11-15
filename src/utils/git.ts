const util = require('util')
const exec = util.promisify(require('child_process').exec)

export const getCurrentBranch = async () => {
  const { stdout, stderr } = await exec("git symbolic-ref --short HEAD")
  if (stdout) {
    return stdout.replace(/(\r\n|\n|\r)/gm, "");
  } else {
    throw new Error(stderr)
  }
}

export const getRepository = async () => {
  const { stdout, stderr } = await exec("git ls-remote --get-url");
  if (stdout) {
    return stdout.split("git@github.com:")[1].split(".git")[0];
  } else {
    throw new Error(stderr);
  }
};

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

export const getLastCommit = async () => {
  const command = `${gitCommand}`
  const { stdout, stderr } = await exec(command)
  if (stdout) {
    const commit = JSON.parse(stdout)
    commit.committerDate = parseInt(commit.committerDate) // parse unix time stamp to Int
    return commit
  } else {
    throw new Error(stderr)
  }
}
