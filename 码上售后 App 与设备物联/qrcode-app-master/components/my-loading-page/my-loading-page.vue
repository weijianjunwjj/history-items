<template>
	<u-loading-page
		loading-text="加载中"
		image="/static/logo.png"
		fontSize="36"
		iconSize="100"
		:loading="loading"
	></u-loading-page>
</template>

<script>
export default {
	name: 'my-loading-page',
	props: {
		loading: {
			type: Boolean,
			default: true
		},
	},
	data() {
		return {};
	}
};
</script>

<style lang="scss"></style>
