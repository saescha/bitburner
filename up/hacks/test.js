import { getAllHosts } from "../util/hosts";
import { fmt } from "../util/render-table";

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const interval = 100
    ns.disableLog("getScriptRam")
    ns.disableLog("getServerUsedRam")
    ns.disableLog("getServerMoneyAvailable")
    ns.disableLog("getServerSecurityLevel")
    ns.disableLog("sleep")
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
        .toSorted((a, b) => a.serverGrowth - b.serverGrowth
        )

    const weakenEffect = ns.weakenAnalyze(1, cores)

    let weakenStarted = {}
    let growStarted = {}

    let hackThreads = 50;
    let ram = 0


    for (const h of hosts) {
        let now = Date.now()
        let sl = ns.getServerSecurityLevel(h.hostname)

        const growThreads = Math.ceil(
            ns.growthAnalyze(
                h.hostname,
                1 / ((1 - ns.hackAnalyze(h.hostname)) ** hackThreads),
                cores
            ))
        const weakenDemand = ns.hackAnalyzeSecurity(hackThreads, h.hostname) +
            ns.growthAnalyzeSecurity(growThreads, h.hostname, cores)
        // ns.run("x-weaken.js", Math.ceil(weakenDemand / weakenEffect), h.hostname)
        ram += Math.ceil(weakenDemand / weakenEffect) * ns.getScriptRam("x-weaken.js") * ns.getWeakenTime(h.hostname) / interval


        const wt = ns.getGrowTime(h.hostname)
        const gt = ns.getGrowTime(h.hostname)
        const ht = ns.getHackTime(h.hostname)


        const money = ns.getServerMoneyAvailable(h.hostname)


        // ns.run("x-grow.js", growThreads, h.hostname)
        ram += (growThreads * ns.getScriptRam("x-grow.js")) * ns.getGrowTime(h.hostname) / interval

        // ns.run("x-hack.js", hackThreads, h.hostname)
        ram += hackThreads * ns.getScriptRam("x-hack.js")* ns.getHackTime(h.hostname) / interval

    }
    ns.tprint(fmt(ram))

}