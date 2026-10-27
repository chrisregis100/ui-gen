import { createInterface } from "node:readline/promises"
import { stdin, stdout } from "node:process"

export function canPrompt(flags: { yes?: boolean; json?: boolean; silent?: boolean }): boolean {
  return Boolean(stdin.isTTY && stdout.isTTY && !flags.yes && !flags.json && !flags.silent)
}

export async function confirmOverwrite(relativePath: string): Promise<boolean> {
  const rl = createInterface({ input: stdin, output: stdout })
  try {
    const answer = await rl.question(`${relativePath} already exists. Replace it? [y/N] `)
    return /^y(es)?$/i.test(answer.trim())
  } finally {
    rl.close()
  }
}
