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
    border-radius: 6px;
    font-weight: bold;
    transition: all 0.15s ease-in-out;
    position: relative;
    min-height: 80px;
    min-width: 80px;
  }

  .game-cell.empty {
    background-color: #cdc1b4;
  }

  .game-cell.new {
    animation: appear 0.2s ease-in-out;
  }

  .cell-value {
    display: block;
    line-height: 1;
  }

  @keyframes appear {
    0% {
      opacity: 0;
      transform: scale(0);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (max-width: 600px) {
    .game-cell {
      min-height: 60px;
      min-width: 60px;
    }
  }
</style>
