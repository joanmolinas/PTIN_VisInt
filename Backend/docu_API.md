# VisInt

**API endpoint**

```
Production: https://ptin2018.herokuapp.com/
```

### Description

**Add device**
```
POST: /device/add
```
> Request
``` json
{
	"email" : "elon@usehamp.io",
	"password" : "1234567890"
}
```
> Response
``` json
{
    "message": "",
    "data": {
        "cards": [],
        "surname": "Musk",
        "email": "elon@usehamp.io",
        "identifier": "92da06f492c3435b883d845df00dacd4",
        "name": "Elon"
    },
    "code": 200
}
```
