import logging
from utils import webapp, simplejson
from google.appengine.ext import db


class RPCMethods(webapp.RequestHandler):
  """ Defines AJAX methods.
  NOTE: Does not allow remote callers access to private/protected "_*" methods.
  """

  def post(self):
  	if self.request.get('action') == "GetBillUpdates": return self.response.out.write( self.GetBillUpdates() )	
  	


  def GetBillUpdates(self):     
		"""
		A new sign up for bill updates via email
		"""
		email_address = self.request.get('email')
		from models import EmailUpdate
		new_signup = EmailUpdate( email_address = email_address)
		db.put(new_signup)
		from mail import confirm_email
		confirm_email(new_signup.email_address)
		return "OK"
