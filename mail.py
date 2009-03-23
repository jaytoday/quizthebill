import logging
from google.appengine.api import mail

# Todo: still need update e-mail, hooked in through create_bill. 

def confirm_email(email_address):
	if not mail.is_email_valid(email_address):
		logging.warning("%s is not a valid email", email_address)
		return False
	message = mail.EmailMessage()
	message.sender = get_sender()
	message.subject = "Congressional Legislation Updates" 
	message.to = email_address
	message.body = """


	You've signed up to receive #QuizTheBill updates about new bills as they are made available. 
	
	As soon as a new bill is arrives, we'll e-mail you with details and a link to the text of the bill, where you can contribute quiz items.
	
	At any time, you can always unsubscribe just by sending an e-mail to this address with the subject "Unsubscribe".
	
	
	
	By volunteering, you're helping provide Congress and the rest of us with a resource to understand important legislation before it is too late.
		
	We appreciate your assistance. This project is young, and we hope to quickly improve our service. 
	
	Please let us know if you have any particular suggestions or problems while using the site. 	

	
	
	Warm Regards,

	James 
	Team PlopQuiz	
	
	
	
	
	%s
	

	

	
	""" % (mail_footer())


	
	message.send()



def update_email(new_bill, email_address):
	if not mail.is_email_valid(email_address):
		logging.warning("%s is not a valid email", email_address)
		return False
	message = mail.EmailMessage()
	message.sender = get_sender()
	message.subject = "A New Bill Is Available: " + new_bill.title 
	message.to = email_address
	message.body = """


	A new bill is now available on the #QuizTheBill Site!
	
	Here's the details:
	
	Bill Title: %s
	
	Bill Sponsor: %s
	
	Introduction Date: %s

	
	
	
	By volunteering, you're helping provide Congress and the rest of us with a resource to understand important legislation before it is too late.
	
	Please let us know if you have any particular suggestions or problems while using the site. 	

	
	
	Warm Regards,

	James 
	Team PlopQuiz	
	
	
	
	
	%s
	

	

	
	""" % (new_bill.title, new_bill.sponsor, new_bill.introduction_date, mail_footer())


	
	message.send()



def mail_footer():
	footer = """
	-----------------------------------------------------------------------------
	
	Visit PlopQuiz at http://www.plopquiz.com
	
    e-mail PlopQuiz: contact@plopquiz.com
	call PlopQuiz: (650) 353-2694
	
	
	"""
	
	return footer 



# Replace this with your own e-mail address
# You need to get the address verified through Google

def get_sender(): # 
	return "plopquiz@plopquiz.com"
