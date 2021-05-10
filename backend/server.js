const express = require('express')
const cors = require('cors')
const path = require('path')
const expressSession = require('express-session')

const app = express()
const http = require('http').createServer(app)

// const io = require('socket.io')(http)
// app.use(express.static(`${__dirname}/public`))

const session = expressSession({
  secret: 'coding is amazing',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
})
// Express App Config
app.use(express.json())
app.use(session)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'public')))
} else {
  const corsOptions = {
    origin: [
      'http://127.0.0.1:8080',
      'http://localhost:8080',
      'http://127.0.0.1:3000',
      'http://localhost:3000',
    ],
    credentials: true,
  }
  app.use(cors(corsOptions))
}

// const productsRoutes = require('./api/products/products.router')
const userRouter = require('./api/user/user.routes')
const authRouter = require('./api/auth/auth.routes')
const postRouter = require('./api/post/post.routes')
const { connectSockets } = require('./services/socket.service')

// routes
const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware')
app.all('*', setupAsyncLocalStorage)

//sockets experiment:
// io.on('connection', (socket) => {
//   console.log('socekt user')
//   // socket.on('fr chat-new-msg', console.log)
// })

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/post', postRouter)
connectSockets(http, session)

// Make every server-side-route to match the index.html
// so when requesting http://localhost:3030/index.html/car/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue/react-router to take it from there

app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})
app.post('/**', (req, res) => {
  res('error: post request didnt match any middleware...')
})

const logger = require('./services/logger.service')
const port = process.env.PORT || 3030
http.listen(port, () => {
  logger.info('Server is running on port: ' + port, 15, 'popo')
})
