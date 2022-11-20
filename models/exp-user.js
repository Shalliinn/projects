const Sequelize=require('sequelize');

const sequelize= require('../util/database');

const Expuser=sequelize.define('expuser',{
    id:{
    type:Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
    },
    email:{
        type:Sequelize.STRING,
        unique:true
    },
    password:{
type:Sequelize.STRING,
    },
    ispremiumuser: {
        type:Sequelize.BOOLEAN
    }
})
module.exports=Expuser;
