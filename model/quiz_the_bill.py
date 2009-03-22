from google.appengine.ext import db

class Bill(db.Model): 
    id = db.StringProperty(required=True)
    title = db.StringProperty(required=True)
    rank = db.IntegerProperty(required=False)
    govtrack_id = db.StringProperty(required=False)
    introduction_date = db.StringProperty(required=False)
    status = db.StringProperty(required=False)    
    next_step = db.StringProperty(required=False)   
    latest_action = db.StringProperty(required=False)   
    sponsor = db.StringProperty(required=False)   
    sponsor_name = db.StringProperty(required=False)   
    #API data? sponsors, etc. 


class EmailUpdate(db.Model): 
  email_address = db.EmailProperty(required=True)
