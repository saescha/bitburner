import { allSums1,allSums2 } from "./algo/all_sums.js";
import { cesarCipher } from "./algo/cesar.js";
import { twoColorGraph } from "./algo/two-color-graph.js";
import { jumpArray } from "./algo/array_jumping.js";
import { hammingDecode, hammingEncode } from "./algo/hamming.js";
import { generateIPs } from "./algo/ip_addr.js";
import { primeFactors } from "./algo/prime.js";
import { compressRLE } from "./algo/rle_compress.js";
import { sanitizeParentheses } from "./algo/sanitize.js";
import { shortestGridPath } from "./algo/shortest_path.js";
import { uniqueGridPaths, createGrid } from "./algo/unique_paths.js";
import { spiralMatrix } from "./algo/spiral_matrix.js";
import { stockTrader } from "./algo/stock-trader.js";
import { triangleMinPathSum } from "./algo/triangle.js";
import { vigenere } from "./algo/vigenere.js";
import { squareRoot } from "./algo/sqrt.js";
import { mathSolutions } from "./algo/math_solutions.js";
import { lzCompress, lzDecompress } from "./algo/lz.js";
import { maxSubarray } from "./algo/max_subarray.js";
import { mergeIntervals } from "./algo/merge_intervals.js";

const solvers = {
    "Algorithmic Stock Trader I": (x) => stockTrader([1, x]),
    "Algorithmic Stock Trader II": (x) => stockTrader([x.length, x]),
    "Algorithmic Stock Trader III": (x) => stockTrader([2, x]),
    "Algorithmic Stock Trader IV": stockTrader,
    "Array Jumping Game": (x) => {
        if (jumpArray(x) != 0)return 1;
        return 0;
     },
    "Array Jumping Game II": jumpArray,
    "Compression III: LZ Compression": lzCompress,
    "Compression II: LZ Decompression": lzDecompress,
    "Compression I: RLE Compression": compressRLE,
    "Encryption I: Caesar Cipher": cesarCipher,
    "Encryption II: Vigenère Cipher": vigenere,
    "Find All Valid Math Expressions": mathSolutions,
    "Find Largest Prime Factor": (x) => primeFactors(x)[0],
    "Generate IP Addresses": generateIPs,
    "HammingCodes: Encoded Binary to Integer": hammingDecode,
    "HammingCodes: Integer to Encoded Binary": hammingEncode,
    "Merge Overlapping Intervals": mergeIntervals,
    "Minimum Path Sum in a Triangle": triangleMinPathSum,
    "Proper 2-Coloring of a Graph": twoColorGraph,
    "Sanitize Parentheses in Expression": sanitizeParentheses,
    "Shortest Path in a Grid": shortestGridPath,
    "Spiralize Matrix": spiralMatrix,
    "Square Root": squareRoot,
    "Subarray with Maximum Sum": maxSubarray,
    "Total Ways to Sum": allSums1,
    "Total Ways to Sum II": allSums2,
    "Unique Paths in a Grid I": (x) => uniqueGridPaths(createGrid(x)),
    "Unique Paths in a Grid II": uniqueGridPaths,
}
/**
 * 
 * @param {string} contractType 
 * @param {any} data 
 * @returns {string | number | any[]}
 */
function getSolution(contractType, data) {
    // return null;
    return solvers[contractType](data);
}
export {
    getSolution
}

