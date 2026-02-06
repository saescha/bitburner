import { getAllHosts } from "../util/hosts"


class Scheduler {
    /** @type {import("../../NetscriptDefinitions").Server[]} */
    hosts = []
    /**@type {import("../../NetscriptDefinitions").NS} */
    ns = null

    /**
     * 
     * @param {import("../../NetscriptDefinitions").NS} ns 
     * @param {import("../../NetscriptDefinitions").Server[]} hosts 
     */
    constructor(ns, hosts) {
        this.ns = ns
        this.ns.disableLog("getScriptRam")
        this.hosts = hosts.toSorted((a, b) => a.maxRam - b.maxRam)
        ns.print(this.hosts)
    }
    /**
     * 
     * @param {string} filename 
     * @param {number} threads 
     * @param {string[]} args 
     */
    schedule(filename, threads, ...args) {
        let needed = this.ns.getScriptRam(filename)
        for (let i = 0; i < this.hosts.length; i++) {
            const h = this.hosts[i];
            const free = h.maxRam - this.ns.getServerUsedRam(h.hostname) - (h.hostname == "home" ? 30 : 0)
            const t = Math.min(Math.floor(free / needed), threads)
            if (t == 0) {
                continue;
            }

            this.ns.exec(filename, h.hostname, t, ...args)
            threads -= t;
            if (threads == 0) {
                return
            }
        }
    }
    /**
     * 
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

    getAvailableRam() {
        return this.hosts.reduce((p, c) => p + c.maxRam - this.ns.getServerUsedRam(c.hostname), 0) - 30
    }

    compareArrays(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    };
    /**
     * 
     * @param {string} filename 
     * @param {string[]} args 
     */
    unschedule(filename, ...args) {
        for (let i = (this.hosts.length - 1); i >= 0; i--) {
            const h = this.hosts[i]
            const p = this.ns.ps(h.hostname).find(p => p.filename == filename && this.compareArrays(p.args, args))
            if (p) {
                this.ns.kill(p.filename, h.hostname, ...p.args)
                return
            }
        }
    }

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

export {
    Scheduler
}