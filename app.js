const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const userRouter = require('./routes/userRoutes');
const postsModel = require('./models/postsModel');
const session = require('express-session');
const passport = require('passport');
const postRouter = require('./routes/postRutes');
const SECRET_SESSION = process.env.SECRET_PASS;
const asyncHandler = require('express-async-handler');

app.use(express.static(path.join(__dirname, 'src')));
app.use(session({secret: SECRET_SESSION , resave: false, saveUninitialized: false}));
app.use(passport.session())
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next()
})

app.get('/', asyncHandler(async (req, res) => {
  const messages = await postsModel.getAllPosts()
  res.render('index', {messages})
}));
app.use('/', userRouter);
app.use('/', postRouter);

app.listen(3000, (error) => {
  if(error) {
    console.log('Erro ao iniciar o servidor')
  } else {
    console.log('Servidor iniciado')
  }
});