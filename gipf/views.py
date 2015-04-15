from pyramid.httpexceptions import HTTPFound
from pyramid.security import remember
from pyramid.view import view_config, view_defaults, notfound_view_config

from .models import Game, Configuration

import logging

log = logging.getLogger(__name__)


@notfound_view_config(renderer='templates/notfound.mako')
def notfound(request):
    return {'request': request}


@view_config(route_name='home', renderer='templates/home.mako')
def home_view(request):
    return {'project': 'gipf'}


@view_defaults(route_name='game_view')
class GameView:
    def __init__(self, request):
        self.request = request
        self.id = self.request.matchdict['id']
        conf = Configuration()
        self.game = conf.game_list[self.id]


    @view_config(route_name='game_view', renderer='templates/game.mako')
    def game_view(self):
        log.debug('Game view: ' + self.id)
        return {'id': self.id, 'game': self.game}

    @view_config(route_name='game_api', renderer='json')
    def game_api(self):
        return self.game.board.toJSON()

    @view_config(route_name='move_api', renderer='json')
    def move_api(self):
        log.debug("Move API")
        log.debug(self.request.POST)
        field = self.request.POST['field']
        direction = self.request.POST['direction']
        stone = int(self.request.POST['stone'])
        b = self.game.board
        try:
            b.move(b.stones[stone], b.fields[field], direction)
            rows = b.check4StonesinRow()
            if rows:
                return {'result': 'openTaking', 'rows': rows}
            else:
                return {'result': True}
        except Exception as e:
            return {'result': 'error', 'error': str(e)}


@view_defaults(route_name='gamelist_view')
class GameListView:
    def __init__(self, request):
        self.request = request
        self.conf = Configuration()

    @view_config(route_name='gamelist_view', renderer='templates/game_list.mako')
    def gamelist_view(self):
        return {'games': self.conf.game_list}


@view_config(route_name='login')
def login_view(request):
    next = request.params.get('next') or request.route_url('home')
    login = ''
    did_fail = False
    if 'submit' in request.POST:
        login = request.POST.get('login', '')
        passwd = request.POST.get('passwd', '')

        user = USERS.get(login, None)
        if user and user.check_password(passwd):
            headers = remember(request, login)
            return HTTPFound(location=next, headers=headers)
        did_fail = True

    return {
        'login': login,
        'next': next,
        'failed_attempt': did_fail,
        'users': USERS,
    }


@view_config(route_name='logout')
def logout_view(request):
    headers = forget(request)
    loc = request.route_url('home')
    return HTTPFound(location=loc, headers=headers)