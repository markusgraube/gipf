from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy
from pyramid.config import Configurator
from pyramid.session import SignedCookieSessionFactory
from gipf.security import groupfinder


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    my_session_factory = SignedCookieSessionFactory('itsreallyaseekreet')
    authn_policy = AuthTktAuthenticationPolicy(
        'sosecret', callback=groupfinder, hashalg='sha512')
    authz_policy = ACLAuthorizationPolicy()

    config = Configurator(settings=settings)
    config.set_session_factory(my_session_factory)
    config.set_authentication_policy(authn_policy)
    config.set_authorization_policy(authz_policy)

    config.include('pyramid_chameleon')


    config.add_static_view('static', 'static', cache_max_age=3600)

    config.add_route('home', '/')

    config.add_route('move_api', 'api/game/{id}/move')
    config.add_route('take_api', 'api/game/{id}/take')
    config.add_route('game_api', 'api/game/{id}')

    config.add_route('game_join', 'game/{id}/join')
    config.add_route('game_view', 'game/{id}')
    config.add_route('gamelist_view', 'game')
    config.add_route('game_new', 'newGame')

    config.add_route('login', 'login')
    config.add_route('logout', 'logout')

    config.scan()
    return config.make_wsgi_app()
