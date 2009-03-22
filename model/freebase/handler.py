import model

from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
import simplejson

# Relevency Tally for Semantic Tags
from collections import defaultdict
import operator 


from .utils.utils import tpl_path
from .lib.BeautifulSoup import BeautifulSoup, BeautifulStoneSoup, SoupStrainer  # HTML Parsing Library
from .lib import rdfxml
import sys
sys.setdefaultencoding('utf-8')


# class for semantic analysis - semanticproxy, class for parsing. 
SEMANTICPROXY_URL = "http://service.semanticproxy.com/processurl/aq9r8pmcbztd4s7s427uw7zg/rdf/" # USE RDF ENDPOINT
SEMANTICPROXY_MICRO_URL = "http://service.semanticproxy.com/processurl/aq9r8pmcbztd4s7s427uw7zg/microformat/" 
TILDE_BASE_URL = "http://tilde.jamslevy.user.dev.freebaseapps.com/"
TILDE_TYPE_LIMIT = 10 # Maximum number of types to query per request topic.
TILDE_TOPIC_LIMIT = 4 # Maximum number of topics per type to list in response. 
TILDE_EXCLUDE = 'music,film' # should be array
TRUNCATE_URL = "http://pqstage.appspot.com/truncate_page/?url=" 

DEFAULT_PAGES = [#"http://en.wikipedia.org/wiki/Inference", 
                 "http://en.wikipedia.org/wiki/Renewable_energy",
                 ]

AC_LIMIT = 31 # Limit of answer choice candidates per quiz item
AC_MIN = 8 # Minimum of answer choices required.

RAW_ITEMS_PER_PAGE = 5 # Limit of quiz items created per page 

RAW_ITEMS_PER_TAG = 2 # Limit of quiz items created per page

QUIZBUILDER_LIMIT = 1

QUIZBUILDER_PATH = 'quizbuilder/'




def get_similar_topics(self, tag):
# Freebase request to get similar topics for a tag.
tag = tag.replace(' ','%20') #urlencode tag
tilde_request = str(TILDE_BASE_URL) + "?format=xml&topic_limit=" + str(TILDE_TOPIC_LIMIT) + "&type_limit=" + str(TILDE_TYPE_LIMIT) + "&exclude=" + str(TILDE_EXCLUDE) + "&request=" + str(tag)
try:
	tilde_response = urlfetch.fetch(tilde_request)
except:
	logging.debug('Unable to fetch tilde response') 
tilde_soup = BeautifulStoneSoup(tilde_response.content)
similar_topics = [str(topic.contents[0]) for topic in tilde_soup.findAll('title')]
if len(similar_topics) >= AC_MIN:
	return similar_topics[1:AC_LIMIT]
else:
	return False 
	
	
	
              
  
def getTopic(id): # get topic by id 
	this_topic = FreebaseTopic.gql("WHERE id = :1", id)
	this_topic.get() # get topic
	for type in this_topic.types:
		domain = type.domain








For every topic:

For every type for topic:
		
TOPIC TYPE
TOPIC DOMAIN
TYPE DOMAIN


Frog Organism_Classification 
Biology Organism_Classification 

		
