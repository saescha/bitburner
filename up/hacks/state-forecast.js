class StateForecast {
    /** @typedef {{money:Number,security:Number}} State   */


    /**  @type State   */
    state = null

    /** @type {{time: Number, delta: State, proc:import("./scheduler").Process}[]} */
    deltas = []


    /**
     * @param {State} state 
     */
    constructor(state) {
        this.state = state;

    }

    /**
     * @param {Number} time 
     * @returns {State}
     */
    getStateAt(time) {
        return this.deltas.reduce((p, c) => {
            if (c.time > time) {
                return p
            }
            return {
                money: p.money * c.delta.money,
                security: p.security + c.delta.security
            }
        }, this.state);
    }

    /**
     * @param {Number} time 
     * @returns {State}
     */

    getNextStateAfter(time) {
        const stateAtTime = this.getStateAt(time)
        const next = this.deltas.find(d => d.time > time)
        if (next) {
            return {
                money: stateAtTime.money * next.delta.money,
                security: stateAtTime.security + next.delta.security
            }
        }
        return stateAtTime
    }

    /**
     * @param {function (import("./scheduler").Process): boolean} cb 
     */
    filterDeltasByProc(cb) {
        this.deltas = this.deltas.filter(d => cb(d.proc))
    }

    setState(state) {
        this.state = state
    }

    /**
     * @param {Number} time 
     * @param {State} delta 
     * @param {import("./scheduler").Process} proc 
     */
    addDelta(time, delta, proc) {
        const index = this.deltas.findIndex(d => d.time > time)
        if (index == -1) {
            this.deltas.push({ time, delta, proc })
        } else {
            this.deltas.splice(index, 0, { time, delta, proc })
        }
    }
}