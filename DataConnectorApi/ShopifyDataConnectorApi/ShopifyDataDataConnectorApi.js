
const Shopify = require('./shopify-api-node');
const config = require("./../../Config/Config");
const utils = require("./../../Helper/Util");
var conf = new config();


const shopify = new Shopify({
  shopName:  conf.parameters().shopNameShopify, //'alshopping',
  apiKey:  conf.parameters().apiKeyShopify,//'1d27b7ede1453ec10bfa360eab134478',
  password:  conf.parameters().passwordShopify,//'ef0a6f9c267ff5498d1db4aae742273d'
});


lastUpdated = {
  created_at_min : '01/01/2017 4:52:48 PM',
  timezone : 'GMT-11:00',
  limit: 250
};

function toTimeZone(time, zone) {
	zone = zone.replace('-','+');
	var date = new Date(time);
	var dateLocal = date.getUTCMonth() + 1 + "/" + date.getUTCDate() + "/" + date.getUTCFullYear() 
					+ " " + date.getUTCHours() + ":" + date.getUTCMinutes() +":" + date.getUTCSeconds() ;
	
    return  new Date(dateLocal + ' ' +  zone).toISOString();
}

var getTimeZone = function getTimeZone(callback){
	
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
    shopify.shop.get({ })
    .then(function(shop) 
	{
        var timezoneEnd = "";
        var lstEnd = [];
        var lst1 = shop.timezone.split(')');
        
        if(lst1.length>0){
            lstEnd = lst1[0].split('(');
        }
        if(lstEnd.length>0){
                timezoneEnd = lstEnd[1]
        }
        resultEvent.Result.TimeZone  = timezoneEnd;
        resultEvent.Result.Success = true;
        callback(resultEvent);
    })
    .catch(function(err) {
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        callback(resultEvent);
    });
};


var getOrders = function getOrders(lastUpdated)
{    
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;

	resultEvent.Result.Data = {};
    resultEvent.Result.Data.orders = [];
	
    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);

	var orderList = [];	
	
	return shopify.order.count({updated_at_min:date}).then(function(count)
	{        
        var listInputs=[];
        var countEnd = parseInt(count/lastUpdated.limit) + 1 ;
	
		for(var i=1; i<=countEnd;i++)
		{
			listInputs.push(i);
		}	
		
		var actions = listInputs.map(function(input)
		{
			return shopify.order.list({updated_at_min: date, limit: lastUpdated.limit, page:input }); 
		});

		var returns = Promise.all(actions);
		
		return returns.then(OrderListReturn =>
		{	
			for(var i = 0; i< OrderListReturn.length;i++)
			{					
				for(var j =0; j < OrderListReturn [i].length;j++)
				{	
					orderList.push(OrderListReturn [i][j])					
				}				
			}					
			resultEvent.Result.Success =true;
			resultEvent.Result.Data.orders = orderList;	
			return resultEvent;			
		})
    })
    .catch(function(err)
	{      
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;		
	    return resultEvent;
    });
};


var getEvents = function getEvents(lastUpdated)
{
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	 
	resultEvent.Result.Data = {};
    resultEvent.Result.Data.events = [];
	
	var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
	var eventList = [];
	
	return shopify.event.count({updated_at_min: date}).then(function(count)
	{		  
        var listInputs=[];
        var countEnd = parseInt(count/lastUpdated.limit) + 1 ;
	
		for(var i=1; i<=countEnd;i++)
		{
			listInputs.push(i);
		}	
		
		var actions = listInputs.map(function(input)
		{
			return shopify.event.list({ updated_at_min: date, limit: lastUpdated.limit, page:input }); 
		});

		var returns = Promise.all(actions);
		
	
	   return returns.then(EventListReturn =>
			{	
				for(var i = 0; i< EventListReturn.length;i++)
				{					
					for(var j =0; j < EventListReturn [i].length;j++)
					{	
						eventList.push(EventListReturn [i][j])					
					}				
				}					
				resultEvent.Result.Success =true;
				resultEvent.Result.Data.events = eventList;	
				return resultEvent;			
			})
		})
		.catch(function(err)
		{      
			resultEvent.Result.Success = false;
			resultEvent.Result.Error = err;		
			return resultEvent;
		});
	};

var getCustomCollections = function getCustomCollections(lastUpdated)
{
	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
    resultEvent.Result.Data = {};
    resultEvent.Result.Data.custom_collection = [];
	
	var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
	
	var customCollectionsList = [];
	
	return shopify.customCollection.count({updated_at_min: date}).then(function(count)
	{        
        var listInputs=[];
        var countEnd = parseInt(count/lastUpdated.limit) + 1 ;
	
		for(var i=1; i<=countEnd;i++)
		{
			listInputs.push(i);
		}	
		
		var actions = listInputs.map(function(input)
		{
			return shopify.customCollection.list({ updated_at_min: date, limit: lastUpdated.limit, page:input }); 
		});

		var returns = Promise.all(actions);		
	
		return returns.then(CustomCollectionsListReturn =>
		{	
			for(var i = 0; i< CustomCollectionsListReturn.length;i++)
			{					
				for(var j =0; j < CustomCollectionsListReturn [i].length;j++)
				{	
					customCollectionsList.push(CustomCollectionsListReturn [i][j])					
				}				
			}					
			resultEvent.Result.Success =true;
			resultEvent.Result.Data.custom_collection = customCollectionsList;	
			return resultEvent;			
		})
	})
	.catch(function(err)
	{      
		resultEvent.Result.Success = false;
		resultEvent.Result.Error = err;		
		return resultEvent;
	});
};
	    

var getComments = function getComments(lastUpdated) 
{
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	resultEvent.Result.Data = {};
    resultEvent.Result.Data.comments = [];
	
    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
	
	console.log('getComments date: '+ date);
	utils.WriteFileTxt('getComments date: '+ date);
	
	var commentList = [];
	
	return shopify.comment.count({updated_at_min: date}).then(function(count)
	{        
        var listInputs=[];
        var countEnd = parseInt(count/lastUpdated.limit) + 1 ;
	
		for(var i=1; i<=countEnd;i++)
		{
			listInputs.push(i);
		}	
		
		var actions = listInputs.map(function(input)
		{
			return shopify.comment.list({ updated_at_min: date, limit: lastUpdated.limit, page:input }); 
		});

		var returns = Promise.all(actions);		
	
		return returns.then(CommentListReturn =>
		{	
			for(var i = 0; i< CommentListReturn.length;i++)
			{					
				for(var j =0; j < CommentListReturn [i].length;j++)
				{	
					commentList.push(CommentListReturn [i][j])					
				}				
			}					
			resultEvent.Result.Success =true;
			resultEvent.Result.Data.comments = commentList;	
			return resultEvent;			
		})
	})
	.catch(function(err)
	{      
		resultEvent.Result.Success = false;
		resultEvent.Result.Error = err;		
		return resultEvent;
	});
};




var getProducts = function getProducts(lastUpdated) 
{
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	resultEvent.Result.Data = {};
    resultEvent.Result.Data.products = [];
	
    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
	
	var productList = [];
	
	return shopify.product.count({updated_at_min: date}).then(function(count)
	{        
        var listInputs=[];
        var countEnd = parseInt(count/lastUpdated.limit) + 1 ;
	
		for(var i=1; i<=countEnd;i++)
		{
			listInputs.push(i);
		}	
		
		var actions = listInputs.map(function(input)
		{
			return shopify.product.list({ updated_at_min: date, limit: lastUpdated.limit, page:input }); 
		});

		var returns = Promise.all(actions);		
	
		return returns.then(ProductListReturn =>
		{	
			for(var i = 0; i< ProductListReturn.length;i++)
			{					
				for(var j =0; j < ProductListReturn [i].length;j++)
				{	
					productList.push(ProductListReturn [i][j])					
				}				
			}					
			resultEvent.Result.Success =true;
			resultEvent.Result.Data.products = productList;	
			return resultEvent;			
		})
	})
	.catch(function(err)
	{      
		resultEvent.Result.Success = false;
		resultEvent.Result.Error = err;		
		return resultEvent;
	});
};
  

var getCustomers = function getCustomers(lastUpdated) 
{
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;

    resultEvent.Result.Data = {};
    resultEvent.Result.Data.customers = [];

    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
	
	console.log('getCustomers date: '+ date);
	utils.WriteFileTxt('getCustomers date: '+ date);
	
	
    var customerList = [];	
    return shopify.customer.count({updated_at_min: date}).then(function(count){
       
        var listInputs=[];
        var countEnd = parseInt(count/lastUpdated.limit) + 1 ;
		for(var i=1; i<=countEnd;i++)
		{
			listInputs.push(i);
		}	
        
		 var actions = listInputs.map(function(input)
		 { 			
			 return shopify.customer.list({ updated_at_min: date, limit: lastUpdated.limit, page:input});
		 });
        
        var returns = Promise.all(actions);
		
		return returns.then(CustomerListReturn =>
		{	
			for(var i = 0; i< CustomerListReturn.length;i++)
			{					
				for(var j =0; j < CustomerListReturn[i].length;j++)
				{	
					customerList.push(CustomerListReturn[i][j])					
				}				
			}					
			resultEvent.Result.Success =true;
			resultEvent.Result.Data.customers = customerList;		

			return resultEvent;			
		})
      
    })
    .catch(function(err) 
	{		
		resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;		
	    return resultEvent;
    });
};

var getTransactions = function getTransactions(lastUpdated)
{		
    var resultEvent = {};
    resultEvent.Result = {};
	resultEvent.Result.Data  = {}; 
    resultEvent.Result.Data.transactions = [];
    resultEvent.Result.Success = false;

    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);

	var transactionList = [];	
 	return shopify.order.count({updated_at_min: date}).then(function(count){
		var listInputs=[];
        var countEnd = parseInt(count/lastUpdated.limit) + 1 ;
		for(var i=1; i<=countEnd;i++)
		{
			listInputs.push(i);
		}	
        
		 var actions = listInputs.map(function(input)
		 { 			
			 return shopify.order.list({ updated_at_min: date, limit: lastUpdated.limit, page:input});
		 });
        
        var returns = Promise.all(actions);
		return returns.then(orders =>
		{	
			var listInputsIdOrder=[];
		
			for(var i=0; i<orders.length;i++)
			{
				for(var j=0; j<orders[i].length;j++){
					listInputsIdOrder.push(orders[i][j].id);
				}
			}	
			
			var actions = listInputsIdOrder.map(function(input)
			{ 			
				return shopify.transaction.list(input,{ updated_at_min: date});		 
			});
			
			var returns = Promise.all(actions);
			
			return returns.then(TransactionListReturn =>
			{	
				for(var i = 0; i< TransactionListReturn.length;i++)
				{					
					for(var j =0; j < TransactionListReturn[i].length;j++)
					{	
						transactionList.push(TransactionListReturn[i][j])					
					}				
				}				
				resultEvent.Result.Success =true;
				resultEvent.Result.Data.transactions = transactionList;		

				return resultEvent;			
			})
		})
		
	})   
    .catch(function(err) 
	{
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
		return resultEvent;
    });
    
};

var getArticles = function getArticles(lastUpdated){		
    var resultEvent = {};
    resultEvent.Result = {};
	resultEvent.Result.Data  = {}; 
    resultEvent.Result.Data.articles = [];
    resultEvent.Result.Success = false;

    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);

	var articleList = [];

	return shopify.blog.count({updated_at_min: date}).then(function(count) {
		var listInputsPage = [];
		var countEnd = parseInt(count / lastUpdated.limit) + 1;
		for (var i = 1; i <= countEnd; i++) {
			listInputsPage.push(i);
		}

		var actions = listInputsPage.map(function (input) {
			return shopify.blog.list({updated_at_min: date, limit: lastUpdated.limit, page: input});
		});
		var returns = Promise.all(actions);
		return returns.then(blogs =>
		{
			var listInputs=[];

			for(var i=0; i<blogs.length;i++)
			{
				listInputs.push(blogs[i].id);
			}

			var actions = listInputs.map(function(input)
			{
				return shopify.article.list(input,{ updated_at_min: date});
			});

			var returns = Promise.all(actions);

			return returns.then(ArticleListReturn =>
			{
				for(var i = 0; i< ArticleListReturn.length;i++)
				{
					for(var j =0; j < ArticleListReturn[i].length;j++)
					{
						articleList.push(ArticleListReturn[i][j])
					}
				}


				resultEvent.Result.Success =true;
				resultEvent.Result.Data.articles = articleList;

				return resultEvent;
			})

		})
	})
    .catch(function(err) 
	{
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        //callback(resultEvent);
		return resultEvent;
    });
    
};

var getSmartCollections = function getSmartCollections(lastUpdated)
{
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
    resultEvent.Result.Data = {};
    resultEvent.Result.Data.smart_collection = [];
	
	var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);

	var smartCollectionList = [];
	
	return shopify.smartCollection.count({updated_at_min: date}).then(function(count)
	{        
        var listInputs=[];
        var countEnd = parseInt(count/lastUpdated.limit) + 1 ;
	
		for(var i=1; i<=countEnd;i++)
		{
			listInputs.push(i);
		}	
		
		var actions = listInputs.map(function(input)
		{
			return shopify.smartCollection.list({ updated_at_min: date, limit: lastUpdated.limit, page:input }); 
		});

		var returns = Promise.all(actions);		
	
		return returns.then(SmartCollectionListReturn =>
		{	
			for(var i = 0; i< SmartCollectionListReturn.length;i++)
			{					
				for(var j =0; j < SmartCollectionListReturn [i].length;j++)
				{	
					smartCollectionList.push(SmartCollectionListReturn [i][j])					
				}				
			}					
			resultEvent.Result.Success =true;
			resultEvent.Result.Data.smart_collection = smartCollectionList;	
			return resultEvent;			
		})
	})
	.catch(function(err)
	{      
		resultEvent.Result.Success = false;
		resultEvent.Result.Error = err;		
		return resultEvent;
	});
};

var getBlogs = function getBlogs(lastUpdated) 
{
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;

    resultEvent.Result.Data = {};
    resultEvent.Result.Data.blogs = [];

    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
    var blogList = [];	
    return shopify.blog.count({updated_at_min: date}).then(function(count){
       
        var listInputs=[];
        var countEnd = parseInt(count/lastUpdated.limit) + 1 ;
		for(var i=1; i<=countEnd;i++)
		{
			listInputs.push(i);
		}	
        
		 var actions = listInputs.map(function(input)
		 { 			
			 return shopify.blog.list({ updated_at_min: date, limit: lastUpdated.limit, page:input});
		 });
        
        var returns = Promise.all(actions);
		
		return returns.then(BlogListReturn =>
		{	
			for(var i = 0; i< BlogListReturn.length;i++)
			{					
				for(var j =0; j < BlogListReturn[i].length;j++)
				{	
					blogList.push(BlogListReturn[i][j])					
				}				
			}					
			resultEvent.Result.Success =true;
			resultEvent.Result.Data.blogs = blogList;		

			return resultEvent;			
		})
      
    })
    .catch(function(err) 
	{		
		resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;		
	    return resultEvent;
    });
};



module.exports = {
    getTimeZone : getTimeZone,
	getCustomers : getCustomers,
    getOrders : getOrders,
    getEvents : getEvents,
	getComments : getComments,
    getProducts : getProducts,
    getArticles : getArticles,
    getCustomCollections : getCustomCollections,
	getBlogs:getBlogs,
    //getCustomerAddress : getCustomerAddress,
    getTransactions : getTransactions,
    getSmartCollections : getSmartCollections

};


getTransactions(lastUpdated).then(resultCustomer=>
{ 		
     utils.WriteFileTxt(JSON.stringify(resultCustomer));	
    
 });
 