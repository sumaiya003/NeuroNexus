import express from "express";
import dotnev from "dotenv";
import stripe from "stripe";
import bodyParser from 'body-parser'


dotnev.config();

const app = express();
const port = 3000;
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.json());

let stripeGateway = stripe(process.env.stripe_api);
let DOMAIN = process.env.DOMAIN
// .map((item)
app.post('/stripe_checkout', async(req, res)=> {  
    const lineItems = req.body.items.map((item) =>{
        const unitAmount = parseInt(item.price.replace(/[^0-9.]+/g, "")*100);
        console.log('item-price:', item.price);
        console.log('unitAmount:', unitAmount);
        return{
            price_data:{
                 currency: 'usd',
                 product_data: {
                    name: item.title,
                    images:[item.productImg],
                },
                unit_amount: unitAmount,
            },
            quantity: item.quantity,
        }; 
    });
    console.log("lineItems:", lineItems);

    // checking out 
    const session =await stripeGateway.checkout.sessions.create({
        payment_method_types : ['card'],
        mode : 'payment',
        success_url : `${DOMAIN}/successPayment`,
        cancel_url : `${DOMAIN}/failPayment`,
        line_items : lineItems,

        billing_address_collection : "required",
    });
    res.json(session.url);
});

app.listen(port,()=> {
    console.log(`Server listening on port ${port}`);
});

app.get('/', (req,res)=>{
    res.sendFile('index.html',{root:'public/JS' })
});

app.get('/successPayment', (req,res)=>{
    res.sendFile('successPayment.html',{root:'public/JS' })
});

app.get('/failPayment ', (req,res)=>{
    res.sendFile('failPayment.html',{root:'public/JS' })
});