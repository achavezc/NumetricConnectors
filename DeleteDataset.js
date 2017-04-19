
'use strict';
const rp = require('request-promise');
const NumetricCon = require("./DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi");

NumetricCon.getDataSetNumetric().then(result=>{

     for(var i=0 ; i<result.Response.length; i++){
        const options = {
            method: 'DELETE',
            uri: 'https://api-qa.numetric.com/v2/dataset/'+ result.Response[i].id ,
            headers: {
                Authorization: 'rJuUQBduBXsQGUN9AWmeUgC1SmYBKWISj8FTVrNzjZM%3D'
            },
            json: true,
        };
        rp(options).then(response =>{
            console.log(response);
        });
    }
});
