console.log("Hola Typescript");
// var nombre = "algo"; // NO VAMOS A USAR VAR NUNCA
var nombres = "Adrian";
nombres = "A";
nombres = 'C';
// nombres = 1;
var nombreTS = "";
console.log(typeof nombres, "nombres");
var numeros = 1;
var numerosTS = 1;
console.log(typeof numeros, "numeros");
numeros = 1.1; // Decimales
console.log(typeof numeros, "numeros decimales");
var booleanos = true;
var booleanosTS = false;
booleanos = false;
console.log(typeof booleanos, "booleanos");
var nulos = null;
var nulosTS = null;
console.log(typeof nulos, "nulos");
var arreglos = [];
var arreglosTS = [];
var arreglosTS2 = [];
console.log(typeof arreglos, "arreglos");
var objetos = {};
var objetosTS = {};
console.log(typeof objetos, "objetos");
var undefineds = undefined;
var undefinedsTS = undefined;
console.log(typeof undefineds, "undefineds");
// Truty y Falsy
var trutyFalsy;
trutyFalsy = "";
if (trutyFalsy) { // ""
    console.log("Truty");
}
else {
    console.log("falsy");
}
trutyFalsy = "a";
if (trutyFalsy) { // "a"
    console.log("Truty");
}
else {
    console.log("falsy");
}
trutyFalsy = -1;
if (trutyFalsy) { // -1
    console.log("Truty");
}
else {
    console.log("falsy");
}
trutyFalsy = 0;
if (trutyFalsy) { // 0
    console.log("Truty");
}
else {
    console.log("falsy");
}
trutyFalsy = 1;
if (trutyFalsy) { // 1
    console.log("Truty");
}
else {
    console.log("falsy");
}
trutyFalsy = null;
if (trutyFalsy) { // null
    console.log("Truty");
}
else {
    console.log("falsy");
}
trutyFalsy = {};
if (trutyFalsy) { // {}
    console.log("Truty");
}
else {
    console.log("falsy");
}
trutyFalsy = [];
if (trutyFalsy) { // []
    console.log("Truty");
}
else {
    console.log("falsy");
}
