import { getAllHosts } from "../util/hosts";
import { Scheduler } from "./scheduler";

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const interval = 100
    ns.disableLog("getScriptRam")
    ns.disableLog("getServerUsedRam")
    let hosts = getAllHosts(ns)
        .filter(h => h.info.hasAdminRights)
        .map(s => s.info)

    const scheduler = new Scheduler(ns, hosts)
    scheduler.killAll()

    let maxLevel = Number(ns.read("/hacks/max-level.txt"))
    if (maxLevel == 0) {
        maxLevel = 27
    }
    hosts = hosts.filter(h => h.moneyMax > 100000 && h.baseDifficulty <= maxLevel).toSorted((a, b) => b.moneyMax * b.serverGrowth - a.moneyMax * a.serverGrowth)

    while (true) {
        let maxLevel = Number(ns.read("/hacks/max-level.txt"))
        ns.print("hacking up to lvl ", maxLevel)
        if (maxLevel == 0) {
            maxLevel = 27
        }

        if (scheduler.getAvailableRam() < 20) {
            ns.print("not enough ram, waiting")
            await ns.sleep(interval)
            continue
        }

        hosts = hosts.filter(h => h.moneyMax > 100000 && h.baseDifficulty <= maxLevel).toSorted((a, b) => b.moneyMax * b.serverGrowth - a.moneyMax * a.serverGrowth)

        for (let i = 0; i < hosts.length; i++) {
            const h = hosts[i].hostname;
            const minLvl = ns.getServerMinSecurityLevel(h)
            const currentLvl = ns.getServerSecurityLevel(h)

            const rHacks = scheduler.getThreads("x-hack.js", h)
            const rGrows = scheduler.getThreads("x-grow.js", h)
            const rWeaken = scheduler.getThreads("x-weaken.js", h)

            let secDelta = currentLvl - minLvl + ns.hackAnalyzeSecurity(rHacks, h) + ns.growthAnalyzeSecurity(rGrows)

            let secPlan = 0
            while (Math.abs(secDelta - secPlan) > 0.1) {
                secPlan = ns.weakenAnalyze(secDelta * 20, 5)
            }
            ns.hackAnalyzeSecurity




            if (minLvl * 1.1 < currentLvl) {
                continue

                ns.print("need to weaken ", h)
                const running = scheduler.getThreads("x-weaken.js", h)
                const needed = Math.round(
                    (currentLvl - minLvl) * 20
                    + rHacks * 25
                    + rGrows * 12
                )
                if (needed > running) {
                    ns.print("already weakening ", running)
                    scheduler.run("x-weaken.js", needed - running, h);
                }
                continue
            } else {
                ns.print(`${h} already weak: ${currentLvl}/${minLvl}`)
            }
            const c = ns.getServerMoneyAvailable(h)
            const m = ns.getServerMaxMoney(h)
            if (m * 0.8 > c) {
                const threads = Math.round(Math.log(m / c) / Math.log(1.01))
                scheduler.run("x-grow.js", threads, h);
                scheduler.run("x-weaken.js", Math.ceil(threads / 13), h);
            } else {
                scheduler.run("x-hack.js", 100, h);
                scheduler.run("x-weaken.js", 4, h);
            }
        }
        await ns.sleep(1000)

    }
}