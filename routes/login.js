const Users = require("../Models/users");
const jwt = require ('jsonwebtoken');
const login = (req,res,bcrypt,jwt,dotenv)=>{
    const {email, password} = req.body ;
    Users.find({'email':email},(err,result)=>{
      if(result.length)
      {
        if(bcrypt.compareSync(password , result[0].password))
        {
          const {phone,name} = result[0] ;
          const api_key = process.env.api_key ;
          const token = jwt.sign ({name, email, password, phone , college}, api_key, {expiresIn : '60m'});
          res.status(200).json({token}) ;
        }
        else res.status(400).json("Wrong Password") ;
      }
      else{
        return res.status(200).json('No such user exists , Pls register !') ;
      }
    })
}
const getuser = (req,res,jwt,dotenv)=>{
    const {token} = req.params ;
  if(token){
    jwt.verify(token,process.env.api_key,(err, decodedToken)=>{
      if(err){
        res.status(200).json("Your current Session is timed out, Pls Login Again") ;
      }
      else{
      res.status(200).json(decodedToken) ;
      }
    })
  }
  else{
    res.status(400).json("Invalid token") ;
  }
}
const checkuser = (req,res,next)=>{
  const {token} = req.body ;
if(token){
  jwt.verify(token,process.env.api_key,(err, decodedToken)=>{
    if(err){
      res.status(200).json("Your current Session is timed out, Pls Login Again") ;
    }
    next() ;
  })
}
else{
  res.status(400).json("Invalid token") ;
}
}

module.exports ={
    login,
    getuser,
    checkuser
}