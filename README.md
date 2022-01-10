# messenger-service
Messenger service for triOpt

Install nodejs Gallium (16 LTS)

Install npm version >8

git clone github.com/fjoensson/messenger-service/

npm install

npm start

# Assumptions
* A recipient must be registred before you can send a message
* The client is interested in messages for a single User - not all messages

# Comments
* Messages may be stored under the user instead of by themselves. Volumes?
* I try to use immutables were possible. I like helper libraries but skipped them now.
* The implementation of the mock store/db is not production quality...

# TODO
* api versioning [x] 
* errorHandling [ ]
* static validation [ ]
* dynamic validation [ ]
* trim strings [ ]
* unit test [ ]
* api test [ ]
* security [ ]
* logging [ ]
* configuration [ ]
* performance [ ]
* redundancy [ ]
* formatting [ ]
* lint checks [ ]
