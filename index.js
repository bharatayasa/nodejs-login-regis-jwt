const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const route = require('./routes/index');

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

const app = express();
dotenv.config();
app.use(cors(corsOptions));
app.use(express.json());
app.use(route);

app.get('/', (req, res) => {
    try {
        return res.status(200).json({
            status: true, 
            message: "hallo from backend"
        })
    } catch (error) {
        return res.status(500).json({
            status: false, 
            message: "internal server error", 
        })
    }
})

const port = 3001; 
const host = '0.0.0.0'; 

app.listen(port, host, () => {
    console.log(`server up and running at http://${host}:${port}`);
})
