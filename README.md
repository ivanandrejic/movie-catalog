# Simple Movie management system

## Prerequisites
1. Maven 3.2.5
2. JDK 1.8
3. MongoDB 3.2

## Setup 

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

## Test

Server starts at https://localhost:8443/
There are two predefined users:

| Username | Password |
| -------- | -------- |
| admin    | demo     |
| user     | demo     |




