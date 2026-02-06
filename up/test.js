/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {


    for (let i = 0; i < 200; i++) {
        let x = Array(i).fill("x")
        ns.tprintf(x.join(""))
        ns.tprint(i)

    }
}