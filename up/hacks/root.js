import { getAllHosts } from "../util/hosts";

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const hosts = getAllHosts(ns)

    for (const h of hosts) {
        ns.ftpcrack
    }
}