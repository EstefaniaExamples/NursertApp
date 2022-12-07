/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/libs/baseError.ts":
/*!*******************************!*\
  !*** ./src/libs/baseError.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.APIError = exports.HttpStatusCode = void 0;
var HttpStatusCode;
(function (HttpStatusCode) {
    HttpStatusCode[HttpStatusCode["OK"] = 200] = "OK";
    HttpStatusCode[HttpStatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatusCode[HttpStatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatusCode[HttpStatusCode["INTERNAL_SERVER"] = 500] = "INTERNAL_SERVER";
})(HttpStatusCode = exports.HttpStatusCode || (exports.HttpStatusCode = {}));
class BaseError extends Error {
    constructor(name, httpCode, description, isOperational) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
        this.httpCode = httpCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this);
    }
}
class APIError extends BaseError {
    constructor(name, httpCode = HttpStatusCode.INTERNAL_SERVER, description = 'internal server error', isOperational = true) {
        super(name, httpCode, description, isOperational);
    }
}
exports.APIError = APIError;


/***/ }),

/***/ "./src/libs/dynamodb.ts":
/*!******************************!*\
  !*** ./src/libs/dynamodb.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ddbDocClient = exports.ddbClient = void 0;
const lib_dynamodb_1 = __webpack_require__(/*! @aws-sdk/lib-dynamodb */ "@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = __webpack_require__(/*! @aws-sdk/client-dynamodb */ "@aws-sdk/client-dynamodb");
const REGION = 'eu-west-2';
function getDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.info('Setting the configuration to use the localhost database');
        return new client_dynamodb_1.DynamoDBClient({
            region: 'localhost',
            endpoint: 'http://localhost:5001',
        });
    }
    console.info('Setting the configuration to use the AWS database');
    return new client_dynamodb_1.DynamoDBClient({ region: REGION });
}
exports.ddbClient = getDynamoDBClient();
const marshallOptions = {
    convertEmptyValues: false,
    removeUndefinedValues: false,
    convertClassInstanceToMap: true,
};
const unmarshallOptions = {
    wrapNumbers: false,
};
const translateConfig = { marshallOptions, unmarshallOptions };
exports.ddbDocClient = lib_dynamodb_1.DynamoDBDocumentClient.from(exports.ddbClient, translateConfig);


/***/ }),

/***/ "./src/libs/repository.ts":
/*!********************************!*\
  !*** ./src/libs/repository.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.saveChildren = exports.deleteChildrenById = exports.getChildrenById = exports.getAllChildren = void 0;
const lib_dynamodb_1 = __webpack_require__(/*! @aws-sdk/lib-dynamodb */ "@aws-sdk/lib-dynamodb");
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
const baseError_1 = __webpack_require__(/*! ./baseError */ "./src/libs/baseError.ts");
const dynamodb_1 = __webpack_require__(/*! ./dynamodb */ "./src/libs/dynamodb.ts");
async function getAllChildren() {
    const { Items } = await dynamodb_1.ddbDocClient.send(new lib_dynamodb_1.ScanCommand({
        TableName: 'children-api-dev',
        ConsistentRead: true,
    }));
    if (Items === undefined) {
        return [];
    }
    else {
        return Items;
    }
}
exports.getAllChildren = getAllChildren;
async function getChildrenById(id) {
    const { Item } = await dynamodb_1.ddbDocClient.send(new lib_dynamodb_1.GetCommand({
        TableName: 'children-api-dev',
        Key: { KidId: id },
    }));
    if (Item == undefined) {
        throw new baseError_1.APIError('NOT FOUND', baseError_1.HttpStatusCode.NOT_FOUND, `Item with id ${id} not found`, true);
    }
    return Item;
}
exports.getChildrenById = getChildrenById;
async function deleteChildrenById(id) {
    await getChildrenById(id);
    await dynamodb_1.ddbDocClient.send(new lib_dynamodb_1.DeleteCommand({
        TableName: 'children-api-dev',
        Key: {
            KidId: id,
        },
    }));
}
exports.deleteChildrenById = deleteChildrenById;
async function saveChildren(item) {
    await dynamodb_1.ddbDocClient.send(new lib_dynamodb_1.PutCommand({
        TableName: 'children-api-dev',
        Item: {
            ...item,
            KidId: (0, uuid_1.v4)(),
        },
    }));
}
exports.saveChildren = saveChildren;


/***/ }),

/***/ "./src/libs/util.ts":
/*!**************************!*\
  !*** ./src/libs/util.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.formatJSONResponse = void 0;
const formatJSONResponse = (response, statusCode = 200, headers = { 'Content-Type': 'application/json' }) => {
    return {
        statusCode,
        body: JSON.stringify(response),
        headers,
    };
};
exports.formatJSONResponse = formatJSONResponse;


/***/ }),

/***/ "@aws-sdk/client-dynamodb":
/*!*******************************************!*\
  !*** external "@aws-sdk/client-dynamodb" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = require("@aws-sdk/client-dynamodb");

/***/ }),

/***/ "@aws-sdk/lib-dynamodb":
/*!****************************************!*\
  !*** external "@aws-sdk/lib-dynamodb" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("@aws-sdk/lib-dynamodb");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("uuid");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!************************************!*\
  !*** ./src/children/deleteById.ts ***!
  \************************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handler = void 0;
const repository_1 = __webpack_require__(/*! @libs/repository */ "./src/libs/repository.ts");
const util_1 = __webpack_require__(/*! @libs/util */ "./src/libs/util.ts");
const deleteItem = async (event) => {
    console.info('Starting delete children handler');
    if (event.pathParameters && event.pathParameters.id) {
        try {
            await (0, repository_1.deleteChildrenById)(event.pathParameters?.['id'] || '');
            return (0, util_1.formatJSONResponse)({ message: 'Item successfuly deleted' });
        }
        catch (err) {
            console.error(err);
            if (err.message.includes('not found')) {
                return (0, util_1.formatJSONResponse)({ message: err.message }, 404);
            }
            else {
                return (0, util_1.formatJSONResponse)({ message: err.message }, 500);
            }
        }
    }
    else {
        return (0, util_1.formatJSONResponse)({ message: 'Error in the path params, `id` is expected' }, 400);
    }
};
const handler = async (event) => deleteItem(event);
exports.handler = handler;

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=deleteById.js.map