$(document).ready(function() {

    var animating = false,
        submitPhase1 = 1100,
        submitPhase2 = 400,
        logoutPhase1 = 800,
        $login = $(".login"),
        $app = $(".app");

    function ripple(elem, e) {
        $(".ripple").remove();
        var elTop = elem.offset().top,
            elLeft = elem.offset().left,
            x = e.pageX - elLeft,
            y = e.pageY - elTop;
        var $ripple = $("<div class='ripple'></div>");
        $ripple.css({top: y, left: x});
        elem.append($ripple);
    };

    $(document).on("click", ".login__submit", function(e) {
        var email = $('#LL_username').val();
        var password = $('#LL_password').val();
        $.ajax({
            url : 'http://95.46.99.158:4000/login',
            type : 'POST',
            data : JSON.stringify({"email": email, "password": password}),
            contentType: "application/json" ,
            success : function(data) {
                if (data == "redirect"){
                    window.location = "/";
                }
            },
            failure: function(){
                alert('fail!');
            }
        });

        if (animating) return;
        animating = true;
        var that = this;
        ripple($(that), e);
        $(that).addClass("processing");
        setTimeout(function() {
            $(that).addClass("success");
            /*setTimeout(function() {
                $app.show();
                $app.css("top");
                $app.addClass("active");
            }, submitPhase2 - 70);*/
            setTimeout(function() {
                //$login.hide();
                //$login.addClass("inactive");
                animating = false;
                $(that).removeClass("success processing");
            }, submitPhase2);
        }, submitPhase1);

    });

    $(document).on("click", ".app__logout", function(e) {
        if (animating) return;
        $(".ripple").remove();
        animating = true;
        var that = this;
        $(that).addClass("clicked");
        setTimeout(function() {
            $app.removeClass("active");
            $login.show();
            $login.css("top");
            $login.removeClass("inactive");
        }, logoutPhase1 - 120);
        setTimeout(function() {
            $app.hide();
            animating = false;
            $(that).removeClass("clicked");
        }, logoutPhase1);
    });

});