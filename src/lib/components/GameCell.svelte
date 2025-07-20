<script lang="ts">
  export let value: number;
  export let backgroundColor: string;
  export let textColor: string;

  $: fontSize = getFontSize(value);
  $: isNew = false; // 可以用于添加新方块的动画效果

  function getFontSize(val: number): string {
    if (val < 100) return '32px';
    if (val < 1000) return '28px';
    if (val < 10000) return '24px';
    return '20px';
  }
</script>

<div 
  class="game-cell" 
  class:empty={value === 0}
  class:new={isNew}
  style="background-color: {value === 0 ? '#cdc1b4' : backgroundColor}; color: {textColor}; font-size: {fontSize};"
>
  {#if value > 0}
    <span class="cell-value">{value}</span>
  {/if}
</div>

<style>
  .game-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    font-weight: 700;
    transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
    position: relative;
    min-height: 90px;
    min-width: 90px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transform: scale(1);
  }

  .game-cell:not(.empty) {
    animation: pop 0.3s ease-out;
  }

  .game-cell.empty {
    background-color: rgba(255, 255, 255, 0.5);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .game-cell.new {
    animation: appear 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .cell-value {
    display: block;
    line-height: 1;
    font-family: 'Poppins', sans-serif;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 1;
  }

  @keyframes appear {
    0% {
      opacity: 0;
      transform: scale(0) rotate(-180deg);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }
  }

  @keyframes pop {
    0% {
      transform: scale(0.9);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  /* Glow effect for high-value tiles */
  .game-cell:not(.empty) {
    position: relative;
    overflow: hidden;
  }

  .game-cell:not(.empty)::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .game-cell:not(.empty):hover::before {
    opacity: 1;
  }

  /* Pulse animation for 2048 tile */
  .game-cell[style*="2048"] {
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    50% {
      transform: scale(1.02);
      box-shadow: 0 4px 20px rgba(255, 215, 0, 0.4);
    }
  }

  @media (max-width: 600px) {
    .game-cell {
      min-height: 65px;
      min-width: 65px;
      border-radius: 8px;
    }
  }
</style>
