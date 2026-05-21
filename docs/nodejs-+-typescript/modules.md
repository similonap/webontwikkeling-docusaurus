# Modules

## Eigen Modules Maken

### Wat zijn modules?

Modules zijn een manier om je code te organiseren in verschillende bestanden. Vaak wil je bepaalde functies beschikbaar maken voor andere bestanden. Dit kan je doen door deze functies in een module te zetten. Je kan dan in andere bestanden deze module importeren en de functies gebruiken.

Eigenlijk heb je al modules gebruikt in vorige delen in de vorm van npm packages. Deze bevatten ook modules die je kan importeren in je eigen code.

## Waarom modules gebruiken?

Modules zijn een goede manier om je code te organiseren. Je kan je code opdelen in verschillende bestanden en deze bestanden kunnen dan met elkaar communiceren door middel van imports en exports. Dit maakt het makkelijker om je code te onderhouden en te begrijpen. Je kan ook gemakkelijk bepaalde functies of interfaces hergebruiken in verschillende bestanden zonder dat je deze telkens opnieuw moet schrijven.

### Hoe maak je een module?

Stel dat je een functie hebt om de oppervlakte te berekenen van een cirkel, vierkant en rechthoek.

```typescript
function areaCircle(r: number): number {
    return Math.PI * r * r;
}

function areaSquare(s: number): number {
    return s * s;
}

function areaRectangle(l: number, w: number): number {
    return l * w;
}
```

Tot nu toe heb je altijd deze functies in hetzelfde bestand gezet. Maar stel dat je deze functies ook in een ander bestand wil gebruiken. Dan kan je deze functies in een module zetten door gebruik te maken van een `export` statement.

```
export function areaCircle(r: number): number {
    return Math.PI * r * r;
}

export function areaSquare(s: number): number {
    return s * s;
}

export function areaRectangle(l: number, w: number): number {
    return l * w;
}

```

Zorg er wel voor dat je deze functies in een apart bestand zet met de extensie `.ts`. In dit geval bijvoorbeeld `area.ts`.

### Hoe importeer je functies uit een module?

Wil je deze functies gebruiken in een ander bestand? Dan moet je deze eerst importeren aan de hand van het volgende commando.

```typescript
import { areaCircle, areaSquare, areaRectangle } from './area';
```

De functies die je wil importeren zet je tussen de accolades. Het gedeelte achter `from` is het pad naar het bestand waar de module in staat. In dit geval is dat `./area` omdat het bestand `area.ts` in dezelfde map staat als het bestand waar je de functies wil gebruiken. Plaats je de module in een andere map, dan moet je het pad aanpassen. Staat je `area.ts` bestand in de directory `functions` dan moet je het volgende commando gebruiken.

```typescript
import { areaCircle, areaSquare, areaRectangle } from './functions/area';
```

nu kan je deze functies gebruiken in je code net zoals je dat zou doen alsof ze in hetzelfde bestand staan.

```typescript
console.log(areaCircle(2));
console.log(areaSquare(2));
```

### Default exports

Heel vaak wordt er door een module maar één functie geëxporteerd. In dat geval kan je gebruik maken van een default export. Dit is een export zonder naam.

```typescript
export default function(r: number): number {
    return Math.PI * r * r;
}
```

Je kan deze functie dan importeren zonder tussen de accolades te zetten.

```typescript
import areaCircle from './area';
```

In principe maakt het niet uit welke naam je achter de import zet want er is maar één functie geëxporteerd.

```typescript
import area from './area';
```

### Interfaces exporteren

Tot nu toe hebben we altijd interfaces in hetzelfde bestand gezet als de code die deze interface gebruikt. Maar je kan ook interfaces exporteren uit een module.

```typescript
export interface Person {
    name: string;
    age: number;
}
```

We plaatsen deze interfaces vaak in een apart bestand met de naam `types.ts`. We kunnen deze dan importeren in een ander bestand.

```typescript
import { Person } from './types';
```

Je kan ook specifiek aangeven dat je een interface wil importeren door gebruik te maken van de `import type` syntax.

```typescript
import type { Person } from './types';
```

## Testen van modules

Een heel belangrijke reden om modules te gebruiken is dat je deze modules eenvoudig kan testen. Als je al je code in één bestand zet dan is het moeilijk om deze code te testen. Je kan dan niet gemakkelijk bepaalde functies isoleren en testen. Door gebruik te maken van modules kan je deze functies isoleren en testen. Het testen van functies in modules noemen we ook vaak unit testing. Dit is een manier van testen waarbij je individuele functies test in plaats van het hele programma. 

### Waarom testen

De belangrijkste reden om te testen is natuurlijk om te controleren of je code werkt en bugvrij is. Maar in de praktijk is testen nog veel belangrijker om de **betrouwbaarheid** in de toekomst te garanderen.

* **Voorkomen van nieuwe fouten:** Software verandert heel de tijd. Soms voeg je een nieuwe functie toe en breek je onbedoeld iets dat al werkte. Met goede tests ontdek je zo'n fout meteen.
* **Samenwerken in een team:** Je werkt bijna altijd samen met anderen aan hetzelfde project. Tests dienen als een veiligheidsnet: als iemand anders (of jijzelf) een fout maakt in een gedeelde module, zal de test direct aangeven dat er iets mis is.
* **Automatisch controleren:** Bij professionele projecten worden tests automatisch uitgevoerd zodra je code opslaat in Git (bijvoorbeeld bij een 'push' naar de main branch of bij het mergen van een merge request). Zo voorkom je dat er foutieve code in je project terechtkomt.
* **Hulp bij AI:** Tests zijn ook essentieel als je AI-tools gebruikt om code te schrijven. De AI kan de tests namelijk zelf draaien om te controleren of zijn eigen code correct is. Als de tests falen, kan de AI direct zelf op zoek gaan naar een oplossing of de code aanpassen totdat alles wel werkt. 

Testen is dus niet alleen om te zien of je code *nu* werkt, maar vooral om er zeker van te zijn dat je code *altijd* blijft werken, hoe groot of complex het project ook wordt.

### Jest 

Jest is een testframework dat origineel ontwikkeld werd door Facebook. Het is een van de meest populaire testframeworks voor JavaScript. Jest is een all-in-one oplossing die zowel de testrunner als de assertion library bevat. Jest is zeer eenvoudig in gebruik en heeft een goede documentatie.

Om Jest te installeren, voer je volgend commando uit:

```bash
npm i --save-dev jest ts-jest @types/jest
```

Om Jest te kunnen gebruiken (met TypeScript), voer je dit commando uit:

```
npx ts-jest config:init
```

Om te zorgen dat je al je Jest-tests kan laten lopen met npm test, voeg je dit toe aan package.json:

```
"scripts": {
  "test": "jest"
}
```

Het kan zijn dat je in vscode fouten krijgt bij het gebruik van jest maar de testen wel kan uitvoeren. Je kan de volgende lijn in je tsconfig.json bestand zetten om dit op te lossen:

```
"types": ["jest", "node"]
```

### Testen van functies in modules

Stel dat je de functie `areaRectangle` wil testen. Je kan dan een nieuw bestand aanmaken met de naam `area.test.ts`. In dit bestand kan je de functie importeren en vervolgens testen.

```typescript
import { areaRectangle } from './area';

test('areaRectangle should return the correct area of a rectangle', () => {
    expect(areaRectangle(2, 3)).toBe(6);
    expect(areaRectangle(5, 10)).toBe(50);
});
```

Nu kan je deze test laten lopen door het volgende commando uit te voeren:

```bash
npm run test
```

De andere functies kan je op dezelfde manier testen.

```typescript
import { areaCircle, areaSquare } from './area';

test('areaCircle should return the correct area of a circle', () => {
    expect(areaCircle(2)).toBeCloseTo(12.566370614359172);
    expect(areaCircle(5)).toBeCloseTo(78.53981633974483);
});

test('areaSquare should return the correct area of a square', () => {
    expect(areaSquare(2)).toBe(4);
    expect(areaSquare(5)).toBe(25);
});
```

Je merkt op dat we hier gebruik maken van `toBeCloseTo` in plaats van `toBe` omdat we te maken hebben met decimalen en deze kunnen soms een beetje afwijken door de manier waarop computers met decimalen omgaan. De reden hiervoor is dat computers decimalen opslaan in een binair formaat, wat kan leiden tot kleine afrondingsfouten. Hierdoor kunnen twee decimalen die in theorie gelijk zouden moeten zijn, in de praktijk net iets van elkaar verschillen. `toBeCloseTo` houdt rekening met deze kleine verschillen en controleert of de waarden binnen een bepaald bereik van elkaar liggen, in plaats van exact gelijk te zijn. 

### Describe blocks

Je kan ook gebruik maken van `describe` blocks om je tests te organiseren. Dit is vooral handig als je veel tests hebt voor dezelfde module of functie. Als we bijvoorbeeld willen nagaan hoe de `areaRectangle` functie zich gedraagt bij negatieve inputs, kunnen we een `describe` block gebruiken om deze tests te groeperen.

```typescript
import { areaRectangle } from './area';

describe('areaRectangle', () => {
    test('should return the correct area of a rectangle', () => {
        expect(areaRectangle(2, 3)).toBe(6);
        expect(areaRectangle(5, 10)).toBe(50);
    });

    test('should return 0 if one of the sides is 0', () => {
        expect(areaRectangle(0, 3)).toBe(0);
        expect(areaRectangle(5, 0)).toBe(0);
    });

    test('should return a positive area even if one of the sides is negative', () => {
        expect(areaRectangle(-2, 3)).toBe(-6);
        expect(areaRectangle(5, -10)).toBe(-50);
    });
});
```

### Testen van errors

Eigenlijk is het niet logisch dat de `areaRectangle` functie een negatieve oppervlakte teruggeeft. Dus in dit geval zouden we er voor kunnen kiezen om een fout te gooien als een van de inputs negatief is. Dan moeten we uiteraard de code van de `areaRectangle` functie aanpassen en ook de tests aanpassen.

```typescript
export function areaRectangle(l: number, w: number): number {
    if (l < 0 || w < 0) {
        throw new Error('Length and width must be non-negative');
    }
    return l * w;
}
```

```typescript
import { areaRectangle } from './area';

describe('areaRectangle', () => {
    test('should return the correct area of a rectangle', () => {
        expect(areaRectangle(2, 3)).toBe(6);
        expect(areaRectangle(5, 10)).toBe(50);
    });

    test('should return 0 if one of the sides is 0', () => {
        expect(areaRectangle(0, 3)).toBe(0);
        expect(areaRectangle(5, 0)).toBe(0);
    });

    test('should throw an error if one of the sides is negative', () => {
        expect(() => areaRectangle(-2, 3)).toThrow('Length and width must be non-negative');
        expect(() => areaRectangle(5, -10)).toThrow('Length and width must be non-negative');
    });
});
```

### Andere testmethodes

Naast `toBe` en `toBeCloseTo` zijn er nog heel veel andere testmethodes die je kan gebruiken in Jest. Hier is een overzicht van de meest gebruikte testmethodes:

| **Testmethode** | **Beschrijving**                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| `toBe`          | Controleert of twee waarden exact gelijk zijn.                                                        |
| `toEqual`       | Controleert of twee objecten gelijk zijn (diep gelijkheid).                                                   |
| `toBeNull`      | Controleert of een waarde `null` is.                                                                                   |
| `toBeUndefined` | Controleert of een waarde `undefined` is.                                                                                   |
| `toBeTruthy`    | Controleert of een waarde waarachtig is (niet `false`, `0`, `''`, `null`, `undefined`, of `NaN`). |
| `toBeFalsy`     | Controleert of een waarde onwaarachtig is (`false`, `0`, `''`, `null`, `undefined`, of `NaN`). |
| `toContain`     | Controleert of een array of string een bepaalde waarde bevat. |
| `toHaveLength`  | Controleert of een array of string een bepaalde lengte heeft. |
| `toThrow`       | Controleert of een functie een fout gooit. |
| `toBeCloseTo`   | Controleert of twee getallen dicht bij elkaar liggen, rekening houdend met afrondingsfouten. |
| `toBeNaN`        | Controleert of een waarde `NaN` is. |

Er zijn nog veel meer testmethodes beschikbaar in Jest, maar dit zijn de meest gebruikte. Je kan altijd de [Jest documentatie](https://jestjs.io/docs/expect) raadplegen voor een volledig overzicht van alle testmethodes.

## Npm Packages

## npm.js

npm.js is de package manager voor JavaScript. Het is de grootste software registry ter wereld. Hier vind je heel veel packages die je kan gebruiken in je projecten. Wil je een bepaalde package zoeken dan kan je dat doen op de [npmjs website](https://www.npmjs.com/). Je vind er ook uitgebreide documentatie over de packages en hoe je deze kan gebruiken.

![alt text](/assets/npmjs.png)

Npm packages kunnen typisch op drie verschillende manieren geïnstalleerd worden: als dependency, dev dependency, en globaal. Een dependency wordt geïnstalleerd wanneer een pakket nodig is voor de werking van je applicatie in productie; dit zijn bijvoorbeeld bibliotheken die essentieel zijn om de applicatie te laten draaien (bv. leaflet om je interactieve map te tonen). Een dev dependency daarentegen is een pakket dat alleen nodig is tijdens de ontwikkeling, zoals tools voor testen of linting, en wordt niet meegeleverd in productie. Tot slot kunnen pakketten ook globaal geïnstalleerd worden, wat betekent dat ze overal op je systeem beschikbaar zijn, ongeacht welk project je gebruikt. Dit wordt meestal gedaan voor CLI-tools die je buiten een specifiek project wilt gebruiken, zoals TypeScript of ESLint.

| **Installatiemethode**         | **Beschrijving**                                                                           | **Installatievoorbeeld**              |
| ------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------- |
| **Dependencies**               | Packages die nodig zijn om de applicatie in productie te laten draaien.                    | `npm install package-name`            |
| **DevDependencies**            | Packages die alleen nodig zijn tijdens de ontwikkeling (testing, linting, building, enz.). | `npm install package-name --save-dev` |
| **Globale installatie (`-g`)** | Packages die globaal op je systeem worden geïnstalleerd, vaak gebruikt voor CLI-tools.     | `npm install package-name -g`         |

## package.json

Elk project heeft een `package.json` bestand. Dit bestand bevat alle informatie over je project. Het bevat ook een lijst van alle packages die je nodig hebt voor je project. Wanneer je een package installeert met npm dan wordt deze package toegevoegd aan dit bestand in de juiste `dependency` sectie.

**Packages installeren in de CLI**

```bash
# Install als Dependency 
# Packages die essentieel zijn voor de uitvoering van je applicatie in productie
npm install readline-sync

# Install als DevDependency
# Packages die je nodig hebt voor de ontwikkeling van je project
npm install @types/readline-sync --save-dev
```

**package.json**

```json
{
  "name": "project-name",
  "version": "1.0.0",
  "description": "Project description",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "Andie Similon",
  "license": "ISC",
  "dependencies": {
    "readline-sync": "^1.4.10"
  },
  "devDependencies": {
	  "@types/readline-sync": "^1.4.8"
  }
}
```

Je kan alle dependencies installeren aan de hand van het volgende commando. Dus je moet niet elke package apart installeren.

```bash
npm install
```

## node\_modules

Wanneer je een package installeert met npm dan wordt deze package geïnstalleerd in een map genaamd `node_modules`. Deze map bevat alle packages die je nodig hebt voor je project. Je moet deze map niet zelf aanmaken. npm doet dit automatisch voor je.

Omdat alle dependencies opgegeven staan in het `package.json` bestand en je deze ten allen tijde kan installeren aan de hand van het `npm install` commando, moet je deze map ook niet toevoegen aan je git repository. Het is een goed idee om deze map toe te voegen aan je `.gitignore` bestand. Voeg deze map ook nooit toe aan een zip bestand dat je doorstuurt naar iemand anders. Deze persoon kan dan zelf de dependencies installeren aan de hand van het `npm install` commando.

Wanneer je een package terug zou willen verwijderen uit je node\_modules folder kan je dit doen met het volgende commando:

```bash
npm uninstall <package-name>
```

Al de bestanden die je voordien had gedownload bij het installeren van deze package in de node\_modules folder zijn nu terug verwijderd. De package is ook verwijderd uit de `package.json` file.

## Importeren van npm packages

Dit is ook de manier hoe je meestal npm packages importeert. Daar maakte het ook nooit uit welke naam je achter de import zette.

```typescript
import readline from 'readline-sync';
```

Deze functies kon je dan gebruiken door middel van de naam die je achter de import zette gevolgd door een punt.

```typescript
const name = readline.question('Wat is je naam? ');
```

## Voorbeeld: Chalk

We gaan in dit voorbeeld de `chalk` package gebruiken. Deze package zorgt ervoor dat je tekst in de terminal kan kleuren. We gaan een programma maken dat de naam van de gebruiker in het rood toont.

Het eerste wat we moeten doen is de package installeren.

```bash
npm install chalk@4
```

Opgelet we moeten hier de versie 4 installeren omdat de nieuwste versie niet werkt met `ts-node` (en oudere versies van node)

Vervolgens bekijken we de documentatie van de package op de [npmjs website](https://www.npmjs.com/package/chalk). Hier vinden we hoe we de package kunnen gebruiken.

```typescript
import chalk from 'chalk';

const name = 'Jelle';

console.log(chalk.red(name));
```

Dit zal de naam `Jelle` in het rood tonen in de terminal.

## Importeren van types

[http://definitelytyped.github.io/](http://definitelytyped.github.io/)

Af en toe kom je in contact met een npm package die geen meegeleverde types hebben. Dit is bijvoorbeeld het geval bij de `readline-sync` package. In dat geval kan je gebruik maken van de `@types` (ook gekend als DefinitelyTyped) packages. Deze bevatten de types die bij de npm package horen. Je moet deze dan wel altijd apart installeren.

```bash
npm install --save-dev @types/readline-sync
```

Een overzicht van alle `@types` packages die je nodig hebt in deze cursus:

```bash
npm install --save-dev @types/node
npm install --save-dev @types/readline-sync
npm install --save-dev @types/express
npm install --save-dev @types/ejs
...
```

Je kan op de npmjs website heel eenvoudig zien of een bepaalde package TypeScript support heeft:

* Bevat deze een ![](/assets/dt.png) tag? Dan kan je deze installeren aan de hand van de bovenstaande commando's
* Bevat deze een ![](/assets/image%20(1).png) tag, dan zitten de types al in de npm package en dan hoef je niets te doen.

Bevat deze geen van beide? Dan heb je helemaal geen types en heb je geen voordelen van TypeScript. Je moet dan ook nog een extra aanpassing doen aan je project om deze library toch nog te gebruiken.

Bijvoorbeeld de `rainbow-colors-array` package bevat geen TypeScript support en geen `@types` package. Je kan deze dan toch nog gebruiken door in je project een `types.d.ts` bestand aan te maken met de volgende inhoud.

```typescript
declare module 'rainbow-colors-array';
```

Dit is ook wat je vscode je aanraad als je over de error hovered als hij de types niet vindt:

![](/assets/Screenshot%202023-03-17%20at%2016.16.10.png)

## Voorbeeld: Lodash

We gaan in dit voorbeeld de `lodash` package gebruiken. Deze package bevat heel veel handige functies die je kan gebruiken in je projecten. Het is een soort zwitsers zakmes voor JavaScript.

We installeren deze library aan de hand van het volgende commando.

```bash
npm install lodash
```

Deze library heeft geen ingebouwde types. We moeten deze dus apart installeren.

```bash
npm install --save-dev @types/lodash
```

Vaak is de documentatie bedoeld voor een ouder module systeem. We moeten dan de documentatie aanpassen naar het nieuwe module systeem.

```typescript
var _ = require('lodash');
```

Dit moeten we aanpassen naar het nieuwe module systeem.

```typescript
import _ from 'lodash';
```

Vervolgens kunnen we de functies gebruiken zoals beschreven in de documentatie.

Bv de `reverse` functie.

```typescript
const array = [1, 2, 3];

console.log(_.reverse(array));
```

of de `round` functie.

```typescript
console.log(_.round(4.006, 2));
```

In die oefeningen zullen we nog een aantal handige functies van `lodash` bekijken.
