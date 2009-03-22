from google.appengine.ext import db
from model.proficiency import Proficiency, ProficiencyTopic
from model.user import QuizTaker, Profile
from model.employer import Employer




    


class ContentPage(db.Model): # Deprecated
    url = db.LinkProperty()    # Where quiz material is from - wikipedia.org/en/neuroscience/
    date = db.DateTimeProperty(auto_now_add=True)
    proficiency = db.ReferenceProperty(Proficiency,
                                    collection_name='pages') # Proficiency Tag (startup_financing) 
                                    
    # for more than one topic, use list of keys. 
    # raw_items



class RawQuizItem(db.Model):
    page = db.ReferenceProperty(ContentPage,
                                    collection_name='raw_items') # Proficiency Tag (startup_financing)
    answer_candidates = db.StringListProperty() # List of Answers
    index = db.StringProperty() # Correct Answer
    pre_content = db.TextProperty() 
    content = db.TextProperty() 
    post_content = db.TextProperty() 
    moderated = db.BooleanProperty()
    date = db.DateTimeProperty(auto_now_add=True)
    
    




class QuizItem(db.Model):
  
  #slug = db.StringListProperty()  #Unique name ["wiki", "bayesian"] - [0] is source and [1] item is url path, like /science/cs/algorithm 
  #category = db.StringProperty()
  content = db.TextProperty()  # Content of Quiz Item
  index = db.StringProperty() # Correct Answer 
  answers = db.StringListProperty() # List of Answers
  proficiency = db.ReferenceProperty(Proficiency, collection_name='quizitems', required=False) # Proficiency Tag (startup_financing)
  pending_proficiency = db.ReferenceProperty(Proficiency, collection_name='pending_items', required=False) # for pending items
  author = db.ReferenceProperty(Profile, collection_name='authored_items', required=False)  
  active = db.BooleanProperty(required=False, default=False)  # should there be seperate "approved" property?
  topic = db.ReferenceProperty(ProficiencyTopic, required=False, collection_name='quizitems') # Proficiency Tag (startup_financing)                                  
  difficulty = db.IntegerProperty(default=0)  # 0-10000
  content_url = db.LinkProperty(required=False)    # Where quiz material is from - wikipedia.org/en/neuroscience/
  theme = db.StringProperty(required=False, default="default")
  date = db.DateTimeProperty(auto_now_add=True)
  modified = db.DateTimeProperty(auto_now=True)


  def get_theme(self, url):
		#todo: fill this up 
		# eventually, store this in external json. 
		themes= [("wikipedia.org", "wiki"), ("knol.google.com", "knol"), ("recovery.gov", "recovery"), ("knol.google.com", "knol"), ("change.gov", "whitehouse")]
		for theme in themes:
			if theme[0] in url: return theme[1]
			else: return "default"

  def uid(self):
		return str(self.key())[-5:]
			
  """      
  @property
  def get_takers(self):   # Get all QuizTakers who have taken items
        this_items_scores = ItemScore.gql("WHERE quiz_item = :1", self.slug).get() 
        this_items_takers = [score.quiz_taker for score in this_items_scores]
        return this_items_takers



  def put(self): 
  self.proficiency_name = self.proficiency.name #Call put() on the super class. return db.SearchableModel.put(self)
  
  """ 

    
class ItemScore(db.Model):
  # Saved Scores for Quiz 
  quiz_taker = db.ReferenceProperty(QuizTaker,
                                     required=False,
                                    collection_name='itemscores')
  picked_answer = db.StringProperty() 
  correct_answer = db.StringProperty()                                 
  score = db.IntegerProperty()
  date = db.DateTimeProperty(auto_now_add=True)
  quiz_item = db.ReferenceProperty(QuizItem,
                                    required=True,
                                    collection_name='scores') # item slug - ["wiki", "bayesian"]
                                    
  vendor = db.ReferenceProperty(Employer,
                                required=False,
                                collection_name='scores') # item slug - ["wiki", "bayesian"]
  type = db.StringProperty(required=False) # demo, stub, etc.

  
  def get_key(self, prop_name):
       getattr(self.__class__, prop_name).get_value_for_datastore(self)

  def topic_level(self):
       query = TopicLevel.gql("WHERE topic = :1 AND quiz_taker = :2", self.quiz_item.topic, self.quiz_taker)
       if not query.get(): print self.__dict__
       return query.get()
       


class QuizTakerFilter(db.Model):
  quiz_taker = db.ReferenceProperty(QuizTaker,
                                    collection_name='filter')  # One Quiz Taker Can Have Many Filters
  mean = db.IntegerProperty(default=0)
  variance = db.IntegerProperty(default=0)
  manhattan = db.IntegerProperty(default=0)
  nudges_count = db.IntegerProperty(default=0)
  trained = db.BooleanProperty(default=False)   # Either this can be integer for re-use, or new filter can be made if its True. 
  date = db.DateTimeProperty(auto_now_add=True)


class QuizItemFilter(db.Model):
  quiz_item = db.ReferenceProperty(QuizItem,
                                    collection_name='filter')  
  mean = db.IntegerProperty(default=0)
  variance = db.IntegerProperty(default=0)
  manhattan = db.IntegerProperty(default=0)
  nudges_count = db.IntegerProperty(default=0)
  trained = db.BooleanProperty(default=False)    # Either this can be integer for re-use, or new filter can be made if its True. 
  date = db.DateTimeProperty(auto_now_add=True)


class ItemScoreFilter(db.Model):
  score = db.ReferenceProperty(ItemScore,
                                    collection_name='filter')  
  trained = db.BooleanProperty(default=False)
  residual = db.IntegerProperty(default=0)  
