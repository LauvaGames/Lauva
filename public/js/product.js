$(document).ready(function () {
    /// user photo show/hide
    if (window.location.pathname == "/authorize" || window.location.pathname == "/forgotPassword") {
    }else {
        $('#LL_userInform').show();
    }

    // лейблы для всех инпутов, заполненных автоматически "уходят наверх"
    var inp = $('input').find();
    for(var i=0; i<inp.prevObject.length; i++) {
        var id = '#' + inp.prevObject[i].id;
        if($(id).val() != '') {
            $(id).prev('label').addClass('active highlight');
        }
    }
});


/// лейбл для инпутов
$('.form').find('input, textarea').on('keyup blur focus', function (e) {

    var $this = $(this),
        label = $this.prev('label');

    if (e.type === 'keyup') {
        if ($this.val() === '') {
            label.removeClass('active highlight');
        } else {
            label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
        if( $this.val() === '' ) {
            label.removeClass('active highlight');
        } else {
            label.removeClass('highlight');
        }
    } else if (e.type === 'focus') {

        if( $this.val() === '' ) {
            label.removeClass('highlight');
        }
        else if( $this.val() !== '' ) {
            label.addClass('highlight');
        }
    }

});
$('#LL_createFederationForm').find('input, textarea').on('keyup blur focus', function (e) {

    var $this = $(this),
        label = $this.prev('label');

    if (e.type === 'keyup') {
        if ($this.val() === '') {
            label.removeClass('active highlight');
        } else {
            label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
        if( $this.val() === '' ) {
            label.removeClass('active highlight');
        } else {
            label.removeClass('highlight');
        }
    } else if (e.type === 'focus') {

        if( $this.val() === '' ) {
            label.removeClass('highlight');
        }
        else if( $this.val() !== '' ) {
            label.addClass('highlight');
        }
    }

});

$('#LL_createTeamForm').find('input, textarea').on('keyup blur focus', function (e) {
    var $this = $(this),
        label = $this.prev('label');

    if (e.type === 'keyup') {
        if ($this.val() === '') {
            label.removeClass('active highlight');
        } else {
            label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
        if( $this.val() === '' ) {
            label.removeClass('active highlight');
        } else {
            label.removeClass('highlight');
        }
    } else if (e.type === 'focus') {

        if( $this.val() === '' ) {
            label.removeClass('highlight');
        }
        else if( $this.val() !== '' ) {
            label.addClass('highlight');
        }
    }
});

$('.tab a').on('click', function (e) {

    e.preventDefault();

    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');

    target = $(this).attr('href');

    $('.tab-content > div').not(target).hide();

    $(target).fadeIn(600);

});

$('.LL_link a').on('click', function (e) {

    e.preventDefault();

    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');

    target = $(this).attr('href');

    $('.LL_link-content > div').not(target).hide();

    $(target).fadeIn(600);

});

$('.LL_linkTeam a').on('click', function (e) {

    e.preventDefault();

    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');

    target = $(this).attr('href');

    $('.LL_linkTeam-content > div').not(target).hide();

    $(target).fadeIn(600);

});










/// выбор городов по выбранной стране
$('#LL_country').on("change", function(){
    var country_id = $('#LL_country :selected').data('id');
    $.ajax({
        url : 'getCities/?country_id=' + country_id,
        type : 'GET',
        success : function(data) {
            try {
                var cities = JSON.parse(data);
            }
            catch(e) {
                console.log('Ошибка ' + e.name + ": " + e.message + "\n" + e.stack);
            }

            var cityStr = "";
            for(var i=0; i<cities.length; i++) {
                cityStr = cityStr + "<option value='" + cities[i].city + "'>" + cities[i].city+ "</option>"
            }
            $('#LL_city').html(cityStr);
            $('#LL_teamCity').html(cityStr);
        },
        failure: function(){
            alert('fail on addBooks!!!');
        }
    })
});

/// города для страны по IP
$(document).ready(function(){
    var country_id = $('#LL_country :selected').data('id');
    $.ajax({
        url : 'getCities/?country_id=' + country_id,
        type : 'GET',
        success : function(data) {
            try {
                var cities = JSON.parse(data);
            }
            catch(e) {
                console.log('Ошибка ' + e.name + ": " + e.message + "\n" + e.stack);
            }
            var count = cities.length - 1;
            var cityStr = "";
            for(var i=0; i<cities.length-1; i++) {
                if (cities[i].city == cities[count].mycity) {
                    cityStr = cityStr + "<option selected value='" + cities[i].city + "'>" + cities[i].city+ "</option>"
                } else {
                    cityStr = cityStr + "<option value='" + cities[i].city + "'>" + cities[i].city+ "</option>"
                }

            }
            $('#LL_city').html(cityStr);
            $('#LL_teamCity').html(cityStr);
        },
        failure: function(){
            alert('fail on addBooks!!!');
        }
    })
});

/// пользователь выбрал фото
$('#LL_userPhotoToCrop').on("change", function() {
    var formData = new FormData();
    formData.append('file', $('#LL_userPhotoToCrop')[0].files[0]);
    $.ajax({
        url : 'addUserPhoto',
        type : 'POST',
        data : formData,//{}
        processData: false,
        contentType: false,  
        success : function(data) {
            alert(data);
            if (  data == 'exten not valid') {
                $('.modal-body').empty();
                $('.modal-body').html('<div id="LL_choosePhoto"><p> Пожалуйста, выберите фото в формате JPG, GIF или PNG </p></div>');
                $('#LL_testLabel2').show();
            } else {
                $('.modal-body').empty();
                $('.modal-body').html('<img id="LL_userPhoto2" src="' + data + '">');
                $('#LL_testLabel2').show();
                $(function(){
                    $('#LL_userPhoto2').Jcrop({
                        aspectRatio: 1,
                        onChange: showCoords,
                        onSelect: showCoords
                    });
                });
                function showCoords(c)
                {
                    jQuery('#x1').val(c.x);
                    jQuery('#y1').val(c.y);
                    jQuery('#width1').val(c.w);
                    jQuery('#height1').val(c.h);
                };

                jQuery('#image1').val(data);
            }
        },
        failure: function(){
            alert('fail!');
        }
    });
});
// если пользователь выбирает другое фото
$('#LL_userPhotoToCrop2').on("change", function() {
    var formData = new FormData();
    formData.append('file', $('#LL_userPhotoToCrop2')[0].files[0]);
    $.ajax({
        url : 'addUserPhoto',
        type : 'POST',
        data : formData,//{}
        processData: false,
        contentType: false,
        success : function(data) {
            alert(data);
            if (  data == 'exten not valid') {
                $('.modal-body').empty();
                $('.modal-body').html('<div id="LL_choosePhoto"><p> Пожалуйста, выберите фото в формате JPG, GIF или PNG </p></div>');
                $('#LL_testLabel2').show();
            } else {
                $('.modal-body').empty();
                $('.modal-body').html('<img id="LL_userPhoto2" src="' + data + '">');
                $(function () {
                    $('#LL_userPhoto2').Jcrop({
                        aspectRatio: 1,
                        onChange: showCoords,
                        onSelect: showCoords
                    });
                });
                function showCoords(c) {
                    jQuery('#x1').val(c.x);
                    jQuery('#y1').val(c.y);
                    jQuery('#width1').val(c.w);
                    jQuery('#height1').val(c.h);
                };
                jQuery('#image2').val(data);
            }

        },
        failure: function(){
            alert('fail!');
        }
    });
});

// сохраняем обрезанное фото пользователя
$('#LL_buttonForSaveUserPhoto').on("click", function() {
    var photo_adress = "";


    if($('#image2').val() !== undefined && $('#image2').val() !== '') {
        photo_adress = $('#image2').val();
    } else {
        photo_adress = $('#image1').val();
    }
    var w = $('.jcrop-tracker')[1].offsetWidth;
    var h = $(".jcrop-tracker")[1].offsetHeight;
    $.ajax({
        url : 'addUserAvatar',
        type : 'POST',
        data : JSON.stringify({"x1": $('#x1').val(), "y1": $('#y1').val(), "width1":$('#width1').val(), "height1": $('#height1').val(), "adress": photo_adress, "w":w, "h":h}),
        contentType: 'application/json',  // tell jQuery not to set contentType
        success : function(data) {
            $('#LL_posterForUserPhoto').empty();
            $('#LL_posterForUserPhoto').css('backgroundImage', 'url('+data+')' );
            $('#LL_posterForUserPhoto').css("backgroundSize", 'cover');
            $('#LL_posterForUserPhoto').css("backgroundRepeat", 'no-repeat');
            $('#photo_adress').val(data);
        },
        failure: function(){
            alert('fail!');
        }
    });

});



/// Выбираем лого федерации
$('#LL_federationLogoToCrop').on("change", function() {
    var formData = new FormData();
    formData.append('file', $('#LL_federationLogoToCrop')[0].files[0]);
    $.ajax({
        url : 'addfederationLogo',
        type : 'POST',
        data : formData,//{}
        processData: false,
        contentType: false,
        success : function(data) {
            $('.modal-body').empty();
            $('.modal-body').html('<img id="LL_federationLogo2" src="' + data + '">');
            $('#LL_testLabel2').show();
            $(function(){
                $('#LL_federationLogo2').Jcrop({
                    aspectRatio: 1,
                    onChange: showCoords,
                    onSelect: showCoords
                });
            });
            function showCoords(c)
            {
                jQuery('#x1').val(c.x);
                jQuery('#y1').val(c.y);
                jQuery('#width1').val(c.w);
                jQuery('#height1').val(c.h);
            };

            jQuery('#image1').val(data);

        },
        failure: function(){
            alert('fail!');
        }
    });
});
// если пользователь выбирает другое фото
$('#LL_federationLogoToCrop2').on("change", function() {
    var formData = new FormData();
    formData.append('file', $('#LL_federationLogoToCrop2')[0].files[0]);
    $.ajax({
        url : 'addfederationLogo',
        type : 'POST',
        data : formData,//{}
        processData: false,
        contentType: false,
        success : function(data) {
            $('.modal-body').empty();
            $('.modal-body').html('<img id="LL_federationLogo2" src="' + data + '">');
            $(function(){
                $('#LL_federationLogo2').Jcrop({
                    aspectRatio: 1,
                    onChange: showCoords,
                    onSelect: showCoords
                });
            });
            function showCoords(c)
            {
                jQuery('#x1').val(c.x);
                jQuery('#y1').val(c.y);
                jQuery('#width1').val(c.w);
                jQuery('#height1').val(c.h);
            };
            jQuery('#image2').val(data);

        },
        failure: function(){
            alert('fail!');
        }
    });
});

// сохраняем обрезанное лого
$('#LL_buttonForSaveLogo').on("click", function() {
    var photo_adress = "";


    if($('#image2').val() !== undefined && $('#image2').val() !== '') {
        photo_adress = $('#image2').val();
    } else {
        photo_adress = $('#image1').val();
    }
    var w = $('.jcrop-tracker')[1].offsetWidth;
    var h = $(".jcrop-tracker")[1].offsetHeight;
    $.ajax({
        url : 'addFederationAvatar',
        type : 'POST',
        data : JSON.stringify({"x1": $('#x1').val(), "y1": $('#y1').val(), "width1":$('#width1').val(), "height1": $('#height1').val(), "adress": photo_adress, "w":w, "h":h}),
        contentType: 'application/json',  // tell jQuery not to set contentType
        success : function(data) {
            console.log(data)
            $('#wrapLogo').empty();
            $('#wrapLogo').html('<img id="LL_federLogo" src="http://95.46.99.158:4000' + data + '" data-toggle="modal" data-target="#myModal">');
            $('#photo_adress').val(data);
        },
        failure: function(){
            alert('fail!');
        }
    });

});


// Дерево ивентов
$('#LL_seeMore').on("click", function() {



    var topS = $('#LL_seeMore').css('top');
    var b = (topS.split('p')[0])*1;
    $('#LL_seeMore').css('top', (b+800) + 'px');
    //$('#LL_wrapContent').append('<div id="LL_seeMore">Посмотреть ещё</div>');


    var topF = $('#last').css('top');
    var a = (topF.split('p')[0])*1;
    $("#last").removeAttr("id");

    var topB = $('#lastBranch').css('top');
    var c = (topB.split('p')[0])*1;
    console.log(c);
    $("#lastBranch").removeAttr("id");

    for (var i=0; i<4; i++) {
        $('#LL_stem').append('<div class="LL_firstCircle" style="margin-top: 180px"> <div class="LL_secondCircle"></div> </div>')


        if (i==0 || i==2) {
            $('#LL_wrapBranch').append('<div class="LL_branchShort" style="top: ' + (c+200*(i+1)) + 'px"></div>');
            $('#LL_wrapContent').append('<div class="LL_federationEventCont LL_onShortBranch" style="top: ' + (a+200*(i+1)) + 'px"> <div style="float: left"> <div class="LL_federationEvent"> </div> <div style="float: left"> <i class="fa fa-heart LL_mark" aria-hidden="true" style="float: left"></i> <p class="LL_mark2"> 12 </p> </div> <div style="float: left"> <i class="fa fa-comment LL_mark" aria-hidden="true" style="float: left"></i> <p class="LL_mark2"> 12 </p> </div> <div style="float: left"> <i class="fa fa-share-alt LL_mark" aria-hidden="true" style="float: left"></i> <p class="LL_mark2"> 12 </p> </div> </div> <div class="LL_eventDesc"> <p> Description </p> </div> </div>');
        }
        else if (i==3) {
            $('#LL_wrapContent').append('<div id="last" class="LL_federationEventCont LL_onLongBranch" style="top: ' + (a+200*(i+1)) + 'px"> <div style="float: left"> <div class="LL_federationEvent"> </div> <div style="float: left"> <i class="fa fa-heart LL_mark" aria-hidden="true" style="float: left"></i> <p class="LL_mark2"> 12 </p> </div> <div style="float: left"> <i class="fa fa-comment LL_mark" aria-hidden="true" style="float: left"></i> <p class="LL_mark2"> 12 </p> </div> <div style="float: left"> <i class="fa fa-share-alt LL_mark" aria-hidden="true" style="float: left"></i> <p class="LL_mark2"> 12 </p> </div> </div> <div class="LL_eventDesc"> <p> Description </p> </div> </div>');
            $('#LL_wrapBranch').append('<div id="lastBranch" class="LL_branchLong" style="top: ' + (c+200*(i+1)) + 'px"></div>');
        }
        else {
            $('#LL_wrapContent').append('<div class="LL_federationEventCont LL_onLongBranch" style="top: ' + (a+200*(i+1)) + 'px"> <div style="float: left"> <div class="LL_federationEvent"> </div> <div style="float: left"> <i class="fa fa-heart LL_mark" aria-hidden="true" style="float: left"></i> <p class="LL_mark2"> 12 </p> </div> <div style="float: left"> <i class="fa fa-comment LL_mark" aria-hidden="true" style="float: left"></i> <p class="LL_mark2"> 12 </p> </div> <div style="float: left"> <i class="fa fa-share-alt LL_mark" aria-hidden="true" style="float: left"></i> <p class="LL_mark2"> 12 </p> </div> </div> <div class="LL_eventDesc"> <p> Description </p> </div> </div>');
            $('#LL_wrapBranch').append('<div class="LL_branchLong" style="top: ' + (c+200*(i+1)) + 'px"></div>');
        }
        $('#LL_wrapContent').append($('#LL_seeMore'));
    }
});


/// Логотип для команды

$('#LL_TeamLogoToCrop').on("change", function() {
    var formData = new FormData();
    formData.append('file', $('#LL_TeamLogoToCrop')[0].files[0]);
    $.ajax({
        url : 'addTeamLogo',
        type : 'POST',
        data : formData,//{}
        processData: false,
        contentType: false,
        success : function(data) {
            $('.modal-body').empty();
            $('.modal-body').html('<img id="LL_TeamLogo2" src="' + data + '">');
            $('#LL_testLabel2').show();
            $(function(){
                $('#LL_TeamLogo2').Jcrop({
                    aspectRatio: 1,
                    onChange: showCoords,
                    onSelect: showCoords
                });
            });
            function showCoords(c)
            {
                jQuery('#x1').val(c.x);
                jQuery('#y1').val(c.y);
                jQuery('#width1').val(c.w);
                jQuery('#height1').val(c.h);
            };

            jQuery('#image1').val(data);

        },
        failure: function(){
            alert('fail!');
        }
    });
});
// если пользователь выбирает другое фото
$('#LL_TeamLogoToCrop2').on("change", function() {
    var formData = new FormData();
    formData.append('file', $('#LL_TeamLogoToCrop2')[0].files[0]);
    $.ajax({
        url : 'addTeamLogo',
        type : 'POST',
        data : formData,//{}
        processData: false,
        contentType: false,
        success : function(data) {
            $('.modal-body').empty();
            $('.modal-body').html('<img id="LL_TeamLogo2" src="' + data + '">');
            $(function(){
                $('#LL_TeamLogo2').Jcrop({
                    aspectRatio: 1,
                    onChange: showCoords,
                    onSelect: showCoords
                });
            });
            function showCoords(c)
            {
                jQuery('#x1').val(c.x);
                jQuery('#y1').val(c.y);
                jQuery('#width1').val(c.w);
                jQuery('#height1').val(c.h);
            };
            jQuery('#image2').val(data);

        },
        failure: function(){
            alert('fail!');
        }
    });
});

// сохраняем обрезанное лого
$('#LL_buttonForSaveLogo').on("click", function() {
    var photo_adress = "";

    if($('#image2').val() !== undefined && $('#image2').val() !== '') {
        photo_adress = $('#image2').val();
    } else {
        photo_adress = $('#image1').val();
    }
    var w = $('.jcrop-tracker')[1].offsetWidth;
    var h = $(".jcrop-tracker")[1].offsetHeight;
    $.ajax({
        url : 'addTeamAvatar',
        type : 'POST',
        data : JSON.stringify({"x1": $('#x1').val(), "y1": $('#y1').val(), "width1":$('#width1').val(), "height1": $('#height1').val(), "adress": photo_adress, "w":w, "h":h}),
        contentType: 'application/json',  // tell jQuery not to set contentType
        success : function(data) {
            $('#wrapLogo').empty();
            $('#wrapLogo').html('<img id="LL_federLogo" src="http://95.46.99.158:4000' + data + '" data-toggle="modal" data-target="#myModal">');
            $('#photo_adress').val(data);
        },
        failure: function(){
            alert('fail!');
        }
    });
});


// выход со страницы
$('#LL_logOut').on("click", function(){
    console.log("logout");
    $.ajax({
        url : 'logout',
        type : 'GET',
        success : function(data) {
            console.log('data');
            if (data == "logout"){
                console.log("before redirect");
                window.location = "/";
            }
        },
        failure: function(){
            alert('fail!');
        }
    });
    
});


$('#LL_createFederation').on("click", function() {
    var federName = $.trim($('#LL_federName').val());
    var federDesc = $.trim($('#LL_federDesc').val());
    var country = $('#LL_country :selected').val();
    var city = $('#LL_city :selected').val();
    var sport = $('#LL_federSport :selected').val();
    $.ajax({
        url : 'http://95.46.99.158:4000/createFederation',
        type : 'POST',
        data : JSON.stringify({"federName": federName, "federDesc": federDesc, "country": country, "city": city, "sport":sport}),
        contentType: "application/json" ,
        error: function(error) {
            console.log(error);
        },
        success : function(data) {
            console.log(data);
            if ( data == 'federation exist') {
                $('#LL_createFederationForm').append('<p style="color:red; font-weight: 600">Такая федерация уже существует</p>')
            }else if ( data == "error in write to mongo") {
                alert("error in write to mongo");
            }else {
                alert(data);
                window.location  = data;
            }
        },
        failure: function(){
            alert('fail!');
        }
    });
});


$('#LL_createTeam').on("click", function() {
    var teamName = $.trim($('#LL_teamName').val());
    var teamDesc = $.trim($('#LL_teamDesc').val());
    var teamCountry = $('#LL_teamCountry :selected').val();
    var teamCity = $('#LL_teamCity :selected').val();
    var sport = $('#LL_teamSport :selected').val();
    $.ajax({
        url : 'http://95.46.99.158:4000/createTeam',
        type : 'POST',
        data : JSON.stringify({"teamName": teamName, "teamDesc": teamDesc, "teamCountry": teamCountry, "teamCity": teamCity, "sport":sport}),
        contentType: "application/json" ,
        error: function(error) {
            console.log(error);
        },
        success : function(data) {
            console.log(data);
            if ( data == 'team exist') {
                $('#LL_createTeamForm').append('<p style="color:red; font-weight: 600">Такая команда уже существует</p>')
            }else if ( data == "error in write to mongo") {
                alert("error in write to mongo");
            }else {
                alert(data);
                window.location  = data;
            }
        },
        failure: function(){
            alert('fail!');
        }
    });
});


$('#LL_addTournament').on("click", function() {
    var name = $.trim($('#LL_tournamentName').val());
    var type = $.trim($('#LL_tournamentType').val());
    var dateAndTime = $.trim($('#LL_dateTimeTournament').val());
    var desc = $.trim($('#LL_tournamentDescription').val());

    var date = dateAndTime.split(' ')[0];
    var time = dateAndTime.split(' ')[1];
    var coordsX =  $('#LL_coordsX').val();
    var coordsY =  $('#LL_coordsY').val();

    $.ajax({
        url : 'createTournament',
        type : 'POST',
        async: false,
        data : JSON.stringify({"name": name, "type": type, "date": date, "time": time, "desc":desc, "coordsX":coordsX, "coordsY":coordsY}),
        contentType: "application/json" ,
        error: function(error) {
            console.log(error);
        },
        success : function(data) {
            console.log(data);
            if ( data == 'tournament exist') {
                $('#LL_tournamentForm').append('<p style="color:red; font-weight: 600">Такой турнир уже существует</p>')
            }else if ( data == "error in write to mongo") {
                alert("error in write to mongo");
            }else if ( data == "/tournamentPage") {
                alert(data);
                window.location = "http://95.46.99.158:4000/tournamentPage";
            }else{
                alert("!!!!!!!!");
            }
        },
        failure: function(){
            alert('fail!');
        }
    });
});

$('#LL_addEvent').on("click", function() {
    var name = $.trim($('#LL_eventName').val());
    var dateAndTime = $.trim($('#LL_dateTimeEvent').val());
    var desc = $.trim($('#LL_eventDescription').val());

    var date = dateAndTime.split(' ')[0];
    var time = dateAndTime.split(' ')[1];
    var coordsX =  $('#LL_coordsEventX').val();
    var coordsY =  $('#LL_coordsEventY').val();

    $.ajax({
        url : 'createEvent',
        type : 'POST',
        async: false,
        data : JSON.stringify({"name": name, "date": date, "time": time, "desc":desc, "coordsX":coordsX, "coordsY":coordsY}),
        contentType: "application/json" ,
        error: function(error) {
            console.log(error);
        },
        success : function(data) {
            console.log(data);
            if ( data == 'event exist') {
                $('#LL_eventForm').append('<p style="color:red; font-weight: 600">Такое мероприятие уже существует</p>')
            }else if ( data == "error in write to mongo") {
                alert("error in write to mongo");
            }else if ( data == "/eventPage") {
                alert(data);
                window.location = "http://95.46.99.158:4000/tournamentPage";
            }else{
                alert("!!!!!!!!");
            }
        },
        failure: function(){
            alert('fail!');
        }
    });
});


// add photo for news
$('#LL_newsPhoto').on("change", function() {
    if ($('#LL_newsPhoto')[0].files.length > 5) {
        $('#LL_wrapnewsPhoto').append('<p style="color:red; font-weight: 600; margin-left: 20px">Можно загрузить максимум 5 фото</p>')
    } else {
        var formData = new FormData();
        for (var i=0; i<$('#LL_newsPhoto')[0].files.length; i++) {
            formData.append('file', $('#LL_newsPhoto')[0].files[i]);
        }
        $.ajax({
            url : 'uploadNewsImg',
            type : 'POST',
            data : formData,//{}
            processData: false,
            contentType: false,
            success : function(data) {

                var filesLocation = data.split(',');
                $('#LL_wrapnewsPhoto p').remove();

                for (i=0; i<filesLocation.length; i++) {
                    $('#LL_wrapnewsPhoto').append('<input id="filesLocation' + i + '" type="hidden" value="' + filesLocation[i] + '">');
                    $('#LL_wrapnewsPhoto').append('<div id="fileAvatar' + i + '" type="text" style="width: 100px; height: 100px; margin: 30px 30px 0 0; float: left" ></div>');
                    var id = "#fileAvatar" + i;
                    $(id).css('backgroundImage', 'url('+filesLocation[i]+')' );
                    $(id).css("backgroundSize", 'contain');
                    $(id).css("backgroundRepeat", 'no-repeat');
                }
                $('#LL_wrapnewsPhoto').append('<br clear="left">');
            },
            failure: function(){
                alert('fail!');
            }
        });
    }
});



$('#LL_addNews').on("click", function() {
    var title = $.trim($('#LL_title').val());
    var subtitle = $.trim($('#LL_subtitle').val());
    var text = $.trim($('#LL_text').val());
    var video = $.trim($('#LL_newsVideo').val());

    var photoArray = [];
    for (var i=0; i<$('#LL_newsPhoto')[0].files.length; i++) {
        var id = "#filesLocation" + i;
        var pushed = photoArray.push($(id).val());
    }

    $.ajax({
        url : 'createNews',
        type : 'POST',
        async: false,
        data : JSON.stringify({"title": title, "subtitle": subtitle, "text": text, "video":video, "photos":photoArray}),
        contentType: "application/json" ,
        error: function(error) {
            console.log(error);
        },
        success : function(data) {
            if ( data == "error in write to mongo") {
                alert("error in write to mongo");
            }else if ( data == "/newsPage") {
                alert(data);
                window.location = "http://95.46.99.158:4000/tournamentPage";
            }else{
                alert("!!!!!!!!");
            }
        },
        failure: function(){
            alert('fail!');
        }
    });
});

$('#LL_userInform').on("click", function() {
    $( "#LL_topNav" ).toggle(function (){
        //$('#LL_userInform').css('backgroundColor', 'rgb(30, 52, 72)');
    });
});
