import { getSolution } from "./solvers.js";

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
  let hostQueue = [{ host: "home", path: [] }];
  let allHosts = {}

  while (hostQueue.length > 0) {
    const h = hostQueue.shift();
    if (!allHosts[h.host]) {
      let nextHosts = ns.scan(h.host);
      allHosts[h.host] = h.path
      hostQueue.push(...nextHosts.map((nextHost) => {
        return { host: nextHost, path: h.path.concat([nextHost]) }
      }));
    }
  }
  delete allHosts["home"]

  const hosts = Object.keys(allHosts).map((h) => {
    return {
      host: h,
      path: allHosts[h],
      contracts: ns.ls(h).filter(f => f.startsWith("contract"))
    }
  }).filter(h => h.contracts.length > 0);


  for (const host of hosts) {
    for (const contract of host.contracts) {

      const ct = ns.codingcontract.getContractType(contract, host.host)
      const data = ns.codingcontract.getData(contract, host.host)
      ns.tprint(ct)
      const solution = getSolution(ct, data)

      if (solution === null) {
        ns.tprint("unkown contract type")
        continue
      }
      const result = ns.codingcontract.attempt(solution, contract, host.host)
      if (result == "") {
        const msg = `failed attempt on type ${ct}`
        ns.tprint(msg)
        ns.tprint(data)
        ns.tprint(solution)
        ns.alert(msg)
        throw new Error(msg)
      } else {
        ns.tprint(result)
        if (typeof data !== "bigint") {
          ns.write("out/results.txt", JSON.stringify({
            type: ct,
            input: data,
            expected: solution
          }) + "\n", "a")
        }
      }
    }
  }


}