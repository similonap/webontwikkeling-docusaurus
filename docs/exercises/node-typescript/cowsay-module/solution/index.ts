import readline from 'readline-sync';
import * as cowsay from "cowsay"

function say(text: string) {
    let output: string = cowsay.say({ text: message });
    if (text === "Meow!") {
        throw new Error("Cows don't meow!");
    }
    console.log(output);
}

let message : string = "";
do {
    try {
        message = readline.question("What should the cow say? ");
        if (message !== "exit") {
            say(message);
        }
    } catch (e: any) {
        console.log(e.message)
    }
} while (message !== "exit");





export {}