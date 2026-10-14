<template>
  <view>
    <!-- 显示区域 -->
    <view class="img_item">
      <image
        v-for="(item, index) in column1"
        :key="index"
        :src="item.img"
        :style="{ width: '100%', height: `${item.height}px` }"
      ></image>
    </view>
    <view class="img_item">
      <image
        v-for="(item, index) in column2"
        :key="index"
        :src="item.img"
        :style="{ width: '100%', height: `${item.height}px` }"
      ></image>
    </view>
    <!-- 隐藏区域   因为需要获取每个图片的 宽高    所以需要利用隐藏区域    通过 bindload 事件  获取每一个图片的宽高   -->
    <view style="display: none">
      <image
        v-for="(item, index) in imgArr"
        :key="index"
        :data-idx="item.id"
        :src="item.img"
        @load="(e) => imageLoad(e, item)"
      ></image>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      imgWidth: 0, // 	图片的宽        （ 屏幕宽  *  0.48 ）
      loadingCount: 0, //	需要再次加载图片的数量
      imgArr: [], //  	需要再次加载的图片数组
      column1: [], //  	第1列图片数组
      column2: [], //  	第2列图片数组
      column1Height: 0, //记录第1列图片数组高度总和
      column2Height: 0, //记录第2列图片数组高度总和
    }
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      },
    },
  },
  watch: {
    // 监听
    list: {
      handler(val) {
        this.imgArr = val
        console.log(this.imgArr)
        this.loadingCount = val.length
      },
      immediate: true,
      //   deep: true,
    },
  },
  mounted() {
    uni.getSystemInfo({
      success: (res) => {
        this.imgWidth = res.windowWidth * 0.48 // 定义所有图片的宽 ( 屏幕宽  *  0.48 ）
      },
    })
  },
  methods: {
    /**
     * 当图片载入完毕时触发   每加载一个隐藏区的图片都会触发一次
     *
     * 因为需要获取每个图片的 宽高    所以需要利用隐藏区域    通过 imageLoad(e) 事件中的 e 获取每一个图片的宽高
     */
    imageLoad(e, item) {
      let oImgW = e.detail.width //图片原始宽度
      let oImgH = e.detail.height //图片原始高度

      let scale = this.imgWidth / oImgW //比例计算  （ 当前图片缩放的比例   =  定义的图片宽度 / 图片原始宽度       ）
      let imgHeight = oImgH * scale //自适应高度（ 当前图片的自适应高度  =   图片原始高度 * 当前图片缩放的比例  ）
      item.height = imgHeight //图片的自适应高度赋予 图片对象

      if (this.column1Height <= this.column2Height) {
        //判断 列表1 的高度 如果 小于等于 列表2 就将当前的图片对象添加到列表1数组中
        this.column1Height += imgHeight //每次将当前图片高度加上之前的 高度
        this.column1.push(item) //更新第1列图片数组
      } else {
        this.column2Height += imgHeight
        this.column2.push(item) //更新第2列图片数组
      }
      this.loadingCount = this.loadingCount - 1 //当前需要再次加载图片的数量减1
      if (this.loadingCount == 0) {
        this.imgArr = [] //如果当前需要再次加载图片的数量为0 就将 需要加载的图片数组清空
      }
    },
  },
}
</script>

<style>
.img_item {
  width: 48%;
  margin: 1%;
  display: inline-block;
  vertical-align: top;
}
</style>
