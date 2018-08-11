# API Example

Just a simple API example

## Database

```bash
npm run mysql -- -e 'create database app'
npm run mysql -- -e 'create database app_test'

npm run db migrate:latest
NODE_ENV=test npm run db migrate:latest
```
