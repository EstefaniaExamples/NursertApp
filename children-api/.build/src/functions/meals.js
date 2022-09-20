import middy from '@middy/core';
const mealsFunction = async (event) => {
    console.log("INFO: Starting meals handler");
    try {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Welcome to the meals function',
                input: event,
            }, null, 2),
        };
    }
    catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'An error has ocurred',
                message: err,
            }, null, 2),
        };
    }
};
export const handler = middy(mealsFunction);
//# sourceMappingURL=meals.js.map