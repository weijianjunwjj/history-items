# cc-pullScroolView 



##uniapp专属精品组件页面模板（由前端组件开发出品）精品组件页面模板

###●组件模板规划：
由前端组件开发出品的精品组件页面模板，将陆续发布，预计高达约几百种供您使用，是快速快发项目、创业的必备精品。

合集地址： uni-app模板合集地址：(https://ext.dcloud.net.cn/publisher?id=274945) 如查看全部页面模板，请前往上述uniapp插件市场合集地址；

###●组件模板效果图：
可下载项目后预览，效果图见右侧图片；

###●组件模板费用：
学习：免费下载，进行学习，无费用；

使用/商用：本页面地址赞赏10元后，可终身商用；

###●组件模板使用版权/商用：
本组件模板免费下载可供学习，如需使用及商用，请在本组件页面模板进行赞赏10元

（仅需10元获取精品页面模板代码-物有所值，1个组件页面市场价100元 ）

赞赏10后（当前项目产生赞赏订单可追溯）即可终身商用当前本地址下载的页面模版代码，不同下载地址需进行不同的赞赏。（不赞赏就进行商用使用者，面临侵权！保留追究知识产权法律责任！后果自负！）


### 我的技术公众号(关注后私信可加前端技术交流群)

群内气氛挺不错的，应该或许可能大概，算是为数不多的，专搞技术的前端群，偶尔聊天摸鱼

![图片](https://i.postimg.cc/RZ0sjnYP/front-End-Component.jpg)



#### 使用方法 
```使用方法
	
<!--   ref：唯一ref  pullDown:下拉刷新事件  上拉加载方法写在生命周期onReachBottom方法内  -->
<cc-pullScroolView class="pullScrollView" ref="pullScroll" :pullDown="pullDown">
</cc-pullScroolView>	
				
<!-- 注意: 上拉加载方法写在onReachBottom方法内 -->	
onReachBottom() {
	// 数据全部加载完
	if (this.curPageNum * 10 >= this.totalNum) {

		} else {

			// 显示加载中
			this.$refs.pullScroll.showUpLoading();
			this.curPageNum++;
			this.requestData();
		}

	},

```

#### HTML代码实现部分
```html
<template>
	<view class="content">

		<div class="mui-content-padded">

			<!--  ref：唯一ref pullDown:下拉刷新事件  onReachBottom：上拉加载事件 -->
			<cc-pullScroolView class="pullScrollView" ref="pullScroll" :back-top="true" :pullDown="pullDown">

				<!-- 列表组件 -->
				<CCBProjectList :productList="projectList" @click="goProDetail"></CCBProjectList>

			</cc-pullScroolView>

		</div>


	</view>
</template>


<script>
	import CCBProjectList from '../../components/ccPageView/CCProjectList.vue';

	export default {
		components: {

			CCBProjectList,


		},
		data() {
			return {
				// 列表总数量
				totalNum: 60,
				//  页码 默认1开始
				curPageNum: 1,

				// 列表数组
				projectList: []
			}
		},
		onLoad() {

			// 页面刷新方法 会自动调用pulldown一次
			this.pageRefresh();
		},
		// 上拉加载
		onReachBottom() {
			// 数据全部加载完
			if (this.curPageNum * 10 >= this.totalNum) {

			} else {

				// 显示加载中
				this.$refs.pullScroll.showUpLoading();
				this.curPageNum++;
				this.requestData();
			}

		},

		methods: {

			pageRefresh() {
				let myThis = this;
				this.$nextTick(() => {

					myThis.$refs.pullScroll.refresh();



				});
			},
			// 下拉刷新
			pullDown(pullScroll) {

				console.log('下拉刷新');
				this.projectList = [];
				this.curPageNum = 1;
				setTimeout(() => {
					this.requestData(pullScroll);
				}, 300);

			},


			// 列表条目点击事件
			goProDetail(item) {

			},


			requestData() {

				// 模拟请求参数设置
				let reqData = {

					'area': '',
					"pageSize": 10,
					"pageNo": this.curPageNum
				}

				let myThis = this;
				setTimeout(function() {


					// 模拟请求接口
					for (let i = 0; i < 10; i++) {

						myThis.projectList.push({
							'proName': '产品名称' + i,
							'proUnit': '公司名称' + i,
							'area': '广东省',
							'proType': '省级项目',
							'stage': '已开工',
							'id': 10 * (myThis.curPageNum + i) + myThis.curPageNum + ''
						});
					}
					// 列表总数量
					myThis.totalNum = 60;
					// 如果是最后一页
					if (myThis.curPageNum * 10 >= myThis.totalNum) {
						myThis.$refs.pullScroll.finish();

					} else {
						// 不是最后一页
						myThis.$refs.pullScroll.success();
					}

				}, 600);



			}
		}
	}
</script>


<style>
	page {

		background-color: #f2f2f2;
	}

	.content {
		display: flex;
		flex-direction: column;

	}

	.mui-content-padded {
		margin: 0px 14px;
		/* background-color: #ffffff; */
	}

	.pullScrollView {
		display: flex;
		flex-direction: column;

	}
</style>
```
