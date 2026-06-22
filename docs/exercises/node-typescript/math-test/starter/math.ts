export function add(a: number, b: number): number {
    if (isNaN(a) || isNaN(b)) {
        throw new Error("Arguments must be numbers");
    }
    return a + b;
}

export function subtract(a: number, b: number): number {
    if (isNaN(a) || isNaN(b)) {
        throw new Error("Arguments must be numbers");
    }
    return a - b;
}

export function multiply(a: number, b: number): number {
    if (isNaN(a) || isNaN(b)) {
        throw new Error("Arguments must be numbers");
    }
    return a * b;
}

export function divide(a: number, b: number): number {
    if (isNaN(a) || isNaN(b)) {
        throw new Error("Arguments must be numbers");
    }
    if (b === 0) {
        throw new Error("Cannot divide by zero");
    }
    return a / b;
}