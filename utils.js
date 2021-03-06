var moment = require('moment');

var exports = module.exports = {};

exports.findDistance = (coords) => {
    var dist = 0;
    var numbers = coords.match(/\d+/g).map(Number);
    dist = Math.sqrt(Math.pow(numbers[0], 2) + Math.pow(numbers[1], 2));
    return Math.round(dist * 100) / 100;
}

exports.convertStringToDatetime = (string) => {
    var hours = string.split(':')[0];
    var mins = string.split(':')[1];
    var secs = string.split(':')[2];
    return moment().set({
        'hour': hours,
        'minute': mins,
        'second': secs,
        'millisecond': 0
    });
}

exports.findNewCurrentTime = (currTime, distance) => {

    return currTime.add(distance, 'minutes');
}

exports.updateCounts = (counts, orderTime, orderArrivalTime) => {
    var start = moment.utc(orderTime, "HH:mm");
    var end = moment.utc(orderArrivalTime, "HH:mm");
    // calculate the duration
    var d = end.diff(start, 'seconds');
    switch (true) {
        case (d > 0 && d < (2 * 60 * 60)): //7200
            //promoters
            counts.promoters++;
            break;
        case ((2 * 60 * 60) <= d && d < (4 * 60 * 60)): //7200-14400
            //neutrals
            counts.neutrals++;
            break;
        case d >= (4 * 60 * 60): //14400
            //detractors
            counts.detractors++;
            break;
        default:
            break;
    }
    return counts;
}

exports.calculateNPS = (counts, total) => {
    var nps=((counts.promoters / total) * 100) - ((counts.detractors / total) * 100);
    return Math.round(nps * 100) / 100;
}