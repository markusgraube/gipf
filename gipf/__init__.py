from pyramid.config import Configurator
from pyramid.session import SignedCookieSessionFactory


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    my_session_factory = SignedCookieSessionFactory('itsaseekreet')

    config = Configurator(settings=settings, session_factory=my_session_factory)
    config.include('pyramid_chameleon')
    config.add_static_view('static', 'static', cache_max_age=3600)

    config.add_route('home', '/')

    config.add_route('move_api', 'api/game/{id}/move')
    config.add_route('game_api', 'api/game/{id}')

    config.add_route('game_view', 'game/{id}')
    config.add_route('gamelist_view', 'game')

    config.add_route('login', 'login')
    config.add_route('logout', 'logout')

    config.scan()
    return config.make_wsgi_app()
