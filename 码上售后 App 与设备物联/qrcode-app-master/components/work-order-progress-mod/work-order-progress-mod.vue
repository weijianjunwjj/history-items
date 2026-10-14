<template>
	<view class="work-order-progress-mod" :class="className">
		<my-title title="工单进度" />

		<u-steps :current="current" class="ptb-3" activeColor="#165DFF">
			<u-steps-item title="用户报修"></u-steps-item>
			<u-steps-item title="安排工程师"></u-steps-item>
			<u-steps-item title="完成维修"></u-steps-item>
		</u-steps>
	</view>
</template>

<script>
export default {
	name: 'work-order-progress-mod',
	props: {
		current: {
			type: Number,
			default: 0
		},
		className: {
			type: String,
			default: ''
		}
	},
	data() {
		return {};
	}
};
</script>

<style lang="scss" scoped>
.work-order-progress-mod {
	background-color: #fff;
	padding: 0 15px;
}
::v-deep {
	.u-steps {
		.u-steps-item__wrapper__circle {
			width: 50rpx;
			height: 50rpx;
			.u-icon__icon {
				font-size: 24rpx !important;
			}
		}
		.u-text__value {
			font-size: 24rpx !important;
		}
	}
}
</style>
