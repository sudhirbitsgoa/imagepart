/**
 * Created by venkat on 18/11/14.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var nameSchema = new Schema({
    name: 'String'
});

module.exports = mongoose.model('Name',nameSchema);