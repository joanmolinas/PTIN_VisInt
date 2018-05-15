# Visualització i interacció

**API Endpoint**

```
https://ptin2018.herokuapp.com/api
```

**Content-Type**
```
application/json
```

## Auth
**Sign in**
```
POST: /auth/signin
```

### Request
```json
{
	"username": "my_fancy_username",
	"password": "my_super_password"
}
```

### Response
**OK**
```json
{
	"data": {
	  "preferences": {
            "language": 1
        },
        "_id": "5ae9d5be797d51120ee1a059",
        "username": "my_new_user",
        "password": 
"$2b$10$BXJjxJdDs8P6LchLm9xNrOlH2Xtb8GNhiTOZqTIWIJ3r4fsWFyxYm",
        "__v": 0,
        "token":
"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1YWU5ZDViZTc5N2Q1MTE
yMGVlMWEwNTkiLCJpYXQiOjE1MjUyNzQwNDcsImV4cCI6MTUzMDQ1ODA0N
30.GA6rN_DiN7LJPeZwh0GjsNjgxT3Pt1nnZueySrSU4p4"
    }
}
```

**ERROR**
> Error 404 user didn't found. Error 400 something wrong happened.

```json
{
    "status": 400
}
```

**Sign up**
```
POST: /auth/signup
```

### Request
```json
{
	"username": "my_fancy_username",
	"password": "my_super_password"
}
```

### Response
**OK**
```json
{
	"data": {
	  "preferences": {
            "language": 1
        },
        "_id": "5ae9d5be797d51120ee1a059",
        "username": "my_new_user",
        "password": 
"$2b$10$BXJjxJdDs8P6LchLm9xNrOlH2Xtb8GNhiTOZqTIWIJ3r4fsWFyxYm",
        "__v": 0,
        "token":
"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1YWU5ZDViZTc5N2Q1MTEyMGVlMWEwNTkiLCJpYXQiOjE1MjUyNzQwNDcsImV4cCI6MTUzMDQ1ODA0N30.GA6rN_DiN7LJPeZwh0GjsNjgxT3Pt1nnZueySrSU4p4"
    }
}
```

**ERROR**
> Error 400 username or password not found or username already exist.

```json
{
    "status": 400
}
```

**Change user's language**
```
PUT: /user/:id
```

### Request
You must provide a valid token at the window "Authorithation" in Postman
```json
{
	"language" : 2
}
```

Note: language = 1 = català
      language = 2 = castellano
      language = 3 = english
      language by default is 1

### Response
**OK**
```json
{
	"message": "Preferences changed"
}
```

**ERROR**
```json
{
	"message": "Invalid language"
}
```


## Devices

**List of devices**
```
GET: /devices
```

You can filter by the following parameters:
- Name: You can sort by name adding 'name=xxx' inside request params (eg. name='dev')
- Type: You can sort by type adding 'type=x' inside request params. (eg. type=1)
- Fields: You can manage response fields adding 'fields=[...]' inside request params. (eg. fields=[name, type])

> All of these filters could be work together, you are able to combine every filter with each other. (eg. /devices?name='dev'&type=1&fields=[name])


### Response
**OK**
> Returns an array of devices that complains filter, all devices otherwise.
```json
[
 {

 },
 {

 }
]
```

**Get device**
```
GET: /devices/:id
```

### Response
**OK**
> Returns the device
```json
{

}
```

**Create device**
```
POST: /devices
```
> Device types are valid in a range of [1-6].
 ESCRIURE AQUI A QUIN TIPUS DE DISPOSITIU CORRESPON CADA TYPE: 1-->Pacient, etc
 
### Request
```json
{
	"name": "Name of my awesome device",
	"type": 1
}
```

### Response
**OK**
```json
{
  "status": 201,
  "id": "5acdff40e9b2623e28ce4da0",
  "token": "UIREWNGFLEjuirnewfwknfin8264627HJBFJWhwbfjwbjfbwjbeIRWHBFIW88Y74HW8YF4B3899"
}
```
> You must save the token to update device info with PUT request

**ERROR**
```json
{
  "status": 400
}
```

**Update device**
```
PUT: /devices
```

### Request

You can add or change any parameter that you need.
- YOU NEED THE DEVICE TOKEN to update info, you can get the device token by creating it with POST request.
- Include the device token in the HEADER FIELD to verify authentication.

```json
{
	"latitude": 51,
	"longitude": 1,
}
```

### Response
**OK**
```json
{
    "status": 200
}
```

**ERROR**
```json
{
  "status": 400
}
```

**Delete device**
```
GET: /devices/delete/:id
```
### Response
>  Delete a device giving its ID

**OK**
```json
{
    "status": 200
}
```
**ERROR**
```json
{
  "status": 400
}
```
