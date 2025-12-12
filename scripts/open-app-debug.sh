#!/bin/sh

# Set the path to the app binary inside the bundle
APP_PATH="src-tauri/target/release/bundle/macos/TypingPro.app/Contents/MacOS/TypingPro"

echo "Launch Debug: Starting TypingPro..."
echo "Binary: $APP_PATH"
echo "---------------------------------------------------"

# Run the binary. 
# Check if file exists first
if [ -f "$APP_PATH" ]; then
    # Ensure it's executable
    chmod +x "$APP_PATH"
    
    # Run
    "$APP_PATH"
else
    echo "Error: App binary not found. Please run 'npm run build:all' first."
fi
