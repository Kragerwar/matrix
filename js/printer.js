import {groupBy} from "../js/utils.js";
//import {calculatePercent} from "./calculator";

export const generateHtmlTable = (cells, rowSum, averages) => {
    const rows = groupBy(Object.values(cells), 'rowPosition');

    const cols = Object.values(rows[0]).length;

    const ths = [];
    const avgTds = [];
    const sumTds = [];

    ths.unshift('<th></th>');

    for (let i = 0; i < cols; i++) {
        ths.push(`<th>Col ${i + 1}</th>`);
    }

    ths.push(`<th style="color: #3CB371;">Sum</th>`);

    rowSum.map((sum) => {
        sumTds.push(`<td class="sum" style="color: #3CB371; text-decoration: none; ">${sum}</td>`);
    });

    const thead = `<thead>${ths.join('\n')}</thead>`;

    const trs = Object.entries(rows).map(([rowId, row]) => {
        const tds = Object.values(row).map(cell => {

            const className = cell.isHighlighted
                ? 'highlighted-cell'
                : 'normal-cell';

                let value = window.hovered == rowId ? cell.percentage + " %" : cell.number;

            return `<td class="data ${className}"
                data-row-id="${cell.rowPosition}"
                data-col-id="${cell.colPosition}"
                data-id="${cell.id}"
                data-highlighted="${className}"
            > ${value}</td>`;
        });

        tds.unshift(`<td>Row ${+rowId + 1}</td>`);

        tds.push(sumTds[rowId]);

        return `<tr>${tds.join('')}</tr>`;
    }).join('\n');

    avgTds.unshift(`<td style="color: #3CB371">Averages</td>`);
    averages.map((avg) => {
        avgTds.push(`<td style="color: #3CB371; border-right: 1px solid #CAD4D6; text-decoration: none;">${avg}</td>`)
    });

    return `<table class="table">${thead}${trs}${avgTds.join('\n')}</table>`;
};
