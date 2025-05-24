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
