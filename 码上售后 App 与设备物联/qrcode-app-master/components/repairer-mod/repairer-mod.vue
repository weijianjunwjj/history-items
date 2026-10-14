<template>
	<view class="repairer-mod plr-3" :class="className">
		<my-title title="报修人" />

		<view class="device-info flex-c ptb-3  white">
			<div class="flex-c">
				<u--image
					:showLoading="true"
					src="/static/touxiang.png"
					shape="circle"
					width="80px"
					height="80px"
				></u--image>
				<div class="ml-4 txt-1">
					<div class="fs-16 txt-1">{{ info.userPhone || info.reporterPhone }}</div>
					<div class="fs-13 mt-3 txt-2">
						报修时间：{{ info.createTime }}
					</div>
				</div>
			</div>
		</view>
	</view>
</template>

<script>
export default {
	name: 'repairer-mod',
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
		return {};
	}
};
</script>

<style lang="scss">
.repairer-mod {
	background-color: #fff;
}
</style>
