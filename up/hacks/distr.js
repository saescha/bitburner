import { getAllHosts } from "../util/hosts";

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const hostPrefix = "worker-"
    const myServers = getAllHosts(ns).filter(h => h.info.hasAdminRights)

    for (const h of myServers) {
        ns.scp(["x-grow.js", "x-hack.js", "x-weaken.js", "x-share.js"], h.host)
        if (h.host.startsWith(hostPrefix)) {
            const worker = Number(h.host.substring(hostPrefix.length))
            if (worker > 5) {
                ns.killall(h.host)
                const ramNeeded = ns.getScriptRam("x-share.js", h.host)
                ns.exec("x-share.js", h.host, Math.floor(h.info.maxRam / ramNeeded))
            }
        }
    }
}