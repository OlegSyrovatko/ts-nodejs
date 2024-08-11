# TSMovies Backend

This is the backend for the TSMovies project, providing API endpoints for user authentication, movie data, and bookmark management. The backend is built with Node.js and Express, using MongoDB for data storage.

## Live Demo

The backend is hosted on Render. You can find the frontend at [TSMovies Frontend](https://tsmovies.netlify.app).

## Features

- User registration and authentication
- Token-based authentication
- CRUD operations for movies and bookmarks
- Secure password handling
- Email verification and password reset functionality
- CORS enabled for specific origins
- Session management with MongoDB store

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- Express-session
- Connect-mongo
- Cors
- Body-parser
- Dotenv

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/tsmovies-backend.git
   cd tsmovies-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root of the project and add the following:

   ```plaintext
   SESSION_SECRET_WORD=your_secret_word
   SESSION_KEY=session_id
   DB_HOST=your_mongodb_connection_string
   ```

4. Start the server:

   ```bash
   npm start
   ```

## Configuration

Make sure to configure the environment variables correctly before running the server. This includes the MongoDB connection string, session secret, and session key.

## API Endpoints

### Authentication Routes

- **Register User**

  - `POST /auth/register`
  - Validates user registration data

- **Email Verification**

  - `GET /auth/verify/:verificationToken`
  - Verifies user email

- **Resend Verification Email**

  - `GET /auth/verify`
  - Resends verification email

- **Login**

  - `POST /auth/login`
  - Validates user login credentials

- **Refresh Token**

  - `POST /auth/refresh`
  - Validates refresh token

- **Get Current User**

  - `GET /auth/current`
  - Returns the current authenticated user

- **Update Subscription**

  - `PATCH /auth/subscription`
  - Updates user subscription

- **Update Avatar**

  - `PATCH /auth/avatar`
  - Uploads a new avatar image

- **Delete Avatar**

  - `DELETE /auth/avatar`
  - Deletes the user avatar

  - **Update Avatar AWS s3**

  - `PATCH /auth/avatar-aws`
  - Uploads a new avatar image to AWS s3

- **Delete Avatar AWS s3**

  - `DELETE /auth/avatar-aws`
  - Deletes the user avatar from AWS s3

- **Add Movie to Favorites**

  - `PATCH /auth/add-movie`
  - Adds a movie to the user's favorites

- **Remove Movie from Favorites**

  - `PATCH /auth/remove-movie`
  - Removes a movie from the user's favorites

- **Forgot Password**

  - `POST /auth/forgot-password`
  - Initiates password reset

- **Reset Password**

  - `POST /auth/reset-password/:token`
  - Resets the user password

- **Logout**
  - `POST /auth/logout`
  - Logs out the user

### Movies Routes

- **Get All Movies**

  - `GET /api/movies`
  - Retrieves all movies

- **Add New Movie** (Admin only)
  - `POST /api/movies`
  - Adds a new movie

### Bookmarks Routes

- **Get User's Bookmarks**

  - `GET /api/bookmarks`
  - Retrieves the user's bookmarks

- **Add Movie to Bookmarks**

  - `POST /api/bookmarks`
  - Adds a movie to bookmarks

- **Remove Movie from Bookmarks**
  - `DELETE /api/bookmarks/:id`
  - Removes a movie from bookmarks

## Middleware

- **Authentication Middleware**

  - `authenticate`: Middleware to protect routes

- **Validation Middleware**

  - `validateBody`: Middleware to validate request bodies

- **File Upload Middleware**
  - `upload`: Middleware to handle file uploads

## Deployment

The backend is deployed on Render. To deploy your own version:

1. Push your code to a GitHub repository.
2. Create a new service on Render.com and connect it to your repository.
3. Set up environment variables on Render.com.
4. Deploy the service.

## Contributing

Feel free to fork the repository and submit pull requests. All contributions are welcome!

## License

This project is licensed under the MIT License.
