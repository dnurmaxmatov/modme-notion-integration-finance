import express from 'express';
import 'dotenv/config.js'
import { createPageNotion } from './functions/createPageNotion.js';


import './modmeToken/index.js'

const app = express();


app.use((err, req, res, next) => {
    console.log(err)
    next()
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running ${process.env.PORT} port`)
})




