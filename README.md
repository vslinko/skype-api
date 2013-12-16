# skype-api

> Node.js API to local Skype instance.

## Usage Example

```js
var skypeAPI = require('skype-api');

var skype = skypeAPI();

skype.getUser('echo123', function (err, user) {
    console.log(user);
});
```

## API

### getChats(callback)

* `callback` — `function (err, chats) {}`

```json
[
    {
        "friendlyName": "Вася Хобот",
        "topic": "",
        "name": "#vyacheslav.slinko/$live:vasya.hobot;9f62de6c85e3daed"
    }
]
```

### getChat(chatName, callback)

* `chatName` — `'#vyacheslav.slinko/$live:vasya.hobot;9f62de6c85e3daed'`
* `callback` — `function (err, chat) {}`

```json
{
    "status": "DIALOG",
    "bookmarked": false,
    "myRole": "USER",
    "dialogPartner": "live:vasya.hobot",
    "description": "",
    "timestamp": 1387175594,
    "guideLines": "",
    "blob": "mTuwsNpnv9Sh2ynShSr4UaAGUJH_c-3UhvY5wphXoGBORSLDZ8ZNvaqRmh2Uy3uoS4FzjGUEMU2X9fjcaJFe",
    "name": "#vyacheslav.slinko/$live:vasya.hobot;9f62de6c85e3daed",
    "passwordHint": "",
    "friendlyName": "Вася Хобот",
    "topic": "",
    "myStatus": "SUBSCRIBED",
    "adder": "",
    "members": ["live:vasya.hobot", "vyacheslav.slinko"],
    "activityTimestamp": 1387175597,
    "posters": ["vyacheslav.slinko"],
    "activeMembers": ["live:vasya.hobot", "vyacheslav.slinko"],
    "type": "DIALOG",
    "applicants": []
}
```

### getUser(userName, callback)

* `userName` — `'live:vasya.hobot'`
* `callback` — `function (err, user) {}`

```json
{
    "province": "",
    "languageCode": "ru",
    "canLeaveVoicemail": false,
    "handle": "live:vasya.hobot",
    "countryCode": "ru",
    "isVoicemailCapable": false,
    "isAuthorized": true,
    "buddyStatus": 3,
    "phoneOffice": "",
    "hasCallEquipment": true,
    "birthday": 664232400,
    "moodText": "Вася. Управляй мечтой.",
    "timezone": 86400,
    "fullName": "Вася Хобот",
    "sex": "MALE",
    "aliases": [],
    "city": "",
    "about": "",
    "speedDial": "",
    "displayName": "",
    "language": "Russian",
    "isCallForwardActive": false,
    "country": "Russia",
    "richMoodText": "Вася. Управляй мечтой.",
    "isSkypeOutContact": false,
    "phoneHome": "",
    "numberOfAuthBuddies": 0,
    "phoneMobile": "",
    "isVideoCapable": false,
    "isBlocked": false,
    "lastOnline": 1387175597,
    "homepage": "вася-хобот.рф",
    "onlineStatus": "NA",
    "receivedAuthRequest": ""
}
```

### sendMessage(chatName, messageBody, callback)


* `chatName` — `'#vyacheslav.slinko/$live:vasya.hobot;9f62de6c85e3daed'`
* `messageBody` — `'Hello World!'`
* `callback` — `function (err, message) {}`

```json
{
    "body": "Hello World!",
    "fromHandle": "vyacheslav.slinko",
    "id": 1464329,
    "chatName": "#vyacheslav.slinko/$live:vasya.hobot;9f62de6c85e3daed"
}
```

### on('message', callback)

* `callback` — `function (message) {}`

```json
{
    "message": "Hello dude!",
    "user": "live:vasya.hobot",
    "room": "#vyacheslav.slinko/$live:vasya.hobot;9f62de6c85e3daed"
}
```
