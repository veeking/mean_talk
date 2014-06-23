 var mongoose = require('mongoose');
 var Schema = mongoose.Schema,  
     ObjectId = Schema.ObjectId;

 var Message = new Schema({ 	 //初始化 消息模型
 	 content: String,
 	 creator: {
 	 	_id : ObjectId,
 	 	email : String,
 	 	name : String,
 	 	avatarUrl : String
 	 },
 	 createAt : {type: Date , default : Date.now}
 });

 module.exports = Message;