<!--
 * @Author: weijianjun
 * @Date: 2022-12-15 17:55:25
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-09 09:23:51
 * @FilePath: \website\components\my\button\index.vue
 * @Description: 雅迪button
 * 
-->
<template>
  <template v-if="type === 'primary'">
    <client-only>
      <a-button
        type="primary"
        class="yadi-btn yadi-btn-primary"
        :class="[className, yadiSizeClass]"
        :style="style"
        :shape="shape"
        @click="onClick"
      >
        <slot />
      </a-button>
    </client-only>
  </template>
  <template v-else-if="type === 'ghost'">
    <client-only>
      <a-button
        type="defalut"
        class="yadi-btn yadi-btn-ghost"
        :class="[className, yadiSizeClass]"
        :style="style"
        :shape="shape"
        plain
        ghost
        @click="onClick"
      >
        <slot />
      </a-button>
    </client-only>
  </template>
  <template v-else-if="type === 'ghost2'">
    <client-only>
      <a-button
        type="defalut"
        class="yadi-btn yadi-btn-ghost2"
        :class="[className, yadiSizeClass]"
        :style="style"
        :shape="shape"
        plain
        ghost
        @click="onClick"
      >
        <slot />
      </a-button>
    </client-only>
  </template>
  <template v-else-if="type === 'link'">
    <client-only>
      <a-button
        type="link"
        class="yadi-btn yadi-btn-link"
        :class="[className, yadiSizeClass]"
        :style="style"
        :shape="shape"
        plain
        @click="onClick"
      >
        <slot />
      </a-button>
    </client-only>
  </template>
  <template v-else-if="type === 'link2'">
    <client-only>
      <a-button
        type="link"
        class="yadi-btn yadi-btn-link2"
        :class="[className, yadiSizeClass]"
        :style="style"
        :shape="shape"
        plain
        @click="onClick"
      >
        <slot />
      </a-button>
    </client-only>
  </template>
  <template v-else-if="type === 'border'">
    <client-only>
      <a-button
        type="defalut"
        class="yadi-btn yadi-btn-border"
        :class="[className, yadiSizeClass]"
        :style="style"
        :shape="shape"
        @click="onClick"
      >
        <slot />
      </a-button>
    </client-only>
  </template>
  <template v-else-if="type === 'border2'">
    <a-button
      type="defalut"
      class="yadi-btn yadi-btn-border2"
      :class="[className, yadiSizeClass]"
      :style="style"
      :shape="shape"
      @click="onClick"
    >
      <slot />
    </a-button>
  </template>
  <template v-else-if="type === 'border3'">
    <a-button
      type="defalut"
      class="yadi-btn yadi-btn-border3"
      :class="[className, yadiSizeClass]"
      :style="style"
      :shape="shape"
      @click="onClick"
    >
      <slot />
    </a-button>
  </template>
  <template v-else>
    <client-only>
      <a-button
        type="defalut"
        class="yadi-btn yadi-btn-defalut"
        :class="[className, yadiSizeClass]"
        :style="style"
        :shape="shape"
        plain
        @click="onClick"
      >
        <slot />
      </a-button>
    </client-only>
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
    default: 'yadi-btn'
  },
  href: {
    type: String,
    default: '#'
  },
  openWindow: {
    type: Boolean,
    default: false
  },
  route: {
    type: String,
    default: ''
  },
  shape: {
    type: String,
    default: 'round'
  },
  style: {
    type: String,
    default: ''
  },
  border: {
    type: Object,
    default: () => {
      return {
        color: themeColor,
        width: '1px'
      }
    }
  },
  color: {
    type: String,
    default: themeColor
  }
})

const borderColor = computed(() => {
  return props.border.color
})
const borderWidth = computed(() => {
  return props.border.width
})
const color = computed(() => {
  return props.color
})

const yadiSizeClass = computed(() => {
  return props.size === 'big' ? 'yadi-btn-big' : 'yadi-btn-small'
})

function onClick() {
  const href = props.href
  const route = props.route

  const isHref = url => {
    return url.startsWith('http') || url.endsWith('.html')
  }

  if (href !== '#') {
    if (isHref(href)) {
      // 外链
      if (props.openWindow) {
        window.open(href)
      } else {
        window.location.href = href
      }
    } else {
      // 路由
      useRouter().push(href)
    }

    return
  }
  if (route) {
    if (isHref(route)) {
      // 外链
      if (props.openWindow) {
        window.open(route)
      } else {
        window.location.href = route
      }
    } else {
      // 路由
      useRouter().push(route)
    }
    return
  }
  emit('click')
}
</script>

<style lang="less">
.yadi-btn {
  padding: 0;
  text-shadow: none !important;
  font-size: 16pxvw;

  // @media screen and (max-width: 1200px) {
  //   font-size: 14px;
  // }
  // @media screen and (min-width: 2000px) {
  //   font-size: 18px;
  // }

  // @media screen and (max-width: 1440px) {
  //   font-size: 12px !important;
  // }

  &-small,
  &-big {
    // max-width: 180px;
    // max-height: 46px;
    height: 46pxvw !important;
    box-sizing: border-box;
  }

  &-small {
    width: 145pxvw;
  }

  &-big {
    width: 180pxvw;
  }

  &-border {
    border-color: v-bind(borderColor) !important;
    border-width: v-bind(borderWidth) !important;
    color: v-bind(color) !important;
  }

  &-border2 {
    border-color: #e9e9e9;
    color: @black;
  }

  &-border3 {
    border-color: rgba(0, 0, 0, 0.2);
    color: @black;
  }
}

.yadi-btn-defalut {
  border-color: transparent !important;

  &:hover,
  &:active,
  &:focus {
    color: rgba(0, 0, 0, 0.85) !important;
    border-color: transparent !important;
  }

  &:hover {
    background: #f7f7f7 !important;
  }

  &:after {
    display: none;
  }
}

.yadi-btn-ghost {
  &:hover {
    color: #fff !important;
    border-color: #fff !important;
    background: rgba(255, 255, 255, 0.4) !important;
  }

  &:after {
    display: none;
  }
}
.yadi-btn-ghost2 {
  &:hover {
    color: #fff !important;
    border-color: @orange !important;
    background: @orange !important;
  }

  &:after {
    display: none;
  }
}

.yadi-btn-link {
  color: #666666;
}
.yadi-btn-link2 {
  color: #0094ff;
}

.yadi-btn-primary {
  &:active {
    background-color: #dd5402 !important;
  }

  &:after {
    display: none;
  }
}
</style>
