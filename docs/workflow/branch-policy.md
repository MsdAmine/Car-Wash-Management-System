# Branch Protection Policy

To maintain code quality and system stability, the `main` branch is protected with the following rules:

## 1. No Direct Pushes
All changes must be submitted via a **Pull Request**. Direct pushes to `main` are blocked.

## 2. Required Status Checks (CI)
The GitHub Actions CI pipeline must pass successfully before a Pull Request can be merged. This includes:
- **Backend**: Successful compilation via Maven.
- **Frontend**: Successful build via NPM.

## 3. Merge Requirements
- Pull requests must have no conflicts with the base branch.
- Standardized PR templates must be completed.