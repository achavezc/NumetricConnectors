/*
'use strict';
const rp = require('request-promise');
const options = {
     method: 'POST',
     uri: 'https://api-qa.numetric.com/v2/dataset/delete',
     headers: {
         Authorization: 'rJuUQBduBXsQGUN9AWmeUgC1SmYBKWISj8FTVrNzjZM%3D'
     },
     body: { datasetId: "374bdb59-c2ce-49c6-b181-bfd8f6a36c8c" },
     json: true,
};
rp(options).then(response =>{
     console.log(response);
});
*/

'use strict';
const rp = require('request-promise');

var lstDatasets = ["4f1f6349-c0ca-4b53-9f86-08440dd8f5ae"];
for(var i=0 ; i<lstDatasets.length; i++){
    const options = {
        method: 'DELETE',
        uri: 'https://api-qa.numetric.com/v2/dataset/'+ lstDatasets[i] ,
        headers: {
            Authorization: 'rJuUQBduBXsQGUN9AWmeUgC1SmYBKWISj8FTVrNzjZM%3D'
        },
        json: true,
    };
    rp(options).then(response =>{
        console.log(response);
    });
}