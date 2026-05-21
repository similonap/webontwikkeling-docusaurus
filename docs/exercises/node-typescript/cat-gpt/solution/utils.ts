function repeatWords(word: string, times: number, delimiter: string): string {
    let output: string = "";
    for (let i = 0; i < times; i++) {
        output += word + delimiter;
    }
    return output.slice(0, -1);
}

export { repeatWords };
