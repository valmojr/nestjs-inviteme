#!/bin/bash

# Function to read variables from a specific .env file
read_env_from_file() {
  local env_file="$1"

  while IFS== read -r key value
  do
    if [[ -n "$key" && -n "$value" ]]; then
      export "$key=$value"
    else
      echo "Skipping empty line or invalid format in $env_file"
    fi
  done < "$env_file" || {
    echo "Error reading $env_file. Please check the file for syntax errors."
    exit 1
  }
}

# Get the environment file name (default to .env)
env_file="${1:-.env}"

# Read variables from the specified file
read_env_from_file "$env_file"

# Additional features (uncomment if desired)

# ... (same as in previous response)

# Make script executable (if needed)
# chmod +x convert_env_to_shell.sh