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

app.get("/findtasks/:start/:end",function(req,res){
    let fileName = viewsPath + "/listtask.html";
    query = {task_id: 
        {$gte:parseInt(req.params.start),  
        $lte:parseInt(req.params.end)}}
    col.find(query).toArray(function (err,data){
        res.render(fileName,{
            task: data
        });
    });
});

app.post("/addNewTask", function(req,res){
    console.log(req.body);
    let taskDetails=req.body;
    let newId= Math.round(Math.random() * 1000)
    // db.push(req.body);
    col.insertOne({task_id: newId, task: taskDetails.taskName, user: taskDetails.assignUser, date: taskDetails.taskDue, status: taskDetails.status, description: taskDetails.description});
    res.redirect("/listtask.html");

});

 app.post("/deleteOneTask",function(req,res){
    let selectId = req.body;
    col.deleteOne({task_id: parseInt(selectId.task_id)})
    res.redirect("/listtask.html")
     });

app.post("/updatetask", function(req,res){
    let selectId= req.body;
    let filter = {task_id: parseInt(selectId.task_id)};
    let theUpdate = { $set: { status: selectId.status } } ;
    col.updateOne(filter,theUpdate);
    res.redirect("/listtask.html")

});


app.listen(8080);