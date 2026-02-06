
/**
 * 
 * @param {number[][]} input 
 */
function spiralMatrix(input) {

    /**
     * 
     * @param {number[][]} matrix 
     * @returns {number[]}
     */
    function left(matrix) {
        if (matrix.length == 0) return [];
        return matrix[0].concat(down(matrix.slice(1)));
    }
    /**
     * 
     * @param {number[][]} matrix 
     * @returns {number[]}
     */
    function down(matrix) {
        if (matrix.length == 0 || matrix[0].length == 0) return [];
        return matrix.reduce((p, v) => [...p, v[v.length - 1]], []).concat(
            right(matrix.map(row => row.slice(0, -1)))
        );
    }
    /**
     * 
     * @param {number[][]} matrix 
     * @returns {number[]}
     */
    function right(matrix) {
        if (matrix.length == 0) return [];
        return matrix[matrix.length - 1].reverse().concat(up(matrix.slice(0, -1)));
    }
    /**
     * 
     * @param {number[][]} matrix 
     * @returns {number[]}
     */
    function up(matrix) {
        if (matrix.length == 0 || matrix[0].length == 0) return [];
        return matrix.reduce((p, v) => [v[0], ...p], []).concat(
            left(matrix.map(row => row.slice(1)))
        );
    }
    return left(input)

}
export {
    spiralMatrix
}