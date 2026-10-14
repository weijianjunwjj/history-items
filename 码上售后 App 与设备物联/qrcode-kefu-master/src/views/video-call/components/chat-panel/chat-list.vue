<template>
  <div class="chat-list">
    <ChatItem v-for="item in renderList" :key="item.id" :chat="item" />
    <a-result v-if="!renderList.length" status="404" />
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue'
  import ChatItem from './chat-item.vue'

  defineProps({
    renderList: {
      type: Array as PropType<any[]>,
      default() {
        return []
      },
    },
  })
</script>

<style lang="less" scoped>
  .chat-list {
    overflow: auto;
  }
</style>
