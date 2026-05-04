import readline from 'readline-sync';

let running : boolean = true;
do {
    const email : string = readline.question('Geef het email adres in: ');
    const indexOfAt : number = email.indexOf('@');
    const indexOfDot : number = email.indexOf('.');
    const firstName : string = email.substring(0, indexOfDot);
    const lastName : string = email.substring(indexOfDot + 1, indexOfAt);

    console.log(`De naam is ${firstName.substring(0,1).toUpperCase()}. ${lastName.charAt(0).toUpperCase() + lastName.substring(1)}`);

    if (readline.keyInYNStrict('Wil je nog een email adres ingeven?')) {
        running = true;
    } else {
        running = false;
    }
} while (running);

console.log('Nog een goede dag!')

export {}