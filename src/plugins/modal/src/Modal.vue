<template>
  <div class="fx-modals">
    <div v-for="modal in modal_list" :key="modal.id" v-drag v-initSize="modal">
      <el-dialog
        :custom-class="getCustomClass(modal)"
        :model-value="modal.visible"
        :title="modal.title"
        :modal="modal.mask"
        :append-to-body="modal.appendToBody"
        :lock-scroll="modal.lockScroll"
        :fullscreen="modal.fullscreen"
        :destroy-on-close="modal.destroyOnClose"
        :close-on-click-modal="modal.closeOnClickMask"
        :before-close="getBeforeClose(modal)"
        :show-close="false"
        @close="onClose(modal)"
        @closed="onClosed(modal)"
      >
        <template #title>
          <div class="el-dialog__title">
            <span class="title-inner" :title="modal.title">{{ modal.title }}</span>
          </div>
        </template>

        <div class="fx-modal__body" :style="getBodyStyle(modal)">
          <component
            :ref="'modalComponent_' + modal.id"
            :is="modal.component"
            v-bind="modal.data"
            v-on="modal.actions"
          ></component>
        </div>

        <template #footer>
          <div class="fx-modal__footer" v-if="modal.btns && modal.btns.length">
            <el-button
              v-for="(btn, index) in modal.btns"
              :key="index"
              :size="btn.size"
              :loading="btn.loading"
              :disabled="btn.disabled"
              :type="btn.type"
              :icon="btn.icon"
              @click="onModalBtnClick(btn, modal)"
            >{{ btn.name }}</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from "vuex";
import { defineComponent } from "vue";
import "./style.scss";

export default defineComponent({
  data() {
    return {};
  },

  computed: {
    ...mapState({
      modal_list: (state: any) => state.modal.modal_list,
    }),
  },

  methods: {
    /**
     * 获取弹窗内实例组件上下文对象
     */
    getModalComponentContext(modal: any): any {
      return this.$refs[`modalComponent_${modal.id}`][0];
    },

    getCustomClass(modal) {
      const cls_arr = ["fx-modal", "theme--dark"];
      const {
        // placement,
        classes,
        padding,
        btns,
        bg,
      } = modal;

      if (btns && btns.length) {
        cls_arr.push("is--has-footer");
      }

      // if (placement) {
      //   cls_arr.push(`placement--${placement}`);
      // }

      if (classes) {
        alert(classes)
        cls_arr.push(classes);
      }

      if (padding !== true) {
        cls_arr.push("is--no-padding");
      }

      if (bg) {
        cls_arr.push("is--has-bg");
      }

      return cls_arr.join(" ");
    },

    getBodyStyle(modal) {
      if (typeof modal.padding === "string") {
        return {
          padding: modal.padding,
        };
      }
    },

    onClose(modal) {
      // if (!modal.beforeClose) {
      //   this.$store.dispatch("modal/close", modal.id);
      // } else {
      //   const ctx = this.getModalComponentContext(modal);

      //   modal.beforeClose(() => {
      //     this.$store.dispatch("modal/close", modal.id);
      //   }, ctx);
      // }

      this.$store.dispatch("modal/close", modal.id);
    },

    onClosed(modal) {
      this.$store.dispatch("modal/remove", modal.id);
    },

    getBeforeClose(modal) {
      const _this = this;
      return function (done) {
        if (!modal.beforeClose) {
          done();
        } else {
          modal.beforeClose(done, _this.getModalComponentContext(modal));
        }
      };
    },

    //弹窗按钮点击
    onModalBtnClick(btn, modal) {
      const { method, callback } = btn;

      // 按钮回调函数上下文参数
      const cbContext = { btn };

      // 未指定 method
      if (!method) {
        //
        if (!callback) {
          if (!modal.beforeClose) {
            this.onClose(modal);
          } else {
            const ctx = this.getModalComponentContext(modal);

            modal.beforeClose(() => {
              this.onClose(modal);
            }, ctx);
          }
        } else {
          callback && callback.call(null, cbContext);
        }
        return;
      }
      // 指定了 method
      else {
        //弹窗内实例组件上下文对象
        const ctx = this.getModalComponentContext(modal);

        if (ctx && ctx[method] && "function" === typeof ctx[method]) {
          const bl = ctx[method].call(null, (...args) => {
            callback.apply(null, [...args, cbContext]);
          });
          if (bl) {
            this.onClose(modal);
          }
        }
      }
    },
  },
});
</script>
