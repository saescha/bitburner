import { getAllHosts } from "../util/hosts";

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const myServers = getAllHosts(ns).filter(h => h.info.hasAdminRights)

    for (const h of myServers) {
        ns.scp(["x-grow.js", "x-hack.js", "x-weaken.js"], h.host)
    }
}