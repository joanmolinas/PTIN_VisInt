# Hampy

**API endpoint**

```
Development: http://localhost:8181/api/v1
```
```
Production: http://usehamp.io/api/v1
```

**Content-Type**
```
application/json
```

### Description

### Auth
**Sign in**
```
POST: /auth/signin
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
