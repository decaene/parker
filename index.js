'user strict'

var mongoose = require('mongoose');

mongoose.connect('mongodb://165.227.30.166:27017/codigeek_apps', (err,res) => {
	if(err){
		throw err;
	}else{
		console.log("OK");
	}
})