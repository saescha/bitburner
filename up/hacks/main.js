import { getAllHosts } from "../util/hosts"

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    ns.disableLog("ALL")
    const interval = 100
    const spacer = interval / 5
    const take = 0.5

    /**
     * 
     * @param {import("../../NetscriptDefinitions").Server} s 
     * @returns {Number}
     */
    const localhost = ns.getServer(ns.getHostname())
    const cores = localhost.cpuCores

    const myServers = getAllHosts(ns)
        .map(h => h.info)
        .filter(s => s.hasAdminRights && s.moneyMax > 0
            && s.moneyAvailable === s.moneyMax
            && s.hackDifficulty === s.minDifficulty
        )
        .map(srv => {
            const s = srv
            const h = s.hostname
            let r = {}

            const hackThreads = Math.floor(ns.hackAnalyzeThreads(h, s.moneyAvailable * take))
            const growThreads = Math.ceil(ns.growthAnalyze(h, 1 / (1 - take), cores))
            const weakenThreads = Math.ceil(ns.hackAnalyzeSecurity(hackThreads, h) + 0.004 * growThreads / ns.weakenAnalyze(1, cores))
            r.hack = {
                threads: hackThreads,
                exec: () => {
                    if (ns.getServerSecurityLevel(h) > s.minDifficulty) {
                        return
                    }
                    if (ns.run("x-hack.js", hackThreads, h) == 0) throw new Error("OOM")
                },
                ram: ns.getScriptRam("x-hack.js") * hackThreads,
                time: ns.getHackTime(h),
            }
            r.grow = {
                threads: growThreads,
                exec: () => {
                    if (ns.run("x-grow.js", growThreads, h) == 0) throw new Error("OOM")
                },
                ram: ns.getScriptRam("x-grow.js") * growThreads,
                time: ns.getGrowTime(h),
            }
            r.weaken = {
                threads: weakenThreads,
                exec: () => {
                    if (ns.run("x-weaken.js", weakenThreads, h) == 0) throw new Error("OOM")
                },
                ram: ns.getScriptRam("x-weaken.js") * weakenThreads,
                time: ns.getWeakenTime(h),
            },
                r.moneyMax = s.moneyMax
            r.hostname = h
            return r
        })
        .toSorted((a, b) => b.moneyMax - a.moneyMax)

    const ramAvailable = localhost.maxRam - localhost.ramUsed

    let schedule = []
    ns.print(`analyzing possible targets: ${myServers.map(s => s.hostname).join(", ")}`)

    for (const s of myServers) {
        let hostSchedule = []
        for (let i = 0; i * interval < s.weaken.time; i++) {
            const t = i * interval
            hostSchedule.push({ r: s.weaken.exec, t: t, ram: s.weaken.ram })
            hostSchedule.push({ r: s.grow.exec, t: t + s.weaken.time - s.grow.time - spacer, ram: s.grow.ram })
            if (i % 5 == 0) {
                //skip some hacks to stabilize the server
                continue
            }
            hostSchedule.push({ r: s.hack.exec, t: t + s.weaken.time - s.hack.time - spacer * 2, ram: s.hack.ram })
        }
        hostSchedule = hostSchedule.filter(sched => sched.t < s.weaken.time)
        const hostRam = hostSchedule.reduce((a, b) => a + b.ram, 0)
        if (hostRam > ramAvailable) {
            ns.tprint(`skipping ${s.hostname} because needed RAM ${hostRam} exceeds available RAM ${ramAvailable}`)
            continue
        }
        ns.tprint(`scheduling hacks on ${s.hostname} with ${s.hack.threads} hack threads, ${s.grow.threads} grow threads and ${s.weaken.threads} weaken threads, stealing ${take * 100}% of the money`)
        schedule.push(...hostSchedule)
    }

    const lastT = schedule.reduce((a, b) => Math.max(a, b.t), 0)

    // sprinkle in some restores to keep the servers in good shape
    for (let i = 0; i * 5 * 60 * 1000 < lastT; i++) {
        const t = i * 5 * 60 * 1000
        schedule.push({ r: () => { ns.run("hacks/restore.js") }, t: t, ram: 0 })
    }

    schedule = schedule.toSorted((a, b) => a.t - b.t)

    if (schedule.length == 0) {
        ns.tprint("no hacks scheduled, exiting")
        return
    }
    ns.print(schedule)

    schedule.push({ r: () => { ns.run("hacks/restore.js") }, t: 0, ram: 0 })

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
