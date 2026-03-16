### DNA match

In deze opdracht ga je een functie schrijven die twee DNA sequenties met elkaar vergelijkt. De functie moet een percentage teruggeven dat aangeeft hoeveel procent van de sequenties overeenkomen.

```
const dnaMatch = (sequence1: string, sequence2: string): number => {
    
}
```

Vul de functie aan zodat ze werkt zoals beschreven in de opdracht.

* De functie moet een percentage teruggeven dat aangeeft hoeveel procent van de sequenties overeenkomen. Als de sequenties exact overeenkomen moet het percentage 100% zijn. Als de sequenties helemaal niet overeenkomen moet het percentage 0% zijn.
* De functie moet een exception werpen met de error message "**Sequences must be of equal length**" als de twee sequenties niet dezelfde lengte hebben.
* De functie moet een exception werpen met de error message "**Invalid character in sequence 1**" als de eerste sequentie niet alleen uit de letters A, T, C en G bestaat.
* De functie moet een exception werpen met de error message "**Invalid character in sequence 2**" als de tweede sequentie niet alleen uit de letters A, T, C en G bestaat.
* De functie moet een exception werpen met de error message "**Sequences must be of length > 0**" als 1 van de sequenties leeg is.

Dus bv:

```
dnaMatch("ATCG", "ATCG") // 100
dnaMatch("ATCG", "ATCC") // 75
dnaMatch("ATCG", "GCTA") // 0
dnaMatch("ATCG", "ATCCG") // Exception: Sequences must be of equal length
```

Zorg voor een console applicatie die de gebruiker vraagt om twee DNA sequenties in te voeren. De error messages moeten worden opgevangen en de gebruiker moet opnieuw gevraagd worden om de sequenties in te voeren. Als de sequenties geldig zijn moet het percentage worden weergegeven.

#### Voorbeeld interactie

![DNA match](dna.gif)