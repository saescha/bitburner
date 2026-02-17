
import { renderTable } from "../util/render-table";

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {

    const g = ns.gang

    renderTable(ns.tprint, g.getEquipmentNames().map((e) => {
        const stats = g.getEquipmentStats(e)
        return {
            name: e,
            type: g.getEquipmentType(e),
            cost: g.getEquipmentCost(e),
            hack: stats.hack ?? 0,
            str: stats.str ?? 0,
            def: stats.def ?? 0,
            dex: stats.dex ?? 0,
            agi: stats.agi ?? 0,
            cha: stats.cha ?? 0
        }
    }))

}