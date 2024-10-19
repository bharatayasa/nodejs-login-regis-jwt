const bcrypt = require('bcrypt');
const moment = require('moment');
const connection = require('../../config/db');

module.exports = {
    register: async (req, res) => {
        const { name, email, password, password_confirmation } = req.body;
    
        if (password !== password_confirmation) {
            return res.status(400).json({
                success: false,
                message: "Password and password confirmation do not match."
            });
        }

        // Tambahkan pengecekan untuk memastikan password tersedia
        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password is required'
            });
        }
    
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const sql = `INSERT INTO users (name, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())`;
            const result = await new Promise((resolve, reject) => {
                connection.query(sql, [name, email, hashedPassword], (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                });
            });
    
            const userId = result.insertId;
            const sqlUser = 'SELECT id, name, email, password, created_at, updated_at FROM users WHERE id = ?';
            const user = await new Promise((resolve, reject) => {
                connection.query(sqlUser, [userId], (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(results[0]);
                });
            });
    
            return res.status(201).json({
                success: true,
                user: {
                    name: user.name,
                    email: user.email,
                    updated_at: moment(user.updated_at).format('YYYY-MM-DD'),
                    created_at: moment(user.created_at).format('YYYY-MM-DD'),
                    id: user.id
                }
            });
    
        } catch (error) {
            console.error('Error registering user:', error);
            return res.status(500).json({
                success: false,
                message: 'An error occurred',
                error: error.message
            });
        }
    }
}