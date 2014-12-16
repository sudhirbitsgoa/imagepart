/**
 * Created by venkat on 17/11/14.
 */

console.log("at node");

var express = require('express'),
    app     = express();

var mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    methodOverride = require('method-override');

mongoose.connect('mongodb://localhost/test');

app.use(express.static(__dirname + '/app'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());

app.use(bodyParser.json());
app.use(methodOverride());
var schema = new mongoose.Schema({name:'String'});
var Todo = mongoose.model('Todo',schema);
var ven = new Todo({name:'venkatBharadwaj'});

app.get('todos',function(req,res){
    ven.save(function(err) {
        if(err){
            console.log("Error in saving ",ven);
        }else {
            console.log("saved ",ven);
        }
    });
});

/**/

/*app.get('/',function(req,res){
    res.sendfile(__dirname + '/app/index.html');
})

app.use(express.static(__dirname + '/app'));*/

app.listen(8000,function(){
    console.log('node again');
});