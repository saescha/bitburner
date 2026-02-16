
import { renderTable } from "../util/render-table";

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {

    const g = ns.gang

    renderTable(ns.tprint, g.getEquipmentNames().map((e) => {
        return {
            name: e,
            type: g.getEquipmentType(e),
            cost: g.getEquipmentCost(e),

            ...g.getEquipmentStats(e)
        }
    }))

}