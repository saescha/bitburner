import { getSolution } from "./solvers.js";

/** @param {import("../../NetscriptDefinitions.js").NS} ns */
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

  const host = hosts[3]
  const contract = host.contracts[0]

  for (const host of hosts) {
    for (const contract of host.contracts) {

      const ct = ns.codingcontract.getContractType(contract, host.host)
      const data = ns.codingcontract.getData(contract, host.host)
        ns.tprint(ct)
        ns.tprint(data)
        ns.tprint(ns.codingcontract.getDescription(contract, host.host))
        ns.tprint(host.path) 
      
      break;
    }
    break;
  }


}