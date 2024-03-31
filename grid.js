class Grid {

    constructor(width, height, size, terrainlist, wrapping = false) {
        [this.width, this.height, this.size, this.terrainlist, this.wrapping] = [width, height, size, terrainlist, wrapping];
        this.cells = [];
        Grid.init(this);
    }

    static init(aGrid, noiseJitter = 0.075) {
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
                let n2 = noise(n0 / 2, n1 / 2) * (aGrid.width / 150 + aGrid.height / 150) / 4;
                let jitteredNoise = 0.5 - noiseJitter + noise(n0, n1, Math.random()) * noiseJitter;
                let smoothedNoiseWithJitter = (0.5 + jitteredNoise) / 2;
                let n = smoothedNoiseWithJitter + smoothedNoiseWithJitter * fsin(noise(n0, n1, n2) ** (n2 * 4));
                aGrid.cells[x][y] = {
                    displayData: {
                        color: lerpColor(color(aGrid.terrainlist[clamp(Math.floor(Math.abs(n) * aGrid.terrainlist.length), 0, aGrid.terrainlist.length)].fillStyle), color(n * 255), 0.25)
                    },
                    physicalData: {
                        elevation: Math.round(Math.abs(n) * 100),
                        terrainType: aGrid.terrainlist[Math.floor(Math.abs(n) * aGrid.terrainlist.length)],
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
        } else {
            delete c.materialData.materials[id];
        }
    }

    addMaterialToCell(c, id, materialList = materials) {
        c.materialData.materialsSpawned = true;
        c.materialData.materials[id] = {
            id: id,
            unitmass: materialList[id].unitmass,
            amount: 1
        };
    }

    renderCellData(x, y, id, playerName = 'The player') {
        let c = this.find(x, y);
        let materialList = '<br>';
        if (c.materialData.materialsSpawned === true) {
            materialList += 'Available to harvest here:';
            for (let m of Object.getOwnPropertyNames(c.materialData.materials)) {
                let materialString = c.materialData.materials[m].id;
                if (materialString.endsWith('water')) {
                    materialString = materialString.replace(/water/, ' water');
                }
                materialList += `<div class="harvestable" onclick="eugene.pickUp('${c.materialData.materials[m].id}')"> ${firstWord(materialString)}: ${c.materialData.materials[m].amount}</div>`;
            }
        }
        let dataView = document.getElementById(id);
        dataView.innerHTML = c.physicalData.toRender + '<br><br>' + playerName + c.tileDescription + '<br>' + materialList;
    }
    
    getSubsection(x, y, size = zoomRadius) {
        const halfSize = Math.floor(size / 2)
        let subsection = [];
        for (let i = x - halfSize; i < x + halfSize + 1; i++) {
            subsection.push([]);
            
            for (let j = y - halfSize; j < y + halfSize + 1; j++) {
                subsection[subsection.length - 1].push(this.wrap(i, j));
            }
        }
        return subsection;
    }
    
    renderSubsection(zoomLayer, x, y, size = zoomRadius){
        let subsection = this.getSubsection(x, y, size);
        for (let x = 0; x < subsection.length; x++){
            for (let y = 0; y < subsection[x].length; y++){
                let c = subsection[x][y]
                zoomLayer.fill(c.displayData.color);
                zoomLayer.rect(x * zoomedCellSize, y * zoomedCellSize, zoomedCellSize);
            }
        }
    }

}