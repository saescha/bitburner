import { getAllHosts } from "../util/hosts";
import { fmt, renderTable } from "../util/render-table";

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const myServers = getAllHosts(ns).filter(h => h.info.hasAdminRights && !h.info.backdoorInstalled
        && (ns.args.length == 0 || ns.args.includes(h.host))
    )

    renderTable(ns.tprintf, myServers.map((h) => {
        let x = (h.info.baseDifficulty - h.info.minDifficulty)
        x = x == 0 ? 1 : x
        return {
            host: h.host,
            company: h.info.organizationName,
            path: h.path.map(p=>`connect ${p}`).join("; "),
        }
    }))
}