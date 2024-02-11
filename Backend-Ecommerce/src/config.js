import mongoose from "mongoose";
const connect = mongoose.connect("mongodb://localhost:27017/Ecommerce")// connecting db 
 
//checking wether the conection is built or not
connect.then(()=>{
    console.log("Database connected successfully");
})
.catch(()=>{
    console.log("Database cannot be connected");
});

//creating a scheme
const loginSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true   
    }
});

const collect =new mongoose.model("auths", loginSchema);

export default collect;