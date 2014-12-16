/**
 * Created by venkat on 18/11/14.
 */
var express = require('express');
var Name = require('./server/models/name');
var User = require('./server/models/userDetails.js');
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

app.use('/api',router);
app.listen(port,function(){
    console.log("api started at ",port);

});
