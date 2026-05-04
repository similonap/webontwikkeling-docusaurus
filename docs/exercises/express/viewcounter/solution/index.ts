import express from 'express';

const app = express();

app.set("port", 3000);

const viewCounts : Record<string, number> = {};

app.use((req, res) => {
    viewCounts[req.path] = viewCounts[req.path] === undefined ? 1 : viewCounts[req.path] + 1;

    let html: string = `<ul>`;
    for (let key of Object.keys(viewCounts)) {
        html += `<li>${key}: ${viewCounts[key]}</li>`;
    }
    html += `</ul>`;

    res.send(html);
});


app.listen(app.get("port"), () => {
    console.log(`Server is running on http://localhost:${app.get("port")}`);
});


export {}