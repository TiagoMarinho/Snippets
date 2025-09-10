FROM oven/bun:1.2.21

WORKDIR /app

COPY bun.lock package.json ./
RUN apt-get update && apt-get install -y python3 build-essential
RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "run", "start"]