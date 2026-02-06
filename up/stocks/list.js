import { fmt, renderTable } from "../util/render-table";



/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const sm = ns.stock

    const shares = sm.getSymbols().map((s) => {
        return {
            symbol: s,
            owned: sm.getPosition(s)[0],
            bought: sm.getPosition(s)[1],
            forecast: sm.getForecast(s),
            ask: sm.getAskPrice(s),
            bid: sm.getBidPrice(s),
            max: sm.getMaxShares(s)
        }
    });

    renderTable(ns.tprintf, shares)
    let long = 0;
    shares.forEach(s => {
        long += s.bid * s.owned
    })


    ns.tprint("stocks value: ", fmt(long))

    ns.tprint("all assets: ", fmt(ns.getPlayer().money + long))
}