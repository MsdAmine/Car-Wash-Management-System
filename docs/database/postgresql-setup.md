# PostgreSQL Setup

## Database Name

```txt
car_wash_db
```

## Default Local Configuration

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/car_wash_db
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:postgres}
```

## Create Database

```sql
CREATE DATABASE car_wash_db;
```

## Optional Dedicated User

```sql
CREATE USER car_wash_user WITH PASSWORD 'car_wash_password';
GRANT ALL PRIVILEGES ON DATABASE car_wash_db TO car_wash_user;
```

## Environment Variables

Optional environment variables:

- `DB_USERNAME`
- `DB_PASSWORD`

Example PowerShell setup:

```powershell
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="postgres"
```

## Notes

For local development, Hibernate is configured with:

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update
```

This allows Spring Boot to update the schema automatically during development.

For production, this should be changed to a safer strategy such as `validate` with migration tools.
