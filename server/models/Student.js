// src/models/Student.js
var mongoose = require('mongoose'),
  encrypt = require('../utilities/encryption');

module.exports = function() {
  var studentSchema = mongoose.Schema({
    firstName: {type: String, required: '{PATH} is required!'},
    lastName: {type: String, required: '{PATH} is required!'},
    username: {type: String, required: '{PATH} is required!', unique: true},
    salt: {type: String, required: '{PATH} is required!'},
    hashed_pwd: {type: String, required: '{PATH} is required!'},
    roles: [String],
    isCompleted: Boolean,
    completedAt: Date,
    certificate: String,
    DOB: String,
    phone: String
  });

  studentSchema.methods = {
    authenticate: function(pwdToMatch) {
      return encrypt.hashPwd(this.salt, pwdToMatch) === this.hashed_pwd;
    },
    hasRole: function(role) {
      return this.roles.indexOf(role) > -1;
    }
  };

  mongoose.model('Student', studentSchema);
}