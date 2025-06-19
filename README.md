# Recruitment Task

## Lib Versioning

This apps currently using:

- Node version 18.20.8
- React version 19.1.0

## How to run

Please follow these steps in order to run the apps locally:

1. Make sure Node version that currently used is version 18.20.\*
2. This apps using pnpm, therefore if pnpm it's not installed please install the pnpm using command below
   `npm install -g pnpm`
3. Install all of the dependencies by running `pnpm install`
4. Running the apps locally by running `pnpm run dev`
5. Input the address that shown in your terminal. For example: http://localhost:5173/

## How to deploy

This apps deploy using gh-pages into Github Pages. Therefore, in order to deploy it you need to:

1. Build the production ready build by running `pnpm run build`
2. Run `pnpm run prepare:deploy`
3. Deploy the build by running `pnpm run deploy`

If you ever meet an error while deploying a build and the errors messages:

1. `Push cannot contain secrets` <--- it means that you need to remove some secret value on your build
2. `fatal: a branch named 'gh-pages' already exists` it can be multiple things but the most common is that because your previous deployment is error. Since gh-pages does not automatically revert a deployment process if an error arise, therefore you need to clear the `gh-pages already exist` by:
   - `rm -rf node_modules/.cache/gh-pages`
   - `git branch -D gh-pages 2>/dev/null`
   - `pnpm run deploy`
