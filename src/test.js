var f = require("./samples/fact.js");

test('fact 0 to equal 1', () => {
    expect(f.fact(0)).toBe(1);
});
test('fact 1 to equal 2', () => {
    expect(f.fact(1)).toBe(1);
});
test('fact 2 to equal 6', () => {
    expect(f.fact(2)).toBe(2);
});
test('fact 3 to equal 6', () => {
    expect(f.fact(3)).toBe(6);
});
test('fact 4 to equal 24', () => {
    expect(f.fact(4)).toBe(24);
});
test('fact 5 to equal 120', () => {
    expect(f.fact(5)).toBe(120);
});
test('fact 6 to equal 720', () => {
    expect(f.fact(6)).toBe(720);
});