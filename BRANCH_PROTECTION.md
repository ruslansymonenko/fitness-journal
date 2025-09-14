# Branch Protection Setup Guide

This guide helps you set up branch protection rules for the fitness-journal repository.

## Prerequisites

- Repository admin access
- GitHub CLI installed (optional but recommended)

## Setting up Branch Protection Rules

### Option 1: Using GitHub Web Interface

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Click on **Branches** in the left sidebar
4. Click **Add rule** button

### Main Branch Protection

Configure the following settings for the `main` branch:

#### Branch name pattern

```
main
```

#### Protection Rules

- [x] **Require a pull request before merging**

  - [x] Require approvals (minimum: 1)
  - [x] Dismiss stale PR approvals when new commits are pushed
  - [x] Require review from code owners (if CODEOWNERS file exists)

- [x] **Require status checks to pass before merging**

  - [x] Require branches to be up to date before merging
  - Required status checks:
    - `Test Server`
    - `Test & Build Client`
    - `Lint & Format Check`
    - `Security Audit`
    - `All Checks Passed`

- [x] **Require conversation resolution before merging**

- [x] **Require signed commits** (optional but recommended)

- [x] **Include administrators** (apply rules to admins too)

- [x] **Restrict pushes that create files in this directory** (optional)

### Dev Branch Protection

Configure the following settings for the `dev` branch:

#### Branch name pattern

```
dev
```

#### Protection Rules

- [x] **Require status checks to pass before merging**

  - [x] Require branches to be up to date before merging
  - Required status checks:
    - `Quick Test & Build`

- [x] **Include administrators**

### Option 2: Using GitHub CLI

If you have GitHub CLI installed, you can use these commands:

```bash
# Enable branch protection for main branch
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Test Server","Test & Build Client","Lint & Format Check","Security Audit","All Checks Passed"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null

# Enable branch protection for dev branch
gh api repos/:owner/:repo/branches/dev/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Quick Test & Build"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews=null \
  --field restrictions=null
```

### Option 3: Using GitHub API

You can also use curl to set up branch protection:

```bash
# Replace YOUR_TOKEN and YOUR_REPO appropriately
curl -X PUT \
  -H "Authorization: token YOUR_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/YOUR_OWNER/YOUR_REPO/branches/main/protection \
  -d '{
    "required_status_checks": {
      "strict": true,
      "contexts": [
        "Test Server",
        "Test & Build Client",
        "Lint & Format Check",
        "Security Audit",
        "All Checks Passed"
      ]
    },
    "enforce_admins": true,
    "required_pull_request_reviews": {
      "required_approving_review_count": 1,
      "dismiss_stale_reviews": true
    },
    "restrictions": null
  }'
```

## Verification

After setting up the rules, verify they work by:

1. Creating a test branch
2. Making a change
3. Opening a pull request
4. Confirming that:
   - Status checks run automatically
   - Merge is blocked until checks pass
   - Approval is required (for main branch)

## Status Check Names

The GitHub Actions workflows will create these status checks:

### For Main Branch (ci.yml)

- `Test Server` - Server testing with database
- `Test & Build Client` - Client TypeScript and build
- `Lint & Format Check` - Code quality checks
- `Security Audit` - Dependency security scan
- `All Checks Passed` - Meta check ensuring all passed

### For Dev Branch (dev-ci.yml)

- `Quick Test & Build` - Fast validation for development

## Troubleshooting

### Status Checks Not Appearing

- Check that GitHub Actions workflows have run at least once
- Verify workflow names match exactly
- Ensure workflows are in `.github/workflows/` directory

### Cannot Merge Despite Green Checks

- Check that all required status checks are listed
- Verify branch is up to date if that requirement is enabled
- Confirm approval requirements are met

### Workflow Failures

- Check GitHub Actions tab for error details
- Verify all required secrets and environment variables are set
- Review workflow logs for specific error messages

## Additional Security

### CODEOWNERS File

Create `.github/CODEOWNERS` to require reviews from specific people:

```
# Global owners
* @ruslansymonenko

# Server-specific files
/server/ @ruslansymonenko

# Client-specific files
/client/ @ruslansymonenko

# CI/CD files
/.github/ @ruslansymonenko
```

### Required Contexts

Adjust required status checks as your CI/CD pipeline evolves:

- Add new checks when adding new workflows
- Remove obsolete checks when workflows are updated
- Use exact names as they appear in GitHub Actions

## Best Practices

1. **Start Permissive**: Begin with basic rules and tighten over time
2. **Test Thoroughly**: Verify rules work with test PRs
3. **Document Changes**: Keep team informed of protection rule updates
4. **Monitor Impact**: Track how rules affect development workflow
5. **Regular Review**: Periodically review and update protection rules
