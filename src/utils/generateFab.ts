const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { BuildStatus } = require('../types')

const DEV_COMMAND = "cd ~/Work/linc-front-end && yarn build:fab";
const PROD_COMMAND = "yarn build:fab";

const generateFab = async () => {
  try {
    const { stdout } = await exec(DEV_COMMAND);
    return {
      log: stdout,
      status: "success"
    };
  } catch (e) {
    const { stdout, stderr } = e;
    return {
      log: `${stdout}${stderr}`,
      status: "failed"
    }
  }
};

export default generateFab