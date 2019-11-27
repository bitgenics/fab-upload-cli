// A list of supported CI platforms
enum PLATFORMS {
  TRAVIS = "travis",
  BUILDKITE = "buildkite",
  CIRCLECI = "circleci"
}

/* 
  Returns the name of the current CI platform 
*/
export const getCI = () => {
  const { TRAVIS, BUILDKITE, CIRCLECI } = process.env
  if (TRAVIS) {
    return PLATFORMS.TRAVIS
  }
  if (BUILDKITE) {
    return PLATFORMS.BUILDKITE
  }
  if (CIRCLECI) {
    return PLATFORMS.CIRCLECI
  }
  return "unknown"
}

/* 
  Returns the current git branch for a provided CI platform name.
*/
export const getBranch = (platform: string) => {
  const { TRAVIS_BRANCH, BUILDKITE_BRANCH, CIRCLE_BRANCH } = process.env

  switch (platform) {
    case PLATFORMS.TRAVIS:
      return TRAVIS_BRANCH // note: this can evaulate to undefined....

    case PLATFORMS.BUILDKITE:
      return BUILDKITE_BRANCH

    case PLATFORMS.CIRCLECI:
      return CIRCLE_BRANCH

    default:
      return "unkown-branch"
  }
}

/* 
  Returns the current git repo for a provided CI platform name.
*/
export const getRepo = (platform: string) => {
  const {
    TRAVIS_REPO_SLUG,
    BUILDKITE_REPO,
    CIRCLE_PROJECT_REPONAME
  } = process.env

  switch (platform) {
    case PLATFORMS.TRAVIS:
      return TRAVIS_REPO_SLUG

    case PLATFORMS.BUILDKITE:
      return BUILDKITE_REPO

    case PLATFORMS.CIRCLECI:
      return CIRCLE_PROJECT_REPONAME

    default:
      return "unknown-repo"
  }
}