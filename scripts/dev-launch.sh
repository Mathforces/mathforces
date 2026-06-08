#!/usr/bin/env bash

# 1. Navigate to the client directory
cd client || { echo "❌ Error: client directory not found"; exit 1; }

# 2. Guard clause: Check if already running
if [ -f ../.local-url ]; then
    echo "INITIALIZATION_SUCCESS: $(cat ../.local-url)"
    exit 0
fi

# 3. Find a completely free random port
FREE_PORT=$(node -e "const s=require('net').createServer();s.listen(0,()=>{console.log(s.address().port);s.close()})")
LOCAL_URL="http://localhost:$FREE_PORT"

# 4. Save it to the file as a local backup
echo "$LOCAL_URL" > ../.local-url

# 5. Print the exact token for the AI to read
echo "INITIALIZATION_SUCCESS: $LOCAL_URL"

# 6. Launch the dev server completely detached in the background
PORT=$FREE_PORT npm run dev > /dev/null 2>&1 &
