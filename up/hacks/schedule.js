import { getAllHosts } from "../util/hosts"

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const take = 0.1
    let interval = 100
    let spacer = interval / 5
    ns.disableLog("ALL")

    function debug(...args) {
        // const t = performance.now().toFixed(0) + ": "
        // ns.print(t, ...args)
    }

    const servers = getAllHosts(ns)
        .map(h => h.info)
        .filter(s => s.hasAdminRights && s.moneyMax > 0
            && s.moneyAvailable === s.moneyMax
            && s.hackDifficulty === s.minDifficulty
            && s.hostname != "fulcrumassets"
            && (ns.args.length == 0 || ns.args.includes(s.hostname))
        ).toSorted((a, b) => b.moneyMax - a.moneyMax).slice(0, 7)


    const localhost = ns.getServer(ns.getHostname())
    const cores = localhost.cpuCores

    const totalRam = servers.reduce((a, s) => {
        const hackThreads = Math.floor(ns.hackAnalyzeThreads(s.hostname, s.moneyAvailable * take))
        const growThreads = Math.ceil(ns.growthAnalyze(s.hostname, 1 / (1 - take), cores))
        const weakenThreads = Math.ceil(ns.hackAnalyzeSecurity(hackThreads, s.hostname) + 0.004 * growThreads / ns.weakenAnalyze(1, cores))
        const hackRam = hackThreads * ns.getScriptRam("x-hack.js") * ns.getHackTime(s.hostname) / interval
        const growRam = growThreads * ns.getScriptRam("x-grow.js") * ns.getGrowTime(s.hostname) / interval
        const weakenRam = weakenThreads * ns.getScriptRam("x-weaken.js") * ns.getWeakenTime(s.hostname) / interval
        return a + hackRam + growRam + weakenRam
    }, 0) * 2

    if (totalRam > localhost.maxRam - localhost.ramUsed) {
        ns.tprint(`Total RAM needed for one batch: ${totalRam.toFixed(2)}GB only ${localhost.maxRam - localhost.ramUsed} available. Adjusting interval: ${interval}ms`)
        interval = interval * Math.round(totalRam / (localhost.maxRam - localhost.ramUsed))
        spacer = interval / 5
    }
    ns.tprint(`Total RAM needed for one batch: ${totalRam.toFixed(2)}GB. Adjusted interval: ${interval}ms`)

    /**
     * @param {import("../../NetscriptDefinitions").Server} s 
     * @return {number} pid of the hack script
     */
    function hack(s) {
        const h = s.hostname
        const securityLevel = ns.getServerSecurityLevel(h)
        if (securityLevel > s.minDifficulty) {
            ns.print(`Security level of ${h} is too high to hack! Current: ${securityLevel.toFixed(2)}, minimum: ${s.minDifficulty.toFixed(2)}`)
            return -1
        }
        const threads = Math.floor(ns.hackAnalyzeThreads(h, s.moneyMax * take))
        if (threads < 1)
            return -1
        return ns.run("x-hack.js", threads, h)
    }
    /**
     * @param {import("../../NetscriptDefinitions").Server} s 
     * @return {number} pid of the hack script
     */
    function grow(s) {
        const h = s.hostname
        const securityLevel = ns.getServerSecurityLevel(h)
        if (securityLevel > s.minDifficulty) {
            ns.print(`Security level of ${h} is too high to grow! Current: ${securityLevel.toFixed(2)}, minimum: ${s.minDifficulty.toFixed(2)}`)
            return -1
        }
        return ns.run("x-grow.js", Math.ceil(ns.growthAnalyze(h, 1 / (1 - take), cores) * 1.2), h)
    }
    /**
     * @param {import("../../NetscriptDefinitions").Server} s 
     * @return {number} pid of the hack script
     */
    function weaken(s) {
        const h = s.hostname
        const hackThreads = Math.floor(ns.hackAnalyzeThreads(h, s.moneyAvailable * take))
        const growThreads = Math.ceil(ns.growthAnalyze(h, 1 / (1 - take), cores) * 1.2)
        return ns.run("x-weaken.js", 2 + Math.ceil(1.2 * ns.hackAnalyzeSecurity(hackThreads, h) + 0.004 * growThreads / ns.weakenAnalyze(1, cores)), h)
    }

    let batchNumber = 0
    /**@type {{op:(String)=>Number, batchNumber: number, s: import("../../NetscriptDefinitions").Server, t: number,isBatch: boolean}[]} */
    let queue = []

    /**
     * @param {import("../../NetscriptDefinitions").Server} s 
     */
    function batch(s) {
        let pid = weaken(s)
        if (pid == 0) {
            ns.print(`OOM when trying to weaken ${s.hostname}`)
            return
        }
        const now = performance.now()
        queue.push({ op: grow, batchNumber: batchNumber, s: s, t: now + ns.getWeakenTime(s.hostname) - ns.getGrowTime(s.hostname) - spacer, isBatch: false })
        queue.push({ op: hack, batchNumber: batchNumber, s: s, t: now + ns.getWeakenTime(s.hostname) - ns.getHackTime(s.hostname) - spacer * 2, isBatch: false })
        batchNumber++
        let nextBatchTime = now + interval + spacer / 2 - (now % interval)
        if (nextBatchTime < now) {
            nextBatchTime += interval
        }
        if (queue.some(o => o.t == nextBatchTime && o.isBatch && o.s.hostname == s.hostname)) {
            queue.sort((a, b) => a.t - b.t)
            return
        }
        queue.push({ op: batch, batchNumber: batchNumber, s: s, t: nextBatchTime, isBatch: true })
        debug(`Scheduled batch ${batchNumber} for ${s.hostname} at ${nextBatchTime.toFixed(0)}`)
        queue.sort((a, b) => a.t - b.t)
        return 1
    }

    for (const s of servers) {
        batch(s)
        debug(`Scheduled first batch for ${s.hostname}`)
    }

    function rescheduleBatch(time, job) {
        let nextBatchTime = time + interval - (time % interval)
        if (nextBatchTime < time) {
            nextBatchTime += interval
        }
        while (queue.some(o => o.t == nextBatchTime && o.isBatch && o.s.hostname == job.s.hostname)) {
            if (nextBatchTime > time + ns.getWeakenTime(job.s.hostname)) {
                ns.print(`Batch for ${job.s.hostname} could not be rescheduled within the next weaken time!`)
                return
            }
            nextBatchTime += interval
        }
        queue.push({ op: batch, batchNumber: job.batchNumber, s: job.s, t: nextBatchTime, isBatch: true })
        debug(`Rescheduled batch ${job.batchNumber} for ${job.s.hostname} at ${nextBatchTime.toFixed(0)}`)
        queue.sort((a, b) => a.t - b.t)
    }

    while (queue.length > 0) {
        const o = queue.shift()
        debug(`Processing job ${o.op.name} for ${o.s.hostname} scheduled at ${o.t.toFixed(0)}. Time now: ${performance.now().toFixed(0)}. queue length: ${queue.length}`)
        let now = performance.now()
        if (o.t < now - spacer / 2) {
            ns.print(`Job ${o.op.name} for ${o.s.hostname} is late by ${Math.round(now - o.t)}ms!`)
            queue = queue.filter(s => s.batchNumber != o.batchNumber)
            if (o.isBatch) {
                rescheduleBatch(now, o)
            }
            continue
        }
        if (o.t > now + spacer / 2) {
            await ns.sleep(o.t - now - spacer / 2)
        }
        now = performance.now()
        if (o.t < now - spacer / 2) {
            ns.print(`Job ${o.op.name} for ${o.s.hostname} is late by ${Math.round(now - o.t)}ms! Slept to long!!!`)
            queue = queue.filter(s => s.batchNumber != o.batchNumber)
            if (o.isBatch) {
                rescheduleBatch(now, o)
            }
            ns.print(`queue length after removing late jobs and rescheduling: ${queue.length}`)
            continue
        }
        const pid = o.op(o.s)
        if (pid < 1) {
            ns.print(`Failed to start ${o.op.name} for ${o.s.hostname}! Reason: ${pid == 0 ? "Not enough RAM" : "Security level too high"}`)
            queue = queue.filter(s => s.batchNumber != o.batchNumber)

            // no need to reschedule batches. because either it was caused by RAM so we don't bother scheduling more.
            // or it was caused by security level so it was actually not a batch job and we can just skip it.
        }
    }

    ns.alert(`${localhost.hostname}: All batches completed! ${String(ns.args)}`)
    await ns.sleep(1000)

}