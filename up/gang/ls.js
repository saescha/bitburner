
import { renderTable } from "../util/render-table";

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {

    const g = ns.gang

    const others = g.getOtherGangInformation()

    for (const o in others) {
        ns.tprint(o)
        ns.tprint(others[o])
    }


    renderTable(ns.tprintf,
        g.getTaskNames().map((t) => {
            let r = g.getTaskStats(t)
            delete r.desc
            delete r.territory
            for (const key in r) {
                if (!Object.hasOwn(r, key)) continue;

                if (key.includes("Weight")) {
                    const newKey = key.replace("Weight", "")
                    r[newKey] = r[key]
                    delete r[key]
                }
                if (key.includes("base")) {
                    const newKey = key.replace("base", "")
                    r[newKey] = r[key]
                    delete r[key]
                }

            }
            return r
        })
    )



}