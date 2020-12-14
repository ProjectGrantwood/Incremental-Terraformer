class Grid {

    constructor(width, height, size, terrainlist, wrapping = false) {
        [this.width, this.height, this.size, this.terrainlist, this.wrapping] = [width, height, size, terrainlist, wrapping];
        this.cells = [];
        Grid.init(this);
    }

    static init(aGrid) {
        let noiseSeed1 = Math.trunc(Math.random() * 9999999);
        let noiseSeed2 = Math.trunc(Math.random() * 9999999);
        if (noiseSeed1 === noiseSeed2) {
            noiseSeed1 /= Math.trunc(Math.random() * 9999);
        }
        noiseSeed(noiseSeed1);
        for (let x = 0; x < aGrid.width; x++) {
            aGrid.cells[x] = [];
            for (let y = 0; y < aGrid.height; y++) {
                let n1 = 0.5 - 0.025 + noise(x / 100, y / 100) * 0.025
                let n = ((0.5 + n1) / 2 + (0.5 + n1) / 2 * Math.sin(Math.PI * 2 * noise(x / 100, y / 100, (noise(x / 200, y / 200)) * (aGrid.width / 200 + aGrid.height / 200) / 4)))
                aGrid.cells[x][y] = {
                    displayData: {
                        color: lerpColor(color(aGrid.terrainlist[Math.floor(n * aGrid.terrainlist.length)].fillStyle), color(n * 255), 0.25)
                    },
                    physicalData: {
                        elevation: Math.round(n * 100),
                        terrainType: aGrid.terrainlist[Math.floor(n * aGrid.terrainlist.length)],
                    },
                    materialData: {
                        materialsSpawned: false,
                        materials: {}
                    },
                    npcData: {
                        npcSpawned: false,
                        npcs: {}
                    }
                };
            }
        }
        noiseSeed(noiseSeed2);
        for (let x = 0; x < aGrid.width; x++) {
            for (let y = 0; y < aGrid.height; y++) {
                let cell = aGrid.find(x, y);
                let n = (1 - Math.abs(cell.physicalData.elevation - 50) / 50 + noise((x * 2 / aGrid.width), (y * 2 / aGrid.height))) / 2;
                cell.physicalData.temperature = Math.round(((n * 100) * (aGrid.height - Math.abs(y - aGrid.height / 2)) / aGrid.height));
                cell.displayData.color = lerpColor(cell.displayData.color, color(n / 2 * 255, (green(cell.displayData.color) + (n * 255 * 2 / 3)) / 2, 255 - n * 4 / 3 * 255), 0.25);
            }
        }
        for (let x = 0; x < aGrid.width; x++) {
            for (let y = 0; y < aGrid.height; y++) {
                let cell = aGrid.find(x, y);
                cell.physicalData.toRender = 'Location: (' + x + ', ' + y + ')<br>Elevation: ' + cell.physicalData.elevation + '<br>Terrain: ' + cell.physicalData.terrainType.id + '<br>Temperature: ' + cell.physicalData.temperature;
                cell.tileDescription = '<br>' + cell.physicalData.terrainType.defaultDescription + '.';
            }
        }
    }

    find(x, y) {
        return this.cells[x][y];
    }

    wrap(x, y) {
        let x2 = x;
        let y2 = y;
        if (x2 < 0) {
            x2 += this.width;
        }
        if (x2 >= this.width) {
            x2 -= this.width;
        }
        if (y2 < 0) {
            y2 += this.height;
        }
        if (y2 >= this.height) {
            y2 -= this.height;
        }
        return this.find(x2, y2);
    }

    render(x, y) {
        let c = this.find(x, y);
        fill(c.displayData.color);
        rect(x * this.size, y * this.size, this.size);
    }

    updateAll() {
        for (let x = 0; x < world.width; x++) {
            for (let y = 0; y < world.height; y++) {
                this.render(x, y);
            }
        }
    }

    spawnMaterials(x, y) {
        let c = this.find(x, y);
        for (let e = 0; e < c.physicalData.terrainType.materialSpawns.length; e++) {
            this.spawnMaterialsOnCell(c, e);
        }
    }

    spawnMaterialsOnCell(c, e) {
        if (Math.random() < c.physicalData.terrainType.materialSpawnChance[e]) {
            let id = c.physicalData.terrainType.materialSpawns[e];
            if (c.materialData.materials.hasOwnProperty(id)) {
                this.incrementMaterialAmount(c, id);
            } else {
                this.addMaterialToCell(c, id);
            }
        }
    }

    incrementMaterialAmount(c, id) {
        c.materialData.materials[id].amount += 1;
    }

    decrementMaterialAmount(c, id) {
        if (c.materialData.materials[id].amount > 1) {
            c.materialData.materials[id].amount -= 1;
        }
    }

    addMaterialToCell(c, id) {
        c.materialData.materialsSpawned = true;
        c.materialData.materials[id] = {
            id: id,
            amount: 1
        };
    }

    renderCellData(x, y, id) {
        let c = this.find(x, y);
        let materialList = '<br>';
        if (c.materialData.materialsSpawned === true) {
            materialList += 'Available to harvest here: ';
            for (let e of Object.getOwnPropertyNames(c.materialData.materials)) {
                materialList += '<br>' + c.materialData.materials[e].id + ': ' + c.materialData.materials[e].amount;
            }
        }
        let dataView = document.getElementById(id);
        dataView.innerHTML = c.physicalData.toRender + c.tileDescription + materialList;
    }

    getNeighborhood(type) {
        let neighborhood;
        switch (type) {
            case 'von neumann':
                neighborhood = [
                    [0, 1],
                    [0, -1],
                    [-1, 0],
                    [-1, 1]
                ];
                break;
            case 'orthogonal':
                neighborhood = [
                    [-1, -1],
                    [-1, 1],
                    [1, -1],
                    [1, 1]
                ];
                break;
            case 'moore':
                neighborhood = [
                    [0, 1],
                    [0, -1],
                    [-1, 0],
                    [-1, 1],
                    [-1, -1],
                    [-1, 1],
                    [1, -1],
                    [1, 1]
                ];
                break;
            case 'von neumann extended':
                neighborhood = [
                    [0, 1],
                    [0, -1],
                    [-1, 0],
                    [-1, 1],
                    [-1, -1],
                    [-1, 1],
                    [1, -1],
                    [1, 1],
                    [0, -2],
                    [2, 0],
                    [0, 2],
                    [-2, 0]
                ];
                break;
            case 'circular':
                neighborhood = [
                    [0, 1],
                    [0, -1],
                    [-1, 0],
                    [-1, 1],
                    [-1, -1],
                    [-1, 1],
                    [1, -1],
                    [1, 1],
                    [0, -2],
                    [2, 0],
                    [0, 2],
                    [-2, 0],
                    [-1, -2],
                    [1, -2],
                    [2, -1],
                    [2, 1],
                    [1, 2],
                    [-1, 2],
                    [-2, 1],
                    [-2, -1]
                ]
                break;
            default:
                neighborhood = this.getNeighborhood('moore');
        }
        return neighborhood;
    }

}