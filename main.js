var scheduler = require("./scheduler.js");
var fileOps = require("./fileOperations");


/*
    1. Take input from console
    2. Check if the input is a valid file path
    3. Check if file exists
    4. Process file
*/

function main() {
    fileOps.getFileFromCLI()
    .then(fileOps.processFile)
    .then(fileOps.generateOutputFile)
    .then(()=>{
        process.exit();
    })
}
main();
