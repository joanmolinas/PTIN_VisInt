# Visualització i interacció

**API Endpoint**

```
https://ptin2018.herokuapp.com/api
```

**Content-Type**
```
application/json
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
GET: /device/:id
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
  "id": "5acdff40e9b2623e28ce4da0"
}
```

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
> You can add any parameter that you need
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

