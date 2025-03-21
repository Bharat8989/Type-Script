# Login Page App

This is a login page app built using Next.js. It utilizes the NextAuth library for authentication and integrates with MongoDB for login functionality. The app also includes OAuth login options for Google and GitHub.

## Features

- Next.js framework for server-side rendering and routing
- NextAuth library for authentication
- MongoDB for storing user login information
- OAuth login integration with Google and GitHub
- Beautiful animations for enhanced user experience

## How to Run

To run the app, follow these steps:

1. Clone the repository to your local machine.
2. Install the required dependencies by running `npm install` or `yarn install`.
3. Set up your MongoDB database and configure the connection in the app.
4. Obtain API keys for Google and GitHub OAuth login and add them to the app's configuration.
5. Create a `.env` file in the root directory of the project.
6. Add the following variables to the `.env` file:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

7. Start the app by running `npm run dev` or `yarn dev`.
8. Access the app in your browser at `http://localhost:3000`.

Enjoy using the login page app! 2. Install the required dependencies by running `npm install` or `yarn install`. 3. Set up your MongoDB database and configure the connection in the app. 4. Obtain API keys for Google and GitHub OAuth login and add them to the app's configuration. 5. Start the app by running `npm run dev` or `yarn dev`. 6. Access the app in your browser at `http://localhost:3000`.

Enjoy using the login page app!
