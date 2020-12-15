let world;
let eugene;
let cellSize = 8;
let w = 960;
let h = 840;

function setup(){
    createCanvas(w, h);
    let canvas = document.getElementById('defaultCanvas0');
    let container = document.getElementById('appcontainer');
    container.appendChild(canvas);
    background(255);
    noStroke();
    noiseDetail(10, 0.575)
    world = new Grid(Math.floor(w / cellSize), Math.floor(h /cellSize), cellSize, getTerrains());
    eugene = new Avatar(5, 5, world);
    document.addEventListener('keydown', arrowKeyMovementHandler);
    world.updateAll();
    eugene.move(0, 0);
}

function draw(){
    eugene.blink();
}

function arrowKeyMovementHandler(e){
        let key_code = e.key;
        switch(key_code){
            case 'ArrowLeft': //left arrow key
                eugene.move(-1, 0);
                break;
            case 'ArrowUp': //Up arrow key
                eugene.move(0, -1);
                break;
            case 'ArrowRight': //right arrow key
                eugene.move(1, 0);
                break;
            case 'ArrowDown': //down arrow key
                eugene.move(0, 1);
                break;	
            case ' ': //space bar
                eugene.move(0, 0);
                break;
        }
        preventDefault();
    }