import { fmt, renderTable } from "../util/render-table";

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    let result = []
    for (let i = 10; i < 21; i++) {
        result.push({
            RAM: ns.nFormat(2 ** i, "0 ib"),
            cost: ns.getPurchasedServerCost(2 ** i)
        })
    }
    renderTable(ns.tprintf, result)
}
