const connection = require('../../config/db');

module.exports = {
    getAllUsers: async (req, res) => {
        const sql = 'SELECT * FROM users'; 
    
        try {
            const data = await new Promise((resolve, reject) => {
                connection.query(sql, (error, result) => {
                    if (error) {
                        reject(error)
                    }
                    resolve(result)
                })
            })
    
            return res.status(200).json({
                message: "succes to get data", 
                data: data
            })
    
        } catch (error) {
            return res.status(500).json({
                status: false, 
                message: "internal server error", 
            })
        }
    }
}