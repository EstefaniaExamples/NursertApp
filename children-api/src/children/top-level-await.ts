export async function main() {  
    const value = await Promise.resolve('Hey there');
    console.log('inside: ' + value);
    return value;
}