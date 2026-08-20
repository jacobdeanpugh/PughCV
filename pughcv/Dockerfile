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

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*

# Pin the version: the release URL is exact, so an upstream bump can never
# silently change what lands in the image.
ARG TECTONIC_VERSION=0.17.0

# Use the musl tarball, NOT the drop-sh installer. drop-sh serves the
# x86_64-unknown-linux-gnu build, which needs GLIBC_2.38/2.39 and therefore
# cannot run on bookworm (2.36). The musl build is statically linked, so it
# needs neither a newer libc nor the harfbuzz/freetype/icu font stack.
RUN mkdir -p /tmp/tectonic \
  && curl --proto '=https' --tlsv1.2 -fsSL \
       "https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%40${TECTONIC_VERSION}/tectonic-${TECTONIC_VERSION}-x86_64-unknown-linux-musl.tar.gz" \
     | tar -xz -C /tmp/tectonic \
  && mv "$(find /tmp/tectonic -type f -name tectonic)" /usr/local/bin/tectonic \
  && chmod +x /usr/local/bin/tectonic \
  && rm -rf /tmp/tectonic \
  # Prove it actually executes here, rather than as an exit 127 further down.
  && tectonic --version

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
