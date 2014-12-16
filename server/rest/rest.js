var router = require("../../app.js").router;
var app = require("../../app.js").app;

var path = require('path');
var root = path.resolve();
console.log(root+'/app.js');
console.log("afds",require(root+"/app"));

//app.use('/api',router);

/*router.route('/names')
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
*/