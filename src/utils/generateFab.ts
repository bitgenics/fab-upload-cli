const util = require("util");
const { BuildStatus } = require("../enums")

const exec = util.promisify(require("child_process").exec);

const generateFab = async () => {
  const started_at = Date.now()
  try {
    const { stdout } = await exec("npm run build:fab");
    return {
      started_at,
      finished_at: Date.now(),
      status: BuildStatus.SUCCESS,
      logs: [
        {
          cmd: "npm run build:fab",
          log: stdout
        }
      ]
    }
  } catch (e) {
    const { stdout, stderr } = e
    return {
      started_at,
      finished_at: Date.now(),
      status: BuildStatus.FAILED,
      logs: [
        {
          cmd: "npm run build:fab",
          log: stdout + stderr
        }
      ]
    }
  }
};

export default generateFab