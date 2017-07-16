$(function() {
	/*
	number of fieldsets
	*/
	var fieldsetCount = $('#formElem').children().length;
	
	/*
	current position of fieldset / navigation link
	*/
	var current 	= 1;
    
	/*
	sum and save the widths of each one of the fieldsets
	set the final sum as the total width of the steps element
	*/
	var stepsWidth	= 0;
    var widths 		= new Array();
	$('#steps .step').each(function(i){
        var $step 		= $(this);
		widths[i]  		= stepsWidth;
        stepsWidth	 	+= $step.width();
    });
	$('#steps').width(stepsWidth);
	
	/*
	to avoid problems in IE, focus the first input of the form
	*/
	$('#formElem').children(':first').find(':input:first').focus();	
	
	/*
	show the navigation bar
	*/
	$('#navigation').show();
	
	/*
	when clicking on a navigation link 
	the form slides to the corresponding fieldset
	*/
    $('#navigation a').bind('click',function(e){
		var $this	= $(this);
		var prev	= current;
		$this.closest('ul').find('li').removeClass('selected');
        $this.parent().addClass('selected');
		/*
		we store the position of the link
		in the current variable	
		*/
		current = $this.parent().index() + 1;
		/*
		animate / slide to the next or to the corresponding
		fieldset. The order of the links in the navigation
		is the order of the fieldsets.
		Also, after sliding, we trigger the focus on the first 
		input element of the new fieldset
		If we clicked on the last link (confirmation), then we validate
		all the fieldsets, otherwise we validate the previous one
		before the form slided
		*/
        $('#steps').stop().animate({
            marginLeft: '-' + widths[current-1] + 'px'
        },500,function(){
			if(current == fieldsetCount)
				validateSteps();
			else
				validateStep(prev);
			$('#formElem').children(':nth-child('+ parseInt(current) +')').find(':input:first').focus();	
		});
        e.preventDefault();
    });
	
	/*
	clicking on the tab (on the last input of each fieldset), makes the form
	slide to the next step
	*/
	$('#formElem > fieldset').each(function(){
		var $fieldset = $(this);
		$fieldset.children(':last').find(':input').keydown(function(e){
			if (e.which == 9){
				$('#navigation li:nth-child(' + (parseInt(current)+1) + ') a').click();
				/* force the blur for validation */
				$(this).blur();
				e.preventDefault();
			}
		});
	});
	
	/*
	validates errors on all the fieldsets
	records if the Form has errors in $('#formElem').data()
	*/
	function validateSteps(){
		var FormErrors = false;
		for(var i = 1; i < fieldsetCount; ++i){
			var error = validateStep(i);
			if(error == -1)
				FormErrors = true;
		}
		$('#formElem').data('errors',FormErrors);	
	}
	
	/*
	validates one fieldset
	and returns -1 if errors found, or 1 if not
	*/
	function validateStep(step){
		if(step == fieldsetCount) return;
		
		var error = 1;
		var hasError = false;
		$('#formElem').children(':nth-child('+ parseInt(step) +')').find(':input:not(button)').each(function(){
			var $this 		= $(this);
			var valueLength = jQuery.trim($this.val()).length;
			
			if(valueLength == ''){
				hasError = true;
				$this.css('background-color','#FFEDEF');
			}
			else
				$this.css('background-color','#FFFFFF');	
		});
		var $link = $('#navigation li:nth-child(' + parseInt(step) + ') a');
		$link.parent().find('.error,.checked').remove();
		
		var valclass = 'checked';
		if(hasError){
			error = -1;
			valclass = 'error';
		}
		$('<span class="'+valclass+'"></span>').insertAfter($link);
		
		return error;
	}
	
	/*
	if there are errors don't allow the user to submit
	*/
	$('#registerButton').bind('click',function(){
		if($('#formElem').data('errors')){
			$('.submit').append('<p style="color: red; font-size: 17px; margin-left:-40px; width:450px ">Пожалуйста, заполните корректно все поля формы</p>')
			//alert('Please correct the errors in the Form');
			return false;
		} else {
			//alert('success registration');
			console.log('else in bin click')
		}
	});

	$('#registerButton').on('click',function(){
		$.ajax({
			url : 'http://95.46.99.158:4000/registration',
			type : 'POST',
			data : JSON.stringify({"email": $('#LL_email').val(), "username":$('#LL_username').val(), "password":$('#LL_password').val(), "name":$('#LL_name').val(), "surname":$('#LL_surname').val()}),
			contentType: "application/json" ,
			success : function(data) {
				if (data == "mail send"){
					if ($('.submit :last-child').hasClass('LL_message')) {$('.submit :last-child').remove()};
					$('.submit').append('<p class="LL_message" style="color: #37e1b4; text-shadow: 1px 1px 2px; font-size: 17px; margin-top:10px; margin-left:-40px; width:450px ">Письмо отправлено на почту. Для завершения регистрации пройдите по ссылке, указанной в письме.</p>')
				} else if (data == 'user exist') {
					if ($('.submit :last-child').hasClass('LL_message')) {$('.submit :last-child').remove()};
					$('.submit').append('<p class="LL_message" style="color: #37e1b4; text-shadow: 1px 1px 2px; font-size: 17px; margin-top:10px; margin-left:-40px; width:450px ">Пользователь с таким email уже существует</p>')
				} else {
					if ($('.submit :last-child').hasClass('LL_message')) {$('.submit :last-child').remove()};
					$('.submit').append('<p class="LL_message" style="color: #37e1b4; text-shadow: 1px 1px 2px; font-size: 17px; margin-top:10px; margin-left:-40px; width:450px ">Ошибка 1408. Попробуйте зарегистрироваться позже</p>')
				}
			},
			failure: function(){
				alert('fail!');
			}
		});
		return false;
	});
});