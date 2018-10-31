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
const maxTime = moment().set({
    'hour': 22,
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
        console.log(`Building Drone Schedule...`,'\n');
        
        arr.orderList.sort(function (a, b) {
            return a["distanceFromWarehouse"] - b["distanceFromWarehouse"] || a["orderTime"] - b["orderTime"];
        });
        totalOrders = arr.orderList.length;
        asyncMod.waterfall([asyncMod.apply(recursivelyCheckList, arr.orderList)], function (err, results) {
            var nps = utils.calculateNPS(data, totalOrders);
            console.log('\n',`NPS : ${nps}`,'\n',data,'\n', `total : ${totalOrders}`,'\n')
            resolve({
                finalList: results,
                nps: nps
            });
        })

    });
    return promise;
}

recursivelyCheckList = (sortedArray, callback) => {
    if (sortedArray.length && currentTime <= maxTime) {
        asyncMod.mapValues(sortedArray, findNextOrder.bind(null, sortedArray.length), function (results, err) {
            //an order was selected->add to schedule
            if (results.markDone) {
                //remove that element from sorted array
                var index = sortedArray.indexOf(results.org);
                if (index > -1) {
                    sortedArray.splice(index, 1);
                }
                scheduleList.push(results.markDone);
            } 
            //couldn't find an order-> fastforward time
            else if (results.notFound) {
                //update currentTime and start recursive again
                var temp = sortedArray.sort(function (a, b) {
                    return a["orderTime"] - b["orderTime"];
                });
                currentTime = moment(JSON.parse(JSON.stringify(temp[0].orderTime)));
                delete temp;
            }
            recursivelyCheckList(sortedArray, callback);

        });
    } 
    //all orders done OR time is up
    else {
        callback(null, scheduleList);
    }
}


findNextOrder = (size, order, key, callback) => {
    if (order.orderTime <= currentTime) {
        //check if location is valid
        if (order.distanceFromWarehouse > 0) {
            //select for delivery;    
            var deliverTo = {
                location: order.id,
                departureTime: currentTime.format("HH:mm:ss")
            };
            //deliver order
            currentTime = utils.findNewCurrentTime(currentTime, order.distanceFromWarehouse);
            //update counts based on order time and arrival time of order
            data = utils.updateCounts(data, order.orderTime, currentTime);

            /*return to warehouse
            update current time based on current time and distance*/
            currentTime = utils.findNewCurrentTime(currentTime, order.distanceFromWarehouse);

        }
        //exit this loop with result object OR [] and index of completed order
        callback({
            markDone: deliverTo || [],
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
        //if element is not last in the list, check same list again
        else {
            callback();
        }
    }
}