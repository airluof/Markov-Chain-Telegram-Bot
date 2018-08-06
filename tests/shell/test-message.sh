#!/bin/sh

curl -X POST -H "Content-Type: application/json" -d @./tests/shell/test-message-data.json http://localhost:4444/telegram
