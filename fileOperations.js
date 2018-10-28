var fs = require('fs');
var scheduler = require("./scheduler.js");
var exports = module.exports = {};

var arr = [[1373628934214, 3],
[13736000000000028934218, 3],
[1373628934220, 1],
[1373628934230, 1],
[1373628934234, 0],
[1373628934237, -1],
[1373628934242, 0],
[1373628934246, -1],
[1373628934251, 0],
[1373628934266, 11]];


exports.processFile = function (path) {
    var ordersArr = [];
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(path)
        // input: require('fs').createReadStream(path)
    });

    lineReader.on('line', function (line) {
        ordersArr.push({
            id: line.split(" ")[0],
            location: line.split(" ")[1],
            orderTime: line.split(" ")[2]
        });
    })
        .on('close', function () {
            scheduler.getOrderListArray(ordersArr);
        });

    this.genOutputFile();
}

exports.genOutputFile = function () {
    var file = fs.createWriteStream('output.txt');
    file.on('error', function (err) { /* error handling */ });
    arr.forEach(function (v) { file.write(v.join(', ') + '\n'); });
    file.end();
    return;
}