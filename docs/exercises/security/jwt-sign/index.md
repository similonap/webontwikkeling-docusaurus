### JWT Sign

Maak een nieuw node.js project aan met de naam `jwt-sign`. In dit project gaan we een JWT token signen en verifieren aan de hand van de `jsonwebtoken` library en via de http://www.jwt.io website.

Maak een object aan met de volgende interface: 

```
interface User {
    id: number;
    email: string;
}
```

- Maak een object aan dat deze interface implementeert en vul het met waarden naar keuze.
- Maak twee constanten `secret` en `secret2` aan met een willekeurige string waarde. En gebruik deze constanten om een JWT token te signen (`sign`) en verifieren (`verify`).
- Print de JWT token naar de console en kopieer deze naar de http://www.jwt.io website om de payload te bekijken.
- Probeer nu ook eens een token te verifieren met een andere secret en kijk wat er gebeurt.
- Ga nu eens aan de slag om zelf een token te lezen aan de hand van de `Buffer.from(part, 'base64').toString()` functie. Deze functie kan je gebruiken om de aparte delen van de JWT token om te zetten naar een leesbare string. Tip: de delen van de JWT token zijn gescheiden door een `.`.
- Zou het veilig zijn om een paswoord op te slagen in een JWT token? Waarom wel/niet?