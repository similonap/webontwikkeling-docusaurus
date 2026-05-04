function filterPositive(numbers: number[]) {
    let filtered: number[] = [];
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] > 0) {
            filtered.push(numbers[i]);
        }
    }
    return filtered;
}

function filterNegative(numbers: number[]) {
    let filtered: number[] = [];
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] < 0) {
            filtered.push(numbers[i]);
        }
    }
    return filtered;
}

function filterEven(numbers: number[]) {
    let filtered: number[] = [];
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] % 2 === 0) {
            filtered.push(numbers[i]);
        }
    }
    return filtered;
}

interface FilterFunction {
    (number: number): boolean
}

function filter(numbers: number[], filterFunction: FilterFunction) {
    let filtered: number[] = [];
    for (let i = 0; i < numbers.length; i++) {
        if (filterFunction(numbers[i])) {
            filtered.push(numbers[i]);
        }
    }
    return filtered;
}

const numbers: number[] = [-4,-4,1,2,3,4,5];
const isPositive = (number: number) => number >= 0;
console.log(filter(numbers, isPositive)); // 1,2,3,4,5

export {}