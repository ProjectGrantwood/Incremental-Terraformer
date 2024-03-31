let world;
let eugene;
let zoomLayer;
let cellSize = 4;
let zoomRadius = 6;
let zoomedCellSize = 6 * zoomRadius
let w = 600;
let h = 600;


function setup(){
    createCanvas(w, h);
    let canvas = document.getElementById('defaultCanvas0');
    let container = document.getElementById('appcontainer');
    container.appendChild(canvas);
    background(255);
    noStroke();
    noiseDetail(10, 0.575)
    world = new Grid(Math.floor(w / cellSize), Math.floor(h /cellSize), cellSize, getTerrains());
    eugene = new Avatar('Eugene', cellSize - 1, cellSize - 1, world, 'eugene');
    document.addEventListener('keydown', arrowKeyMovementHandler);
    let zoomDisplayElement = document.getElementById("zoomlayer");
    let zoomedElementSideLength = zoomedCellSize * (zoomRadius + 1)
    container.appendChild(zoomDisplayElement);
    zoomLayer = createGraphics(zoomedElementSideLength, zoomedElementSideLength, zoomDisplayElement)
    zoomDisplayElement.setAttribute("style", `display: flex; width: ${zoomedElementSideLength}; height: ${zoomedElementSideLength}; grid-area: zl;`)
    world.updateAll();
    eugene.spawn();
    UILOG.warn(`Greetings, ${eugene.name}. You're a castaway. Such is your luck.`)
}

function draw(){
    world.renderSubsection(zoomLayer, eugene.x, eugene.y);
    eugene.blink();
    zoomLayer.fill("purple");
    zoomLayer.ellipse(zoomedCellSize * (zoomRadius / 2 + 0.5), zoomedCellSize * (zoomRadius / 2 + 0.5), 25);
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
                UILOG.inform("Eugene waits for a tick.");
                break;
        }
        return false;
    }