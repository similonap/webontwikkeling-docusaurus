import readline from 'readline-sync';

const VALID_LETTERS: string[] = ["A", "T", "C", "G"];

const dnaMatch = (sequence1: string, sequence2: string): number => {
    if (sequence1.length === 0 || sequence2.length === 0) {
        throw new Error("Sequences must be of length > 0");
    }
    if (sequence1.length !== sequence2.length) {
        throw new Error("Exception: Sequences must be of equal length");
    }
    let count = 0;
    for (let i = 0; i < sequence1.length; i++) {
        if (!VALID_LETTERS.includes(sequence1[i])) {
            throw new Error("Invalid character in sequence 1");
        }
        if (!VALID_LETTERS.includes(sequence2[i])) {
            throw new Error("Invalid character in sequence 2");
        }
        if (sequence1[i] === sequence2[i]) {
            count++;
        }
    }
    return Math.round((count / sequence1.length) * 100);
}

let hasErrors : boolean = false;
do {
    const sequence1 = readline.question("Enter DNA sequence [1]: ");
    const sequence2 = readline.question("Enter DNA sequence [2]: ");
    try {
        console.log(`Match: ${dnaMatch(sequence1, sequence2)}%`);
        hasErrors = false;
    } catch (e: any) {
        console.error(e.message);
        hasErrors = true;
    }
} while (hasErrors);

export {}