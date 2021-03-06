import moment from 'moment'
export const enumerateDaysBetweenDates = (startDate, endDate)=> {
    var dates = [];

    var currDate = moment(startDate).startOf('day');
    var lastDate = moment(endDate).startOf('day');

    while(currDate.add(1, 'days').diff(lastDate) < 0) {
        dates.push(currDate.clone().toDate());
    }
    return dates;
};

export function utcToLocalDateString(utcDate){
    return moment(moment.utc(utcDate).toDate()).format('YYYY-MM-DD HH:mm:ss').toString()
}