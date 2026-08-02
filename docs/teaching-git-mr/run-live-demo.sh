#!/usr/bin/env bash
# Live reproduction: push commit + create GitHub Pull Request for llama-node-poc.
# Logs each step to docs/teaching-git-mr/terminal-logs/live/
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
LOG_DIR="$ROOT/docs/teaching-git-mr/terminal-logs/live"
mkdir -p "$LOG_DIR"

log_step() {
  local n="$1"
  local title="$2"
  local file="$LOG_DIR/step-${n}-$(echo "$title" | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | tr -cd 'a-z0-9-').txt"
  echo "=== Step $n: $title ===" | tee "$file"
  echo "Command: ${3:-(see below)}" | tee -a "$file"
  echo "---" | tee -a "$file"
}

cd "$ROOT"

log_step "01" "Check git status" "git status -sb"
git status -sb 2>&1 | tee -a "$LOG_DIR/step-01-check-git-status.txt"

log_step "02" "Verify remote" "git remote -v"
git remote -v 2>&1 | tee -a "$LOG_DIR/step-02-verify-remote.txt"

BRANCH="docs/teach-model-git-workflow"
log_step "03" "Create feature branch" "git checkout -b $BRANCH"
git checkout -b "$BRANCH" 2>&1 | tee -a "$LOG_DIR/step-03-create-feature-branch.txt"

log_step "04" "Stage teaching experiment files" "git add docs/teaching-git-mr ..."
git add docs/teaching-git-mr README.md UKRAINIAN_PUBLICATION.md PUBLICATION_AUDIT.md SETUP.md 2>&1 | tee -a "$LOG_DIR/step-04-stage-files.txt" || true
git status -sb 2>&1 | tee -a "$LOG_DIR/step-04-stage-files.txt"

log_step "05" "Commit with conventional message" "git commit"
git commit -m "$(cat <<'EOF'
docs: add teach-model git/PR experiment with logs and screenshots

Document Modelfile-based teaching for Boobuh/llama-node-poc workflow.
Includes baseline vs taught Ollama responses and reproducible terminal logs.

EOF
)" 2>&1 | tee -a "$LOG_DIR/step-05-commit.txt"

log_step "06" "Push branch to origin" "git push -u origin HEAD"
git push -u origin HEAD 2>&1 | tee -a "$LOG_DIR/step-06-push-branch.txt"

log_step "07" "Create Pull Request" "gh pr create"
gh pr create --title "docs: teach model git push and PR workflow" --body "$(cat <<'EOF'
## Summary
- Mini experiment: teach Ollama (Modelfile) repo-specific git push + PR steps for Boobuh/llama-node-poc
- Baseline llama3.2 gave unsafe/wrong commands; taught model uses branch + gh pr create
- Terminal logs and screenshots under `docs/teaching-git-mr/` for reproduction

## Test plan
- [ ] Review `docs/teaching-git-mr/README.md`
- [ ] Compare logs `01-baseline-question.txt` vs `03-taught-response.txt`
- [ ] Re-run `ollama create llama-node-poc-git -f docs/teaching-git-mr/Modelfile`

EOF
)" 2>&1 | tee -a "$LOG_DIR/step-07-create-pull-request.txt"

log_step "08" "View PR summary" "gh pr view"
gh pr view 2>&1 | tee -a "$LOG_DIR/step-08-view-pr.txt"

echo "Done. Logs in $LOG_DIR"
