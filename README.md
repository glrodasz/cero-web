# Cero a Producción — Web
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/glrodasz/cero-web/Release)](https://github.com/glrodasz/cero-web/actions/workflows/release.yml) [![Codecov](https://img.shields.io/codecov/c/github/glrodasz/cero-web)](https://app.codecov.io/gh/glrodasz/cero-web)


0️⃣ 🚀 **Cero a Producción** is a project of live coding sessions where we develop a a productivity management app called **RETO** from the scratch to production.

## The idea behind
The idea behind this sessions is to show a real developer experience where we explore every decision that a common programmer do in daily basis with JavaScript and other tools. You will see failing tests, refactors, Google and StackOverflow searchs, but also a lot of fun and the struggle of naming things.

Watch the project in live streaming in 🇪🇸 Spanish, from **Tuesdays** to **Fridays**. [![Twitch Status](https://img.shields.io/twitch/status/guillermorodas?style=social)](https://glrz.me/stream)


## Table of Contents

- [Running the project locally](#Running-the-project-locally)
- [Running the tests](#Running-the-tests)
- [Throubleshooting](#Throubleshooting)

## Running the project locally

Follow these steps to `start the project` in development

1. Clone repository. `git clone https://github.com/glrodasz/cero-web.git`
2. Install dependencies in the project folder running `yarn` or `npm install`
3. Copy the `.env.local.example` to `.env.local` and fill the env variables.
4. Run the server with `yarn dev` or `npm run dev`, this command will run:

 - The web project at `http://localhost:3000`
 - The local api at `http://localhost:3000/local/api`
 - The JSON server at `http://localhost:3001`


## Running the tests

1. Run `yarn run test`or `npm run test`
2. To keep the tests running, run `yarn run test:watch`
## Throubleshooting
### M1 (Apple Silicon) Macs: npm ERR! sharp Prebuilt libvips 8.10.5 binaries are not yet available for darwin-arm64v8
Update libvips to v0.29.0, running the following:
```
brew install vips
```
More info: https://sharp.pixelplumbing.com/install#apple-m1
