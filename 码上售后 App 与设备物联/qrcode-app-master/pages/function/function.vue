<template>
	<view class="page-function">
		<my-title title="设备绑码" className="plr-3" />

		<van-grid column-num="3">
			<van-grid-item
				icon="/static/scan-code.png"
				text="扫码绑设备"
				url="/pages/scan-code-bind-device/scan-code-bind-device"
			></van-grid-item>
			<van-grid-item icon="/static/devide-bind-code.png" text="设备绑二维码" url="/pages/device-bind-qrcode/device-bind-qrcode"   />
			<van-grid-item icon="/static/unbind-logo.png" text="解绑" url="/pages/unbind/unbind" />
		</van-grid>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [
				{
					name: 'photo',
					title: '图片'
				},
				{
					name: 'lock',
					title: '锁头'
				},
				{
					name: 'star',
					title: '星星'
				}
			]
		};
	},
	methods: {
		click(name) {
			this.$refs.uToast.success(`点击了第${name}个`);
		}
	}
};
</script>

<style lang="scss" scoped></style>
