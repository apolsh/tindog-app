export function getDefaultDateString(dateToConvert){
    const date = (new Date(dateToConvert));
    let month = date.getUTCMonth() + 1; //months from 1-12
    let day = date.getUTCDate();
    let year = date.getUTCFullYear();

    day = day < 10 ? "0" + day.toString() : day;
    month = month < 10 ? "0" + month.toString() : month;

    return `${day}.${month}.${year}`;
}