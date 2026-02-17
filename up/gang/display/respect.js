

import { renderTable } from "../../util/render-table";
import { calculateMoneyGain, calculateRespectGain, calculateWantedLevelGain } from "../helpers";

/** @param {import("../../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const g = ns.gang

    const gang = g.getGangInformation()

    const members = g.getMemberNames().map(g.getMemberInformation)

    const tasks = g.getTaskNames().map(g.getTaskStats).filter((t) => t.baseWanted != 0)



    renderTable(ns.tprintf, tasks.map((t) => {
        let r = {
            task: t.name,
            respect: Math.max(...members.map((m) => calculateRespectGain(gang, m, t))),
            money: Math.max(...members.map((m) => calculateMoneyGain(gang, m, t))),
            wanted: Math.max(...members.map((m) => calculateWantedLevelGain(gang, m, t))),
        }
        return r;
    }))

    const t = g.getTaskStats("Terrorism")

    ns.tprintf(members.toSorted((a, b) => calculateRespectGain(gang, b, t) - calculateRespectGain(gang, a, t))[2].name)
}