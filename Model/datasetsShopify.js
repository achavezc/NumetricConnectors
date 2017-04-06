module.exports={
	datasetEvent:{
      "name": "Event",
      "fields": [
        {
          "field": "id",
          "displayName": "id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "subject_id",
          "displayName": "subject_id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "created_at",
          "displayName": "created_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "subject_type",
          "displayName": "subject_type",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "verb",
          "displayName": "verb",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "body",
          "displayName": "body",
          "autocomplete": false,
          "type": "string",
          "default": ""
        },
        {
          "field": "message",
          "displayName": "message",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "author",
          "displayName": "author",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "description",
          "displayName": "description",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "path",
          "displayName": "path",
          "autocomplete": false,
          "type": "string"
        }
      ],
      "primaryKey": "id",
      "categories": ["Shopify"],
      "description": "Shopify Event"
    },
    datasetEventId:{ id: '6ccce8d4-e7e9-47e5-9cfa-44f1a954608e' },
    datasetCustomCollection:{
  "name": "CustomCollection",
  "fields": [
    {
      "field": "id",
      "displayName": "id",
      "autocomplete": false,
      "type": "integer",
      "default": 0
    },
    {
      "field": "handle",
      "displayName": "handle",
      "autocomplete": false,
      "type": "string"
    },
    {
      "field": "title",
      "displayName": "title",
      "autocomplete": false,
      "type": "string"
    },
    {
      "field": "updated_at",
      "displayName": "updated_at",
      "autocomplete": false,
      "type": "datetime"
    },
    {
      "field": "body_html",
      "displayName": "body_html",
      "autocomplete": false,
      "type": "string"
    },
    {
      "field": "published_at",
      "displayName": "published_at",
      "autocomplete": false,
      "type": "datetime"
    },
    {
      "field": "sort_order",
      "displayName": "sort_order",
      "autocomplete": false,
      "type": "string"
    },
    {
      "field": "template_suffix",
      "displayName": "template_suffix",
      "autocomplete": false,
      "type": "string"
    },
    {
      "field": "published_scope",
      "displayName": "published_scope",
      "autocomplete": false,
      "type": "string"
    }
  ],
  "primaryKey": "id",
  "categories": ["Shopify"],
  "description": "Shopify Custom Collection"
},
datasetCustomCollectionId:{ id: 'ee69b1f7-d237-4e8b-8d79-e5fe25fbcf05' },
datasetComment:{
  "name": "Comment",
  "fields": [
    {
      "field": "id",
      "displayName": "id",
      "autocomplete": false,
      "type": "integer",
      "default": 0
    },
    {
      "field": "body",
      "displayName": "body",
      "autocomplete": false,
      "type": "string"
    },
    {
      "field": "body_html",
      "displayName": "body_html",
      "autocomplete": false,
      "type": "string"
    },
    {
      "field": "author",
      "displayName": "author",
      "autocomplete": false,
      "type": "string"
    },
    {
      "field": "email",
      "displayName": "email",
      "autocomplete": false,
      "type": "string"
    },
    {
      "field": "status",
      "displayName": "status",
      "autocomplete": false,
      "type": "string"
    },
    {
      "field": "article_id",
      "displayName": "article_id",
      "autocomplete": false,
      "type": "integer",
      "default": 0
    },
    {
      "field": "blog_id",
      "displayName": "blog_id",
      "autocomplete": false,
      "type": "integer",
      "default": 0
    },
    {
      "field": "created_at",
      "displayName": "created_at",
      "autocomplete": false,
      "type": "datetime"
    },
    {
      "field": "updated_at",
      "displayName": "updated_at",
      "autocomplete": false,
      "type": "datetime"
    },
    {
      "field": "ip",
      "displayName": "ip",
      "autocomplete": false,
      "type": "string"
    },
    {
      "field": "user_agent",
      "displayName": "user_agent",
      "autocomplete": false,
      "type": "string"
    },
    {
      "field": "published_at",
      "displayName": "published_at",
      "autocomplete": false,
      "type": "string"
    }
  ],
  "primaryKey": "id",
  "categories": ["Shopify"],
  "description": "Shopify Comment"
},
datasetCommentId:{ id: 'f4d57eeb-5126-4250-b680-96a81fb0ea82' },
datasetProduct:{
      "name": "Product",
      "fields": [
        {
          "field": "id",
          "displayName": "id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "title",
          "displayName": "title",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "body_html",
          "displayName": "body_html",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "vendor",
          "displayName": "vendor",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "product_type",
          "displayName": "product_type",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "created_at",
          "displayName": "created_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "handle",
          "displayName": "handle",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "updated_at",
          "displayName": "updated_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "published_at",
          "displayName": "published_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "template_suffix",
          "displayName": "template_suffix",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "published_scope",
          "displayName": "published_scope",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "tags",
          "displayName": "tags",
          "autocomplete": false,
          "type": "string"
        }
      ],
      "primaryKey": "id",
      "categories": ["Shopify"],
      "description": "Shopify Product"
    },
    datasetProductId:{ id: '30aa6e4f-35eb-45cf-b1b4-9443944a4ed9' },
    datasetProductVariant:{
      "name": "ProductVariant",
      "fields": [
        {
          "field": "id",
          "displayName": "id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "product_id",
          "displayName": "product_id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "title",
          "displayName": "title",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "price",
          "displayName": "price",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "sku",
          "displayName": "sku",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "position",
          "displayName": "position",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "grams",
          "displayName": "grams",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "inventory_policy",
          "displayName": "inventory_policy",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "compare_at_price",
          "displayName": "compare_at_price",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "fulfillment_service",
          "displayName": "fulfillment_service",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "inventory_management",
          "displayName": "inventory_management",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "option1",
          "displayName": "option1",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "option2",
          "displayName": "option2",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "option3",
          "displayName": "option3",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "created_at",
          "displayName": "created_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "updated_at",
          "displayName": "updated_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "taxable",
          "displayName": "taxable",
          "autocomplete": false,
          "type": "boolean",
          "default": false
        },
        {
          "field": "barcode",
          "displayName": "barcode",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "image_id",
          "displayName": "image_id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "inventory_quantity",
          "displayName": "inventory_quantity",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "weight",
          "displayName": "weight",
          "autocomplete": false,
          "type": "double",
          "default": 0
        },
        {
          "field": "weight_unit",
          "displayName": "weight_unit",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "old_inventory_quantity",
          "displayName": "old_inventory_quantity",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "requires_shipping",
          "displayName": "requires_shipping",
          "autocomplete": false,
          "type": "boolean",
          "default": false
        }
      ],
      "primaryKey": "id",
      "categories": ["Shopify"],
      "description": "Shopify Product Variants"
    },
    datasetProductVariantId:{ id: 'b05f9b7c-13c6-46ae-98c9-36623b601251' },
    datasetProductOption:{
      "name": "ProductOption",
      "fields": [
        {
          "field": "id",
          "displayName": "id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "product_id",
          "displayName": "product_id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "name",
          "displayName": "name",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "position",
          "displayName": "position",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        }
      ],
      "primaryKey": "id",
      "categories": ["Shopify"],
      "description": "Shopify Product Option"
    },
    datasetProductOptionId:{ id: '6937fd46-f4ea-4f3b-9758-2206068e330c' },
    datasetProductImages:{
      "name": "ProductImages",
      "fields": [
        {
          "field": "id",
          "displayName": "id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "product_id",
          "displayName": "product_id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "position",
          "displayName": "position",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "created_at",
          "displayName": "created_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "updated_at",
          "displayName": "updated_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "src",
          "displayName": "src",
          "autocomplete": false,
          "type": "string"
        }
      ],
      "primaryKey": "id",
      "categories": ["Shopify"],
      "description": "Shopify Product Images"
    },
    datasetProductImagesId:{ id: 'ad1ac1f0-3902-4033-95ea-a59b13814d1e' },
    datasetSmartCollection:{
      "name": "SmartCollection",
      "fields": [
        {
          "field": "id",
          "displayName": "id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "handle",
          "displayName": "handle",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "title",
          "displayName": "title",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "updated_at",
          "displayName": "updated_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "body_html",
          "displayName": "body_html",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "published_at",
          "displayName": "published_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "sort_order",
          "displayName": "sort_order",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "template_suffix",
          "displayName": "template_suffix",
          "autocomplete": false,
          "type": "string",
          "default": ""
        },
        {
          "field": "published_scope",
          "displayName": "published_scope",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "disjunctive",
          "displayName": "disjunctive",
          "autocomplete": false,
          "type": "boolean",
          "default": false
        }
      ],
      "primaryKey": "id",
      "categories": ["Shopify"],
      "description": "Shopify Smart Collections"
    },
    datasetSmartCollectionId:{ id: 'c0e355f1-2597-41c5-9d37-6146970f182c' },
    datasetCustomer:{
      "name": "Customer",
      "fields": [
        {
          "field": "id",
          "displayName": "id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "email",
          "displayName": "email",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "accepts_marketing",
          "displayName": "accepts_marketing",
          "autocomplete": false,
          "type": "boolean",
          "default": false
        },
        {
          "field": "created_at",
          "displayName": "created_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "updated_at",
          "displayName": "updated_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "first_name",
          "displayName": "first_name",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "last_name",
          "displayName": "last_name",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "orders_count",
          "displayName": "orders_count",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "state",
          "displayName": "state",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "total_spent",
          "displayName": "total_spent",
          "autocomplete": false,
          "type": "double"
        },
        {
          "field": "last_order_id",
          "displayName": "last_order_id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "note",
          "displayName": "note",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "verified_email",
          "displayName": "verified_email",
          "autocomplete": false,
          "type": "boolean",
          "default": false
        },
        {
          "field": "multipass_identifier",
          "displayName": "multipass_identifier",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "tax_exempt",
          "displayName": "tax_exempt",
          "autocomplete": false,
          "type": "boolean",
          "default": false
        },
        {
          "field": "phone",
          "displayName": "phone",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "tags",
          "displayName": "tags",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "last_order_name",
          "displayName": "last_order_name",
          "autocomplete": false,
          "type": "string"
        }
      ],
      "primaryKey": "id",
      "categories": ["Shopify"],
      "description": "Shopify Customers"
    },
    datasetCustomerId:{ id: '0feb912e-5b64-4964-be08-8b84a1d9f376' },
    datasetCustomerAddress:{
      "name": "CustomerAddress",
      "fields": [
        {
          "field": "id",
          "displayName": "id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "first_name",
          "displayName": "first_name",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "last_name",
          "displayName": "last_name",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "company",
          "displayName": "company",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "address1",
          "displayName": "address1",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "address2",
          "displayName": "address2",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "city",
          "displayName": "city",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "province",
          "displayName": "province",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "country",
          "displayName": "country",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "zip",
          "displayName": "zip",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "phone",
          "displayName": "phone",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "name",
          "displayName": "name",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "province_code",
          "displayName": "province_code",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "country_code",
          "displayName": "country_code",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "country_name",
          "displayName": "country_name",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "default",
          "displayName": "default",
          "autocomplete": false,
          "type": "boolean",
          "default": false
        }
      ],
      "primaryKey": "id",
      "categories": ["Shopify"],
      "description": "Shopify Customer Address"
    },
    datasetCustomerAddressId:{ id: 'a28573b0-aa68-45d9-ae6f-8e15b7c81933' },
    datasetTransaction:{
      "name": "Transaction",
      "fields": [
        {
          "field": "id",
          "displayName": "id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "order_id",
          "displayName": "order_id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "amount",
          "displayName": "amount",
          "autocomplete": false,
          "type": "double"
        },
        {
          "field": "kind",
          "displayName": "kind",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "gateway",
          "displayName": "gateway",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "status",
          "displayName": "status",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "message",
          "displayName": "message",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "created_at",
          "displayName": "created_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "test",
          "displayName": "test",
          "autocomplete": false,
          "type": "boolean",
          "default": false
        },
        {
          "field": "authorization",
          "displayName": "authorization",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "currency",
          "displayName": "currency",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "location_id",
          "displayName": "location_id",
          "autocomplete": false,
          "type": "integer"
        },
        {
          "field": "user_id",
          "displayName": "user_id",
          "autocomplete": false,
          "type": "integer"
        },
        {
          "field": "parent_id",
          "displayName": "parent_id",
          "autocomplete": false,
          "type": "integer"
        },
        {
          "field": "device_id",
          "displayName": "device_id",
          "autocomplete": false,
          "type": "integer"
        },
        {
          "field": "receipt",
          "displayName": "receipt",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "error_code",
          "displayName": "error_code",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "source_name",
          "displayName": "source_name",
          "autocomplete": false,
          "type": "string"
        }
      ],
      "primaryKey": "id",
      "categories": ["Shopify"],
      "description": "Shopify Transactions"
    },
    datasetTransactionId:{ id: 'db2ac25f-5d2c-4423-80cc-faae774078dc' },
    datasetArticle:{
      "name": "Article",
      "fields": [
        {
          "field": "id",
          "displayName": "id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "title",
          "displayName": "title",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "created_at",
          "displayName": "created_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "body_html",
          "displayName": "body_html",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "blog_id",
          "displayName": "blog_id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "author",
          "displayName": "author",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "user_id",
          "displayName": "user_id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "published_at",
          "displayName": "published_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "updated_at",
          "displayName": "updated_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "summary_html",
          "displayName": "summary_html",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "template_suffix",
          "displayName": "template_suffix",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "handle",
          "displayName": "handle",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "tags",
          "displayName": "tags",
          "autocomplete": false,
          "type": "string"
        }
      ],
      "primaryKey": "id",
      "categories": ["Shopify"],
      "description": "Shopify Articles"
    },
    datasetArticleId:{ id: '2ffdb5cf-1339-458e-9c01-b275fd1a4a4f' },
    datasetOrder:{
      "name": "Order",
      "fields": [
        {
          "field": "id",
          "displayName": "id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "email",
          "displayName": "email",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "closed_at",
          "displayName": "closed_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "created_at",
          "displayName": "created_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "updated_at",
          "displayName": "updated_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "number",
          "displayName": "number",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "note",
          "displayName": "note",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "token",
          "displayName": "token",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "gateway",
          "displayName": "gateway",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "test",
          "displayName": "test",
          "autocomplete": false,
          "type": "boolean",
          "default": false
        },
        {
          "field": "total_price",
          "displayName": "total_price",
          "autocomplete": false,
          "type": "double"
        },
        {
          "field": "subtotal_price",
          "displayName": "subtotal_price",
          "autocomplete": false,
          "type": "double"
        },
        {
          "field": "total_weight",
          "displayName": "total_weight",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "total_tax",
          "displayName": "total_tax",
          "autocomplete": false,
          "type": "double"
        },
        {
          "field": "taxes_included",
          "displayName": "taxes_included",
          "autocomplete": false,
          "type": "boolean",
          "default": false
        },
        {
          "field": "currency",
          "displayName": "currency",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "financial_status",
          "displayName": "financial_status",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "confirmed",
          "displayName": "confirmed",
          "autocomplete": false,
          "type": "boolean",
          "default": false
        },
        {
          "field": "total_discounts",
          "displayName": "total_discounts",
          "autocomplete": false,
          "type": "double"
        },
        {
          "field": "total_line_items_price",
          "displayName": "total_line_items_price",
          "autocomplete": false,
          "type": "double"
        },
        {
          "field": "cart_token",
          "displayName": "cart_token",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "buyer_accepts_marketing",
          "displayName": "buyer_accepts_marketing",
          "autocomplete": false,
          "type": "boolean",
          "default": false
        },
        {
          "field": "name",
          "displayName": "name",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "referring_site",
          "displayName": "referring_site",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "landing_site",
          "displayName": "landing_site",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "cancelled_at",
          "displayName": "cancelled_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "cancel_reason",
          "displayName": "cancel_reason",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "total_price_usd",
          "displayName": "total_price_usd",
          "autocomplete": false,
          "type": "double"
        },
        {
          "field": "checkout_token",
          "displayName": "checkout_token",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "reference",
          "displayName": "reference",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "user_id",
          "displayName": "user_id",
          "autocomplete": false,
          "type": "integer"
        },
        {
          "field": "location_id",
          "displayName": "location_id",
          "autocomplete": false,
          "type": "integer"
        },
        {
          "field": "source_identifier",
          "displayName": "source_identifier",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "source_url",
          "displayName": "source_url",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "processed_at",
          "displayName": "processed_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "device_id",
          "displayName": "device_id",
          "autocomplete": false,
          "type": "integer"
        },
        {
          "field": "browser_ip",
          "displayName": "browser_ip",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "landing_site_ref",
          "displayName": "landing_site_ref",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "order_number",
          "displayName": "order_number",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "processing_method",
          "displayName": "processing_method",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "checkout_id",
          "displayName": "checkout_id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "source_name",
          "displayName": "source_name",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "fulfillment_status",
          "displayName": "fulfillment_status",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "tags",
          "displayName": "tags",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "contact_email",
          "displayName": "contact_email",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "order_status_url",
          "displayName": "order_status_url",
          "autocomplete": false,
          "type": "string"
        }
      ],
      "primaryKey": "id",
      "categories": ["Shopify"],
      "description": "Shopify Orders"
    },
    datasetOrderId:{ id: 'dd8e69fc-98e8-4167-9b86-9cb6783444ac' },
    datasetOrderDiscountCode:{
      "name": "OrderDiscountCode",
      "fields": [
        {
          "field": "code",
          "displayName": "code",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "amount",
          "displayName": "amount",
          "autocomplete": false,
          "type": "double"
        }, 
        {
          "field": "type",
          "displayName": "type",
          "autocomplete": false,
          "type": "string"
        }
      ],
      "primaryKey": "code",
      "categories": ["Shopify"],
      "description": "Shopify Order discount codes"
    },
    datasetOrderDiscountCodeId:{ id: 'e8c5ede7-4b88-4ad8-ae0a-ad09d52e3bd5' },
    datasetOrderNoteAttribute:{
      "name": "OrderNoteAttribute",
      "fields": [
        {
          "field": "name",
          "displayName": "name",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "value",
          "displayName": "value",
          "autocomplete": false,
          "type": "string"
        }
      ],
      "primaryKey": "name",
      "categories": ["Shopify"],
      "description": "Shopify Order Note Attributes"
    },
    datasetOrderNoteAttributeId:{ id: '8b2ddf9c-0f63-4d82-8a99-a81cde247261' },
    datasetOrderTaxLine:{
      "name": "OrderTaxLine",
      "fields": [
        {
          "field": "title",
          "displayName": "title",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "price",
          "displayName": "price",
          "autocomplete": false,
          "type": "double"
        },
        {
          "field": "rate",
          "displayName": "rate",
          "autocomplete": false,
          "type": "double"
        }
      ],
      "primaryKey": "title",
      "categories": ["Shopify"],
      "description": "Shopify Order Tax Lines"
    },
    datasetOrderTaxLineId:{ id: '7db89b74-a726-4187-a56e-d79a50584ecd' },
    datasetOrderLineItem:{
      "name": "OrderLineItem",
      "fields": [
        {
          "field": "id",
          "displayName": "id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "variant_id",
          "displayName": "variant_id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "title",
          "displayName": "title",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "quantity",
          "displayName": "quantity",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "price",
          "displayName": "price",
          "autocomplete": false,
          "type": "double"
        },
        {
          "field": "grams",
          "displayName": "grams",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "sku",
          "displayName": "sku",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "variant_title",
          "displayName": "variant_title",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "vendor",
          "displayName": "vendor",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "fulfillment_service",
          "displayName": "fulfillment_service",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "product_id",
          "displayName": "product_id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "requires_shipping",
          "displayName": "requires_shipping",
          "autocomplete": false,
          "type": "boolean",
          "default": false
        },
        {
          "field": "taxable",
          "displayName": "taxable",
          "autocomplete": false,
          "type": "boolean",
          "default": false
        },
        {
          "field": "gift_card",
          "displayName": "gift_card",
          "autocomplete": false,
          "type": "boolean",
          "default": false
        },
        {
          "field": "name",
          "displayName": "name",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "variant_inventory_management",
          "displayName": "variant_inventory_management",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "product_exists",
          "displayName": "product_exists",
          "autocomplete": false,
          "type": "boolean",
          "default": false
        },
        {
          "field": "fulfillable_quantity",
          "displayName": "fulfillable_quantity",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "total_discount",
          "displayName": "total_discount",
          "autocomplete": false,
          "type": "double"
        },
        {
          "field": "fulfillment_status",
          "displayName": "fulfillment_status",
          "autocomplete": false,
          "type": "string"
        }
      ],
      "primaryKey": "id",
      "categories": ["Shopify"],
      "description": "Shopify Order Line Items"
    },
    datasetOrderLineItemId:{ id: '18bf84f0-022f-43ee-a03c-80916e63b7e3' },
    datasetOrderLineItemProperties:{
      "name": "OrderLineItemsProperties",
      "fields": [
        {
          "field": "name",
          "displayName": "name",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "value",
          "displayName": "value",
          "autocomplete": false,
          "type": "string"
        }
      ],
      "primaryKey": "name",
      "categories": ["Shopify"],
      "description": "Shopify Order Line Item Properties"
    },
    datasetOrderLineItemPropertiesId:{ id: 'ec8968f2-5233-4289-9eab-604ea8d21171' },
    datasetOrderShippingLine:{
      "name": "OrderShippingLine",
      "fields": [
        {
          "field": "id",
          "displayName": "id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "title",
          "displayName": "title",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "price",
          "displayName": "price",
          "autocomplete": false,
          "type": "double"
        },
        {
          "field": "code",
          "displayName": "code",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "source",
          "displayName": "source",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "phone",
          "displayName": "phone",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "requested_fulfillment_service_id",
          "displayName": "requested_fulfillment_service_id",
          "autocomplete": false,
          "type": "integer"
        },
        {
          "field": "delivery_category",
          "displayName": "delivery_category",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "carrier_identifier",
          "displayName": "carrier_identifier",
          "autocomplete": false,
          "type": "string"
        }
      ],
      "primaryKey": "id",
      "categories": ["Shopify"],
      "description": "Shopify Order Shipping Line"
    },
    datasetOrderShippingLineId:{ id: '7cfdaf20-42a9-4d45-a08d-df52e22e4d1c' },
    datasetOrderFulfillment:{
      "name": "OrderFulfillment",
      "fields": [
        {
          "field": "id",
          "displayName": "id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "order_id",
          "displayName": "order_id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "status",
          "displayName": "status",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "created_at",
          "displayName": "created_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "service",
          "displayName": "service",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "updated_at",
          "displayName": "updated_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "tracking_company",
          "displayName": "tracking_company",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "shipment_status",
          "displayName": "shipment_status",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "tracking_number",
          "displayName": "tracking_number",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "tracking_url",
          "displayName": "tracking_url",
          "autocomplete": false,
          "type": "string"
        }
      ],
      "primaryKey": "id",
      "categories": ["Shopify"],
      "description": "Shopify Order Fulfillment"
    },
    datasetOrderFulfillmentId:{ id: '42d1b367-ea05-4cf5-954e-5bc771393b3a' },
    datasetOrderRefunds:{
      "name": "OrderRefunds",
      "fields": [
        {
          "field": "id",
          "displayName": "id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "order_id",
          "displayName": "order_id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "created_at",
          "displayName": "created_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "note",
          "displayName": "note",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "restock",
          "displayName": "restock",
          "autocomplete": false,
          "type": "boolean",
          "default": false
        },
        {
          "field": "user_id",
          "displayName": "user_id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "processed_at",
          "displayName": "processed_at",
          "autocomplete": false,
          "type": "datetime"
        }
      ],
      "primaryKey": "id",
      "categories": ["Shopify"],
      "description": "Shopify Order Refunds"
    },
    datasetOrderRefundsId:{ id: 'c0baeca9-e2c3-4c96-a2d2-e1a60404540c' },
    datasetOrderRefundsLineItem:{
      "name": "OrderRefundsLineItems",
      "fields": [
        {
          "field": "id",
          "displayName": "id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "quantity",
          "displayName": "quantity",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "line_item_id",
          "displayName": "line_item_id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "subtotal",
          "displayName": "subtotal",
          "autocomplete": false,
          "type": "double"
        },
        {
          "field": "total_tax",
          "displayName": "total_tax",
          "autocomplete": false,
          "type": "double"
        }
      ],
      "primaryKey": "id",
      "categories": ["Shopify"],
      "description": "Shopify Order Refunds Line Items"
    },
    datasetOrderRefundsLineItemId:{ id: 'c43dfd56-546b-4601-bf5c-607c8b4f84c9' },
    datasetOrderRefundsTransaction:{
      "name": "OrderRefundsTransaction",
      "fields": [
        {
          "field": "id",
          "displayName": "id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "order_id",
          "displayName": "order_id",
          "autocomplete": false,
          "type": "integer",
          "default": 0
        },
        {
          "field": "amount",
          "displayName": "amount",
          "autocomplete": false,
          "type": "double"
        },
        {
          "field": "kind",
          "displayName": "kind",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "gateway",
          "displayName": "gateway",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "status",
          "displayName": "status",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "message",
          "displayName": "message",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "created_at",
          "displayName": "created_at",
          "autocomplete": false,
          "type": "datetime"
        },
        {
          "field": "test",
          "displayName": "test",
          "autocomplete": false,
          "type": "boolean",
          "default": false
        },
        {
          "field": "authorization",
          "displayName": "authorization",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "currency",
          "displayName": "currency",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "location_id",
          "displayName": "location_id",
          "autocomplete": false,
          "type": "integer"
        },
        {
          "field": "user_id",
          "displayName": "user_id",
          "autocomplete": false,
          "type": "integer"
        },
        {
          "field": "parent_id",
          "displayName": "parent_id",
          "autocomplete": false,
          "type": "integer"
        },
        {
          "field": "device_id",
          "displayName": "device_id",
          "autocomplete": false,
          "type": "integer"
        },
        {
          "field": "error_code",
          "displayName": "error_code",
          "autocomplete": false,
          "type": "string"
        },
        {
          "field": "source_name",
          "displayName": "source_name",
          "autocomplete": false,
          "type": "string"
        }
      ],
      "primaryKey": "id",
      "categories": ["Shopify"],
      "description": "Shopify Order Refunds Transaction"
    },
    datasetOrderRefundsTransactionId:{ id: '3679d640-4e92-4762-b44e-30d23587db3b' }
};