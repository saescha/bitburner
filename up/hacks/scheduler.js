import { getAllHosts } from "../util/hosts"

/** @typedef {{pid:number,host:string}} Process */

class Scheduler {
    /** @type {import("../../NetscriptDefinitions").Server[]} */
    hosts = []
    /**@type {import("../../NetscriptDefinitions").NS} */
    ns = null



    /** @typedef {{threads: number,process: Process}} Schedule*/

    /**
     * @param {import("../../NetscriptDefinitions").NS} ns 
     * @param {import("../../NetscriptDefinitions").Server[]} hosts 
     */
    constructor(ns, hosts) {
        this.ns = ns
        this.ns.disableLog("getScriptRam")
        this.ns.disableLog("getServerUsedRam")
        this.ns.disableLog("ps")
        this.hosts = hosts.toSorted((a, b) => b.cpuCores - a.cpuCores)
        ns.print(this.hosts)
    }
    /**
     * @param {number} cores
     * @param {string} filename 
     * @param {number} threads 
     * @param {string[]} args 
     * @returns {Schedule[]}
     */
    run(cores, filename, threads, ...args) {
        let result = []
        let needed = this.ns.getScriptRam(filename)

        for (let i = 0; i < this.hosts.length; i++) {
            const h = this.hosts[i];
            if (h.cpuCores < cores) {
                break
            }
            if (h.cpuCores > cores) {
                continue
            }

            const free = h.maxRam - this.ns.getServerUsedRam(h.hostname) - (h.hostname == "home" ? 100 : 0)
            const t = Math.min(Math.floor(free / needed), threads)
            if (t == 0) {
                continue;
            }


            const pid = this.ns.exec(filename, h.hostname, t, ...args)
            result.push({ threads: t, process: { host: h.hostname, pid: pid } })
            threads -= t;
            if (threads == 0) {
                break;
            }
        }
        return result
    }
    /**
     * @param {string} prog 
     * @param  {...string} args 
     * @returns {number}
     */
    getThreads(prog, ...args) {
        let result = 0;
        this.hosts.forEach((h) => {
            this.ns.ps(h.hostname)
                .filter((p) => p.filename == prog && this.compareArrays(args, p.args))
                .forEach((p) => result += p.threads)
        })
        return result
    }

    /**
     * @param {Process} proc 
     */
    isRunning(proc) {
        return this.ns.ps(proc.host).some(p => p.pid == proc.pid)
    }

    /**
     * @returns {Number}
     */
    getMaxCores() {
        return this.hosts[0].cpuCores
    }

    /**
     * @returns {Number}
     */
    getAvailableRam() {
        return this.hosts.reduce((p, c) => p + c.maxRam - this.ns.getServerUsedRam(c.hostname), 0) - 100
    }

    /**
     * @param {any[]} a 
     * @param {any[]} b 
     * @returns {boolean}
     */
    compareArrays(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    };

    killAll() {
        for (const h of this.hosts) {
            if (h.hostname != "home") {
                this.ns.killall(h.hostname)
                continue
            }
            const procs = this.ns.ps(h.hostname).filter(p => p.filename.startsWith("x"))
            for (const p of procs) {
                this.ns.kill(p.filename, h.hostname, ...p.args)
            }
        }

    }
}
/**
 *  @exports Process

 */

export {
    Scheduler,

}