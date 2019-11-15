const util = require("util");
const { BuildStatus } = require("../enums")

const exec = util.promisify(require("child_process").exec);

const DEV_COMMAND = "cd ~/Work/linc-front-end && yarn build:fab";
const PROD_COMMAND = "yarn build:fab";

const generateFab = async () => {
  const started_at = Date.now()
  try {
    const { stdout } = await exec(DEV_COMMAND);
    return {
      started_at,
      finished_at: Date.now(),
      status: BuildStatus.SUCCESS,
      log: stdout,
    };
  } catch (e) {
    const { stdout, stderr } = e;
    return {
      started_at,
      finished_at: Date.now(),
      status: BuildStatus.FAILED,
      log: `${stdout}${stderr}`,
    }
  }
};

export default generateFab