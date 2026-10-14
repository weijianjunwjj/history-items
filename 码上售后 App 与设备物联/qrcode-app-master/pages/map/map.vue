<template>
	<view id="page-map">
		<map
			style="width: 100%; height: 99vh;"
			:latitude="latitude"
			:longitude="longitude"
			:markers="markers"
			:scale="scale"
			show-location="true"
		></map>
	</view>
</template>

<script>
export default {
	data() {
		return {
			latitude: null,
			longitude: null,
			scale: 18,
			markers: [
				{
					title: '',
					height: 100,
					width: 100,
					latitude: null, //纬度，范围为-90~90，负数表示南纬
					longitude: null //经度，范围为-180~180，负数表示西经
				}
			]
		};
	},
	onLoad({ res }) {
		const { latitude, longitude, address } = JSON.parse(res);
		this.markers.latitude = latitude;
		this.markers.longitude = longitude;
		this.address = address;
		this.getLocation();
	},
	methods: {
		getLocation() {
			let then = this;
			uni.getLocation({
				type: 'gcj02',
				geocode: true, //设置该参数为true可直接获取经纬度及城市信息
				success: function(res) {
					// res会返回当前经纬度信息之类，如果默认想展示当前位置，下面经纬度可直接使用res的值，如果默认展示指定位置，那就自定义经纬度即可；
					then.longitude = res.longitude;
					then.latitude = res.latitude;
				}
			});
		}
	}
};
</script>

<style lang="scss"></style>
