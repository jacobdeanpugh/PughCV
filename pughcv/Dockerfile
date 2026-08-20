# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------------------------------------------------------------------------

FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV XDG_CACHE_HOME=/app/.cache

# The drop-sh Tectonic build is dynamically linked; bookworm-slim ships none of
# its text-shaping/font stack. Missing any one of these fails at exec time with
# a bare "cannot open shared object file", not at install time.
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
       ca-certificates curl \
       libfontconfig1 libfreetype6 libgraphite2-3 libharfbuzz0b libicu72 libssl3 \
  && rm -rf /var/lib/apt/lists/*

# The ldd check fails here with a readable list of what is missing, rather than
# as a bare exit 127 from the cache-priming layer below.
RUN curl --proto '=https' --tlsv1.2 -fsSL https://drop-sh.fullyjustified.net | sh \
  && mv tectonic /usr/local/bin/tectonic \
  && ! ldd /usr/local/bin/tectonic | grep 'not found'

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs \
  && mkdir -p /app/.cache \
  && chown -R nextjs:nodejs /app

# Prime the Tectonic bundle cache at build time (needs network here only) so
# the container never has to reach the internet to typeset at runtime.
COPY --chown=nextjs:nodejs docker/prime-cache.tex /app/docker/prime-cache.tex
USER nextjs
RUN tectonic /app/docker/prime-cache.tex --outdir /tmp \
  && rm -rf /app/docker

COPY --chown=nextjs:nodejs --from=builder /app/.next/standalone ./
COPY --chown=nextjs:nodejs --from=builder /app/.next/static ./.next/static
COPY --chown=nextjs:nodejs --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
