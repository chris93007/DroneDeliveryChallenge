var utils = require("./utils");

var exports = module.exports = {};

exports.droneSchedule = function (arr) {
    var promise = new Promise(function (resolve, reject) {
        //  console.log(`Building Drone Schedule...`,arr.orderList,arr.totalOrders);
        console.log(`Building Drone Schedule...`);
        // arr = utils.sortJSONByTwoProps(arr);
        // console.log(arr);
        resolve();
    });
    return promise;
}