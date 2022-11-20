const jwt=require('jsonwebtoken')
const Expuser=require('../models/exp-user')


const authenticate=(req,res,next)=>{
    try{
        const token=req.header('Authorization')
        console.log(token,'8');
        const user=jwt.verify(token,'mysecretekey');
        console.log(user.userId,'10');
        Expuser.findByPk(user.userId).then(user=>{
            console.log(JSON.stringify(user),'12')
            req.user=user;
            next()
        })
    }catch(err){
        console.log(err);
        return res.status(401).json({success:false})
        }
}
module.exports={
    authenticate
}