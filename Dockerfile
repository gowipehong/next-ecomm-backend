FROM node:18-slim AS builder

LABEL maintainer="Hong <gowipehong@gmail.com>"

RUN apt-get update && apt-get install -y openssl libssl-dev

WORKDIR /

# INSTALL DEPENDENCIES
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

WORKDIR /app

RUN npm install
# END INSTALL DEPENDENCIES

WORKDIR /app

COPY . /app

RUN --mount=type=secret,id=db_secret \
  DATABASE_URL="$(cat ./secrets/postgres_connection_string)" \
  npx prisma migrate deploy \
  && npx prisma generate

# Production image, copy all the files and run next
FROM node:18-slim AS runner

WORKDIR /app

ENV NODE_ENV development
# ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app ./

CMD [ "npm", "run", "start" ]