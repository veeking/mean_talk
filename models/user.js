    // 定义用户数据模型
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var User = new Schema({
    	email : String,
    	name : String,
    	avatarUrl : String,  // 用来计算avatar头像地址
    	online : Boolean
    });

    module.exports = User;