# Contributing Guidelines for movie-web

Thank you for investing your time in contributing to our project! Your contribution will be reflected on [movie-web.app](https://movie-web.app).

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) to keep our community approachable and respectable.

## Contents
 - [New Contributor Guide](#new-contributor-guide)
 - [Requesting a feature or reporting a bug](#requesting-a-feature-or-reporting-an-bug)
   - [Discord Server](#discord-server)
   - [GitHub Issues](#github-issues)
 - [Before you start](#before-you-start)
 - [Contributing](#before-you-start)
   - [Recommended Development Environment](#recommended-development-environment)
   - [Tips](#tips)
   - [Language Contributions](#language-contributions)

## New contributor guide

To get an overview of the project, read the [README](README.md). Here are some resources to help you get started with open-source contributions:

- [Finding ways to contribute to open-source on GitHub](https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github)
- [Set up Git](https://docs.github.com/en/get-started/quickstart/set-up-git)
- [GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Collaborating with pull requests](https://docs.github.com/en/github/collaborating-with-pull-requests)


## Requesting a feature or reporting a bug
There are two places where to request features or report bugs:
 - GitHub Issues
 - The movie-web Discord server

### Discord Server
If you do not have a GitHub account or want to discuss a feature or bug with us before making an issue, you can join our Discord server.

<a href="https://discord.movie-web.app"><img src="https://discord.com/api/guilds/871713465100816424/widget.png?style=banner2" alt="Discord Server"></a>

### GitHub Issues
To make a GitHub issue for movie-web, please visit the [new issue page](https://github.com/movie-web/movie-web/issues/new/choose) where you can pick either the "Bug Report" or "Feature Request" template.

When filling out an issue template, please include as much detail as possible and any screenshots or console logs as appropriate.

After an issue is created, it will be assigned either the https://github.com/movie-web/movie-web/labels/bug or https://github.com/movie-web/movie-web/labels/feature label, along with https://github.com/movie-web/movie-web/labels/awaiting-approval. One of our maintainers will review your issue and, if it's accepted, will set the https://github.com/movie-web/movie-web/labels/approved label.

## Before you start!
Before starting a contribution, please check your contribution is part of an open issue on [our issues page](https://github.com/movie-web/movie-web/issues). 

GitHub issues are how we track our bugs and feature requests that will be implemented into movie-web - all contributions **must** have an issue and be approved by a maintainer before a pull request can be worked on.

If a pull request is opened before an issue is created and accepted, you may risk having your pull request rejected! Always check with us before starting work on a feature - we don't want to waste your time!

> **Note**
> The exception to this are language contributions, which are discussed in [this section](#language-contributions)

Also, make sure that the issue you would like to work on has been given the https://github.com/movie-web/movie-web/labels/approved label by a maintainer. Otherwise, if we reject the issue, it means your work will have gone to waste!

## Contributing
If you're here because you'd like to work on an issue, amazing! Thank you for even considering contributing to movie-web; it means a lot :heart:

Firstly, make sure you've read the [Before you start!](#before-you-start) section!

When you have found a GitHub issue you would like to work on, you can request to be assigned to the issue by commenting on the GitHub issue.

If you are assigned to an issue but can't complete it for whatever reason, no problem! Just let us know, and we will open up the issue to have someone else assigned.

### Recommended Development Environment
Our recommended development environment to work on movie-web is:
- [Visual Studio Code](https://code.visualstudio.com/)
- [ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [EditorConfig Extension](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

When opening Visual Studio Code, you will be prompted to install our recommended extensions if they are not installed for you.

Our project is set up to enforce formatting and code style standards using ESLint. 

### Tips
Here are some tips to make sure that your pull requests are :pinched_fingers: first time:

- KISS - Keep It Simple Soldier! - Simple code makes readable and efficient code!
- Follow standard best practices for TypeScript and React.
- Keep as much as possible to the style of movie-web. Look around our codebase to familiarise yourself with how we do things!
- Ensure to take note of the ESLint errors and warnings! **Do not ignore them!** They are there for a reason.
- Test, test, test! Make sure you thoroughly test the features you are contributing.

### Language Contributions
Language contributions help movie-web massively, allowing people worldwide to use our app!

Like most apps, our translations are stored in `.json` files. Each language string has a unique key (For example, `notFound.genericTitle`) that references a language string in the appropriate language file.

Each language file is called `translation.json` and is stored in the `src/setup/languages/<language code>/` folder. For example, the English language file is located at `src/setup/languages/en/translation.json`.

> **Warning**
> Before you start a translation, please:
> - Check there isn't an existing GitHub [issue](https://github.com/movie-web/movie-web/issues) or [pull request](https://github.com/movie-web/movie-web/pulls) open for the language.
> - Make sure we aren't in the middle of a new feature update. When releasing major versions, we only accept changes to translations once the new version is complete. Otherwise, the language files would need to be updated.
>
> Please speak to us before starting a language PR. We want to use your time effectively.

To make a translation:
 - Copy the `en` folder inside the `src/setup/languages` folder
 - Rename the copied folder to the 2-letter code for the country/language which is being translated.
   - [Click this link to see a list of codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes). Use the codes in the `639-1` column!
   - For example, Arabic is `ar` 
 - Edit the language strings inside the `translation.json` file
   - **Do not** edit the keys. Only edit the values.
   - e.g. in `"stopEditing": "Stop editing",` - only change the `Stop editing` part, not the `stopEditing` part.
 - In the `src/setup/i18n.ts` file:
   - Import your new translation file, e.g. `import ar from "./locales/ar/translation.json";`
   - Add your translation to the `locales` object (Look at other languages for an example)

Once you have completed your translation, please open a pull request. We do not accept partial translations, so please ensure every language string is translated to the intended language.
