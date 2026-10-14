<template>
  <div>
    <group-list
      v-if="pageType === 'list'"
      @go-detail="handleGodetail"
    ></group-list>
    <group-detail
      v-if="pageType === 'detail'"
      :group-info="groupInfo"
      :page-type="pageType"
      @go-list="handleGoList"
    ></group-detail>
  </div>
</template>

<script lang="ts" setup>
  import groupList from './group-list/index.vue'
  import groupDetail from './group-detail/index.vue'

  const pageType = ref('list')
  const groupInfo = ref('')

  const handleGodetail = (val) => {
    pageType.value = 'detail'
    groupInfo.value = val.groupInfo
  }

  const handleGoList = () => {
    pageType.value = 'list'
    groupInfo.value = ''
  }
</script>
