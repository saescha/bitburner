import { Scheduler } from "./scheduler"

const moneyToSteal = 0.1
class Host {
    /** @type {import("../../NetscriptDefinitions").NS} */
    ns = null
    /** @type {import("../../NetscriptDefinitions").Server} */
    server = null

    /** @type {StateForecast} */
    stateForecast = null

    /** @type {Scheduler} */
    scheduler = null

    hackTime = 0
    growTime = 0
    weakenTime = 0

    hackThreads = 0
    growThreads = 0

    targetSecurity = 0


    /**
     * 
     * @param {import("../../NetscriptDefinitions").NS} ns 
     * @param {import("../../NetscriptDefinitions").Server} server 
     * @param {Scheduler} scheduler
     */
    constructor(ns, server, scheduler) {
        this.ns = ns
        this.server = server
        this.scheduler = scheduler
        this.hackTime = ns.getHackTime(server.hostname)
        this.growTime = ns.getGrowTime(server.hostname)
        this.weakenTime = ns.getWeakenTime(server.hostname)

        this.hackThreads = Math.floor(Math.log(1 - moneyToSteal) / Math.log(1 - ns.hackAnalyze(server.hostname)))
        this.growThreads = Math.ceil(ns.growthAnalyze(server.hostname, 1 / (1 - moneyToSteal)))

        this.targetSecurity = server.baseDifficulty - ns.hackAnalyzeSecurity(this.hackThreads, server.hostname) - ns.growthAnalyzeSecurity(this.growThreads, server.hostname, scheduler.getMaxCores())


        this.stateForecast = new StateForecast({ money: server.moneyAvailable, security: server.hackDifficulty })
    }

    getCurrentState() {
        return {
            money: this.ns.getServerMoneyAvailable(this.server.hostname),
            security: this.ns.getServerSecurityLevel(this.server.hostname)
        }
    }

    weaken() {
        const forecast 
        for(let cores = this.scheduler.getMaxCores(); cores > 0; cores--) {
            const effectPerThread = this.ns.weakenAnalyze(1, cores)
            const threads = Math.ceil()
    }
}

export {
    Host
}

