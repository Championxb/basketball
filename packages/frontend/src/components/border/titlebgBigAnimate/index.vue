<template>
  <canvas ref="animationCanvas" class="animation_canvas" id="animation_canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

// Props
const props = defineProps({
  fileLength: {
    type: Number,
    default: 74
  },
  IntervalTime: {
    type: Number,
    default: 50
  },
  startAnimation: {
    type: Boolean,
    default: true
  }
});

const animationCanvas = ref(null);
const imagesLoaded = ref(false);

const loadImages2 = async (sources) => {
  for (let i = 1; i <= props.fileLength; i++) {
    const image = await import(`./bg/${i}.png`);
    sources.push(image.default);
  }
};

const loadImages = (sources, callback) => {
  let loadedImages = 0;
  const numImages = sources.length;
  const images = [];

  for (let i = 0; i < numImages; i++) {
    images[i] = new Image();
    images[i].onload = () => {
      if (++loadedImages >= numImages) {
        callback(images);
      }
    };
    images[i].src = sources[i];
  }
};

const playImages = (images, ctx, width, height, intervalTime) => {
  let imageNow = 0;
  const timer = setInterval(() => {
    if (!props.startAnimation) {
      // Animation not started, pause drawing
      return;
    }
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(images[imageNow], 0, 0, width, height);
    imageNow = (imageNow + 1) % images.length;
  }, intervalTime);

  // Clean up interval when component unmounts
  return () => clearInterval(timer);
};

onMounted(async () => {
  await nextTick();
  const canvas = animationCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Failed to get canvas context');
    return;
  }

  const sources = [];

  // Load first image and display it
  const firstImage = await import(`./bg/0.png`);
  sources.push(firstImage.default);

  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;
  canvas.width = width;
  canvas.height = height;

  const firstImgElement = new Image();
  firstImgElement.src = sources[0];
  firstImgElement.onload = () => {
    ctx.drawImage(firstImgElement, 0, 0, width, height);
  };

  // Load remaining images
  await loadImages2(sources);

  // Preload all images
  loadImages(sources, (images) => {
    imagesLoaded.value = true;
    // Start playing animation if startAnimation is true
    if (props.startAnimation) {
      playImages(images, ctx, width, height, props.IntervalTime);
    }
  });
});
</script>

<style scoped>
.animation_canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>