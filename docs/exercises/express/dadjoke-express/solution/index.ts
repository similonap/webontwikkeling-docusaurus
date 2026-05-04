

import express from 'express';

const app = express();

interface DadJoke {
    id: string;
    joke: string;
    status: number;
}


async function fetchDadJoke(): Promise<DadJoke> {
    const response = await fetch('https://icanhazdadjoke.com/', {
        headers: { Accept: 'application/json' },
    });
    const data : DadJoke = await response.json();
    return data;
}

app.get('/joke/json', async (req, res) => {
    const dadJoke = await fetchDadJoke();
    res.json(dadJoke);
});

app.get('/joke/html', async (req, res) => {
    const dadJoke = await fetchDadJoke();
    res.send(`<h1>${dadJoke.joke}</h1>`);
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

export {}