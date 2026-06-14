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
