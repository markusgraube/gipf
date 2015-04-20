__author__ = 'mgraube'

USERS = {'markus':'markus',
          'stephan':'stephan'}
GROUPS = {'markus':['group:admin']}

def groupfinder(userid, request):
    if userid in USERS:
        return GROUPS.get(userid, [])