<template>
	<view class="processing-results-mod" :class="className">
		<my-title title="处理结果" />

		<div class="content">
			<div class="content-item flex-sb fs-14">
				<div class="label txt-2">是否处理</div>
				<div class="flex1 txt-1">{{ dealList[info.ticketResultState] }}</div>
			</div>
			<div class="content-item flex-sb fs-14">
				<div class="label txt-2">备注</div>
				<div class="flex1 txt-1">{{ info.ticketResultContent }}</div>
			</div>
			<div class="content-item">
				<div class="label fs-14 txt-2"><span>处理图片/视频</span></div>
				<div class="mtb-2">
					<!-- 循环图片和视频 -->

					<u-grid :border="false" >
						<u-grid-item
							v-for="(item, index) of ticketResultImages"
							:key="index"
						>
							<u--image
								:showLoading="true"
								:src="item"
								width="200rpx"
								height="200rpx"
								@click="previewImage(index)"
							></u--image>
						</u-grid-item>

						<u-grid-item v-if="ticketResultVideo.length" >
							<cl-upload
								v-model="ticketResultVideo"
								:max="1"
								:listStyle="{
									columns: 1,
									ratio: '1/1',
									height: '200rpx'
								}"
								fileType="video"
							></cl-upload>
						</u-grid-item>
					</u-grid>

				</div>
			</div>
		</div>
	</view>
</template>

<script>
export default {
	name: 'processing-results-mod',
	props: {
		info: {
			type: Object,
			default: () => {}
		},
		className: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			showUpload:true,
			dealList: ['未处理', '已处理'],
			ticketResultImages: [],
			ticketResultVideo: []
		};
	},
	watch: {
		info(info) {
			console.log('info :>> ', info);
			if (info.ticketResultImages) {
				this.ticketResultImages = info.ticketResultImages.split(',');
			}
			if(info.ticketResultVideo){
				this.ticketResultVideo=info.ticketResultVideo.split(',');
			}
		}
	},
	methods: {
		previewImage(index) {
			let photoList = this.ticketResultImages.map(item => {
				return item;
			});
			uni.previewImage({
				current: index,
				urls: photoList
			});
		}
	},
};
</script>

<style lang="scss" scoped>
.content {
	&-item {
		padding-top: 15px;
		.label {
			width: 200rpx;
		}
	}
}

::v-deep {
	.u-grid-item {
		align-items: flex-start !important;
		margin-bottom: 10px;
	}
	.cl-updata .file-list-row{
		width: 200rpx;
	}
	.cl-updata .file-list-row .remove{
		display: none;
	}
}
</style>
