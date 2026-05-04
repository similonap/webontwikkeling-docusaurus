// Maak een nieuw project aan met de naam `math-fun`.

// Schrijf de volgende functies:

// * `add` die twee getallen optelt
// * `subtract` die twee getallen van elkaar aftrekt
// * `multiply` die twee getallen met elkaar vermenigvuldigt. Zorg voor een default waarde van 1 als de tweede parameter niet meegegeven wordt.
// * `divide` die twee getallen deelt. Zorg voor een default waarde van 1 als de tweede parameter niet meegegeven wordt.

// Zorg dat je deze kan schrijven met het function keyword en met een arrow function.

// Gebruik deze functies om de volgende berekening uit te voeren:

// ```
// (4 + 5) * (6 - 3) / 2 = 13.5
// ```

// Print het resultaat van de berekening af.

function add(a: number, b: number): number {
    return a + b;
}

function subtract(a: number, b: number): number {
    return a - b;
}

function multiply(a: number, b: number = 1): number {
    return a * b;
}

function divide(a: number, b: number = 1): number {
    return a / b;
}

const result = divide(multiply(add(4, 5), subtract(6, 3)), 2);

console.log(result);

export {}