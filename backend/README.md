# FashionStore Backend

Backend API for a personalized outfit recommendation website.

## Setup

```bash
cd backend
npm install
```

Create `.env` from `.env.example` and update `MONGODB_URI`.

## Run

```bash
npm run dev
```

## Seed data

Import sample data:

```bash
npm run seed:import
```

Delete seeded data:

```bash
npm run seed:destroy
```

## Main API prefix

```text
/api
```

## Example endpoints

- `GET /api/health`
- `GET /api/products`
- `POST /api/products`
- `GET /api/users`
- `POST /api/user-behaviors`
