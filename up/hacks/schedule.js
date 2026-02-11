/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const interval = 200
    const spacer = interval / 5
    ns.disableLog("ALL")
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

    let take = 0.25

    let hack = {
        threads: Math.floor(ns.hackAnalyzeThreads(h, s.moneyAvailable * take)),
        exec: () => { if (ns.run("x-hack.js", hack.threads, h) == 0) throw new Error("OOM") },
        ram: ns.getScriptRam("x-hack.js"),
        time: ns.getHackTime(h),
    }
    let grow = {
        threads: Math.ceil(ns.growthAnalyze(h, 1 / (1 - take), cores)),
        exec: () => { if (ns.run("x-grow.js", grow.threads, h) == 0) throw new Error("OOM") },
        ram: ns.getScriptRam("x-grow.js"),
        time: ns.getGrowTime(h),
    }
    let weaken = {
        threads: Math.ceil(ns.hackAnalyzeSecurity(hack.threads, h) + 0.004 * grow.threads / ns.weakenAnalyze(1, cores)),
        exec: () => { if (ns.run("x-weaken.js", weaken.threads, h) == 0) throw new Error("OOM") },
        ram: ns.getScriptRam("x-weaken.js"),
        time: ns.getWeakenTime(h),
    }

    ns.tprint(`running hacks on ${h} with ${hack.threads} hack threads, ${grow.threads} grow threads and ${weaken.threads} weaken threads, stealing ${take * 100}% of the money`)

    let schedule = []

    for (let i = 0; i * interval < weaken.time; i++) {
        const t = i * interval
        schedule.push({ r: weaken.exec, t: t })
        if (i % 10 == 0) {
            // just weaken sometimes to stabilize the security level
            continue
        }
        schedule.push({ r: grow.exec, t: t + weaken.time - grow.time - spacer })
        if (i % 10 == 1) {
            // just grow sometimes to stabilize the money amount
            continue
        }
        schedule.push({ r: hack.exec, t: t + weaken.time - hack.time - spacer * 2 })
    }


    schedule = schedule.filter(s => s.t < weaken.time).toSorted((a, b) => a.t - b.t)

    ns.print(schedule)

    while (true) {
        const start = performance.now()
        for (const s of schedule) {
            const t = performance.now() - start
            if (t < s.t) {
                await ns.sleep(s.t - t)
            }
            s.r()
        }
    }

}
