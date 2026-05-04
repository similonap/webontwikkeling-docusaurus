### Hashing

Maak een nieuw node project `hashing` aan en installeer de `bcrypt` package. In je code maak je eerst een lijst met gebruikers aan:

```typescript
interface User {
    username: string;
    password: string;
}

const users : User[] = [
    { username: "admin", password: "$2b$10$O.q/SHi69C.gUAPrejyQQOTgGhmcAWgknS.nPxpovli9c.EEOK0e6" },
    { username: "user", password: "$2b$10$CXpbsPHPNkf21OLEAUmF2eX0hv9MGoFFqIaitCq2G6II1PiVu1UmO" }
]; 
```

Deze paswoorden zijn gehasht met bcrypt. Het admin paswoord is `hunter2` en het user paswoord is `password123`.

Zorg ervoor dat je zelf ook een nieuwe gebruiker toevoegd aan de lijst van gebruikers. Gebruik bcrypt om het paswoord te hashen. Gebruik een saltRounds van 10. Experimenteer ook wat met de saltRounds en kijk wat het effect is op de gehashte paswoorden en de tijd die het kost om een paswoord te hashen.

Vraag aan de hand van de readline-sync package de gebruiker om een gebruikersnaam en paswoord. Controleer of de gebruiker bestaat en of het paswoord overeenkomt met het gehashte paswoord in de lijst. Geef een gepaste melding aan de gebruiker.

#### Voorbeeld interactie

```bash
Enter a username: user
Enter a password: password123
Login successful!
```

```bash
Enter a username: user
Enter a password: hunter2
Invalid username or password.
```