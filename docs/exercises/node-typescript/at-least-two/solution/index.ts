interface TestFunction {
    (n: number): boolean
}

const isOdd : TestFunction = (n: number) => n % 2 !== 0;
const isEven : TestFunction = (n: number) => n % 2 === 0;
const isPositive : TestFunction = (n: number) => n > 0;
const isFibonacci = (n: number): boolean => {
    if (n === 0 || n === 1) return true;
    let a : number = 0;
    let b : number = 1;
    while (b < n) {
        let tmp : number = a;
        a = b;
        b = tmp + b;
    };
    return b === n;
};

const atLeastTwo = (numbers: number[], testFunction: TestFunction) => {
    let count = 0;
    for (let number of numbers) {
        if (testFunction(number)) {
            count++;
        }
    }
    return (count >= 2);
}

console.log(atLeastTwo([2,3,4,6,8], isOdd));
console.log(atLeastTwo([2,3,4,5,6,8], isOdd));
console.log(atLeastTwo([1,13], isFibonacci));

export {}