#!/bin/bash

# Ollama Helper - Delegate reasoning tasks to local deepseek-r1 model
# Usage: ./ollama-helper.sh "your question or task"

MODEL="deepseek-r1"
PROMPT="$1"

if [ -z "$PROMPT" ]; then
    echo "Usage: $0 \"your question\""
    echo ""
    echo "Examples:"
    echo "  $0 \"Analyze this algorithm and suggest improvements\""
    echo "  $0 \"Review this code for potential bugs\""
    exit 1
fi

# Check if ollama is running
if ! command -v ollama &> /dev/null; then
    echo "Error: ollama command not found. Make sure Ollama is installed."
    exit 1
fi

# Run the query
echo "🤖 Querying deepseek-r1..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ollama run "$MODEL" "$PROMPT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
