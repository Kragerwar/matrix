import {groupBy} from "./utils.js";

const calculateSums = (cells) => {
    const groupRow = Object.values(groupBy(Object.values(cells), 'rowPosition'));

    return groupRow.map(rowTab => rowTab.map(cell => cell.number)
        .reduce((rcc, y) => rcc + y, 0)
    );
};

const calculatePercentages = (cells) => {
    const sums = calculateSums(cells);
    const groupRow = Object.values(groupBy(Object.values(cells), 'rowPosition'));

    for (let index in groupRow) {
        let rowPer = groupRow[index];

        rowPer.map(cell => {
            cell.percentage = (cell.number * 100 / sums[index]).toFixed(2);
        })
    }
};

const calculateAverages = (data, cells) => {
    const groupCol = Object.values(groupBy(Object.values(cells), 'colPosition'));

    const cols = groupCol.map(columnTab => columnTab.map(cell => cell.number)
        .reduce((acc, x) => acc + x, 0)
    );

    return cols.map(col => (col / data.rows).toFixed());
};

export {
    calculateAverages,
    calculateSums,
    calculatePercentages,
}