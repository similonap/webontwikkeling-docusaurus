# Math Module

Maak een nieuw project aan met de naam `math-module`. Maak een nieuwe file aan met de naam `math.ts`. In deze file exporteer je de volgende functies:

- `add(a: number, b: number): number` - geeft de som van twee getallen terug.
- `subtract(a: number, b: number): number` - geeft het verschil van twee getallen terug.
- `multiply(a: number, b: number): number` - geeft het product van twee getallen terug.
- `divide(a: number, b: number): number` - geeft het resultaat van de deling terug. Gooit een `Error` met de boodschap `"Cannot divide by zero"` als `b` gelijk is aan `0`.
- `power(a: number, b: number): number` - geeft `a` tot de macht `b` terug.

Exporteer deze functies en importeer ze in een nieuwe file `index.ts`. Roep elke functie minstens één keer aan en log het resultaat naar de console.

## Tests schrijven

Maak een nieuw bestand `math.test.ts` aan en schrijf voor elke functie een `describe` block met meerdere `test` cases. Zorg er voor dat je de volgende gevallen test:

- **`add`**: som van twee positieve getallen, som met een negatief getal, optellen met nul.
- **`subtract`**: verschil van twee getallen, resultaat is negatief.
- **`multiply`**: product van twee getallen, vermenigvuldigen met nul.
- **`divide`**: deling van twee getallen, gooit een fout bij deling door nul.
- **`power`**: macht van een getal, macht nul geeft altijd 1.