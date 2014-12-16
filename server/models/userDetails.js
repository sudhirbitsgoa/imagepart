/**
 * Created by venkat on 1/12/14.
 */
/**
 * Created by venkat on 18/11/14.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userName: String,
    email:String,
    password:String,
    lastName:String,
    firstName:String
});

module.exports = mongoose.model('UserDetails',userSchema);