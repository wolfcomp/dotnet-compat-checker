import * as core from '@actions/core'
import * as github from '@actions/github'
import compat from './compat'
import parse from './parse'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
    try {
        if (github.context.eventName !== 'pull_request_target') {
            throw new Error(
                'This action can only be run on pull_request_target events.'
            )
        }
        const left = core.getInput('left')
        const right = core.getInput('right')
        const token = core.getInput('token')
        const tag = core.getInput('tag')

        const octokit = github.getOctokit(token)

        if (!left || !right) {
            throw new Error('Both left and right inputs must be provided.')
        }

        const result = await compat(left, right)

        if (
            !!result &&
            result !==
            'APICompat ran successfully without finding any breaking changes.'
        ) {
            // parse out the results to find out what the breaking changes are
            const breakingChanges = parse(result)
            if (breakingChanges.length === 0)
                return;
            const mappedChanges = breakingChanges.reduce(
                (acc, change) => {
                    acc[change.type] = acc[change.type] || []
                    acc[change.type].push(change.field.toString())
                    return acc
                },
                {} as Record<string, string[]>
            )

            // create a comment with the results
            let comment = `Found ABI compatibility issues between main and pr:\n\n`

            comment += Object.keys(mappedChanges)
                .map(key => {
                    return `### ${key}\n${mappedChanges[key].map(change => `- ${change}`).join('\n')}`
                })
                .join('\n\n')

            octokit.rest.issues.createComment({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                issue_number: github.context.payload.pull_request!.number, // eslint-disable-line @typescript-eslint/no-non-null-assertion
                body: comment
            })

            if (tag) {
                octokit.rest.issues.addLabels({
                    owner: github.context.repo.owner,
                    repo: github.context.repo.repo,
                    issue_number: github.context.payload.pull_request!.number, // eslint-disable-line @typescript-eslint/no-non-null-assertion
                    labels: tag.split(',')
                })
            }
        }
    } catch (error) {
        // Fail the workflow run if an error occurs
        if (error instanceof Error) {
            core.setFailed(error.message)
            if (error.stack) core.error(error.stack)
        }
    }
}
