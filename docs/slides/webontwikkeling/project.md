---
marp: true
theme: gaia
class: lead
paginate: true
backgroundColor: #fff
backgroundImage: url('https://marp.app/assets/hero-background.svg')
style: |
  section &#123;
    font-size: 24px;
    text-align: left;
  &#125;
  h1 &#123;
    color: #e63946;
  &#125;
  h2 &#123;
    color: #457b9d;
  &#125;
  strong &#123;
    color: #e63946;
  &#125;
---

# Webontwikkeling
### Milestone 0

---

## Doel van het project

- Een eenvoudige CRUD webapplicatie maken (**Create, Read, Update, Delete**) over een onderwerp naar keuze.
- Je kiest zelf het onderwerp van je webapplicatie.
- Je vertrekt van een dataset (JSON) die je zelf aanmaakt.

--- 

## Requirements JSON

- Het bestand moet een array van objecten bevatten (minimum 10).
- Elk object moet minstens de volgende soort properties bevatten :
    - Een id property met een unieke waarde.
    - Property met een korte string als waarde: Dit kan bijvoorbeeld een naam zijn.
    - Property met een lange string als waarde: Dit kan bijvoorbeeld een beschrijving zijn.
    - Property met een number als waarde: Dit kan bijvoorbeeld de leeftijd zijn.
    - Property met een boolean als waarde: Dit kan aangeven of iemand bijvoorbeeld een actieve status heeft.
    - Property met een datum als waarde: Dit kan de geboortedatum zijn.
    - Property met een image URL als waarde: Dit kan de URL van een profielfoto zijn.
    - Property waarvan de waarde een string is met een beperkt aantal mogelijke waarden.
    - Property met een array van strings als waarde: Dit kunnen bijvoorbeeld hobby's zijn.

---

## Requirements JSON (vervolg)


- Property met een ander object als waarde. Dit object moet op zijn beurt ook een aantal properties bevatten
    - Een id met een unieke waarde
    - Een aantal properties (mogen string, booleans, numbers, image url, ...)
    - Dit object is afkomstig van een 2de json bestand.

---

## Voorbeeld

Cards.json:

```json
[
  {
    "id": "FTC-001",
    "name": "Aether Knight",
    "description": "A legendary knight who harnesses the ethereal powers of the Aether, wielding them to maintain balance across the realms.",
    "age": 457,
    "isActive": true,
    "birthDate": "1567-03-05",
    "imageUrl": "https://example.com/images/aether-knight.jpg",
    "rarity": "Legendary",
    "abilities": ["Teleportation", "Energy Manipulation", "Dimensional Travel"],
    "element": "Aether",
    "guildAffiliation": {
      "id": "GUILD-009",
      "name": "Order of the Cosmic Veil",
      "guildMaster": "Celestial Mage",
      "guildEmblemUrl": "https://example.com/images/guilds/cosmic-veil-emblem.jpg",
      "foundedYear": 1423,
      "motto": "Balance in All, All in Balance"
    }
  },
  ...
]
```

---

## Voorbeeld (vervolg)

Guilds.json:

```json

  {
    "id": "GUILD-009",
    "name": "Order of the Cosmic Veil",
    "guildMaster": "Celestial Mage",
    "guildEmblemUrl": "https://example.com/images/guilds/cosmic-veil-emblem.jpg",
    "foundedYear": 1423,
    "motto": "Balance in All, All in Balance"
  },
  {
    "id": "GUILD-015",
    "name": "Brotherhood of the Dusk",
    "guildMaster": "Darkness Wielder",
    "guildEmblemUrl": "https://example.com/images/guilds/dusk-brotherhood-emblem.jpg",
    "foundedYear": 1578,
    "motto": "In Shadows, Truth"
  }
]
```

--- 

## Waar hosten?

- Gebruik van een eigen publieke github repository.
- Upload je json bestanden en je afbeeldingen naar GitHub.
- Zorg ervoor dat de image URLS overeenkomen met de raw URLS van GitHub.
- **DIT IS NIET DEZELFDE REPOSITORY ALS JE CODE VAN JE PROJECT OF OEFENINGEN**
- **DIT IS NIET DEZELFDE REPOSITORY ALS JE CODE VAN JE PROJECT OF OEFENINGEN**
- **DIT IS NIET DEZELFDE REPOSITORY ALS JE CODE VAN JE PROJECT OF OEFENINGEN**
- **DIT IS NIET DEZELFDE REPOSITORY ALS JE CODE VAN JE PROJECT OF OEFENINGEN**
- **DIT IS NIET DEZELFDE REPOSITORY ALS JE CODE VAN JE PROJECT OF OEFENINGEN**
- **DIT IS NIET DEZELFDE REPOSITORY ALS JE CODE VAN JE PROJECT OF OEFENINGEN**
- **DIT IS NIET DEZELFDE REPOSITORY ALS JE CODE VAN JE PROJECT OF OEFENINGEN**
- **...**