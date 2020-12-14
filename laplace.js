
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
