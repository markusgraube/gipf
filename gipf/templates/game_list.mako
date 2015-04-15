# -*- coding: utf-8 -*-
<%inherit file="layout.mako"/>

<%block name="title">Gipf - Game List</%block>



<div class="row">
  <h1><span class="font-semi-bold">Gipf</span> <span class="smaller">Game List</span></h1>
    <div class="col-sm-9">
    <div class="content">

      <p class="lead">Running Games</p>
      <table border="1px">
      <tbody>
        % for (key, game) in games.items():
           <tr  class="game_row">
                <td class="game_name">
                    <a href="/game/${key}">${key}</a>
                </td>
                <td>
                    ${game.player1 or "none"}
                </td>
                <td>
                    ${game.player2 or "none"}
                </td>
            </tr>
        % endfor
    </tbody>
            </table>
    </div>
  </div>
  <div class="col-sm-3">
      <a href="/newGame" class="btn btn-default">New Game</a>
      </div>
</div>

