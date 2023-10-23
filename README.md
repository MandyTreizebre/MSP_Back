# Back-end du projet de la Maison de Santé de Varennes-Sur-Allier

This is an end-of-study project for a React fullstack developer course. 
This repository contains the back-end for the Varennes-Sur-Allier health center website. 

## Getting Started 

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequiesites

Ensure that you have the following installed on your local machine:

- [Node.js](https://nodejs.org)
- npm (comes with Node.js)

### Installation

1. Clone the repository : 
```bash
git clone https://github.com/MandyTreizebre/MSP_Back.git
```

2. Navigate into the projet directory with the cd command

3. Install the projet dependencies : 
```
- npm i
- npm i bcrypt cors express express-fileupload jsonwebtoken nodemon promise-mysql cookie-parser dotenv
```

### Configuration 

Create a .env file in the root directory of the project to store your environment variables. 
**For exemple :**

- HOST=localhost
- DATABASE=mydatabase
- USER=myuser
- PASSWORD=mypassword
- PORT=9000
- JWT_SECRET="your_jwt_secret_key "

### Usage 

- To start the server in development mode, run : 
```
npm run dev
```

- To start the server in production mode, run :
```
npm start
```


#### Contributing
If you have any suggestions for improving my code, please don't hesitate to contact me! :smiley:
