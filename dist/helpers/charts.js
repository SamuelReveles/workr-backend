"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatChartData = formatChartData;
const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril",
    "Mayo", "Junio", "Julio", "Agosto",
    "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
function formatChartData(data) {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    // Construir últimos 12 meses
    const last12Months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(currentYear, currentMonth - 1 - (11 - i));
        return { month: date.getMonth() + 1, year: date.getFullYear() };
    });
    const points = last12Months.map((item, index) => {
        const found = data.find(d => d.month === item.month && d.year === item.year);
        return { x: index, y: found ? found.quantity : 0 };
    });
    const labels = last12Months.map(item => monthNames[item.month - 1]);
    return { points, labels };
}
//# sourceMappingURL=charts.js.map