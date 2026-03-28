import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  theorieSidebar: [
  {
    "type": "doc",
    "id": "index",
    "label": "Introductie"
  },
  {
    "type": "category",
    "label": "Tooling",
    "items": [
      {
        "type": "doc",
        "id": "tooling/devcontainers",
        "label": "Devcontainers"
      },
      {
        "type": "doc",
        "id": "tooling/git",
        "label": "Git"
      },
      {
        "type": "doc",
        "id": "tooling/bash",
        "label": "Terminal en bash"
      }
    ]
  },
  {
    "type": "category",
    "label": "NodeJS + TypeScript",
    "items": [
      {
        "type": "doc",
        "id": "nodejs-+-typescript/wat-is-nodejs",
        "label": "Wat is NodeJS?"
      },
      {
        "type": "doc",
        "id": "nodejs-+-typescript/waarom-typescript",
        "label": "Waarom TypeScript?"
      },
      {
        "type": "doc",
        "id": "nodejs-+-typescript/projectmaken",
        "label": "Nieuw project"
      },
      {
        "type": "doc",
        "id": "nodejs-+-typescript/input-lezen",
        "label": "Input lezen"
      },
      {
        "type": "category",
        "label": "Type Systeem",
        "link": {
          "type": "doc",
          "id": "nodejs-+-typescript/type-systeem/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "nodejs-+-typescript/type-systeem/basic-types",
            "label": "Basic types"
          },
          {
            "type": "doc",
            "id": "nodejs-+-typescript/type-systeem/arrays",
            "label": "Arrays"
          },
          {
            "type": "doc",
            "id": "nodejs-+-typescript/type-systeem/interfaces",
            "label": "Interfaces"
          },
          {
            "type": "doc",
            "id": "nodejs-+-typescript/type-systeem/functions",
            "label": "Functions"
          }
        ]
      },
      {
        "type": "category",
        "label": "Array Functions",
        "link": {
          "type": "doc",
          "id": "nodejs-+-typescript/array-functions/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "nodejs-+-typescript/array-functions/map",
            "label": "Array.map()"
          },
          {
            "type": "doc",
            "id": "nodejs-+-typescript/array-functions/filter",
            "label": "Array.filter()"
          },
          {
            "type": "doc",
            "id": "nodejs-+-typescript/array-functions/reduce",
            "label": "Array.reduce()"
          },
          {
            "type": "doc",
            "id": "nodejs-+-typescript/array-functions/find",
            "label": "Array.find()"
          }
        ]
      },
      {
        "type": "doc",
        "id": "nodejs-+-typescript/exceptions",
        "label": "Exceptions"
      },
      {
        "type": "doc",
        "id": "nodejs-+-typescript/modules",
        "label": "Modules"
      },
      {
        "type": "category",
        "label": "Asynchroon Programmeren",
        "link": {
          "type": "doc",
          "id": "nodejs-+-typescript/asynchroon-programmeren/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "nodejs-+-typescript/asynchroon-programmeren/promises",
            "label": "Promises"
          },
          {
            "type": "doc",
            "id": "nodejs-+-typescript/asynchroon-programmeren/async-await",
            "label": "Async/Await"
          },
          {
            "type": "doc",
            "id": "nodejs-+-typescript/asynchroon-programmeren/fetch",
            "label": "Fetch"
          },
          {
            "type": "doc",
            "id": "nodejs-+-typescript/asynchroon-programmeren/extra",
            "label": "Extra voorbeelden"
          }
        ]
      }
    ]
  },
  {
    "type": "category",
    "label": "Express.js",
    "items": [
      {
        "type": "doc",
        "id": "express.js/wat-is-een-backend-framework",
        "label": "Wat is een backend framework?"
      },
      {
        "type": "doc",
        "id": "express.js/basis",
        "label": "Basis"
      },
      {
        "type": "doc",
        "id": "express.js/nodemon",
        "label": "Nodemon"
      },
      {
        "type": "doc",
        "id": "express.js/statische-bestanden",
        "label": "Statische Bestanden"
      },
      {
        "type": "doc",
        "id": "express.js/ejs",
        "label": "EJS"
      },
      {
        "type": "category",
        "label": "Request",
        "link": {
          "type": "doc",
          "id": "express.js/requests/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "express.js/requests/get-request",
            "label": "GET Request"
          },
          {
            "type": "doc",
            "id": "express.js/requests/post-request",
            "label": "POST Request"
          },
          {
            "type": "doc",
            "id": "express.js/requests/multi-part-form-data",
            "label": "Multi-part form data"
          }
        ]
      },
      {
        "type": "doc",
        "id": "express.js/response",
        "label": "Response"
      },
      {
        "type": "doc",
        "id": "express.js/router",
        "label": "Router"
      },
      {
        "type": "doc",
        "id": "express.js/middleware",
        "label": "Middleware"
      },
      {
        "type": "doc",
        "id": "express.js/deployment",
        "label": "Deployment"
      }
    ]
  },
  {
    "type": "category",
    "label": "MongoDB",
    "items": [
      {
        "type": "doc",
        "id": "mongodb/wat-is-mongodb",
        "label": "Wat is MongoDB?"
      },
      {
        "type": "doc",
        "id": "mongodb/mongodb-driver",
        "label": "MongoDB driver"
      },
      {
        "type": "doc",
        "id": "mongodb/insert",
        "label": "Insert"
      },
      {
        "type": "doc",
        "id": "mongodb/find",
        "label": "Find"
      },
      {
        "type": "doc",
        "id": "mongodb/limit-and-sort",
        "label": "Limit & Sort"
      },
      {
        "type": "doc",
        "id": "mongodb/query-operators",
        "label": "Query Operators"
      },
      {
        "type": "doc",
        "id": "mongodb/update",
        "label": "Update"
      },
      {
        "type": "doc",
        "id": "mongodb/delete",
        "label": "Delete"
      },
      {
        "type": "doc",
        "id": "mongodb/text-search",
        "label": "Text Search"
      },
      {
        "type": "category",
        "label": "Gebruik in Express.js",
        "link": {
          "type": "doc",
          "id": "mongodb/gebruik-in-express.js"
        },
        "items": [
          {
            "type": "doc",
            "id": "mongodb/CRUD",
            "label": "CRUD"
          }
        ]
      }
    ]
  },
  {
    "type": "category",
    "label": "Security & Testing",
    "items": [
      {
        "type": "doc",
        "id": "security-and-testing/environment-variables",
        "label": "Environment Variables"
      },
      {
        "type": "doc",
        "id": "security-and-testing/cookies",
        "label": "Cookies"
      },
      {
        "type": "doc",
        "id": "security-and-testing/hashing",
        "label": "Hashing"
      },
      {
        "type": "category",
        "label": "Sessions",
        "link": {
          "type": "doc",
          "id": "security-and-testing/sessions"
        },
        "items": [
          {
            "type": "doc",
            "id": "security-and-testing/session-based-login",
            "label": "Session Based Login"
          }
        ]
      },
      {
        "type": "category",
        "label": "JWT Tokens",
        "link": {
          "type": "doc",
          "id": "security-and-testing/jwt-tokens/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "security-and-testing/jwt-tokens/jwt-npm-package",
            "label": "JWT NPM package"
          },
          {
            "type": "doc",
            "id": "security-and-testing/jwt-tokens/tokens-veilig-opslaan",
            "label": "Tokens veilig opslaan"
          },
          {
            "type": "doc",
            "id": "security-and-testing/jwt-tokens/token-based-login",
            "label": "Token Based Login"
          }
        ]
      },
      {
        "type": "doc",
        "id": "security-and-testing/testing",
        "label": "Testing"
      }
    ]
  },
],
  labosSidebar: [
      {
        "type": "doc",
        "id": "labos/labo1/index",
        "label": "1. Tooling"
      },
      {
        "type": "category",
        "label": "2. Basis",
        "link": {
          "type": "doc",
          "id": "labos/labo2/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/node-typescript/hello-name/index",
            "label": "Hello Name"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/bmi-calculator/index",
            "label": "BMI Calculator"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/bmi-calculator-multi/index",
            "label": "BMI Calculator Multi"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/interest-calculator/index",
            "label": "Interest Calculator"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/uren-en-minuten/index",
            "label": "Uren en Minuten"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/wisselgeld/index",
            "label": "Wisselgeld"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/name-from-email/index",
            "label": "Name from Email"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/text-box/index",
            "label": "Text Box"
          },
          {
            "type": "doc",
            "id": "labos/labo2/robot-readline",
            "label": "Robot Readline"
          }
        ]
      },
      {
        "type": "category",
        "label": "3. Arrays",
        "link": {
          "type": "doc",
          "id": "labos/labo3/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/node-typescript/som-van-getallen/index",
            "label": "Som van getallen"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/puntenboek/index",
            "label": "Puntenboek"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/rot13/index",
            "label": "Rot13"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/pokemon-team/index",
            "label": "Pokemon Team"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/todo-list-string/index",
            "label": "Todo List String"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/tic-tac-toe/index",
            "label": "Tick Tac Toe"
          },
          {
            "type": "doc",
            "id": "labos/labo3/robot-caesar",
            "label": "Robot Caesar"
          }
        ]
      },
      {
        "type": "category",
        "label": "4. Interfaces & functies",
        "link": {
          "type": "doc",
          "id": "labos/labo4/index"
        },
        "items": [
          {
            "type": "category",
            "label": "Interfaces",
            "link": {
              "type": "doc",
              "id": "labos/labo4/interfaces/index"
            },
            "items": [
              {
                "type": "doc",
                "id": "exercises/node-typescript/recepten/index",
                "label": "Recepten"
              },
              {
                "type": "doc",
                "id": "exercises/node-typescript/movies-objects/index",
                "label": "Movies Objects"
              },
              {
                "type": "doc",
                "id": "exercises/node-typescript/todo-list-objects/index",
                "label": "Todo List Objects"
              }
            ]
          },
          {
            "type": "category",
            "label": "Functies",
            "link": {
              "type": "doc",
              "id": "labos/labo4/functions/index"
            },
            "items": [
              {
                "type": "doc",
                "id": "exercises/node-typescript/math-fun/index",
                "label": "Math Fun"
              },
              {
                "type": "doc",
                "id": "exercises/node-typescript/short-notation/index",
                "label": "Short Notation"
              },
              {
                "type": "doc",
                "id": "exercises/node-typescript/array-sum/index",
                "label": "Array Sum"
              },
              {
                "type": "doc",
                "id": "exercises/node-typescript/movies-functions/index",
                "label": "Movies Functions"
              },
              {
                "type": "doc",
                "id": "exercises/node-typescript/filter-numbers/index",
                "label": "Filter Numbers"
              },
              {
                "type": "doc",
                "id": "exercises/node-typescript/at-least-two/index",
                "label": "At Least Two"
              }
            ]
          }
        ]
      },
      {
        "type": "category",
        "label": "5. Async & fetch",
        "link": {
          "type": "doc",
          "id": "labos/labo5/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/node-typescript/fake-fetch/index",
            "label": "Fake Fetch"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/promise-all/index",
            "label": "Promise All"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/slow-sum/index",
            "label": "Slow Sum"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/todo-list-fetch/index",
            "label": "Todo List Fetch"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/cocktails-promise-all/index",
            "label": "Cocktails Promise All"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/bitcoin-api/index",
            "label": "Bitcoin API"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/joke-api/index",
            "label": "Joke API"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/school-api/index",
            "label": "School API"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/cocktails-api/index",
            "label": "Cocktails API"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/unix-timestamp-api/index",
            "label": "Unix Timestamp API"
          }
        ]
      },
      {
        "type": "category",
        "label": "6. Modules en NPM Packages",
        "link": {
          "type": "doc",
          "id": "labos/labo6/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/node-typescript/math-module/index",
            "label": "Math Module"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/export-interfaces/index",
            "label": "Export Interfaces"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/cowsay-module/index",
            "label": "Cowsay Module"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/cat-gpt/index",
            "label": "Cat GPT"
          },
          {
            "type": "doc",
            "id": "exercises/node-typescript/rainbow-chalk/index",
            "label": "Rainbow Chalk"
          }
        ]
      },
      {
        "type": "category",
        "label": "7. Express",
        "link": {
          "type": "doc",
          "id": "labos/labo7/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/express/hello-express/index",
            "label": "Hello Express"
          },
          {
            "type": "doc",
            "id": "exercises/express/dadjoke-express/index",
            "label": "DadJoke Express"
          },
          {
            "type": "doc",
            "id": "exercises/express/bitcoin-current/index",
            "label": "Bitcoin current"
          }
        ]
      },
      {
        "type": "category",
        "label": "8. EJS + Static",
        "link": {
          "type": "doc",
          "id": "labos/labo8/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/express/hello-express-ejs/index",
            "label": "Hello Express EJS"
          },
          {
            "type": "doc",
            "id": "exercises/express/catstatic/index",
            "label": "Cat Static"
          },
          {
            "type": "doc",
            "id": "exercises/express/maaltafels-ejs/index",
            "label": "Maaltafels"
          },
          {
            "type": "doc",
            "id": "exercises/express/newspaper/index",
            "label": "Newspaper"
          }
        ]
      },
      {
        "type": "category",
        "label": "9. Get Request",
        "link": {
          "type": "doc",
          "id": "labos/labo9/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/express/hello-query/index",
            "label": "Hello Query"
          },
          {
            "type": "doc",
            "id": "exercises/express/math-service-express/index",
            "label": "Math Service"
          },
          {
            "type": "doc",
            "id": "exercises/express/newspaper-route/index",
            "label": "Newspaper Route"
          },
          {
            "type": "doc",
            "id": "exercises/express/newspaper-search/index",
            "label": "Newspaper Search"
          },
          {
            "type": "doc",
            "id": "exercises/express/steam/index",
            "label": "Steam"
          }
        ]
      },
      {
        "type": "category",
        "label": "10. Post Request",
        "link": {
          "type": "doc",
          "id": "labos/labo10/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/express/petshelter-form/index",
            "label": "Pet Shelter"
          },
          {
            "type": "doc",
            "id": "exercises/express/redirect-form/index",
            "label": "Redirect Form"
          },
          {
            "type": "doc",
            "id": "exercises/express/contact-form/index",
            "label": "Contact Form"
          }
        ]
      },
      {
        "type": "category",
        "label": "11. Router en Middleware",
        "link": {
          "type": "doc",
          "id": "labos/labo11/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/express/router-combi/index",
            "label": "Router Combi"
          },
          {
            "type": "doc",
            "id": "exercises/express/utility-middleware/index",
            "label": "Utility Middleware"
          },
          {
            "type": "doc",
            "id": "exercises/express/rate-limiter-middleware/index",
            "label": "Rate Limiter"
          }
        ]
      },
      {
        "type": "category",
        "label": "12. Herhaling",
        "link": {
          "type": "doc",
          "id": "labos/labo12/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/express/twitter/index",
            "label": "Twitter"
          },
          {
            "type": "doc",
            "id": "exercises/express/word-guess/index",
            "label": "Word Guess"
          }
        ]
      },
      {
        "type": "category",
        "label": "13. Mongo Basics",
        "link": {
          "type": "doc",
          "id": "labos/labo13/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/mongodb/guestbook/index",
            "label": "Guestbook"
          },
          {
            "type": "doc",
            "id": "exercises/mongodb/movies-db/index",
            "label": "MoviesDB"
          },
          {
            "type": "doc",
            "id": "exercises/mongodb/pokemon-team/index",
            "label": "Pokemon Team"
          }
        ]
      },
      {
        "type": "category",
        "label": "14. Mongo Queries",
        "link": {
          "type": "doc",
          "id": "labos/mongo-queries/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/mongodb/pet-shelter/index",
            "label": "Pet Shelter"
          },
          {
            "type": "doc",
            "id": "exercises/mongodb/games-db/index",
            "label": "Games DB"
          }
        ]
      },
      {
        "type": "category",
        "label": "15. Mongo + Express",
        "link": {
          "type": "doc",
          "id": "labos/mongo-+-express/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/mongodb/pet-shelter-express/index",
            "label": "Pet Shelter Express"
          },
          {
            "type": "doc",
            "id": "exercises/mongodb/guestbook-express/index",
            "label": "Guestbook Express"
          },
          {
            "type": "doc",
            "id": "exercises/mongodb/pokemon-team-express/index",
            "label": "Pokemon Team Express"
          }
        ]
      },
      {
        "type": "category",
        "label": "16. CRUD",
        "link": {
          "type": "doc",
          "id": "labos/crud/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/mongodb/users-crud-express/index",
            "label": "Users CRUD"
          },
          {
            "type": "doc",
            "id": "exercises/mongodb/pokedex-mongo-express/index",
            "label": "Pokedex"
          }
        ]
      },
      {
        "type": "category",
        "label": "17. Session & Cookies",
        "link": {
          "type": "doc",
          "id": "labos/session-and-cookies/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/security/shopping-cookie/index",
            "label": "Shopping Cookie"
          },
          {
            "type": "doc",
            "id": "exercises/security/view-counter-cookies/index",
            "label": "View Counter Cookies"
          },
          {
            "type": "doc",
            "id": "exercises/security/view-counter-sessions/index",
            "label": "View Counter Sessions"
          }
        ]
      },
      {
        "type": "category",
        "label": "18. Session based login",
        "link": {
          "type": "doc",
          "id": "labos/session-based-login/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/security/login-express/index",
            "label": "Login Express"
          },
          {
            "type": "doc",
            "id": "exercises/security/pokedex-express-sessions/index",
            "label": "Pokedex Express Sessions"
          }
        ]
      },
      {
        "type": "category",
        "label": "19. Token based login",
        "link": {
          "type": "doc",
          "id": "labos/token-based-login/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/security/jwt-sign/index",
            "label": "JWT Sign"
          },
          {
            "type": "doc",
            "id": "exercises/security/login-express-jwt/index",
            "label": "Login Express JWT"
          }
        ]
      },
      {
        "type": "category",
        "label": "20. Testing",
        "link": {
          "type": "doc",
          "id": "labos/testing/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/testing/math-test/index",
            "label": "Math Test"
          },
          {
            "type": "doc",
            "id": "exercises/testing/string-test/index",
            "label": "String Test"
          },
          {
            "type": "doc",
            "id": "exercises/testing/math-express-test/index",
            "label": "Math Express Test"
          },
          {
            "type": "doc",
            "id": "exercises/testing/form-express-test/index",
            "label": "Form Express Test"
          },
          {
            "type": "doc",
            "id": "exercises/testing/pet-shelter-express-test/index",
            "label": "Pet Shelter Express Test"
          }
        ]
      },
      {
        "type": "category",
        "label": "21. Herhaling",
        "link": {
          "type": "doc",
          "id": "labos/herhaling/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/herhaling/youtube-playlists/index",
            "label": "Youtube Favorites"
          },
          {
            "type": "doc",
            "id": "exercises/herhaling/beerster/index",
            "label": "Beerster"
          }
        ]
      },
      {
        "type": "category",
        "label": "Extra oefeningen",
        "link": {
          "type": "doc",
          "id": "labos/extra/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "exercises/node-typescript/dna-match/index",
            "label": "DNA Match"
          },
          {
            "type": "doc",
            "id": "exercises/express/viewcounter/index",
            "label": "View Counter"
          },
          {
            "type": "doc",
            "id": "exercises/mongodb/hogwarts-express-crud/index",
            "label": "Hogwarts Express CRUD"
          }
        ]
      },
      {
        "type": "doc",
        "id": "labos/circuit-crawler",
        "label": "Circuit Crawler"
      },
  {
    "type": "category",
    "label": "Project",
    "items": [
      {
        "type": "doc",
        "id": "project/dev-container",
        "label": "Voorbereiding (devcontainer + github)"
      },
      {
        "type": "category",
        "label": "Semester 2",
        "link": {
          "type": "doc",
          "id": "project/semester-2/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "project/semester-2/milestone-0-json",
            "label": "Milestone 0 - JSON"
          },
          {
            "type": "doc",
            "id": "project/semester-2/milestone-1-terminal-app",
            "label": "Milestone 1 - Terminal App"
          },
          {
            "type": "doc",
            "id": "project/semester-2/milestone-2-express",
            "label": "Milestone 2 - Express"
          },
          {
            "type": "doc",
            "id": "project/semester-2/milestone-3-mongodb",
            "label": "Milestone 3 - MongoDB"
          },
          {
            "type": "doc",
            "id": "project/semester-2/milestone-4-security",
            "label": "Milestone 4 - Security"
          }
        ]
      },
      {
        "type": "category",
        "label": "Semester 1",
        "link": {
          "type": "doc",
          "id": "project/semester-1/index"
        },
        "items": [
          {
            "type": "doc",
            "id": "project/semester-1/node-client",
            "label": "Milestone 1 - Terminal App"
          },
          {
            "type": "doc",
            "id": "project/semester-1/milestone-2-express",
            "label": "Milestone 2 - Express"
          },
          {
            "type": "doc",
            "id": "project/semester-1/milestone-3-mongodb",
            "label": "Milestone 3 - MongoDB"
          },
          {
            "type": "doc",
            "id": "project/semester-1/milestone-4-security",
            "label": "Milestone 4 - Security"
          }
        ]
      }
    ]
  }
]
};

export default sidebars;
