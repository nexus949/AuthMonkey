# Auth Monkey

Auth Monkey is a simple authentication and authorization system built using Node JS.\
It is designed to showcase and serve as a reference for fellow developers, helping implement secure authentication and authorization.

<hr>

## Deployment
https://authmonkey.onrender.com/

**NOTE:** The project is hosted on [Render](https://render.com/), on its free plan. So the app will automatically go to sleep when inactive, therefore the next time someone visits it will take some time to load up.

## Tech Stack
**Client:** HTML, CSS and JavaScript\
**Server:** Node, Express, MongoDB

## Features
- Implements staright forward and secure authentication.
- Uses Json Web Tokens for secure authentication.
- Implements password Hashing before saving user's data.
- Proper Error Handling on server side to ensure security and reliablity.

## Installation
Install Node and MongoDB prior Installation.\
Node: https://nodejs.org/en \
MongoDB: https://www.mongodb.com/try/download/community \
\
**Clone the repository:** 
```bash
git clone https://github.com/nexus949/AuthMonkey.git
```
**Install the Dependencies:**
```bash
npm install
```
**Start the server:**
```bash
npm start
```
The server runs on PORT 3000 !

## Additional Info
- When you register at Auth Monkey, your data will be stored in a remote database (MongoDB Atlas) and will be used solely for logging in to Auth Monkey.
- This project is intended solely for showcasing or as a reference for developers looking to implement an authentication and authorization system in their projects, and not for commercial use.