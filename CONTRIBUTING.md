# Contributing

Thank you for choosing to contribute to the project, we really appreciate your time and effort!

## Code of Conduct

This project adheres to the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this
code. Please report unacceptable behavior to the project maintainers.

## How to Contribute

We welcome contributions in many forms:

* **Feature Requests:** New functionality or enhancements.
* **Bug Reports:** Reproducible issues found in the existing feature scope.
* **Documentation:** Improving the README, Javadocs, or Wiki.
* **Code:** Pull requests for bug fixes or approved features.

### The Lifecycle of a Contribution

All contributions must begin with a [GitHub Issue](https://github.com/merkle-open/aem-generic-multifield/issues). This
ensures the community can discuss the proposal before any code is written.

1. **Open an Issue:** Use the appropriate template.
2. **Discussion:** The team may request clarifications. Issues with no activity from the reporter for a prolonged period
   may be closed.
3. **Labeling:** Once reviewed, the team will apply relevant labels (e.g., `bug`, `enhancement`, `documentation`, etc.).

## Technical Guidelines

### Branching Strategy

To maintain a stable release cycle, we follow a specific branching model:

* **`develop`**: All development and active contributions happen here. **All Pull Requests must target this branch.**
* **`master`**: Reserved for stable, production-ready releases.

> [!CAUTION]
> Pull Requests targeting the `master` branch or not based on `develop` branch as well as based on an outdated `develop`
> branch will be automatically rejected.

### Development Workflow

1. **Fork** the repository to your own GitHub account. [^1]
2. **Clone** your fork locally.
3. **Create a branch** of `develop` (e.g., `feature/123-description`).
4. **Commit** your changes with clear, descriptive commit messages by including the issue number (e.g.,
   `#123 Description`).
5. **Submit a Pull Request** (PR) to our `develop` branch. [^2]

## Issue Report Guidelines

A high-quality issue report helps us resolve problems faster.

For more details, please see our [bug report](.github/ISSUE_TEMPLATE/BUG_TEMPLATE.md)
or [feature request](.github/ISSUE_TEMPLATE/FEATURE_REQUEST_TEMPLATE.md) templates.

[^1]: [Contributing to a project](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project)
[^2]: [About pull requests](https://help.github.com/articles/using-pull-requests)
