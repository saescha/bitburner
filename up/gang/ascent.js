
import { renderTable } from "../util/render-table";

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {

    const g = ns.gang



    renderTable(ns.tprint, g.getMemberNames().map((m) => {
        return {
            name: m,
            ...g.getAscensionResult(m)
        }
    }))


}