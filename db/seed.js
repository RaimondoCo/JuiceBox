// grab our client with destructuring from the export in index.js
const { 
  client,
  getAllUsers,
  createUser,
  updateUser
 } = require('./index');


// this function should call a query which drops all tables from our database
async function dropTables() {
  try {
    console.log("starting to drop tables")
    await client.query(`
DROP TABLE IF EXISTS users;
    `);
  } catch (error) {
    console.log("error dropping the tables: ", error)
    throw error; // we pass the error up to the function that calls dropTables
  }
}

async function createInitialUsers() {
  try {
    console.log("starting to create users..");
    const albert = await createUser({username:'albert', password:'bertie99', name:'Al Bert', location:'Sydney, Australia'})
    console.log(albert);
    const sandra = await createUser({username:'sandra', password: '2sandy4me', name:'Just Sandra', location:`Ain't tellin`})
    console.log(sandra);
    const glamgal = await createUser({username:'glamgal', password: 'soglam', name:'Joshua', location:'Upper East Side'})
    console.log(glamgal);

    console.log("Finished creating users!")
  } catch (error){
    console.log("error creating users")
    throw error;
  }
}

// this function should call a query which creates all tables for our database 
async function createTables() {
  try {
    console.log("starting to build table")
    await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username varchar(255) UNIQUE NOT NULL,
      password varchar(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      active BOOLEAN DEFAULT true
    );
    `);
  } catch (error) {
    console.log("error building the database: ", error)
    throw error; // we pass the error up to the function that calls createTables
  }
}

async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
  } catch (error) {
    throw error;
  } 
}


async function testDB() {
  try {  
    console.log("starting to test the database")
    const users = await getAllUsers();
    console.log("getAllUsers:", users);
    console.log("Calling updateUser on users[0]")
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY"
    });
    console.log("Result:", updateUserResult);
    console.log("Finished database testing")
  } catch (error) {
    console.error("error testing the database: ", error);
    throw error;
  } 
}

// testDB();



rebuildDB()
.then(testDB)
.catch(console.error)
.finally(()=>client.end());


