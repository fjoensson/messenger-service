# messenger-service
(tested on Ubuntu 20.04)

Install nodejs Gallium (16 LTS)

Install npm

git clone github.com/fjoensson/messenger-service/

npm install

npm start

# Assumptions
* A recipient must be registred before you can send a message
* The client is interested in messages for a single user - not all messages
* Fetch "according to start and stop index" - unclear if this is related to id:s or not, but since it is mentioned in relation to timestamp I assume it start/end timestamp. 

# Comments
* Messages may be stored under the user instead of by themselves. Volumes?
* The implementation of the mock store/db is not production quality...

# TODO
* functinal complete [x]
* api versioning [x] 
* errorHandling [x] - example
* static validation [x] - example
* dynamic validation [x] - example
* unit test [ ]
* api test [ ]
* authentication [ ]
* authorization/acl [ ]
* trim strings [ ]
* security [ ]
* logging [ ]
* monitoring [ ]
* configuration [ ]
* simplify/refactor [x]
* performance [ ]
* redundancy [ ]
* formatting [ ]
* lint checks [ ]
* migration [ ]
