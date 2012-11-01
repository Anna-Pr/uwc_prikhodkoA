var static = require("node-static");
var file = new(static.Server)('./public');

var app = require('http').createServer(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response);
  });
});

var io = require("socket.io").listen(app);
io.sockets.on("connection", function(socket)
{
	/*Устанавливаем имя пользователя*/
	socket.on('set nickname', function (name) 
	{
		socket.set('nickname', name, function () 
		{
			socket.emit('ready');
		});
	});

	/*Рассылаем уведомления о входе себе и остальным*/
    socket.json.send({ 'event': 'connected', 'time': (new Date).toLocaleTimeString() });
	socket.broadcast.json.send({'event': 'userJoined', 'time': (new Date).toLocaleTimeString() });

	/*Рассылаем уведомления о сообщении себе и остальным*/
	socket.on("message",function(message)
	{
		socket.get('nickname', function (err, user_name) 
		{
			socket.json.send({'event': 'messageSent', 'name': user_name, 'text': message, 'time': (new Date).toLocaleTimeString()});
        	socket.broadcast.json.send({'event': 'messageReceived', 'name': user_name, 'text': message, 'time': (new Date).toLocaleTimeString()});
        });
	});

	/*Отправляем скриншот и размер экрана*/
	socket.on("sentData",function(data, ww, wh)
	{
        	socket.broadcast.json.send({'event': 'dataSent', 'data':data, 'windowX': ww, 'windowY': wh });
	});

	/*Отправляем запрос о скриншоте*/
	socket.on("takeData",function()
	{
        	socket.broadcast.json.send({'event': 'dataTake' });
	});

	/*Отправляем данные о клике саппорта*/
	socket.on("click",function(X, Y)
	{
        	socket.broadcast.json.send({'event': 'click', 'x': X, 'y': Y });
	});

	/*Отправляем уведомление о выходе собеседника из чата*/
	socket.on('disconnect', function(disconnectReason) 
	{
		socket.get('nickname', function (err, user_name) 
		{
			if (disconnectReason == 'socket end')
			{
				io.sockets.json.send({'event': 'userSplit', 'name': user_name, 'time': (new Date).toLocaleTimeString()});
			};
		});
    });
});

app.listen(8080);