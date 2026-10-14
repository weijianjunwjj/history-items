<template>
  <div class="app-container add-template">
    <div
      :style="!showEdit ? { display: 'flex' } : { display: 'none' }"
      class="flex-l"
    >
      <a-card class="box-card" :body-style="{ padding: '0px' }">
        <div class="content" @click="handleCreat">
          <icon-plus size="38" />
          <div>创建新模板</div>
        </div>
      </a-card>

      <a-card
        v-for="item in templates"
        :key="item.id"
        class="box-card"
        :body-style="{ padding: '0px' }"
      >
        <template #title>
          <div class="clearfix">
            <img :src="item.logoPath" class="logo" />
            <span class="title">{{ item.name }}</span>
          </div>
        </template>

        <div>
          <img
            :src="item.previewImg ? item.previewImg : getImg(item)"
            class="image"
          />
        </div>
        <div style="padding: 10px" class="clearfix">
          <a-button
            type="text"
            class="button"
            :class="{ danger: !item.hasUsed }"
            :disabled="item.hasUsed"
            @click="handleDelete(item)"
            >删除</a-button
          >
          <a-button type="text" class="button" @click="handleEdit(item.id)"
            >编辑</a-button
          >
        </div>
      </a-card>
    </div>

    <edit-page
      v-if="showEdit"
      :template-id="templateId"
      @handle-close="handleClose"
    />
  </div>
</template>

<script lang="ts">
  import api from '@/api/code-service/prod-center/qrcode/template'
  import { Message, Modal } from '@arco-design/web-vue'
  import EditPage from './EditPage.vue'

  export default {
    name: 'Index',
    components: { EditPage },
    data() {
      return {
        templates: [],
        templateId: null,
        showEdit: false,
      }
    },
    created() {
      this.getTemplates()
    },
    methods: {
      getImg(item) {
        // eslint-disable-next-line global-require
        const path = new URL(
          `./${item.callModule}/preview.png`,
          import.meta.url
        ).href
        return path
      },

      handleCreat() {
        this.showEdit = true
        this.templateId = null
      },
      handleEdit(id) {
        this.showEdit = true
        this.templateId = id
      },
      handleClose() {
        this.showEdit = false
        this.getTemplates()
      },
      handleDelete(template: any) {
        Modal.confirm({
          title: '系统提示',
          content: `是否确认删除：" ${template.name} "?`,
          onOk: async () => {
            await api.delTemplate(template.id)
            this.getTemplates()
            Message.success('删除成功')
          },
        })
      },
      getTemplates() {
        api.listTemplate().then((res) => {
          this.templates = res.data
        })
      },
    },
  }
</script>

<style scoped lang="less">
  .box-card {
    width: 250px;
    display: inline-block;
    margin: 10px;
    position: relative;

    &:hover {
      bottom: 5px;
    }

    .logo {
      width: 24px;
      margin-right: 5px;
    }

    .title {
      vertical-align: super;
    }

    .content {
      height: 540px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      .a-icon-plus {
        font-size: 36px;
      }

      div {
        margin-top: 10px;
      }
    }

    .image {
      width: 100%;
      height: 441px;
      display: block;
    }

    .button {
      padding: 0;
      float: right;
      margin: 5px;
    }

    .danger {
      color: red;
    }
  }

  .app-edit {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: '';
  }

  .clearfix:after {
    clear: both;
  }
</style>

<style lang="less">
  .add-template {
    .arco-upload-list-picture,
    .arco-upload-picture-card {
      width: 148px;
      height: 148px;
    }
  }
</style>
