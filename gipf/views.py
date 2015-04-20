from pyramid.httpexceptions import HTTPFound, HTTPBadRequest
from pyramid.security import remember, forget
from pyramid.view import view_config, view_defaults, notfound_view_config, forbidden_view_config

from .models import Game, Configuration

from .security import USERS

import logging

log = logging.getLogger(__name__)


@notfound_view_config(renderer='templates/notfound.mako')
def notfound(request):
    return {'request': request}


@view_config(route_name='home', renderer='templates/home.mako')
def home_view(request):
    return {'logged_in': request.authenticated_userid}


class BaseView(object):
    def __init__(self, request):
        self.request = request
        self.response = {}


class HTMLView(BaseView):
    def __init__(self, request):
        super(HTMLView, self).__init__(request)
        self.session = request.session

        self.response['login'] = self.session.get('login')


class APIView(BaseView):
    def __init__(self, request):
        super(APIView, self).__init__(request)
        self.session = request.session




#@view_defaults(check_csrf=True)
class GameView(HTMLView):
    def __init__(self, request):
        super(GameView, self).__init__(request)

        self.params = request.params
        self.game_id = request.matchdict['id']
        conf = Configuration()
        self.game = conf.running_games.get(self.game_id)
        if not self.game:
            raise HTTPBadRequest("Game name not exists")

        self.response['game'] = self.game




    @view_config(route_name='game_view', renderer='templates/game.mako')
    def game_view(self):
        log.debug('Game view: ' + self.game_id)
        self.response['id'] = self.game_id
        return self.response

    @view_config(route_name='game_api', renderer='json')
    def game_api(self):
        return self.game

    @view_config(route_name='move_api', renderer='json')
    def move_api(self):
        log.debug("Move API: " + str(self.params))
        field = self.params.get('field')
        direction = self.params.get('direction')
        stone = self.params.get('stone', 0)
        log.debug(stone)
        try:
            self.game.move(stone, field, direction)
            if not self.game.open_takings:
                self.game.change_player()
            return {'error': False, 'game': self.game}
        except Exception as e:
            return {'error': True, 'error': str(e), 'game': self.game}


    @view_config(route_name='take_api', renderer='json')
    def take_api(self):
        log.debug("Take API: " + str(self.params))
        row = int(self.params.get('row_id', None))
        selected_taking = self.game.open_takings[row]
        log.debug(selected_taking)
        for stone_id in selected_taking['stones']:
            stone = self.game.board.stones[stone_id]
            stone.field.stone = None
            if stone.color == 'white':
                stone.field = self.game.board.reserve_white
            else:
                stone.field = self.game.board.out
        self.game.open_takings = []
        return {'error': False, 'game': self.game}




class GameListView(HTMLView):
    def __init__(self, request):
        super(GameListView, self).__init__(request)
        self.conf = Configuration()
        self.open_games = self.conf.open_games
        self.running_games = self.conf.running_games
        self.finished_games = self.conf.finished_games
        self.params = request.params


    @view_config(route_name='gamelist_view', renderer='templates/game_list.mako')
    def gamelist_view(self):
        self.response['open_games'] = self.open_games
        self.response['running_games'] = self.running_games
        self.response['finished_games'] = self.finished_games
        return self.response

    @view_config(route_name='game_new')
    def game_new(self):
        user = self.session.get("login")
        if not user:
            raise HTTPFound("login")

        name = self.request.params.get('name',None)
        color = self.request.params.get('color', None)
        if (name in (self.running_games.keys() + self.open_games.keys() + self.finished_games.keys())):
            raise HTTPBadRequest("Game name already exists")

        if color=="White":
            player_white = user
            player_black = None
        else:
            player_white = None
            player_black = user
        self.open_games[name] = Game(player_white, player_black)
        return HTTPFound("game")


    @view_config(route_name='game_join')
    def game_join(self):
        user = self.session.get("login")
        if not user:
            raise HTTPFound("login")

        game_id = self.request.matchdict['id']
        if (game_id not in self.open_games.keys()):
            raise HTTPBadRequest("Game name not exists")
        game = self.open_games.pop(game_id)
        self.running_games[game_id] = game

        if game.player_white:
            game.player_black = user
        else:
            game.player_white = user
        return HTTPFound("/game")






@view_config(route_name='login', renderer='templates/login.mako')
@forbidden_view_config(renderer='templates/login.mako')
def login_view(request):
    login_url = request.route_url('login')
    referrer = request.url
    if referrer == login_url:
        referrer = '/' # never use the login form itself as came_from
    came_from = request.params.get('came_from', referrer)
    message = ''
    login = ''
    password = ''
    if 'form.submitted' in request.params:
        login = request.params['login']
        request.session['login'] = login
        password = request.params['password']
        if USERS.get(login) == password:
            headers = remember(request, login)
            return HTTPFound(location = came_from,
                             headers = headers)
        message = 'Failed login'

    return dict(
        message = message,
        url = request.application_url + '/login',
        came_from = came_from,
        login = login,
        password = password,
        )


@view_config(route_name='logout', renderer="templates/logout.mako")
def logout_view(request):
    headers = forget(request)
    loc = request.route_url('home')
    return HTTPFound(location=loc, headers=headers)