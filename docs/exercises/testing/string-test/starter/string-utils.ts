export function toUpperFunction(input: string): string {
    let chars: string = "";
    for (let char of input) {
        if (char.charCodeAt(0) >= 97 && char.charCodeAt(0) <= 122) {
            chars += String.fromCharCode(char.charAt(0).charCodeAt(0) - 32);
        } else {
            chars += char;
        }
    }
    return chars;
}

export {}