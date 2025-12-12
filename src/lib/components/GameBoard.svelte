<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { Game2048, type Direction, type GameState } from '../game.js';
  import GameCell from './GameCell.svelte';

  let game: Game2048;
  let gameState: GameState;
  let gameContainer: HTMLDivElement;
  let highScore: number = 0;
  
  // 触摸控制变量
  let touchStartX = 0;
  let touchStartY = 0;

  onMount(() => {
    game = new Game2048();
    gameState = game.getState();
    
    // 从 localStorage 获取最高分
    if (browser) {
      const savedHighScore = localStorage.getItem('2048-highscore');
      if (savedHighScore) {
        highScore = parseInt(savedHighScore);
      }
    }

    // 添加键盘事件监听
    if (browser) {
      document.addEventListener('keydown', handleKeyPress);
    }

    // 添加触摸事件监听
    if (gameContainer) {
      gameContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
      gameContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
      gameContainer.addEventListener('touchend', handleTouchEnd, { passive: false });
    }
  });

  onDestroy(() => {
    if (browser) {
      document.removeEventListener('keydown', handleKeyPress);
    }

    // 移除触摸事件监听
    if (gameContainer) {
      gameContainer.removeEventListener('touchstart', handleTouchStart);
      gameContainer.removeEventListener('touchmove', handleTouchMove);
      gameContainer.removeEventListener('touchend', handleTouchEnd);
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
        updateHighScore();
      }
    }
  }

  function handleTouchStart(event: TouchEvent) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  }

  function handleTouchMove(event: TouchEvent) {
    // 阻止默认滚动行为
    event.preventDefault();
  }

  function handleTouchEnd(event: TouchEvent) {
    if (!touchStartX || !touchStartY) {
      return;
    }

    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    const threshold = 30; // 滑动阈值

    if (Math.max(absDeltaX, absDeltaY) > threshold) {
      let direction: Direction | null = null;

      if (absDeltaX > absDeltaY) {
        // 水平滑动
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        // 垂直滑动
        direction = deltaY > 0 ? 'down' : 'up';
      }

      if (direction && !gameState.gameOver) {
        const moved = game.move(direction);
        if (moved) {
          gameState = game.getState();
          updateHighScore();
        }
      }
    }
    
    // 重置触摸起始点
    touchStartX = 0;
    touchStartY = 0;
  }

  function resetGame() {
    game.reset();
    gameState = game.getState();
  }

  function updateHighScore() {
    if (gameState.score > highScore) {
      highScore = gameState.score;
      if (browser) {
        localStorage.setItem('2048-highscore', highScore.toString());
      }
    }
  }

  function getTileColor(value: number): string {
    const colors: { [key: number]: string } = {
      2: '#ff6b6b',
      4: '#ff8787',
      8: '#ffa07a',
      16: '#ffd93d',
      32: '#6bcf7f',
      64: '#4ecdc4',
      128: '#45b7d1',
      256: '#5c7cfa',
      512: '#748ffc',
      1024: '#91a7ff',
      2048: '#ffd43b'
    };
    return colors[value] || '#495057';
  }

  function getTextColor(value: number): string {
    // 更好的文字对比度
    const darkTextValues = [2, 4, 8, 16, 32, 1024];
    return darkTextValues.includes(value) ? '#2d3436' : '#ffffff';
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
      <div class="score-box high-score">
        <div class="score-label">最高分</div>
        <div class="score-value">{highScore}</div>
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
    max-width: 540px;
    margin: 0 auto;
    padding: 30px;
    font-family: 'Poppins', sans-serif;
    text-align: center;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding: 0 10px;
  }

  h1 {
    font-size: 64px;
    font-weight: 800;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    letter-spacing: -2px;
  }

  .score-container {
    display: flex;
    gap: 15px;
    align-items: center;
  }

  .score-box {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 12px 24px;
    border-radius: 12px;
    color: white;
    min-width: 100px;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    transition: transform 0.3s ease;
  }

  .score-box:hover {
    transform: translateY(-2px);
  }

  .score-box.high-score {
    background: linear-gradient(135deg, #ffd93d 0%, #ff6b6b 100%);
    box-shadow: 0 4px 15px rgba(255, 193, 61, 0.3);
  }

  .score-label {
    font-size: 12px;
    text-transform: uppercase;
    margin-bottom: 5px;
    opacity: 0.9;
    letter-spacing: 1px;
  }

  .score-value {
    font-size: 28px;
    font-weight: 700;
    animation: scoreUpdate 0.3s ease;
  }

  @keyframes scoreUpdate {
    0% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  .new-game-btn {
    background: linear-gradient(135deg, #fa5252 0%, #e64980 100%);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(250, 82, 82, 0.3);
  }

  .new-game-btn:hover {
    background: linear-gradient(135deg, #e64980 0%, #fa5252 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(250, 82, 82, 0.4);
  }

  .game-instructions {
    margin-bottom: 25px;
    color: #6c757d;
    font-size: 15px;
    font-weight: 500;
    opacity: 0.8;
  }

  .game-board {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 12px;
    background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
    border-radius: 16px;
    padding: 12px;
    position: relative;
    width: 420px;
    height: 420px;
    margin: 0 auto;
    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .game-over-overlay,
  .win-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    animation: overlayFade 0.3s ease-out;
  }

  @keyframes overlayFade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .game-over-message,
  .win-message {
    text-align: center;
    color: #495057;
    animation: messageSlide 0.5s ease-out;
  }

  @keyframes messageSlide {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  .game-over-message h2,
  .win-message h2 {
    font-size: 36px;
    margin-bottom: 20px;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .game-over-message button,
  .win-message button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 12px 28px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin: 5px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }

  .game-over-message button:hover,
  .win-message button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  .win-buttons {
    display: flex;
    gap: 15px;
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
