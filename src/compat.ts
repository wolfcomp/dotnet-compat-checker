import { exec, ExecOptions } from '@actions/exec'
import * as core from '@actions/core'

export default async function compat(
    left: string,
    right: string
): Promise<string> {
    core.info('Installing .NET API Compat Tool...')
    await execPromise(
        `dotnet tool install -g Microsoft.DotNet.ApiCompat.Tool`
    )
    core.info('Running .NET API Compat Tool...')
    const result = await execPromise(`apicompat -l ${left} -r ${right}`)
    core.info('API Compatibility Result:')
    return result
}

let stdout = ''
let stderr = ''

const options: ExecOptions = {}
options.listeners = {
    stdout: (data: Buffer) => {
        stdout += data.toString()
    },
    stderr: (data: Buffer) => {
        stderr += data.toString()
    }
}

export async function execPromise(command: string): Promise<string> {
    await exec(command, undefined, options)
    core.info('stdout:')
    core.info(stdout)
    core.info('stderr:')
    core.info(stderr)

    if (stderr) {
        return stderr
    }
    return stdout
}

class ExecError extends Error {
    err: string
    out: string

    constructor(message: string, err: string, out: string) {
        super(message)
        this.err = err
        this.out = out
        this.name = 'ExecError'
    }
}
