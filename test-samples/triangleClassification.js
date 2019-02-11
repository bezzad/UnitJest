// reference: page 4 of https://ieeexplore.ieee.org/document/6354714
module.exports = function triangleClassification(x, y, z) {
    if ((x + y > z) && (y + z > x) && (z + x > y)) {
        if ((x != y) && (y != z) & (z != x)) {
            return "Triangle is scalene";
        }
        else if (((x == y) && (y != z)) || ((y == z) && (z != x)) || ((z == x) && (x != y))) {
            return "Triangle is isosceles";
        }
        else {
            return "Triangle is equilateral"
        }
    }
    else {
        return "Not a triangle";
    }
}