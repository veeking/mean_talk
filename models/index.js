   // 链接数据库 并导出用户数据模型  生成模型
   var mongoose = require('mongoose');
   mongoose.connect('mongodb://localhost/meantalk');
   exports.User = mongoose.model('User',require('./user'));
   exports.Message = mongoose.model('Message',require('./message'));