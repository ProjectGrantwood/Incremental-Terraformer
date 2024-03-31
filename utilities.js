function firstWord(aString) {
    return aString.charAt(0).toUpperCase() + aString.slice(1);
}

function clamp(val, lo, hi){
    let retval = val < lo ? lo : val;
    retval = retval > hi ? hi : retval;
    return retval;
}

function wrap(val, lo, hi){
    const range = hi - lo;
    let retval = val < lo ? val + range : lo;
    retval =  val > hi ? val - range : val;
    return retval;
}

/*  convert a float to radians. Ideal for values between -1 and 1. */

function floatToRad(floatVal){
    return Math.PI * 2 * floatVal;
}

function distr(val, amt, iterations = 5) {
	let valCopy = val;
	let amtCopy = amt;
	let ratio = valCopy/(amt)
	if (ratio < 1) {
		throw new Error('function distr() failed: argument "val" must be greater than or equal to argument "amt"');
	} else {
		let distributed = [];
		while (distributed.length < amt-1) {
			let toAdd = Math.floor(Math.floor(Math.random() * ratio) + ratio / 2);
			valCopy -= toAdd;
			distributed.push(toAdd)
			amtCopy--;
			ratio = valCopy / amtCopy;
		}
		if (valCopy > 0) {
			distributed.push(valCopy)
        }
        for (let i = 0; i < iterations; i++){
            let hi = Math.max(...distributed);
            let lo = Math.min(...distributed);
            if (hi - 1 > 0){
                hi -= 1;
                lo += 1;
            }
        }
        let ret = [];
        let index;
        while (distributed.length > 0){
            index = Math.floor(Math.random() * distributed.length)
            ret.push(distributed.splice(index, 1));
        }
		return ret;
	}
}

// using the function above to modify the basic trig functions in vanilla javascript.

function fsin(val){
    return Math.sin(floatToRad(val));
}

function fcos(val){
    return Math.cos(floatToRad(val));
}

function ftan(val){
    return Math.tan(floatToRad(val));
}

function randSwitch(a, b){
    if (a!==b){
        return [-1, 1][Math.floor(Math.random() * 2)];
    } else {
        return 0;
    }
}

//Mostly for use with grids. Function returns an array of offsets that can be used to locate the neighbors of a cell in a 2D matrix.
//When using this function to compare a cell in a grid to its neighbors, I recommend writing a function that iterates through the array returned by getNeighborhood(). The next function in this file is a rudimentary example. 

function getNeighborhood(type) {
    let neighborhood;
    switch (type) {
        case 'von neumann':
            neighborhood = [
                
                  [0, -1],
        [-1, 0],/*[0,  0]*/[1,  0],
                  [0,  1]
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
            case 'orthogonal extended':
            neighborhood = [
                [0,  1],
                [0, -1],
                [-1, 0],
                [-1, 1],
                [-1, -1],
                [-1, 1],
                [1, -1],
                [1, 1],
                [2, -2],
                [2, 2],
                [-2, 2],
                [-2, -2]
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
            neighborhood = getNeighborhood('moore');
    }
    return neighborhood;
}

function getNeighbors(x, y, neighborhoodType){
    let neighbors = getNeighborhood(neighborhoodType);
    for (let neighbor of neighbors){
        neighbor[0] += x;
        neighbor[1] += y;
    }
    return neighbors;
}

/*  User evaluator for the Laplace averaging.  All
        computation is in the code: no lookup table is
        used.  */

function laplace(cells, x, y, propertyAccessor) {
    //  Compute Laplace average of neighbours, given
    //  a 2D array of cells, 
    //  a center cell with coordinates (x, y), 
    //  and a string to access whichever numerical property of those cells
    //  the user wants to average.
    //      LaplaceAverage = (4 x (N + E + S + W) +
    //      (NW + NE + SE + SW)) / 20
    let s = 0;

    s += cells[x + 1][y][propertyAccessor]
    s += cells[x - 1][y][propertyAccessor]
    s += cells[x][y - 1][propertyAccessor]
    s += cells[x][y + 1][propertyAccessor]

    s *= 4;

    s += cells[x + 1][y - 1][propertyAccessor]
    s += cells[x - 1][y - 1][propertyAccessor]
    s += cells[x - 1][y + 1][propertyAccessor]
    s += cells[x + 1][y + 1][propertyAccessor]

    return Math.floor((s + 10) / 20);
}

function getObjectProperty(object, index){
    return Object.getOwnPropertyNames(object)[index];
}