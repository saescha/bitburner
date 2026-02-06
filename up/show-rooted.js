import { getAllHosts } from "./util/hosts";
import { fmt, renderTable } from "./util/render-table";

/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const myServers = getAllHosts(ns).filter(h => h.info.hasAdminRights && h.info.moneyMax > 0).sort((a, b) => b.info.baseDifficulty - a.info.baseDifficulty)

    renderTable(ns.tprintf, myServers.map((h) => {
        let x = (h.info.baseDifficulty - h.info.minDifficulty)
        x = x == 0 ? 1 : x
        return {
            host: h.host,
            diff: h.info.baseDifficulty,
            max_money: h.info.moneyMax,
            growth: h.info.serverGrowth,
            money: fmt(h.info.moneyAvailable * 100 / h.info.moneyMax) + "",
            secured: fmt((h.info.hackDifficulty - h.info.minDifficulty) / x * 100),
            cpu: h.info.cpuCores,
            ram: h.info.maxRam,
        }
    }))
}