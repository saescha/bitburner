
/**
 * 
 * @param {[number,[number,number][]]} input 
 */
function twoColorGraph(input) {
  const vertices = input[1]
  let s = Array(input[0]);

  function color(n, c) {
    if (s[n] * 0 !== 0) {
      s[n] = c;
      for (let v of vertices) {
        if (v[0] === n) {
          color(v[1], (c + 1) % 2)
        }
        if (v[1] === n) {
          color(v[0], (c + 1) % 2)
        }
      }
    }
    if (s[n] != c) {
      throw "none"
    }
  }

  try {
    for (let i =0;i<s.length;i++){
      if (s[i] * 0 !== 0){
        color(i, 0);
      }
    }
    
  } catch (e) {
    if (e == "none") {
      return []
    }
    throw e;
  }
  return s;
}

export{ twoColorGraph }
