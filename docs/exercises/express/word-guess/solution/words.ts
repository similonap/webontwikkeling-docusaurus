export function getRandomWord(words: string[]): string {
    return words[Math.floor(Math.random() * words.length)];
}

export function toUpperCase(words: string[]): string[] {
    return words.map(word => word.toUpperCase());
}

export function isFiveLetterWord(word: string): boolean {
    return (word.length === 5);
}

export function getFiveLetterWords(words: string[]) : string[] {
    return words.filter(isFiveLetterWord);
}