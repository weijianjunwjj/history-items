<template>
	<view class="related-device-mod plr-3" :class="className">
		<my-title title="关联设备" />

		<view class="device-info flex-c mtb-3  white">
			<div class="flex-c">
				<u--image
					:showLoading="true"
					:src="info.deviceImage"
					width="80px"
					height="80px"
				></u--image>
				<div class="ml-4 txt-1">
					<div class="fs-16 txt-1">{{ info.deviceSn }}</div>
					<div class="fs-13 mt-3 txt-2">设备名称：{{ info.deviceName }}</div>
					<div class="fs-13 mt-3 txt-2">
						设备归属：{{ info.deviceCustomer }}
					</div>
				</div>
			</div>
		</view>

		<div class="div-border mtb-3"></div>

		<view class="device-address pb-3 fs-13 txt-3 flex">
			<u-icon name="map-fill" ></u-icon>
			<view class="ml-2">
				{{ info.address }}
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'related-device-mod',
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

<style lang="scss" scoped>
.related-device-mod {
	background-color: #fff;
}
</style>
