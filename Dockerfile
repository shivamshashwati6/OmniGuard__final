# ══════════════════════════════════════════════════════
#  OmniGuard API — Hugging Face Space Dockerfile
# ══════════════════════════════════════════════════════

FROM node:22-alpine

WORKDIR /app

# 1. Copy backend dependencies and install
# Note: We are building from the root, so paths must be relative to root
COPY OmniGuard__backend/server/package.json OmniGuard__backend/server/package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# 2. Copy the actual backend source code
COPY OmniGuard__backend/server/ .

# 3. Security & Environment setup
RUN mkdir -p logs && chmod 777 logs

# Hugging Face Spaces require port 7860
ENV PORT=7860
ENV NODE_ENV=production

EXPOSE 7860

# Health check (standard for HF)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:7860/api/health || exit 1

CMD ["node", "server.js"]
