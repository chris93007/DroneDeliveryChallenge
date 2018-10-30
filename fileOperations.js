var fs = require('fs');
var path = require('path');
const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
var utils = require("./utils");


var exports = module.exports = {};

var arr1 = [
    [1373628934214, 3],
    [137360000028934218, 3],
    [1373628934220, 1],
    [1373628934230, 1],
    [1373628934234, 0],
    [1373628934237, -1],
    [1373628934242, 0],
    [1373628934246, -1],
    [1373628934251, 0],
    [1373628934266, 11]
];


exports.getFileFromCLI = function () {
    var promise = new Promise(function (resolve, reject) {
        console.log('Please provide complete path to the input file');
        rl.setPrompt('Enter Path > ');
        rl.prompt();
        rl.on('line', function (path) {
            if (!path.length) {
                console.log(`Please provide a path`);
                rl.prompt();
            } else if (/^[a-zA-Z]:\\(\w+\\)*\w*.txt$/.test(path)) {
                fs.exists(path, function (exists) {
                    if (exists) {
                        rl.close();
                        resolve(path);
                    } else {
                        console.log(`Sorry, the file doesn't exist. Please check the file path and try again.`);
                        rl.prompt();
                    }
                });
            } else {
                console.log(`Please provide a valid path to a .txt file`);
                rl.prompt();
            }
        });
    });
    return promise;
};


exports.processFile = function (path) {

    var promise = new Promise(function (resolve, reject) {
        console.log(`Processing file...`);
        var ordersArr = [];
        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream(path)
        });

        lineReader.on('line', function (line) {
                ordersArr.push({
                    id: line.split(" ")[0],
                    location: line.split(" ")[1],
                    orderTime: utils.convertStringToDatetime(line.split(" ")[2]),
                    distanceFromWarehouse: utils.findDistance(line.split(" ")[1])
                });
            })
            .on('close', function () {
                resolve({
                    orderList: ordersArr,
                    totalOrders: ordersArr.length
                });
            });
    });
    return promise;
};

exports.generateOutputFile = function (result) {
    var promise = new Promise(function (resolve, reject) {
        console.log(`Generating output file...`);
        var outpath = 'outputs\\output.txt';
        if (ensureDirectoryExistence(outpath)) {
            //open stream
            var file = fs.createWriteStream(outpath);
            //write into file
            result.finalList.forEach(function (v) {
                if(Object.keys(v).length)
                file.write(`${v.location}\t${v.departureTime} \n`)
            });
            file.write(`NPS ${result.nps}`);
        }
        // the finish event is emitted when all data has been flushed from the stream
        file.on('finish', () => {
            console.log(`Output file created. Location ${__dirname}\\${outpath}`);
            resolve();
        });
        file.on('error', function (err) {
            console.log(err);
        });
        //close stream
        file.end();

    });
    return promise;

};

ensureDirectoryExistence = (filePath) => {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}