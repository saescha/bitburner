/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const interval = 200
    ns.disableLog("getScriptRam")
    ns.disableLog("getServerUsedRam")
    ns.disableLog("getServerMoneyAvailable")
    ns.disableLog("getServerSecurityLevel")
    ns.disableLog("sleep")
    ns.disableLog("run")
    const h = String(ns.args[0] || "sigma-cosmetics")

    const s = ns.getServer(h)
    if (s.moneyAvailable < s.moneyMax) {
        ns.tprint(`abort: ${h} is not fully grown, available money: ${s.moneyAvailable}, max money: ${s.moneyMax}`)
        return
    }

    if (s.hackDifficulty > s.minDifficulty) {
        ns.tprint(`abort: ${h} is not fully weakened, current security: ${s.hackDifficulty}, min security: ${s.minDifficulty}`)
        return
    }

    const localhost = ns.getServer(ns.getHostname())
    const cores = localhost.cpuCores

    let take = 0.2 / 0.9

    const weakenEffect = ns.weakenAnalyze(1, cores)
    let ramAvailable = (localhost.maxRam - localhost.ramUsed) * 0.9
    let ramNeeded = localhost.maxRam

    let hack = {
        threads: 0,
        exec: () => { if (ns.run("x-hack.js", hack.threads, h) == 0) throw new Error("OOM") },
        ram: ns.getScriptRam("x-hack.js"),
        time: () => ns.getHackTime(h),
    }
    let grow = {
        threads: 0,
        exec: () => { if (ns.run("x-grow.js", grow.threads, h) == 0) throw new Error("OOM") },
        ram: ns.getScriptRam("x-grow.js"),
        time: () => ns.getGrowTime(h),
    }
    let weaken = {
        threads: 0,
        exec: () => { if (ns.run("x-weaken.js", weaken.threads, h) == 0) throw new Error("OOM") },
        ram: ns.getScriptRam("x-weaken.js"),
        time: () => ns.getWeakenTime(h),
    }

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    while (ramAvailable < ramNeeded) {
        take *= 0.9
        ns.print(`calculate ram taking ${take * 100}% `)
        if (take < 0.01) {
            ns.tprint("cannot find valid hack amount, aborting")
            return
        }
        ramNeeded = 0
        hack.threads = Math.floor(ns.hackAnalyzeThreads(h, s.moneyAvailable * take))

        ramNeeded += hack.threads * hack.ram * hack.time() / interval
        grow.threads = Math.ceil(ns.growthAnalyze(h, 1 / (1 - take), cores) * 1.5)
        ramNeeded += grow.threads * grow.ram * grow.time() / interval
        const weakenDemand = ns.hackAnalyzeSecurity(hack.threads, h) + 0.004 * grow.threads
        weaken.threads = Math.ceil(weakenDemand * 1.5 / weakenEffect)
        ramNeeded += weaken.threads * weaken.ram * weaken.time() / interval
        ns.print(`taking ${ns.nFormat(take, '0.000%')}% requires ${ns.nFormat(ramNeeded * 2 ** 20, '0.000 ib')} only ${ns.nFormat(ramAvailable * 2 ** 20, '0.000 ib')} available`)

    }

    ns.tprint(`running hacks on ${h} with ${hack.threads} hack threads, ${grow.threads} grow threads and ${weaken.threads} weaken threads, stealing ${take * 100}% of the money`)

    while (true) {
        weaken.exec()
        setTimeout(grow.exec, weaken.time() - grow.time() - interval * 2 / 3)
        setTimeout(hack.exec, weaken.time() - hack.time() - interval / 3)

        await sleep(interval)
    }
}
