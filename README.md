# Japanese Kana Flashcard Web App

A Japanese Kana Flashcard Web App for practicing Japanese Kana, e.g., Hiragana and Katakana.

The web-app was built to run locally.

Currently, only Katakana is available.

# To Use the Web App 
## Setup the Web App 
- Clone this repo: https://github.com/sakan811/kana-flashcard-web-app.git
- Open **Git Bash** terminal and navigate to the root of the project.
- In the **Git Bash** terminal, run ```chmod +x setup.sh``` and ```./setup.sh``` respectively.

## Setup a Database
- Install **[PostgreSQL](https://www.postgresql.org/)**
- install **[pgAdmin](https://www.pgadmin.org/)**
- Enter your superuser's **password** in **.env** file for **DB_PASSWORD** variable. 
- Run **pgAdmin**
- Create **kana_db** database via **SQL** console in **pgAdmin**

## Run the Web App
- Navigate to the **backend** directory and run ```node server.js```
- Navigate to the **frontend** directory and run ```npm start```
- Navigate to http://localhost:3000/