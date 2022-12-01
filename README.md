# jobify

#### Track Your Job Search

Project in Action - [Jobify](https://jobify-7qh9.onrender.com)

Extensive documentation with examples [here](https://documenter.getpostman.com/view/20805847/2s8YsxuB4B)

## Features


- Create mock data (Mockaroo) and populate the database using automated scripts.
- Use ES6 Modules on the back-end
- Setup "proxy" in create-react-app
- Build bunch of nice looking pages (Landing, Error, Register, Dashboard, etc)
- Setup nested pages and protected route using React Router 6
- Global context using createContext and utilize useContext hook
- Setup MongoDB database in the cloud (Atlas)
- Utilize "express-async-errors" package (eliminate use of try/catch blocks)
- Implement custom Error-Handling with personalized status codes
- Hash passwords & implement JWT for authentication and authorization
- Programmatically navigate using React Router 6
- Persist data in local storage
- Set JWT token in Postman programmatically
- Implement various Axios configurations(interceptors and custom fetch)
- Setup moment.js on the front-end and back-end
- Setup nice charts and cards
- Implement search/filter functionality along with pagination on the server and front-end
- API documentation using postman

## Usage

### Env Variables

Create a .env file in the root and add the following

```
NODE_ENV = development
PORT = 5000
MONGO_URI = your mongodb uri
JWT_SECRET = your secret key
JWT_LIFETIME = 1d
```

### Install Dependencies (frontend & backend)

```
npm run install-dependencies
```

### Run

```
# Run frontend (:3000) & backend (:5000) both using concurrently
npm start
# Run backend only
npm run server
```

## Build & Deploy

```
# Create frontend prod build
npm run build-client
```

### Seed Database

You can use the following commands to seed the database with some sample jobs as well as destroy all the jobs

```
# Import data
npm run i
# Destroy data
npm run d
```

```
Sample User Login
email - user@gmail.com
password - password
```
![2022-11-27](https://user-images.githubusercontent.com/88419331/204122130-153e0fdc-411d-413e-8900-4b0c805642f6.png)
