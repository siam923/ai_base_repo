const getApis = async ({}) => {
    return [
        {
            "apiName": "sampleLambda",
            "endpoint": "POST - sample-post-request",
            "filePaths": [
                "src/handler/moduleName/apiName/SampleHandlerMgmt.js"
            ],
            "pathParams": null,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer [api_key]",
                "X-Api-Key": "",
                "_X_AMZN_TRACE_ID": "",
                "trackingId": "",
                "accesstoken": ""
            },
        },
        {
            "apiName": "getProducts",
            "endpoint": "GET - /products",
            "filePaths": [
                "src/handler/moduleName/apiName/GetProductsHandler.js"
            ],
            "pathParams": null,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer [api_key]",
            },
        }
    ]
  }
