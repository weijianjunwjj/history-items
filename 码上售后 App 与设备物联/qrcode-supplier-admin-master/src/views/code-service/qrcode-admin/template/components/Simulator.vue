<template>
  <div class="simulator">
    <!--  信号栏  -->
    <editable-component setting-title="基础设置" :enabled="hasBaseSetting">
      <div class="signal-bar">
        <div>9:41</div>
        <div class="bar-right">
          <div class="iconfont icon-signal"></div>
          <div class="iconfont icon-wifi"></div>
          <div class="iconfont icon-battery"></div>
        </div>
      </div>

      <template #setting>
        <slot name="baseSetting" />
      </template>
    </editable-component>

    <div class="phone-head">
      <slot name="head"></slot>
    </div>
    <div class="phone-body">
      <slot name="body"></slot>
    </div>
    <div class="settings">
      <slot name="settings"></slot>
    </div>
  </div>
</template>

<script>
  import EditableComponent from './EditableComponent.vue'

  export default {
    name: 'Simulator',
    components: { EditableComponent },
    provide() {
      return {
        activeComponent: this.activeComponent,
      }
    },
    props: {
      hasBaseSetting: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        activeComponentData: {},
      }
    },
    methods: {
      activeComponent(data) {
        this.activeComponentData.active = false
        this.activeComponentData.showSetting = false
        this.activeComponentData.showAdd = false
        this.activeComponentData = data
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '../assets/iconfont/simulator.css';

  .simulator {
    width: 375px;
    -webkit-box-shadow: 0 25px 33px rgb(0 0 0 / 10%);
    box-shadow: 0 25px 33px rgb(0 0 0 / 10%);
    border-radius: 38px;
    background-color: #fff;
    //background-image: url('~@/assets/bgimg.png');
    background-size: cover;
    background-repeat: no-repeat;

    .signal-bar {
      padding: 12px 30px;
      display: flex;
      justify-content: space-between;

      div {
        height: 18px;
        line-height: 18px;
        font-size: 15px;
        color: #fff;
        display: inline-block;
        margin-left: 5px;
      }
    }

    .phone-body {
      position: relative;
      min-height: 667px;
      //margin-top: -70px;
      display: flex;
      //align-items: center;
      justify-content: center;
    }
  }
</style>
