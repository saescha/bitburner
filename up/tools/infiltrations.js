import { fmt, renderTable } from "../util/render-table";


export async function main(ns) {
  const result = ns.infiltration.getPossibleLocations().map((l) => {
    const i = ns.infiltration.getInfiltration(l.name)

    return {
      city: l.city,
      name: l.name,
      diff: i.difficulty,
      SoA: i.reward.SoARep,
      Rep: i.reward.tradeRep,
      cash: i.reward.sellCash,
      levels: i.maxClearanceLevel,
      RepPerLevel: i.reward.tradeRep/i.maxClearanceLevel
    }
  })

  renderTable(ns.tprintf, result.toSorted((a, b) => b.RepPerLevel - a.RepPerLevel).toSorted((a, b) => b.diff - a.diff))
}