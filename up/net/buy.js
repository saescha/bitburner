import { fmt } from "../util/render-table"

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const hn = ns.hacknet

    const money = () => ns.getPlayer().money

    const limits = {
        cores: 16,
        ram: Math.log2(64),
        level: 200
    }

    for (let i = 0; i < 10; i++) {
        if (i >= hn.numNodes()) {
            if (hn.getPurchaseNodeCost() > money())
                return
            i = hn.purchaseNode()
        }
        let stats = hn.getNodeStats(i)
        stats.ram = Math.log2(stats.ram)

        const cores = limits.cores - stats.cores
        if (cores > 0) {
            const cost = hn.getCoreUpgradeCost(i, cores)
            if (cost > money()) {
                return
            }
            hn.upgradeCore(i, cores)
        }
        const ram = limits.ram - stats.ram
        if (ram > 0) {
            const cost = hn.getRamUpgradeCost(i, ram)
            if (cost > money()) {
                return
            }
            hn.upgradeRam(i, ram)
        }
        const level = limits.level - stats.level
        if (level > 0) {
            const cost = hn.getLevelUpgradeCost(i, level)
            if (cost > money()) {
                return
            }
            hn.upgradeLevel(i, level)
        }

    }

}