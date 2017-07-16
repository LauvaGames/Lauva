//$('#LL_buttonForCreateNewBranch').on("click", function(){
$(document).ready(function () {
    /*var teams = $('#LL_teamsInBranch').val(); //количество учатсников
    var type = $('#LL_typeOfBranch :selected').val(); // тип турнира

    if(teams%2 == 1) {
        $('#LL_federEvents').append('<p class="branchError" style="margin-left:20px; color:red; font-size: 17px; font-weight: 600"> Для построения кубковой сетки должно быть парное количество команд </p>')
    } else if(teams%4 > 0) {
        $('#LL_federEvents').append('<p class="branchError" style="margin-left:20px; color:red; font-size: 17px; font-weight: 600"> Для построения кубковой сетки необходимо количество команд кратное 4 </p>')
    } else {
        $('.branchError').remove();*/
        // functionaly
        var teams = 8;
        var matchs = [];
        for (var i=0; i<teams/2; i++) {
            matchs.push([null, null]);
        }
        var saveData = {
            teams: matchs,
            results: [
                [
                    [[null, null], [null, null], [null, null], [null, null]],
                    [[null, null], [null, null]],
                    [[null, null], [null, null]]
                ]
            ]
        };


        /* Called whenever bracket is modified
         *
         * data:     changed bracket object in format given to init
         * userData: optional data given when bracket is created.
         */
        function saveFn(data, userData) {
            var json = JSON.stringify(data);
            console.log(data);

             /*$.ajax({
                 url : 'tournamentScores',
                 type : 'POST',
                 data : json,
                 contentType: "application/json" ,
                 success : function(data) {
                 console.log(data);
                 },
                 failure: function(){
                 alert('fail!');
                 }
             });*/

        }

        $(function() {
            var container = $('div#LL_branch .demo');
            container.bracket({
                teamWidth: 150, //размер инпута
                scoreWidth: 20, //
                matchMargin: 30,
                roundMargin: 50,
                skipConsolationRound: true,
                disableToolbar: true,
                init: saveData,
                save: saveFn});

            /* You can also inquiry the current data */
            var data = container.bracket('data');
            $('#dataOutput').text(JSON.stringify(data));
        })
    });
//});