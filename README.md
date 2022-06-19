## LightBnB Project

LightBnB is a web application that uses SQL as its database. It allows users to search for a property for the night by filtering the database.

## ERD 
!["screenshot of ERD"]()
This screenshot shows how the database was designed to create LightBnB. 

##Dependencies

- Bcrypt
- Bodyparser
- Cookie-session
- Express
- Nodemon
- Pg
- PostgreSQL

## Getting Started

## Application Setup

- Open the LightBnB_WebApp-master 
- Install all dependencies (using the `npm install` command).
- Run the development web server using the `npm run local` command. 
- Type in `http://localhost:3000/` in the browser.
- Find a property to spend a night at on LightBnB!

## Database Setup

- Clone the remote repo to a folder named lightbnb and open it.
- Type `psql` in your CLI to start PostgreSQL.
- Create the database by typing `CREATE DATABASE lightbnb;` as a command.
- Type `\c lightbnb` to connect to the database.
- Add all tables to the database by typing `\i migrations/01_schema.sql`.
- Add all seed data by typing `\i seeds/02_seeds.sql`.




