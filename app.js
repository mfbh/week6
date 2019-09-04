let express = require('express');
let app = express();
let bodyParser = require('body-parser');

let viewsPath = __dirname + "/views";

let db=null;
let col=null;

//mongodb
let mongodb = require('mongodb');
let MongoClient = mongodb.MongoClient;
let url= "mongodb://localhost:27017/";

MongoClient.connect(url,{
    useNewUrlParser: true
}, function(err,client){

    db=client.db('fit2095');
    col = db.collection('week6table');

    });


app.use(express.static("public/img")); // to allow users to view image 
app.use(express.static('css'));
app.engine("html", require('ejs').renderFile);
app.set("view engine" , "html");
app.use(bodyParser.urlencoded({
    extended : false
}
));




app.get("/",function(req,res){
    let fileName = viewsPath + "/index.html";  
    res.sendFile(fileName);

});

app.get("/newtask.html", function(req,res){ // request first , after that respond
    let fileName = viewsPath + "/newtask.html";
    res.sendFile(fileName);
});


app.get("/listtask.html", function(req,res){
    let fileName = viewsPath + "/listtask.html";
    col.find({}).toArray(function (err,data){
        res.render(fileName, {
            task: data
        });
    })

})

app.get("/deletetask.html", function(req,res){
    let fileName = viewsPath + "/deletetask.html";
    res.sendFile(fileName);
});

app.get("/updatetask.html", function(req,res){
    let fileName = viewsPath + "/updatetask.html";
    res.sendFile(fileName);
});

app.get("/deletecompleted", function(req,res){
    col.deleteMany({status : 'Complete'})
    res.redirect("/listtask.html")
})

app.post("/addNewTask", function(req,res){
    console.log(req.body);
    // db.push(req.body);
    col.insertOne(req.body);
    res.redirect("/listtask.html");

});

 app.post("/deleteOneTask",function(req,res){
    let selectId = req.body;
    col.deleteOne({_id: mongodb.ObjectId(selectId._id)})
    res.redirect("/listtask.html")
     });

app.post("/updatetask", function(req,res){
    let selectId= req.body;
    let filter = {_id: mongodb.ObjectId(selectId._id)};
    let theUpdate = { $set: { status: selectId.status } } ;
    col.updateOne(filter,theUpdate);
    res.redirect("/listtask.html")

});


app.listen(8080);