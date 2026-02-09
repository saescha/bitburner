import { fmt, renderTable } from "../util/render-table";

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const result = ns.infiltration.getPossibleLocations().map((l) => {
        const i = ns.infiltration.getInfiltration(l.name)
        return {
            city: l.city,
            name: l.name,
            diff: i.difficulty,
            SoA: i.reward.SoARep,
            Rep: i.reward.tradeRep,
            cash: i.reward.sellCash
        }
    })

    renderTable(ns.tprintf, result.toSorted((a, b) => a.diff - b.diff))
}