
from google.appengine.ext import db


class Setting(db.Model): # used for a variety of configurable PQ settings
  name = db.StringProperty(required=True)
  value = db.FloatProperty(required=False)
  status = db.StringProperty(default="default")
  modified = db.DateTimeProperty(auto_now=True)

  


class Admin(db.Model):
  user = db.UserProperty(required=True) 
  date = db.DateTimeProperty(auto_now_add=True)

  

