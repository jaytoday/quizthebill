from google.appengine.ext import db
from google.appengine.api import users
import logging
from proficiency import Proficiency




class Employer(db.Model): #n'est sponsor
    unique_identifier = db.StringProperty(required=True)
    email = db.EmailProperty(required=False)
    name = db.StringProperty()
    quiz_subjects = db.StringListProperty() # use for key_name lookups
    sponsorship_message = db.TextProperty(required=False)
    modified = db.DateTimeProperty(auto_now=True)    
    def default_message(self): 
      return """The %s team congratulates you on your achievement!""" % self.name 



class AutoPledge(db.Model):
    employer = db.ReferenceProperty(Employer,
                                    required=True, collection_name='auto_pledges')
    count = db.IntegerProperty(required=True) #  number of autopledges yet.                                   
    proficiency = db.ReferenceProperty(Proficiency,
                                    required=True, collection_name='auto_pledges')
                                    
                                   #TODO: package?
                                    
    # Put BP down 5000 for Automotive Industry. Then give out pledges as people take tests.                             






class Sponsor_Application(db.Model):
    email = db.EmailProperty(required=True)
    name = db.StringProperty(True)
    modified = db.DateTimeProperty(auto_now=True)    
