import express from "express";
import bcrypt from "bcrypt";
import path from "path";
import collect from "./config.js";

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

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