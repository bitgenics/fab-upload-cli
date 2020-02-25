const util = require("util");
const exec = util.promisify(require("child_process").exec);

const executeCommand = async (command: string) => {
  const { stdout, stderr } = await exec(command);
  if (stdout) {
    return stdout;
  } else {
    throw new Error(stderr);
  }
};

export const getRepository = async () => {
  const command = "git ls-remote --get-url"
  const response = await executeCommand(command)
  return response.split("git@github.com:")[1].split(".git")[0]
};

const gitLog = (logCount: number, format: any) =>
  `git log -${logCount} --pretty=format:'${format}'`;

const getMainMetadata = async () => {
  const format = JSON.stringify({
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

const getSubject = async () => {
  const subject = "%s"; // commit message
  const command = gitLog(1, subject);
  const response = await executeCommand(command);
  return response;
};

const getAuthor = async () => {
  const author = "%an"; // commit author
  const command = gitLog(1, author);
  const response = await executeCommand(command);
  return response;
};

export const getLastCommit = async () => {
  const [commit, subject, authorName] = await Promise.all([
    getMainMetadata(),
    getSubject(),
    getAuthor()
  ]);
  return {
    ...commit,
    subject,
    authorName
  };
};
