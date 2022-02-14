<template>
    <div class="video-box" :style="style">
        <div class="video-box__title">{{ name }}</div>
        <div class="video-box__body">
            <video
                ref="playerRef"
                class="video-js"
                controls
                preload="auto"
                poster="https://vjs.zencdn.net/v/oceans.png"
                data-setup="{}"
            >
                <source :src="src" type="application/x-mpegURL" />
                <p class="vjs-no-js">
                    To view this video please enable JavaScript, and consider upgrading to a
                    web browser that
                    <a
                        href="https://videojs.com/html5-video-support/"
                        target="_blank"
                    >supports HTML5 video</a>
                </p>
            </video>
            <!-- <img :src="Math.random() > 0.5 ? v1_jpg : v2_jpg" /> -->
        </div>
    </div>
</template>

<script lang="ts">
import { computed, CSSProperties, defineComponent, onBeforeUnmount, onMounted, onUpdated, ref } from "vue";
// import v1_jpg from '@/assets/v1.jpg';
// import v2_jpg from '@/assets/v2.jpg';
import videojs, { VideoJsPlayer } from 'video.js';
import 'video.js/dist/video-js.min.css';

export default defineComponent({
    name: "VideoBox",
    props: {
        width: {},
        height: {},
        name: {},
        src: {
            type: String,
            required: true
        }
    },
    setup(props) {
        let player: VideoJsPlayer;
        const playerRef = ref();

        const style = computed(() => {
            return {
                width: props.width,
                height: props.height,
            } as CSSProperties
        });

        const init = () => {
            player = videojs(playerRef.value, {}, () => {
                play();
            });
        }

        const play = () => {
            if (player) {
                player.play();
            }
        }

        const pause = () => {
            if (player) {
                player.pause();
            }
        }

        const destroy = () => {
            // if (player) {
            // }
        }

        onMounted(() => {
            init();
        });

        onBeforeUnmount(() => {
            destroy();
        });

        return {
            style,
            play,
            pause,
            playerRef
            // v1_jpg,
            // v2_jpg
        }
    }
});
</script>

<style lang="scss">
$titleHeight: 0.24rem;
.video-box {
    // background: rgb(10, 26, 56);
    &__title {
        // border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        background: rgb(18, 32, 49);
        height: $titleHeight;
        line-height: $titleHeight;
        padding: 0 0.1rem;
        color: rgb(186, 189, 191);
        @include text-clamp(1);
    }

    &__body {
        height: calc(100% - #{$titleHeight});
        img {
            width: 100%;
            height: 100%;
            filter: opacity(0.7);
        }

        .video-js {
            width: 100%;
            height: 100%;
        }
    }
}
</style>