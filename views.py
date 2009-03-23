import logging
import wsgiref.handlers
import datetime, time
from utils.webapp import template
from google.appengine.ext import db
from utils import webapp
from utils.utils import tpl_path
from models import Bill

# Settings
BILL_LIMIT = 9
TEMPLATE_PATH = 'quiz_the_bill/'
APP_NAME = "QuiztheBill"
GOVTRACK_URL = "http://www.govtrack.us/congress/billtext.xpd?"


class FrontPage(webapp.RequestHandler):

  def get(self):    
	"""

	The splashpage for QuiztheBill, containing an introduction
	and a list of bills.

	"""  
	template_values = { 'bills': self.get_bills(),
						# subject for quiz widget
						'featured_subject': "QuiztheBill" }
					   
	path = tpl_path(TEMPLATE_PATH + 'frontpage.html')
	self.response.out.write(template.render(path, template_values))
	return
    
  def get_bills(self):
      top_ten_bills = Bill.all().order('rank').fetch(BILL_LIMIT)
      return top_ten_bills 
      
    
    
    
class RenderBillFrame(webapp.RequestHandler):

  def get(self):    
	"""
	
	Renders an frame with a webpage used to create quizzes. For this app,
	the frame contains the text of pending Congressional legislation.
	
	"""
	import urllib 
	bill_name = urllib.unquote( self.request.path.split('/bill/')[1] )
	self.this_bill = Bill.get_by_key_name(bill_name)
	if self.this_bill is None:
	  logging.error('bill %s not found', bill_name) 
	  return self.redirect('/bill_not_found')
	  	  
	from models import ProficiencyTopic
	template_values = {'url': self.get_bill_url(), 'subject_key': APP_NAME,
	                   'topic_name': self.this_bill.title, }
	path = tpl_path(TEMPLATE_PATH + 'iframe.html')
	self.response.out.write(template.render(path, template_values))
	return

           
  def get_bill_url(self):	
	# Send Request to Service and Open Response for Parsing
	import urllib
	self.request_args = {'bill':  self.this_bill.govtrack_id}
	self.formatted_args = urllib.urlencode(self.request_args)
	return GOVTRACK_URL + self.formatted_args
	


