from google.appengine.ext.webapp.util import run_wsgi_app
from utils.webapp.wsgi import WSGIApplication
from utils.routes.mapper import Mapper
map = Mapper(explicit = True)
from urls import url_routes

# Initiating the WSGI Application
# urls.py contains url mappings

def RequestHandler():
    url_routes(map)
    app = WSGIApplication(map, debug = True) 
    run_wsgi_app(app)
                                

if __name__ == "__main__":
  RequestHandler()







