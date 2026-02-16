import { fmt } from "../util/render-table";

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const hostPrefix = "worker-"

    const exp = Number(ns.args[0]??15)

    const nextNr = ns.getPurchasedServers()
        .filter(s => s.startsWith(hostPrefix))
        .map((s) => Number(s.substring(hostPrefix.length)))
        .reduce((p, v) => Math.max(p, v), 0) + 1

    const hostname = hostPrefix + String(nextNr).padStart(3, "0")
    ns.purchaseServer(hostname, 2 ** 15)

    ns.scp(["x-grow.js",
        "x-hack.js",
        "x-weaken.js",
        "x-share.js",
        "show-rooted.js",
        "/util/hosts.js",
        "/util/render-table.js",
        "/hacks/main.js",
        "/hacks/schedule.js",
        "/hacks/restore.js"
    ], hostname)




}