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

var lstDatasets = ["d85959e3-bbb8-48c6-a4f8-fb03ff2e1eba","bdf493bd-bcd0-4b96-8086-b41222b2cbb8"
,"b3acaee7-f8c5-4a44-8fe3-cab4b8930ac0","48622622-56a9-495f-a24f-1159d9e7db76","794ea08e-3cd9-4d46-9801-3e50ad4634e7"
,"8e290480-5f29-4013-9ae8-672e7fb11786","021c115a-59d7-4f3c-91b4-f7e56ed9c00b","ab88b4da-1932-4b89-886e-e20734f85ab3","5968657c-ee94-4398-8bf3-017afa48c285"];
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