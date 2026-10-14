<template>
	<view class="processing-results-mod rel" :class="className">
		<my-title title="工单信息" />

		<view
			class="create-by"
			:class="sources[info.source].className"
			v-if="sources[info.source]"
		>
			{{ sources[info.source].text }}
		</view>

		<div class="content">
			<div class="content-item flex-sb fs-14">
				<div class="label txt-2">报修人</div>
				<div class="flex1 txt-1">{{ info.reporterPhone }}</div>
			</div>
			<div class="content-item flex-sb fs-14">
				<div class="label txt-2">报修时间</div>
				<div class="flex1 txt-1">{{ info.createTime }}</div>
			</div>

			<div class="content-item flex-sb fs-14">
				<div class="label txt-2">工单类型</div>
				<div class="flex1 txt-1">{{ workOrderType }}</div>
			</div>

			<div class="content-item flex-sb fs-14">
				<div class="label txt-2">问题描述</div>
				<div class="flex1 txt-1">{{ info.ticketContent }}</div>
			</div>

			<div class="content-item">
				<div class="label fs-14 txt-2"><span>现场图片/视频</span></div>
				<div class="mtb-2">
					<!-- 循环图片和视频 -->

					<u-grid :border="false">
						<u-grid-item
							v-for="(item, index) of ticketImages"
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

						<u-grid-item v-if="ticketVideo.length">
							<cl-upload
								v-model="ticketVideo"
								:max="1"
								:listStyle="{
									columns: 1,
									ratio: '1/1',
									height: '200rpx'
								}"
								poster="/static/logo.png"
								fileType="video"
								@onVideo="onVideo"
								@offVideo="offVideo"
							>
							</cl-upload>
						</u-grid-item>
					</u-grid>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
import { sources } from '@/utils/data.js';
export default {
	name: 'work-order-info-mod',
	props: {
		info: {
			type: Object,
			default: () => {}
		},
		className: {
			type: String,
			default: ''
		},
		workOrderType: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			showUpload:true,
			sources,
			dealList: ['未处理', '已处理'],
			ticketImages: [],
			ticketVideo: []
		};
	},
	watch: {
		info: {
			immediate: true,
			deep: true,
			handler(info) {
				console.log('info :>> ', info);
				if (info.ticketImages) {
					this.ticketImages = info.ticketImages.split(',');
				}
				if (info.ticketVideo) {
					this.ticketVideo = info.ticketVideo.split(',');
				}
			}
		}
	},
	methods: {
		onVideo(){
			console.error('onVideo--------------');
		},
		offVideo(){
			console.error('offVideo--------------');
		},
		previewImage(index) {
			let photoList = this.ticketImages.map(item => {
				return item;
			});
			uni.previewImage({
				current: index,
				urls: photoList
			});
		}
	}
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

.create-by {
	position: absolute;
	top: 0;
	right: 0;
	width: 154rpx;
	height: 40rpx;
	border-radius: 0px 4px 0px 4px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 24rpx;
}

::v-deep {
	.u-grid-item {
		align-items: flex-start !important;
		margin-bottom: 10px;
	}
	.cl-updata .file-list-row {
		width: 200rpx;
	}
	.cl-updata .file-list-row .remove {
		display: none;
	}
}
</style>
