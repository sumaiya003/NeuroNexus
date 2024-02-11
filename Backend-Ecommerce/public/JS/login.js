import express from "express";
import bcrypt from "bcrypt";
import path from "path";
import collect from "./config.js";
import { name } from "ejs";

const app = express();
app.use(express.json());// converting to json format
app.use(express.urlencoded({extended: false}));
app.set("view engine", "ejs");
app.use(express.static("public"));// static files

const port = 3000;


app.listen(port, ()=>{
    console.log(`Running on port ${port}`);
});

app.get("/", (req,res)=>{
    res.render("login"); 
}); 

app.get("/signup", (req,res)=>{
    res.render("signup"); 
}); 

// registering the users here amd storing in db 
app.post("/signup", async(req, res)=> {

    const data = {
        name: req.body.username,
        password: req.body.password  
    }

    const existingUser = await collect.findOne({name: data.name});
    if(existingUser){
        res.send("User already exists. Please choose a different username.");
    }
    else {
    const encryptRounds =12;
    const hashedPassword =await bcrypt.hash(data.password, encryptRounds); 

    data.password = hashedPassword; 

    const userdata =await collect.insertMany(data);
    console.log(userdata);
    res.render("index");
    }
});

// after successfull sognup redirect to index.html


app.post("/login", async(req, res) =>{

    //res.send("Reached login route");
    try{
        const check =await collect.findOne({name: req.body.username});
        if(!check){
            res.send("User not found");
        }
        const matchPassword = await bcrypt.compare(req.body.password, check.password);
        if(matchPassword){
            // res.render("home");
            // here send index.html file
            res.render("index");
        }
        else{
             req.send("Wrong password");
        }
    }catch{ 
        res.send("Wrong Credentials!");
    }
});