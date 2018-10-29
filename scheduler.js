var asyncMod = require("async");
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
        asyncMod.waterfall([asyncMod.apply(recursivelyCheckList, arr.orderList)], function (err, results) {
            var nps = utils.calculateNPS(data, totalOrders);
            resolve({
                finalList: results,
                nps: nps
            });
        })

    });
    return promise;
}

recursivelyCheckList = (sortedArray, callback) => {
    if (sortedArray.length) {
        asyncMod.mapValues(sortedArray, findNextOrder.bind(null, sortedArray.length), function (results, err) {
            if (results.markDone) {
                //remove that element from sorted array
                var index = sortedArray.indexOf(results.org);
                if (index > -1) {
                    sortedArray.splice(index, 1);
                }
                scheduleList.push(results.markDone);
            } else if (results.notFound) {
                //update currentTime and start recursive again
                currentTime = sortedArray[0].orderTime;
            }
            recursivelyCheckList(sortedArray, callback);

        });
    } else {
        // console.log('done')
        callback(null, scheduleList);
    }
}


findNextOrder = (size, order, key, callback) => {

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
        //if element is last in the list
        if (key == (size - 1)) {
            //couldn't find an element with order time before current time
            callback({
                notFound: true
            });

        }
        //if element is not last in the list
        else {
            callback();
        }
    }
}