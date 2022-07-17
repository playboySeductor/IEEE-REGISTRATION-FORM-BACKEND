const Users = require("../Models/users");
CLIENT_URL="http://localhost:5000";
const cloudinary = require ('cloudinary').v2;

const register = (req,res,nodemailer,jwt)=>{
    console.log(req.body) ;
    const { email,name,password,username,profile_pic,type,gender } = req.body ;
    if(!email || !name || !password || !username || !gender){
        return res.status(200).json('Pls Enter the credentials properly') ;
    }
    Users.find({'email':email},async(err,result)=>{
        if(result.length){
            res.status(200).json("User with same mail already exists !") ;
        }
        else{
        const token = jwt.sign ({name, email, password, username ,profile_pic,type,gender }, process.env.ACTIVATE_API_KEY, {expiresIn : '20m'});
        let transporter = nodemailer.createTransport({
            service:'gmail',
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: '', // generated ethereal user
              pass: '', // generated ethereal password
            },
            tls:{rejectUnauthorized:false}
          });
            let mailOptions = {
                from : '',
                to:email,
                subject: "Verification mail from NCrypto",
                text : "Welcome to NCrypto ! ",
                html : `
                <h2>Please click on the given link to activate your account</h2>
                <a href="${CLIENT_URL}/authentication/${token}">Click Here to verify</a>
                <p>Pls do it within 20 min</p>
                <p>If the above link is not working then browse to ${CLIENT_URL}/authentication/${token} </p>
                `
              }
              let info = transporter.sendMail (mailOptions, (error, info) => {
                if(error) {
                  console.log (error);
                  res.status(500).json ({yo : 'error'});
                }else {
                  console.log ('Message sent : ' + info.response);
                  res.status(200).json ('Mail sent successfully !');
                };
                return res.end();
              });
        }
    })
}
const verify = (req,res,bcrypt,jwt)=>{
    const {token} = req.params;
    if(token){
        jwt.verify(token, process.env.ACTIVATE_API_KEY, (err, decodedToken)=>{
          if(err){
            res.status(200).json("Session timed out , Pls try again") ;
          }
          else{
            const {name, email, password, username,profile_pic,type,gender} = decodedToken;
            Users.find({'email':email},(err,result)=>{
              if(result.length){
                res.status(200).json('You are already registered , Pls go and login') ;
              }
              else{
                const hash = bcrypt.hashSync(password) ;
                new Users({
                  name,
                  email,
                  password:hash,
                  username,
                  profile_pic,
                  type,
                  gender
                }).save((err,result)=>{
                   if(err){
                     console.log(err)
                   }
                   return res.status(200).json("Your Account is verified , login to our app") ;
                })
              }
            })
          }
        })
    }
    else{
      res.status(200).json("Invalid token , Pls Register again") ;
    }
}
module.exports = {
    register,
    verify
}