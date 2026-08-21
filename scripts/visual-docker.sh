#!/usr/bin/env sh
# Runs the visual tests inside the official Playwright image so that fonts and
# rendering match CI exactly. Baselines MUST be generated this way.
#   sh scripts/visual-docker.sh                    # compare against baselines
#   sh scripts/visual-docker.sh --update-snapshots # (re)generate baselines
#   VISUAL_TESTS=tests/demo sh scripts/visual-docker.sh ...   # another spec folder
set -e
PW_VERSION=$(node -p "require('@playwright/test/package.json').version")
IMAGE="mcr.microsoft.com/playwright:v${PW_VERSION}-noble"
echo "▶ ${IMAGE}"
docker run --rm --ipc=host \
  --user "$(id -u):$(id -g)" -e HOME=/tmp \
  -v "$(pwd)":/work -w /work \
  -e TEST_ENV="${TEST_ENV:-uat}" -e CI=1 -e LOG_LEVEL="${LOG_LEVEL:-warn}" \
  -e DEMO_FAILURES -e VISUAL_BASELINE_USER -e SKIP_PREFLIGHT -e SKIP_ALLURE_REPORT=1 \
  "${IMAGE}" \
  sh -c "npm ci --silent --no-audit --no-fund && npx playwright test ${VISUAL_TESTS:-tests/visual} $*"
