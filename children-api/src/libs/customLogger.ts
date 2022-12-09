import { Logger } from "tslog";

export const log: Logger<unknown> = new Logger({ 
    name: "MainLogger", 
    type: "json",
    maskValuesOfKeys: ["test", "authorization", "password"],
});