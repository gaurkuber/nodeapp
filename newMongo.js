const express = require("express");
const app = express();
const port = process.env.port || 9990;
const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");
const mongourl = "mongodb://localhost:27017";
let db;
let col_name = "documents";

app.use(express.static(__dirname+'/public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/', (req,res)=>    {
    db.collection(col_name).find({isActive:true}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

app.post('/addUser', (req, res)=>{
    console.log(req.body);
    var data = {
        "_id": parseInt(req.body._id),
        "name": req.body.name,
        "city": req.body.city,
        "phone":parseInt(req.body.phone),
        "isActive":true
    };
    db.collection(col_name).insertOne(data, (err, result) => {
        if (err) {throw err;}
        else { res.redirect('/') }
    })
})



app.get('/getDocs', (req,res)=>    {
    let searchStr = req.query.search;
    db.collection(col_name).find({ '$text': {'$search' : searchStr } }).project({ score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } }).toArray((err,result)=>{
        if(err) throw err;
        else { console.log("Found the following records");
        console.log(result);}
        res.send(result);
    })
})


MongoClient.connect(mongourl, (err,client)=>{
    if(err) console.log('error while connecting');
    db = client.db('bko');
    app.listen(port,(err)=>{
        console.log(`server is running on port ${port}`)
    })
})