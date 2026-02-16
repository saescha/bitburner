import { getAllHosts } from "./util/hosts";
import { renderTable } from "./util/render-table";

/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const myServers = getAllHosts(ns).filter(h => h.info.hasAdminRights && h.info.maxRam > 0).sort((a, b) => b.info.baseDifficulty - a.info.baseDifficulty)

    renderTable(ns.tprintf, myServers.map((h) => {
        let x = (h.info.baseDifficulty - h.info.minDifficulty)
        x = x == 0 ? 1 : x
        return {
            host: h.host,
            cpu: h.info.cpuCores,
            RAM: h.info.maxRam,
            free: h.info.maxRam - h.info.ramUsed
        }
    }))
}