<template>
  <div class="login-container">
    <div class="login-header">
      <div class="login-logo">
        <img :src="logoBig" />
      </div>
      <div class="login-title">鑫亚数智综合运管平台</div>
      <div class="login-subtitle">厂区总览 · 项目管理 · 指挥调度</div>
    </div>
    <el-form class="login-form" :model="vm" :autocomplete="false">
      <div class="login-form-title">欢迎登录</div>

      <el-form-item field="Account">
        <el-input v-model="vm.Account" placeholder="请输入用户名">
          <!-- <template #prefix>
            <el-icon class="el-icon-user"></el-icon>
          </template>-->
        </el-input>
      </el-form-item>

      <el-form-item field="Password">
        <el-input type="password" v-model="vm.Password" placeholder="请输入密码">
          <!-- <template #prefix>
            <el-icon class="el-icon-lock"></el-icon>
          </template>-->
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          class="login-btn"
          type="primary"
          :loading="loading"
          loading-text="登录中..."
          @click="handleLogin"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { login } from "@/service/user";
import { useRouter, useRoute } from "vue-router";
import { defineComponent, reactive, ref, watch, watchEffect } from "vue";
import logoBig from '@/assets/logo_big.png';

export default defineComponent({
  name: "Login",

  setup() {
    const vm = reactive({
      Account: "",
      Password: "",
      Token: "",
    });

    const loading = ref(false);
    const router = useRouter();
    const route = useRoute();
    const redirect = ref("");
    const otherQuery = ref({});

    const handleLogin = async () => {
      loading.value = true;
      try {
        const { bl, msg } = await login(vm);
        if (bl) {
          router.push({
            path: redirect.value || "/",
            query: otherQuery.value,
          });
        } else {
          // ElMessage.error(msg);
        }
      } finally {
        loading.value = false;
      }
    };

    function getOtherQuery(query: any) {
      return Object.keys(query).reduce((acc: any, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    }

    watchEffect(() => {
      const query: any = route.query;
      if (query) {
        redirect.value = query.redirect;
        otherQuery.value = getOtherQuery(query);
      }
    });

    return {
      logoBig,
      vm,
      loading,
      handleLogin,
    };
  },
});
</script>

<style lang="scss">
.login-container {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  // background: rgb(45, 58, 75);
  background-image: url(../../../assets/login_bg.png);
  background-position: bottom;
  display: flex;
  justify-content: space-around;
  padding: 0 300px;
  align-items: center;
  overflow: hidden;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate3d(0, -40%, 0);
  .login-logo {
    margin-bottom: 20px;
    img {
      width: 160px;
    }
  }
  .login-title {
    font-weight: bold;
    font-size: 46px;
    letter-spacing: 7px;
    margin-bottom: 15px;
    position: relative;
    text-shadow: 0 0 4px rgb(0, 140, 255), 0 0 6px rgb(0, 140, 255);
    &:before,
    &:after {
      content: "";
      position: absolute;
      height: 2px;
      background: #fff;
      width: 30px;
      top: 50%;
      transform: translate3d(0, -50%, 0);
    }

    &:before {
      left: -50px;
    }
    &:after {
      right: -50px;
    }
  }
  .login-subtitle {
    font-size: 24px;
    letter-spacing: 2px;
  }
}

.login-form {
  transform: translate3d(0, 20%, 0);
  border: 1px solid rgba(166, 181, 201, 0.7);
  padding: 60px 45px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transform: translate3d(0, -15%, 0);
  .login-form-title {
    // color: rgba(255, 255, 255, 0.9);
    font-size: 24px;
    font-weight: lighter;
    letter-spacing: 2px;
    padding-bottom: 30px;
  }

  .el-form-item {
    margin-bottom: 15px;
    width: 300px;
  }

  .el-input__inner {
    background: rgb(39, 66, 97);
    border: none;
    color: rgb(135, 148, 156);
  }
  .el-input__inner,
  .login-btn {
    height: 44px;
    line-height: 44px;
  }

  .login-btn {
    width: 100%;
    background-image: linear-gradient(
      to right,
      rgb(32, 114, 204),
      rgb(83, 165, 235)
    );
    padding: 0;
    border: none;
    font-weight: bold;
    font-size: 17px;
    letter-spacing: 2px;

    &.is-loading {
      &:before {
        display: none;
      }
    }
  }
}

@media (max-width: 1630px) {
  .login-container {
    padding: 0;
    flex-direction: column;
  }
  .login-form {
    transform: translate3d(0, -50%, 0);
  }
  .login-header {
    .login-title {
      font-size: 40px;
    }
    .login-logo,
    .login-subtitle {
      display: none;
    }
  }
}
</style>