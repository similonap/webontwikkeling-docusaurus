### Mathservice

Maak een nieuw project mathservice waarin je jouw bronbestanden voor deze oefening kan plaatsen.

Installeer alle nodige libraries voor te werken met express.

Maak een nieuwe express applicatie in een index.ts bestand. We gaan een web applicatie maken die de volgende wiskundige operatoren kan uitvoeren: add, min, mult en div

Zorg voor 1 GET-route die urls in de volgende vorm kan afhandelen:

```
http://localhost:3000/add?a=3&b=5
http://localhost:3000/min?a=3&b=5
http://localhost:3000/mult?a=3&b=5
http://localhost:3000/div?a=3&b=5
```

Je moet dus query parameters (voor a en b) EN route parameters (voor de operatoren) gebruiken.

Je krijgt dan een output in de volgende vorm (json):

```
&#123;
    "result": 8
&#125;
```

Als 1 van de twee parameters (a en b) niet zijn opgegeven krijg je het volgende json object terug:

```
&#123;
    "error": "Both query parameters (a,b) have to be specified."
&#125;
```

Bij een deling door 0 krijg je het volgende json object terug:

```
&#123;
    "error": "Division by 0 is not allowed."
&#125;
```

Als de query parameters niet van het type number zijn krijg je het volgende json object terug:

```
&#123;
    "error": "Both query parameters (a,b) have to be of type number."
&#125;
```

Bij een onbekekende operator krijg je het volgende json object terug:

```
&#123;
    "error": "Unknown operator."
&#125;
```