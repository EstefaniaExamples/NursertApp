"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/meals/eat.ts
var eat_exports = {};
__export(eat_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(eat_exports);

// src/util.ts
var simpleHttpResponse = (body, status = 200, headers = { "Content-Type": "application/json" }) => ({
  statusCode: status,
  body: JSON.stringify(body, null, 2),
  headers
});

// src/meals/eat.ts
var eat = async (event) => {
  console.log("INFO: Starting meals handler");
  return simpleHttpResponse(
    {
      message: "Welcome to the meals function",
      input: event
    },
    200
  );
};
var handler = async (event) => eat(event).catch(
  (err) => simpleHttpResponse(
    {
      error: "An error has occurred",
      message: err.message
    },
    500
  )
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=eat.js.map
