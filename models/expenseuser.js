const Sequelize=require('sequelize');
const sequelize=require('../util/database')

const Expenseuser=sequelize.define('expene',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
        },
    expence:{
   type:Sequelize.INTEGER
    },
    description:{
        type:Sequelize.STRING,
        unique:true
    },
    category:{
        type:Sequelize.STRING
    }
    
})

module.exports=Expenseuser