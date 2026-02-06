



/** 
 * @param {import("../../NetscriptDefinitions").NS} ns 
 * @returns {{host:string,path:string[],info:import("../../NetscriptDefinitions").Server}[]}
*/
function getAllHosts(ns) {
    /**
     * @type {{host:string,path:string[]}[]}
     */
    let hostQueue = [{ host: "home", path: [] }];
    /** @type {Map<String,String[]>} */
    let allHosts = new Map()

    while (hostQueue.length > 0) {
        const h = hostQueue.shift();
        if (!allHosts.has(h.host)) {
            let nextHosts = ns.scan(h.host);
            allHosts.set(h.host, h.path)
            hostQueue.push(...nextHosts.map((nextHost) => {
                return { host: nextHost, path: h.path.concat([nextHost]) }
            }));
        }
    }
    let result = [];

    allHosts.forEach((path,host)=>{
        result.push(
            {
                host: host,
                path: path,
                info: ns.getServer(host)
            }
        )
    })

    return result;
}


export{
    getAllHosts
}