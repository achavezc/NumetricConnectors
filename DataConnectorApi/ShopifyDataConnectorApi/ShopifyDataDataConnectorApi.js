const Shopify = require('shopify-api-node');
const config = require("./../../Config/Config");
var conf = new config();


const shopify = new Shopify({
    shopName: conf.parameters().shopNameShopify, //'alshopping',
    apiKey: conf.parameters().apiKeyShopify, //'1d27b7ede1453ec10bfa360eab134478',
    password: conf.parameters().passwordShopify, //'ef0a6f9c267ff5498d1db4aae742273d'
});



function toTimeZone(time, zone) {
    zone = zone.replace('-', '+');
    var date = new Date(time);
    var dateLocal = date.getUTCMonth() + 1 + "/" + date.getUTCDate() + "/" + date.getUTCFullYear() + " " + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds();
    return new Date(dateLocal + ' ' + zone).toISOString();
}

var getTimeZone = function getTimeZone() {
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
    return shopify.shop.get({})
        .then(function(shop) {
            var timezoneEnd = "";
            var lstEnd = [];
            var lst1 = shop.timezone.split(')');

            if (lst1.length > 0) {
                lstEnd = lst1[0].split('(');
            }
            if (lstEnd.length > 0) {
                timezoneEnd = lstEnd[1];
            }
            resultEvent.Result.TimeZone = timezoneEnd;
            resultEvent.Result.Success = true;
            return resultEvent;

        })
        .catch(function(err) {
            resultEvent.Result.Success = false;
            resultEvent.Result.Error = err;
            return resultEvent;
        });
};


var getData = function getData(lastUpdated, entity) {
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
    resultEvent.Result.Data = {};
    resultEvent.Result.Data[entity] = [];

    var date = toTimeZone(lastUpdated.created_at_min, lastUpdated.timezone);

    var list = [];

    return shopify[entity].count({
            updated_at_min: date
        }).then(function(count) {
            var listInputs = [];
            var countEnd = parseInt(count / lastUpdated.limit) + 1;

            for (var i = 1; i <= countEnd; i++) {
                listInputs.push(i);
            }

            var actions = listInputs.map(function(input) {
                return shopify[entity].list({
                    updated_at_min: date,
                    limit: lastUpdated.limit,
                    page: input
                });
            });

            var returns = Promise.all(actions);

            return returns.then(function(ListReturn) {
                for (var i = 0; i < ListReturn.length; i++) {
                    for (var j = 0; j < ListReturn[i].length; j++) {
                        list.push(ListReturn[i][j]);
                    }
                }
                resultEvent.Result.Success = true;
                resultEvent.Result.Data[entity] = list;
                return resultEvent;
            });
        })
        .catch(function(err) {
            resultEvent.Result.Success = false;
            resultEvent.Result.Error = err;
            return resultEvent;
        });
};

var getTransactions = function getTransactions(lastUpdated) {
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Data = {};
    resultEvent.Result.Data.transaction = [];
    resultEvent.Result.Success = false;

    var date = toTimeZone(lastUpdated.created_at_min, lastUpdated.timezone);

    var transactionList = [];
    return shopify.order.count({
            updated_at_min: date
        }).then(function(count) {
            var listInputs = [];
            var countEnd = parseInt(count / lastUpdated.limit) + 1;
            for (var i = 1; i <= countEnd; i++) {
                listInputs.push(i);
            }

            var actions = listInputs.map(function(input) {
                return shopify.order.list({
                    updated_at_min: date,
                    limit: lastUpdated.limit,
                    page: input
                });
            });

            var returns = Promise.all(actions);
            return returns.then(function(orders) {
                var listInputsIdOrder = [];

                for (var i = 0; i < orders.length; i++) {
                    for (var j = 0; j < orders[i].length; j++) {
                        listInputsIdOrder.push(orders[i][j].id);
                    }
                }

                var actions = listInputsIdOrder.map(function(input) {
                    return shopify.transaction.list(input, {
                        updated_at_min: date
                    });
                });

                var returns = Promise.all(actions);

                return returns.then(function(TransactionListReturn) {
                    for (var i = 0; i < TransactionListReturn.length; i++) {
                        for (var j = 0; j < TransactionListReturn[i].length; j++) {
                            transactionList.push(TransactionListReturn[i][j]);
                        }
                    }
                    resultEvent.Result.Success = true;
                    resultEvent.Result.Data.transaction = transactionList;

                    return resultEvent;
                });
            });

        })
        .catch(function(err) {
            resultEvent.Result.Success = false;
            resultEvent.Result.Error = err;
            return resultEvent;
        });

};

var getArticles = function getArticles(lastUpdated) {
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Data = {};
    resultEvent.Result.Data.article = [];
    resultEvent.Result.Success = false;

    var date = toTimeZone(lastUpdated.created_at_min, lastUpdated.timezone);

    var articleList = [];

    return shopify.blog.count({
            updated_at_min: date
        }).then(function(count) {
            var listInputsPage = [];
            var countEnd = parseInt(count / lastUpdated.limit) + 1;
            for (var i = 1; i <= countEnd; i++) {
                listInputsPage.push(i);
            }

            var actions = listInputsPage.map(function(input) {
                return shopify.blog.list({
                    updated_at_min: date,
                    limit: lastUpdated.limit,
                    page: input
                });
            });
            var returns = Promise.all(actions);
            return returns.then(function(blogs) {
                var listInputs = [];

                for (var i = 0; i < blogs.length; i++) {
                    listInputs.push(blogs[i].id);
                }

                var actions = listInputs.map(function(input) {
                    return shopify.article.list(input, {
                        updated_at_min: date
                    });
                });

                var returns = Promise.all(actions);

                return returns.then(function(ArticleListReturn) {
                    for (var i = 0; i < ArticleListReturn.length; i++) {
                        for (var j = 0; j < ArticleListReturn[i].length; j++) {
                            articleList.push(ArticleListReturn[i][j]);
                        }
                    }


                    resultEvent.Result.Success = true;
                    resultEvent.Result.Data.article = articleList;

                    return resultEvent;
                });

            });
        })
        .catch(function(err) {
            resultEvent.Result.Success = false;
            resultEvent.Result.Error = err;
            //callback(resultEvent);
            return resultEvent;
        });

};


module.exports = {
    getTimeZone: getTimeZone,
    getArticles: getArticles,
    getTransactions: getTransactions,
    getData: getData
};