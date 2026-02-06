

/**
 * 
 * @param {number[][]} input 
 * @returns {number}
 */
function triangleMinPathSum(input) {
    function dfs(x,y,sum){
        if(y >= input.length-1){
            return sum + input[y][x];
        }
        const left = dfs(x,y+1,sum + input[y][x]);
        const right = dfs(x+1,y+1,sum + input[y][x]);
        return Math.min(left,right);
    }
    return dfs(0,0,0);
}
export {
    triangleMinPathSum
}
