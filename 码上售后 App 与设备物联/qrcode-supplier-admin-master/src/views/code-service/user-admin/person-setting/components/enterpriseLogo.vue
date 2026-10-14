<template>
  <!-- <div>头像</div> -->
  <div>
    <a-avatar
      :size="100"
      class="info-avatar"
      auto-fix-font-size
      trigger-type="mask"
      @click="editCropper"
    >
      <img v-if="user.avatar" alt="avatar" :src="user.avatar" />
      <img v-else :preview="false" src="~@/assets/images/avatar.png" />
      <template #trigger-icon>
        <IconEdit />
      </template>
    </a-avatar>
    <a-modal
      v-model:visible="visible"
      :footer="false"
      width="780px"
      unmount-on-close
    >
      <template #title> 修改企业logo </template>
      <div>
        <div class="cut-logo-box">
          <div class="cut">
            <vue-cropper
              ref="cropper"
              :img="option.img"
              :output-size="option.size"
              :output-type="option.outputType"
              :info="true"
              :full="option.full"
              :can-move="option.canMove"
              :can-move-box="option.canMoveBox"
              :fixed-box="option.fixedBox"
              :original="option.original"
              :auto-crop="option.autoCrop"
              :auto-crop-width="option.autoCropWidth"
              :auto-crop-height="option.autoCropHeight"
              :center-box="option.centerBox"
              :high="option.high"
              mode="cover"
              :max-img-size="option.max"
              @real-time="realTime"
            ></vue-cropper>
          </div>
          <div class="show-preview">
            <div
              class="show-preview"
              :style="{
                width: previews.w + 'px',
                height: previews.h + 'px',
                overflow: 'hidden',
              }"
            >
              <div :style="previews.div">
                <img :src="previews.url" :style="previews.img" />
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <div class="left">
            <div>
              <label
                class="btn arco-btn arco-btn-primary arco-btn-shape-square arco-btn-size-medium arco-btn-status-normal"
                for="uploads"
              >
                上传图片
              </label>
              <input
                id="uploads"
                type="file"
                style="position: absolute; clip: rect(0 0 0 0)"
                accept="image/png, image/jpeg, image/gif, image/jpg"
                @change="uploadImg($event)"
              />
            </div>
            <div>
              <a-button type="outline" @click="changeScale(1)">+</a-button>
              <a-button type="outline" @click="changeScale(-1)">-</a-button>
              <a-button type="outline" @click="rotateLeft">
                <template #icon>
                  <icon-rotate-left />
                </template>
              </a-button>
              <a-button type="outline" @click="rotateRight">
                <template #icon>
                  <icon-rotate-right />
                </template>
              </a-button>
            </div>
          </div>
          <div class="right">
            <a-button type="primary" @click="handleClickSubmit">提交</a-button>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import 'vue-cropper/dist/index.css'
  import { storeToRefs } from 'pinia'
  import { VueCropper } from 'vue-cropper'
  import { uploadAvatar } from '@/api/code-service/user-admin/person-setting/index.ts'
  import { useUserStore } from '@/store'
  import { Message } from '@arco-design/web-vue'

  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)

  const visible = ref(false)

  const option = reactive({
    img: user.value.avatar,
    size: 1,
    full: true,
    outputType: 'png',
    canMove: true,
    fixedBox: true,
    original: false,
    canMoveBox: true,
    autoCrop: true,
    autoCropWidth: 200,
    autoCropHeight: 200,
    // 只有自动截图开启 宽度高度才生效
    centerBox: false,
    high: true,
    fixed: true,
    max: 99999,
  })

  const previews = ref({})
  const cropper = ref()

  const realTime = (data) => {
    previews.value = data
  }

  // eslint-disable-next-line consistent-return
  const uploadImg = (e) => {
    // 上传图片
    // this.option.img
    const file = e.target.files[0]
    if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
      Message.info('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
      return false
    }
    const reader = new FileReader()
    // eslint-disable-next-line no-shadow
    reader.onload = (e) => {
      let data
      if (typeof e.target.result === 'object') {
        // 把Array Buffer转化为blob 如果是base64不需要
        data = window.URL.createObjectURL(new Blob([e.target.result]))
      } else {
        data = e.target.result
      }
      option.img = data
    }
    // 转化为base64
    // reader.readAsDataURL(file)
    // 转化为blob
    reader.readAsArrayBuffer(file)
  }

  const handleClickSubmit = () => {
    cropper.value.getCropBlob(async (data) => {
      const formData = new FormData()
      formData.append('avatarfile', data)
      const configs = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }

      try {
        await uploadAvatar(formData, configs)
        visible.value = false
        userStore.info()
        Message.success('修改成功')
      } catch (error) {
        console.log(error)
      }
    })
  }

  const changeScale = (num) => {
    num = num || 1
    cropper.value.changeScale(num)
  }

  const rotateLeft = () => {
    cropper.value.rotateLeft()
  }

  const rotateRight = () => {
    cropper.value.rotateRight()
  }

  // 编辑头像
  const editCropper = () => {
    visible.value = true
    // 设置头像base64
    setAvatarBase64(user.value.avatar, (base64) => {
      option.img = base64
    })
  }

  // 设置头像base64
  const setAvatarBase64 = (src, callback) => {
    const image = new Image()
    // 处理缓存
    image.src = `${src}?v=${Math.random()}`
    // 支持跨域图片
    image.crossOrigin = 'Anonymous'
    image.onload = () => {
      const base64 = transBase64FromImage(image)
      callback && callback(base64)
    }
  }

  // 将网络图片转换成base64格式
  const transBase64FromImage = (image) => {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0, image.width, image.height)
    // 可选其他值 image/jpeg
    return canvas.toDataURL('image/png')
  }

  onMounted(async () => {
    await nextTick()
    setAvatarBase64(user.value.avatar, (base64) => {
      option.img = base64
    })
  })
</script>

<style lang="less" scoped>
  .cut-logo-box {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;

    .cut {
      width: 480px;
      height: 480px;
    }

    .show-preview {
      width: 200px;
      height: 200px;
      border-radius: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      box-shadow: 0 0 4px #ccc;
      box-sizing: border-box;
    }
  }

  .footer {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .left {
      width: 400px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      div {
        display: flex;
      }

      .arco-btn {
        margin-right: 20px;
      }
    }

    .right {
      width: 200px;
      text-align: center;
    }

    .btn {
      line-height: 32px;
    }
  }
</style>
