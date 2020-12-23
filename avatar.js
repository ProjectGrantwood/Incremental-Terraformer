class Avatar {
    constructor(avatarName, x, y, grid) {
        this.name = avatarName;
        this.x = x;
        this.y = y;
        this.grid = grid;
        this.fillStyle = 'orange';
        this.inventory = [];
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
        let str = this.staticAttributes[statAtr[0]];
        let lith = this.staticAttributes[statAtr[1]]
        let rec = this.staticAttributes[statAtr[2]];
        let foc = this.staticAttributes[statAtr[3]];
        let mem = this.staticAttributes[statAtr[4]];
        let retVal = 0;
        switch(atr){
            case 'health' :
                this.dynamicAttributes[atr].total = 4 + Math.floor(lith / 3) + Math.ceil(str + str * str / 4);
                break;
            case 'energy' :
                this.dynamicAttributes[atr].total = Math.ceil((str + lith * 2) * lith);
                break;
            case 'knowledge' :
                this.dynamicAttributes[atr].total = Math.ceil(mem * (rec + foc) / 2);
                break;
            case 'attack' :
                this.dynamicAttributes[atr].total = Math.ceil(str / 2 + lith / 4 + foc / 4);
                break;
            case 'carryweight' :
                this.dynamicAttributes[atr].total = 2 * str * Math.ceil(lith / 2.5 + foc / 2.5);
                break;
        }
        this.dynamicAttributes[atr].val = this.dynamicAttributes[atr].total;
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

    pickUp(item){
        if (this.dynamicAttributes.carryweight.val + item.unitmass <= this.dynamicAttributes.carryweight.total) {
            return;
        } else {
            this.inventory.push(item);
            this.calcCarriedWeight();
        }
    }

    calcCarriedWeight(){
        if (this.inventory.length > 0) {
            this.dynamicAttributes.carryweight.val = 0;
        } else {
            let sum = 0;
            for (let i = 0; i < this.inventory.length; i++){
                sum += this.inventory[i].unitmass;
            }
            this.dynamicAttributes.carryweight.val = sum;
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
        fill(this.fillStyle)
        ellipse(x, y, this.grid.size);
        this.renderStatsData('playerdata');
    }

    move(xAmount, yAmount) {
        let movementConstrained = false;
        if (xAmount === 0 && yAmount === 0) {
            this.grid.spawnMaterials(this.x, this.y);
            this.grid.renderCellData(this.x, this.y, 'currentcell', this.name);
            this.grid.render(this.x, this.y);
            return this.render();
        }
        let x = this.x + xAmount;
        let y = this.y + yAmount;
        if (this.x < 0) {
            if (this.grid.wrapping) {
                x += this.grid.width;
            } else {
                x = 0;
                movementConstrained = true;
            }
        }
        if (this.y < 0) {
            if (this.grid.wrapping) {
                y += this.grid.height;
            } else {
                y = 0;
                movementConstrained = true;
            }
        }
        if (x >= this.grid.width) {
            if (this.grid.wrapping) {
                x -= this.grid.width;
            } else {
                x = this.grid.width - 1;
                movementConstrained = true;
            }
        }
        if (y >= this.grid.height) {
            if (this.grid.wrapping) {
                y -= this.grid.height;
            } else {
                y = this.grid.height - 1;
                movementConstrained = true;
            }
        }
        this.x = x;
        this.y = y;

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
        for (let i = 0; i < staticAtr.length; i++){
            staticString += firstWord(staticAtr[i]) + ': ' + this.staticAttributes[staticAtr[i]] + '<br>';
        }
        let dynamicAtr = Object.getOwnPropertyNames(this.dynamicAttributes);
        let dynamicString = '';
        for (let i = 0; i < dynamicAtr.length; i++){
            dynamicString += (firstWord(dynamicAtr[i]).match('Carryweight') ? 'Carry Weight' : firstWord(dynamicAtr[i])) + ': ' + this.dynamicAttributes[dynamicAtr[i]].val + ' / ' + this.dynamicAttributes[dynamicAtr[i]].total + '<br>';
        }
        let dataView = document.getElementById(id);
        dataView.innerHTML = `${this.name}'s attributes:<br><br>${staticString}<br>${dynamicString}`;
    }

}