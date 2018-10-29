var async = require("async");
var moment = require('moment');

var utils = require("./utils");

var exports = module.exports = {};

var currentTime = moment().set({
    'hour': 6,
    'minute': 0,
    'second': 0,
    'millisecond': 0
});
var data = {
    promoters: 0,
    detractors: 0,
    neutrals: 0
};
var totalOrders = 0;
var scheduleList = [];


exports.droneSchedule = function (arr) {
    var promise = new Promise(function (resolve, reject) {
        console.log(`Building Drone Schedule...`);
        totalOrders = arr.orderList.length;
        arr.orderList.sort(function (a, b) {
            return a["distanceFromWarehouse"] - b["distanceFromWarehouse"] || a["orderTime"] - b["orderTime"];
        });
        async.waterfall([async.apply(recursivelyCheckList, arr.orderList)], function (err, results) {
            var nps= utils.calculateNPS(data, totalOrders);
            console.log(`waterfall results`, '\n', results, '\n', nps);
            resolve();
        })
    });
    return promise;
}

recursivelyCheckList = (sortedArray, callback) => {
    // console.log('recursive function called....')
    if (sortedArray.length) {
        async.eachSeries(sortedArray, findNextOrder, function (results, err) {
            // console.log(`eachSeries results`, results)
            //remove that element from sorted array
            var index = sortedArray.indexOf(results.org);
            if (index > -1) {
                sortedArray.splice(index, 1);
            }
            scheduleList.push(results.markDone);
            recursivelyCheckList(sortedArray, callback);

        });
    } else {
        // console.log('done')
        callback(null, scheduleList);
    }
}

findNextOrder = (order, callback) => {
    if (order.orderTime <= currentTime) {
        var deliverTo = {
            location: order.id,
            departureTime: currentTime.format("HH:mm:ss")
        };
        //update counts based on order time and departure time of order
        data = utils.updateCounts(data, order.orderTime, currentTime);
        //update current time based on current time and distance
        currentTime = utils.findNewCurrentTime(currentTime, order.distanceFromWarehouse);
        //exit this loop with result object and index of completed order
        callback({
            markDone: deliverTo,
            org: order
        });
    } else {
        console.log('else block')
        callback();
    }
}