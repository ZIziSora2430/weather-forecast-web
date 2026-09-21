export const formatDate = (min, indexMonth, indexDay, dd) => {


    const minF = String(min).padStart(2, "0");
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const shortMonth = months[indexMonth];
    const ddF = String(dd).padStart(2, "0");
    const shortDay = days[indexDay];

    return { minF, shortMonth, shortDay, ddF };

}