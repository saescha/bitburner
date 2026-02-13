
/**
 * 
 * @param {import("../../NetscriptDefinitions").NS} ns 
 */
export function main(ns) {
    let hosts = ["home"];
    let visited = new Set();
    while (hosts.length > 0) {
        let host = hosts.pop();
        if (visited.has(host)) {
            continue;
        }
        visited.add(host);
        hosts.push(...ns.scan(host));
    }
    for (const host of visited) {
        let openPorts = 0;
        if (ns.fileExists("FTPCrack.exe")) {
            ns.ftpcrack(host);
            openPorts++;
        }
        if (ns.fileExists("BruteSSH.exe")) {
            ns.brutessh(host);
            openPorts++;
        }
        if (ns.fileExists("relaySMTP.exe")) {
            ns.relaysmtp(host);
            openPorts++;
        }
        if (ns.fileExists("HTTPWorm.exe")) {
            ns.httpworm(host);
            openPorts++;
        }
        if (ns.fileExists("SQLInject.exe")) {
            ns.sqlinject(host);
            openPorts++;
        }
        if (ns.hasRootAccess(host)) {
            continue;
        }
        if (openPorts >= ns.getServerNumPortsRequired(host) && ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(host)) {
            ns.nuke(host);
            ns.tprint(`Gained root access on ${host}`);
            ns.scp(["x-grow.js",
                "x-hack.js", "x-weaken.js", "x-share.js",
                "x-grow-inf.js", "x-hack-inf.js", "x-weaken-inf.js"
                , "show-rooted.js", "/util/hosts.js", "/util/render-table.js"], host)
            const ram = ns.getServerMaxRam(host)
            if (ram > 4) {
                ns.exec("x-weaken-inf.js", host, Math.floor(ram / (2 * ns.getScriptRam("x-weaken-inf.js"))), host)
                ns.exec("x-grow-inf.js", host, Math.floor((ram - ns.getServerUsedRam(host)) / ns.getScriptRam("x-grow-inf.js")), host)
            }
            ns.run("hacks/restore.js", 1, host);
        }
    }
}