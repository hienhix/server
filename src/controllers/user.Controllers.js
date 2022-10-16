const User = require("../models/User")
const Rooms = require("../models/Rooms")
const PlayerInRoom = require("../models/PlayerInRoom")


const userControllers = {
    getAllUser: async (req,res)=> {
        try {
            const allUser = await User.find();
            res.status(200).json(allUser);
        } catch (error) {
            console.log(error)
        }
    },
    deleteUser: async (req,res)=> {
        try {
            const delete_user = await User.findOneAndDelete(req.params.id);
            res.status(200).json(delete_user);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getListRooms: async (req,res)=> {
        try {
            const allRooms = await Rooms.find();
            res.status(200).json(allRooms);
            //console.log(allRooms);
        } catch (error) {
            console.log(error)
        }
    },
    crRoom: async (data,infoUser)=>{
        let jsonPlayer = await PlayerInRoom.findOne({user: infoUser.user})
            
        try {
            let jsonPlayer = await PlayerInRoom.findOne({user: infoUser.user})
            if(jsonPlayer == null){

                const newRoom = await new Rooms({
                    id: data.idRoom,
                    
                    password: data.password,
                    bets: data.bets
                });
                const room = await newRoom.save();
                return {type: "success", code:"200" , messega:"Successful room creation"}    

            }
            if(jsonPlayer !== null){
                return {type: "error", code:"404" , messega:"You are in another room"}
            }

        } catch (error) {
            console.log(error)
        }
    },
    joinRoom: async (jsonIdRoom,infoUser)=>{
        try {
            //tim room tu db
            let jsonroom = await Rooms.findOne(jsonIdRoom)
            //let jsonPlayerInRoom = await PlayerInRoom.find(jsonIdRoom)
            //tim all user theo id room
            let jsonPlayerInRoom = await PlayerInRoom.find(jsonIdRoom)
            //tim User vao phong
            let jsonPlayer = await PlayerInRoom.findOne({user: infoUser.user})
            
            //check phong da day chua 
            if(jsonPlayerInRoom.length >= 8){
                return {type: "error",code : "404",messega:" Room full slot"}
            }
            if(jsonPlayer !== null){
            //check phong co ton tai khong
            if(jsonroom?.id == undefined ){
                
                return {type: "error",code : "404",messega:" Room does not exist"}
               

            }
            if(jsonPlayer?.id !== jsonroom.id ){
                
                return {type: "error",code : "404",messega:" You are in another room"}
               

            }
            
            }
            
            const check = async (jsonPlayerInRoom,jsonIdRoom,infoUser)=>{
                const check = await jsonPlayerInRoom.map((i)=>{
                    
                    // console.log(i.id)
                    // console.log(jsonIdRoom.id)
                    if(i.id==jsonIdRoom.id && i.user == infoUser?.user){
                        return true;
                    }
                    else{
                        return false
                    }
                })
                return check;


            }
            const checkf = await check(jsonPlayerInRoom,jsonIdRoom,infoUser)
            
            if(checkf.includes(true)){
                const i = await userControllers.reloadInfoRoom(jsonIdRoom)

                console.log("code: 100")
                return {type:"success", messega: "enter to room of success :",code:"100", data: i}
            }
            else{
                const h = await userControllers.addUserOnRoom(jsonIdRoom,infoUser)
                
                const i = await userControllers.reloadInfoRoom(jsonIdRoom)
                console.log("code: 200")
                
                return {type:"success", messega: "enter to room of success :",code:"200",data: i}
    
            }

            

            // if(room.player  ==null ){
                
            //     room.player=[]
            // }
            // if(room.player?.length  >= 8 ){
            //     return false

            // }

            // room.player.push(infoUser)

            // let crUser = await User.findOne(infoUser)
            // const status = await Rooms.updateOne(data, {$set: room});
            // return status;
        } catch (error) {
            console.log(error)
        
        }
    },
    setDbRoom: async (idRoom,infoPlayer)=>{
        try {
            const dataRoom= await Rooms.findOne(idRoom);

            dataRoom.player.push(infoPlayer);
            uniquedata = await userControllers.unique(dataRoom.player)
            dataRoom.player = [];
            dataRoom.player = uniquedata;
            console.log(dataRoom)
            const resetDbRoom = await Rooms.updateOne(idRoom,{$set: dataRoom});
            const dataRoomTest= await Rooms.findOne(idRoom);
            return dataRoomTest;
            
        } catch (error) {
            console.log(error)
            
        }
        
        
    },
    findUserOnRoom: async (idRoom,infoPlayer)=>{

        try {
            const dataRoom= await Rooms.findOne(idRoom);
            console.log(dataRoom.player);
            const bolen =dataRoom.player
            bolen.map((ee=>{
                if(ee._id==infoPlayer._id){
                    console.log("ban da o trong phong")
                }
            }))
            console.log("ban khong o trong pong")
        } catch (error) {
            console.log(error)
            
        }

        
        
    },
    addUserOnRoom: async (jsonIdRoom,infoUser)=>{

        try {
            const addPlayerToRoom = await new PlayerInRoom({
                id: jsonIdRoom.id,
                avarta: infoUser.avarta,
                inGame: infoUser.inGame,
                user: infoUser.user
            });
            const room = await addPlayerToRoom.save();

        } catch (error) {
            console.log(error)
            
        }


    },
    
    reloadInfoRoom: async (jsonIdRoom) =>{
        let jsonroom = await Rooms.findOne(jsonIdRoom)
        let jsonPlayerInRoom = await PlayerInRoom.find(jsonIdRoom)
        jsonroom.player = jsonPlayerInRoom;
        return jsonroom

    },
    outRoom: async (jsonIdRoom,infoUser)=>{
        try {

            const jsonInGame = {inGame: infoUser.inGame};

            const deleteUseOnRoom = await PlayerInRoom.deleteOne(jsonInGame)
            const lengthUserOnRoom  = await PlayerInRoom.find(jsonIdRoom)

            if(lengthUserOnRoom.length < 1 ){
            const deleteRoom = await Rooms.deleteOne(jsonIdRoom)
            console.log("100"+lengthUserOnRoom)
            return {type:"success", messega: "leave the room successfully :",code: 100}
            }
            else{
                const i = await userControllers.reloadInfoRoom(jsonIdRoom)
                console.log("200"+i)
                return {type:"success", messega: "leave the room successfully :",code: 200,data: i}
            }

    
    
                
        } catch (error) {
            console.log(error)
            
        }


    },
    reloadInfoRoom: async (jsonIdRoom) =>{
        let jsonroom = await Rooms.findOne(jsonIdRoom)
        let jsonPlayerInRoom = await PlayerInRoom.find(jsonIdRoom)
        jsonroom.player = jsonPlayerInRoom;
        return jsonroom

    },
    getAllRoom: async ()=>{
        try {
            let jsonroom = await Rooms.find()
            return jsonroom;

        } catch (error) {
            console.log(error)
            
        }


    }


}

module.exports = userControllers;