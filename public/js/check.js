$(document).ready(function(){
    jQuery.validator.addMethod("login", function(value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
    }, 'Please check your input.');
    jQuery.validator.addMethod("username", function(value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
    }, 'Please check your input.');
    jQuery.validator.addMethod("number", function(value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
    }, 'Please check your input.');


    $('#LL_signup').validate({
        submitHandler: function() {
            $.ajax({
                url : 'http://95.46.99.158:4000/registration',
                type : 'POST',
                data : JSON.stringify({"email": $('#LL_email').val(), "username":$('#LL_username').val(), "password":$('#LL_passwordSignup').val()}),
                //data : {"email": $('#LL_email').val(), "username":$('#LL_username').val(), "password":$('#LL_password').val()},
                contentType: "application/json" ,
                success : function(data) {
                    console.log(data);
                    if (data == "redirect"){
                        console.log("before redirect");
                        window.location = "/profile";
                    }
                },
                failure: function(){
                    alert('fail!');
                }
            });
        },
        rules: {
            LL_email: {
                required: true,
                email: true
            },
            LL_username: {
                required: true,
                login: "^[а-яА-ЯёЁa-zA-Z0-9]+$"
            },
            LL_phone: {
                required: true,
                minlength: 14
            },
            LL_password:{
                required: true,
                minlength: 6
            },
            LL_password2:{
                required: true,
                equalTo: "#LL_passwordSignup"
            }
        },
        messages: {
            LL_email: {
                required: "Поле должно быть заполнено",
                email: "E-mail введен некорректно"
            },
            LL_username: {
                required: "Поле должно быть заполнено",
                login: "Поле должно содержать цифры или буквы"
            },
            LL_phone: {
                required: "Поле должно быть заполнено",
                minlength: "Поле заполнено некорректно"
            },
            LL_password:{
                required: "Поле должно быть заполнено",
                minlength: "Минимальная длина пароля 6 символов"
            },
            LL_password2:{
                required: "Поле должно быть заполнено",
                equalTo: "Пароль введен неверно"
            }
        }
    });

    $('#LL_loginForm').validate({
        submitHandler: function() {
            var email = $('#LL_emailLogin').val();
            var password = $('#LL_password').val();
            $.ajax({
                url : 'http://95.46.99.158:4000/login',
                type : 'POST',
                data : JSON.stringify({"email": email, "password": password}),
                contentType: "application/json" ,
                success : function(data) {
                    console.log(data);
                    if (data == "redirect"){
                        console.log("before redirect");
                        window.location = "/";
                    }
                },
                failure: function(){
                    alert('fail!');
                }
            });
        },
        rules: {
            LL_emailLogin: {
                required: true,
                email: true
            },
            LL_password:{
                required: true,
                minlength: 6
            }
        },
        messages: {
            LL_emailLogin: {
                required: "Поле должно быть заполнено",
                email: "E-mail введен некорректно"
            },
            LL_password:{
                required: "Поле должно быть заполнено",
                minlength: "Минимальная длина пароля 6 символов"
            }
        }
    });

    $('#LL_supportForm').validate({
        submitHandler: function() {

            $('#LL_password').val();
            $.ajax({
                url : 'http://95.46.99.158:5001',
                type : 'POST',
                crossDomain:true,
                data : {"email": $('#LL_email').val(), "phone": $('#LL_phone').val(), "subject": $('#LL_subject').val(), "message":$('#LL_message').val()},
                contentType: 'application/x-www-form-urlencoded',
                success : function(data) {
                    console.log(data);
                },
                failure: function(){
                    alert('fail!');
                }
            });
            console.log('письмо отправлено')
        },
        rules: {
            LL_email: {
                required: true,
                email: true
            },
            LL_phone:{
                required: true
            },
            LL_subject:{
                required: true
            },
            LL_message:{
                required: true
            }
        },
        messages: {
            LL_email: {
                required: "Поле должно быть заполнено",
                email: "E-mail введен некорректно"
            },
            LL_phone:{
                required: "Поле должно быть заполнено"
            },
            LL_subject: {
                required: "Поле должно быть заполнено"
            },
            LL_message:{
                required: "Поле должно быть заполнено"
            }
        }
    });
});

$('#LL_forgotButton').on("click", function(){
    $('#LL_forgotForm').validate({
        submitHandler: function() {
            $.ajax({
                url : 'http://95.46.99.158:5001',
                type : 'POST',
                crossDomain:true,
                data : {"to": $('#LL_emailForRestoration').val()},
                contentType: 'application/x-www-form-urlencoded',
                success : function(data) {
                    console.log(data);
                },
                failure: function(){
                    alert('fail!');
                }
            });
            console.log('письмо отправлено')
        },
        rules: {
            LL_emailForRestoration: {
                required: true,
                email: true
            }
        },
        messages: {
            LL_emailForRestoration: {
                required: "Поле должно быть заполнено",
                email: "E-mail введен некорректно"
            }
        }
    });
});

$('#LL_updatePasswordButton').on("click", function(){
    $('#LL_newPasswordForm').validate({
        submitHandler: function() {

            $.ajax({
                url : 'newPassword',
                type : 'POST',
                data : JSON.stringify({"newpassword": $.trim($('#LL_newpassword').val())}),
                contentType: false,
                success : function(data) {
                    console.log(data);
                    if ( data == 'error in update password') {
                        window.location = "/changePassword";
                    }
                    else if ( data == 'redirect') {
                        window.location = "/profile";
                    }
                },
                failure: function(){
                    alert('fail!');
                }
            });
            console.log('письмо отправлено')
        },
        rules: {
            LL_newpassword: {
                required: true,
                minlength: 6
            },
            LL_newpassword2: {
                required: true,
                equalTo: "#LL_newpassword"
            }
        },
        messages: {
            LL_newpassword: {
                required: "Поле должно быть заполнено",
                minlength: "Минимальная длина пароля 6 символов"
            },
            LL_newpassword2: {
                required: "Поле должно быть заполнено",
                equalTo: "Пароли не совпадают"
            }
        }
    });
});

$('#LL_createFederation').on("click", function(){
    $('#LL_createFederationForm').validate({
        rules: {
            LL_federName: {
                required: true
            },
            LL_federDesc: {
                required: true
            }
        },
        messages: {
            LL_federName: {
                required: "Поле должно быть заполнено"
            },
            LL_federDesc: {
                required: "Поле должно быть заполнено"
            }
        }
    });
});

$('#LL_createTeamForm').on("click", function(){
    $('#LL_createTeamForm').validate({
        rules: {
            LL_teamName: {
                required: true
            },
            LL_teamDesc: {
                required: true
            }
        },
        messages: {
            LL_teamName: {
                required: "Поле должно быть заполнено"
            },
            LL_teamDesc: {
                required: "Поле должно быть заполнено"
            }
        }
    });
});

$('#LL_profileButton').on("click", function(){
    $('#LL_profileForm').validate({
        submitHandler: function() {

            var sportArr = [];
            var langArr = [];
            $('#LL_sport :selected').each(function(i, selected){
                sportArr[i] = $(selected).text();
            });
            $('#LL_languages :selected').each(function(i, selected){
                langArr[i] = $(selected).text();
            });

            var lastName = $.trim($('#LL_lastName').val());
            var firstName = $.trim($('#LL_firstName').val());
            var email = $.trim($('#LL_email').val());
            var phone = $.trim($('#LL_phone').val());
            var username = $.trim($('#LL_username').val());
            var country = $('#LL_country :selected').val();
            var city = $('#LL_city :selected').val();
            var lang = langArr.join();
            var sport = sportArr.join();
            var work = $.trim($('#LL_work').val());
            var skype = $.trim($('#LL_skype').val());
            var insta = $.trim($('#LL_instagram').val());
            var avatar = $('#photo_adress').val();

            $.ajax({
                url : 'editProfile',
                type : 'POST',
                data : JSON.stringify({"lastName": lastName, "firstName": firstName, "email": email, "phone": phone, "username": username, "country": country, "city": city, "lang": lang, "sport": sport, "work": work, "skype": skype, "insta": insta, "avatar":avatar}),
                contentType: 'application/json',
                success : function(data) {
                    console.log(data);
                    if ( data == 'error in update profile') {
                        window.location = "/profile";
                    }
                    else if ( data == 'redirect') {
                        window.location = "/";
                    }
                },
                failure: function(){
                    alert('fail!');
                }
            });
        },

        
        rules: {
            LL_lastName: {
                required: true,
                username: "[A-Za-zА-Яа-яЁё]"
            },
            LL_firstName: {
                required: true,
                username: "[A-Za-zА-Яа-яЁё]"
            },
            LL_email: {
                required: true,
                email: true
            },
            LL_phone: {
                number: "^[ 0-9]+$"
            },
            LL_username: {
                login: "^[а-яА-ЯёЁa-zA-Z0-9]+$"
            }
        },
        messages: {
            LL_lastName: {
                required: "Поле должно быть заполнено",
                username: "Введите корректную фамилию"
            },
            LL_firstName: {
                required: "Поле должно быть заполнено",
                username: "Введите корректное имя"
            },
            LL_email: {
                required: "Поле должно быть заполнено",
                email: "E-mail введен некорректно"
            },
            LL_phone: {
                number: "Поле может содержать только цифры"
            },
            LL_username: {
                login: "Поле должно содержать цифры или буквы"
            }
        }
    });
});