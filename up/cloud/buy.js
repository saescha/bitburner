import { fmt } from "../util/render-table";

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const hostPrefix = "worker-"
    const max = Number(ns.args[0] ?? 1)

    for (let i = 0; i < max; i++) {

        const nextNr = ns.getPurchasedServers()
            .filter(s => s.startsWith(hostPrefix))
            .map((s) => Number(s.substring(hostPrefix.length)))
            .reduce((p, v) => Math.max(p, v), 0) + 1

        const hostname = hostPrefix + String(nextNr).padStart(3, "0")
        ns.purchaseServer(hostname, 2 ** 20)

        ns.scp(["x-grow.js",
            "/hacks/main.js",
            "/hacks/schedule.js",
            "/hacks/restore.js",
            "/hacks/root.js",
            "x-hack.js", "x-weaken.js", "x-share.js",
            "x-grow-inf.js", "x-hack-inf.js", "x-weaken-inf.js"
            , "show-rooted.js", "/util/hosts.js", "/util/render-table.js"], hostname)
        const ramNeeded = ns.getScriptRam("x-share.js", hostname)
        ns.exec("x-share.js", hostname, Math.floor(2 ** 20 / ramNeeded))
        ns.tprint(`Purchased new server ${hostname} with 1TB RAM running x-share.js`)
    }

}