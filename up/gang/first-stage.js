import { calculateRespectGain, calculateWantedLevelGain } from "./helpers"

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {

    ns.disableLog("sleep")
    ns.disableLog("gang.setTerritoryWarfare")

    const g = ns.gang

    const tasks = new Map(g.getTaskNames().map(t => [t, g.getTaskStats(t)]))


    const combatStatkeys = ["str", "agi", "def", "dex"]
    const memberPrefix = "m-"
    /**
    * @param {import("../../NetscriptDefinitions").GangMemberInfo} member 
    * @param {import("../../NetscriptDefinitions").GangTaskStats} task 
    * @returns {boolean}
    */
    function assign(member, task) {
        if (member.task == task.name) {
            return false
        }
        ns.print(`${member.name} changing task from ${member.task} to ${task.name}`)
        member.task = task.name
        return g.setMemberTask(member.name, task.name)
    }

    while (true) {
        const gang = g.getGangInformation()
        const others = g.getOtherGangInformation()
        const strongestOtherPower = Object.keys(others).filter(k => k != gang.faction && others[k].territory > 0).reduce((p, v) => Math.max(p, others[v].power), 0)
        const isStrongest = Object.keys(others).filter(k => k != gang.faction && others[k].territory > 0 && others[k].power * 1.5 > gang.power).length == 0

        g.setTerritoryWarfare(isStrongest && gang.territory < 1)
        let names = g.getMemberNames()


        for (let i = 0; i < 25; i++) {
            if (!g.canRecruitMember()) {
                break
            }
            const nextNr = names
                .filter(s => s.startsWith(memberPrefix))
                .map((s) => Number(s.substring(memberPrefix.length)))
                .reduce((p, v) => Math.max(p, v), 0) + 1
            g.recruitMember(memberPrefix + nextNr)
            names.push(memberPrefix + nextNr)
        }
        let members = names.map(g.getMemberInformation)

        const target_mult = {
            hack_asc_mult: 6,
            str_asc_mult: 7,
            def_asc_mult: 7,
            agi_asc_mult: 7,
            dex_asc_mult: 7,
            cha_asc_mult: 4,
        }

        await ns.sleep(5000)
        continue
    }
}