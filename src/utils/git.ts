import { promisify } from "util"
import child_process from "child_process"

import { note } from "./log"

const exec = promisify(child_process.exec);

const executeCommand = async (command: string) => {
  const { stdout, stderr } = await exec(command);
  if (stdout) {
    return stdout;
  } else {
    throw new Error(stderr);
  }
};

export const getRepositoryFromGit = async () => {
  const fallback = "unkown-repo"
  const command = "git ls-remote --get-url"
  try {
    const { stdout } = await exec(command)
    if (stdout.includes(":") && stdout.includes(".git")) {
      return stdout.split(":")[1].split(".git")[0]
    } else {
      note("Unable to retrieve repository name via git")
      return fallback
    }
  } catch (e) {
    note("Unable to retrieve repository name via git")
    return fallback
  }
};

export const getBranchFromGit = async () => {
  const command = `git rev-parse --abbrev-ref HEAD`;
  try {
    const response = await exec(command);
    const { stdout } = response;
    return stdout.trim();
  } catch (e) {
    note("Unable to retrieve branch via git");
    return "unknown-branch";
  }
};

export const gitLog = (logCount: number, format: string) =>
  `git log -${logCount} --pretty=format:'${format}'`;

type LastCommit = {
  subject: string
  authorName: string
  commitHash: string
  treeHash: string
  committerDate: number
  committerEmail: string
}
export const getLastCommit = async (): Promise<LastCommit> => {
  const format = JSON.stringify({
    subject: "%s",
    authorName: "%an",
    commitHash: "%H",
    treeHash: "%T",
    committerDate: "%ct", // unix time stamp
    committerEmail: "%ce"
  });
  const command = gitLog(1, format);
  const response = await executeCommand(command);
  const metadata = JSON.parse(response);
  metadata.committerDate = parseInt(metadata.committerDate) * 1000; // unix time stamp in milliseconds
  return metadata;
};
