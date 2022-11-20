const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product=require('./models/product')
const User=require('./models/users');
const Cart=require('./models/cart')
const CartItem=require('./models/cart-item')
const Order=require('./models/order')
const OrderItem=require('./models/order-item')
const app = express();
var cors=require('cors');

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', 'views');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req,res,next)=>{
    User.findByPk(1)
    .then(user=>{
        req.user=user;
        next();
    })
    .catch(err=>console.log(err))
})
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'})
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User)
Cart.belongsToMany(Product,{through:CartItem});
Product.belongsToMany(Cart,{through:CartItem});

User.hasMany(Order)
Order.belongsTo(User)
Order.belongsToMany(Product,{through:OrderItem});
Product.belongsToMany(Order,{through:OrderItem});

sequelize
//.sync()
.sync({force:true})
.then(result=>{
   return User.findByPk(1)
    //console.log(result);
})
.then(user=>{
    if(!user){
       return User.create({name:"shalin" , email:"shalin4300@g.com",phonenumber:"12344"})
    }
    return user ;
})
.then(user=>{
   // console.log(user);
  return user.createCart();
    
})
.then(cart=>{
    app.listen(3000)
})
.catch(err=>{
    console.log(err);
})


//product=[{name:'shalin'},{name:'harsh'}]
// const productss=[]
// app.post('/',(req,res,next)={
//     productss.push({name:req.body.name})
// })