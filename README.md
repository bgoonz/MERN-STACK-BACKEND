# MERN-STACK-BACKEND

### Model View Controller

- Model: Data
- View: UI (N/A here because we're usin React)
- Controller: Logic

#### SQL vs NoSQL

tables and records (SQL) are called collections and documents in NoSQL

- SQL: Relational Databases (MySQL, Postgres, SQLite, Oracle, Microsoft SQL Server) _enforces strict data schema_ **Relations are a core feature... Records are related**
- NoSQL: Non-Relational Databases (MongoDB , Firebase, DynamoDB, Cassandra, etc) _enforces no data schema_ **Less focus on relations ...independent documents**

**Common Use Cases**

- SQL: shopping carts, contacts, users, etc
- NoSQL: blog posts, comments, messages, etc

mongodb+srv://bgoonz:Ruletheweb2023!@cluster0.tf5ehoc.mongodb.net/?retryWrites=true&w=majority

https://cloud.mongodb.com/v2/643dc6f4d31bc92e7f8dc9b6#/metrics/replicaSet/643dc73e81f8fc67caa856d3/explorer/test

### Application Data:

**Users**

- name
- email
- password
- image

**Places**

- title
- description
- address
- Location
- image

- One user can create multiple places and one place can be created by only a single user.


---


##### Authentication

**Hashing Passwords (done one backend)**

```bash
npm install bcryptjs
```

> in the code below `hashedPassword = await bcrypt.hash( password, 12 );` 12 is the number of rounds of hashing (salting) we want to do. the more rounds the more secure the password but the longer it takes to hash the password.
```js
  let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash( password, 12 );
    } catch ( err ) {
        const error = new HttpError(
            'Could not create user, error hashing password.',
            500
        );
        return next( error );
    }
    

```





