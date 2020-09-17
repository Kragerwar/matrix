import {generateHtmlTable} from '../js/printer.js';
import {calculateSums, calculateAverages, calculatePercentages} from '../js/calculator.js';
import {groupBy} from "./utils.js";

let matrix = {};

let data = {
    rows: 6,
    cols: 4,
};

for (let rowIterator = 0; rowIterator < data.rows; rowIterator++) {
    for (let colIterator = 0; colIterator < data.cols; colIterator++) {
        if (false === matrix.hasOwnProperty(rowIterator)) {
            matrix[rowIterator] = {};
        }

        const id = uuidv4();
        const number = generateRandomNumber(100, 500);

        matrix[rowIterator][id] = {
            id: id,
            number: number,
            rowPosition: rowIterator,
            colPosition: colIterator,
            isHighlighted: false,
            percentage: 0,
            //isHighlighted: number % 2 ? true : false,
        }
    }
}

window.cells = Object.values(matrix).map(row => Object.values(row)).flat().reduce((obj, item) => {
    obj[item.id] = item;
    return obj;
}, {});

function renderTableHtml() {
    const sums = calculateSums(cells);
    const averages = calculateAverages(data, cells);
    const percentages = calculatePercentages(cells);

    const html = generateHtmlTable(cells, sums, averages);


    renderTable(html);
}

renderTableHtml();

function renderTable(html) {

    document.getElementsByClassName('table_wrapper')[0].innerHTML = html;

    const clickHandler = (e) => {
        const id = e.target.dataset.id;
        cells[id].number = cells[id].number + 1;

        renderTableHtml();
    };

    const onMouseEnterHandler = (e) => {
        const number = e.target.innerHTML;

        const cellsToPrint = Object.values(cells).sort((a, b) => {
            return a.number - b.number;

            // if (a.number < b.number) {
            //     return -1;
            // }
            // if (a.number > b.number) {
            //     return 1;
            // }
            //
            // return 0;
        });
        const closestCells = printKclosest(cellsToPrint, number, 3, n);

        Object.keys(window.cells || {}).map(id => {
            window.cells[id].isHighlighted = false;
        });

        closestCells.map(({id}) => {
            window.cells[id].isHighlighted = true
        });

        renderTableHtml();
    };

    const onMouseLeaveHandler = () => {
        //const id = e.target.innerText;
        //console.log(id + 'leave');

        Object.values(window.cells).map(cell => {
            cell.isHighlighted = false
        });

        renderTableHtml();
    };

    const findPercentHandlerLeave = (e, rowId) => {

        if(window.hovered === rowId) {
            window.hovered = -1;
        }

        renderTableHtml();
    };

    const findPercentHandlerEnter = (e, rowId) => {

        if(window.hovered !== rowId)  {
            window.hovered = rowId;
        }

        renderTableHtml();
    };

    console.log('render');
    const cellNodes = document.getElementsByClassName('data');
    const cellSum = document.getElementsByClassName('sum');

    // const unmount = node => () => {
    //     console.log('unmount');
    //     node.removeEventListener('mousedown', clickHandler);
    //     node.removeEventListener('mouseenter', onMouseEnterHandler);
    //     node.removeEventListener('mouseleave', onMouseLeaveHandler);
    // }

    for (let i = 0; i < cellNodes.length; i++) {
        // cellNodes[i].addEventListener('destruct', unmount(cellNodes[i]));
        cellNodes[i].addEventListener('mousedown', clickHandler);
        cellNodes[i].addEventListener('mouseenter', onMouseEnterHandler);
        cellNodes[i].addEventListener('mouseleave', onMouseLeaveHandler);
    }
    for (let i = 0; i < cellSum.length; i++) {
        cellSum[i].addEventListener("mouseenter", (e) => findPercentHandlerEnter(e, i));
        cellSum[i].addEventListener("mouseleave", (e) => findPercentHandlerLeave(e, i));
    }

}

function findCrossOver(cells, low, high, value) {

    if (cells[high].number <= value) {
        return high;
    }
    if (cells[low].number > value) {
        return low;
    }

    let mid = Math.ceil((low + high) / 2);

    if (cells[mid].number <= value && cells[mid + 1].number > value) {
        return mid;
    }

    if (cells[mid].number < value) {
        return findCrossOver(cells, mid + 1, high, value);
    }

    return findCrossOver(cells, low, mid - 1, value);
}

function printKclosest(cells, value, k, n) {
    const closest = [];

    let l = findCrossOver(cells, 0, n - 1, value);
    let r = l + 1;
    let count = 0;

    if (cells[l].number === value) l--;

    while (l >= 0 && r < n && count < k) {
        if (value - cells[l].number < cells[r].number - value) {
            let x = cells[l--];
            //console.log(x.id);

            closest.push(x);
        }
        else {
            let x = cells[r++];

            //console.log(x.id);

            closest.push(x);
        }
        count++;
    }

    while (count < k && l >= 0) {
        let x = cells[l--];

        //console.log(x.id);
        closest.push(x);

        count++;
    }

    while (count < k && r < n) {
        let x = cells[r++];

        // console.log(x.number);

        count++;

        closest.push(x);

    }

    return closest;
}

let n = Object.keys(cells).length;

let value = Object.values(cells)[5].number;
printKclosest(Object.values(cells).sort((a, b) => {
    if (a.number < b.number) {
        return -1;
    }
    if (a.number > b.number) {
        return 1;
    }

    return 0;
}), value, 4, n);

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

}

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * max) + min;
}
