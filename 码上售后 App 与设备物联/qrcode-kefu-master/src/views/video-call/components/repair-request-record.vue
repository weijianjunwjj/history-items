<template>
  <a-card class="general-card" title="通话备注">
    <a-form ref="form" :model="params" class="login-form" layout="horizontal">
      <!-- <a-form-item field="enterpriseName" label="情况描述"> -->
      <a-textarea
        v-model="params.remark"
        placeholder="请输入通话备注"
        :auto-size="{ minRows: 5, maxRows: 5 }"
        allow-clear
        @input="saveForm"
      />
      <!-- <template #extra> -->
      <div class="mt-1 _txt">您的输入内容系统会实时保存</div>
      <!-- </template>
      </a-form-item> -->
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
  import { getListByUserId, SubmitRepair } from '@/api/videoCall'
  import { useAppStore, useChatStore } from '@/store'
  import { tableData } from '@/hooks/videoCall/call-log'
  import { debounce } from 'lodash'
  import $bus from '@/utils/$bus'

  const chatStore = useChatStore()
  const appStore = useAppStore()

  const params = reactive({
    remark: '',
  })

  const saveForm = debounce(() => {
    if (params.remark) {
      const id = chatStore.currentTableRadio || tableData.value[0].id
      SubmitRepair({ ...params, id }).then(() => {
        appStore.mess({
          message: '保存成功',
          type: 'success',
        })
        // 更新tableData
        const userId = chatStore.currentChat.userProfile.userID
        getListByUserId(userId).then((value: any) => {
          // console.log('value', value)
          const _tableData = value.data.items
          chatStore.updateCallTableData(_tableData)
        })
      })
    }
  }, 500)

  onMounted(() => {
    $bus.on('chat-panel-change', () => {
      params.remark = ''
    })
    $bus.on('call-log-selected', (remark) => {
      params.remark = remark || ''
    })
  })
</script>

<style scoped lang="less">
  .general-card {
    height: calc(calc(calc(100vh - 85px) * 0.4) - 32px) !important;
    overflow: hidden;
  }
  ._txt {
    margin-top: 4px;
    color: var(--color-text-3);
    font-size: 12px;
  }
</style>
