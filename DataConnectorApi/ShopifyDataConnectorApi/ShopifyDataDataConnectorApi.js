
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
  timezone : 'GMT-11:00'
}

function toTimeZone(time, zone) {
    return  new Date(time + ' ' +  zone).toISOString();
}

var getTimeZone = function getTimeZone(callback) {
    var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
    shopify.shop.get({ })
    .then(function(shop) {
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

var getOrders = function getOrders(lastUpdated) 
{    
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

var getEvents = function getEvents(lastUpdated) 
{
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

var getArticles = function getArticles(lastUpdated){
     var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
    var articleList = [];
    return shopify.blog.list({ created_at_min: date}).then(function(blogs) 
	{	
		utils.WriteFileTxt("shopify.blog.list then");
		utils.WriteFileTxt("\r\n");
		utils.WriteFileTxt(utils.WriteFileTxt(JSON.stringify(blogs)));
		utils.WriteFileTxt("\r\n");
		
        for(i=0; i<blogs.length;i++)
		{
             shopify.article.list(blogs[i].id,{ created_at_min: date})
              .then(function(articles) {
                  articleList.push(articles);
             })
        }		
		
		utils.WriteFileTxt("articleList");
		utils.WriteFileTxt("\r\n");
		utils.WriteFileTxt(utils.WriteFileTxt(JSON.stringify(articleList)));
		utils.WriteFileTxt("\r\n");		
        resultEvent.Result.Data  = {}; 
        resultEvent.Result.Data.articles = [];
        resultEvent.Result.Data.articles = articleList;
		resultEvent.Result.Success = true;
       
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

var getCustomCollections = function getCustomCollections(lastUpdated)
 {
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
    return shopify.customCollection.list({ created_at_min: date}).then(function(customCollections) 
	{			
        resultEvent.Result.Data  = {}; 
        resultEvent.Result.Data.custom_Collection = [];
        resultEvent.Result.Data.custom_Collection = customCollections;
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

var getProducts = function getProducts(lastUpdated) 
{
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
    //console.log(resultEvent);
    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
    return shopify.customer.list({ created_at_min: date})
    .then(function(customers) {
       // console.log(customers);
        resultEvent.Result.Data = {};
        resultEvent.Result.Data.customers = [];
        resultEvent.Result.Data.customers = customers;
        resultEvent.Result.Success = true;
	return resultEvent;
        //callback(resultEvent);
    })
    .catch(function(err) {
        //console.log("mal");
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
		utils.WriteFileTxt("getCustomers error");
		utils.WriteFileTxt(err.message);
	 return resultEvent;
        //callback(resultEvent);
    });
}

/*
var getCustomerAddress = function getCustomerAddress(lastUpdated,callback) {
  var resultEvent = {};
  resultEvent.Result = {}
  resultEvent.Result.Success = false;
  var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
  var addresList = [];
  shopify.customer.list({created_at_min: date})
    .then(function(customers) 
	{
		utils.WriteFileTxt("shopify.customer.list then");
		utils.WriteFileTxt("\r\n");
		utils.WriteFileTxt(utils.WriteFileTxt(JSON.stringify(customers)));
		utils.WriteFileTxt("\r\n");
		
          for(i=0; i<customers.length;i++){
           shopify.customerAddress.list( customers[i].id,{created_at_min: date})
            .then(function(customerAddresss) {
                addresList.push(customerAddresss);
            })
          }
			resultEvent.Result.Data  = {}; 
			resultEvent.Result.Data.customer_Address = [];
			resultEvent.Result.Data.customer_Address = addresList;
			resultEvent.Result.Success = true;
          callback(resultEvent);
    })
    .catch(function(err) 
	{
		utils.WriteFileTxt("shopify.customer.list error");
		console.log(err);
		utils.WriteFileTxt(err.message);
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        callback(resultEvent);
    });
}

*/

/*
var getTransactions = function getTransactions(lastUpdated,callback) 
{
	
	utils.WriteFileTxt("\r\n");
	utils.WriteFileTxt("getTransactions entró");
	utils.WriteFileTxt("\r\n");
	
    var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
    shopify.transaction.list({ created_at_min: date})
    .then(function(transactions) 
	{
		utils.WriteFileTxt("\r\n");
		utils.WriteFileTxt("getTransactions then");
		utils.WriteFileTxt("\r\n")
		utils.WriteFileTxt(JSON.stringify(transactions));
		utils.WriteFileTxt("\r\n")
		
        resultEvent.Result.Data = {};
        resultEvent.Result.Data.transactions = [];
        resultEvent.Result.Data.transactions = transactions;
		
        resultEvent.Result.Success = true;
        callback(resultEvent);
    })
    .catch(function(err) 
	{
        console.log(err);
		utils.WriteFileTxt("\r\n");
		utils.WriteFileTxt("getTransactions err");
		utils.WriteFileTxt("\r\n")
		utils.WriteFileTxt(err.message);
		utils.WriteFileTxt("\r\n")
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        callback(resultEvent);
    });
}
*/


var getSmartCollections = function getSmartCollections(lastUpdated) {
    var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
    return shopify.smartCollection.list({ created_at_min: date}).then(function(smartCollections) 
	{
        
        resultEvent.Result.Data  = {}; 
        resultEvent.Result.Data.smart_Collection = [];
        resultEvent.Result.Data.smart_Collection = smartCollections;
		resultEvent.Result.Success = true;
        //callback(resultEvent);
		return resultEvent;
    })
    .catch(function(err) 
	{
		utils.WriteFileTxt("getSmartCollections err");
		resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        //callback(resultEvent);
		return resultEvent;
    });
}




var getBlogs = function getBlogs (lastUpdated) 
{
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
    //getTransactions : getTransactions,
    getSmartCollections : getSmartCollections

};
