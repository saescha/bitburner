import { getAllHosts } from "./hosts"
import { renderTable } from "./render-table"

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {



    const hf = ns.formulas.hacking
    const h = String(ns.args[0] || "sigma-cosmetics")
    const player = ns.getPlayer()
    const s = ns.getServer(h)

    ns.tprint(ns.getWeakenTime(h))
    ns.tprint(ns.getGrowTime(h))
    ns.tprint(ns.getHackTime(h))
    return

    const hackThreads = 50

    let result = []

    const cores = 6


    const m = player.mults.hacking_money



    ns.tprint(hf.hackPercent(s, player), ns.hackAnalyze(h))

    ns.tprint(ns.hackAnalyzeThreads(h, 12508000))



    const stealPercent = 1 - ((1 - ns.hackAnalyze(h) * m) ** hackThreads)
    ns.tprint(s.moneyAvailable * stealPercent)

    const remainFactor = 1 - stealPercent


    const growThreads = Math.ceil(
        ns.growthAnalyze(
            h,
            player.mults.hacking_money / remainFactor,
            cores
        ))
    const weakenEffect = ns.weakenAnalyze(1, cores)

    const weakenDemand = ns.hackAnalyzeSecurity(hackThreads, h) + 0.004 * growThreads
    const weakenThreads = Math.ceil(weakenDemand / weakenEffect)

    const moneyStolen = s.moneyAvailable * (remainFactor)
    ns.tprint(s.moneyAvailable * remainFactor)

    ns.tprint(ns.getWeakenTime(h))

    result.push({
        name: "host",
        value: h
    })
    result.push({
        name: `hack security increase ${hackThreads}t`,
        value: ns.hackAnalyzeSecurity(hackThreads, h)
    })
    result.push({
        name: `grow security increase ${growThreads}t`,
        value: ns.growthAnalyzeSecurity(growThreads, h, cores)
    })
    result.push({
        name: `weaken threads needed to compensate`,
        value: weakenThreads
    })
    result.push({
        name: `actual weaken effect ${weakenThreads}t`,
        value: ns.weakenAnalyze(weakenThreads, cores)
    })
    result.push({
        name: `money stolen with ${hackThreads}t`,
        value: moneyStolen
    })
    result.push({
        name: `money left after stealing with ${hackThreads}t`,
        value: s.moneyAvailable - moneyStolen
    })
    result.push({
        name: `factor to grow to get back to current moneyt`,
        value: 1 / ((1 - ns.hackAnalyze(h)) ** hackThreads)
    })


    renderTable(ns.tprintf, result)


}