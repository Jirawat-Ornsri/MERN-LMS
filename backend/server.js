require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI 


