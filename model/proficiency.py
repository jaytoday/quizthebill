
from google.appengine.ext import db

"""

# Get or Insert when unique key_name isn't possible. 

from google.appengine.ext import db

class SuperModel(db.Model):
  @classmethod
  def get_or_insert_by(cls, parent=None, **kwds):
    query = db.Query(cls)
    if parent is not None:
      query.ancestor(parent)
    for kw in kwds:
      query.filter("%s =" % kw, kwds[kw])
    entity = query.get()
    if entity is not None:
      return entity
    entity = cls(parent, **kwds)
    return entity

class Movie(SuperModel):
  name = db.StringProperty()
  year = db.IntegerProperty()

movie = Movie.get_or_insert_by(name="Magnolia", year=1999)
if not movie.is_saved():
  movie.put()




"""

class Proficiency(db.Model):
  name = db.StringProperty(required=True)  # max_length is 17
  date = db.DateTimeProperty(auto_now_add=True)
  modified = db.DateTimeProperty(auto_now=True)
  status = db.StringProperty(required=False)
  blurb = db.TextProperty(required=False)
  # study guide material
  #links = db.ListProperty(db.Link)
  video_html = db.TextProperty()
  # statistics
  popularity = db.IntegerProperty()
  difficulty = db.IntegerProperty() 
  #quizitems -- QuizItem reference
  #pendingitems - pending QuizItem reference (not yet active)
  
  def tag(self): # for views
  	tag = self.name.replace(' ', '_')
  	tag = tag.replace('.', '_')
  	return tag
  	
  #images - RefProperty
  
  ## pages  
  
  def new_image(self, image): # for views=
	from google.appengine.api import images
	small_image = images.resize(image, 120, 80)
	large_image = images.resize(image, 360, 240)
	
	new_image = SubjectImage(
	                         small_image = small_image,
	                         large_image = large_image,
	                         proficiency = self
						     )
	return new_image # requires put() to save!
						     
						     
  def default_image(self): 
      return DefaultSubjectImage.get()

  def quiz_item_count(self):
  	from model.quiz import QuizItem
  	return len(self.quizitems.fetch(1000))

  def pending_item_count(self): 
  	from model.quiz import QuizItem
  	return len(self.pending_items.fetch(1000))
  	
      
class ProficiencyTopic(db.Model):  # sub-topics within proficiencies - These map to content URLs.
  name = db.StringProperty(required=True)  # max_length is 15
  proficiency = db.ReferenceProperty(Proficiency, collection_name='topics') # Proficiency Tag (startup_financing)
  date = db.DateTimeProperty(auto_now=True)    
  #freebase_guid ?
  



class  Link(db.Model):
    url = db.LinkProperty(required=True)    # Links added and URLS where quiz material is from - wikipedia.org/en/neuroscience/
    title = db.StringProperty(required=True)
    date = db.DateTimeProperty(auto_now_add=True)
    subject = db.ReferenceProperty(Proficiency, collection_name='links') # Proficiency Tag (startup_financing) # SHOULD THIS BE A STRING? 
                                    


  

class SubjectImage(db.Model):
    proficiency = db.ReferenceProperty(Proficiency, collection_name='images', required=True) # Proficiency Tag (startup_financing)    
    small_image = db.BlobProperty(required=True)
    large_image = db.BlobProperty(required=True)


  	

class DefaultSubjectImage(db.Model):
    small_image = db.BlobProperty(required=True)
    large_image = db.BlobProperty(required=True)








