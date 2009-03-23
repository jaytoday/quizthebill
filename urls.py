def url_routes(map):


	#Public Views
	map.connect('', controller = 'views:FrontPage')
	map.connect('bill/:bill_title', controller = 'views:RenderBillFrame')
								
	#XML-RPC
	map.connect('/rpc/post', controller = 'rpc:RPCMethods')

	#Private
	map.connect('/update_stats', controller = 'methods:UpdateStats')
																																				 
	#Utils
	map.connect('404 error', '*url/:not_found', controller = 'utils.utils:NotFoundPageHandler')
	map.connect('404 error', '*url', controller = 'utils.utils:NotFoundPageHandler')
	   
    
