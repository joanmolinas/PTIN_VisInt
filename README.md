# PTIN_VisInt #

First of all npm must be installed in your system.

## Installing dependencies ##

Open your terminal, go to project folder and execute the follow command:

```
npm install
```

## Project configuration ##

Configuration stuff is located in __config.json__, in this file allows configure:

- Database connection
- Set default language
- Add new language

### Configure database connection ###

```
    "mongodb": {
        "hostname": "localhost",
        "port": "",
        "user": "",
        "pwd": "",
        "database": "local"
    }
```
Where:

- **hostname** host where mongodb is running.
- **port** used port to connect mongodb database.
- **user** username of the database owner. 
- **pwd** username password.
- **database** database where collections are stored. 

### Set default language ###

```
    "language": {
        "default_language": "es",

        "es": {
            "name": "español"
        },
        "cat" : {
            "name": "català"
        },
        "en": {
            "name": "english"
        }
    }
```

Just modify language.default_language specificating id from existing language.

### Add new language ###

Add new element on language following this pattern

```
"id": {
    "name": "how this language will be displayed in language listt"
}
```

## Project structure ##

```
/
├── bin/
├── lang/ --> translation files
│   ├── cat/
│   |   ├── admin.json
|   |   └── public.json
│   ├── en/
│   |   ├── admin.json
|   |   └── public.json
│   └── es/
│       ├── admin.json
|       └── public.json
├── models/ --> mongoose schemas
├── public/
│   ├── images/
│   ├── javascripts/
│   ├── stylesheets/
│   ├── vendors/ --> third party
│   └── favicon.ico
└── routes/
|   ├── admin.js
|   ├── public.js
|   └── api.js
└── views/ --> template files
└── app.js
└── config.json
└── LICENSE
└── package.json
└── propuesta.md
└── README.md/
```