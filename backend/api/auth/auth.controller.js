const authService = require('./auth.service')

module.exports = {
  login,
  logout,
  signup,
}

async function login(req, res) {
  const { username, password } = req.body
  try {
    const user = await authService.login(username, password)
    req.session.loggedInUser = user
    console.log('logged in! ', req.session.loggedInUser)
    res.json(user)
  } catch (err) {
    console.log('error while trying login: ', err)
    res.status(500).send({ err: 'Failed to Login' })
  }
}

async function signup(req, res) {
  try {
    const { username, password, fullname, mail } = req.body
    // Never log passwords
    const account = await authService.signup(username, password, fullname, mail)
    const user = await authService.login(username, password)
    req.session.user = user
    res.json(user)
  } catch (err) {
    console.log(err)
    res.status(500).send({ err: 'Failed to signup' })
  }
}

async function logout(req, res) {
  try {
    req.session.destroy()
    res.send({ msg: 'Logged out successfully' })
  } catch (err) {
    res.status(500).send({ err: 'Failed to logout' })
  }
}
