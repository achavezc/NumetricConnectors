'use strict'
const NumetricCon = require("../DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi")
const ShopifyCon = require("../DataConnectorLogic/ShopifyDataConnectorLogic")
const numetricDataConnectorLogic = require("../DataConnectorLogic/NumetricDataConnectorLogic")
const ShopifyData = require("../DataConnectorApi/ShopifyDataConnectorApi/ShopifyDataDataConnectorApi")
const config = require("../Config/Config")
const utils = require("../Helper/Util")
const promiseRetry = require('promise-retry')
var nconf = require('nconf');
nconf.use('file', { file: '../ConfigDate/DateTimeLastSync.json' });
var conf = new config();
var datetime = require('node-datetime');


var options = {
  retries: conf.parameters().retriesCount
}


var syncDataRetry = function syncDataRetry(lastUpdated) 
{	
	console.log("syncDataRetry");

	promiseRetry(options,function (retry, number) 
	{
		console.log('attempt number', number);

		return syncData(lastUpdated)
		.catch(err=>{
			//aqui grabas
			console.log(err);
			retry(err);
		});
	})
	.then(function (value) 
	{
		console.log('syncDataRetry completed');
		// save datetime
		nconf.load();
		
		var dt = datetime.create();
		var fomratted = dt.format('m/d/Y H:M:S');
		console.log(fomratted);
		nconf.set('lastUpdateShopify',fomratted);
		
		nconf.save(function (err) 
		{
			if (err) 
			{
				console.error(err.message);
				return;
			}
			console.log('Shopify last updated saved successfully.');
		});
	}, function (err) 
	{
		//aqui grabas si siguio el error despues de los reintentos
		console.log(err);
	});
}

var syncData = function syncData(lastUpdated) 
{
	console.log(lastUpdated);
	
	console.log("syncData");
	
    var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;

	 return syncDataCustomer(lastUpdated).then(resultCustome=>
	 {
		console.log("syncDataCustomer Completed");
		
		return syncDataEvents(lastUpdated).then(resultEvents=>
		{
			console.log("syncDataEvents Completed");
			
				return syncDataComments(lastUpdated).then(resultComments=>
				{
					console.log("syncDataComments Completed");
					return syncDataProducts(lastUpdated).then(resultProducts=>
					{
						console.log("syncDataProducts Completed");
						return syncDataCustomCollections(lastUpdated).then(resultCustomCollections=>
						{
							return syncDataBlogs(lastUpdated).then(resultBlogs=>
							{							
								console.log("syncDataBlogs Completed");			
								
								return syncDataSmartCollections(lastUpdated).then(resultSmartCollections=>
								{
									console.log("syncSmartCollections Completed");
									
									return syncDataOrder(lastUpdated).then(resultOrder=>
									{
										console.log("syncDataOrder Completed");
										return resultEvent.Result.Success= true;
									});
								});
							});
						});     
					});
				});
			
	   });
	});
}

var syncDataBlogs = function syncDataBlogs(lastUpdated) 
{
	console.log("syncDataBlogs Init");
	
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getBlogs(lastUpdated).then(resultBlogs=>	
	{ 
		if(resultBlogs.Result.Success)
		{			
			if(resultBlogs.Result.Data.blogs.length>0)
			{
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultBlogs.Result.Data,"id","blogs");
				var datos = resultBlogs.Result.Data;
				
				return numetricDataConnectorLogic.verifyCreateDatasetNumetric('blogs',datasetShopify.DataSetList).then(resultBlogsVerify=>
				{
					resultBlogs.Result.blogs = {};
					resultBlogs.Result.blogs.id =  resultBlogsVerify.Result.Id; 
					resultBlogs.Result.Data = datos;										
					
					return ShopifyCon.sendRowsShopifyToNumetric(resultBlogs.Result).then(results=>
					{
						return results;
					});							
				});  
			} 
		}
		else
		{
				resultEvent.Result.Success = true;
				return resultEvent;
		}
	})
	
}

var syncDataCustomer = function syncDataCustomer(lastUpdated) 
{
	console.log("syncDataCustomer Init");
	
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
	return 	ShopifyData.getCustomers(lastUpdated).then(resultCustomer=>
	{ 		
			
		if(resultCustomer.Result.Success)
		{						
			if(resultCustomer.Result.Data.customers.length>0)
			{	
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultCustomer.Result.Data,"id","customers");
				var datos = resultCustomer.Result.Data;
				return numetricDataConnectorLogic.verifyCreateDatasetNumetric('customers',datasetShopify.DataSetList).then(resultCustomerVerify=>
				{
					resultCustomer.Result.customers = {};
					resultCustomer.Result.customers.id =  resultCustomerVerify.Result.Id; 

					return numetricDataConnectorLogic.verifyCreateDatasetNumetric('customers_addresses',datasetShopify.DataSetList).then(resultDefaultAddressVerify=>
					{
						resultCustomer.Result.customers_addresses = {};
						resultCustomer.Result.customers_addresses.id= resultDefaultAddressVerify.Result.Id; 
						return numetricDataConnectorLogic.verifyCreateDatasetNumetric('customers_default_address',datasetShopify.DataSetList).then(resultAddressVerify=>
						{
							resultCustomer.Result.customers_default_address = {};
							resultCustomer.Result.customers_default_address.id = resultAddressVerify.Result.Id; 
							resultCustomer.Result.Data = datos;
							return ShopifyCon.sendRowsShopifyToNumetric(resultCustomer.Result).then(results=>
							{
								return results;
							});
						});
					});

				});
			}
			else{
				resultEvent.Result.Success = true;
				return resultEvent;
			}
		}
	});
}


var syncDataSmartCollections = function syncDataSmartCollections(lastUpdated) 
{
	console.log("syncDataSmartCollections Init");
	
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getSmartCollections(lastUpdated).then(resultSmartCollection=>		
	{ 
		if(resultSmartCollection.Result.Success)
		{						
			if(resultSmartCollection.Result.Data.smart_Collection.length>0)
			{
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultSmartCollection.Result.Data,"id","smart_Collection");
				var datos = resultSmartCollection.Result.Data;
				
				return numetricDataConnectorLogic.verifyCreateDatasetNumetric('smart_Collection',datasetShopify.DataSetList).then(resultSmartCollectionVerify=>
				{
					resultSmartCollection.Result.smart_Collection = {};
					resultSmartCollection.Result.smart_Collection.id =  resultSmartCollectionVerify.Result.Id; 
					resultSmartCollection.Result.Data = datos;			
				
					return ShopifyCon.sendRowsShopifyToNumetric(resultSmartCollection.Result).then(results=>
					{
						return results;
					});
					
				});   
			}
		}
		else
		{
				resultEvent.Result.Success = true;
				return resultEvent;
		}
		
	});
}



var syncDataEvents = function syncDataEvents(lastUpdated) 
{
	console.log("syncDataEvents Init");
	
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getEvents(lastUpdated).then(resultEvents=>	
	{ 
		if(resultEvents.Result.Success)
		{			
			if(resultEvents.Result.Data.events.length>0)
			{
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultEvents.Result.Data,"id","events");
				var datos = resultEvents.Result.Data;
				
				return numetricDataConnectorLogic.verifyCreateDatasetNumetric('events',datasetShopify.DataSetList).then(resultEventsVerify=>
				{
					resultEvents.Result.events = {};
					resultEvents.Result.events.id =  resultEventsVerify.Result.Id; 
					resultEvents.Result.Data = datos;										
					
					return ShopifyCon.sendRowsShopifyToNumetric(resultEvents.Result).then(results=>
					{
						return results;
					});							
				});  
			} 
		}
		else
		{
				resultEvent.Result.Success = true;
				return resultEvent;
		}
	})
	
}

var syncDataComments = function syncDataComments(lastUpdated) 
{
	console.log("syncDataComments Init");

	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getComments(lastUpdated).then(resultComments=>		
	{ 
		if(resultComments.Result.Success)
		{			
			if(resultComments.Result.Data.comments.length>0)
			{
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultComments.Result.Data,"id","comments");
				var datos = resultComments.Result.Data;
			
				return numetricDataConnectorLogic.verifyCreateDatasetNumetric('comments',datasetShopify.DataSetList).then(resultCommentsVerify=>
				{
					resultComments.Result.comments = {};
					resultComments.Result.comments.id =  resultCommentsVerify.Result.Id; 
					resultComments.Result.Data = datos;
								
					return ShopifyCon.sendRowsShopifyToNumetric(resultComments.Result).then(results=>
					{
						return results;
					});
				});  
			} 
		}
		else
		{
				resultEvent.Result.Success = true;
				return resultEvent;
		}
	})
}

var syncDataProducts = function syncDataProducts(lastUpdated) 
{
	console.log("syncDataProducts Init");
	
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getProducts(lastUpdated).then(resultProducts=>																																																									//{
	{ 
		if(resultProducts.Result.Success)
		{	
			if(resultProducts.Result.Data.products.length>0)
			{
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultProducts.Result.Data,"id","products");
				var datos = resultProducts.Result.Data;
				
				return numetricDataConnectorLogic.verifyCreateDatasetNumetric('products',datasetShopify.DataSetList).then(resultProductsVerify=>
				{
					resultProducts.Result.products = {};
					resultProducts.Result.products.id =  resultProductsVerify.Result.Id; 
					resultProducts.Result.Data = datos;						
					
					return ShopifyCon.sendRowsShopifyToNumetric(resultProducts.Result).then(results=>
					{
						return results;
					});					
				}); 
			}  
		}
		else
		{
				resultEvent.Result.Success = true;
				return resultEvent;
		}
	})	
	
}

var syncDataCustomCollections = function syncDataCustomCollections(lastUpdated) 
{
	console.log("syncDataCustomCollections Init");
	
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getCustomCollections(lastUpdated).then(resultCustomCollection=>		
	{ 
		if(resultCustomCollection.Result.Success)
		{						
			if(resultCustomCollection.Result.Data.custom_Collection.length>0)
			{
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultCustomCollection.Result.Data,"id","custom_Collection");
				var datos = resultCustomCollection.Result.Data;
				
				return numetricDataConnectorLogic.verifyCreateDatasetNumetric('custom_Collection',datasetShopify.DataSetList).then(resultCustomCollectionVerify=>
				{
					resultCustomCollection.Result.custom_Collection = {};
					resultCustomCollection.Result.custom_Collection.id =  resultCustomCollectionVerify.Result.Id; 
					resultCustomCollection.Result.Data = datos;			
				
					return ShopifyCon.sendRowsShopifyToNumetric(resultCustomCollection.Result).then(results=>
					{
						return results;
					});
					
				});   
			}
		}
		else
		{
				resultEvent.Result.Success = true;
				return resultEvent;
		}
		
	});
}

var syncDataOrder = function syncDataOrder(lastUpdated) 
{
	console.log("syncDataOrder Init");
	
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getOrders(lastUpdated).then(resultOrder=>	
	{ 
		if(resultOrder.Result.Success)
		{
			if(resultOrder.Result.Data.orders.length>0)
			{	
				utils.WriteFileTxt("\r\n");
				utils.WriteFileTxt(JSON.stringify(resultOrder));
				utils.WriteFileTxt("\r\n");
			
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultOrder.Result.Data,"id","orders");
				var datos = resultOrder.Result.Data;	
				
				return numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders',datasetShopify.DataSetList).then(resultOrderVerify=>
				{	
					console.log("verifyCreateDatasetNumetric orders Completed");
					
					resultOrder.Result.orders = {};
					resultOrder.Result.orders.id =  resultOrderVerify.Result.Id; 
					
					return numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_billing_address',datasetShopify.DataSetList).then(resultOrdersBillingAddressVerify=>
					{		
						console.log("verifyCreateDatasetNumetric orders_billing_address Completed");
						
						resultOrder.Result.orders_billing_address = {};
						resultOrder.Result.orders_billing_address.id =  resultOrdersBillingAddressVerify.Result.Id; 
						
						return numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_shipping_address',datasetShopify.DataSetList).then(resultOrdersShippingAddressVerify=>
						{	
							console.log("verifyCreateDatasetNumetric orders_shipping_address Completed");
							
							resultOrder.Result.orders_shipping_address = {};
							resultOrder.Result.orders_shipping_address.id =  resultOrdersShippingAddressVerify.Result.Id; 
							
							return numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_discount_codes',datasetShopify.DataSetList).then(resultOrdersDiscountCodesVerify=>
							{			
								console.log("verifyCreateDatasetNumetric orders_discount_codes Completed");
								
								resultOrder.Result.orders_discount_codes = {};
								resultOrder.Result.orders_discount_codes.id =  resultOrdersDiscountCodesVerify.Result.Id; 
								
								return numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_note_attributes',datasetShopify.DataSetList).then(resultOrdersNoteAttributesVerify=>
								{							
									console.log("verifyCreateDatasetNumetric orders_note_attributes Completed");
									
									resultOrder.Result.orders_note_attributes = {};
									resultOrder.Result.orders_note_attributes.id =  resultOrdersNoteAttributesVerify.Result.Id; 
									
									return numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_tax_lines',datasetShopify.DataSetList).then(resultOrdersTaxLinesVerify=>
									{	
										console.log("verifyCreateDatasetNumetric orders_tax_lines Completed");
										
										resultOrder.Result.orders_tax_lines = {};
										resultOrder.Result.orders_tax_lines.id =  resultOrdersTaxLinesVerify.Result.Id; 
										
										return numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_line_items',datasetShopify.DataSetList).then(resultOrdersLineItemsVerify=>
										{				
											console.log("verifyCreateDatasetNumetric orders_line_items Completed");
											
											resultOrder.Result.orders_line_items = {};
											resultOrder.Result.orders_line_items.id =  resultOrdersLineItemsVerify.Result.Id; 
											
											return numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_line_items_properties',datasetShopify.DataSetList).then(resultOrdersLineItemsPropertiesVerify=>
											{		
												console.log("verifyCreateDatasetNumetric orders_line_items_properties Completed");
												resultOrder.Result.orders_line_items_properties = {};
												resultOrder.Result.orders_line_items_properties.id =  resultOrdersLineItemsPropertiesVerify.Result.Id; 
												
												return numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_shipping_lines',datasetShopify.DataSetList).then(resultOrdersShippingLinesVerify=>
												{			
													console.log("verifyCreateDatasetNumetric orders_shipping_lines Completed");
													resultOrder.Result.orders_shipping_lines = {};
													resultOrder.Result.orders_shipping_lines.id =  resultOrdersShippingLinesVerify.Result.Id; 
													
													return numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_fulfillments',datasetShopify.DataSetList).then(resultOrdersFulfillmentsVerify=>
													{						
														console.log("verifyCreateDatasetNumetric orders_fulfillments Completed");
														resultOrder.Result.orders_fulfillments = {};
														resultOrder.Result.orders_fulfillments.id =  resultOrdersFulfillmentsVerify.Result.Id; 
														
														return numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_fulfillments_receipt',datasetShopify.DataSetList).then(resultOrdersFulfillmentsReceiptVerify=>
														{		
															console.log("verifyCreateDatasetNumetric orders_fulfillments_receipt Completed");
															resultOrder.Result.orders_fulfillments_receipt = {};
															resultOrder.Result.orders_fulfillments_receipt.id =  resultOrdersFulfillmentsReceiptVerify.Result.Id; 
															
															return numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_refunds',datasetShopify.DataSetList).then(resultOrdersRefundsVerify=>
															{			
																console.log("verifyCreateDatasetNumetric orders_refunds Completed");
																
																resultOrder.Result.orders_refunds = {};
																resultOrder.Result.orders_refunds.id =  resultOrdersRefundsVerify.Result.Id; 
																
																return numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_refunds_line_items',datasetShopify.DataSetList).then(resultOrdersRefundsLineItemsVerify=>
																{		
																	console.log("verifyCreateDatasetNumetric orders_refunds_line_items Completed");
																	
																	resultOrder.Result.orders_refunds_line_items = {};
																	resultOrder.Result.orders_refunds_line_items.id =  resultOrdersRefundsLineItemsVerify.Result.Id; 
																	
																	return numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_refunds_line_items_line_item',datasetShopify.DataSetList).then(resultOrdersRefundsLineItemsItemVerify=>
																	{	
																		console.log("verifyCreateDatasetNumetric orders_refunds_line_items_line_item Completed");
																		resultOrder.Result.orders_refunds_line_items_line_item = {};
																		resultOrder.Result.orders_refunds_line_items_line_item.id =  resultOrdersRefundsLineItemsItemVerify.Result.Id; 
																		
																		return numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_refunds_line_items_line_item_properties',datasetShopify.DataSetList).then(resultOrdersRefundsLineItemsItemPropertiesVerify=>
																		{				
																			console.log("verifyCreateDatasetNumetric orders_refunds_line_items_line_item_properties Completed");
																			resultOrder.Result.orders_refunds_line_items_line_item_properties = {};
																			resultOrder.Result.orders_refunds_line_items_line_item_properties.id =  resultOrdersRefundsLineItemsItemPropertiesVerify.Result.Id; 
																				
																			return numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_refunds_line_items_line_item_tax_lines',datasetShopify.DataSetList).then(resultOrdersRefundsLineItemsItemTaxLinesVerify=>
																			{	
																				console.log("verifyCreateDatasetNumetric orders_refunds_line_items_line_item_tax_lines Completed");
																				resultOrder.Result.orders_refunds_line_items_line_item_tax_lines = {};
																				resultOrder.Result.orders_refunds_line_items_line_item_tax_lines.id =  resultOrdersRefundsLineItemsItemTaxLinesVerify.Result.Id; 
																					
																				return numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_refunds_transactions',datasetShopify.DataSetList).then(resultOrdersRefundsTransactionsVerify=>
																				{	
																					console.log("verifyCreateDatasetNumetric orders_refunds_transactions Completed");
																					resultOrder.Result.orders_refunds_transactions = {};
																					resultOrder.Result.orders_refunds_transactions.id =  resultOrdersRefundsTransactionsVerify.Result.Id; 
																					
																					return numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_refunds_order_adjustments',datasetShopify.DataSetList).then(resultOrdersAdjustmentsVerify=>
																					{	
																						console.log("verifyCreateDatasetNumetric orders_refunds_order_adjustments Completed");
																						resultOrder.Result.orders_refunds_order_adjustments = {};
																						resultOrder.Result.orders_refunds_order_adjustments.id =  resultOrdersAdjustmentsVerify.Result.Id; 
																					
																						return numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_refunds_transactions_receipt',datasetShopify.DataSetList).then(resultOrdersRefundsTransactionsReceiptVerify=>
																						{			
																							console.log("verifyCreateDatasetNumetric orders_refunds_transactions_receipt Completed");
																							resultOrder.Result.orders_refunds_transactions_receipt = {};
																							resultOrder.Result.orders_refunds_transactions_receipt.id =  resultOrdersRefundsTransactionsReceiptVerify.Result.Id; 
																																										
																							return numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_client_details',datasetShopify.DataSetList).then(resultOrdersClientDetailsVerify=>
																							{			
																								console.log("verifyCreateDatasetNumetric orders_client_details Completed");
																								resultOrder.Result.orders_client_details = {};
																								resultOrder.Result.orders_client_details.id =  resultOrdersClientDetailsVerify.Result.Id; 
																								
																								return numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_payment_details',datasetShopify.DataSetList).then(resultOrdersPaymentDetailsVerify=>
																								{							
																									console.log("verifyCreateDatasetNumetric orders_payment_details Completed");
																									resultOrder.Result.orders_payment_details = {};
																									resultOrder.Result.orders_payment_details.id =  resultOrdersPaymentDetailsVerify.Result.Id; 
																									
																									return numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_customer',datasetShopify.DataSetList).then(resultOrdersCustomerVerify=>
																									{		
																										console.log("verifyCreateDatasetNumetric orders_customer Completed");
																										resultOrder.Result.orders_customer = {};
																										resultOrder.Result.orders_customer.id =  resultOrdersCustomerVerify.Result.Id; 
																										
																										return numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_customer_default_address',datasetShopify.DataSetList).then(resultOrdersCustomerDefaultAddressVerify=>
																										{	
																											console.log("verifyCreateDatasetNumetric orders_customer_default_address Completed");
																											resultOrder.Result.orders_customer_default_address = {};
																											resultOrder.Result.orders_customer_default_address.id =  resultOrdersCustomerDefaultAddressVerify.Result.Id; 
																											resultOrder.Result.Data = datos;					
																											
																											return ShopifyCon.sendRowsShopifyToNumetric(resultOrder.Result).then(results=>
																											{
																												return results;
																											});
					
																										});
																									});
																								});																						
																							});																					
																						});
																					});
																				});
																			});																		
																		});																	
																	});																
																});
															});															
														});
													});
												});												
											});											
										});										
									});
								});
							});
						}); 							
					});	
				});	
			}
			else
			{
				resultEvent.Result.Success = true;
				return resultEvent;
			}
		}
	});
}



module.exports = 
{
    syncDataRetry : syncDataRetry
};


/*
NO FUNCIONA



//TODO:Request path contains unescaped characters
ShopifyData.getTransactions(lastUpdated,function(resultTransactions)
{ 
	if(resultTransactions.Result.Success)
	{						
		var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultTransactions.Result.Data,"id","transactions");
		var datos = resultTransactions.Result.Data;
		
		numetricDataConnectorLogic.verifyCreateDatasetNumetric('transactions',datasetShopify.DataSetList).then(resultTransactionsVerify=>
		{
			resultTransactions.Result.transactions = {};
			resultTransactions.Result.transactions.id =  resultTransactionsVerify.Result.Id; 
			resultTransactions.Result.Data = datos;			
		
			ShopifyCon.sendRowsShopifyToNumetric(resultTransactions.Result);				
		});   
	}
});


//TODO: "SELF_SIGNED_CERT_IN_CHAIN","message":"self signed certificate in certificate chain" ,"hostname":"alshopping.myshopify.com","method":"GET","path":"/admin/smart_collections.json?created_at_min=2017-01-07T03%3A52%3A48.000Z"
ShopifyData.getSmartCollections(lastUpdated,function(resultSmartCollection)
{ 
		if(resultSmartCollection.Result.Success)
		{						
			var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultSmartCollection.Result.Data,"id","smart_Collection");
			var datos = resultSmartCollection.Result.Data;
			
			numetricDataConnectorLogic.verifyCreateDatasetNumetric('smart_Collection',datasetShopify.DataSetList).then(resultSmartCollectionVerify=>
			{
				resultSmartCollection.Result.smart_Collection = {};
				resultSmartCollection.Result.smart_Collection.id =  resultSmartCollectionVerify.Result.Id; 
				resultSmartCollection.Result.Data = datos;			
			
				ShopifyCon.sendRowsShopifyToNumetric(resultSmartCollection.Result);				
			});   
		}
});

//TODO: {"code":"SELF_SIGNED_CERT_IN_CHAIN","message":"self signed certificate in certificate chain","hostname":"alshopping.myshopify.com","method":"GET","path":"/admin/blogs.json?created_at_min=2017-01-07T03%3A52%3A48.000Z"}
ShopifyData.getArticles(lastUpdated,function(resultArticles)
{ 
	if(resultArticles.Result.Success)
	{						
		var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultArticles.Result.Data,"id","articles");
		var datos = resultArticles.Result.Data;
		
		numetricDataConnectorLogic.verifyCreateDatasetNumetric('articles',datasetShopify.DataSetList).then(resultArticlesVerify=>
		{
			resultArticles.Result.articles = {};
			resultArticles.Result.articles.id =  resultArticlesVerify.Result.Id; 
			resultArticles.Result.Data = datos;			
		
			ShopifyCon.sendRowsShopifyToNumetric(resultArticles.Result);				
		});   
	}
});














	
*/
