## Load admin panel ##

Admin panel works with vue components. At the moment it works as separated project in port 8080

## Run as developer ##

``` bash
cd components
npm run dev
```

open your browser in
> localhost:8080/admin/login.html

### Deploy ###

First we will need generate html files, so in order to do that we will execute:

``` bash
cd components
npm run build
```

Now move the dist folder and the index.html file to a http server.