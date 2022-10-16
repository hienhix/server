const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken")


const authControllers = {
    registerUser: async (req,res)=>{
        console.log("register success")
        try {
            const selt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, selt);
            const newUser = await new User({
                user: req.body.user,
                email: req.body.email,
                password: hashed,
                inGame: req.body.inGame,
                inrooms: "",
                avarta: "https://peaku.co/img/logo-blue.png"
            });

            const user = await newUser.save();
            res.status(200).json(user);
            console.log("register success");
            
        } catch (error) {
            res.status(500).json(error);
            console.log(error)
        }

    
    },
    signAccessToken: (user)=>{
        return jwt.sign({
            id: user.id,
            admin: user.admin
        },
        process.env.SECRET_ACCESS_TOKEN

        )

   },

    loginUser: async (req,res) => {
            try {
                //Tim user trong DB
                const user = await User.findOne({user :req.body.user});
                if(!user) {
                    return res.status(404).json("User khong ton tai");
                };
                //So sanh password da ma hoa vs DB
                validPassword = await bcrypt.compare(
                    req.body.password,
                    user.password
                )
                if(!validPassword){
                    return res.status(404).json("Sai mat khau");
                }

                if(user && validPassword){
                    const acccessToken = authControllers.signAccessToken(user);
                    //const {password, ...others} = user._doc;
                    //delete user.password;
                    res.status(200).json({user,acccessToken});
                    

                }
                

                
            } catch (error) {
                res.status(404).json(error);
            }
    }

    


}

module.exports = authControllers;