# -*- coding: utf-8 -*-
<%inherit file="layout.mako"/>

<%block name="title">Gipf - Game</%block>


<%block name="header"></%block>


<%block name="scripts">
    <script src="${request.static_url('gipf:static/js/raphael.js')}"></script>
    <script src="${request.static_url('gipf:static/js/gipfBoard.js')}"></script>
    <script type="text/javascript" charset="utf-8">
        var turn_old;

        function sendMove(field, stone, direction){
            $.post('/api/game/${id}/move', {'field': field, 'stone': stone, 'direction': direction}, function(response_json) {
                console.log(response_json);
                if (response_json.error == false)
                    makeStoneUnmoveable(stone);
                else {
                    $(".message-box").append("" +
                            "<div class='alert alert-warning alert-dismissible' role='alert'>" +
                            "   <button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
                            response_json.error +
                            "</div>");
                }
                updateBoard(response_json.game);
                updateInfoBox(response_json.game);
            });
        }

        function sendTakeRow(row_id, row) {
            $.post('/api/game/${id}/take', {'row_id': row_id}, function(response_json) {
                console.log(response_json);
                if (response_json.error == false)
                    releaseStones(row);
                updateBoard(response_json.game);
                updateInfoBox(response_json.game);
            });
        }

        function getUpdateBoard() {
            $.get('/api/game/${id}', function(game_json) {
                console.log(game_json);
                if (turn_old != game_json.turn) {
                    turn_old = game_json.turn;
                    updateBoard(game_json);
                    updateInfoBox(game_json);
                }
            });
        }

        function updateInfoBox(game) {
            if (game.player_on_turn == game.player_white) {
                $('#white_on_turn').addClass('fa-flag');
                $('#black_on_turn').removeClass('fa-flag');
            } else {
                $('#black_on_turn').addClass('fa-flag');
                $('#white_on_turn').removeClass('fa-flag');
            }
            $('#turns').html(game.turn);

        }

        $('#action_update').click(function () {
            console.log("update clicked");
            getUpdateBoard();
        });


        setInterval( function () {
                 getUpdateBoard();
            }, 3000 );

        $(document).ready(function(){
            initRaphael();
            initStones('${id}', '${user_logged_in}');
            getUpdateBoard();

        });
    </script>
</%block>


<%
    if game.player_on_turn ==  game.player_white:
        flag_white = "fa-flag"
        flag_black = ""
    else:
        flag_white = ""
        flag_black = "fa-flag"
%>

<h1><span class="font-semi-bold">Game</span> <span class="smaller">${id}</span></h1>
<div id="game_info"  class="row">
    <ul class="list-inline">
        <li>White: ${game.player_white} <span id="white_on_turn" class="fa ${flag_white} fa-lg"> </span></li>
        <li>Black: ${game.player_black} <span id="black_on_turn" class="fa ${flag_black} fa-lg"> </span></li>
        <li>Turn: <span id="turns">${game.turn}</span></li>
        <li>Time: 12:23</li>
        <li><a id="action_update"><span id="black_on_turn" class="fa fa-refresh"> </span></a></li>
    </ul>
    <div class="col-xs-12">
        <div id="holder"></div>
    </div>
</div>

