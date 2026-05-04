import readline from 'readline-sync';

async function main() {
    const unixTimestamp = readline.question('Enter a unix timestamp: ');

    let response = await fetch(`https://helloacm.com/api/unix-timestamp-converter/?cached&s=${unixTimestamp}`);
    let data : string = await response.json();

    console.log(`De unix timestamp ${unixTimestamp} omgezet naar ons tijdsformaat is gelijk aan ${data}`)
}

main();


export {}