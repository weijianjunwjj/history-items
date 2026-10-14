<!--
 * @Author: weijianjun
 * @Date: 2022-12-15 17:55:25
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-02-28 14:08:17
 * @FilePath: \yadea-website\components\mobile\button\index.vue
 * @Description: 雅迪button
 * 
-->
<template>
  <template v-if="type === 'primary'">
    <a-button
      :id="id"
      type="primary"
      class="yadi-btn yadi-mbtn-primary"
      :class="[className, yadiSizeClass]"
      :shape="shape"
      @click="onClick"
    >
      <slot />
    </a-button>
  </template>
  <template v-else-if="type === 'ghost'">
    <a-button
      :id="id"
      type="defalut"
      class="yadi-mbtn yadi-mbtn-ghost"
      :class="[className, yadiSizeClass]"
      :shape="shape"
      plain
      ghost
      @click="onClick"
    >
      <slot />
    </a-button>
  </template>
  <template v-else-if="type === 'border'">
    <a-button
      :id="id"
      type="defalut"
      class="yadi-mbtn yadi-mbtn-border"
      :class="[className, yadiSizeClass]"
      :shape="shape"
      @click="onClick"
    >
      <slot />
    </a-button>
  </template>
  <template v-else-if="type === 'border2'">
    <a-button
      :id="id"
      type="defalut"
      class="yadi-mbtn yadi-mbtn-border2"
      :class="[className, yadiSizeClass]"
      :shape="shape"
      @click="onClick"
    >
      <slot />
    </a-button>
  </template>
  <template v-else-if="type === 'border3'">
    <a-button
      :id="id"
      type="defalut"
      class="yadi-mbtn yadi-mbtn-border3"
      :class="[className, yadiSizeClass]"
      :shape="shape"
      @click="onClick"
    >
      <slot />
    </a-button>
  </template>
  <template v-else-if="type === 'link'">
    <a-button
      :id="id"
      type="link"
      class="yadi-mbtn yadi-mbtn-link"
      :class="[className, yadiSizeClass]"
      :shape="shape"
      plain
      @click="onClick"
    >
      <slot />
    </a-button>
  </template>
  <template v-else>
    <a-button
      :id="id"
      type="defalut"
      class="yadi-mbtn yadi-mbtn-defalut"
      :class="[className, yadiSizeClass]"
      :shape="shape"
      plain
      @click="onClick"
    >
      <slot />
    </a-button>
  </template>
</template>

<script setup>
import { themeColor } from '@/configs/data'

const emit = defineEmits(['click'])

const props = defineProps({
  type: {
    type: String,
    default: 'defalut'
  },
  size: {
    type: String,
    default: 'small'
  },
  className: {
    type: String,
    default: 'yadi-mbtn'
  },
  id: {
    type: String,
    default: ''
  },
  href: {
    type: String,
    default: '#'
  },
  route: {
    type: String,
    default: ''
  },
  shape: {
    type: String,
    default: 'round'
  }
})

const yadiSizeClass = computed(() => {
  return props.size === 'big' ? 'yadi-mbtn-big' : 'yadi-mbtn-small'
})

function onClick() {
  const href = props.href
  const route = props.route
  console.log('href :>> ', href)
  console.log('route :>> ', route)
  const isHref = url => {
    return url.startsWith('http') || url.endsWith('.html')
  }
  if (href !== '#') {
    if (isHref(href)) {
      window.location.href = href
    } else {
      // 路由
      useRouter().push(href)
    }
    return
  }
  if (route) {
    if (isHref(route)) {
      window.location.href = route
    } else {
      // 路由
      useRouter().push(route)
    }
    return
  }
  emit('click')
}
</script>

<style lang="less" scoped>
.yadi-mbtn {
  padding: 0;
  text-shadow: none !important;
  &-small,
  &-big {
    height: 32mpxvw;
    box-sizing: border-box;
  }
  &-small {
    width: 112mpxvw;
  }
  &-big {
    width: 180mpxvw;
  }
  &-border {
    border-color: @orange;
    color: @orange;
  }
  &-border2 {
    border-color: #e9e9e9;
    color: @black;
  }
  &-border3 {
    border-color: rgba(0, 0, 0, 0.2);
    color: @black;
  }
  &-link {
    color: #0094ff;
  }
}

.yadi-mbtn-defalut {
  border-color: transparent !important;
  &:hover,
  &:active,
  &:focus {
    color: rgba(0, 0, 0, 0.85) !important;
    border-color: transparent !important;
  }

  &:after {
    display: none;
  }
}

.yadi-mbtn-ghost {
  &:hover {
    color: #fff !important;
    border-color: #fff !important;
    background: rgba(255, 255, 255, 0.4);
  }
  &:after {
    display: none;
  }
}

.yadi-mbtn-primary {
  &:active {
    background-color: #dd5402 !important;
  }
  &:after {
    display: none;
  }
}
</style>
