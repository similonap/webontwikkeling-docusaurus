const getRandom = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(Math.floor(Math.random() * 100))
        },1000);
    });
}

getRandom().then((result) => {
    console.log(`The number was ${result}`);
});

(async () => {
    const result = await getRandom();
    console.log(`The number was ${result}`);
})();

export {}