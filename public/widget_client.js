/*Функция получения скриншота и отправление его саппорту*/
function takeScreenshot()
{
	var img;
	html2canvas([document.body], { onrendered: function(canvas) 
		{ 
			img = canvas.toDataURL();
			socket.emit('sentData', img, document.body.clientWidth, document.body.clientHeight);
		}});
}

/*Функция отображения клика саппорта*/
function support_click(x, y)
{
	if($("div").is(".target")) { $("div.target").remove(); }
	$('body').append('<div class="target"></div>');
	$('.target').css({'left':(x-$('.target').width()/2), 'top':(y-$('.target').height()/2)});
	$('.target').show();
	var timer = setInterval(function(){ if($("div.target").css('background-color')=='rgb(0, 0, 0)') { $("div.target").remove(); clearInterval(timer); }},100);
}

$(document).ready(function() {

	/*Генерация элементов управления*/
	$('body').html('<div class="support_box"><a class="support" href="">Помощь</a><div class="chat"><div class="header"></div><div class="footer"><input class="chat_input" type="text" /><a class="send" href="">Отправить</a></div></div></div>');

	/*Открываем/закрываем чат. Вход в чат при его открытии*/
	$('.support').bind("click", function(){

		if($("div.chat").is(":visible"))
		{
			$("div.chat").slideUp('slow', function()
			{
				$(".support_box .support").removeClass("get_msg");
			});
		}
		else
		{
			$("div.chat").slideDown('slow', function()
			{
				$(".support_box .support").removeClass("get_msg");
				if($.isEmptyObject(socket)) { initChat('client'); }
			});
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
});