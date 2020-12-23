function material(id, unitmass){
    return {id: id, unitmass: unitmass};
}

const materials = {
    oil: material('oil', 0.97),
    saltwater: material('salt water', 1.04),
    freshwater: material('fresh water', 1.0),
    honey: material('honey', 1.42),
    quartz: material('quartz', 2.37),
    shale: material('shale', 2.74),
    gravel: material('gravel', 1.38),
    mud: material('mud', 1.95),
    clay: material('clay', 1.74),
    treasure: material('treasure', 4.42 ),
    fish: material('fish', 3.84),
    shrimp: material('shrimp', 1.68),
    algae: material('algae', 0.48 ),
    oysters: material('oysters', 1.27 ),
    clams: material('clams', 1.47 ),
    shells: material('shells', 1.07 ),
    crabs: material('crabs', 1.39 ),
    deadwood: material('deadwood', 0.78 ),
    plums: material('plums', 0.97 ),
    reeds: material('reeds', 0.41 ),
    skunkweed: material('skunkweed', 1.06 ),
    flowers: material('flowers', 0.29 ),
    berries: material('berries', 0.78 ),
    apples: material('apples', 0.82 ),
    wood: material('wood', 0.93 ),
    loam: material('loam', 1.36 ),
    saplings: material('saplings', 0.22 ),
    mushrooms: material('mushrooms', 0.18 ),
    moss: material('moss', 0.36 ),
    vines: material('vines', 0.59 ),
    ore: material('ore', 5.27 ),
    gems: material('gems', 2.31 ),
    snow: material('snow', 0.56 )
}