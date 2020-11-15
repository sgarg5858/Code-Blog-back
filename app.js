const express = require('express');
const db = require('./appconfig/dbconnection');
var cors = require('cors')
const app=express();
app.use(cors());

//connect to db
db.connectDB();

//Init Middleware
app.use(express.json({extended:false}))

//Define Routes
app.use('/api/user',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/post',require('./routes/api/users'));


const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server started on ${PORT}`);
});