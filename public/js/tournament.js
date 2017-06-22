$(document).ready(function(){
    var teams = 8; //количество учатсников
    var type = 'Кубок'; // тип турнира


    /// jqeury bracket options
    var minimalData = {
        teams : [
            ["Team 1", "Team 2"], /* first matchup */
            ["Team 3", "Team 4"]  /* second matchup */
        ],
        results : [
            [[1,2], [3,4]],       /* first round */
            [[4,6], [2,1]]        /* second round */
        ]
    };

    $(function() {
        $('#minimal .demo').bracket({
            init: minimalData /* data to initialize the bracket with */ })
    });


    // resize params
    var resizeParameters = {
        teamWidth: 200,
        scoreWidth: 20,
        matchMargin: 10,
        roundMargin: 50,
        init: minimalData
    };

    function updateResizeDemo() {
        $('#minimal .demo').bracket(resizeParameters);
    }

    $(updateResizeDemo);

    // functionaly

    var saveData = {
        teams: [
            ["Team 1", "Team 2"],
            ["Team 3", null],
            ["Team 4", null],
            ["Team 5", null]
        ],
        results: [
            [
                [[1, 0], [null, null], [null, null], [null, null]],
                [[null, null], [1, 4]],
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
        $('#saveOutput').text('POST '+userData+' '+json);
        /* You probably want to do something like this
         jQuery.ajax("rest/"+userData, {contentType: 'application/json',
         dataType: 'json',
         type: 'post',
         data: json})
         */
    }

    $(function() {
        var container = $('div#minimal .demo');
        container.bracket({
            teamWidth: 150, //размер инпута
            scoreWidth: 20, //
            matchMargin: 30,
            roundMargin: 50,
            skipConsolationRound: true,
            init: saveData,
            save: saveFn,
            userData: "http://myapi"});

        /* You can also inquiry the current data */
        var data = container.bracket('data');
        $('#dataOutput').text(JSON.stringify(data));
    })
});