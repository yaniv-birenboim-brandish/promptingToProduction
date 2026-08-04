#!/usr/bin/env node
/**
 * PostToolUse hook: after Claude writes or edits a file, run prettier on
 * it. A rule in CLAUDE.md is a request; this hook is a guarantee — the
 * agent cannot produce an unformatted file even if it tries.
 *
 * Receives the tool event as JSON on stdin; never blocks (exit 0 always):
 * formatting problems shouldn't stop the work, just get fixed next write.
 */
import { execFileSync } from 'node:child_process'

const FORMATTABLE = /\.(ts|tsx|js|jsx|css|json|md)$/

let raw = ''
for await (const chunk of process.stdin) raw += chunk

try {
  const event = JSON.parse(raw)
  const filePath = event?.tool_input?.file_path
  if (filePath && FORMATTABLE.test(filePath)) {
    execFileSync('npx', ['prettier', '--write', filePath], {
      stdio: 'ignore',
      timeout: 15_000,
    })
  }
} catch {
  // Formatting is best-effort by design.
}
process.exit(0)
