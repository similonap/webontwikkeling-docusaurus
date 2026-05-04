#!/usr/bin/env bash
set -euo pipefail

DOCS_DIR="$(cd "$(dirname "$0")/../docs/exercises" && pwd)"
STATIC_BASE="$(cd "$(dirname "$0")/.." && pwd)/static/exercises"
mkdir -p "$STATIC_BASE"
STATIC_DIR="$STATIC_BASE"

echo "Building exercise zips..."
echo "  source: $DOCS_DIR"
echo "  output: $STATIC_DIR"

find "$DOCS_DIR" -mindepth 2 -maxdepth 2 -type d | sort | while read -r exercise_dir; do
  category="$(basename "$(dirname "$exercise_dir")")"
  exercise="$(basename "$exercise_dir")"
  out_dir="$STATIC_DIR/$category/$exercise"

  # Zip solution if present
  if [ -d "$exercise_dir/solution" ]; then
    mkdir -p "$out_dir"
    (cd "$exercise_dir" && zip -rq "$out_dir/solution.zip" solution)
    echo "  [solution] $category/$exercise/solution.zip"
  fi

  # Zip starter if present
  if [ -d "$exercise_dir/starter" ]; then
    mkdir -p "$out_dir"
    (cd "$exercise_dir" && zip -rq "$out_dir/starter.zip" starter)
    echo "  [starter]  $category/$exercise/starter.zip"
  fi
done

echo "Done."
