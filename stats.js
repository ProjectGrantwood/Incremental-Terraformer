
const getStatisticsObject = () => {

    const stats = {
        staticAttributes: {
            strength: 1,
            litheness: 1,
            receptivity: 1,
            focus: 1,
            memory: 1
        },
        dynamicAttributes: {
            health: {
                val: 1
            },
            energy: {
                val: 1
            },
            knowledge: {
                val: 1
            },
            attack: {
                val: 1
            },
            carryWeight: {
                val: 1
            }
        },
    };

    stats.dynamicAttributes.health.calcBase = function (
        atr = stats.staticAttributes,
        str = atr.strength,
        lith = atr.litheness
    ) {
        return 4 + Math.floor(lith / 3) + Math.ceil(str + str * str / 4);
    };

    stats.dynamicAttributes.knowledge.calcBase = function (
        atr = stats.staticAttributes,
        rec = atr.receptivity,
        mem = atr.memory,
        foc = atr.focus
    ) {
        return Math.ceil(mem * (rec + foc) / 2);
    };

    stats.dynamicAttributes.energy.calcBase = function (
        atr = stats.staticAttributes,
        str = atr.strength,
        lith = atr.litheness
    ) {
        return Math.ceil((str + lith * 2) * lith);
    };

    stats.dynamicAttributes.attack.calcBase = function (
        atr = stats.staticAttributes,
        str = atr.strength,
        lith = atr.litheness,
        foc = atr.focus
    ) {
        return Math.ceil(str / 2 + lith / 4 + foc / 4);
    };

    stats.dynamicAttributes.carryWeight.calcBase = function (
        atr = stats.staticAttributes,
        str = atr.strength,
        lith = atr.litheness,
        foc = atr.focus
    ) {
        return 2 * str * Math.ceil(lith / 2.5 + foc / 2.5);
    };

    stats.genStats = function (totalPoints) {
        let points = distr(totalPoints, stats.staticAttributes.length);
        for (let i = 0; i < 5; i++) {
            points.sort(randSwitch);
        }
        let st = Object.getOwnPropertyNames(stats.staticAttributes);
        for (let p = 0; p < points.length; p++) {
            stats.staticAttributes[st[p]] = points[p];
        }
    };

    stats.reCalcDynamicAttribute = function (attributeName) {
        stats.dynamicAttributes[attributeName].val = stats.dynamicAttributes[attributeName].calcBase();
    };

    stats.calcAllDynamicAttributes = function(){
        let st = Object.getOwnPropertyNames(stats.dynamicAttributes);
        for (let attributeName of st){
            stats.reCalcDynamicAttribute(attributeName);
        }
    }
}