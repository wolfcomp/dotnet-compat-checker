# Dotnet Comapt Checker

This action checks if two assemblies follows the ABI pattern set forth by the
`Microsoft.DotNet.ApiCompat.Tool` which is the easiest one to use for automating
checking if two assemblies are able to be interchanged.

## Required Inputs

-   `left`: The path to the left assembly.
-   `right`: The path to the right assembly.

## Optional Inputs

-   `token`: The GitHub token to use for the check. Default is the GitHub token
    provided by the GitHub Actions environment.
-   `tag`: The tag(s) to add to the pull request if the check fails. This should
    be a comma-separated list of tags. Default is an empty string.
