
const getExpenes=(req,where)=>{
    return req.user.getExpenes(where)
}
module.exports={
    getExpenes 
}  