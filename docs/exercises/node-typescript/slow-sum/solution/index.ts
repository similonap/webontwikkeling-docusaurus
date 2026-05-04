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

slowSum(1, 5).then((result) => {
    console.log(`1 + 5 = ${result}`);
});

slowSum(1, 5).then((result) => {
    return slowMult(result, 2);
}).then((result) => {
    console.log(`(1 + 5) * 2 = ${result}`);
});
slowDiv(6, 3).then((result) => {
    console.log(`(6 / 3) = ${result}`);
});
slowDiv(6, 0).catch((error) => {
    console.log(error);
});


export {}