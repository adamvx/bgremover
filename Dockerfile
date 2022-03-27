FROM node:lts as builder
WORKDIR /usr/src/app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:lts as runner
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/next.config.js ./
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

CMD ["yarn", "start"]