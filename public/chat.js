/*Глобальные переменные*/
var socket;
var clientX;
var clientY;

/*Функция инициализации чата*/
function initChat(name)
{

/*Подключение к чату*/
socket = io.connect('http://localhost:8080');

/*Обработка сообщения о подключении от сервера*/
socket.on('connect', function ()
{
	/*Сохранение имени пользователя*/
	socket.emit('set nickname', name);
	
	/*Обработка полученных от сервера сообщений*/
	socket.on('message', function (message) 
	{
		msg='';
		switch(message.event)
		{
			/*Уведомление пользователю, что он подключился к чату*/
			case 'connected':
				msg="<p id='info_msg'>Вы подключились к чату в: " + message.time + "</p>";
			break;

			/*Уведомление пользователю, что к чату подключился еще кто-то*/
			case 'userJoined':
				msg="<p id='info_msg'>Пользователь подключился в: " + message.time + "</p>";
			break;

			/*Отправленное сообщение и уведомление пользователю, что его сообщение отправлено*/
			case 'messageSent':
				msg="<p id='my_msg'>" + message.text + "</p><p id='info_msg'>Вы отправили сообщение в: " + message.time + "</p>";
			break;

			/*Полученное сообщение и уведомление пользователю о полученном сообщении*/
			case 'messageReceived':
				msg="<p id='not_my_msg'>" + message.text + "</p><p id='info_msg'>Сообщение принято от " + message.name + " в: " + message.time + "</p>";
				if($("div.chat").is(":visible"))
				{
					$(".support_box .support").removeClass("get_msg");
				}
				else
				{
					$(".support_box .support").addClass("get_msg");
				}
			break;

			/*Уведомление пользователю, что собеседник вышел из чата*/
			case 'userSplit':
				msg="<p id='info_msg'>Пользователь " + message.name + " отключился в: " + message.time + "</p>";
			break;

			/*Прислан скриншот, отображение его на стороне саппорта*/
			case 'dataSent':
				$('img#screen').attr('src', message.data);
				clientX = message.windowX;
				clientY = message.windowY;
			break;

			/*Запрос на получение скриншота*/
			case 'dataTake':
				takeScreenshot();
			break;

			/*Саппорт кликнул по скриншоту, отображение клика саппорта на стороне клиента*/
			case 'click':
				support_click(message.x, message.y);
			break;
		}
		/*Добавляем сообщение в чат*/
		if(msg!='') { $(".chat .header").html( $(".chat .header").html() + msg ); }
	});
});
}