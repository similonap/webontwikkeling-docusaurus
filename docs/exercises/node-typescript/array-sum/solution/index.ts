function sum(numbers: number[]): number {
    let sum: number = 0;
    for (let i = 0; i < numbers.length; i++) {
        sum += numbers[i];
    }
    return sum;
}

console.log(sum([1, 2, 3, 4, 5])); // 15

export {}