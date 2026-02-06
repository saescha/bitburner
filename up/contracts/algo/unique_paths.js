
/**
 * 
 * @param {number[][]} grid 
 * @returns {number}
 */
function uniqueGridPaths(grid){
    let paths=[{
        x:0,
        y:0
    }]
    let result = 0;

    const h = grid.length -1
    const w = grid[0].length-1

    while(paths.length>0){
        const p = paths.shift();
        const x = p.x;
        const y = p.y;
        if(x==w &&y==h){
            result++;
            continue;
        }
        
        if(y<h && grid[y+1][x] ==0){
            paths.push({
                x:x,
                y:y+1
            })
        }
        if(x<w && grid[y][x+1] ==0){
            paths.push({
                x:x+1,
                y:y
            })
        }

    }
    return result;
}

function createGrid([rows, cols], fillValue = 0) {
    const grid = [];
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            row.push(fillValue);
        }
        grid.push(row);
    }
    return grid;
}

export {uniqueGridPaths,createGrid}