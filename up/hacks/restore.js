import { getAllHosts } from "../util/hosts";
import { fmt } from "../util/render-table";

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    ns.disableLog("ALL")
    let servers = getAllHosts(ns)
        .filter(h => h.info.hasAdminRights)
        .map(s => {
            // ns.scp(["x-grow.js", "x-hack.js", "x-weaken.js"], s.host)
            return s.info
        })

    const localhost = servers.find((s) => s.hostname == ns.getHostname())

    const cores = localhost.cpuCores

    const hosts = servers
        .filter(h => h.moneyMax > 100000 && (ns.args.length == 0 || ns.args.includes(h.hostname)))
        .toSorted((a, b) => a.serverGrowth - b.serverGrowth)


    for (const h of hosts) {
        const growThreads = Math.ceil(ns.growthAnalyze(h.hostname, h.moneyMax / h.moneyAvailable, cores))
        const weakenDemand = (h.hackDifficulty + ns.growthAnalyzeSecurity(growThreads, h.hostname, cores) - h.minDifficulty)
        const weakenThreads = Math.ceil(weakenDemand / ns.weakenAnalyze(1, cores))
        if (weakenThreads < 1) {
            ns.print(`maxing ${h.hostname}: already max`)
            continue
        }
        const ramNeeded = ns.getScriptRam("x-weaken.js") * weakenThreads + ns.getScriptRam("x-grow.js") * growThreads
        if (ramNeeded > localhost.maxRam - ns.getServerUsedRam(localhost.hostname)) {
            ns.tprint("OOM")
            break;
        }
        ns.run("x-weaken.js", weakenThreads, h.hostname)
        if (growThreads > 0)
            ns.run("x-grow.js", growThreads, h.hostname)
        ns.print(`maxing ${h.hostname}: grow ${fmt(ns.getGrowTime(h.hostname))} weaken ${fmt(ns.getWeakenTime(h.hostname))}`)
    }
}