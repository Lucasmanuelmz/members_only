const userDb = require('../db/db');

exports.createNewUserPost = async(firstname, lastname, email, password) => {
  const client = await userDb.connect();
  try {
    await client.query('INSERT INTO users(firstname, lastname, user_email, password) VALUES($1, $2, $3, $4)',
      [firstname, lastname, email, password]);
  }catch(error) {
    throw Error('Failed to register the user. Please try again later.')
  }finally{
    client.release();
  }  
};

exports.deleteUser = async(id) => { 
  const client = await userDb.connect()
  try{
   await client.query('DELETE FROM users WHERE id = $1', [id])
  }catch(error) {
    throw Error ('Failed to delete the user. Please try again later.')
  }finally {
    client.release()
  }
};

exports.updateUserFromDb = async(firstname, lastname, email, id) => {
  const client = await userDb.connect();
  try {
  await client.query('UPDATE users SET firstname = $1, lastname = $2, user_email = $3 WHERE id = $4', 
    [firstname, lastname, email, id]);
  }catch(error) {
    throw Error('Failed to update the user information. Please try again later.')
  }finally{
    client.release()
  }
};

exports.getUserById = async (id) => { 
  const client = await userDb.connect();
  try{
  const {rows} = await client.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0];
 } catch(error) {
  throw Error('Failed to retrieve the user data. Please try again later.')
 }finally{
  client.release()
 }
};

exports.getUserByEmail = async(email) => {
  const client = await userDb.connect();
  try {
    const {rows} = await client.query('SELECT * FROM users WHERE user_email = $1', [email]);
    return rows[0]
  }catch(error) {
    throw Error( 'Failed to get user for email, Please try again leter.')
  }finally{
    client.release()
  }
};
