import { promisify } from "util";
import child_process from "child_process"

import clipBuildLog from './clipBuildLog'
import { BuildStatus } from "../enums"

const exec = promisify(child_process.exec);

export default async function generateFab() {
  const started_at = Date.now()
  try {
    const { stdout } = await exec("npm run build:fab");
    console.log(stdout)
    return {
      started_at,
      finished_at: Date.now(),
      status: BuildStatus.SUCCESS,
      logs: [
        {
          cmd: "npm run build:fab",
          log: clipBuildLog(stdout, 30000)
        }
      ]
    }
  } catch (e) {
    const { stdout, stderr } = e
    console.log(stdout + stderr)
    return {
      started_at,
      finished_at: Date.now(),
      status: BuildStatus.FAILED,
      logs: [
        {
          cmd: "npm run build:fab",
          log: clipBuildLog(stdout + stderr, 30000)
        }
      ]
    }
  }
};
