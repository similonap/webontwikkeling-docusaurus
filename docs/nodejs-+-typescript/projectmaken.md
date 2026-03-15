# Nieuw project

Vooraleer we kunnen starten met het schrijven van een node applicatie moeten we eerst een nieuwe directory aanmaken waar we onze code in kunnen plaatsen.

We zullen in dit geval een nieuwe directory aanmaken met de naam `hello`. Je kan deze in een directory `theorie` plaatsen.

Vervolgens zorg je ervoor dat je in de `hello` directory zit aan de hand van het `cd` commando.

```bash
cd theorie/hello
```

## npm init

Nu we een nieuwe directory hebben aangemaakt kunnen we een nieuw project aanmaken. Dit doen we aan de hand van het `npm init` commando.

```bash
npm init
```

Dit commando zal een aantal vragen stellen over jouw project. Je kan deze gewoon beantwoorden door op enter te drukken. Als je dit commando hebt uitgevoerd zal je een nieuw bestand `package.json` zien in je directory. Dit bestand bevat alle informatie over jouw project. We zullen hier later nog op terugkomen.

## TypeScript configuratie

Nu we een nieuw project hebben aangemaakt moeten we een nieuwe TypeScript configuratie aanmaken. Dit doen we aan de hand van het `tsc --init` commando.

```bash
tsc --init
```

Dit commando zal een nieuw bestand `tsconfig.json` aanmaken in je directory. Dit bestand bevat alle configuratie opties voor de TypeScript compiler.

## Node types installeren

Nu we een TypeScript configuratie hebben aangemaakt moeten we de node types installeren. Dit zijn de types die nodig zijn om met TypeScript en Node.js te werken.

```bash
npm install --save-dev @types/node
```

Je zal zien dat er een nieuwe directory `node_modules` is aangemaakt in je project. Hierin zitten alle modules die je nodig hebt om je project te laten werken.

## Bestand aanmaken

Nu we alle configuratie hebben aangemaakt kunnen we beginnen met het schrijven van onze code. Maak een nieuw bestand `hello.ts` aan in de `hello` directory. De bestandsnaam mag je zelf kiezen.

Het bestand `hello.ts` moet het volgende bevatten:

```typescript
console.log('Hello, world!');
```

## Uitvoeren

Nu we ons programma hebben geschreven kunnen we dit uitvoeren. Dit kan je doen aan de hand van het `ts-node` commando.

```bash
ts-node hello.ts
```

Dit commando zal je programma uitvoeren en je zal `Hello, world!` zien verschijnen in je terminal.

## Samengevat

| Commando                             | Beschrijving                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------- |
| `npm init`                           | Maakt een nieuw project aan.                                                          |
| `tsc --init`                         | Maakt een nieuw tsconfig bestand aan. Het initialiseert een nieuw TypeScript project. |
| `npm install --save-dev @types/node` | Installeert alle types die nodig zijn om met TypeScript en Node.js te werken.         |
| `ts-node &lt;naam file>.ts`             | Voert het programma uit dat je geschreven hebt in `&lt;naam file>.ts`.                   |

Deze commando's zal je voor elk nieuw project moeten uitvoeren. Het is dus handig om deze te onthouden.

## create-clean-node

Er zijn talrijke scripts beschikbaar die het opzetten van een TypeScript of JavaScript project aanzienlijk vereenvoudigen. Een voorbeeld hiervan is `create-clean-node`, een tool waarmee je met slechts één commando een nieuw project kunt starten. Door het volgende in je terminal te typen:

```lua
npx create-clean-node
```

word je gevraagd om een projectnaam in te voeren, waarna `create-clean-node` automatisch alle benodigde afhankelijkheden installeert.
