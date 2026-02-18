import { getAllHosts } from "../util/hosts"

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const take = 0.25
    let interval = 150
    let spacer = interval / 3
    ns.disableLog("ALL")

    function debug(...args) {
        // const t = performance.now().toFixed(0) + ": "
        // ns.print(t, ...args)
    }

    /**@typedef {{hostname: String,hasAdminRights:boolean,hackDifficulty: Number,moneyAvailable:Number,moneyMax: Number,minDifficulty:Number,timeOffset:Number}} target*/

    /** @type {target[]} */
    const servers = getAllHosts(ns)
        .map((h, i) => {
            const s = h.info
            return {
                hostname: s.hostname,
                hasAdminRights: s.hasAdminRights,
                hackDifficulty: s.hackDifficulty,
                moneyAvailable: s.moneyAvailable,
                minDifficulty: s.minDifficulty,
                moneyMax: s.moneyMax,
                timeOffset: i * 5
            }
        }).filter(s => s.hasAdminRights && s.moneyMax > 0
            && s.moneyAvailable === s.moneyMax
            && s.hackDifficulty === s.minDifficulty
            && s.hostname != "fulcrumassets"
            && (ns.args.length == 0 || ns.args.includes(s.hostname))
        ).toSorted((a, b) => b.moneyMax - a.moneyMax).slice(0, 7)




    const localhost = ns.getServer(ns.getHostname())
    const cores = localhost.cpuCores
    const workers = ns.getPurchasedServers()

    /**
     * @param {target} s 
     * @return {number} pid of the hack script
     */
    function workerHack(s) {
        const h = s.hostname
        const threads = Math.min(Math.floor(ns.hackAnalyzeThreads(h, s.moneyMax * take)), 1)

        for (let i = 0; i < workers.length; i++) {
            const pid = ns.exec("x-hack.js", workers[i], threads, h)
            if (pid > 0)
                return pid
        }
        return 0
    }

    /**
     * @param {target} s 
     * @return {number} pid of the hack script
     */
    function hack(s) {
        const h = s.hostname
        const securityLevel = ns.getServerSecurityLevel(h)
        if (securityLevel > s.minDifficulty) {
            ns.print(`Security level of ${h} is too high to hack! Current: ${securityLevel.toFixed(2)}, minimum: ${s.minDifficulty.toFixed(2)}`)
            return -1
        }
        const threads = Math.min(Math.floor(ns.hackAnalyzeThreads(h, s.moneyMax * take)), 1)
        if (threads < 1)
            return -1
        const pid = ns.run("x-hack.js", threads, h)
        if (pid > 0) {
            return pid
        }
        return workerHack(s)
    }
    /**
     * @param {target} s 
     * @return {number} pid of the hack script
     */
    function workerGrow(s) {
        const h = s.hostname
        for (let i = 0; i < workers.length; i++) {
            const pid = ns.exec("x-grow.js", workers[i], Math.ceil(ns.growthAnalyze(h, 1 / (1 - take), 1) * 1.2), h)
            if (pid > 0)
                return pid
        }
        return 0
    }
    /**
     * @param {target} s 
     * @return {number} pid of the hack script
     */
    function grow(s) {
        const h = s.hostname
        const securityLevel = ns.getServerSecurityLevel(h)
        if (securityLevel > s.minDifficulty) {
            ns.print(`Security level of ${h} is too high to grow! Current: ${securityLevel.toFixed(2)}, minimum: ${s.minDifficulty.toFixed(2)}`)
            return -1
        }
        const pid = ns.run("x-grow.js", Math.ceil(ns.growthAnalyze(h, 1 / (1 - take), cores) * 1.2), h)
        if (pid > 0)
            return pid
        return workerGrow(s)
    }
    /**
     * @param {target} s 
     * @return {number} pid of the hack script
     */
    function workerWeaken(s) {
        const h = s.hostname
        const hackThreads = Math.floor(ns.hackAnalyzeThreads(h, s.moneyAvailable * take))
        const growThreads = Math.ceil(ns.growthAnalyze(h, 1 / (1 - take), 1) * 1.2)
        const threads = 2 + Math.ceil(2.5 * (ns.hackAnalyzeSecurity(hackThreads, h) + 0.004 * growThreads) / ns.weakenAnalyze(1, 1))
        for (let i = 0; i < workers.length; i++) {
            const pid = ns.exec("x-weaken.js", workers[i], threads, h)
            if (pid > 0)
                return pid
        }
        return 0
    }
    /**
     * @param {target} s 
     * @return {number} pid of the hack script
     */
    function weaken(s) {
        const h = s.hostname
        const hackThreads = Math.floor(ns.hackAnalyzeThreads(h, s.moneyAvailable * take))
        const growThreads = Math.ceil(ns.growthAnalyze(h, 1 / (1 - take), cores) * 1.2)
        const pid = ns.run("x-weaken.js", 2 + Math.ceil(2.5 * (ns.hackAnalyzeSecurity(hackThreads, h) + 0.004 * growThreads / ns.weakenAnalyze(1, cores))), h)
        if (pid > 0)
            return pid
        return workerWeaken(s)
    }

    let batchNumber = 0
    /**@typedef  {{op:(String)=>Number, batchNumber: number, s: target, t: number,isBatch: boolean}} job*/
    /**@type {job[]} */
    let queue = []

    /**
     * @param {target} s 
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
        let nextBatchTime = now + interval - (now % interval) + s.timeOffset
        if (nextBatchTime < now) {
            nextBatchTime += interval
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

    /**
     * 
     * @param {Number} time 
     * @param {job} job 
     * @returns 
     */
    function rescheduleBatch(time, job) {
        let nextBatchTime = time + interval - (time % interval) + job.s.timeOffset
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