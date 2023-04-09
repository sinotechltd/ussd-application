// libraries
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();
const PORT = process.env.PORT || 5000;


// models
const User = require('./model/user');
const Order = require('./model/order');
const Fertilizer = require('./model/fertilizer');

// mongo database connection
const database_url = 'mongodb+srv://lebuluz:lovemum2002@cluster0.3tythl5.mongodb.net/ussd';
mongoose.connect(database_url);
const db = mongoose.connection;
db.on('error', (err) => {
  console.log(err);
});
db.once('open', () => {
  console.log('database running');
});

// body-parser

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Define route for registering a new fertilizer
app.post('/register-fertilizer', (req, res) => {
    const { fertilizername, quantity } = req.body;

    // Create a new Fertilizer document from the request body data

    const newFertilizer = new Fertilizer ({fertilizername, quantity });

      // Save the new Fertilizer document to the database
    newFertilizer.save()
    .then(() => {
      res.status(201).json({ message: 'Fetilizer Added successfully.' });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Failed to add fertilizer.' });
    });
});
  
// functions
function mapProduct(input) {
  switch (input) {
    case '1':
      return 'CAN';
    case '2':
      return 'NPK';
    case '3':
      return 'Urea';
    default:
      return '';
  }
}

function mapQuantity(input) {
  switch (input) {
    case '1':
      return '10 kgs';
    case '2':
      return '25 kgs';
    case '3':
      return '50 kgs';
    default:
      return '';
  }
} 


app.post('/', (req, res) => {
  
    let response;

          const sessionId   = req.body.sessionId;
          const serviceCode = req.body.serviceCode;
          const phoneNumber = req.body.phoneNumber;
          const text     = req.body.text

  console.log(sessionId, serviceCode, phoneNumber, text)

  let length = text.split('*').length

  let txt = text.split('*')
  res.contentType('text/plain');

      if (text === '') {
      async function handleEmptyText() {
        const registrant = await User.findOne({ phone_number: phoneNumber });
       
            if (registrant) {
                response = 'CON Welcome back to Ukulima  Fertilizer Placement You have already submitted data your information to us.\n';
                response += '2: Place Order\n';
                response += '3: Check status of Order\n';
                response += '4: Exit\n';
              
            } else {
              response = 'CON Welcome to Ukulima Fertilizer Placement \n';
              response += '1: To Register \n';
              response += '4: Exit\n';
                
            }
          }
            handleEmptyText();
        }
      

      else if (text === '1'){

      response = 'CON Enter your full name\n';  
    
      }

      else if (length ===2 && txt[0] ==='1'){
        console.log(length, txt[0], txt)
        response = 'CON Enter your id number\n';

        
      }

      else if (length ===3 && txt[0] === '1') {
        console.log(length, txt[0], txt)
        response = 'CON Enter Your Location\n';
      }
      else if(length ===4 && txt[0]==='1') {
        response = 'END Thank you, your information has been Saved.\n';
  

            let data = text.split('*');

            async function registerUser() {
            const registrant = await User.create({
              fullname: data[1],
              id_number: data[2],
              location: data[3],
              phone_number: phoneNumber
            });
            console.log("Farmer Added", registrant);
          }
          registerUser();
          }
              
    else if (text === '2'){ 
      response = 'CON Welcome back to Ukulima, \n What would you like?.\n1.To Check Available Fertilizers.\n2.To place Your Order.\n3.Exit';
    }
    else if (text ==='2*1'){
      // query database to display all fertilizers
      Fertilizer.find({})
        .then((fertilizers) => {
          if (fertilizers.length < 1) {
            response = 'END No fertilizers found.';
          } else {
            let fertilizers_data = '';
            fertilizers.forEach((item, index) => {
              fertilizers_data += ` ${index+1}. ${item.fullname}\n`;
            });
            response = `END Current fertilizers:\n${fertilizers_data}`;
          }
        })
        .catch((err) => {
          console.log(err);
          response = 'END An error occurred. Please try again later.';
        });
      }
      else if (text === '2*2') {
        response = 'CON Select the fertilizer you want to order:\n1. CAN\n2. NPK\n3. Urea';
      } else if (text === '2*2*1') {
        response = 'CON Select the quantity of the fertilizer you want to order (kgs):\n1. 10\n2. 25\n3. 50';
      }
       else if (length === 4) {
        const productName = mapProduct(txt[1]); // Map the user's input to the corresponding product name
        const quantity = mapQuantity(txt[2]); // Map the user's input to the corresponding quantity
      
        async function saveOrder() {
          try {
            const order = await Order.create({
              productname: productName,
              quantity: quantity,
              phone_number: phoneNumber
            });
            console.log('Order added:', order);
            response = 'END Thank you, your order has been saved.';
          } catch (err) {
            console.error('Error saving order:', err);
            response = 'END An error occurred. Please try again later.';
          }
        }
      
        saveOrder();  
     
    }

     else if (text === '3'){ 
      async function handleStatus(phoneNumber) {
        try {
          const order = await Order.findOne({ phone_number: phoneNumber });
      
          if (order && order.done === true) {
            response = `END Thank you. Come collect your ${order.productname} Fertilizer.\n`;
          } else {
            response = 'END Still in progress.\n';
          }
        } catch (error) {
          console.error(error);
          // Handle error appropriately
        }
      }
      handleStatus();
     
      
          }
      else if(text ==='4'){
        response = 'END Thank you!'
      }
      else{
        response = 'END Wrong Input.'
      }
     
    
   
    

  setTimeout(() => {
    // console.log(text);
    res.send(response);
    res.end();
  }, 2000);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

