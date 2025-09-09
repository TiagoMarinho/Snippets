FROM oven/bun:1.2.21-slim

WORKDIR /app

COPY bun.lock package.json ./
RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "run", "start"]