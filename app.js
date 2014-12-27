/**
 * Created by venkat on 18/11/14.
 */
var express = require('express');
var Name = require('./server/models/name');
var User = require('./server/models/userDetails.js');
var videoFiles = require("./server/models/videofiles.js");
var UserAuth = require('./server/models/users.js')
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
mongoose.connect('mongodb://localhost/test');
var LocalStrategy = require('passport-local').Strategy;
var uuid = require('node-uuid');
var googleStrategy = require('passport-google-oauth').OAuth2Strategy;

var schema = new mongoose.Schema({name:'String'});
var Todo = mongoose.model('Todo',schema);

//app.use(express.basicAuth('testUser', 'testPass'));
var router = express.Router();
router.use(function(req,res, next){
   console.log(req.method);
    next();// callback..?

});


app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.urlencoded({extend:true}));
app.use(bodyParser.json());
app.use(session({secret:"secret"}));//session secret
app.use(passport.initialize());
app.use(passport.session());//per login session


// passport config
passport.use(new LocalStrategy(UserAuth.authenticate()));
passport.serializeUser(UserAuth.serializeUser());
passport.deserializeUser(UserAuth.deserializeUser());


passport.use(new googleStrategy({
    clientSecret: 'N62KHVU3UK5-or8dlxVCiP2Y',
    clientID: '748388540408-ehicrpsrll1gb9od0f2la5kde8krkvkj.apps.googleusercontent.com',

    callbackURL: "http://stoked-depth-789.appspot.com/"
},
function (accessToken, refreshToken, profile, done) {
    console.log(profile); //profile contains all the personal data returned
    done(null, profile)
}
));


/*app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","accounts.google.com");
    res.header("Access-Control-Allow-Headers", "accounts.google.com");
    next();
});*/

app.get('/auth/google', passport.authenticate('google',{scope: 'https://www.googleapis.com/auth/plus.me https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'}));


app.post('/auth/google', function(req, res) {
  console.log(req.body);
  res.json({token:uuid.v4()});
  //res.redirect('/facedef.html');
});

app.get('/auth/google/callback', function() {
    passport.authenticate('google', {
        successRedirect: '/profile',
        failureRedirect: '/fail'
    });
});
app.get('/logout', function (req, res) {
        req.logOut();
        res.redirect('/');
    });

var port = 8000;
console.log(process.env.PORT);



router.route('/names')
    .post(function(req,res){
        var name = new Name();
        name.name = req.body.name;
        name.save(function(err){
            if(err){
                console.log('err in saving');
                res.send(err);
            }else {
                res.json({message:'Name is inserted'});
            }
        });
    })
    .get(function(req,res){
        Name.find(function(err,names){
            if(err){
                res.send(err);
            }else{
                res.json(names);
            }
        })
    });
router.route('/names/:name_id')
    .get(function(req,res){
        Name.findById(req.params.name_id,function(err,data){

            if(err){
                res.send(err);
            }else {
                res.json(data);
            }
        })
    })
    .put(function(req,res){
        Name.findById(req.params.name_id,function(err,data){
            if(err){
                res.send(err);
            }else{
                data.name = req.body.name;
                data.save(function(err){
                    if(err){
                        res.send(err);
                    }else{
                        res.json(data);
                    }
                });
            }
        });
    })
    .delete(function(req,res){
        Name.remove({
            _id:req.params.name_id
        }, function(err,data){
            if(err){
                res.send(err);
            }else {
                res.json({message:'removed',data:data});
            }
        })
    });

router.route('/addUser')
    .post(function(req,res){
        UserAuth.register(new UserAuth({ username : req.body.userName }), req.body.userPassword, function(err, account) {
            if (err) {
                console.error(err);
            }
            res.json({msg:"success"});
        });


    });

app.post('/api/loginUser', passport.authenticate('local'), function(req, res) {

  res.json({sessionId:uuid.v4()});
});

router.get('/',function(req,res){
    res.json({message:"first api with node"});

});

app.post('/upload',onRequest);

app.get('/videos',function(req,res){
   videoFiles.find({},function(err,data){
     res.json(data);
   });
})

app.use('/api',router);
app.listen(port,function(){
    console.log("api started at ",port);

});

// Muaz Khan     - www.MuazKhan.com
// MIT License   - www.WebRTC-Experiment.com/licence
// Source Code   - github.com/muaz-khan/WebRTC-Experiment/tree/master/RecordRTC/RecordRTC-to-Nodejs


    handlers = require('./handlers'),
    router = require('./router'),
    handle = { };

handle["/"] = handlers.home;
handle["/home"] = handlers.home;
handle["/upload"] = handlers.upload;
handle._static = handlers.serveStatic;



function respondWithHTTPCode(response, code) {
    response.writeHead(code, { 'Content-Type': 'text/plain' });
    response.end();
}

function routeRTC(handle, pathname, response, postData) {
    var extension = pathname.split('.').pop();

    var staticFiles = {
        js: 'js',
        gif: 'gif',
        css: 'css',
        //webm: 'webm',
        mp4: 'mp4',
        wav: 'wav',
        ogg: 'ogg'
    };
    console.log(staticFiles[extension]);
    if ('function' === typeof handle[pathname]) {
        handle[pathname](response, postData);
    } else if (staticFiles[extension]) {
        handle._static(response, pathname, postData);
    } else {
        respondWithHTTPCode(response, 404);
    }
}


var config = require('./config'),
    http = require('http'),
    url = require('url');



function onRequest(request, response) {
    console.log("on request is called for every request");
    var pathname = url.parse(request.url).pathname,
        postData = '';

    request.setEncoding('utf8');

    request.addListener('data', function(postDataChunk) {
        postData += postDataChunk;
    });

    request.addListener('end', function() {
        routeRTC(handle, pathname, response, postData);
    });
}

    //http.createServer(onRequest).listen(config.port);
