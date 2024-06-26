# toDoList running instructions

## Setup MySQL Database

Setup a MySQL instance with database named 'toDoList'.

`CREATE DATABASE toDoList;`

## Configure Environmental Variables

Rename /express/#env to .env

Rename /next/toDoList/#env.local to .env.local

Update the MySQL configuration in /express/.env

```
PORT=3001
DATABASE_URL=MySQL://{MySQL username}:{MySQL password}@{MySQL uri and port if locally running eg 'localhost:3006'}/toDoList
```

Update /next/toDoList/.env.local with the information included in the email to Annika.

```
HOST_NAME=http://localhost:3000
NEXT_PUBLIC_EXPRESS_HOST_NAME=http://localhost:3001

API_POST_URL= please see shared in email
API_BODY= please see shared in email
```

## Install npm Packages & Migrate Prisma

Navigate to the /express directory and run:

`npm install`

Navigate to the /next/toDoList directory and run:

`npx prisma migrate dev --name init'.`

## Run the Application

On separate terminal windows navigate to the /express and /next/toDoList directories and run:

For development mode:
`npm run dev`
For production mode:
`npm run build && npm run start`

## Access the Application

Open your browser and navigate to http://localhost:3000 to view the application.
