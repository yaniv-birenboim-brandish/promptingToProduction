#!/usr/bin/env node
/**
 * PreToolUse hook: when Claude is about to run `git commit`, run the
 * typecheck first. Exit code 2 BLOCKS the tool call and feeds stderr back
 * to the agent — this is the difference between "the agent is supposed
 * to typecheck" and "the agent cannot commit broken code".
 */
import { execSync } from 'node:child_process'

let raw = ''
for await (const chunk of process.stdin) raw += chunk

let command = ''
try {
  command = JSON.parse(raw)?.tool_input?.command ?? ''
} catch {
  process.exit(0)
}

if (!/\bgit\b[^\n;|&]*\bcommit\b/.test(command)) process.exit(0)

try {
  execSync('npm run --silent typecheck', { stdio: 'pipe', timeout: 120_000 })
  process.exit(0)
} catch (error) {
  const detail = error.stdout?.toString() ?? ''
  console.error(
    `BLOCKED: typecheck fails — fix the errors before committing.\n${detail}`
  )
  process.exit(2)
}
