/**
 * Created by venkat on 29/11/14.
 */
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/userDetails');
/*module.export = function(passport){
    passport.serializeUser(function(user,done){
        done(null,user.id);
    });

    passport.deserializeUser(function(user,done){
        User.findById(id,function(err,user){
            done(err,user);
        });
    });
    passport.use('local-signup',new LocalStrategy({
        usernameField:'email',
        passwordField:'password',
        passReqToCallback: true
    },
    function(req,email,password,done){
        User.findOne({
            'username':email
        },function(err,user){
            if(err){return done(err);}
            if(user){
                return done(null,false,req.flash('signupMessage','That email is already taken'));
            }else {
                var newUser = new User(
                    newUser.local.email = email,
                    newUser.local.password = newUser.generateHash(password)
                )
            }
        })
    })
    );
};*/