
import { renderTable } from "../util/render-table";

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {

    const g = ns.gang

    g.getMemberNames().forEach((m)=>{
        g.setMemberTask(m,"Train Charisma")
    })



 


}