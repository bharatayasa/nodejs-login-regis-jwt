const express = require('express');
const route = express.Router()

const register = require('../controller/auth/register');
route.post('/register', register.register)

const login = require('../controller/auth/login');
route.post('/login', login.login)

const users = require('../controller/users/index');
route.get('/users', users.getAllUsers)

module.exports = route
