
import { renderTable } from "../util/render-table";

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {

    const memberPrefix = "m-"
    const g = ns.gang

    const max = Number(ns.args[0] ?? 1)

    for (let i = 0; i < max; i++) {

        const nextNr = g.getMemberNames()
            .filter(s => s.startsWith(memberPrefix))
            .map((s) => Number(s.substring(memberPrefix.length)))
            .reduce((p, v) => Math.max(p, v), 0) + 1
        if (!g.recruitMember(memberPrefix + nextNr))
            break
    }
    g.getTaskNames

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
            cha: i.cha
        }
    }))
}