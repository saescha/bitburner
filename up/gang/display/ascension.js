

import { renderTable } from "../../util/render-table";

/** @param {import("../../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const g = ns.gang

    renderTable(ns.tprintf, g.getMemberNames().map((g.getAscensionResult)).filter(x => x))
}