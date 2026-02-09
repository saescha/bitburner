import { getAllHosts } from "../util/hosts";

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

    let hackThreads = 10;

    while (true) {
        for (const h of hosts) {
            let now = Date.now()
            let sl = ns.getServerSecurityLevel(h.hostname)


            if (!weakenStarted[h.hostname])
                weakenStarted[h.hostname] = now
            const growThreads = Math.ceil(
                ns.growthAnalyze(
                    h.hostname,
                    1 / ((1 - ns.hackAnalyze(h.hostname)) ** hackThreads),
                    cores
                ))
            const weakenDemand = ns.hackAnalyzeSecurity(hackThreads, h.hostname) +
                ns.growthAnalyzeSecurity(growThreads, h.hostname, cores)
            ns.run("x-weaken.js", Math.ceil(weakenDemand / weakenEffect), h.hostname)
            if (sl > h.minDifficulty * 1.05) {
                continue
            }

            const wt = ns.getGrowTime(h.hostname)
            const gt = ns.getGrowTime(h.hostname)
            const ht = ns.getHackTime(h.hostname)

            if (now < weakenStarted[h.hostname] + wt - gt)
                continue

            const money = ns.getServerMoneyAvailable(h.hostname)

            if (!growStarted[h.hostname])
                growStarted[h.hostname] = now

            ns.run("x-grow.js", growThreads, h.hostname)
            if (money < h.moneyMax * 0.90) {
                continue
            }


            if (now < growStarted[h.hostname] + gt - ht)
                continue;

            ns.run("x-hack.js", hackThreads, h.hostname)


        }
        await ns.sleep(100)
    }
}