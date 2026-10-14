<template>
  <n-tree
    block-line
    cascade
    checkable
    :selectable="false"
    :data="treeData"
    :default-expanded-keys="defaultExpandedKeys"
    :default-checked-keys="defaultCheckedKeys"
    @update:checked-keys="updateCheckedKeys"
  />
</template>

<script setup>
import { repeat } from 'seemly'

const treeData = ref(createData())
const defaultExpandedKeys = ref([])
const defaultCheckedKeys = ref(['40302010'])
const updateCheckedKeys = (keys, options, meta) => {
  console.log('updateCheckedKeys', keys, options, meta)
}

console.log('defaultCheckedKeys :>> ', defaultCheckedKeys.value)
console.log('treeData :>> ', treeData.value)

function createData(level = 4, baseKey = '') {
  if (!level) return void 0
  return repeat(6 - level, void 0).map((_, index) => {
    const key = '' + baseKey + level + index
    return {
      label: createLabel(level),
      key,
      children: createData(level - 1, key),
    }
  })
}

function createLabel(level) {
  if (level === 4) return '道生一'
  if (level === 3) return '一生二'
  if (level === 2) return '二生三'
  if (level === 1) return '三生万物'
  return ''
}
</script>
