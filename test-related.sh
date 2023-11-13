#!/bin/bash

JEST_BIN=node_modules/.bin/jest
ARGS=$@

run() {
  local files_changes=$(git diff --diff-filter=d --name-only origin/develop.. ':*.js' ':*.ts' ':*.tsx' | xargs)

  if [ -z "$files_changes" ]; then
    return 0
  fi

  local tests_related=$($JEST_BIN --listTests --findRelatedTests $(echo $files_changes))
  if [ -z "$tests_related" ]; then
    return 0
  fi

  npm run test:nowatch $ARGS $(echo $tests_related)
}

run
