
/**
 * 
 * @param {[string,number]} param0 
 */
function mathSolutions([digits,target]){
    /**
     * 
     * @param {string} expr 
     * @param {number} value 
     * @param {number} index 
     * @param {number} last
     * @returns {string[]}
     */
    function dfs(expr,value,index,last){
        if(index == digits.length){
            if(value == target){
                return [expr]
            }
            return []
        }
        let results = []
        
        for (let i = index+1; i < digits.length+1 && i-index < 10; i++) {
            if(i>index+1 && digits.charAt(index) == "0"){
                return results
            }
            const n = parseInt(digits.substring(index,i))
            if (index ===0){
                results.push(...dfs(String(n),n,i,n))
            }else{
            results.push(...dfs(expr+"+"+n,value+n,i,n))
            results.push(...dfs(expr+"*"+n,value-last+last*n,i,last*n ))
            results.push(...dfs(expr+"-"+n,value-n,i,-n))
            }
        }
        return results
    }

    return dfs("",0,0,0)
}

export {
    mathSolutions
}