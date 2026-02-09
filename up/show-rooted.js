import { getAllHosts } from "./util/hosts";
import { renderTable } from "./util/render-table";

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
            sec_abs: h.info.hackDifficulty,
            hackChance: ns.hackAnalyzeChance(h.host) * 100,
            hack: ns.hackAnalyze(h.host) * 100,
            money: h.info.moneyAvailable * 100 / h.info.moneyMax,
            secured: (h.info.hackDifficulty - h.info.minDifficulty) / x * 100,
        }
    }))
}