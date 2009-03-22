import logging
from utils import webapp, simplejson
from google.appengine.ext import db
from .model.quiz import QuizItem, ItemScore
from .model.user import QuizTaker, InviteList
from .model.employer import Employer
from .utils.utils import tpl_path, ROOT_PATH, raise_error


class RPCHandler(webapp.RequestHandler):
  # AJAX Handler
  def __init__(self):
    webapp.RequestHandler.__init__(self)
    self.methods = RPCMethods()

 
  def get(self):
    func = None
   
    action = self.request.get('action')
    if action:
      if action[0] == '_':
        self.error(403) # access denied
        return
      else:
        func = getattr(self.methods, action, None)
   
    if not func:
      self.error(404) # file not found
      return
     
    args = ()
    while True:
      key = 'arg%d' % len(args)
      val = self.request.get(key)
      if val:
        args += (simplejson.loads(val),)
      else:
        break
    result = func(*args)
    self.response.out.write(simplejson.dumps(result))
    




class RPCMethods(webapp.RequestHandler):
  """ Defines AJAX methods.
  NOTE: Do not allow remote callers access to private/protected "_*" methods.
  """

  def post(self):
  	if self.request.get('action') == "GetBillUpdates": return self.response.out.write( self.GetBillUpdates() )	
  	




  def GetBillUpdates(self):     
		email_address = self.request.get('email')
		from model.quiz_the_bill import EmailUpdate
		new_signup = EmailUpdate( email_address = email_address)
		db.put(new_signup)
		from quiz_the_bill.methods import confirm_email
		confirm_email(new_signup.email_address)
		return "OK"
		
		
