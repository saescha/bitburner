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

    servers.filter(h => h.moneyMax > 100000
        && (ns.args.length == 0 || ns.args.includes(h.hostname))
        && (h.moneyMax * 50 < h.moneyAvailable)
        && (h.hackDifficulty < h.minDifficulty * 1.5)
    ).toSorted(() => Math.random() - 0.5)

    /**@type {{host:string,weakenThreads:Number,growThreads:Number,minDifficulty:Number,moneyMax:Number,weakenStart:Number,growStart:Number,ramConsumption:Number}[]} */
    const hosts = []
    let hackThreads = 50;
    const weakenEffect = ns.weakenAnalyze(1, cores)
    let ramAvailable = (localhost.maxRam - localhost.ramUsed) * 0.5

    for (const s of servers) {
        /**@type {{host:string,weakenThreads:Number,growThreads:Number,minDifficulty:Number,moneyMax:Number,weakenStart:Number,growStart:Number,ramConsumption:Number}} */
        let h = {
            host: s.hostname,
            minDifficulty: s.minDifficulty,
            growStart: 0,
            growThreads: 0,
            moneyMax: s.moneyMax,
            ramConsumption: 0,
            weakenStart: 0,
            weakenThreads: 0
        }
        h.growThreads = Math.ceil(
            ns.growthAnalyze(
                h.host,
                1 / ((1 - ns.hackAnalyze(h.host)) ** hackThreads),
                cores
            ))
        const weakenDemand = ns.hackAnalyzeSecurity(hackThreads, h.host) +
            ns.growthAnalyzeSecurity(h.growThreads, h.host, cores)
        h.weakenThreads = Math.ceil(weakenDemand / weakenEffect)

        let ram = h.weakenStart * ns.getScriptRam("x-weaken.js") * ns.getWeakenTime(h.host) / interval
        ram += (h.growThreads * ns.getScriptRam("x-grow.js")) * ns.getGrowTime(h.host) / interval
        ram += hackThreads * ns.getScriptRam("x-hack.js") * ns.getHackTime(h.host) / interval
        h.ramConsumption = ram
        if (ramAvailable > ram) {
            hosts.push(h)
            ramAvailable -= ram
        }
    }

    while (true) {
        for (const h of hosts) {
            let now = Date.now()
            let sl = ns.getServerSecurityLevel(h.host)


            if (h.weakenStart == 0)
                h.weakenStart = now

            if (ns.run("x-weaken.js", h.weakenThreads, h.host) == 0) {
                throw new Error("OOM ")
            }

            const wt = ns.getGrowTime(h.host)
            const gt = ns.getGrowTime(h.host)

            if (now < h.weakenStart + wt )
                continue

            const money = ns.getServerMoneyAvailable(h.host)

            if (h.growStart == 0)
                h.growStart = now

            if (ns.run("x-grow.js", h.growThreads, h.host) == 0) {
                throw new Error("OOM ")
            }

            if (now < h.growStart + gt )
                continue;
            if (money < h.moneyMax * 0.90) {
                continue
            }

            if (ns.run("x-hack.js", hackThreads, h.host) == 0) {
                throw new Error("OOM ")
            }
        }
        await ns.sleep(interval)
    }
}