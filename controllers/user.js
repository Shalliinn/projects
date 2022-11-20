// const User=require(('../models/user'))


// exports.postuser=(req,res,next)=>{
//     const name = req.body.name;
// console.log(name,'1');

//     const email = req.body.email;
//     console.log(email,'2');
//     const phonenumber = req.body.phonenumber;
    
//  User.create({
//     name:name,
//     email:email,
//     phonenumber:phonenumber
// })
// //console.log(data)
// .then((data)=>{
//     res.status(201).json({newUserDetail:data})
// }).catch(err=>console.log(err))
   

// }



// exports.getuser=(req,res,next)=>{
//          User.findAll()
//          .then((users)=>{
//             res.status(200).json({allUsers:users})
//          })
//     .catch (error=>{
//         console.log(error)
//     }) 
// }


// exports.deleteuser=(req,res,next)=>{
//     const uId=req.params.id;
//     console.log('line 55');
//     console.log(uId,'line 54');
//    User.destroy({where: {id:uId}})
//    .then((data)=>{
//     res.sendStatus(200)
//    })
// .catch(err=>console.log(err))
// }
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

 const signup = (req, res)=>{
    const { name, email, password } = req.body;
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            // Store hash in your password DB.
            if(err){
                console.log('Unable to create new user')
                res.json({message: 'Unable to create new user'})
            }
            User.create({ name, email, password: hash }).then(() => {
                res.status(201).json({message: 'Successfuly create new user'})
            }).catch(err => {
                res.status(403).json(err);
            })

        });
    });
}

function generateAccessToken(id) {
    return jwt.sign(id ,process.env.TOKEN_SECRET);
}

const login = (req, res) => {
    const { email, password } = req.body;
    console.log(password);
    User.findAll({ where : { email }}).then(user => {
        if(user.length > 0){
            bcrypt.compare(password, user[0].password, function(err, response) {
                if (err){
                console.log(err)
                return res.json({success: false, message: 'Something went wrong'})
                }
                if (response){
                    console.log(JSON.stringify(user))
                    const jwttoken = generateAccessToken(user[0].id);
                    res.json({token: jwttoken, success: true, message: 'Successfully Logged In'})
                // Send JWT
                } else {
                // response is OutgoingMessage object that server response http request
                return res.status(401).json({success: false, message: 'passwords do not match'});
                }
            });
        } else {
            return res.status(404).json({success: false, message: 'passwords do not match'})
        }
    })
}

module.exports = {
    signup,
    login

}