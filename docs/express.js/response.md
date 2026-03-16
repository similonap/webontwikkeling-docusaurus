# Response

Het Response object is een object dat door Express wordt aangemaakt en wordt meegegeven aan de callback functie van een route. Het bevat methodes om de response van de server te configureren. Je kan bv. de inhoud van de response, de headers, de status code, etc. instellen.

We hebben dit object al gebruikt om bijvoorbeeld de content type van de response te configureren, de status code te wijzigen, response te sturen, etc. We zien hier nog een aantal nuttige methodes.

### Redirect

Een redirect is een HTTP response die instructies bevat voor de client om een nieuwe request te sturen naar een andere URL. Een redirect wordt gebruikt om bv. een gebruiker door te sturen naar een andere pagina. De client wordt automatisch doorverwezen naar de nieuwe URL.

Om een redirect te sturen, gebruik je de method `res.redirect`:

```typescript
app.get("/redirect",(req,res)=>{
    res.redirect("https://google.com");
})
```

Soms is het interessant om een redirect te sturen naar de vorige pagina. Dit kan je doen met de method `res.redirect` en de waarde `back`:

```typescript
app.get("/redirect",(req,res)=>{
    res.redirect("back");
})
```

Dit kan je bijvoorbeeld gebruiken om een gebruiker door te sturen na het verzenden van een POST request.

### Status Code

De status code van een HTTP response geeft aan of de request geslaagd is of niet. De status code wordt automatisch ingesteld op 200 (OK) wanneer je een response verstuurd. Je kan de status code wijzigen met de method `res.status`:

```typescript
app.get("/status",(req,res)=>{
    res.status(404);
    res.send("Not found");
})
```

Wil je direct een response sturen met een bepaalde status code, gebruik dan de method `res.sendStatus`:

```typescript
app.get("/status",(req,res)=>{
    res.sendStatus(404);
})
```

Hier een tabel met de meest gebruikte status codes:

| Status Code | Omschrijving          | Wanneer te gebruiken                                        |
| ----------- | --------------------- | ----------------------------------------------------------- |
| 200         | OK                    | De request is geslaagd                                      |
| 201         | Created               | De request is geslaagd en een nieuwe resource is aangemaakt |
| 204         | No Content            | De request is geslaagd, maar er is geen inhoud om te tonen  |
| 400         | Bad Request           | De request is niet correct                                  |
| 401         | Unauthorized          | Missende of niet geslaagde authorisatie                     |
| 403         | Forbidden             | De client mag deze resource niet bekijken                   |
| 404         | Not Found             | De resource is niet gevonden                                |
| 500         | Internal Server Error | Er is een fout opgetreden op de server                      |

Het is belangrijk om de juiste status code te gebruiken zodat de client weet of er iets mis is gegaan of niet. En als er iets mis is gegaan, kan de client bv. een foutmelding tonen.

### Response headers

Net zoals bij een request, kan je ook bij een response headers instellen. Dit kan je doen met de method `res.set`:

```typescript
app.get("/headers",(req,res) => { 
    res.set("Content-Type","text/html");
    res.send("<h1>Hello World</h1>");
})
```

Als je een response verstuurd, kan je geen headers meer wijzigen. Als je dit toch probeert, krijg je de volgende foutmelding:

`Error: Can"t set headers after they are sent.`

Bijvoorbeeld:

```typescript
app.get("/headers", (req, res) => {
    res.send("<h1>Hello World</h1>");
    res.set("Content-Type", "text/html");
    // Error: Can"t set headers after they are sent.
});
```

Dit komt omdat de headers al verstuurd worden door de send functie. Je kan dit oplossen door de headers te configureren voor je de response verstuurd:

```typescript
app.get("/headers",(req,res)=>{
    res.set("Content-Type","text/html");
    res.send("<h1>Hello World</h1>");
})
```

### Response Type

De response type wordt automatisch ingesteld op `text/html` wanneer je een response verstuurd. Je kan de response type wijzigen met de method `res.type`:

```typescript
app.get("/type",(req,res)=>{
    res.type("text/plain");
    res.send("Hello World");
})
```

Je kan ook de response type instellen op een van de volgende waarden: `html`, `text`, `json`, `xml`. Als je een van deze waarden gebruikt, wordt de content type automatisch ingesteld op de juiste waarde:

| Response Type    | Verkorte notatie | Omschrijving |
| ---------------- | ---------------- | ------------ |
| text/html        | html             | HTML         |
| text/plain       | text             | Plain text   |
| application/json | json             | JSON         |
| application/xml  | xml              | XML          |

