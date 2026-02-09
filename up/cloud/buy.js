import { fmt } from "../util/render-table";

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const hostPrefix = "worker-"

    ns.tprint(fmt(ns.getPurchasedServerCost(2 ** 20)))
    const nextNr = ns.getPurchasedServers()
        .filter(s => s.startsWith(hostPrefix))
        .map((s) => Number(s.substring(hostPrefix.length)))
        .reduce((p, v) => Math.max(p, v), 0) + 1

    const hostname = hostPrefix + String(nextNr).padStart(3, "0")
    ns.purchaseServer(hostname, 2 ** 20)

    ns.scp(["x-grow.js",
        "x-hack.js",
        "x-weaken.js",
        "show-rooted.js",
        "/util/hosts.js",
        "/util/render-table.js",
        "/hacks/simple.js",
        "/hacks/max.js"
    ], hostname)

    ns.exec("/hacks/simple.js",hostname)


}