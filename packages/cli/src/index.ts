#!/usr/bin/env node
import { VERSION } from "@ui-gen/core"
import { Command } from "commander"
import { addCommand } from "./commands/add.js"
import { generateCommand } from "./commands/generate.js"
import { initCommand } from "./commands/init.js"
import { listCommand } from "./commands/list.js"
import { printError, wantsJson } from "./output.js"

const program = new Command()

program
  .name("ui-gen")
  .description("Generate React, TypeScript, and Tailwind components into your project")
  .version(VERSION)

program
  .command("init")
  .description("Write ui-gen.json with paths, aliases, and provider defaults")
  .option("--cwd <dir>", "project directory", process.cwd())
  .option("--yes", "non-interactive; init already accepts detected defaults")
  .option("--force", "overwrite an existing ui-gen.json")
  .option("--json", "print machine-readable JSON")
  .option("--components-dir <dir>", "directory for generated components")
  .option("--rsc <mode>", 'RSC mode: "auto", "true", or "false"', "auto")
  .action(initCommand)

program
  .command("generate")
  .alias("g")
  .description("Generate a component from a prompt and write it into the project")
  .argument("<prompt...>", "what the component should be")
  .option("-n, --name <name>", "PascalCase component name")
  .option("-p, --path <path>", "output .tsx file or directory, relative to the project")
  .option("-y, --yes", "do not prompt; fail if the file exists unless --overwrite is set")
  .option("--overwrite", "replace an existing component file")
  .option("--dry-run", "generate and print the file without writing it")
  .option("--json", "print machine-readable JSON")
  .option("--silent", "print only the import line")
  .option("--model <model>", "model id, overriding ui-gen.json and UI_GEN_MODEL")
  .option("--cwd <dir>", "project directory", process.cwd())
  .action(generateCommand)

program
  .command("add")
  .description("Copy a local .tsx component into the configured directory and export it")
  .argument("<source>", "component name already in the ui directory, or a path to a .tsx file")
  .option("-n, --name <name>", "component export name")
  .option("--overwrite", "replace an existing component file")
  .option("--dry-run", "print the destination without writing")
  .option("--json", "print machine-readable JSON")
  .option("--silent", "print only the import line")
  .option("--cwd <dir>", "project directory", process.cwd())
  .action(addCommand)

program
  .command("list")
  .description("List components in the configured directory")
  .option("--json", "print machine-readable JSON")
  .option("--cwd <dir>", "project directory", process.cwd())
  .action(listCommand)

program.addHelpText(
  "after",
  `
Examples:
  ui-gen init
  ui-gen generate "pricing card with three tiers and a primary CTA"
  ui-gen g "icon button" --name IconButton --dry-run
  ui-gen add ./src/PricingCard.tsx

The npm package name ui-gen is already taken. This CLI is @ui-gen/cli and the binary is still ui-gen.
`,
)

program.parseAsync(process.argv).catch((error: unknown) => {
  printError(error, wantsJson())
  process.exitCode = 1
})
