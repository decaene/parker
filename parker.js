 


var express     	=   require("express");
var app         	=   express();
var bodyParser  	=   require("body-parser");
var router      	=   express.Router();
var mongoose 		= 	require('mongoose');
var MongoClient 	= 	require('mongodb').MongoClient
    , format 		= 	require('util').format;
var ObjectId 		= 	require('mongodb').ObjectId; 
var dateFormat  	= 	require('dateformat');
var moment 			= 	require('moment');
var QRCode 			= 	require('qrcode'); 
var gcm 			= 	require('node-gcm');
var apn 			= 	require('apn');
var stripe			=   require('stripe')('sk_test_u1CvQ8JBpXoO682fAecp1hkH');
var nodemailer  	=   require('nodemailer');
var smtpTransport 	= 	require('nodemailer-smtp-transport');
var handlebars 	  	= 	require('handlebars');
var fs 				= 	require('fs');
var gps 			= 	require("gps-tracking");

app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb'}));
app.use(bodyParser());

app.use('/empresa', express.static('empresa'));
app.use('/usuario', express.static('usuario'));

// Run server to listen on port 3005.
var server = app.listen(3017, () => {
  console.log('Parker en *:3017');
});

var io = require('socket.io')(server);

// Database Mongo Connection //

	var datb;  

	MongoClient.connect('mongodb://127.0.0.1:27017/walter_gps', function(err, db) {
	    if(err) throw err;
	    datb = db;
	});

// Database Mongo Connection //

// Add Security Headers

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
}); 

// Add Security Headers

// FUNCTIONS

// FUNCTIONS

// IO SOCKETS

// Set socket.io listeners.
io.on('connection', (socket) => {
  	console.log('Usuario esta viendo Walter GPS');

  	socket.on('join', function(data) { //Listen to any join event from connected users
  		socket.user_id = data._id;
  		socket.email   = data.email;
  		socket.tipo_uid   = data.tipo_uid;
		//Privado por user _id
		socket.join(data._id);
        // socket.join(data._id); User joins a unique room/channel that's named after the userId 
        // console.log("User joined room: " + data.user_id);
    });
	
	socket.on('envia_ubicacion', function(ubicacion) {
		io.sockets.emit('transmite_ubicacion', ubicacion);
	});

    socket.on('invitar_cliente', function(reservation) {
    	io.sockets.in(reservation.usuario_uid).emit('invitacion_cliente', { "message" : "Cliente invitado." });
    });

  	socket.on('disconnect', () => {
    	console.log('Usuario se fue de boarding pass');
  	});
});

// IO SOCKETS

// Router and Routes

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

var options = {
    'debug'                 : true,
    'port'                  : 8090,
    'device_adapter'        : "TK103"
}
 
var server = gps.server(options,function(device,connection){
 
    device.on("login_request",function(device_id,msg_parts){
 
        // Some devices sends a login request before transmitting their position
        // Do some stuff before authenticate the device... 
        
        // Accept the login request. You can set false to reject the device.
		console.log(device_id);
		console.log(msg_parts);
        this.login_authorized(true); 
 
    });
 
 
    //PING -> When the gps sends their position  
    device.on("ping",function(data){
 
        //After the ping is received, but before the data is saved
        console.log(data);
        return data;
 
    });
 
});

router.get("/",function(req,res){
    res.json({"error" : false,"message" : "Hello World11"});
});

// router.post("/nueva_ruta",function(req,res){
    // var collection    =  datb.collection('Ruta');
    // collection.insert(req.body.data, function(err, result) {
        // if(err){
            // var res_err      = {};
            // res_err.status   = "error";
            // res_err.error    = err;
            // res_err.message  = err;
            // res.send(res_err);
        // }
        // else{
           // result.status = "success";
           // res.send(result);
        // }
    // });
// });

// router.post("/nueva_ruta",function(req,res){
	
	// var collection    =  datb.collection('Ruta');
    // collection.insert(req.body.data, function(err, result) {
        // if(err){
            // var res_err      = {};
            // res_err.status   = "error";
            // res_err.error    = err;
            // res_err.message  = err;
            // res.send(res_err);
        // }
        // else{
            // var collection    =  datb.collection('Subruta');
			// var sub_ruta = {};
			// sub_ruta.ruta_id = ObjectId(result.insertedIds[0]);
			// sub_ruta.direcciones = req.body.subruta;
			// collection.insert(sub_ruta, function(err, result) {
				// if(err){
					// var res_err      = {};
					// res_err.status   = "error";
					// res_err.error    = err;
					// res_err.message  = err;
					// res.send(res_err);
				// }
				// else{
				   // result.status = "success";
				   // res.send(result);
				// }
			// });
        // }
    // });
	
	
    // var collection           		=  datb.collection('Promocion');
    // var promocion           		=  req.body.data;
    // var foto_promocion       		=  req.body.data.foto;
    // promocion.foto         	 		=  "";
	// req.body.data.restaurante_id 	=  ObjectId(req.body.data.restaurante_id);
    // collection.insert(promocion, function(err, result) {
        // if(err){
            // var res_err      = {};
            // res_err.status   = "error";
            // res_err.error    = err;
            // res_err.message  = err;
            // res.send(res_err);
        // }
        // else{
            // console.log(result.insertedIds[0]);
            // var data = foto_promocion.replace(/^data:image\/\w+;base64,/, "");
            // var buf = new Buffer(data, 'base64');
            // fs.writeFile('promociones/'+result.insertedIds[0]+'_foto.png', buf);

            // collection.update(
                // { '_id' : ObjectId(result.insertedIds[0]) }, 
                // { $set: { 'foto' : 'promociones/'+result.insertedIds[0]+'_foto.png' } }, 
                // function(err, result2){  
                    // if(err){
                        // var res_err      = {};
                        // res_err.status   = "error";
                        // res_err.error    = err;
                        // res_err.message  = err;
                        // res.send(res_err);
                    // }
                    // else{
                        // result.status  = "success";
						// result.message = "Promoción insertada con éxito, espera la confirmación cuando se acepte el contenido. ¡Gracias! :)";
                        // res.send(result);
                    // }
            // });
        // }
    // });
// });

router.post("/get_rutas",function(req,res){
    var collection    =  datb.collection('Ruta');
    collection.aggregate([
    ]).toArray(function(err, result){  
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Rutas";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_empresas",function(req,res){
    var collection    =  datb.collection('Empresa');
    collection.aggregate([
		{ $lookup: { from: "Usuario", localField: "_id", foreignField: "empresa_id", as: "usuarios" } },
		{ $lookup: { from: "Ruta", localField: "_id", foreignField: "empresa_id", as: "rutas" } },
		{ $lookup: { from: "Tracker", localField: "_id", foreignField: "empresa_id", as: "trackers" } },
		{ $lookup: { from: "Vehiculo", localField: "_id", foreignField: "empresa_id", as: "vehiculos" } }
    ]).toArray(function(err, result){  
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Empresas";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_usuarios",function(req,res){
    var collection    =  datb.collection('Usuario');
    collection.aggregate([
    ]).toArray(function(err, result){  
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Usuarios";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_usuarios_empresa",function(req,res){
    var collection    =  datb.collection('Usuario');
    collection.aggregate([
		{ $match:  { "empresa_id" : ObjectId(req.body.empresa._id) } }
    ]).toArray(function(err, result){  
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Usuarios empresa";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_vehiculos_empresa",function(req,res){
    var collection    =  datb.collection('Vehiculo');
    collection.aggregate([
		{ $match:  { "empresa_id" : ObjectId(req.body.empresa._id) } },
		{ $lookup: { from: "Usuario", localField: "chofer_id", foreignField: "_id", as: "chofer" } },
    ]).toArray(function(err, result){  
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Vehículos empresa";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_trackers_empresas",function(req,res){
    var collection    =  datb.collection('Tracker');
    collection.aggregate([
		{ $match:  { "empresa_id" : ObjectId(req.body.empresa._id) } }
    ]).toArray(function(err, result){  
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Trackers empresa";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_rutas_empresas",function(req,res){
    var collection    =  datb.collection('Ruta');
    collection.aggregate([
		{ $match:  { "empresa_id" : ObjectId(req.body.empresa._id) } },
		{ $lookup: { from: "Trayecto", localField: "_id", foreignField: "ruta_id", as: "trayectos" } }
    ]).toArray(function(err, result){  
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Rutas empresa";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});

router.post("/get_tipos_usuario",function(req,res){
    var collection    =  datb.collection('Tipo_Usuario');
    collection.aggregate([
    ]).toArray(function(err, result){  
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }else{
            var res_data      = {};
            res_data.status   = "success";
            res_data.message  = "Tipo_Usuario";
            res_data.data     = result;
            res.send(res_data);
        }
    });
});


router.post("/autenticacion",function(req,res){
    var name_collection = "Usuario";
    var email_login     =  req.body.data.email;
    var password_login  =  req.body.data.contrasena;

    var collection      = datb.collection('Usuario');
    collection.aggregate([
        { $match : { "email" : email_login, "contrasena" : password_login } }
    ]).toArray(function(err, result){  
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        if(result.length === 0){
            var res_err      = {};
            res_err.status   = "info";
            res_err.message  = "Correo electrónico o contraseña equivocada.";
            res.send(res_err);
        }else{
            if(result[0].status != 1){
                var res_data      = {};
                res_data.status   = "info";
                res_data.message  = "Tu cuenta esta inactiva, para mas información contacta soporte.";
                res_data.data     = result[0];
                res.send(res_data);
            }else{
                var res_data      = {};
                res_data.status   = "success";
                res_data.message  = "Bienvenido a WUVI. ¡Disfruta tu comida!";
                res_data.data     = result[0];
                res.send(res_data);
            }
        }
    });
});

router.post("/nuevo_usuario",function(req,res){
    var collection                  = datb.collection('Usuario');
    var email_register              = req.body.data.email;
    req.body.data.tipo_id          = new ObjectId(req.body.data.tipo_id);

    collection.find( { "email" : email_register } ).toArray(function(err, result){  
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            if(result.length === 0){
                collection.insert(req.body.data, function(err, result_usuario) {
                    if(err){
                        var res_err      = {};
                        res_err.status   = "error";
                        res_err.error    = err;
                        res_err.message  = err;
                        res.send(res_err);
                    }
                    else{
						result_usuario.status = "success";
						res.send(result_usuario);
						// res.send(req.body);
                    }
                });
            }else{
                var res_err      = {};
                res_err.status   = "info";
                res_err.message  = "Este correo electrónico ya fue registrado anteriormente.";
                res.send(res_err);
            }
        }
    });
});

router.post("/nuevo_usuario_empresa",function(req,res){
    var collection                  = datb.collection('Usuario');
    var email_register              = req.body.data.email;
    req.body.data.tipo_id           = new ObjectId(req.body.data.tipo._id);
	var foto						=  req.body.data.foto;
	req.body.data.foto 				=  "";
	req.body.data.empresa_id		=  ObjectId(req.body.data.empresa_id);

    collection.find( { "email" : email_register } ).toArray(function(err, result){  
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            if(result.length === 0){
                collection.insert(req.body.data, function(err, result_usuario) {
                    if(err){
                        var res_err      = {};
                        res_err.status   = "error";
                        res_err.error    = err;
                        res_err.message  = err;
                        res.send(res_err);
                    }
                    else{
						var result_usuario_res = result_usuario;
						
						console.log(result_usuario_res.insertedIds[0]);
						var data = foto.replace(/^data:image\/\w+;base64,/, "");
						var buf = new Buffer(data, 'base64');
						fs.writeFile('usuario/'+result_usuario_res.insertedIds[0]+'_foto.png', buf);

						collection.update(
							{ '_id' : ObjectId(result_usuario_res.insertedIds[0]) }, 
							{ $set: { 'foto' : 'http://165.227.30.166:3009/usuario/'+result_usuario_res.insertedIds[0]+'_foto.png' } }, 
							function(err, result2){  
								if(err){
									var res_err      = {};
									res_err.status   = "error"; 
									res_err.error    = err;
									res_err.message  = err;
									res.send(res_err);
								}
								else{
									result_usuario_res.status = "success";
									result_usuario_res.message = "Nuevo usuario creado :)";
									res.send(result_usuario_res);
								}
						});
						// res.send(req.body);
                    }
                });
            }else{
                var res_err      = {};
                res_err.status   = "info";
                res_err.message  = "Este correo electrónico ya fue registrado anteriormente.";
                res.send(res_err);
            }
        }
    });
});

router.post("/recuperar_contrasena",function(req,res){
	var collection	     = datb.collection('Usuario');
	var nueva_contrasena = random_password();
    collection.update(
		{ 'email' : req.body.data.email }, 
		{ $set: { 'contrasena' : nueva_contrasena 
		} },
		function(err, result){  
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				
				var message = "<b> Test de correo </b>";
				let transporter = nodemailer.createTransport({
					host: 'smtp.gmail.com',
					port: 587,
					secure: false, // true for 465, false for other ports
					auth: {
						user: 'alanbarreraff@gmail.com', // generated ethereal user
						pass: 'pbo031117'  // generated ethereal password
					}
				});
				let mailOptions = {
					from: 'alanbarreraff@gmail.com', // sender address
					to: 'alanbarreraf@hotmail.com', // list of receivers
					subject: 'Recupera tu contraseña', // Subject line
					text: 'Hello world?', // plain text body
					html: message // html body
				};
				
				readHTMLFile('plantillas_correo/test.html', function(err, html) {
					var template = handlebars.compile(html);
					var replacements = {
						 user_p			: req.body.data.nombre,
						 contrasena_p	: nueva_contrasena
					};
					var htmlToSend = template(replacements);
					var mailOptions = {
						from: 'alanbarreraff@gmail.com', // sender address
						to: req.body.data.email, // list of receivers
						subject: 'Recupera tu contraseña', // Subject line
						text: 'Recupera tu contraseña', // plain text body
						html: htmlToSend // html body
					 };
					transporter.sendMail(mailOptions, (error, info) => {
						if (error) {
							return console.log(error);
						}
						console.log('Message sent: %s', info.messageId);
						console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
						
						res.json({"mail" : true,"message" : "Hello World"});
					});
				});
				result.status  = "success";
				result.message = "Contraseña actualizada";
				res.send(result);
			}
	});
});

router.post("/update_foto_usuario",function(req,res){
    var collection           =  datb.collection('Usuario');
    var user_id           	 =  ObjectId(req.body.data._id);
	var foto_usuario     	 =  req.body.data.foto;
	
	var data = foto_usuario.replace(/^data:image\/\w+;base64,/, "");
	var buf = new Buffer(data, 'base64');
	fs.writeFile('usuario/'+req.body.data._id+'_foto.png', buf);
	
    collection.update(
		{ '_id' : user_id }, 
        { $set: { 'foto' :  'usuario/'+req.body.data._id+'_foto.png' } }, 
		function(err, result){  
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				var res_err      = {};
				res_err.status   = "success";
				res_err.foto   	 = 'usuario/'+req.body.data._id+'_foto.png'
				res_err.message  = "Actualizaste tu foto";
				res_err.result	 = result;
				res.send(res_err);
			}
	});
});

router.post("/update_user_password",function(req,res){
    var collection           		=  datb.collection('Usuario');
    var user_id           			=  ObjectId(req.body.data._id);
    collection.update(
		{ '_id' : user_id }, 
        { $set: { 'contrasena' : req.body.data.contrasena } }, 
		function(err, result){  
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				var res_err      = {};
				res_err.status   = "success";
				res_err.message  = "Actualizaste tu contraseña";
				res_err.result	 = result;
				res.send(res_err);
			}
	});
});

router.post("/update_perfil_usuario",function(req,res){
    var collection           		=  datb.collection('Usuario');
    var user_id           			=  ObjectId(req.body.data._id);
    collection.update(
		{ '_id' : user_id }, 
        { $set: { 'nombre' : req.body.data.nombre, 'apellido' : req.body.data.apellido, 'alias' : req.body.data.alias , 'email' : req.body.data.email, 'telefono' : req.body.data.telefono } }, 
		function(err, result){  
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				var res_err      = {};
				res_err.status   = "success";
				res_err.message  = "Actualizaste tu perfil";
				res_err.result	 = result;
				res.send(res_err);
			}
	});
});

router.post("/actualizar_status_empresa",function(req,res){
    var collection	=  datb.collection('Empresa');
    var empresa_id	=  ObjectId(req.body.empresa._id);
    collection.update(
		{ '_id' : empresa_id }, 
        { $set: { 'status' : req.body.empresa.status } }, 
		function(err, result){  
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				var res_err      = {};
				res_err.status   = "success";
				res_err.message  = req.body.empresa.status === 1 ? "Activaste la empresa" : "Desactivaste la empresa";
				res_err.result	 = result;
				res.send(res_err);
			}
	});
});

router.post("/actualizar_status_ruta",function(req,res){
    var collection	=  datb.collection('Ruta');
    var ruta_id	=  ObjectId(req.body.ruta._id);
    collection.update(
		{ '_id' : ruta_id }, 
        { $set: { 'status' : req.body.ruta.status } }, 
		function(err, result){  
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				var res_err      = {};
				res_err.status   = "success";
				res_err.message  = req.body.ruta.status === 1 ? "Activaste la ruta" : "Desactivaste la ruta";
				res_err.result	 = result;
				res.send(res_err);
			}
	});
});

router.post("/actualizar_status_tracker",function(req,res){
    var collection	=  datb.collection('Tracker');
    var tracker_id	=  ObjectId(req.body.tracker._id);
    collection.update(
		{ '_id' : tracker_id }, 
        { $set: { 'status' : req.body.tracker.status } }, 
		function(err, result){  
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				var res_err      = {};
				res_err.status   = "success";
				res_err.message  = req.body.tracker.status === 1 ? "Activaste el tracker" : "Desactivaste el tracker";
				res_err.result	 = result;
				res.send(res_err);
			}
	});
});

router.post("/actualizar_status_vehiculo",function(req,res){
    var collection	=  datb.collection('Vehiculo');
    var vehiculo_id	=  ObjectId(req.body.vehiculo._id);
    collection.update(
		{ '_id' : vehiculo_id }, 
        { $set: { 'status' : req.body.vehiculo.status } }, 
		function(err, result){  
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				var res_err      = {};
				res_err.status   = "success";
				res_err.message  = req.body.vehiculo.status === 1 ? "Activaste el vehículo" : "Desactivaste el vehículo";
				res_err.result	 = result;
				res.send(res_err);
			}
	});
});

router.post("/actualizar_status_usuario",function(req,res){
    var collection	=  datb.collection('Usuario');
    var usuario_id	=  ObjectId(req.body.usuario._id);
    collection.update(
		{ '_id' : usuario_id }, 
        { $set: { 'status' : req.body.usuario.status } }, 
		function(err, result){  
			if(err){
				var res_err      = {};
				res_err.status   = "error";
				res_err.error    = err;
				res_err.message  = err;
				res.send(res_err);
			}
			else{
				var res_err      = {};
				res_err.status   = "success";
				res_err.message  = req.body.usuario.status === 1 ? "Activaste el usuario" : "Desactivaste el usuario";
				res_err.result	 = result;
				res.send(res_err);
			}
	});
});

router.post("/actualizar_empresa",function(req,res){
		var collection					=  datb.collection('Empresa');
		var empresa_id	                =  ObjectId(req.body.empresa._id);
		var foto     					=  req.body.empresa.foto;
		req.body.empresa.foto 			=  "";
		collection.update(
					{ '_id' : empresa_id }, 
					{ $set: { "privacidad" : req.body.empresa.privacidad , "nombre" : req.body.empresa.nombre } }, 
					function(err, result2){  
						if(err){
							var res_err      = {};
							res_err.status   = "error";
							res_err.error    = err;
							res_err.message  = err;
							res.send(res_err);
						}
			else{			
				
				if(foto.includes("data")){
					var data = foto.replace(/^data:image\/\w+;base64,/, "");
					var buf = new Buffer(data, 'base64');
					fs.writeFile('usuario/'+req.body.empresa._id+'_foto.png', buf);

					collection.update(
						{ '_id' : empresa_id }, 
						{ $set: { 'foto' : 'http://165.227.30.166:3009/usuario/'+req.body.empresa._id+'_foto.png' } }, 
						function(err, result2){  
							if(err){
								var res_err      = {};
								res_err.status   = "error";
								res_err.error    = err;
								res_err.message  = err;
								res.send(res_err);
							}
							else{
								result2.status  = "success";
								result2.message = "Registro modificado :)";
								res.send(result2);
							}
					});
				}else{
					var result_return      = {};
					result_return.status   = "success";
					result_return.message  = "Registro modificado :)";
					res.send(result_return);
				}
			}
		});
});

router.post("/actualizar_vehiculo",function(req,res){
		var collection					=  datb.collection('Vehiculo');
		var vehiculo_id	                =  ObjectId(req.body.vehiculo._id);
		req.body.vehiculo.usuario_alta 	=  ObjectId(req.body.vehiculo.usuario_alta);
		req.body.vehiculo.empresa_id	=  ObjectId(req.body.vehiculo.empresa_id);
		req.body.vehiculo.chofer_id		=  ObjectId(req.body.vehiculo.chofer._id);
		delete req.body.vehiculo.chofer;
		collection.update(
					{ '_id' : vehiculo_id }, 
					{ $set: { 	"modelo" : req.body.vehiculo.modelo,
								"placas" : req.body.vehiculo.placas, 
								"usuario_alta" : req.body.vehiculo.usuario_alta,
								"empresa_id" : req.body.vehiculo.empresa_id,
								"chofer_id" : req.body.vehiculo.chofer_id } }, 
					function(err, result2){  
						if(err){
							var res_err      = {};
							res_err.status   = "error";
							res_err.error    = err;
							res_err.message  = err;
							res.send(res_err);
						}
			else{			
				
				var result_return      = {};
				result_return.status   = "success";
				result_return.message  = "Vehículo actualizado :)";
				res.send(result_return);
			}
		});
});

router.post("/actualizar_tracker",function(req,res){
		var collection					=  datb.collection('Tracker');
		var tracker_id	                =  ObjectId(req.body.tracker._id);
		collection.update(
					{ '_id' : tracker_id }, 
					{ $set: { 	"nombre" : req.body.tracker.nombre,
								"ip" : req.body.tracker.ip, 
								"puerto" : req.body.tracker.puerto,
								"serial" : req.body.tracker.serial } }, 
					function(err, result2){  
						if(err){
							var res_err      = {};
							res_err.status   = "error";
							res_err.error    = err;
							res_err.message  = err;
							res.send(res_err);
						}
			else{			
				
				var result_return      = {};
				result_return.status   = "success";
				result_return.message  = "Tracker actualizado :)";
				res.send(result_return);
			}
		});
});

router.post("/actualizar_ruta",function(req,res){
		var collection					=  datb.collection('Ruta');
		var ruta_id	                =  ObjectId(req.body.ruta._id);
		collection.update(
					{ '_id' : ruta_id }, 
					{ $set: { 	"nombre" : req.body.ruta.nombre } }, 
					function(err, result2){  
						if(err){
							var res_err      = {};
							res_err.status   = "error";
							res_err.error    = err;
							res_err.message  = err;
							res.send(res_err);
						}
			else{			
				
				var result_return      = {};
				result_return.status   = "success";
				result_return.message  = "Ruta actualizada :)";
				res.send(result_return);
			}
		});
});

router.post("/actualizar_usuario",function(req,res){
		var collection					=  datb.collection('Usuario');
		var usuario_id	                =  ObjectId(req.body.usuario._id);
		var foto     					=  req.body.usuario.foto;
		req.body.usuario.foto 			=  "";
		req.body.usuario.tipo_id		= new ObjectId(req.body.usuario.tipo_id);
		collection.update(
					{ '_id' : usuario_id }, 
					{ $set: { 	"nombre" : req.body.usuario.nombre,
								"apellido" : req.body.usuario.apellido, 
								"email" : req.body.usuario.email,
								"contrasena" : req.body.usuario.contrasena,
								"tipo" : req.body.usuario.tipo,
								"tipo_id" : req.body.usuario.tipo_id, } }, 
					function(err, result2){  
						if(err){
							var res_err      = {};
							res_err.status   = "error";
							res_err.error    = err;
							res_err.message  = err;
							res.send(res_err);
						}
			else{			
				
				if(foto.includes("data")){
					var data = foto.replace(/^data:image\/\w+;base64,/, "");
					var buf = new Buffer(data, 'base64');
					fs.writeFile('usuario/'+req.body.usuario._id+'_foto.png', buf);

					collection.update(
						{ '_id' : usuario_id }, 
						{ $set: { 'foto' : 'http://165.227.30.166:3009/usuario/'+req.body.usuario._id+'_foto.png' } }, 
						function(err, result2){  
							if(err){
								var res_err      = {};
								res_err.status   = "error";
								res_err.error    = err;
								res_err.message  = err;
								res.send(res_err);
							}
							else{
								result2.status  = "success";
								result2.message = "Usuario modificado :)";
								res.send(result2);
							}
					});
				}else{
					var result_return      = {};
					result_return.status   = "success";
					result_return.message  = "Registro modificado :)";
					res.send(result_return);
				}
			}
		});
});

router.post("/eliminar_empresa",function(req,res){
    var collection	=  datb.collection('Empresa');
    var empresa_id	=  ObjectId(req.body.empresa._id);
    collection.deleteOne(
        { '_id' : empresa_id },
        function(err, result){  
            if(err){
                var res_err      = {};
                res_err.status   = "error";
                res_err.error    = err;
                res_err.message  = err;
                res.send(res_err);
            }
            else{
                var res_data    = {};
                res_data.status  = "success";
                res_data.message = "Empresa eliminada :)";
                res.send(res_data);
            }
    });
});

router.post("/eliminar_ruta",function(req,res){
    var collection	=  datb.collection('Ruta');
    var ruta_id	=  ObjectId(req.body.ruta._id);
    collection.deleteOne(
        { '_id' : ruta_id },
        function(err, result){  
            if(err){
                var res_err      = {};
                res_err.status   = "error";
                res_err.error    = err;
                res_err.message  = err;
                res.send(res_err);
            }
            else{
                var res_data    = {};
                res_data.status  = "success";
                res_data.message = "Ruta eliminada :)";
                res.send(res_data);
            }
    });
});

router.post("/eliminar_vehiculo",function(req,res){
    var collection	=  datb.collection('Vehiculo');
    var vehiculo_id	=  ObjectId(req.body.vehiculo._id);
    collection.deleteOne(
        { '_id' : vehiculo_id },
        function(err, result){  
            if(err){
                var res_err      = {};
                res_err.status   = "error";
                res_err.error    = err;
                res_err.message  = err;
                res.send(res_err);
            }
            else{
                var res_data    = {};
                res_data.status  = "success";
                res_data.message = "Vehículo eliminado :)";
                res.send(res_data);
            }
    });
});

router.post("/eliminar_tracker",function(req,res){
    var collection	=  datb.collection('Tracker');
    var tracker_id	=  ObjectId(req.body.tracker._id);
    collection.deleteOne(
        { '_id' : tracker_id },
        function(err, result){  
            if(err){
                var res_err      = {};
                res_err.status   = "error";
                res_err.error    = err;
                res_err.message  = err;
                res.send(res_err);
            }
            else{
                var res_data    = {};
                res_data.status  = "success";
                res_data.message = "Tracker eliminado :)";
                res.send(res_data);
            }
    });
});

router.post("/eliminar_usuario",function(req,res){
    var collection	=  datb.collection('Usuario');
    var usuario_id	=  ObjectId(req.body.usuario._id);
    collection.deleteOne(
        { '_id' : usuario_id },
        function(err, result){  
            if(err){
                var res_err      = {};
                res_err.status   = "error";
                res_err.error    = err;
                res_err.message  = err;
                res.send(res_err);
            }
            else{
                var res_data    = {};
                res_data.status  = "success";
                res_data.message = "Usuario eliminado :)";
                res.send(res_data);
            }
    });
});

router.post("/nueva_empresa",function(req,res){
    var collection					=  datb.collection('Empresa');
    var foto						=  req.body.empresa.foto;
	req.body.empresa.foto 			=  "";
	req.body.empresa.usuario_id		=  ObjectId(req.body.empresa.usuario_id);
    collection.insert(req.body.empresa, function(err, result) {
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{			
			console.log(result.insertedIds[0]);
            var data = foto.replace(/^data:image\/\w+;base64,/, "");
            var buf = new Buffer(data, 'base64');
            fs.writeFile('empresa/'+result.insertedIds[0]+'_foto.png', buf);

            collection.update(
                { '_id' : ObjectId(result.insertedIds[0]) }, 
                { $set: { 'foto' : 'http://165.227.30.166:3009/empresa/'+result.insertedIds[0]+'_foto.png' } }, 
                function(err, result2){  
                    if(err){
                        var res_err      = {};
                        res_err.status   = "error"; 
                        res_err.error    = err;
                        res_err.message  = err;
                        res.send(res_err);
                    }
                    else{
                        result.status  = "success";
						result.message = "Empresa agregada.";
						res.send(result);
                    }
            });
        }
    });
});

router.post("/nuevo_tracker",function(req,res){
    var collection					=  datb.collection('Tracker');
	req.body.tracker.usuario_alta 	=  ObjectId(req.body.tracker.usuario_alta);
	req.body.tracker.empresa_id		=  ObjectId(req.body.tracker.empresa_id);
    collection.insert(req.body.tracker, function(err, result) {
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            result.status  = "success";
			result.message = "Tracker agregado :)";
			res.send(result);
        }
    });
});

router.post("/nueva_ruta",function(req,res){
    var collection					=  datb.collection('Ruta');
	req.body.ruta.usuario_alta 		=  ObjectId(req.body.ruta.usuario_alta);
	req.body.ruta.empresa_id		=  ObjectId(req.body.ruta.empresa_id);
    collection.insert(req.body.ruta, function(err, result) {
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            result.status  = "success";
			result.message = "Ruta agregada :)";
			res.send(result);
        }
    });
});

router.post("/nuevo_vehiculo",function(req,res){
    var collection					=  datb.collection('Vehiculo');
	req.body.vehiculo.usuario_alta 	=  ObjectId(req.body.vehiculo.usuario_alta);
	req.body.vehiculo.empresa_id	=  ObjectId(req.body.vehiculo.empresa_id);
	req.body.vehiculo.chofer_id		=  ObjectId(req.body.vehiculo.chofer._id);
	delete req.body.vehiculo.chofer;
    collection.insert(req.body.vehiculo, function(err, result) {
        if(err){
            var res_err      = {};
            res_err.status   = "error";
            res_err.error    = err;
            res_err.message  = err;
            res.send(res_err);
        }
        else{
            result.status  = "success";
			result.message = "Vehículo agregado :)";
			res.send(result);
        }
    });
});


app.use('/',router);
