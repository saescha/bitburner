import { calculateRespectGain } from "./helpers"

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {

    ns.disableLog("sleep")

    const g = ns.gang

    const gang = g.getGangInformation()
    const combatStatkeys = ["str", "agi", "def", "dex"]
    const memberPrefix = "m-"

    while (true) {
        let names = g.getMemberNames()

        /**
         * 
         * @param {import("../../NetscriptDefinitions").GangMemberInfo} member 
         * @param {String} task 
         * @returns {boolean}
         */
        function assign(member, task) {
            if (member.task == task) {
                return false
            }
            ns.print(`${member.name} changing task from ${member.task} to ${task}`)
            return g.setMemberTask(member.name, task)
        }

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

        names.forEach(n => {
            const ascent = g.getAscensionResult(n)
            if (!ascent)
                return
            if (Object.keys(ascent)
                .filter((k) => k != "respect")
                .reduce((p, v) => p * ascent[v], 1) > 1.2 ** 6) {
                g.ascendMember(n)
            }
        })

        let members = g.getMemberNames().map(g.getMemberInformation)
        let unassignedMembers = []

        for (const m of members) {
            if (m.hack < 100) {
                assign(m, "Train Hacking")
                continue
            }
            if (combatStatkeys.reduce((p, v) => p || m[v] < 100, false)) {
                assign(m, "Train Combat")
                continue
            }
            if (m.cha < 100) {
                assign(m, "Train Charisma")
                continue
            }
            assign(m, "Mug People")
        }


        await ns.sleep(5000)
    }
}