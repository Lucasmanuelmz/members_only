const postDb = require('../db/db');

exports.createPost = async(title, message, userId) => {
  const client = await postDb.connect();
  try{
  await client.query('INSERT INTO posts(title, message, user_id) VALUES ($1, $2, $3)', 
  [title, message, userId]);
  }catch(error) {
    throw Error('Failed to create the post. Please try again later.')
  }finally{
    client.release()
  }
};

exports.getAllPosts = async() => {
  const client = await postDb.connect();
  try {
     const {rows} = await client.query(`SELECT * FROM posts;`);
    console.log(rows)
  return rows;
  } catch(error) {
    throw Error('Failed to retrieve posts. Please try again later.')
  }finally{
    client.release()
  }
}

exports.getPostById = async (id) => {
  const client = await postDb.connect()
  try {
  const {rows} = await client.query(`SELECT * FROM posts WHERE id = $1`, [id]);
  return rows[0];
  } catch(error) {
    throw Error('Failed to retrieve posts. Please try again later.')
  }finally{
    client.release()
  }
  } 

exports.updatePost = async(title, message, id) => {
  const client = await postDb.connect();
  try {
    await client.query('UPDATE posts SET title = $1, message = $2 WHERE id = $3',
    [title, message, id])
  } catch(error) {
    throw Error('Failed to update the post. Please try again later.')
  }finally{
    client.release()
  }
};

exports.deletePost = async(id) => {
  const client = await postDb.connect();
  try {
  await client.query('DELETE FROM posts WHERE id = $1', [id]);
  } catch(error) {
   throw Error('Failed to delete the post. Please try again later.')
  } finally{
    client.release()
  } 
}