# -*- coding: utf-8 -*-
<%inherit file="layout.mako"/>

<%block name="title">Gipf - Game List</%block>


<div class="row">
    <h1><span class="font-semi-bold">Gipf</span> <span class="smaller">Game List</span></h1>
    <div class="col-sm-9">
        <div class="content">
            <h2>Running Games</h2>
            <div class="list-group">
            % for (key, game) in running_games.items():
                 <a class="list-group-item" href="/game/${key}">
                    <h3 class="list-group-item-heading">${key}</h3>
                    <p class="list-group-item-text">
                        ${game.player_white}
                        % if game.player_on_turn == game.player_white:
                            <span class="fa fa-flag"> </span>
                        % endif
                        - ${game.player_black}
                        % if game.player_on_turn == game.player_black:
                            <span class="fa fa-flag"> </span>
                        % endif
                    </p>
                </a>
            % endfor
            </div>

            <h2>Open Games</h2>
             <div class="list-group">
            % for (key, game) in open_games.items():
                <a class="list-group-item" href="/game/${key}/join">
                    <div class="row">
                        <div class="col-xs-6">${key}</div>
                        <div class="col-xs-3">
                            % if game.player_white:
                                ${game.player_white}
                            % else:
                                <span class='label label-default'>Join</span>
                            % endif
                        </div>
                        <div class="col-xs-3">
                            % if game.player_black:
                                ${game.player_black}
                            % else:
                                <span class='label label-default'>Join</span>
                            % endif
                        </div>
                    </div>
                </a>
            % endfor
                 </div>

            <h2>Finished Games</h2>
            <div class="list-group">
            % for (key, game) in finished_games.items():
                 <a class="list-group-item" href="/game/${key}">
                    <div class="row">
                        <div class="col-xs-6">${key}</div>
                        <div class="col-xs-3">${game.player_white}
                            % if game.player_on_turn == game.player_white:
                                <span class="fa fa-trophy"> </span>
                            % endif
                        </div>
                        <div class="col-xs-3">${game.player_black}
                            % if game.player_on_turn == game.player_black:
                                <span class="fa fa-trophy"> </span>
                            % endif
                        </div>
                    </div>
                </a>
            % endfor
            </div>


        </div>
    </div>
    <div class="col-sm-3">
        <h2>Create new game</h2>
        % if login:
            <form id="newGame" action="newGame">
                <label>Game Name<input type="text" class="form-control" name="name" id="name"></label>
                <label>Color<select id="color" class="form-control" name="color">
                    <option>White</option>
                    <option>Black</option>
                </select></label>
                <input type="submit" class="form-control" value="New Game"/>
            </form>
        % else:
            <a href="login">Login</a> for creating new games!
        % endif
  </div>
</div>

