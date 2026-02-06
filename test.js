import { getSolution } from "./up/contracts/solvers.js";
import { uniqueGridPaths } from "./up/contracts/algo/unique_paths.js";

const testcases = [
  { type: 'Total Ways to Sum', input: 4, expected: 4 },
  { type: 'Total Ways to Sum', input: 5, expected: 6 },
  { type: 'Total Ways to Sum', input: 6, expected: 10 },
  { type: 'Total Ways to Sum', input: 7, expected: 14 },
  { type: 'Total Ways to Sum', input: 8, expected: 21 },
  { type: 'Total Ways to Sum', input: 9, expected: 29 },
  { type: 'Total Ways to Sum', input: 10, expected: 41 },
  { type: 'Total Ways to Sum', input: 11, expected: 55 },
  { type: 'Total Ways to Sum', input: 12, expected: 76 },
  { type: 'Total Ways to Sum', input: 13, expected: 100 },
  { type: 'Total Ways to Sum', input: 14, expected: 134 },
  { type: 'Total Ways to Sum', input: 15, expected: 175 },
  { type: 'Total Ways to Sum', input: 16, expected: 230 },
  { type: 'Total Ways to Sum', input: 17, expected: 296 },
  { type: 'Total Ways to Sum', input: 18, expected: 384 },
  { type: 'Total Ways to Sum', input: 19, expected: 489 },
  { type: 'Total Ways to Sum', input: 20, expected: 626 },
  { type: 'Total Ways to Sum', input: 21, expected: 791 },
  { type: 'Total Ways to Sum', input: 22, expected: 1001 },
  { type: 'Total Ways to Sum', input: 23, expected: 1254 },
  { type: 'Total Ways to Sum', input: 24, expected: 1574 },
  { type: 'Total Ways to Sum', input: 25, expected: 1957 },
  { type: 'Total Ways to Sum', input: 26, expected: 2435 },
  { type: 'Total Ways to Sum', input: 27, expected: 3009 },
  { type: 'Total Ways to Sum', input: 28, expected: 3717 },
  { type: 'Total Ways to Sum', input: 29, expected: 4564 },
  { type: 'Total Ways to Sum', input: 30, expected: 5603 },
  { type: 'Total Ways to Sum', input: 31, expected: 6841 },
  { type: 'Total Ways to Sum', input: 32, expected: 8348 },
  { type: 'Total Ways to Sum', input: 33, expected: 10142 },
  { type: 'Total Ways to Sum', input: 34, expected: 12309 },
  { type: 'Total Ways to Sum', input: 35, expected: 14882 },
  { type: 'Total Ways to Sum', input: 36, expected: 17976 },
  { type: 'Total Ways to Sum', input: 37, expected: 21636 },
  { type: 'Total Ways to Sum', input: 38, expected: 26014 },
  { type: 'Total Ways to Sum', input: 39, expected: 31184 }
]

// console.log(JSON.stringify(testcases.map((x)=>x.expected+1)))

// console.log(getSolution("Total Ways to Sum",99))
// console.log(getSolution("Compression II: LZ Decompression","5aaabb450723abb"))
// console.log("aaabbaaababababaabb")
// console.log(getSolution("Square Root",100n))

// console.log(uniqueGridPaths([[0,0,0,0,0,0,1,0,0,0,0],[0,0,1,0,0,0,1,0,1,0,0],[0,0,0,1,0,0,0,0,0,0,0],[0,1,0,0,0,0,0,0,0,0,0]]))

// console.log(getSolution("Subarray with Maximum Sum",[-1,9,-1,10,3,-5,-9,10,5,-9,-2,-9,-6,-9,-10,8,-8,-6,1,9,3,-3,1,-3,-6,-7,10,-8,-1,5,-5,-5,7,-3]))
// console.log((743887).toString(2))
// const s = getSolution("HammingCodes: Integer to Encoded Binary",743887)
// console.log(s)
// console.log(getSolution("HammingCodes: Encoded Binary to Integer",s))
// // contracts/solve.js: 9Pfv8QFXjL07adZYltg512S6853lGc488j7BhD3pB790911W763WWW
// contracts/solve.js: Pfv8QFXjLadZYltgdZYltS6tgdZYltSlGctSlGj7BhD3pBj7BhD3p3pBj7BhD3WBj7BhD3WWW
// Pfv8QFXjLadZYltg

  const lz= [ ["abracadabra"     ,"7abracad47"   ] ,    
    ["mississippi"     ,"4miss433ppi"],
    ["aAAaAAaAaAA"     ,"3aAA53035"],
    ["2718281828"      ,"627182844"],
    ["abcdefghijk"     ,"9abcdefghi02jk"],
    ["aaaaaaaaaaaa"    ,"3aaa91"],
    ["aaaaaaaaaaaaa"   ,"1a91031"],
    ["aaaaaaaaaaaaaa"  ,"1a91041"]]

for (const l of lz) {
  const comp = String(getSolution("Compression III: LZ Compression",l[0]))
  if(comp.length > l[1].length){
    console.log("to long",comp,l[0],l[1])
  }
  const decomp = String(getSolution("Compression II: LZ Decompression","5aaabb450723abb"))
  if (decomp != l[0]){
    console.log("wrong",comp,l[0],l[1])
  }
  
}