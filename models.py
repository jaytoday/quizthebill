from google.appengine.ext import db



"""


Models are defined in this module. 

Bill and EmailUpdate are both specific to this app, and 
Proficiency and ProficiencyTopic are required for the PlopQuiz
client application.


"""


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

class EmailUpdate(db.Model): 
  email_address = db.EmailProperty(required=True)


"""

Subjects and Subject Topics

Creating your own subject is as easy as creating an entity...

p = Proficiency(name = "new subject")
db.put(p)


Or you can use the admin interface at /console/dashboard

"""

class Proficiency(db.Model):
  name = db.StringProperty(required=True)  # max_length is 17
  date = db.DateTimeProperty(auto_now_add=True)
  modified = db.DateTimeProperty(auto_now=True)
  status = db.StringProperty(required=False)
  blurb = db.TextProperty(required=False)
  video_html = db.TextProperty()
  popularity = db.IntegerProperty()
  difficulty = db.IntegerProperty() 

  def tag(self): # for views
  	tag = self.name.replace(' ', '_')
  	tag = tag.replace('.', '_')
  	return tag


      
class ProficiencyTopic(db.Model):  # sub-topics within proficiencies - These map to content URLs.
  name = db.StringProperty(required=True)  # max_length is 25
  proficiency = db.ReferenceProperty(Proficiency, collection_name='topics') # Proficiency Tag (startup_financing)
  date = db.DateTimeProperty(auto_now=True)    
  
  
