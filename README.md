![Build](https://github.com/TimLavelle/infidel-props-eds/actions/workflows/main.yaml/badge.svg)

# Infidel Props Sandbox Edge Delivery Site

My 3D printing playground and my ~~EDS~~ Edge Delivery Service Site

## Environments

- Preview: https://main--infidel-props-eds--timlavelle.hlx.page/
- Live: https://main--infidel-props-eds--timlavelle.hlx.live/

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Testing with Vitest

Testing framework used is [Vitest](https://vitest.dev/). A JEST comparison but with faster runs and a UI test framework built in.

```sh
# To run a single test and stop post testing
npm run test:run

# To run all tests and watch for changes
npm run test:watch
```

### Pre-Commits

All CS/JS/JSON files are linted before committing to ensure clean and quality code.

### Pre-Push

All test are ran before a push to ensure all new code is tested and up to standard.

## Local development

1. Create a new repository based on the `aem-boilerplate` template and add a mountpoint in the `fstab.yaml`
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)

## Prerequisites

- nodejs 18.3.x or newer
- AEM Cloud Service release 2024.8 or newer (>= `17465`)

## Resources

### Documentation

- [Getting Started Guide](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/edge-dev-getting-started)
- [Creating Blocks](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/create-block)
- [Content Modelling](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/content-modeling)
- [Working with Tabular Data / Spreadsheets](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/tabular-data)

### Presentations and Recordings

- [Getting started with AEM Authoring and Edge Delivery Services](https://experienceleague.adobe.com/en/docs/events/experience-manager-gems-recordings/gems2024/aem-authoring-and-edge-delivery)
