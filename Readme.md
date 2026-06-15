# Backend series

# setup for import files
    1. Alway import file using import not require
        steps: go to package.json and add ("type": "moduel")

# install nodemon 
    -> it restart server whenever changes come in file (without it need to restart menually when changes come in file)

    Two way to install any package 
    1. installed globally on my system (not add in package.json so not download when other person take my project clone)
        npm install -g nodemon # or using yarn: yarn global add nodemon
    2. DevDependency add in my project (Alway use in production code it add package.json file and when other person take my project clone it install)
        npm install --save-dev nodemon # or using yarn: yarn add nodemon -D

# install prettier 
    use for file formating install devdependency so all developer in same formate
        => npm install -D prettier

    After install setting (create 2 file)
    1. .prettierrc => it store all setting of prettier
    2. .prettierignore => it store which file ignore from prettier setting

# install mongoose, express, dotenv
    => npm i mongoose
    => npm i express
    => npm i dotenv

# Connect mongodb to the app server
    src -> db -> index.js (MONOGODB connection code here).

# Import setting 
    All dependency import using import not require so code make consistancy (see index.js)
    step1 : IMPORT => import dotenv from 'dotenv'
    step2 : SET PATH => dotenv.config({path: './env'})
    step3 : RUN EVERY TIME SET : go to package.json file inside script add {-r dotenv/config --experimental-json-modules}

# Install cookie-parser and cors package
    1. cooki-parser : middle-waare frontend se req atta hai to pahle cookie dekhta h phir response deta hai. ek tarah se middleware ka kam karta hai
    2. cors : cross origin resource sharing solving the cors problem

# Create utils file 
    1. ApiError.js -> Handle all error related to api
    2. ApiResponse.js -> formate of response of api
    3. asyncHandler.js -> formate for async and promise handle

# Create models
    1. user.model.js -> store user schema 
    2. video.model.j -> store video schem

# Install mongoose-aggregate-paginate, bcrypt
    npm i mongoose-aggregate-paginate-v2
    npm i bcrypt  // help to hash passwords
    npm i jsonwebtoken // use for decript the password ("Read docs if need")