
/**
 * 
 * @param {number[][]} grid 
 * @returns {string}
 */
function shortestGridPath(grid) {
    let paths = [{
        x: 0,
        y: 0,
        path: ""
    }]

    const h = grid.length - 1
    const w = grid[0].length - 1

    while (paths.length > 0) {
        const p = paths.shift();
        const x = p.x;
        const y = p.y;
        if (x == w && y == h) {
            return p.path;
        }
        grid[y][x] = 1;

        if (y < h && grid[y + 1][x] == 0) {
            paths.push({
                x: x,
                y: y + 1,
                path: p.path + "D"
            })
        }
        if (x < w && grid[y][x + 1] == 0) {
            paths.push({
                x: x + 1,
                y: y,
                path: p.path + "R"
            })
        }
        if (y > 0 && grid[y - 1][x] == 0) {
            paths.push({
                x: x,
                y: y - 1,
                path: p.path + "U"
            })
        }
        if (x > 0 && grid[y][x - 1] == 0) {
            paths.push({
                x: x - 1,
                y: y,
                path: p.path + "L"
            })
        }
    }
    return ""
}

export {
    shortestGridPath
}