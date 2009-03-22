from google.appengine.ext import db
from google.appengine.api import users


class FreebaseTopic(db.Model):
  name = db.StringProperty()
  id = db.StringProperty()
  types = db.ReferenceProperty(FreebaseType,
                                collection_name='topics') 
  date = db.DateTimeProperty(auto_now_add=True)
  

class FreebaseType(db.Model):
  name = db.StringProperty()
  id = db.StringProperty()  
  domain = db.ReferenceProperty(FreebaseDomain,
                                collection_name='types') 
  date = db.DateTimeProperty(auto_now_add=True)
  #topics  -- FreebaseTopic list
  
  
class FreebaseDomain(db.Model):
  name = db.StringProperty()
  id = db.StringProperty()
  date= db.DateTimeProperty(auto_now_add=True)
  #types  -- FreebaseType list 
