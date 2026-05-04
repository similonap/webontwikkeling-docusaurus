import readline from 'readline-sync';

const alphabet : string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

let input : string = readline.question('Enter a string: ');

let output : string = '';
for (let letter of input) {
    const isLetter : boolean = alphabet.includes(letter.toLowerCase());
    if (isLetter) {
        const index : number = alphabet.indexOf(letter.toLowerCase());
        const newIndex : number = (index + 13) % 26;
        const isLowerCase : boolean = letter === letter.toLocaleLowerCase();
        const newLetter : string = isLowerCase ? alphabet[newIndex] : alphabet[newIndex].toUpperCase();
        output += newLetter;
    } else {
        output += letter;
    }
}
console.log(output);

export {}