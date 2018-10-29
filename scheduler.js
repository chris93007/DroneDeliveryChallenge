var exports = module.exports = {};

exports.droneSchedule=function(arr){
    var promise = new Promise(function (resolve, reject) {
    //  console.log(`Building Drone Schedule...`,arr.orderList,arr.totalOrders);
     console.log(`Building Drone Schedule...`);
     resolve(arr);
    });
    return promise;
}