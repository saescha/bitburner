

import { renderTable } from "../util/render-table";

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const g = ns.gang

    renderTable(ns.tprint, g.getMemberNames().map((m) => {
        const i = g.getMemberInformation(m)
        return {
            name: i.name,
            task: i.task,
            hack: i.hack,
            str: i.str,
            def: i.def,
            agi: i.agi,
            dex: i.dex,
            cha: i.cha,
            earned: i.moneyGain,
            aug: String(i.augmentations)
        }
    }))
}