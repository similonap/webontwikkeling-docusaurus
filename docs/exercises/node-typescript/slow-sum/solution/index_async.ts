const slowSum = (a: number, b: number) => {
    return new Promise<number>((resolve, reject) => {
        setTimeout(() => {
            resolve(a+b);
        },1000)
    });
}

const slowMult = (a: number, b: number) => {
    return new Promise<number>((resolve, reject) => {
        setTimeout(() => {
            resolve(a*b);
        },1500)
    });
}

const slowDiv = (a: number, b: number) => {
    return new Promise<number>((resolve, reject) => {
        if (b === 0) {
            reject('You cannot divide by zero');
            return;
        }
        setTimeout(() => {
            resolve(a/b);
        },2000)
    });
}

(async () => {
    let result = await slowSum(1, 5);
    console.log(`1 + 5 = ${result}`);
    result = await slowSum(1, 5);
    result = await slowMult(result, 2);
    console.log(`(1 + 5) * 2 = ${result}`);
    result = await slowDiv(6, 3);
    console.log(`(6 / 3) = ${result}`);
    try {
        result = await slowDiv(6, 0);
    } catch (error) {
        console.log(error);
    }
})();


export {}