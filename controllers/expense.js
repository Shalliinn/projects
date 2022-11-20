const Expenseuser=require('../models/expenseuser')
const Expuser=require('../models/exp-user')
const S3service=require('../services/s3services')
const Userservices=require('../services/userservices')
const files=require('../models/file')
//var  Expense_Per_Page=2


exports.postexpense=(req,res,next)=>{
    const expence=req.body.expence
    const description=req.body.description
    const category =req.body.category
    //.log(req.user.userId,'8');
  //Expense_Per_Page=req.body.exp_per_page;
    
    const id=req.user.id
    Expenseuser.create({
        expence:expence,
        description:description,
        category:category,
        expuserId:id
    })
    .then((data)=>{
        res.json(data)
    }).catch(err=>console.log(err))
}

exports.getexpense=(req,res,next)=>{
  console.log(req.params.expe,'19');
   console.log(req.query.page,'27')
   const page=req.query.page;
   var total
   const Per_Page=+req.params.expe;
   console.log(Per_Page,'34')
   req.user.getExpenes().then((expence)=>{;
  total=expence.length
   }) 
if(req.user.ispremiumuser){
   return Expuser.findAll({include:['expenes']})
    .then((alluser)=>{
       return req.user.getFiles()
       .then((files)=>{
     return req.user.getExpenes({offset:(page-1)*Per_Page,limit:Per_Page}).then((exp)=>{
      res.status(200).json({user:alluser,expense:exp,ispremiumuser:req.user.ispremiumuser,name:req.user.name,file:files,page:page,Expense_Per_Page:Per_Page,total:total})

       })
       })

     })
.catch (error=>{
    console.log(error)
})
}
else{
    Expenseuser.findAll({where: {expuserId:req.user.id},offset:(page-1)*Per_Page,limit:Per_Page})
    .then((alluser)=>{
        return req.user.getFiles()
       .then((files)=>{
        
 //  console.log(exp);
        res.status(200).json({user:alluser,ispremiumuser:req.user.ispremiumuser,file:files,page:page,Expense_Per_Page:Per_Page,total:total})
    })
     })
.catch (error=>{
    console.log(error)
})
}
 }
 
 exports.deleteexpense=(req,res,next)=>{
   const Eid=req.params.id; 
   Expenseuser.destroy({where: {id:Eid}})
   .then((data)=>{
    res.sendStatus(200)
   })
.catch(err=>console.log(err))
}

exports.downloadexpense= async (req,res)=>{
    try{
   // const expenses= await req.user.getExpenes();
    const expenses= await Userservices.getExpenes(req)
  //  console.log(expenses,'55');
  const stringifiedExpenses=JSON.stringify(expenses)
  const userId=req.user.id;
  const filename=`Expense${userId}/${new Date}.txt`;
 // const fileUrl=await uploadToS3(stringifiedExpenses,filename);
  const fileUrl=await S3service.uploadToS3(stringifiedExpenses,filename);

  files.create({
    fileUrl:fileUrl,
    expuserId:userId    
  })
  Expuser.findAll({include:['files']}).then((user)=>{
    res.status(200).json({fileUrl,success:true,user:user,id:userId})
  })
  
  
    }catch{
        console.log(err);
        res.status(500).json({fileUrl:'',success:false,err})

    }
}



exports.postEditexpense = (req, res, next) => {
    const id = req.params.id;
    Expenseuser.findByPk(id)
    .then(exp=>{ 
        exp.expence=req.body.expence
        exp.description=req.body.description
        exp.category=  req.body.category
      return  exp.save();
  })
  .then(result=>{
    console.log("updated product");
    res.json(result)
  })
}


// exports.getEditexpence = (req, res, next) => {
//     const prodId = req.params.id;
//     console.log(prodId,'line 39');
//     Expenceuser.findByPk(prodId)
//     .then((exp)=>{
//         console.log(exp);
//         res.json(exp)
//         res.redirect('/edit-expense')
//      })
// .catch (error=>{
//     console.log(error)
// })
//   };



