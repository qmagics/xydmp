import { defineComponent, h, ref } from "vue";

export default defineComponent({
    name: "YwIcon",
    props: {
        name: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        const tag = /^yw-icon/.test(props.name) ? 'i' : 'svg-icon';
        return () => h(tag, {
            class: ['yw-icon', props.name]
        })
    }
})
