const path=require('path')
const express=require('express')

const bodyParser=require('body-parser');
const sequelize = require('./util/database');

const app=express();

app.set('views','views')
app.use(bodyParser.json({extended:false}))
app.use(express.static(path.join(__dirname, 'public')));

var cors=require('cors');
app.use(cors());

const expenseRoutes=require('./routes/tracker')
app.use(expenseRoutes)

sequelize
.sync()
.then(result=>{
    //console.log(result);
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
})