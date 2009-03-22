def url_routes(map):


	#Public Views
	map.connect('', controller = 'quiz_the_bill.views:FrontPage')
	map.connect('bill/:bill_title', controller = 'quiz_the_bill.views:RenderBillFrame')
								
	#XML-RPC
	map.connect('/rpc/post', controller = 'quiz_the_bill.rpc:RPCMethods')

	#Private
	map.connect('/update_stats', controller = 'quiz_the_bill.views:UpdateStats')
																																				 
	#Utils
	map.connect('headers', controller = 'resources:RequestHandler')	
	map.connect('image/*img', controller = 'profiles.views:Image')
	map.connect('Redirect', 'redirect/*path', controller = 'accounts.views:Redirect')	
	map.connect('error/:error_type', controller = 'dev.views:Error')  
	map.connect('404 error', '*url/:not_found', controller = 'utils.utils:NotFoundPageHandler')
	map.connect('404 error', '*url', controller = 'utils.utils:NotFoundPageHandler')
	   
    
