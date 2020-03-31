// A list of supported CI platforms
enum PLATFORMS {
  TRAVIS = "travis",
  BUILDKITE = "buildkite",
  CIRCLECI = "circleci",
  GITLAB = "gitlab",
  BAMBOO = "bamboo",
  BITBUCKET = "bitbucket"
}

/* 
  Returns the name of the current CI platform 
*/
export const getCI = () => {
  const { TRAVIS, BUILDKITE, CIRCLECI, GITLAB_CI } = process.env

  if (TRAVIS) {
    return PLATFORMS.TRAVIS
  }
  if (BUILDKITE) {
    return PLATFORMS.BUILDKITE
  }
  if (CIRCLECI) {
    return PLATFORMS.CIRCLECI
  }
  if (GITLAB_CI) {
    return PLATFORMS.GITLAB
  }

  // BAMBOO
  if (process.env.bamboo_planKey) {
    return PLATFORMS.BAMBOO
  }

  // BITBUCKET PIPELINES
  if (process.env.BITBUCKET_BUILD_NUMBER) {
    return PLATFORMS.BITBUCKET
  }

  return "unknown"
}

/* 
  Returns the current git branch for a provided CI platform name.
*/
export const getBranch = (platform: string) => {
  const FALLBACK = "unknown-branch"

  switch (platform) {
    case PLATFORMS.TRAVIS:
      const { TRAVIS_BRANCH } = process.env
      return TRAVIS_BRANCH || FALLBACK

    case PLATFORMS.BUILDKITE:
      const { BUILDKITE_BRANCH } = process.env
      return BUILDKITE_BRANCH || FALLBACK

    case PLATFORMS.CIRCLECI:
      const { CIRCLE_BRANCH } = process.env
      return CIRCLE_BRANCH || FALLBACK

    case PLATFORMS.GITLAB:
      const { CI_COMMIT_BRANCH } = process.env
      return CI_COMMIT_BRANCH || FALLBACK

    case PLATFORMS.BAMBOO:
      const { bamboo_planRepository_branch } = process.env
      return bamboo_planRepository_branch || FALLBACK

    case PLATFORMS.BITBUCKET:
      const { BITBUCKET_BRANCH } = process.env
      return BITBUCKET_BRANCH || FALLBACK

    default:
      return FALLBACK
  }
}

/* 
  Returns the current git repo for a provided CI platform name.
*/
export const getRepo = (platform: string) => {
  const FALLBACK = "unknown-repo"

  switch (platform) {
    case PLATFORMS.TRAVIS:
      const { TRAVIS_REPO_SLUG } = process.env
      return TRAVIS_REPO_SLUG || FALLBACK

    case PLATFORMS.BUILDKITE:
      const { BUILDKITE_REPO } = process.env
      return BUILDKITE_REPO || FALLBACK

    case PLATFORMS.CIRCLECI:
      const { CIRCLE_PROJECT_REPONAME } = process.env
      return CIRCLE_PROJECT_REPONAME || FALLBACK

    case PLATFORMS.GITLAB:
      const { CI_PROJECT_PATH } = process.env
      return CI_PROJECT_PATH || FALLBACK

    case PLATFORMS.BAMBOO:
      const repoUrl = process.env.bamboo_planRepository_repositoryUrl
      if (repoUrl) {
        const regex = /([^\/])*\/([^\/]*)\/?$/;
        const [repo] = repoUrl.match(regex) || "";
        if (repo && repo.length > 0) {
          return repo
        }
      }

    case PLATFORMS.BITBUCKET:
      const { BITBUCKET_REPO_FULL_NAME } = process.env
      return BITBUCKET_REPO_FULL_NAME || FALLBACK

    default:
      return FALLBACK
  }
}