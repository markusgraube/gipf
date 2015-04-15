# -*- coding: utf-8 -*-
<%inherit file="layout.mako"/>

<%block name="title">Gipf - Game</%block>

<%block name="header">

</%block>
<%block name="scripts">
    <script src="${request.static_url('gipf:static/js/raphael.js')}"></script>
    <script src="${request.static_url('gipf:static/js/drawBoard.js')}"></script>
    <script type="text/javascript" charset="utf-8">
        function up() {
            this.animate({"fill-opacity": 0.9}, 200);
console.log(this.nr);
            if (this.dir){
                this.line.remove();
                var in_data = {'field': this.field, 'stone': this.nr, 'direction': this.dir};
                $.post('/api/game/${id}/move', {'field': this.field, 'stone': this.nr, 'direction': this.dir}, function(data) {
                            updateBoard();
                        }
                    );
                }
        }

        function initStones(game_id) {
        $.get('/api/game/'+game_id, function (stones_json) {
            for (var key in stones_json) {
                var stone = stones_json[key];
                stones[key] = drawStone(key, stone.field, stone.color);
            }

        });
    }

        function updateBoard () {
            $.get('/api/game/${id}', function(stones_json) {
                for (var key in stones_json) {
                    if (stones_json[key].field != "reserve_white" && stones_json[key].field != "reserve_black")
                        moveStone(key, stones_json[key].field);
                }
            });
        }

        $('#action_update').click(function () {
            console.log("update clicked");
            updateBoard();
        });


        //var st = r.set();
        //st.push(
        //    r.circle(10, 10, 5),
        //    r.circle(30, 10, 5)
        //);

        $(document).ready(function(){
            initStones('${id}');
            updateBoard();
        });
    </script>
</%block>


<div class="row">
  <div class="col-md-10">
    <div class="content">
      <h1><span class="font-semi-bold">Game</span> <span class="smaller">${id}</span></h1>
        <div id="holder"></div>
        <button class="btn btn-default" id="action_update">Update</button>
    </div>
  </div>
  <div class="col-md-2">
    <h1>Game Statistics</h1>
      <ul>
          <li>White: ${game.player1}</li>
          <li>Black: ${game.player2}</li>
          <li>Turns: ${game.turn}</li>
          <li>Time: 12:23</li>
      </ul>
  </div>
</div>

