'use strict'
const NumetricCon = require("./DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi")
const ShopifyCon = require("./DataConnectorLogic/ShopifyDataConnectorLogic")
const numetricDataConnectorLogic = require("./DataConnectorLogic/NumetricDataConnectorLogic")
const ShopifyData = require("./DataConnectorApi/ShopifyDataConnectorApi/ShopifyDataDataConnectorApi")
const config = require("./Config/Config")
const utils = require("./Helper/Util")
var conf = new config();


var lastUpdated = {
  created_at_min : conf.parameters().initialDateTimeShopify,
  timezone : 'GMT-11:00'
}

/*
ShopifyData.getCustomers(lastUpdated,function(resultCustomer){ 
		if(resultCustomer.Result.Success){
		var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultCustomer.Result.Data,"id","customers");
		var datos = resultCustomer.Result.Data;
		numetricDataConnectorLogic.verifyCreateDatasetNumetric('customers',datasetShopify.DataSetList).then(resultCustomer=>
		{
		resultCustomer.Result.customers = {};
		resultCustomer.Result.customers.id =  resultCustomer.Result.Id; 
			
			numetricDataConnectorLogic.verifyCreateDatasetNumetric('customers_addresses',datasetShopify.DataSetList).then(resultDefaultAddres=>
			{
				resultCustomer.Result.customers_addresses = {};
				resultCustomer.Result.customers_addresses.id= resultDefaultAddres.Result.Id; 
				numetricDataConnectorLogic.verifyCreateDatasetNumetric('customers_default_address',datasetShopify.DataSetList).then(resultAdress=>
				{
					resultCustomer.Result.customers_default_address = {};
					resultCustomer.Result.customers_default_address.id = resultAdress.Result.Id; 
					resultCustomer.Result.Data = datos;
					ShopifyCon.sendRowsShopifyToNumetric(resultCustomer.Result);
				});
			});
			
		});   
		}
});


ShopifyData.getOrders(lastUpdated,function(resultOrder)
	{ 
		if(resultOrder.Result.Success){
			var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultOrder.Result.Data,"id","orders");
			var datos = resultOrder.Result.Data;	
			
			numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders',datasetShopify.DataSetList).then(resultOrderVerify=>
			{							
				resultOrder.Result.orders = {};
				resultOrder.Result.orders.id =  resultOrderVerify.Result.Id; 
				
				numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_billing_address',datasetShopify.DataSetList).then(resultOrdersBillingAddressVerify=>
				{				
					resultOrder.Result.orders_billing_address = {};
					resultOrder.Result.orders_billing_address.id =  resultOrdersBillingAddressVerify.Result.Id; 
					
					numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_shipping_address',datasetShopify.DataSetList).then(resultOrdersShippingAddressVerify=>
					{				
						resultOrder.Result.orders_shipping_address = {};
						resultOrder.Result.orders_shipping_address.id =  resultOrdersShippingAddressVerify.Result.Id; 
						
						numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_discount_codes',datasetShopify.DataSetList).then(resultOrdersDiscountCodesVerify=>
						{							
							resultOrder.Result.orders_discount_codes = {};
							resultOrder.Result.orders_discount_codes.id =  resultOrdersDiscountCodesVerify.Result.Id; 
							
							numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_note_attributes',datasetShopify.DataSetList).then(resultOrdersNoteAttributesVerify=>
							{							
								resultOrder.Result.orders_note_attributes = {};
								resultOrder.Result.orders_note_attributes.id =  resultOrdersNoteAttributesVerify.Result.Id; 
								
								numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_tax_lines',datasetShopify.DataSetList).then(resultOrdersTaxLinesVerify=>
								{							
									resultOrder.Result.orders_tax_lines = {};
									resultOrder.Result.orders_tax_lines.id =  resultOrdersTaxLinesVerify.Result.Id; 
									
									numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_line_items',datasetShopify.DataSetList).then(resultOrdersLineItemsVerify=>
									{							
										resultOrder.Result.orders_line_items = {};
										resultOrder.Result.orders_line_items.id =  resultOrdersLineItemsVerify.Result.Id; 
										
										numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_line_items_properties',datasetShopify.DataSetList).then(resultOrdersLineItemsPropertiesVerify=>
										{							
											resultOrder.Result.orders_line_items_properties = {};
											resultOrder.Result.orders_line_items_properties.id =  resultOrdersLineItemsPropertiesVerify.Result.Id; 
											
											numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_shipping_lines',datasetShopify.DataSetList).then(resultOrdersShippingLinesVerify=>
											{							
												resultOrder.Result.orders_shipping_lines = {};
												resultOrder.Result.orders_shipping_lines.id =  resultOrdersShippingLinesVerify.Result.Id; 
												
												numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_fulfillments',datasetShopify.DataSetList).then(resultOrdersFulfillmentsVerify=>
												{							
													resultOrder.Result.orders_fulfillments = {};
													resultOrder.Result.orders_fulfillments.id =  resultOrdersFulfillmentsVerify.Result.Id; 
													
													numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_fulfillments_receipt',datasetShopify.DataSetList).then(resultOrdersFulfillmentsReceiptVerify=>
													{							
														resultOrder.Result.orders_fulfillments_receipt = {};
														resultOrder.Result.orders_fulfillments_receipt.id =  resultOrdersFulfillmentsReceiptVerify.Result.Id; 
														
														numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_refunds',datasetShopify.DataSetList).then(resultOrdersRefundsVerify=>
														{							
															resultOrder.Result.orders_refunds = {};
															resultOrder.Result.orders_refunds.id =  resultOrdersRefundsVerify.Result.Id; 
															
															numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_refunds_line_items',datasetShopify.DataSetList).then(resultOrdersRefundsLineItemsVerify=>
															{							
																resultOrder.Result.orders_refunds_line_items = {};
																resultOrder.Result.orders_refunds_line_items.id =  resultOrdersRefundsLineItemsVerify.Result.Id; 
																
																numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_refunds_line_items_line_item',datasetShopify.DataSetList).then(resultOrdersRefundsLineItemsItemVerify=>
																{							
																	resultOrder.Result.orders_refunds_line_items_line_item = {};
																	resultOrder.Result.orders_refunds_line_items_line_item.id =  resultOrdersRefundsLineItemsItemVerify.Result.Id; 
																	
																	numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_refunds_line_items_line_item_properties',datasetShopify.DataSetList).then(resultOrdersRefundsLineItemsItemPropertiesVerify=>
																	{							
																		resultOrder.Result.orders_refunds_line_items_line_item_properties = {};
																		resultOrder.Result.orders_refunds_line_items_line_item_properties.id =  resultOrdersRefundsLineItemsItemPropertiesVerify.Result.Id; 
																			
																		numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_refunds_line_items_line_item_tax_lines',datasetShopify.DataSetList).then(resultOrdersRefundsLineItemsItemTaxLinesVerify=>
																		{							
																			resultOrder.Result.orders_refunds_line_items_line_item_tax_lines = {};
																			resultOrder.Result.orders_refunds_line_items_line_item_tax_lines.id =  resultOrdersRefundsLineItemsItemTaxLinesVerify.Result.Id; 
																				
																			numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_refunds_transactions',datasetShopify.DataSetList).then(resultOrdersRefundsTransactionsVerify=>
																			{							
																				resultOrder.Result.orders_refunds_transactions = {};
																				resultOrder.Result.orders_refunds_transactions.id =  resultOrdersRefundsTransactionsVerify.Result.Id; 
																				
																				numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_refunds_order_adjustments',datasetShopify.DataSetList).then(resultOrdersAdjustmentsVerify=>
																				{							
																					resultOrder.Result.orders_refunds_order_adjustments = {};
																					resultOrder.Result.orders_refunds_order_adjustments.id =  resultOrdersAdjustmentsVerify.Result.Id; 
																				
																					numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_refunds_transactions_receipt',datasetShopify.DataSetList).then(resultOrdersRefundsTransactionsReceiptVerify=>
																					{							
																						resultOrder.Result.orders_refunds_transactions_receipt = {};
																						resultOrder.Result.orders_refunds_transactions_receipt.id =  resultOrdersRefundsTransactionsReceiptVerify.Result.Id; 
																																									
																						numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_client_details',datasetShopify.DataSetList).then(resultOrdersClientDetailsVerify=>
																						{							
																							resultOrder.Result.orders_client_details = {};
																							resultOrder.Result.orders_client_details.id =  resultOrdersClientDetailsVerify.Result.Id; 
																							
																							numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_payment_details',datasetShopify.DataSetList).then(resultOrdersPaymentDetailsVerify=>
																							{							
																								resultOrder.Result.orders_payment_details = {};
																								resultOrder.Result.orders_payment_details.id =  resultOrdersPaymentDetailsVerify.Result.Id; 
																								
																								numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_customer',datasetShopify.DataSetList).then(resultOrdersCustomerVerify=>
																								{							
																									resultOrder.Result.orders_customer = {};
																									resultOrder.Result.orders_customer.id =  resultOrdersCustomerVerify.Result.Id; 
																									
																									numetricDataConnectorLogic.verifyCreateDatasetNumetric('orders_customer_default_address',datasetShopify.DataSetList).then(resultOrdersCustomerDefaultAddressVerify=>
																									{							
																										resultOrder.Result.orders_customer_default_address = {};
																										resultOrder.Result.orders_customer_default_address.id =  resultOrdersCustomerDefaultAddressVerify.Result.Id; 
																										resultOrder.Result.Data = datos;
																										ShopifyCon.sendRowsShopifyToNumetric(resultOrder.Result);
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
	});
	
	

ShopifyData.getEvents(lastUpdated,function(resultEvents)
{ 
		if(resultEvents.Result.Success)
		{			
			var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultEvents.Result.Data,"id","events");
			var datos = resultEvents.Result.Data;
			
			numetricDataConnectorLogic.verifyCreateDatasetNumetric('events',datasetShopify.DataSetList).then(resultEventsVerify=>
			{
				resultEvents.Result.events = {};
				resultEvents.Result.events.id =  resultEventsVerify.Result.Id; 
				resultEvents.Result.Data = datos;			
			
				ShopifyCon.sendRowsShopifyToNumetric(resultEvents.Result);
				
			});   
		}
});

ShopifyData.getComments(lastUpdated,function(resultComments)
{ 
		if(resultComments.Result.Success)
		{			
			var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultComments.Result.Data,"id","comments");
			var datos = resultComments.Result.Data;
			
			numetricDataConnectorLogic.verifyCreateDatasetNumetric('comments',datasetShopify.DataSetList).then(resultCommentsVerify=>
			{
				resultComments.Result.comments = {};
				resultComments.Result.comments.id =  resultCommentsVerify.Result.Id; 
				resultComments.Result.Data = datos;
							
				ShopifyCon.sendRowsShopifyToNumetric(resultComments.Result);
				
			});   
		}
});

ShopifyData.getProducts(lastUpdated,function(resultProducts)
{ 
		if(resultProducts.Result.Success)
		{			
			var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultProducts.Result.Data,"id","products");
			var datos = resultProducts.Result.Data;
			
			numetricDataConnectorLogic.verifyCreateDatasetNumetric('products',datasetShopify.DataSetList).then(resultProductsVerify=>
			{
				resultProducts.Result.products = {};
				resultProducts.Result.products.id =  resultProductsVerify.Result.Id; 
				resultProducts.Result.Data = datos;
							
				ShopifyCon.sendRowsShopifyToNumetric(resultProducts.Result);
				
			});   
		}
});

*/


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





/*


	
*/