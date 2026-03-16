# Router

Tot op heden hebben we alle routes gedefinieerd in 1 bestand. Dit is prima voor kleine applicaties, maar als je applicatie groter wordt, kan het al snel onoverzichtelijk worden. Om dit te voorkomen, kan je routes definiëren in aparte bestanden. Dit kan je doen met het `express.Router` object.

## Structuur

Een router is een mini-applicatie die je kan gebruiken om routes te definiëren net zoals je in een normale express applicatie zou doen. Je kan een router gebruiken om routes te definiëren voor een bepaald deel van je applicatie. Dit kan handig zijn om je code te structureren en overzichtelijk te houden.

Over het algemeen worden routes gedefinieerd in een aparte map, bv. `routers`. In deze map kan je dan een bestand maken voor elke resource die je wilt definiëren. Bijvoorbeeld, als je een blog applicatie hebt, kan je een bestand maken voor de routes van de blogposts, een bestand voor de routes van het gebruikersbeheer, een bestand voor de routes van de comments, etc.

Je bestandsstructuur zal er dan ongeveer zo uitzien:

```
.
├── index.ts
└── routers
    ├── posts.ts
    └── users.ts
    └── comments.ts
```

Die dan overeenkomen met de routes (en eventueel subroutes) die je wilt definiëren.

```
/posts
/users
/comments
```

## Aanmaken van een router

Om een router aan te maken, gebruik je de `express.Router` functie. Deze functie retourneert een router object dat je kan gebruiken om routes te definiëren. We bouwen hieronder bijvoorbeeld een router voor de posts van een blog applicatie. We geven deze router een array van posts mee, zodat we deze kunnen gebruiken in de routes.

We maken een bestand `posts.ts` aan in de `routers` map en definiëren daar de routes voor de posts.

```typescript
export default function postRouter(posts: Post[]) {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.json(posts);
    });

    router.get("/:id", (req, res) => {
        const id = parseInt(req.params.id);
        const post = posts.find(post => post.id === id);
        if (post) {
            res.json(post);
        } else {
            res.status(404).send("Post not found");
        }
    });

    router.post("/", (req, res) => {
        const newPost: Post = req.body;
        posts.push(newPost);
        res.json(newPost);
    });

    return router;
}
```

In je hoofdbestand kan je dan deze functie importeren en gebruiken om de routes te definiëren.

```typescript
import postRouter from "./routers/posts";
```

```typescript
app.use("/posts", postRouter(posts));
```

Alle routes die je definieert in de `posts` router, zullen dan beginnen met `/posts`. Dus in het geval van het voorbeeld hierboven:

```
GET /posts
GET /posts/:id
POST /posts
```