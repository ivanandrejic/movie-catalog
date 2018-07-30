# Simple Movie management system

## Prerequisites
1. Maven 3.2.5
2. JDK 1.8
3. MongoDB 3.2

## Local Setup 

1. Download or git clone
2. Init MongoDB with movies database from src\main\resources\init-dump:
```
mongorestore src\main\resources\init-dump
```
3. Build maven
```
mvn clean package
```
4. Run
```
mvn spring-boot:run
```
Server starts at http://localhost:8080/

## Cloud

Application is deployed to Heroku platform and there is MongoDB setup on mLab.
```
https://movies-demo.herokuapp.com/
```

AWS deployment:
```
http://moviecatalog-env-1.uwffymp7xp.us-east-2.elasticbeanstalk.com
```

To use remote DB from localhost change **application.properties** set **spring.data.mongodb.uri**.

## Test

There are two predefined users:

| Username | Password |
| -------- | -------- |
| admin    | demo     |
| user     | demo     |

## HTTPS Setup

To setup https for localhost change **application.properties**:
```
server.port: 8443
server.ssl.key-store: keystore.p12
server.ssl.key-store-password: movies
server.ssl.keyStoreType: PKCS12
server.ssl.keyAlias: movies
```
Also **SecurityConfig** class need to be changed.

