# VisInt

**API endpoint**

* **URL**

https://ptin2018.herokuapp.com/


### Description

Descripció API VisInt

**Add device**
```
POST: /device/add
```
> Request
``` json
{
	"id" : "00001",
	"name" : "Dispositiu Pepe",
	"latitude" : "47.993",
	"longitude" : "5.115"
}
```
> Response
``` json
{
    "message": "",
    "data": {
        "id": [],
        "name": "Dispositiu Pepe",
        "latitude": "47.993",
        "longitude": "5.115",
    },
    "code": 200
}
```

**Delete device**
```
DELETE: /device/deleteDevice
```
> Request
``` json
{
	"id" : "00001",
	"name" : "Dispositiu Pepe",
	"latitude" : "47.993",
	"longitude" : "5.115"
}
```
> Response
``` json
{
    "message": "",
    "data": {
        "id": [],
        "name": "Dispositiu Pepe",
        "latitude": "47.993",
        "longitude": "5.115",
    },
    "code": 200
}
```

**Delete ALL**
```
DELETE: /device/borra
```
> Request
``` json
{
	"id" : "00001",
	"name" : "Dispositiu Pepe",
	"latitude" : "47.993",
	"longitude" : "5.115"
}
```
> Response
``` json
{
    "message": "",
    "data": {
        "id": [],
        "name": "Dispositiu Pepe",
        "latitude": "47.993",
        "longitude": "5.115",
    },
    "code": 200
}
```

**Get/Find device**
```
GET: /device/
```
> Request
``` json
{
	"id" : "00001",
	"name" : "Dispositiu Pepe",
	"latitude" : "47.993",
	"longitude" : "5.115"
}
```
> Response
``` json
{
    "message": "",
    "data": {
        "id": [],
        "name": "Dispositiu Pepe",
        "latitude": "47.993",
        "longitude": "5.115",
    },
    "code": 200
}
```

**Get/Find ALL**
```
GET: /device/
```
> Request
``` json
{
	"id" : "00001",
	"name" : "Dispositiu Pepe",
	"latitude" : "47.993",
	"longitude" : "5.115"
}
```
> Response
``` json
{
    "message": "",
    "data": {
        "id": [],
        "name": "Dispositiu Pepe",
        "latitude": "47.993",
        "longitude": "5.115",
    },
    "code": 200
}
```
