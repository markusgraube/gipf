# -*- coding: utf-8 -*-
<%inherit file="layout.mako"/>

<%block name="title">Gipf - Game</%block>


<%block name="header"></%block>


<%block name="scripts">
    <script src="${request.static_url('gipf:static/js/raphael.js')}"></script>
    <script src="${request.static_url('gipf:static/js/gipfBoard.js')}"></script>
    <script type="text/javascript" charset="utf-8">

        function sendMove(field, stone, direction){
            $.post('/api/game/${id}/move', {'field': field, 'stone': stone, 'direction': direction}, function(response_json) {
                console.log(response_json);
                  if (response_json.error == false)
                    makeStoneUnmoveable(stone);
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
                updateBoard(game_json);
                updateInfoBox(game_json);
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

        $(document).ready(function(){
            initRaphael();
            initStones('${id}');
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


<div class="row">
    <h1><span class="font-semi-bold">Game</span> <span class="smaller">${id}</span></h1>
    <div id="game_info" class="col-md-2">
        <h2>Info</h2>
        <ul>
            <li>White: ${game.player_white} <span id="white_on_turn" class="fa ${flag_white} fa-lg"> </span></li>
            <li>Black: ${game.player_black} <span id="black_on_turn" class="fa ${flag_black} fa-lg"> </span></li>
            <li>Turns: <span id="turns">${game.turn}</span></li>
            <li>Time: 12:23</li>
            <li><button class="btn btn-default" id="action_update">Update</button></li>
        </ul>
    </div>
    <div class="col-md-10">
        <div id="holder"></div>
    </div>
</div>

