
import { renderTable } from "../util/render-table";

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {

    const g = ns.gang

    g.getMemberNames().forEach((n) => {
        const m = g.getMemberInformation(n)
        if (m.str > 80) {
            if (Math.random() < 0.5) {
                g.setMemberTask(n, "Traffick Illegal Arms")
            }
            else {
                g.setMemberTask(n, "Vigilante Justice")
            }
            // g.setMemberTask(n, "Territory Warfare")

        }
        else {
            g.setMemberTask(n, "Train Combat")
        }
    })

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
            earned: i.moneyGain
        }
    }))


}