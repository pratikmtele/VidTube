# Backend Project

## Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (or use MongoDB Atlas)
- [Cloudinary Account](https://cloudinary.com/) (for media uploads)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/vidtube.git

2. Navigate to the project folder:
   ```bash
   cd VidTube

3. Install dependencies:
   ```bash
   npm install

4. Create a .env file in the root folder and add your environment variables. You can copy the template below into your .env file:
   ```bash
   MONGO_URL=your-mongodb-uri
   PORT=8000
   CORS_ORIGIN=*
    
   ACCESS_TOKEN_SECRET=your-access-token-secret
   ACCESS_TOKEN_EXPIRY=1d
    
   REFRESH_TOKEN_SECRET=your-refresh-token-secret
   REFRESH_TOKEN_EXPIRY=10d
    
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_SECRET_KEY=your-cloudinary-secret-key

   CORS_ORIGIN=http://frontend-url # Uncomment and add the frontend URL to make it more secure

Replace the placeholders with your actual values:


## Running the Application
1. Start the server:
   ```bash
   npm run dev

2. Open your browser and go to http://localhost:8000 to access the API.

# API Endpoints
## Authentication
 - POST /api/v1/users/register: Register a new user. 
 - POST /api/v1/users/login: Login with email and password.
