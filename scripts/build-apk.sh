#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-release}"

echo "==> Building MyLifeOS Android APK (mode: $MODE)..."
cd "$(dirname "$0")/../app/android"

if [ "$MODE" = "release" ]; then
  ./gradlew assembleRelease
  echo "==> Release APK built at app/android/app/build/outputs/apk/release/app-release.apk"
else
  ./gradlew assembleDebug
  echo "==> Debug APK built at app/android/app/build/outputs/apk/debug/app-debug.apk"
fi
