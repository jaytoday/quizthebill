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
SUNLIGHT_BASE_URL = "http://services.sunlightlabs.com/api/"
OPENCONGRESS_INFO_URL = "http://www.opencongress.org/tools/bill_status_panel?" 
GOVTRACK_URL = "http://www.govtrack.us/congress/billtext.xpd?"
OPENCONGRESS_BR_URL = "http://www.opencongress.org/battle_royale.xml?" 
OPENCONGRESS_BR_URL = "http://www.opencongress.org/battle_royale.xml?" 
APP_NAME = "QuiztheBill"
API_KEY = "" 

"""

Note: To hit the Sunlight Labs APIs, you will need to provide your account key.

You can register at http://services.sunlightlabs.com/api/register/

"""


class UpdateStats(webapp.RequestHandler):

  def get(self): 
     
	"""

	This method retrieves Congressional data. It is not necessary for 
	an unrelated client app for authoring quizzes.

	"""
	from models import Proficiency
	self.this_app = Proficiency.get_by_key_name(APP_NAME)
	if self.this_app is None: # First initialization
	    self.this_app = Proficiency(name = APP_NAME)
	    db.put(self.this_app)
	self.save = []
	bills = self.get_top_bills()
	for bill in bills: self.update_bill(bill)
	db.put(self.save) # save new bills to datastore in one trip
	return
    
    
  def get_top_bills(self):	
	# Parse updated XML list of ranked bills From OpenCongress Service
	import urllib
	self.request_args = {'order':  'desc',
	                     'page' :    1,
	                     'sort' :  'vote_count_1',
	                     'timeframe' : '1day' }
	self.formatted_args = urllib.urlencode(self.request_args)
	from google.appengine.api import urlfetch
	fetch_page = urlfetch.fetch(  url = OPENCONGRESS_BR_URL + self.formatted_args,
								method = urlfetch.GET) 
	from utils.BeautifulSoup import BeautifulStoneSoup	
	document = BeautifulStoneSoup(fetch_page.content)
	bills = []
	ids = [i.contents[0] for i in document.findAll('ident')]
	titles = [t.contents[0] for t in document.findAll('title-full-common')]
	current_rank = 1
	for i,t in zip(ids, titles)[:BILL_LIMIT + 1]:

	    this_title = " ".join(str(t).decode('utf-8').split(' ')[1:]).split('Act')[0] + "Act"
	    if len(this_title) > 35 : this_title = " ".join( this_title.split(' ')[:3] ) + "..."
	    if this_title in [bill['title'] for bill in bills]: 	        	       
	        logging.warning('duplicate bill found with title %s and id %s' %(t, i))
	        continue # this bill has already been processed once
	    bills.append({'id': str(i), 
	                  'title': this_title,
	                  'rank' : current_rank })
	    current_rank += 1
	return bills


  def update_bill(self, bill):
	# Check if a bill exists in datastore, and update its stats.
	this_bill = Bill.get_by_key_name(bill['title']) 
	logging.info(bill['title']) 
	if this_bill is None: 
		this_bill = self.create_bill(bill)
		is_new_bill = True
	else: is_new_bill = False
	this_bill.rank = bill['rank']
	import urllib
	self.request_args = {'bill_id':  bill['id']}
	self.formatted_args = urllib.urlencode(self.request_args)
	from google.appengine.api import urlfetch
	fetch_page = urlfetch.fetch( url = OPENCONGRESS_INFO_URL + self.formatted_args,
								method = urlfetch.GET) 
	from utils.BeautifulSoup import BeautifulSoup	
	document = BeautifulSoup(fetch_page.content)
	property_count = 0	 
	this_bill.introduction_date = str(document.findAll('li')[property_count]).split('</strong> ')[1].split('</li>')[0]
	this_bill.status = str(document.findAll('li')[property_count + 1]).split('</strong> ')[1].split('</li>')[0]
	if this_bill.status == "This Bill Has Become Law":  property_count = -1 # no next step
	else: this_bill.next_step = str(document.findAll('li')[property_count + 2]).split('</strong> ')[1].split('</li>')[0]
	this_bill.latest_action = str(document.findAll('li')[property_count + 3]).split('</strong> ')[1].split('</li>')[0]
	if len( this_bill.latest_action ) > 68: this_bill.latest_action = " ".join(this_bill.latest_action.split(' ')[:9]) + "..."
	this_bill.sponsor = str(document.findAll('li')[property_count + 4]).split('</strong> ')[1].split('</li>')[0].decode('utf-8')
	this_bill.sponsor_name = this_bill.sponsor.split("[")[0] 
	self.save.append(this_bill)
	if is_new_bill: self.send_email_updates(this_bill)
	return


  def create_bill(self, bill):
    # Save a new bill to the datastore
    if "-s" in bill['id']: bill['govtrack_id'] = "s" + bill['id'].replace("-s", "-") 
    elif "-h" in bill['id']: bill['govtrack_id'] = "h" + bill['id'].replace("-h", "-")  
    else: bill['govtrack_id'] = bill['id']
    new_bill = Bill(key_name = bill['title'],
                    id = bill['id'],
                    govtrack_id = bill['govtrack_id'],
                    title = bill['title'])

    from models import ProficiencyTopic
    new_topic = ProficiencyTopic(name = bill['title'], proficiency = self.this_app)
    self.save.append(new_topic)
    print "created new bill"
    logging.info('saved new bill with title %s,id %s, and rank %s' % (bill['title'], bill['id'], str(bill['rank'])))
    return new_bill              
                    

  def send_email_updates(self, bill):
      from mail import update_email
      from models import EmailUpdate
      subscribers = EmailUpdate.all().fetch(1000)
      logging.info('sending update email for bill %s to %i users' %( bill.title, len(subscribers) ) )
      for user in subscribers: update_email(bill, user.email_address)
