class Avatar {
    constructor(avatarName, x, y, grid, avatarId = avatarName) {
        this.name = avatarName;
        this.id = avatarId;
        this.x = x;
        this.y = y;
        this.grid = grid;
        this.size = this.grid.size - 1;
        this.fillStyle = 'orange';
        this.inventory = {};
        this.staticAttributes = {
            strength: 1,
            litheness: 1,
            receptivity: 1,
            focus: 1,
            memory: 1
        };
        this.dynamicAttributes = {
            health: {val: 1, total: 1},
            energy: {val: 1, total: 1},
            knowledge: {val: 1, total: 1},
            attack: {val: 1, total: 1},
            carryweight: {val: 1, total: 1}
        };
        Avatar.genStats(18, this);
        Avatar.calcAllDynamicAttributes(this);
    }

    spawn(){
        let allowedSpawns = [];
        for (let x = 0; x < this.grid.width; x++){
            for (let y = 0; y < this.grid.height; y++){
                let cell = this.grid.find(x, y);
                let id = cell.physicalData.terrainType.id;
                if (id.includes('Sand 1')){
                    allowedSpawns.push([x, y]);
                }
            }
        }
        let spawnCoordinates = allowedSpawns[Math.floor(Math.random() * allowedSpawns.length)];
        this.x = spawnCoordinates[0];
        this.y = spawnCoordinates[1];
        this.move(0, 0);
    }

    calcBase(atr){
        let statAtr = Object.getOwnPropertyNames(this.staticAttributes);
        let str = parseInt(this.staticAttributes[statAtr[0]]);
        let lith = parseInt(this.staticAttributes[statAtr[1]]);
        let rec = parseInt(this.staticAttributes[statAtr[2]]);
        let foc = parseInt(this.staticAttributes[statAtr[3]]);
        let mem = parseInt(this.staticAttributes[statAtr[4]]);
        switch(atr){
            case 'health' :
                this.dynamicAttributes[atr].total = 4 + lith * str;
                this.dynamicAttributes[atr].val = this.dynamicAttributes[atr].total
                break;
            case 'energy' :
                this.dynamicAttributes[atr].total = Math.floor(4 + lith * str + lith * (lith + foc) / 2);
                this.dynamicAttributes[atr].val = this.dynamicAttributes[atr].total
                break;
            case 'knowledge' :
                this.dynamicAttributes[atr].total = Math.ceil(mem * (rec + foc) / 2);
                this.dynamicAttributes[atr].val = this.dynamicAttributes[atr].total
                break;
            case 'attack' :
                this.dynamicAttributes[atr].total = Math.ceil(str / 2 + lith / 4 + foc / 4);
                this.dynamicAttributes[atr].val = this.dynamicAttributes[atr].total
                break;
            case 'carryweight' :
                this.dynamicAttributes[atr].total = 4 + 2 * str * Math.ceil(lith / 2.5 + foc / 2.5);
                this.dynamicAttributes[atr].val = 0;
                break;
        }
        ;
    }

    static genStats(total, anAvatar) {
        let points = distr(total, 5)
        let ind = 0;
        let attributeNames = Object.getOwnPropertyNames(anAvatar.staticAttributes)
        for (let s of attributeNames){
            anAvatar.staticAttributes[s] = points[ind];
            ind++;
        }
    }

    static calcAllDynamicAttributes(anAvatar) {
        let st = Object.getOwnPropertyNames(anAvatar.dynamicAttributes);
        for (let attributeName of st){
            anAvatar.calcBase(attributeName);
        }
    }

    pickUp(itemId){
        let c = this.grid.find(this.x, this.y);
        let item = c.materialData.materials[itemId];
        if (this.dynamicAttributes.carryweight.val + item.unitmass > this.dynamicAttributes.carryweight.total) {
            UILOG.warn(`${this.name} cannot pick up ${itemId}: they are carrying too much!`)
        } else {
            if (this.inventory[itemId] === undefined){
                this.inventory[itemId] = {item: Object.create(item), amount: 1, elementCreated: false};
            } else {
                this.inventory[itemId].amount += 1;
            }
            this.calcCarriedWeight();
            this.grid.decrementMaterialAmount(c, itemId);
            if (JSON.stringify(c.materialData.materials) === '{}'){
                c.materialData.materialsSpawned = false;
            }
            this.grid.renderCellData(this.x, this.y, 'currentcell', this.name)
        }
    }
    
    drop(itemId){
        let c = this.grid.find(this.x, this.y);
        let item = c.materialData.materials[itemId];
        if (this.inventory[itemId].amount > 1){
            this.inventory[itemId].amount -= 1;
        } else {
            delete this.inventory[itemId];
        }
        this.calcCarriedWeight();
        this.grid.incrementMaterialAmount(c, itemId);
        this.grid.renderCellData(this.x, this.y, 'currentcell', this.name)
        UILOG.inform(`${this.name} drops ${itemId}.`)
    }

    calcCarriedWeight(){
        if (Object.keys(this.inventory).length === 0) {
            this.dynamicAttributes.carryweight.val = 0;
        } else {
            let sum = 0;
            for (let i of Object.keys(this.inventory)){
                sum += this.inventory[i].item.unitmass * this.inventory[i].amount
            }
            this.dynamicAttributes.carryweight.val = Math.round(sum * 100) / 100;
        }
    }

    blink() {
        if (frameCount % 24 === 0) {
            if (this.fillStyle === 'orange') {
                this.fillStyle = 'purple';
            } else if (this.fillStyle === 'purple') {
                this.fillStyle = 'orange'
            }
            this.render();
        }
    }

    render() {
        let x = this.grid.size * this.x + this.grid.size / 2;
        let y = this.grid.size * this.y + this.grid.size / 2;
        fill(this.fillStyle);
        ellipse(x, y, this.size);
        this.renderStatsData('playerdata');
    }
    
    handleBoundaryCollision(xAmount, yAmount) {
        let movementConstrained = false;
        let x = this.x + xAmount;
        let y = this.y + yAmount;
        if (this.grid.wrapping){
            x = wrap(x, 0, this.grid.width);
            y = wrap(y, 0, this.grid.height);
        } else {
            if (this.x < 0 || this.y < 0 || this.x >= this.grid.width || this.y >= this.grid.height) {
                movementConstrained = true;
            }
            x = clamp(x, 0, this.grid.width - 1);
            y = clamp(y, 0, this.grid.height - 1);
        }
        this.x = x;
        this.y = y;
        return movementConstrained;
    }

    move(xAmount, yAmount) {
        if (xAmount === 0 && yAmount === 0) {
            this.grid.spawnMaterials(this.x, this.y);
            this.grid.renderCellData(this.x, this.y, 'currentcell', this.name);
            this.grid.render(this.x, this.y);
            return this.render();
        }
        let movementConstrained = this.handleBoundaryCollision(xAmount, yAmount)
        this.render();
        if (!movementConstrained) {
            this.grid.render(this.x - xAmount, this.y - yAmount);
            this.grid.spawnMaterials(this.x, this.y);
        }
        this.grid.renderCellData(this.x, this.y, 'currentcell', this.name)
    }

    renderStatsData(id) {
        let staticAtr = Object.getOwnPropertyNames(this.staticAttributes);
        let staticString = '';
        for (let i of staticAtr){
            staticString += firstWord(i) + ': ' + this.staticAttributes[i] + '<br>';
        }
        let dynamicAtr = Object.getOwnPropertyNames(this.dynamicAttributes);
        let dynamicString = '';
        for (let i of dynamicAtr){
            dynamicString += (firstWord(i).match('Carryweight') ? 'Carry Weight' : firstWord(i)) + ': ' + this.dynamicAttributes[i].val + ' / ' + this.dynamicAttributes[i].total + '<br>';
        }
        
        for (let i of Object.keys(this.inventory)){
            let item = this.inventory[i];
            if (item.elementCreated){
                const itemElement = document.getElementById(`${item.item.id}-inventory`);
                itemElement.innerHTML = `${item.item.id} x${item.amount}`
            } else {
                const invElement = document.getElementById("playerinventory");
                invElement.innerHTML += `<div id="${item.item.id}-inventory" class="inventory-item">${item.item.id} x${item.amount}</div>`;
                item.elementCreated = true;
            }
        }
        let dataView = document.getElementById(id);
        dataView.innerHTML = `${this.name}'s attributes:<br><br>${staticString}<br>${dynamicString}`;
    }

}