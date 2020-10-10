const { json } = require('express');
var express= require('express');
var app=express();
const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbName='hmdb1';
let db

//body parser
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

MongoClient.connect(url,function(err,client){
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected Database: ${url}`);
    console.log(`Database : ${dbName}`);
});
//fetching hospital details
app.get('/hospitaldetails',function(req,res)
{
    console.log("fetching hospital details");
    var data=db.collection("hospital").find().toArray().then(result=>res.json(result));
});
//fetching ventilator details
app.get('/ventilatorsdetails',function(req,res)
{
    console.log("fetching ventilator details");
    var data=db.collection("ventilators").find().toArray().then(result=>res.json(result));
});

//searching ventilators by status
app.post('/searchvenbystatus',function(req,res){
    console.log("getting status of ventilators");
    var status=req.body.status;
    var vendetails=db.collection("ventilators").find({"status":status}).toArray().then(result=>res.json(result));

});

//searching ventilators by hospitalname
app.post('/searchvenbyhosname',function(req,res){
    console.log("fetching ventilator status by hospital name");
    var name=req.body.name;
    var status=req.body.status;
    var vendetails=db.collection("ventilators").find({"name":new RegExp(name,'i'),"status":status}).toArray().then(result=>res.json(result));
});

//searching hospital by name
app.post('/searchhosbyname',function(req,res){
    console.log("getting hospital details by hospital name");
    var name=req.body.name;
    var hosdetails=db.collection("hospital").find({"name":new RegExp(name,'i')}).toArray().then(result=>res.json(result));
});

//updating ventilator status
app.put('/updatevenstatus',function(req,res){
    console.log("updating ventilator status");
    var ventid={ventilatorid:req.body.ventilatorid};
    var value={$set:{status:req.body.status}};
    db.collection("ventilators").updateOne(ventid,value,function(err,result)
    {
        res.json("ventilator updated");
        if(err) throw err;
    });
});

//adding ventilators
app.post('/addingventilators',function(req,res){
    console.log("adding new ventilators");
    var item={hId:req.body.hId,ventilatorId:req.body.ventilatorId,status:req.body.status,name:req.body.name};
    db.collection("ventilators").insertOne(item,(err,result)=>{
        res.json("added new ventilator");
        if(err) throw err;
    });
});

//deleting ventilators
app.delete('/deletingven',function(req,res){
    console.log("deleting ventilators by ventid");
    var vid={ventid:req.body.ventid};
    db.collection("ventilators").deleteOne(vid,(err,result)=>{
        res.json("deleted a ventilator");
        if(err) throw err;
    });
});


//browsing portal
app.listen(3000,function(req,res)
{
    console.log("listening..");
});

