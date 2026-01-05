# 📜 Conventional Commits Guide

TypingPro uses an automated release system that parses your commit messages to generate the CHANGELOG.md.
Please follow this structure for all commits.

## Format

`<type>(<scope>): <subject>`

Example: `feat(auth): add google oauth login support`

## Types (Triggers)

| Type     | Description | Changelog Category |
| :------- | :---------- | :----------------- |
| **feat** | A new feature | 🚀 **Features** |
| **fix** | A bug fix | 🐛 **Bug Fixes** |
| **perf** | A code change that improves performance | ⚡ **Performance** |
| **chore** | Maintainance, dependencies, tools | 🛠 **Improvements** |
| **refactor** | Code change that neither fixes a bug nor adds a feature | 🛠 **Improvements** |
| **style** | Markup, white-space, formatting, missing semi-colons... | 🛠 **Improvements** |
| **docs** | Documentation only changes | 🛠 **Improvements** |
| **test** | Adding missing tests | 🛠 **Improvements** |

## Examples

✅ **Good:**

- `feat(ui): add emerald theme support`
- `fix(audio): resolve zero-latency buffer issue`
- `perf(engine): optimize wpm calculation loop`
- `chore(release): v1.0.70`

❌ **Bad:**

- `update theme` (No type)
- `fixed bug` (Vague)
- `wip` (Not descriptive)
