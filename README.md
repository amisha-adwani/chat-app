# Hushnet ChatApp

Real-time text-based chat app using MongoDB, Express.js, React.js, Node.js, Socket.io,JSON Web Tokens (JWT)

## Features

- [x] Real-time messaging <br />
- [x] User authentication <br />
- [x] Group chat <br />
- [ ] Private chat <br />
- [ ] Emoji Support <br />
- [ ] Integrate canvas <br />
- [ ] Customize user profile <br />

## Installation

1. Clone the repo
2. Navigate to the directory
3. Install dependencies `npm install`
4. Set up environment variable
     * Create a `.env` file in client and server
     * Define the following variables in client .env 
     `REACT_APP_BASE_URL=http://localhost:3001` <br />
     `REACT_APP_fetchURL=http://localhost:3001/room`  <br />
     `REACT_APP_SIGNUP_URL = http://localhost:3001/auth/signup` <br />
     `REACT_APP_LOGIN_URL = http://localhost:3001/auth/login`<br />

     * Define the following variables in server .env
     `MONGO_URI=your_mongodb_connection_string` <br />
     `JWT_SECRET=your_jwt_secret_key` <br />
5. Start the server <br/>
   `npm run both` to run both client and server simultaneously
