# messenger-service
(tested on Ubuntu 20.04)

Install nodejs Gallium (16 LTS)

Install npm

git clone git@github.com:fjoensson/messenger-service.git

npm install

npm start

# Test
curl commands available in /curl.txt

POST:
available recipientId =[111,222,333]

GET:
userId query parameter mandatory, use same as recipientId

startIndex/endIndex is epoch

# Assumptions
* A recipient must be registred before you can send a message
* The client is interested in messages for a single user - not all messages
* Fetch "according to start and stop index" - unclear if this is related to id:s or not, but since it is mentioned in relation to timestamp I assume it start/end timestamp. 

# Comments
* Messages may be stored under the user instead of by themselves. Volumes?
* The implementation of the mock store/db is not production quality...
* This was pretty fun

# TODO
* functinal complete [x]
* api versioning [x] 
* errorHandling [x] - example
* static validation [x] - example
* dynamic validation [x] - example
* unit test [ ]
* api test [ ] - manual
* authentication [ ]
* authorization/acl [ ]
* trim strings [ ]
* security [ ]
* logging [ ] - discuss winston
* monitoring [ ]
* configuration [ ] - discuss config
* simplify/refactor [x]
* performance [ ]
* redundancy [ ]
* formatting [x]
* lint checks [x]
* migration [ ]
