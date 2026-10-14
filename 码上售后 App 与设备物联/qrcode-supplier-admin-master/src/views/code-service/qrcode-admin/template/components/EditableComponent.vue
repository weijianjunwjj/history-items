<template>
  <div class="editable-component">
    <slot :class="{ active: active }" />

    <div v-if="enabled" class="component-opts" :class="{ active: active }">
      <template>
        <b class="top-line"> </b>
        <b class="bottom-line"> </b>
      </template>
      <div class="fill-space" @click="act"></div>
    </div>

    <div
      v-if="showSetting"
      class="component-settings"
      :class="{ bottom: settingBottom, center: settingCenter }"
      :style="{ left: settingLeft, top: settingTop }"
    >
      <div class="setting-title"
        ><span>{{ settingTitle }}</span></div
      >
      <div class="setting-container" :class="settingClass">
        <slot name="setting" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'EditableComponent',
    inject: ['activeComponent'],
    props: {
      enabled: {
        type: Boolean,
        default: true,
      },
      settingClass: {
        type: String,
        default: '',
      },
      settingTitle: {
        type: String,
        default: '设置参数',
      },
      settingTop: {
        type: String,
        default: 'auto',
      },
      settingBottom: {
        type: Boolean,
        default: false,
      },
      settingCenter: {
        type: Boolean,
        default: false,
      },
      settingLeft: {
        type: String,
        default: '390px',
      },
    },
    data() {
      return {
        active: false,
        showSetting: false,
      }
    },
    methods: {
      act() {
        if (!this.active) {
          this.activeComponent(this.$data)
          this.active = true
          this.showSetting = true
        }
      },
    },
  }
</script>

<style lang="less">
  .editable-component {
    position: relative;

    .component-opts {
      position: absolute;
      z-index: 20;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 1px dashed transparent;
      cursor: pointer;

      &.active {
        border-color: #38f;
      }

      &:hover {
        z-index: 21;
        border-color: #38f;

        .add,
        .remove,
        .top-line,
        .bottom-line {
          display: block;
        }
      }

      .fill-space {
        width: 100%;
        height: 100%;
      }

      .top-line,
      .bottom-line {
        display: none;
        position: absolute;
        z-index: 2;
        left: 0;
        right: 0;
        top: -1px;
        height: 1px;
        background: #59f;
      }

      .bottom-line {
        top: auto;
        bottom: -1px;
      }
    }

    .component-settings {
      position: absolute;
      left: 390px;
      top: -98px;
      width: 550px;
      margin-bottom: 70px;
      background: #fff;
      border-radius: 4px;
      font-size: 13px;
      -webkit-box-shadow: 0 2px 4px rgb(0 0 0 / 7%);
      box-shadow: 0 2px 4px rgb(0 0 0 / 7%);
      color: #2a2a2a;
      line-height: 28px;

      &.bottom {
        bottom: 0;
        top: auto;
        margin-bottom: 0;

        &:before,
        &:after {
          margin-bottom: -2px;
          top: auto;
          bottom: 20px;
        }
      }

      &.center {
        transform: translateY(-25%);

        &:before,
        &:after {
          top: auto;
          bottom: 50%;
        }
      }

      &:before,
      &:after {
        position: absolute;
        right: 100%;
        top: 10px;
        width: 0;
        height: 0;
        content: '';
        border: solid transparent;
      }

      &:before {
        border-width: 9px;
        border-color: transparent;
        border-right-color: rgba(0, 0, 0, 0.04);
        margin-top: -1px;
      }

      &:after {
        border-width: 7px;
        border-color: transparent;
        border-right-color: #fff;
      }

      > .setting-title {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        height: 40px;
        padding: 0 15px;
        line-height: 40px;
        border-bottom: 1px solid #efefef;
        font-size: 14px;
        font-weight: 700;
      }

      .setting-container {
        padding: 0 15px;
        max-height: 63vh;
        // overflow: auto;
        & > div {
          padding: 15px 0;
          border-bottom: 1px solid #efefef;
        }

        .title-line {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-pack: justify;
          -ms-flex-pack: justify;
          justify-content: space-between;
          margin-bottom: 15px;

          .help {
            font-size: 12px;
            color: #999;
          }
        }

        .flex-line {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
        }

        .el-color-picker {
          margin-right: 30px;
        }

        label {
          color: #606266;
        }
        @input-h: 26px;
        input {
          height: @input-h;
          line-height: @input-h;
          -webkit-appearance: none;
          border-radius: 4px;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          color: #606266;
        }
        .arco-select-view-single.arco-select-view-size-medium
          .arco-select-view-value {
          min-height: @input-h;
          padding-top: 2px;
          padding-bottom: 2px;
        }

        .input-text {
          height: 28px;
          line-height: 28px;
          padding: 0 10px;
          -webkit-appearance: none;
          background-color: #fff;
          background-image: none;
          border-radius: 4px;
          border: 1px solid #dcdfe6;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          color: #606266;
          display: inline-block;
          font-size: inherit;
          outline: 0;
          -webkit-transition: border-color 0.2s
            cubic-bezier(0.645, 0.045, 0.355, 1);
          transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
          margin-right: 10px;
        }
      }
    }
  }
</style>
