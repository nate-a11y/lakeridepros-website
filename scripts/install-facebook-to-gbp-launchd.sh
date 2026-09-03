#!/bin/bash

set -euo pipefail

LABEL="com.lakeridepros.facebook-to-gbp"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
NODE_BIN="$(command -v node)"
NODE_BIN="$(python3 -c 'import os,sys; print(os.path.realpath(sys.argv[1]))' "$NODE_BIN")"
STATE_DIR="$HOME/Library/Application Support/LakeRidePros/facebook-to-gbp"
PLIST_DIR="$HOME/Library/LaunchAgents"
PLIST_PATH="$PLIST_DIR/$LABEL.plist"
DOMAIN="gui/$(id -u)"

xml_escape() {
  printf '%s' "$1" | sed -e 's/&/\&amp;/g' -e 's/</\&lt;/g' -e 's/>/\&gt;/g' -e 's/"/\&quot;/g'
}

mkdir -p "$STATE_DIR" "$PLIST_DIR"
chmod 700 "$STATE_DIR"

NODE_XML="$(xml_escape "$NODE_BIN")"
SCRIPT_XML="$(xml_escape "$REPO_ROOT/scripts/facebook-to-gbp.mjs")"
ROOT_XML="$(xml_escape "$REPO_ROOT")"
OUT_XML="$(xml_escape "$STATE_DIR/launchd.log")"
ERR_XML="$(xml_escape "$STATE_DIR/launchd-error.log")"

cat > "$PLIST_PATH" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$LABEL</string>
  <key>ProgramArguments</key>
  <array>
    <string>$NODE_XML</string>
    <string>$SCRIPT_XML</string>
    <string>--publish</string>
  </array>
  <key>WorkingDirectory</key>
  <string>$ROOT_XML</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>NODE_ENV</key>
    <string>production</string>
  </dict>
  <key>RunAtLoad</key>
  <true/>
  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key>
    <integer>9</integer>
    <key>Minute</key>
    <integer>15</integer>
  </dict>
  <key>ProcessType</key>
  <string>Background</string>
  <key>LowPriorityIO</key>
  <true/>
  <key>ThrottleInterval</key>
  <integer>60</integer>
  <key>StandardOutPath</key>
  <string>$OUT_XML</string>
  <key>StandardErrorPath</key>
  <string>$ERR_XML</string>
</dict>
</plist>
PLIST

plutil -lint "$PLIST_PATH"
launchctl bootout "$DOMAIN" "$PLIST_PATH" >/dev/null 2>&1 || true
launchctl bootstrap "$DOMAIN" "$PLIST_PATH"
launchctl enable "$DOMAIN/$LABEL"
launchctl kickstart -k "$DOMAIN/$LABEL"

echo "Installed $LABEL"
echo "Schedule: daily at 9:15 AM; the script enforces at least 2 days between Google posts."
echo "State and logs: $STATE_DIR"
echo "Inspect: launchctl print $DOMAIN/$LABEL"
