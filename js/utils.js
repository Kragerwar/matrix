export function groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

// let size = 10;
//
// let board = "";
//
// for (let y = 0; y < size; y++) {
//     for (let x = 0; x < size; x++) {
//         if ((x + y) % 2 == 0)
//             board += " ";
//         else
//             board += "#";
//
//     }
//     board += "\n";
// }