# Hashing

Hashing is een techniek die gebruikt wordt om data onleesbaar te maken. Het is een eenzijdige functie, wat betekent dat je de originele data niet kan herstellen uit de hash. Het is een veelgebruikte techniek om wachtwoorden te beveiligen.

Bcrypt is een populaire library om wachtwoorden te hashen. Het is een implementatie van het Blowfish algoritme en is ontworpen om langzaam te zijn, zodat het moeilijk is om wachtwoorden te kraken.

## Installeren

Om Bcrypt te gebruiken in je Node.js project, moet je de library eerst installeren via npm:

```bash
npm install bcrypt
npm install --save-dev @types/bcrypt
```

## Hash functie

Alle bcrypt functies hebben een asynchrone en een synchrone (blokkerende) variant. Omdat hashing een intensieve taak is, is het aan te raden om de asynchrone variant te gebruiken want deze is geschikt voor asynchrone omgevingen zoals Node.js. Er is een versie met promises en een versie met callbacks. Wij verkiezen die met promises met gebruik van `async` en `await`.

Je kan op de volgende manier een wachtwoord hashen:

```typescript
import bcrypt from 'bcrypt';

const saltRounds : number = 10;

async function main() : Promise<string> {
    let hashedPassword : string =  await bcrypt.hash("hunter2", saltRounds);
    console.log(hashedPassword);
}
main();
```

Als je dit uitvoert zal je een hash zien die er ongeveer zo uitziet: `$2b$10$UVVA3Gy.0iDmSXTZQfwu8.n96QCw.GkjfTYfb0GcTzM/N0KxsPg8S`

Je merkt op dat we hier een saltRounds variabele gebruiken. Voorlopig mag je altijd 10 gebruiken, we zullen later uitleggen wat dit betekent.

## Vergelijken

Als je twee keer een wachtwoord hash, zal je twee verschillende hashes krijgen. Hier zijn bepaalde redenen voor, maar het belangrijkste dat je moet weten is dat je niet het volgende kan doen:

```typescript
let hashedPassword1 : string = await bcrypt.hash("hunter2", saltRounds);
let hashedPassword2 : string = await bcrypt.hash("hunter2", saltRounds);

console.log(hashedPassword1 === hashedPassword2); // false
```

Hiervoor moet je de `compare` functie gebruiken:

```typescript
import bcrypt from 'bcrypt';

const saltRounds : number = 10;

async function main() : Promise<boolean> {
    let hashedPassword : string =  await bcrypt.hash("hunter2", saltRounds);
    let isSame : boolean = await bcrypt.compare("hunter2", hashedPassword);
    console.log(isSame); // true
}
main();
```

Hier moet je geen `saltRounds` meegeven, omdat de salt in de hash zit en automatisch wordt gebruikt.

## Security overwegingen

## Salt

Een salt is een willekeurige waarde die wordt toegevoegd aan de data voordat het gehasht wordt. Dit zorgt ervoor dat twee keer dezelfde data een andere hash zal opleveren. Dit is belangrijk omdat het voorkomt dat een aanvaller een rainbow table kan gebruiken om wachtwoorden te kraken. Een rainbow table is een tabel met hashes van veelgebruikte wachtwoorden. Als je geen salt gebruikt, kan een aanvaller de hash van een wachtwoord opzoeken in de tabel en zo het wachtwoord achterhalen. Bcrypt voegt automatisch een salt toe aan de hash, dit is waarom je je dus nooit geen twee keer dezelfde hash zal krijgen, zelfs voor de zelfde data.

## SaltRounds

De `saltRounds` parameter bepaalt hoeveel werk bcrypt moet doen om een hash te berekenen. Hoe hoger het getal, hoe langer het duurt om een hash te berekenen. Dit is belangrijk omdat het het moeilijker maakt voor een aanvaller om wachtwoorden te kraken. Als je een te laag getal gebruikt, kan een aanvaller met een krachtige computer veel wachtwoorden per seconde kraken. Als je een te hoog getal gebruikt, kan het te lang duren om een hash te berekenen. Dit maakt het bijna onmogelijk om binnen redelijke tijd voor alle combinaties van wachtwoorden een hash te berekenen. Een goede waarde voor `saltRounds` is 10. Let er op dat je deze waarde nooit te hoog zet, want dit zal het voor de hacker moeilijker maken om wachtwoorden te kraken, maar ook voor jezelf om wachtwoorden te hashen. Dus dit heeft een impact op de performantie van je applicatie.

Probeer maar eens zelf een wachtwoord te hashen met een `saltRounds` van 20 en 5. Je zal merken dat het met 20 veel langer duurt dan met 5.

## Timing attacks

Timing attacks zijn aanvallen waarbij een aanvaller probeert om informatie te verkrijgen door de tijd te meten die het kost om een bepaalde taak uit te voeren. Dit kan bijvoorbeeld gebruikt worden om een wachtwoord te kraken door te meten hoe lang het duurt om een hash te berekenen. Bcrypt is ontworpen om dit soort aanvallen te voorkomen door een vaste tijd te nemen om een hash te berekenen, ongeacht de input. Dit voorkomt dat een aanvaller informatie kan verkrijgen door de tijd te meten. Bv: als je een lang wachtwoord hebt, zal het niet langer duren om een hash te berekenen dan voor een kort wachtwoord.

## Gebruik van hashing voor bestanden

Je kan hashing ook gebruiken om de integriteit van bestanden te controleren. Als je een hash berekent van een bestand en deze hash bewaart, kan je later controleren of het bestand is gewijzigd. Als de hash van het bestand overeenkomt met de bewaarde hash, weet je dat het bestand niet is gewijzigd. Als de hash niet overeenkomt, weet je dat het bestand is gewijzigd en kan je actie ondernemen.

Vaak zie je op een website iets zoals dit:

![Hashes VSCode](/assets/hashes-vscode.png)

Als je het bestand gedownload hebt kan je met het `sha256sum` in je console de hash berekenen en controleren of deze overeenkomt met de hash op de website.

```bash
sha256sum vscode-windows-x64.zip
```

of in Windows:

```powershell
Get-FileHash vscode-windows-x64.zip -Algorithm SHA256
```

Als de hashes overeenkomen, weet je dat het bestand niet is gewijzigd en dat je het veilig kan gebruiken.
