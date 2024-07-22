#!/bin/bash

# Navigate to the backend directory
cd backend

# Run npm install
npm install

# Create a .env file inside the backend directory with the specified variables
cat <<EOL > .env
DB_NAME=kana_db
DB_USER=postgres
DB_PASSWORD=
EOL

# Navigate to the frontend directory
cd ../frontend

# Run npm install
npm install

echo "Setup complete!"