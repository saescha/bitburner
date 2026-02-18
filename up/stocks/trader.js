


/** @param {import("../../NetscriptDefinitions").NS} ns */
export async function main(ns) {
    const sm = ns.stock
    const m = 10 ** 6
    const k = 1000
    ns.disableLog("sleep")
    while (true) {
        const shares = sm.getSymbols().map((s) => {
            return {
                symbol: s,
                owned: sm.getPosition(s),
                forecast: sm.getForecast(s),
                ask: sm.getAskPrice(s),
                bid: sm.getBidPrice(s),
                max: sm.getMaxShares(s)
            }
        });

        shares.sort((a, b) => b.forecast - a.forecast)


        shares.filter(s => s.owned[0] > 0 && s.forecast < 0.53).forEach((s) => {
            sm.sellStock(s.symbol, s.owned[0])
        })

        shares.filter(s => s.owned[2] > 0 && s.forecast > 0.47).forEach((s) => {
            sm.sellShort(s.symbol, s.owned[2])
        })


        const player = ns.getPlayer()
        let spareMoney = Number(ns.read("/stocks/spare-money.txt"))
        let money = player.money - spareMoney

        // shares.filter(s => s.owned[0]).forEach((so) => {
        //     shares.filter(s => s.forecast > so.forecast + 0.1).forEach((sp) => {
        //         if ((sp.max - sp.owned[0]) * sp.ask > so.bid * so.owned[0]) {
        //             sm.sellStock(so.symbol, so.owned[0])
        //             money = ns.getPlayer().money - spareMoney
        //             const amount = Math.min(sp.max / 2 - sp.owned[0], (money - 200 * k) / sp.ask)
        //             const price = sm.buyStock(sp.symbol, amount)
        //             money -= amount * price
        //         }
        //     })
        // })

        while (money > 100 * m && shares.length > 0) {
            let s = shares.shift()
            if (s.forecast > 0.55) {
                let amount = Math.min(s.max - s.owned[0], (money - 200 * k) / s.ask)
                if (amount > s.max) {
                    ns.alert(`max:${s.max} owned:${s.owned[0]} affordable: ${(money - 200 * k) / s.ask} result: ${Math.min(s.max - s.owned[0], (money - 200 * k) / s.ask)} `)
                    amount = s.max
                }
                const price = sm.buyStock(s.symbol, amount)
                money -= amount * price
            }

            if (shares.length < 1) {
                break;
            }
            // s = shares.pop()
            // if (s.forecast < 0.45) {
            //     let amount = Math.min(s.max - s.owned[2], (money - 200 * k) / s.ask)
            //     if (amount > s.max) {
            //         amount = s.max
            //     }
            //     const price = sm.buyShort(s.symbol, amount)
            //     money -= amount * price
            // }
        }

        await ns.stock.nextUpdate();
    }
}