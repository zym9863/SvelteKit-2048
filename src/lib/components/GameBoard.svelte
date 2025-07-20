<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { Game2048, type Direction, type GameState } from '../game.js';
  import GameCell from './GameCell.svelte';

  let game: Game2048;
  let gameState: GameState;
  let gameContainer: HTMLDivElement;

  onMount(() => {
    game = new Game2048();
    gameState = game.getState();

    // 添加键盘事件监听
    if (browser) {
      document.addEventListener('keydown', handleKeyPress);
    }
  });

  onDestroy(() => {
    if (browser) {
      document.removeEventListener('keydown', handleKeyPress);
    }
  });

  function handleKeyPress(event: KeyboardEvent) {
    event.preventDefault();
    
    let direction: Direction | null = null;
    
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        direction = 'up';
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        direction = 'down';
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        direction = 'left';
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        direction = 'right';
        break;
    }

    if (direction && !gameState.gameOver) {
      const moved = game.move(direction);
      if (moved) {
        gameState = game.getState();
      }
    }
  }

  function resetGame() {
    game.reset();
    gameState = game.getState();
  }

  function getTileColor(value: number): string {
    const colors: { [key: number]: string } = {
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e'
    };
    return colors[value] || '#3c3a32';
  }

  function getTextColor(value: number): string {
    return value <= 4 ? '#776e65' : '#f9f6f2';
  }
</script>

<div class="game-container" bind:this={gameContainer}>
  <div class="game-header">
    <h1>2048</h1>
    <div class="score-container">
      <div class="score-box">
        <div class="score-label">分数</div>
        <div class="score-value">{gameState?.score || 0}</div>
      </div>
      <button class="new-game-btn" on:click={resetGame}>新游戏</button>
    </div>
  </div>

  <div class="game-instructions">
    <p>使用方向键或WASD键移动方块，相同数字的方块会合并！</p>
  </div>

  <div class="game-board">
    {#if gameState}
      {#each gameState.grid as row}
        {#each row as cell}
          <GameCell
            value={cell}
            backgroundColor={getTileColor(cell)}
            textColor={getTextColor(cell)}
          />
        {/each}
      {/each}
    {/if}
  </div>

  {#if gameState?.gameOver}
    <div class="game-over-overlay">
      <div class="game-over-message">
        <h2>{gameState.won ? '恭喜你赢了！' : '游戏结束'}</h2>
        <button on:click={resetGame}>再试一次</button>
      </div>
    </div>
  {/if}

  {#if gameState?.won && !gameState.gameOver}
    <div class="win-overlay">
      <div class="win-message">
        <h2>恭喜！你达到了2048！</h2>
        <div class="win-buttons">
          <button on:click={resetGame}>新游戏</button>
          <button on:click={() => gameState = {...gameState, won: false}}>继续游戏</button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .game-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Arial', sans-serif;
    text-align: center;
  }

  .game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  h1 {
    font-size: 48px;
    font-weight: bold;
    color: #776e65;
    margin: 0;
  }

  .score-container {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .score-box {
    background: #bbada0;
    padding: 10px 20px;
    border-radius: 6px;
    color: white;
    min-width: 80px;
  }

  .score-label {
    font-size: 12px;
    text-transform: uppercase;
    margin-bottom: 5px;
  }

  .score-value {
    font-size: 24px;
    font-weight: bold;
  }

  .new-game-btn {
    background: #8f7a66;
    color: #f9f6f2;
    border: none;
    border-radius: 6px;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .new-game-btn:hover {
    background: #9f8a76;
  }

  .game-instructions {
    margin-bottom: 20px;
    color: #776e65;
    font-size: 14px;
  }

  .game-board {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 10px;
    background: #bbada0;
    border-radius: 10px;
    padding: 10px;
    position: relative;
    width: 400px;
    height: 400px;
    margin: 0 auto;
  }

  .game-over-overlay,
  .win-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
  }

  .game-over-message,
  .win-message {
    text-align: center;
    color: #776e65;
  }

  .game-over-message h2,
  .win-message h2 {
    font-size: 32px;
    margin-bottom: 20px;
  }

  .game-over-message button,
  .win-message button {
    background: #8f7a66;
    color: #f9f6f2;
    border: none;
    border-radius: 6px;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    margin: 5px;
  }

  .win-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  @media (max-width: 600px) {
    .game-container {
      padding: 10px;
    }
    
    .game-board {
      width: 300px;
      height: 300px;
    }
    
    h1 {
      font-size: 36px;
    }
    
    .game-header {
      flex-direction: column;
      gap: 15px;
    }
  }
</style>
