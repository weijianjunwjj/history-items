<template>
  <div>
    <div class="right-panner"
      >当前模板：
      <a-button class="dis-ib" type="text" @click="handleSelect">{{
        moduleTitle
      }}</a-button>
    </div>

    <a-drawer
      v-model:visible="drawer"
      title="选择模板"
      placement="top"
      height="80%"
      :footer="false"
    >
      <div class="drawer-body">
        <a-card
          v-for="(item, name) in modules"
          :key="name"
          class="box-card"
          :body-style="{ padding: '0px' }"
        >
          <img :src="item.image" />
          <div style="padding: 10px" class="clearfix">
            <div class="card-name">{{ item.title }}</div>
            <a-checkbox
              :model-value="name === moduleName"
              label="选择"
              size="small"
              class="button"
              :disabled="name === moduleName"
              @change="handleChange(name)"
            />
          </div>
        </a-card>
      </div>
    </a-drawer>
  </div>
</template>

<script lang="ts">
  import { Modal } from '@arco-design/web-vue'

  const app = window.$app
  export default {
    name: 'SelectModule',
    props: {
      moduleName: {
        type: String,
        required: true,
      },
      modules: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        drawer: false,
      }
    },
    computed: {
      moduleTitle() {
        return this.modules[this.moduleName].title
      },
    },
    methods: {
      handleSelect() {
        this.drawer = true
      },
      handleChange(name) {
        Modal.confirm({
          title: '系统提示',
          content:
            '切换模板将重置“拨号页”中所有页面的样式为新模板样式。确定切换模板吗？',
          onOk: () => {
            console.log('this', this)
            this.$emit('change', name)
            this.drawer = false
          },
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .right-panner {
    position: absolute;
    right: 0;
    top: 10px;
    background-color: #fff;
    height: 50px;
    // width: 170px;
    border-radius: 2px;
    line-height: 50px;
    padding: 0 15px;
    font-size: 14px;
  }

  .box-card {
    width: 250px;
    display: inline-block;
    margin: 10px;
    position: relative;

    img {
      width: 100%;
      height: 440px;
      display: block;
    }

    .card-name {
      line-height: 30px;
      display: inline-block;
    }

    .button {
      float: right;
    }
  }
</style>
