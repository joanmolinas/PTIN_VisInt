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
        "password": "$2b$10$BXJjxJdDs8P6LchLm9xNrOlH2Xtb8GNhiTOZqTIWIJ3r4fsWFyxYm",
        "__v": 0,
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1YWU5ZDViZTc5N2Q1MTE yMGVlMWEwNTkiLCJpYXQiOjE1MjUyNzQwNDcsImV4cCI6MTUzMDQ1ODA0N30.GA6rN_DiN7LJPeZwh0GjsNjgxT3Pt1nnZueySrSU4p4"
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
        "password": "$2b$10$BXJjxJdDs8P6LchLm9xNrOlH2Xtb8GNhiTOZqTIWIJ3r4fsWFyxYm",
        "__v": 0,
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1YWU5ZDViZTc5N2Q1MTEyMGVlMWEwNTkiLCJp
YXQiOjE1MjUyNzQwNDcsImV4cCI6MTUzMDQ1ODA0N30.GA6rN_DiN7LJPeZwh0GjsNjgxT3Pt1nnZueySrSU4p4"
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
```javascript
[
    // Array of devices
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

> When a devices is created, a token is returned as a parameter on the response. You need to store this token on your device if you want to update device data because update needs a token on the header.

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

> You are able to add or update any field that you need.
> To update the device information you must need to pass a token as a parameter on the request. This paramater needs to be inside the headers dictionary in the following format.

**Example python**

```python
    # Requests is a http framework
    requests.get('https://ptin2018.herokuapp.com/api/devices/:id', headers={'Authorization': 'Bearer my_awesome_token'})

    # Since this moment request will provide a token inside request headers
```

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

## Sockets

Sockets are a end to end connections allowing multiple devices send notifications to backend, also allows backend send messages to devices.

## How to connect to backend?
Backend works with socket.io as a service, this means every client could connect using a simple socket client library.

> End point is where you want to send/receive messages. A endpoint is an event associated to an action.

**Connect to socket**
Connection is built on top of http connection, to connect a client, you must need to put the following url to a client socket.

> URL: https://ptin2018.herokuapp.com

If you want to receive messages to a device, you must provide your device id as a dictionary when connection is open. 

```javascript
{ query: "id=my_fancy_id" }
```

**Example with javascript**
```javascript
    // io is a client library from socket.io
    io.connect("http://localhost:3000", { query: "id=1234" });
    
```


Backend is listening forever to a client sockets connection on this endpoint. Once you have been connect, you can send notifications and receive messages.
You don't need any port or similar to connect, just using the url. We encourage you to use a socket.io python library to connect with backend service. This kind of libraries are build on top of socket services and will handle connections and errors.

### Send notifications to backend

This section will explain how to send notifications to backend from the devices. 

At the moment we have 4 types of notifications: 

- Fire notification
- Heart attack notification
- High temperature notification
- Low temperature notification

All you have to do is go to a socketIO client tool (http://amritb.github.io/socketio-client-tool/) and:

1. At field Socket.io server URL you must write the URL https://ptin2018.herokuapp.com then click "Connect".

2. Go to the option "Emiting". At field "Event name" you must write one of the four types of notifications that we mentioned before. If you want to send a fire notification you must write just "fire", without the quotes. "heart_attack" for Heart attack notification, "high_temp" and "low_temp" for high/low temperature notifications.

3. At "Data: plaintext" field you must write whatever you want, it doesn't matter.

4. Click "Emit" button and you have sent the notification.


You can also send notifications to backend with a script. You should do the same as before but with code, using socketIO library.

You have an example of a script made in Python in https://github.com/ulidev/PTIN_VisInt/edit/develop/

### Receive messages from the backend

This section will explain how to receive messages from the backend. Message is the action to receive data via socket from backend. For example if I want to receive shutdown notifications, I will need to know how to handle shutdown endpoint. 

__Types of notifications__

| Notifications | End point         | Parameters    | Type of parameters|
| :-----------: | :---------------: | :-----------: | :---------------: |
| Dev.updated   | refreshDevices    | NO            | -                 |
| Shutdown      | shutdown          | NO            | -                 |
| Loc. doctor   | locationToDoctor  | YES           | dictionary        |
| Loc. pacient  | locationToPacient | YES           | dictionary        |  

```javascript
    
    var socket = io.connect('http://localhost:3000', { query: "id=1234" });
    socket.on('shutdown', () => {
        // This event handle an event from shutdown endpoint received from the backend. That means every time the backend will send a shutdown event to me or to everyone, this block of code will be fired and executed properly.
        console.log('shutdown received')
    })

    // To receive other information, you just need to handle desired functions to handle.
```

**This party tools to test it**

[UI tool to test it](http://amritb.github.io/socketio-client-tool/)
