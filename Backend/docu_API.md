# VisInt

**API endpoint**

* **URL**

https://ptin2018.herokuapp.com/


### Description

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
