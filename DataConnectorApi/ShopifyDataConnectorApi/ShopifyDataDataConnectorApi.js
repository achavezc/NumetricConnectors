
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
        resultEvent.Result.TimeZone  = shop.timezone;
        resultEvent.Result.Success = true;
        callback(resultEvent);
    })
    .catch(function(err) {
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        callback(resultEvent);
    });
}

var getOrders = function getOrders(lastUpdated,callback) {    
    var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
    shopify.order.list({ created_at_min: date})
    .then(function(orders) {
        resultEvent.Result.Data  = {}; 
        resultEvent.Result.Data.orders = [];
        resultEvent.Result.Data.orders = orders
        resultEvent.Result.Success = true;
        callback(resultEvent);
    })
    .catch(function(err) {
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        callback(resultEvent);
    });
}

var getEvents = function getEvents(lastUpdated,callback) {
    var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
    shopify.event.list({ created_at_min: date})
    .then(function(events) 
	{		
        resultEvent.Result.Data  = {}; 
        resultEvent.Result.Data.events = [];
        resultEvent.Result.Data.events = events;
		resultEvent.Result.Success = true;		
		
        callback(resultEvent);
    })
    .catch(function(err)
	{		
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        callback(resultEvent);
    });
}

var getArticles = function getArticles(lastUpdated,callback){
     var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
    var articleList = [];
    shopify.blog.list({ created_at_min: date})
    .then(function(blogs) 
	{
		
        for(i=0; i<blogs.length;i++){
             shopify.article.list(blogs[i].id,{ created_at_min: date})
              .then(function(articles) {
                  articleList.push(articles);
             })
        }
        resultEvent.Result.Data  = {}; 
        resultEvent.Result.Data.articles = [];
        resultEvent.Result.Data.articles = articleList;
		resultEvent.Result.Success = true;
        callback(resultEvent);
    })
    .catch(function(err) 
	{
		
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        callback(resultEvent);
    });
}

var getCustomCollections = function getCustomCollections(lastUpdated,callback) {
    var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
    shopify.customCollection.list({ created_at_min: date})
    .then(function(customCollections) 
	{
        resultEvent.Result.Data  = {}; 
        resultEvent.Result.Data.customCollections = [];
        resultEvent.Result.Data.customCollections = customCollections;
		resultEvent.Result.Success = true;		
        callback(resultEvent);
    })
    .catch(function(err) {
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        callback(resultEvent);
    });
}

var getComments = function getComments(lastUpdated,callback) {
    var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
    shopify.comment.list({ created_at_min: date})
    .then(function(comments) {
        resultEvent.Result.Data  = {}; 
        resultEvent.Result.Data.comments = [];
        resultEvent.Result.Data.comments = comments;
		resultEvent.Result.Success = true;
        callback(resultEvent);
    })
    .catch(function(err) {
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        callback(resultEvent);
    });
}

var getProducts = function getProducts(lastUpdated,callback) {
    var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
    shopify.product.list({ created_at_min: date})
    .then(function(products) 
	{
        resultEvent.Result.Data  = {}; 
        resultEvent.Result.Data.products = [];
        resultEvent.Result.Data.products = products;
		resultEvent.Result.Success = true;
        callback(resultEvent);
    })
    .catch(function(err) {
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        callback(resultEvent);
    });
}

var getCustomers = function getCustomers(lastUpdated,callback) {
    var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
    //console.log(resultEvent);
    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
    shopify.customer.list({ created_at_min: date})
    .then(function(customers) {
       
        resultEvent.Result.Data = {};
        resultEvent.Result.Data.customers = [];
        resultEvent.Result.Data.customers = customers;
        resultEvent.Result.Success = true;
        callback(resultEvent);
    })
    .catch(function(err) {
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        callback(resultEvent);
    });
}

var getCustomerAddress = function getCustomerAddress(lastUpdated,callback) {
  var resultEvent = {};
  resultEvent.Result = {}
  resultEvent.Result.Success = false;
  var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
  var addresList = [];
  shopify.customer.list({created_at_min: date})
    .then(function(customers) {
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
    .catch(function(err) {
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        callback(resultEvent);
    });
}

var getTransactions = function getTransactions(lastUpdated,callback) {
    var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
    shopify.transaction.list({ created_at_min: date})
    .then(function(transactions) {
        resultEvent.Result.Data = {};
        resultEvent.Result.Data.transactions = [];
        resultEvent.Result.Data.transactions = transactions;
		
        resultEvent.Result.Success = true;
        callback(resultEvent);
    })
    .catch(function(err) {
		
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        callback(resultEvent);
    });
}

var getSmartCollections = function getSmartCollections(lastUpdated,callback) {
    var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
    var date = toTimeZone(lastUpdated.created_at_min,lastUpdated.timezone);
    shopify.smartCollection.list({ created_at_min: date})
    .then(function(smartCollections) {
        resultEvent.Result.Data = {};
        resultEvent.Result.Data.smartCollections = [];
        resultEvent.Result.Data.smartCollections = smartCollections;
        callback(resultEvent);
    })
    .catch(function(err) {
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        callback(resultEvent);
    });
}


module.exports = {
    getTimeZone : getTimeZone,
    getOrders : getOrders,
    getEvents : getEvents,
    getArticles : getArticles,
    getCustomCollections : getCustomCollections,
    getComments : getComments,
    getProducts : getProducts,
    getCustomers : getCustomers,
    getCustomerAddress : getCustomerAddress,
    getTransactions : getTransactions,
    getSmartCollections : getSmartCollections

};