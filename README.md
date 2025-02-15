Sky Vault

Sky Vault is a personal cloud storage application with encryption and file management features. It consists of a Vue 2 frontend and an Express backend, orchestrated using Turbo for streamlined development and deployment.

Features

User Authentication: Login and registration functionality.

Dashboard Navigation: Sidebar for file management and encryption options.

File Operations: Upload, download, encrypt, and share files(all currently incomplete).

Storage Visualization: Displays storage usage progress.

Recent Files Carousel: Highlights recently accessed files.

Project Structure

/personal-cloud
├── apps
│   ├── vue-frontend  # Vue 2 application
│   ├── express-backend   # Express server
├── turbo.json    # Turbo configuration
├── package.json  # Monorepo dependencies
└── README.md     # Project documentation

Getting Started

Prerequisites

Ensure you have the following installed:

Node.js (v14 or later)

Turbo (for managing monorepo tasks)

Installation

Clone the repository and install dependencies:

# Clone the repository
git clone [https://github.com/your-repo/sky-vault.git](https://github.com/coven370/personal-cloud.git)
cd personal-cloud

# Install dependencies
npm install

Running the Application

Use Turbo to start both the frontend and backend simultaneously:

npm run dev

The Vue frontend runs on http://localhost:8080

The Express backend runs on http://localhost:5000

Backend API

The backend provides REST API endpoints for authentication and file operations. Modify backend/config.js to configure database and environment settings.

Duplicate and rename .env.example to .env to create the necessary environment variables.

Frontend Configuration

Ensure API routes are correctly set in frontend/config.js:

Duplicate and rename .env.example to .env to create the necessary environment variables.

Deployment

To build the frontend and backend:

npm run build

Deploy using a hosting service of your choice (e.g., Vercel, AWS, or a private server).

Contributing

Contributions are welcome! Open an issue or submit a pull request with improvements.
