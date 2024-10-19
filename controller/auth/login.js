const connection = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const moment = require('moment');
dotenv.config();

const secretKey = process.env.JWT_SECRET;

module.exports = {
    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            const sql = 'SELECT * FROM users WHERE email = ?';
            const user = await new Promise((resolve, reject) => {
                connection.query(sql, [email], (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(results);
                });
            });

            if (user.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email or password.'
                });
            }

            const userData = user[0];
            const validPassword = await bcrypt.compare(password, userData.password);
            if (!validPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email or password.'
                });
            }

            const token = jwt.sign(
                {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                },
                secretKey,
                {
                    expiresIn: '1h'
                }
            );

            return res.status(200).json({
                success: true,
                user: {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    email_verified_at: userData.email_verified_at,
                    updated_at: moment(user.updated_at).format('YYYY-MM-DD'),
                    created_at: moment(user.created_at).format('YYYY-MM-DD'),
                },
                token: token,
            });

        } catch (error) {
            console.error('Error logging in:', error);
            return res.status(500).json({
                success: false,
                message: 'An error occurred',
                error: error.message
            });
        }
    }
}
