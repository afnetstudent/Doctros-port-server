const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require ('cors')
const { MongoClient } = require('mongodb');
const fileUpload = require('express-fileupload');

const uri = "mongodb+srv://DoctorApp:199525@cluster0.jayfm.mongodb.net/DoctorsPortal?retryWrites=true&w=majority";
require('dotenv').config()
const port = 5000

app.use(bodyParser.json());
app.use(cors ()); 
app.use(express.static('doctors'))
app.use(fileUpload())





app.get('/', (req, res) => {
    console.log('server is running')
    res.send('Hello World!')
  })
  
  


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const appoinmentCollection = client.db("DoctorsPortal").collection("Appoinment");
const doctorsCollection = client.db("DoctorsPortal").collection("doctor");
client.connect(err => {
    console.log(err);

  app.get('/appointments', (req, res) => {
    appoinmentCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
})


  app.post('/addappoinment', (req, res) =>{
      console.log('post request recieved')
    const appoinment = req.body;
    console.log(appoinment)
    appoinmentCollection.insertOne(appoinment)
    .then(result => {
        res.send(result.insertedCount > 0)
    })

  });
  

  app.post('/appoinmentbydate', (req, res) =>{
        const date = req.body;
        const email = req.body.email;
        doctorsCollection.find({email: email})
        .toArray((err, doctordocoment) =>{
          const filter = {date: date.date}
          if(doctordocoment.length === 0){
            filter.email = email;
          }
          appoinmentCollection.find(filter)
        .toArray((err, documents) =>{
          res.send(documents)
        })
        
        })
  })

  app.post('/adddoctors' ,(req,res) =>{
    const file = req.files.file;
    const name = req.body.name;
    const email = req.body.email;
    console.log(file,name, email)
    const newImg = file.data;
    const encImg = newImg.toString('base64');
    
    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
  };
  doctorsCollection.insertOne({ name, email, image })
  .then(result => {
      res.send(result.insertedCount > 0);
  })

  });
  
  app.get('/doctors', (req, res) => {
    doctorsCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
});
});




app.listen(process.env.PORT || port)