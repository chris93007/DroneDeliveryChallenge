var scheduler = require("./scheduler.js");
var fileOps = require("./fileOperations");
var scheduler = require("./scheduler");


/*
    1. Take input from console
    2. Check if the input is a valid file path
    3. Check if file exists
    4. Process file
*/

function main() {
    // fileOps.getFileFromCLI()
    // .then(fileOps.processFile)
    // .then(scheduler.droneSchedule)
    // .then(fileOps.generateOutputFile)
    // .then(()=>{
    //     process.exit();
    // });
    fileOps.processFile("C:\Users/\chris93007/\Documents/\GitHub/\DroneDeliveryChallenge/\input.txt")
    .then(scheduler.droneSchedule)
    .then(fileOps.generateOutputFile)
    .then(()=>{
        process.exit();
    });
}
main();
