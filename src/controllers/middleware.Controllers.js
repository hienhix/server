
const jwt = require("jsonwebtoken");


const middleware = {
    verifyToken : (req,res,next)=> {
        const token = req.headers.token;
        if(token){
            jwt.verify(token, process.env.SECRET_ACCESS_TOKEN , (err, user)=>{
                if(err){
                    return res.status(404).json("Token khong hop le")

                }
                req.user = user;
                console.log(user);
                next();

            })

        }
        else{
            return res.status(404).json("ban chua co Token");
        }

    },
    verifyTokenAndAdmin: (req,res,next) => {
        middleware.verifyToken(req,res,()=> {
            if(req.user.id == req.params.id|| req.user.admin){
                next();
            }
            else{
                res.status(404).json("Ban khong co quyen")
            }
        }
        )

    }
};

module.exports = middleware;

