
const Shopify = require('./shopify-api-node');
const config = require("./../../Config/Config")
const utils = require("./../../Helper/Util")
var conf = new config();


const shopify = new Shopify({
  shopName:  conf.parameters().shopNameShopify, //'alshopping',
  apiKey:  conf.parameters().apiKeyShopify,//'1d27b7ede1453ec10bfa360eab134478',
  password:  conf.parameters().passwordShopify,//'ef0a6f9c267ff5498d1db4aae742273d'
});


lastUpdated = {
  created_at_min : '01/01/2017 4:52:48 PM',
  timezone : 'GMT-11:00',
  limit: 50
}

function toTimeZone(time, zone) {
    return  new Date(time + ' ' +  zone).toISOString();
}

var getTimeZone = function getTimeZone(callback){
	
    var resultEvent = {};
    resultEvent.Result = {}
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
}

var getOrders = function getOrders(lastUpdated){    
    var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
    return shopify.order.list({ created_at_min: date}).then(function(orders) 
	{
        resultEvent.Result.Data  = {}; 
        resultEvent.Result.Data.orders = [];
        resultEvent.Result.Data.orders = orders
        resultEvent.Result.Success = true;
        //callback(resultEvent);
		return resultEvent;
    })
    .catch(function(err) {
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        //callback(resultEvent);
		return resultEvent;
    });
}

var getEvents = function getEvents(lastUpdated){
    var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
    return shopify.event.list({ created_at_min: date}).then(function(events) 
	{		
        resultEvent.Result.Data  = {}; 
        resultEvent.Result.Data.events = [];
        resultEvent.Result.Data.events = events;
		resultEvent.Result.Success = true;		
		
        //callback(resultEvent);
		return resultEvent;
    })
    .catch(function(err)
	{		
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        //callback(resultEvent);
		return resultEvent;
    });
}   

var getCustomCollections = function getCustomCollections(lastUpdated){
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
    return shopify.customCollection.list({ created_at_min: date}).then(function(customCollections) 
	{	
        resultEvent.Result.Data  = {}; 
        resultEvent.Result.Data.custom_collection = [];
        resultEvent.Result.Data.custom_collection = customCollections;
		resultEvent.Result.Success = true;		
        //callback(resultEvent);
		return resultEvent;
    })
    .catch(function(err) 
	{		
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;		
        //callback(resultEvent);
		return resultEvent;
    });
}

var getComments = function getComments(lastUpdated) {
    var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
    return shopify.comment.list({ created_at_min: date}).then(function(comments) 
	{
        resultEvent.Result.Data  = {}; 
        resultEvent.Result.Data.comments = [];
        resultEvent.Result.Data.comments = comments;
		resultEvent.Result.Success = true;
        //callback(resultEvent);
		return resultEvent;
    })
    .catch(function(err) {
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        //callback(resultEvent);
		return resultEvent;
    });
}

var getProducts = function getProducts(lastUpdated) {
    var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
    return shopify.product.list({ created_at_min: date}).then(function(products) 
	{		
        resultEvent.Result.Data  = {}; 
        resultEvent.Result.Data.products = [];
        resultEvent.Result.Data.products = products;
		resultEvent.Result.Success = true;
        //callback(resultEvent);
		return resultEvent;
    })
    .catch(function(err) 
	{	
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        //callback(resultEvent);
		return resultEvent;
    });
}

var getCustomers = function getCustomers(lastUpdated) {
    var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;

    resultEvent.Result.Data = {};
    resultEvent.Result.Data.customers = [];

    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
    var customerList = [];	
    return shopify.customer.count()
    .then(function(count){
        console.log(count);
        var listInputs=[];
        var countEnd = parseInt(count/lastUpdated.limit) + 1 ;
		for(i=1; i<=countEnd;i++)
		{
			listInputs.push(i);
		}	
        console.log(countEnd);
        console.log(listInputs);
		 var actions = listInputs.map(function(input)
		 { 			
			 return shopify.customer.list({ created_at_min: date, limit: lastUpdated.limit, page:input});
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
    .catch(function(err) {
        console.log("fallo count")
         console.log(err);
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;		
	    return resultEvent;
    });
}

var getTransactions = function getTransactions(lastUpdated){		
    var resultEvent = {};
    resultEvent.Result = {}
	resultEvent.Result.Data  = {}; 
    resultEvent.Result.Data.transactions = [];
    resultEvent.Result.Success = false;

    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);

	var transactionList = [];	

	return shopify.order.list({ created_at_min: date}).then(function(orders) 
	{		
		var listInputs=[];
		
		for(i=0; i<orders.length;i++)
		{
			listInputs.push(orders[i].id);
		}	
		
		 var actions = listInputs.map(function(input)
		 { 			
			 return shopify.transaction.list(input,{ created_at_min: date});		 
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
    .catch(function(err) 
	{
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        //callback(resultEvent);
		return resultEvent;
    });
    
}

var getArticles = function getArticles(lastUpdated){		
    var resultEvent = {};
    resultEvent.Result = {}
	resultEvent.Result.Data  = {}; 
    resultEvent.Result.Data.articles = [];
    resultEvent.Result.Success = false;

    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);

	var articleList = [];	

	return shopify.blog.list({ created_at_min: date}).then(function(blogs) 
	{		
		var listInputs=[];
		
		for(i=0; i<blogs.length;i++)
		{
			listInputs.push(blogs[i].id);
		}	
		
		 var actions = listInputs.map(function(input)
		 { 			
			 return shopify.article.list(input,{ created_at_min: date});		 
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
    .catch(function(err) 
	{
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        //callback(resultEvent);
		return resultEvent;
    });
    
}

var getSmartCollections = function getSmartCollections(lastUpdated){
    var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
    return shopify.smartCollection.list({ created_at_min: date}).then(function(smartCollections) 
	{
        resultEvent.Result.Data  = {}; 
        resultEvent.Result.Data.smart_collection = [];
        resultEvent.Result.Data.smart_collection = smartCollections;
		resultEvent.Result.Success = true;
        //callback(resultEvent);
		return resultEvent;
    })
    .catch(function(err) 
	{
		resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        //callback(resultEvent);
		return resultEvent;
    });
}

var getBlogs = function getBlogs (lastUpdated){
    var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
    return shopify.blog.list({ created_at_min: date}).then(function(blogs) 
	{		
        resultEvent.Result.Data  = {}; 
        resultEvent.Result.Data.blogs = [];
        resultEvent.Result.Data.blogs = blogs
		resultEvent.Result.Success = true;		
		
        //callback(resultEvent);
		return resultEvent;
    })
    .catch(function(err)
	{		
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        //callback(resultEvent);
		return resultEvent;
    });
}


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

/*
getCustomers(lastUpdated).then(resultCustomer=>
{ 			
     utils.WriteFileTxt(JSON.stringify(resultCustomer));	
    
 })
 */