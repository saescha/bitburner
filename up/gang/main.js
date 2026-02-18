import { calculateMoneyGain, calculateRespectGain, calculateWantedLevelGain } from "./helpers"

/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {

    ns.disableLog("sleep")
    ns.disableLog("gang.setTerritoryWarfare")

    const g = ns.gang

    const combatStatkeys = ["str", "agi", "def", "dex"]
    const memberPrefix = "m-"

    while (true) {
        const gang = g.getGangInformation()
        const others = g.getOtherGangInformation()
        const isStrongest = Object.keys(others).filter(k => k != gang.faction && others[k].territory > 0 && others[k].power * 1.5 > gang.power).length == 0

        g.setTerritoryWarfare(isStrongest)
        let names = g.getMemberNames()
        let members = g.getMemberNames().map(g.getMemberInformation)

        /**
         * 
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
            if (members.length < 11 && ascent.respect && ascent.respect * 2 > gang.respect) {
                return
            }
            if (Object.keys(ascent)
                .filter((k) => k != "respect")
                .reduce((p, v) => p * ascent[v], 1) > 2) {
                g.ascendMember(n)
            }
        })

        if (ns.getPlayer().money > 10 ** 12) {
            members.forEach(m => {
                g.getEquipmentNames().forEach(e => {
                    g.purchaseEquipment(m.name, e)
                })
            })
        }
        let membersReady = []
        let tasks = new Map(g.getTaskNames().map(t => [t, g.getTaskStats(t)]))

        const trainLimit = 130

        for (const m of members) {
            if (m.hack < 400 && m.hack < 2 * trainLimit / 3 * m.hack_asc_mult) {
                assign(m, tasks.get("Train Hacking"))
                continue
            }
            if (combatStatkeys.reduce((p, v) => p || m[v] < 400 && m[v] < trainLimit * m[v + "_asc_mult"], false)) {
                assign(m, tasks.get("Train Combat"))
                continue
            }
            if (m.cha < 150 && m.cha < trainLimit / 2 * m.cha_asc_mult) {
                assign(m, tasks.get("Train Charisma"))
                continue
            }

            membersReady.push(m)
        }
        const membersNeeded = Math.min(12, 3 + Math.floor(gang.territory * 50))

        if (members.length < membersNeeded) {
            let bestTaskForRespect = null
            let bestRespectGain = 0
            for (const t of tasks.values()) {
                if (t.baseRespect == 0) {
                    continue
                }
                let membersForTask = membersReady.toSorted((a, b) => calculateRespectGain(gang, b, t) - calculateRespectGain(gang, a, t))
                let wantedLevelGain = 0
                let respectGain = 0
                while (membersForTask.length > 0) {
                    const m = membersForTask.shift()
                    wantedLevelGain += calculateWantedLevelGain(gang, m, t)
                    respectGain += calculateRespectGain(gang, m, t)
                    while (wantedLevelGain > 0 && membersForTask.length > 0) {
                        const m2 = membersForTask.pop()
                        wantedLevelGain += calculateWantedLevelGain(gang, m2, tasks.get("Vigilante Justice"))
                    }
                    if (wantedLevelGain <= 0) {
                        if (respectGain > bestRespectGain) {
                            bestRespectGain = respectGain
                            bestTaskForRespect = t
                        }
                    }
                }

            }

            if (bestTaskForRespect) {
                const t = bestTaskForRespect
                let membersForTask = membersReady.toSorted((a, b) => calculateRespectGain(gang, b, t) - calculateRespectGain(gang, a, t))
                let wantedLevelGain = 0
                while (membersForTask.length > 0) {
                    const m = membersForTask.shift()
                    wantedLevelGain += calculateWantedLevelGain(gang, m, t)
                    assign(m, t)
                    while (wantedLevelGain > 0 && membersForTask.length > 0) {
                        const m2 = membersForTask.pop()
                        wantedLevelGain += calculateWantedLevelGain(gang, m2, tasks.get("Vigilante Justice"))
                        assign(m2, tasks.get("Vigilante Justice"))
                    }
                }
                membersForTask.forEach(m => assign(m, tasks.get("Mug People")))
            } else {
                if (gang.wantedLevel > 0) {
                    membersReady.forEach(m => assign(m, tasks.get("Vigilante Justice")))
                } else {
                    membersReady.forEach(m => assign(m, tasks.get("Mug People")))
                }
                membersReady = []
            }
        } else if (!isStrongest) {
            membersReady.forEach(m => assign(m, tasks.get("Territory Warfare")))
            if (gang.wantedLevel > 1) {
                assign(membersReady[membersReady.length - 1], tasks.get("Vigilante Justice"))
            }
        } else {
            let bestTaskForMoney = null
            let bestMoneyGain = 0
            for (const t of tasks.values()) {
                if (t.baseMoney == 0) {
                    continue
                }
                let membersForTask = membersReady.toSorted((a, b) => calculateMoneyGain(gang, b, t) - calculateMoneyGain(gang, a, t))
                let wantedLevelGain = 0
                let moneyGain = 0
                while (membersForTask.length > 0) {
                    const m = membersForTask.shift()
                    wantedLevelGain += calculateWantedLevelGain(gang, m, t)
                    moneyGain += calculateMoneyGain(gang, m, t)
                    while (wantedLevelGain > 0 && membersForTask.length > 0) {
                        const m2 = membersForTask.pop()
                        wantedLevelGain += calculateWantedLevelGain(gang, m2, tasks.get("Vigilante Justice"))
                    }
                    if (wantedLevelGain <= 0) {
                        if (moneyGain > bestMoneyGain) {
                            bestMoneyGain = moneyGain
                            bestTaskForMoney = t
                        }
                    }
                }

                if (bestTaskForMoney) {
                    const t = bestTaskForMoney
                    let membersForTask = membersReady.toSorted((a, b) => calculateMoneyGain(gang, b, t) - calculateMoneyGain(gang, a, t))
                    let wantedLevelGain = 0
                    while (membersForTask.length > 0) {
                        const m = membersForTask.shift()
                        wantedLevelGain += calculateWantedLevelGain(gang, m, t)
                        assign(m, t)
                        while (wantedLevelGain > 0 && membersForTask.length > 0) {
                            const m2 = membersForTask.pop()
                            wantedLevelGain += calculateWantedLevelGain(gang, m2, tasks.get("Vigilante Justice"))
                            assign(m2, tasks.get("Vigilante Justice"))
                        }
                    }
                } else {
                    if (gang.wantedLevel > 0) {
                        membersReady.forEach(m => assign(m, tasks.get("Vigilante Justice")))
                    } else {
                        membersReady.forEach(m => assign(m, tasks.get("Mug People")))
                    }
                    membersReady = []
                }

            }
        }


        await ns.sleep(5000)
        continue
    }
}