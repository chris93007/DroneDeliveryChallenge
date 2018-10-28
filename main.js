const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
var fs = require('fs');
var scheduler = require("./scheduler.js");
var fileOps = require("./fileOperations");


/*
    1. Take input from console
    2. Check if the input is a valid file path
    3. Check if file exists
    4. Process file
*/
console.log('Please provide complete path to the input file');
rl.setPrompt('Enter Path > ');
rl.prompt();
rl.on('line', function (path) {
    if (!path.length) {
        console.log(`Please provide a path`);
        rl.prompt();
    }
    else if (/^[a-zA-Z]:\\(\w+\\)*\w*.txt$/.test(path)) {
        fs.exists(path, function (exists) {
            if (exists) {
                rl.close();
                fileOps.processFile(path);
            }
            else {
                console.log(`Sorry, the file doesn't exist. Please check the file path and try again.`);
                rl.prompt();
            }
        });

    }
    else {
        console.log(`Please provide a valid path to a .txt file`);
        rl.prompt();
    }
});
