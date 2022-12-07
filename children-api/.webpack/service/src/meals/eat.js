/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
/*!**************************!*\
  !*** ./src/meals/eat.ts ***!
  \**************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handler = void 0;
const util_1 = __webpack_require__(/*! @libs/util */ "./src/libs/util.ts");
const eat = async (event) => {
    console.log('INFO: Starting meals handler');
    return (0, util_1.formatJSONResponse)({
        message: 'Welcome to the meals function',
        input: event,
    }, 200);
};
const handler = async (event) => eat(event).catch((err) => (0, util_1.formatJSONResponse)({
    error: 'An error has occurred',
    message: err.message,
}, 500));
exports.handler = handler;

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=eat.js.map