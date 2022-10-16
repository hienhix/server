const cookieParser = require("cookie-parser");
const {Server} = require("socket.io")
const User = require("./src/models/User")
const Rooms = require("./src/models/Rooms")
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors =require("cors");
const mongoose = require("mongoose");
const routerAuth = require("./src/router/auth");
const routerUser = require("./src/router/user");
const http = require("http");
const userControllers = require("./src/controllers/user.Controllers");

app.use(cors());
app.use(cookieParser());
app.use(express.json());
dotenv.config();
// Ket noi den Monggoodb
mongoose.connect(process.env.MONGOSE ,()=>{
    console.log("connect to databass succes")

});

app.use("/v1/auth", routerAuth);

app.use("/v1/user", routerUser);








app.listen(8000, ()=>{
    console.log(`Server runing on post : 8000`)
})


const server= http.createServer(app);

const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET","POST"]
    }

});

// io.on("connection", async (socket)=>{
    
//     console.log(socket.id);

//   });

  io.on("connection",async (socket) => {
    socket.on("joinViewRooms", async (arg) => {
        socket.join("viewRooms");
        const jsonAllRoom = await userControllers.getAllRoom();
        socket.join("viewRooms");
        io.sockets.in("viewRooms").emit("dataAllRooms",jsonAllRoom);
        console.log(jsonAllRoom)

    });
    socket.on("crRoom", async (idRoom,infoUser)=>{
  
        const room = await userControllers.crRoom(idRoom,infoUser);

        if(room.type == "success"){
            const allRooms = await Rooms.find();
            io.sockets.in("viewRooms").emit("dataAllRooms",allRooms);
            socket.emit("navigate","/room?id="+idRoom.idRoom)
        }
        else{
            socket.emit("error",room)
        }


    });
    
    socket.on("joneRoom", async (data,infoUser)=>{
        if(infoUser== null){
            console.log(infoUser)
            return
        }
        const room = await userControllers.joinRoom(data,infoUser);
        //console.log(room);
        if(!room){
            socket.emit("error","Phong da day")
            return
        }
        const allRooms = await Rooms.find();
        socket.leave("viewRooms");
        socket.emit("navigate","/room?id="+data.id)
        
        

        io.sockets.in("viewRooms").emit("notification",allRooms,"ban da vao phong");


    });
    socket.on("checkRoom", async (data,id_room)=>{
        // if(data== undefined){
        //     return
        // }
        // const check = await checkUserInRoom(data._id);


        
        

    });  
      socket.on("disconnect", () => {
        // socket.rooms.size === 0
      });
    socket.on("inRoom", async (idRoom,infoUser)=>{
        console.log(infoUser);
        if(infoUser == null){
            return
        }
        //data= id room

        // vao room socket id
        socket.join(idRoom);


        const jsonIdRoom = {id: idRoom} 
        

        let room = await Rooms.findOne(jsonIdRoom);
        socket.on("disconnecting", async () => {
            const findRoom = await Rooms.findOne(jsonIdRoom);
            console.log(findRoom)
            
            
            const crRoom = await userControllers.crRoom(findRoom);
            io.sockets.in(idRoom).emit("reloadRoom");
          });

        io.sockets.in(idRoom).emit("notification1","ban da vao phong"+idRoom, room);


    });
///////////////////////////////////////////////////////


socket.on("joinRoom",async (idRoom,infoUser)=>{
        socket.join(idRoom.id);
        const result = await userControllers.joinRoom(idRoom,infoUser)

        if(result.type== "error"){
            console.log(result.messega)
            socket.emit("error",result.type,result.messega)
        }
        if(result.type== "success"){
        
            if(result.code== "100"){
                console.log(result.messega+ ">>100")
                socket.emit("sendDataToClient",result.type,result.data)
                io.sockets.in(idRoom.id).emit("sendDataToClient",result.type,result.data)
            }
            if(result.code== "200"){
                console.log(result.messega+ ">>200")
                socket.emit("sendDataToClient",result.type,result.data)
                io.sockets.in(idRoom.id).emit("sendDataToClient",result.type,result.data)

            }
        }



        
        // if(test.type =="error"){
        //     socket.emit(test.type,test.messega)
        // }
        
        //const deleteRooms = await Rooms.deleteOne(idRoom);
    
        // const findDbRoom = await userControllers.setDbRoom(idRoom,infoUser)
        // io.sockets.in(idRoom.id).emit("reloadRoom",findDbRoom);
        
        // const room1 = await io.sockets.adapter.rooms[idRoom.id];
        

});
socket.on("leaveRoom",async (idRoom,infoUser)=>{
    
    const result = await userControllers.outRoom(idRoom,infoUser)
    console.log(">>> 000 ")
    if(result.code == 100){
        console.log(">>> 100 ")
        return
    }
    if(result.code == 200){
        console.log(">>> 200 ")
        io.sockets.in(idRoom.id).emit("sendDataToClient",result.type,result.data)
        socket.leave(idRoom.id);
    }
}

)









































///////////////////////////////////////////////////////////////////////////
  });
  

server.listen(3001,()=>{
    console.log("Server socket runing");
});

const checkUserInRoom = async (id)=>{

    const user = await Rooms.find();
    const func_check =  user.map((data,index)=>{
        //console.log(data.player)
            
        const  sdad =data.player.map(  (data,index)=>{
                    try {
                        if(data._id==id){
                            return data
                        }
                        else{
                            return false;
                        }
                        
                    } catch (error) {
                        console.log(error)
                        return false;
                        
                    }

                })

        //console.log(sdad) 
        try {
            if(data.player.includes(sdad[0])){
                
                if(data.id!== null){
                    return data.id;
                }
                
            }
        } catch (error) {
            console.log(error)
            return false
        }

    })
    
    data = func_check.filter(function( element ) {
        return element !== undefined;
     });
     
     console.log(data)
     return data;

}


//b6093bf2-90e3-4084-8081-129acc955948