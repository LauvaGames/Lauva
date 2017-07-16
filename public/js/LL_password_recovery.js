$('#LL_send_email').on("click", function(){
    $.ajax({
        url : 'http://95.46.99.158:4000/password_recovery',
        type : 'POST',
        data : JSON.stringify({"email": $('#LL_email').val()}),
        contentType: "application/json" ,
        success : function(data) {
            if (data == "mail send"){
                if ($('.submit :last-child').hasClass('LL_message')) {$('.submit :last-child').remove()};
                $('.submit').append('<p class="LL_message" style="color: #37e1b4; text-shadow: 1px 1px 2px;font-size: 17px; margin-top:10px; margin-left:-40px; width:450px ">Письмо отправлено на почту</p>')
            } else if(data == 'user not exist') {
                if ($('.submit :last-child').hasClass('LL_message')) {$('.submit :last-child').remove()};
                $('.submit').append('<p class="LL_message" style="color: #37e1b4; text-shadow: 1px 1px 2px; font-size: 17px; margin-top:10px; margin-left:-40px; width:450px ">Такого пользователя не существует, проверьте, пожалуйста, email</p>')
            } else if(data == 'redirect') {
                window.location = "/";
            } else {
                if ($('.submit :last-child').hasClass('LL_message')) {$('.submit :last-child').remove()};
                $('.submit').append('<p class="LL_message" style="color: #37e1b4; text-shadow: 1px 1px 2px; font-size: 17px; margin-top:10px; margin-left:-40px; width:450px ">Ошибка 1409. Повторите это действие позже</p>')
            }
        },
        failure: function(){
            alert('fail!');
        }
    });
    return false;
});

$('#LL_save_new_password').on("click", function(){
    $.ajax({
        url : 'http://95.46.99.158:4000/save_new_password',
        type : 'POST',
        data : JSON.stringify({"password": $('#LL_new_password').val(), "user_id": $('#LL_user_id').val() }),
        contentType: "application/json" ,
        success : function(data) {
            if (data == "error in save password"){
                if ($('.submit :last-child').hasClass('LL_message')) {$('.submit :last-child').remove()};
                $('.submit').append('<p class="LL_message" style="color: #37e1b4; text-shadow: 1px 1px 2px; font-size: 17px; margin-top:10px; margin-left:-40px; width:450px ">Ошибка 1410. Не удалось сохранить пароль</p>')
            } else if(data == 'redirect') {
                window.location = "/";
            } else {
                if ($('.submit :last-child').hasClass('LL_message')) {$('.submit :last-child').remove()};
                $('.submit').append('<p class="LL_message" style="color: #37e1b4; text-shadow: 1px 1px 2px; font-size: 17px; margin-top:10px; margin-left:-40px; width:450px ">Ошибка 1411. Повторите это действие позже</p>')
            }
        },
        failure: function(){
            alert('fail!');
        }
    });
    return false;
});

