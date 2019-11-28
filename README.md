# fab-upload

Builds and uploads a FAB to [Linc](https://linc.sh/).

`fab-upload` let's you enjoy the benefits of Linc without having to give up your existing CI solution.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)&nbsp;
[![Version](https://img.shields.io/npm/v/@bitgenics/fab-upload-cli.svg)](https://npmjs.org/package/@bitgenics/fab-upload-cli)&nbsp;
[![License](https://img.shields.io/npm/l/@bitgenics/fab-upload-cli.svg)](https://github.com/bitgenics/fab-upload-cli/blob/master/package.json)&nbsp;

## Prerequisites

1. An existing [Linc](https://linc.sh/) account.
2. A frontend project configured to output a [FAB](https://fab.dev/).

## Getting started

Install `@bitgenics/fab-upload-cli` as a development dependency in your frontend project:

```bash
yarn add --dev @bitgenics/fab-upload-cli
npm install --dev @bitgenics/fab-upload-cli
```

Then add the following script to your `package.json`:

```diff
  {
    "scripts": {
      "build": "react-scripts build",
      "build:fab": "npm run fab-static build",
+     "fab-upload": "fab-upload"
    }
  }
```

## Usage

`@bitgenics/fab-upload-cli` takes the following options:

```
USAGE
  $ fab-upload [SITENAME]

OPTIONS
  -a, --apiKey=apiKey  Your Linc site API key
  -h, --help           show CLI help

EXAMPLES
  $ fab-upload my-site-name
```

When `fab-upload` is run, it attempts to generate a FAB by running the `build:fab` script defined in your `package.json`.

Running the `build:fab` script should compile a FAB by using a relevant [FAB](https://fab.dev/) package.

If a FAB is successfully compiled, `fab-upload` will then upload the FAB to Linc along with a record of the build as well as some related git metadata.

In order for `fab-upload` to operate, you will need to supply it with the name of your Linc site and an API key for that Linc site.

You can supply these two values as environment variables:

| Variable         |  Type  |                      Value |
| ---------------- | :----: | -------------------------: |
| `LINC_API_KEY`   | String |     Your Linc site API key |
| `LINC_SITE_NAME` | String | The name of your Linc site |

Alternatively, you can pass these values to `fab-upload` via the `[SITENAME]` argument and `--apiKey` flag as follows:

```bash
fab-upload my-site-name --apiKey=abcd1234
```

Once `fab-upload` has successfully uploaded a FAB to Linc, it will return a list of preview URLs for the FAB, as well as a link to the build log in the Linc interface.

## Obtaining an API key

`fab-upload` is currently in beta. To obtain an API key and start using `fab-upload`, contact us at [support@linc.sh](mailto:support@linc.sh).