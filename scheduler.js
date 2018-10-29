var async = require("async");
var utils = require("./utils");

var exports = module.exports = {};

exports.droneSchedule = function (arr) {
    var promise = new Promise(function (resolve, reject) {
        console.log(`Building Drone Schedule...`);
        arr.orderList.sort(function (a, b) {
            return a["distanceFromWarehouse"] - b["distanceFromWarehouse"] || a["orderTime"] - b["orderTime"];
        });

        async.waterfall([async.apply(recursivelyCheckList, arr.orderList)], function (err, results) {
            console.log(`results`, results);
            resolve();
        })

    });
    return promise;
}

recursivelyCheckList = (sortedArray, callback) => {
    if (sortedArray.length) {
        console.log(sortedArray.length);
        sortedArray.shift();
        recursivelyCheckList(sortedArray, callback);

    }
    else {
        console.log('done')
        callback(null, []);
    }

}

