import express from "express";
import bcrypt from "bcrypt";
import path from "path";
import collect from "./config.js";
import { name } from "ejs";
import dotnev from "dotenv";
import stripe from "stripe";

const app = express();
app.use(express.json());// converting to json format
app.use(express.urlencoded({extended: false}));
app.set("view engine", "ejs");
app.use(express.static("public"));// static files
dotnev.config();

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
            res.render("index");
            // here send index.html file
        }
        else{
             req.send("Wrong password");
        }
    }catch{ 
        res.send("Wrong Credentials!");
    }
});

///Users/sumaiyaparveen/Desktop/Backend-Ecommerce/router/authRoutes.js

// stripe
let stripeGateway = stripe(process.env.stripe_api);
let DOMAIN = process.env.DOMAIN

// app.use('/auth', authRoutes);


// app.get('/', (req,res)=>{
//     res.sendFile('index.html',{root:'public/JS' });
// });

// app.get('/',(req, res)=>{
//     res.sendFile('login.ejs', {root:'public/JS'});
// })

app.get('/successPayment', (req,res)=>{
    res.sendFile('successPayment.html',{root:'public/JS' });
});

app.get('/failPayment ', (req,res)=>{
    res.sendFile('failPayment.html',{root:'public/JS' });
});


app.post('/stripe-checkout', async(req, res)=>{
    const lineItems = req.body.items.map((item) => {
        const unitAmount= parseInt(item.price.replace(/[^0-9.-]+/g, '')*100);
        console.log("item-price:" , item.price);
        console.log("unitAmount:" , unitAmount);
        return{
            price_data : {
                currency: 'INR',
                product_data: {
                    name: item.title,
                    images:[item.productImgs]
                },
                unit_amount: unitAmount,
            },
            quantity: item.quantity
        };
    });
    console.log("lineItems:" , lineItems);
 
    // checkout 
    const session =await stripeGateway.checkout.sessions.create({
                payment_method_types : ['card'],
                mode : 'payment',
                success_url : `${DOMAIN}/successPayment`,
                cancel_url : `${DOMAIN}/failPayment`,
                line_items : lineItems,
        
                billing_address_collection : 'required',
            });
          res.json(session.url);
});