<script setup>
import ProviderOrbit from './components/ProviderOrbit.vue'

const providers = [
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    icon: 'copilot',
    qualities: ['powerful', 'proactive', 'flexible'],
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: 'sparkle',
    qualities: ['thoughtful', 'subtle', 'eloquent'],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    icon: 'sparkle-filled',
    qualities: ['multimodal', 'inventive', 'global'],
  },
  {
    id: 'azure-ai',
    name: 'Azure AI',
    icon: 'azure',
    qualities: ['secure', 'scalable', 'responsible'],
  },
]
</script>

<template>
  <main class="provider-demo">
    <section class="provider-content" aria-labelledby="provider-heading">
      <header class="provider-intro">
        <p class="eyebrow">Provider profiles</p>
        <h1 id="provider-heading">A little context, in orbit.</h1>
        <p class="lede">
          Hover over a provider to reveal the qualities that make it distinct.
          The details stay close, then quietly move with you.
        </p>
      </header>

      <ul class="provider-grid" aria-label="AI provider profiles">
        <li v-for="provider in providers" :key="provider.id">
          <ProviderOrbit :provider="provider" />
        </li>
      </ul>

      <p class="interaction-hint">
        <span class="hint-line" aria-hidden="true" />
        Hover or focus to reveal
        <span aria-hidden="true">/</span>
        Click to keep in view
      </p>
    </section>
  </main>
</template>

<style scoped>
.provider-demo {
  position: relative;
  display: grid;
  min-height: 100vh;
  place-items: center;
  overflow: hidden;
  isolation: isolate;
  padding: 64px 24px;
  background:
    radial-gradient(circle at 50% 42%, rgba(255, 255, 255, 0.035), transparent 38%),
    linear-gradient(180deg, #0f1014 0%, var(--page-background) 100%);
}

.provider-demo::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  background-image:
    linear-gradient(var(--page-border) 1px, transparent 1px),
    linear-gradient(90deg, var(--page-border) 1px, transparent 1px);
  background-size: 72px 72px;
  content: "";
  mask-image: radial-gradient(circle at center, black 0%, transparent 70%);
  opacity: 0.12;
  pointer-events: none;
}

.provider-content {
  width: min(100%, 960px);
}

.provider-intro {
  width: min(100%, 610px);
  margin: 0 auto 44px;
  text-align: center;
}

.eyebrow {
  margin: 0 0 12px;
  color: var(--page-muted);
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: var(--page-foreground);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(36px, 6vw, 62px);
  font-weight: 400;
  letter-spacing: -0.045em;
  line-height: 0.98;
}

.lede {
  width: min(100%, 520px);
  margin: 20px auto 0;
  color: var(--page-muted);
  font-size: 14px;
  line-height: 1.65;
}

.provider-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(184px, 1fr));
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.provider-grid > li {
  min-width: 0;
}

.interaction-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 36px 0 0;
  color: var(--page-faint);
  font-size: 11px;
  letter-spacing: 0.02em;
}

.hint-line {
  width: 24px;
  height: 1px;
  background: currentColor;
}

@media (max-width: 520px) {
  .provider-demo {
    place-items: start center;
    padding: 48px 20px;
  }

  .provider-intro {
    margin-bottom: 28px;
  }

  .provider-grid {
    grid-template-columns: 1fr;
  }

  .interaction-hint {
    flex-wrap: wrap;
    max-width: 220px;
    margin-inline: auto;
    line-height: 1.5;
  }
}

@media (forced-colors: active) {
  .provider-demo {
    background: Canvas;
  }

  .provider-demo::before {
    display: none;
  }
}
</style>
