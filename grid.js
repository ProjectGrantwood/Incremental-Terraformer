class Grid {

    constructor(width, height, size, terrainlist, wrapping = false) {
        [this.width, this.height, this.size, this.terrainlist, this.wrapping] = [width, height, size, terrainlist, wrapping];
        this.cells = [];
        Grid.init(this);
    }

    static init(aGrid, noiseJitter = 0.025) {
        let noiseSeed1 = Math.trunc(Math.random() * 9999999);
        let noiseSeed2 = Math.trunc(Math.random() * 9999999);
        if (noiseSeed1 === noiseSeed2) {
            noiseSeed1 /= Math.trunc(Math.random() * 9999);
        }
        noiseSeed(noiseSeed1);
        for (let x = 0; x < aGrid.width; x++) {
            aGrid.cells[x] = [];
            for (let y = 0; y < aGrid.height; y++) {
                let n0 = x / 100;
                let n1 = y / 100;
                let n2 = noise(n0 / 2, n1 / 2) * (aGrid.width / 200 + aGrid.height / 200) / 4;
                let jitteredNoise = 0.5 - noiseJitter + noise(n0, n1) * noiseJitter;
                let smoothedNoiseWithJitter = (0.5 + jitteredNoise) / 2;
                let n = smoothedNoiseWithJitter + smoothedNoiseWithJitter * fsin(noise(n0, n1, n2));
                aGrid.cells[x][y] = {
                    displayData: {
                        color: lerpColor(color(aGrid.terrainlist[clamp(Math.floor(n * aGrid.terrainlist.length), 0, aGrid.terrainlist.length)].fillStyle), color(n * 255), 0.25)
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
                let n = noise(x * 2 / aGrid.width, y * 2 / aGrid.height);
                let normedElevation = 1 - Math.abs(cell.physicalData.elevation - 50) / 50;
                let normedLatitude = (aGrid.height - Math.abs(y - aGrid.height / 2)) / aGrid.height;
                let interpolatedNoise = (normedElevation + n) / 2;
                let normedTemperature = Math.round(interpolatedNoise * normedLatitude * 100);
                cell.physicalData.temperature = normedTemperature;
                cell.displayData.color = lerpColor(cell.displayData.color, color(n / 2 * 255, (green(cell.displayData.color) + (n * 255 * 2 / 3)) / 2, 255 - n * 4 / 3 * 255), 0.25);
            }
        }
        for (let x = 0; x < aGrid.width; x++) {
            for (let y = 0; y < aGrid.height; y++) {
                let cell = aGrid.find(x, y);
                cell.physicalData.toRender = 'Current Coordinate Data:<br><br>Location: (' + x + ', ' + y + ')<br>Elevation: ' + cell.physicalData.elevation + '<br>Temperature: ' + cell.physicalData.temperature;
                cell.tileDescription = cell.physicalData.terrainType.defaultDescription + '.';
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

    renderCellData(x, y, id, playerName = 'The player') {
        let c = this.find(x, y);
        let materialList = '<br>';
        if (c.materialData.materialsSpawned === true) {
            materialList += 'Available to harvest here:';
            for (let e of Object.getOwnPropertyNames(c.materialData.materials)) {
                let materialString = c.materialData.materials[e].id;
                if (materialString.endsWith('water')){
                    materialString = materialString.replace(/water/, ' water');
                }
                materialList += '<br>' + firstWord(materialString) + ': ' + c.materialData.materials[e].amount;
            }
        }
        let dataView = document.getElementById(id);
        dataView.innerHTML = c.physicalData.toRender + '<br><br>' + playerName + c.tileDescription + '<br>' + materialList;
    }

    renderCellButtons(x, y, id, playerName = 'The player'){
        let c = this.find(x, y);
    }

}