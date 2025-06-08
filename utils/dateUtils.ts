export const getWeekIdentifier = (date: Date): string => {
    const d = new Date(date.getTime());
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const year = d.getFullYear();
    const week1 = new Date(year, 0, 4);
    const weekNumber =
        1 +
        Math.round(
            ((d.getTime() - week1.getTime()) / 86400000 -
                3 +
                ((week1.getDay() + 6) % 7)) /
                7
        );
    return `${year}-W${String(weekNumber).padStart(2, "0")}`;
};

export const formatDateToCompare = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const formatIsoDate = (isoDateString: string) => {
    const dateObj = new Date(isoDateString);
    const year = dateObj.getUTCFullYear();
    const month = dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDate();
    const formattedMonth = String(month).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    return `${formattedMonth}/${formattedDay}/${year}`;
};

export const formatAverageTime = (hours: number): string => {
    if (!hours || hours <= 0) {
        return "N/A";
    }
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);

    let result = "";
    if (h > 0) {
        result += `${h}h `;
    }
    if (m > 0) {
        result += `${m}min`;
    }
    return result.trim() || "< 1min";
};
