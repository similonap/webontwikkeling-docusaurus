import readline from 'readline-sync';
import { log } from "sloth-log";

function repeatWords(word: string, times: number, delimiter: string) {
    let output: string = "";
    for (let i = 0; i < times; i++) {
        output += word + delimiter;
    }
    return output.slice(0, -1);
}


let input: string = "";
do {
    input = readline.question("> ");
    if (input !== "bye") {
        let times: number = Math.floor(Math.random() * 10) + 1;
        let line : string = repeatWords("Meow", times, " ");
        let endChar: string = ["!", "?", "."][Math.floor(Math.random() * 3)];
        log(line + endChar, { speed: 1000, maxWordsAtOnce: 2 });
    }
} while (input !== "bye");

export { }