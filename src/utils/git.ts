import { promisify } from "util"
import child_process from "child_process"

import { note } from "./log"
import { objectFromEntries, zip } from "./collections"

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

const formatSeparator = "##FAB_UPLOAD_SEP##";

export const gitLog = async <K extends string>(
  logCount: number,
  format: { [key in K]: string },
): Promise<{ [key in K]: string }[]> => {
  const keys = Object.keys(format) as K[];
  const formatString = keys.map((key) => format[key]).join(formatSeparator);
  const gitLogOutput = await executeCommand(
    `git log -${logCount} --pretty=format:'${formatString}'`
  );
  return gitLogOutput.split("\n").map((gitLogEntry) => {
    const values = gitLogEntry.split(formatSeparator);
    return objectFromEntries(zip(keys, values));
  });
};

type LastCommit = {
  subject: string
  authorName: string
  commitHash: string
  treeHash: string
  committerDate: number
  committerEmail: string
}

export const getLastCommit = async (): Promise<LastCommit> => {
  const [gitLogData] = await gitLog(1, {
    subject: "%s",
    authorName: "%an",
    commitHash: "%H",
    treeHash: "%T",
    committerDate: "%ct", // unix time stamp
    committerEmail: "%ce"
  });
  const metadataLastCommit: LastCommit = {
    ...gitLogData,
    committerDate: parseInt(gitLogData.committerDate) * 1000, // unix time stamp in milliseconds
  };
  return metadataLastCommit;
};
