<template>
	<view class="responsible-engineer-mod" :class="className">
		<my-title title="负责工程师" />

		<view class="engineer-info flex-c ptb-3">
			<div class="flex-c full-w">
				<u--image
					:showLoading="true"
					src="/static/touxiang.png"
					shape="circle"
					width="80px"
					height="80px"
				></u--image>
				<div class="ml-4 txt-1 flex1 flex-sb">
					<div class="flex1">
						<div class="fs-16 txt-1">{{ info.engineerName }}</div>
						<div class="fs-13 mt-3 txt-2">{{ info.engineerPhone }}</div>
					</div>

					<u-button
						type="primary"
						:plain="true"
						class="my-btn"
						v-if="showDispatchOrder"
						@click="reassign"
					>
						重新派工
					</u-button>
				</div>
			</div>
		</view>
	</view>
</template>

<script>
export default {
	name: 'responsible-engineer-mod',
	props: {
		info: {
			type: Object,
			default: () => {}
		},
		className: {
			type: String,
			default: ''
		},
		showDispatchOrder: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {};
	},
	methods: {
		reassign() {
			const workOrderInfo = JSON.stringify(this.info);
			uni.navigateTo({
				url:
					'/pages/work-order-assignment/work-order-assignment?workOrderInfo=' +
					workOrderInfo
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.responsible-engineer-mod {
	background-color: #fff;
	.main {
	}
	.my-btn {
		width: 184rpx;
		height: 72rpx;
	}
}
</style>
