const path = require('path');
const fs=require('fs')
const express = require('express');
const bodyParser = require('body-parser');
const helmet=require('helmet');
const https=require('https')
const dotenv = require('dotenv');
dotenv.config();
//var compression=require('compression')
const sequelize = require('./util/database');
const expenseRoutes=require('./routes/tracker')
const userRoutes=require('./routes/expusers')
const premiumRoutes=require('./routes/premium');
const resetPasswordRoutes = require('./routes/resetpassword')
const files=require('./models/file')
const Forgotpassword = require('./models/forgotpassword');
const Order = require('./models/order');

const Expuser=require('./models/exp-user')
const Expense=require('./models/expenseuser')
const morgan=require('morgan')
//const Order=require('./models/order')
const app = express();
app.set('views', 'views');
app.use(bodyParser.json({ extended: false }));

const accessLogstream=fs.createWriteStream(path.join(__dirname,'access.log'),{flage:'a'})
app.use(helmet());
app.use(morgan('combined',{stream:accessLogstream}))
//app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.json());
var cors=require('cors');
app.use(cors());
//app.use(compression());

//const privatekey=fs.readFileSync('server.key');
//const certificte=fs.readFileSync('server.cert');
app.use(userRoutes)

app.use(expenseRoutes)

app.use('/purchase',premiumRoutes)
app.use('/password', resetPasswordRoutes);

Expuser.hasMany(Expense);
Expense.belongsTo(Expuser)

 Expuser.hasMany(Order);
 Order.belongsTo(Expuser);

 Expuser.hasMany(Forgotpassword);
Forgotpassword.belongsTo(Expuser);

Expuser.hasMany(files);
files.belongsTo(Expuser);

sequelize
.sync()
.then(result=>{
    //console.log(result);
    // https.createServer({key:privatekey,cert:certificte},app)
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
})