# Request

Het Request object is een object dat door Express wordt aangemaakt en wordt meegegeven aan de callback functie van een route. Het bevat informatie over de request die de client verstuurd heeft. Je kan het gebruiken om bv. de inhoud van een `POST` request te lezen, de headers te lezen, de parameters van een route te lezen, etc.

Tot nu toe heb je dit object al gebruikt voor het uitlezen van query en route parameters. Enkele properties van het Request object zijn:

* `req.body`: bevat de inhoud van een `POST` request
* `req.headers`: bevat de headers van de request
* `req.params`: bevat de parameters van een route
* `req.query`: bevat de query parameters van een request
* `req.path`: bevat het pad van de request
* `req.method`: bevat de HTTP method van de request (GET, POST, PUT, DELETE, etc.)
* `req.ip`: bevat het IP adres van de client

### Request Headers

Request headers zijn een belangrijk onderdeel van een HTTP request. Ze bevatten informatie over de request zelf. Ze worden meegestuurd door de client en kunnen door de server gelezen worden. Headers bevatten bv. informatie over de browser die de request verstuurd, de taal van de client, de versie van de HTTP protocol, etc. Een header bestaat uit een naam en een waarde.

Zo kan je bijvoorbeeld aan de hand van de header `User-Agent` de browser van de client bepalen. De waarde van deze header is bv. `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36`.

Headers worden meegestuurd in de request. Je kan ze lezen via het Request object:

```typescript
app.get("/headers",(req,res)=>{
    let headers = req.headers;
    res.json(headers);
})
```

Wil je een specifieke header lezen, gebruik dan de property `req.headers`:

```typescript
app.get("/headers",(req,res)=>{
    let userAgent = req.headers["user-agent"];
    res.type("text/html")
    res.send(`Your browser is ${userAgent}`);
})
```