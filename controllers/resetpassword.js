const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require('../models/exp-user');
const Forgotpassword = require('../models/forgotpassword');
const { LONG } = require('mysql2/lib/constants/types');

exports.forgotpassword = async (req, res) => {
    try {
        console.log(req.body,'11');
        const { email } =  req.body;
       
        const user = await User.findOne({where : { email:email }});
        if(user){
            const id = uuid.v4();
          await user.createForgotpassword({ id :id, active: true })
         return res.status(200).json({message: 'Link to reset password sent to your mail ', sucess: true})

            }
          else {
            throw new Error('User doesnt exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}

exports.resetpassword = (req, res) => {
    const id =  req.params.id;
    console.log(id,'57');
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()
        }
        else{
            res.status(200).json('link is no longer active')
        }
    }).catch(err=>{
        console.log(err);
    })
}

exports.updatepassword = async (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        console.log(req.query,'86');
        console.log(req.params,'87');
       const resetpasswordrequest = await Forgotpassword.findOne({ where : { id: resetpasswordid }})
            console.log(resetpasswordrequest.expuserId,'89');
          const user= await User.findOne({where: { id : resetpasswordrequest.expuserId}})
                 console.log('userDetails', user)
                if(user) {
                    //encrypt the password
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        console.log(salt,'101');
                        bcrypt.hash(newpassword,salt,function(err, hash) {
                            // Store hash in your password DB.
                            console.log(hash,'83');
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
    
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}


