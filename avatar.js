class Avatar {
    constructor(x, y, grid) {
        this.x = x;
        this.y = y;
        this.grid = grid;
        this.fillStyle = 'orange';
        this.inventory = [];
        this.stats = [];
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
    }

    move(xAmount, yAmount) {
        let movementConstrained = false;
        if (xAmount === 0 && yAmount === 0) {
            this.grid.spawnMaterials(this.x, this.y);
            this.grid.renderCellData(this.x, this.y, 'currentcell');
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
        this.grid.renderCellData(this.x, this.y, 'currentcell')
    }

}