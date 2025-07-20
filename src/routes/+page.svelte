<script lang="ts">
  import GameBoard from '$lib/components/GameBoard.svelte';
</script>

<svelte:head>
  <title>2048 游戏</title>
  <meta name="description" content="经典的2048数字拼图游戏，使用SvelteKit构建" />
</svelte:head>

<main>
  <GameBoard />
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
  }
</style>
