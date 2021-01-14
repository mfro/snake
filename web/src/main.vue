<template>
  <v-app align-center>
    <v-flex column>
      <v-flex justify-center class="score my-3">
        <v-text title style="font-size: 24px">{{ score }}</v-text>
      </v-flex>

      <canvas ref="canvas" />
    </v-flex>
  </v-app>
</template>

<script>
import { onMounted, shallowRef } from 'vue';

import { snake } from './snake';

export default {
  name: 'snake',

  setup() {
    let score = shallowRef(0);
    let canvas = shallowRef();

    onMounted(() => {
      snake(canvas.value, score);
    });

    return { canvas, score };
  },
};
</script>

<style lang="scss">
#app {
  width: 100vw;
  height: 100vh;
}
</style>

<style lang="scss" scoped>
.score {
  background-color: white;
}

canvas {
  background-color: white;
}
</style>
