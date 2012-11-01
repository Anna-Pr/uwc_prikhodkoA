$(document).ready(function() {

	/*Генерация элементов управления*/
	$('body').html('<div class="support_box"><a class="support" href="">Помощь</a><div class="chat"><div class="header"></div><div class="footer"><input class="chat_input" type="text" /><a class="send" href="">Отправить</a></div><a class="take_shot" href="">Экран пользователя</a><img id="screen"></div></div>');
	
	/*Вход в чат при загрузке страницы*/
	if($.isEmptyObject(socket)) { initChat('support'); }

	/*Открываем/закрываем чат. Если саппорту не пришло сообщение, он не сможет открыть чат*/
	$('.support').bind("click", function(){
		if($("div.chat").is(":visible"))
		{
			$("div.chat").slideUp('slow');
			$(this).removeClass("get_msg");
		}
		else
		{
			if($(this).hasClass("get_msg"))
			{
				$("div.chat").slideDown('slow');
				$(this).removeClass("get_msg");
			}
		}
		return false;
	});

	/*Отправляем сообщение нажатием на кнопку "Отправить*/
	$('.send').bind("click", function(){
		if($('.chat div.footer input').val()!="" && $('.chat div.footer input').val()!=" ")
		{
			socket.emit('message', $('.chat div.footer input').val());
			$('.chat div.footer input').val("");
		}
		return false;
	});

	/*Отправляем сообщение нажатием на Enter*/
	$('.chat div.footer input').bind("keypress", function(e){
		if (e.which == '13')
		{
			if($(this).val()!="" && $(this).val()!=" ")
			{
				socket.emit('message', $(this).val());
				$(this).val("");
			}
		}
	});

	/*Получаем скриншот экрана пользователя*/
	$('.support_box .take_shot').bind("click", function(){
		socket.emit('takeData');
		$("img#screen").show();
		return false;
	});

	/*Отправляем координаты клика по картинке с учетом размера экрана пользователя*/
	$('.support_box img#screen').bind("click", function(e){
		var offset = $(this).offset();
		var relativeX = (e.pageX - offset.left);
		var relativeY = (e.pageY - offset.top);
 		var koefX = clientX / $(this).width();
 		var koefY = clientY / $(this).height();

 		socket.emit('click', parseInt(relativeX*koefX), parseInt(relativeY*koefY));
	});
});