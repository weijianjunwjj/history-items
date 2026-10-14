<template>
	<view class="cl-updata">
		<view class="file-list" :style="[listRowStyle]">
			<view
				v-for="(item, index) in FileList"
				@tap="onClickRow(item, index)"
				class="file-list-row"
				:style="[rowStyle]"
				:key="index"
			>
				<image
					v-if="fileUrlType(item) === 'image'"
					:src="item.url || item"
					:style="[imgStyle]"
					mode="aspectFill"
				></image>

				<!-- 	<video
					v-else
					v-show="showVideoBtn"
					class="_video"
					:style="[imgStyle]"
					:src="item.url || item"
					:show-center-play-btn="false"
					:controls="false"
				>
					<cover-view
						v-if="showPlayBbtn"
						class="play"
						@tap="onPlay(item, index)"
					>
						<slot name="playImg">
							<image
								style="width: 100%"
								src="https://qrservice-1309638772.cos.ap-shanghai.myqcloud.com/1498497126920065024/2022/11/17/1tgkNwsNLto.png"
								mode="widthFix"
							></image>
						</slot>
					</cover-view>
				</video> -->

				<view
					v-else
					class="_video flex-hvc"
					style="background-color: rgba(0, 0, 0, 0.7)"
					@tap="onPlay(item, index)"
				>
					<image class="play" src="/static/play.png" mode="widthFix"></image>
				</view>

				<!-- <image
					v-else
					@tap="onPlay(item, index)"
					style="width: 200rpx;height: 200rpx;"
					src="/static/play.png"
				></image> -->

				<view v-if="remove" @tap.stop="onRemove(item, index)">
					<slot name="delete">
						<view class="remove">
							<image
								src="https://i.postimg.cc/HnjMwLBX/delete.png"
								mode="widthFix"
							></image>
						</view>
					</slot>
				</view>
			</view>

			<view
				v-if="add && FileList.length < max"
				@tap="onClickAdd"
				:style="[rowStyle]"
				class="file-list-row add-image"
			>
				<slot name="addImg">
					<image
						src="https://i.postimg.cc/5yGCnMRG/add.png"
						mode="widthFix"
					></image>
				</slot>
			</view>
		</view>

		<view v-if="tempVideoUrl" class="mask">
			<view class="flex-hvc">
				<!-- https://s3.bmp.ovh/imgs/2022/07/27/4ad2b0fbe8d65e7e.png -->
				<image
					@tap="offPlay()"
					class="_root"
					src="/static/cha.png"
				></image>
			</view>

			<view class="block" @tap.stop>
				<video autoplay :src="tempVideoUrl"></video>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'updata',
	props: {
		//受控图片列表
		value: {
			type: Array,
			default: () => []
		},
		// 文件类型 'image', 'video', 'all'
		fileType: {
			type: String,
			default: 'all'
		},
		// 上传图片参数
		imageFormData: {
			type: Object,
			default: () => {}
		},
		// 上传视频参数
		videoFromData: {
			type: Object,
			default: () => {}
		},

		// 必选参数，上传的地址
		action: {
			type: String,
			default: ''
		},

		// 设置上传的请求头部
		headers: {
			type: Object,
			default: () => {}
		},

		// 上传时附带的额外参数
		data: {
			type: Object,
			default: () => {}
		},

		// 是否开启预览图片
		isPreviewImage: {
			type: Boolean,
			default: true
		},
		// 是否使用自定义播放按钮
		showPlayBbtn: {
			type: Boolean,
			default: true
		},

		// 图片指示器样式，可取值："default" - 底部圆点指示器； "number" - 顶部数字指示器； "none" - 不显示指示器。
		indicator: {
			type: String,
			default: 'none'
		},
		// 是否在选取文件后立即进行上传
		autoUpload: {
			type: Boolean,
			default: true
		},
		// 是否显示删除按钮
		remove: {
			type: Boolean,
			default: true
		},
		// 是否添加按钮
		add: {
			type: Boolean,
			default: true
		},
		// 最多显示数量
		max: {
			type: Number,
			default: 9
		},
		// 列表样式
		listStyle: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			showVideoBtn: true,
			// 渲染列表
			FileList: [],

			// 预览视频地址
			tempVideoUrl: '',

			// 临时文件列表
			tempFile_paths: []
		};
	},
	watch: {
		value: {
			handler: function(newData, oldData) {
				this.FileList = newData;
			},
			deep: true,
			immediate: true
		}
	},
	computed: {
		listRowStyle() {
			const style = {
				'grid-template-columns': `repeat(${this.listStyle?.columns || 4}, 1fr)`, // 每行数量
				'grid-column-gap': this.listStyle?.columnGap || '40rpx', // 行间距
				'grid-row-gap': this.listStyle?.rowGap || '40rpx', // 列间距
				padding: this.listStyle?.padding || '0rpx' // 列表内边距
			};
			return style;
		},
		rowStyle() {
			const style = {
				'aspect-ratio': this.listStyle?.height
					? ''
					: this.listStyle?.ratio || '1/1', // 图片比例
				height: this.listStyle?.height || '140rpx'
			};
			return style;
		},
		imgStyle() {
			const style = {
				'border-radius': this.listStyle?.radius || '6rpx' // 图片圆角
			};
			return style;
		}
	},
	methods: {
		/**
		 * 删除已选择文件
		 * */
		onRemove(item, index) {
			uni.showModal({
				title: '提示',
				content: '您确定要删除么?',
				success: res => {
					if (res.confirm) {
						const tempFileIndex = this.tempFile_paths.indexOf(
							item.url || item
						);

						if (tempFileIndex > -1) {
							this.tempFile_paths.splice(tempFileIndex, 1);
						}

						this.FileList.splice(index, 1);
						this.$emit('input', this.FileList);
					}
				}
			});
		},

		/**
		 * 点击已选择文件
		 * */
		onClickRow(item, index) {
			this.previewImage(item, index);
			this.$emit('onImage', {
				item,
				index
			});
		},

		/**
		 * 点击选择图片按钮
		 * */
		onClickAdd() {
			switch (this.fileType) {
				case 'image':
					this.onChooseFile(1);
					break;
				case 'video':
					this.onChooseFile(2);
					break;
				case 'all':
					// // #ifdef MP-WEIXIN || MP-TOUTIAO || MP-JD
					// 	this.onChooseFile(3);
					// 	return false;
					// // #endif

					uni.showActionSheet({
						itemList: ['相册', '视频'],
						success: res => {
							const tapIndex = res.tapIndex;
							if (tapIndex === 0) {
								this.onChooseFile(1);
							} else {
								this.onChooseFile(2);
							}
						},
						fail: res => {
							console.error(res.errMsg);
						}
					});
					break;
				default:
					this.onChooseFile(1);
					break;
			}
		},

		/**
		 * 从本地选择文件。
		 * @param { number } 选择类型 1:图片 2视频
		 * */
		async onChooseFile(updataType) {
			const that = this;
			if (updataType === 1) {
				const data = Object.assign(
					{},
					{
						// 最多可以选择的图片张数，默认9
						count: 9,
						// 仅对 mediaType 为 image 时有效，是否压缩所选文件
						// #ifndef MP-TOUTIAO
						sizeType: ['original', 'compressed'],
						// #endif
						// album 从相册选图，camera 使用相机，默认二者都有。
						sourceType: ['camera ', 'album'],

						compress: false
					},
					this.imageFormData
				);

				uni.chooseImage({
					...data,
					success: async res => {
						const tempFilePaths = res.tempFiles;
						const compress = that.imageFormData?.compress || false;

						if (compress) {
							const compressImage = await that.compressImage(tempFilePaths);
							upload(compressImage);
						} else {
							upload(tempFilePaths.map(item => item.path));
						}

						function upload(imagesTemp) {
							if (that.autoUpload) {
								imagesTemp.map(item => {
									that.updataFile(item);
								});
							} else {
								that.FileList = [...that.FileList, ...imagesTemp];
								that.tempFile_paths = [
									...that.tempFile_paths,
									...imagesTemp
								];
							}
						}
					},
					fail(err) {
						that.$emit('onError', err);
						console.error('选择图片失败', err);
					}
				});
			}

			if (updataType === 2) {
				const data = Object.assign(
					{},
					{
						// 	拍摄视频最长拍摄时间，单位秒。最长支持 60 秒。
						maxDuration: 60,
						// #ifndef MP-TOUTIAO
						// 'front'、'back'，默认'back'
						camera: 'back',
						// #endif

						// album 从相册选视频，camera 使用相机拍摄，默认二者都有。
						sourceType: ['camera ', 'album'],
						// 是否压缩所选的视频源文件，默认值为 true，需要压缩。
						compressed: true
						// 'front'、'back'，默认'back'
					},
					this.videoFormData
				);

				uni.chooseVideo({
					...data,
					success(res) {
						const tempFilePath = res.tempFilePath;
						if (that.autoUpload) {
							that.updataFile(tempFilePath);
						} else {
							that.FileList.push({
								url: tempFilePath,
								type: 'video'
							});
							that.tempFile_paths.push(tempFilePath);
						}
					},
					fail(err) {
						console.error('选择视频失败', err);
					}
				});
			}

			// 拍摄或从手机相册中选择图片或视频。
			if (this.fileType === 3) {
				const data = Object.assign(
					{},
					this.imageFormData,
					this.this.videoFormData,
					{
						// 最多可以选择的图片张数，默认9
						count: 9,

						// #ifdef MP-WEIXIN
						sizeType: ['original', 'compressed'],
						// #endif

						// album 从相册选图，camera 使用相机，默认二者都有。
						sourceType: ['camera ', 'album']
					}
				);

				uni.chooseMedia({
					count: 9,
					mediaType: ['image', 'video'],
					sourceType: ['album', 'camera'],
					maxDuration: 30,
					camera: 'back',
					success(res) {}
				});
			}
		},

		/**
		 * 上传文件到服务器
		 * @param {url} tempFile 文件临时地址
		 * */
		updataFile(tempFile) {
			const that = this;
			uni.showLoading({
				title: '正在上传中...',
				icon: 'loading'
			});
			return new Promise(resolve => {
				const uploadTask = uni.uploadFile({
					url: that.action,
					filePath: tempFile,
					name: 'file',
					formData: that.data,
					header: that.headers,
					// #ifdef MP-ALIPAY
					fileType: this.fileUrlType(tempFile),
					// #endif
					success: uploadFileRes => {
						const data = JSON.parse(uploadFileRes.data);
						uni.hideLoading();
						that.success(data);
						resolve(data);
					},
					fail: error => {
						uni.hideLoading();
						console.error('error', error);
						that.$emit('onError', error);
					}
				});

				uploadTask.onProgressUpdate(res => {
					that.$emit('onProgress', {
						...res,
						...tempFile
					});
				});
			});
		},

		/**
		 * 手动上传
		 * */
		submit() {
			return new Promise(resolve => {
				if (this.tempFile_paths.length <= 0) {
					this.success([]);
					return console.error('没有可上传文件');
				}

				const promises = this.tempFile_paths.map(item => {
					return this.updataFile(item);
				});

				Promise.all(promises).then(reslut => {
					this.tempFile_paths = [];
					this.success(reslut);
					resolve(reslut);
				});
			});
		},

		/**
		 * 返回数据
		 * */
		success(data) {
			this.$emit('onSuccess', data);

			// 自定义数据结构-选择性开启
			// const list = data.map(item=> {
			// 	return JSON.parse(item).data.link;
			// })
			// this.$emit('input', [...this.FileList, ...list]);
		},
		/**
		 * 压缩图片
		 * @param {array} tempFilePaths 临时路径数组
		 * @return {array} 被压缩过的路径数组
		 * */
		async compressImage(tempFilePaths) {
			const that = this;

			return new Promise(resolve => {
				if (tempFilePaths.length <= 0) {
					console.error('压缩数组不能为空');
					resolve([]);
				}

				const promiseImages = item => {
					return new Promise(resol => {
						// #ifdef H5
						this.canvasDataURL(
							item,
							{
								quality: that.imageFormData.quality / 100
							},
							base64Codes => {
								resol(base64Codes);
							}
						);
						// #endif

						// #ifndef H5
						uni.compressImage({
							src: item.path,
							quality: that.imageFormData.quality || 80,
							success: res => {
								console.log(res);
								resol(res.tempFilePath);
							},
							fail(err) {
								console.log('压缩失败', err);
								resol(err);
							}
						});
						// #endif
					});
				};
				const compressImages = tempFilePaths.map(item => {
					return promiseImages(item);
				});

				uni.showLoading({
					title: '压缩中...',
					icon: 'loading'
				});

				Promise.all(compressImages)
					.then(res => {
						uni.hideLoading();
						resolve(res);
					})
					.catch(err => {
						uni.hideLoading();
						resolve(err);
					});
			});
		},

		/**
		 * H5压缩图片质量
		 * */
		canvasDataURL(path, obj, callback) {
			var img = new Image();
			img.src = path;
			img.onload = function() {
				var that = this;
				// 默认按比例压缩
				var w = that.width,
					h = that.height,
					scale = w / h;
				w = obj.width || w;
				h = obj.height || w / scale;
				var quality = 0.8; // 默认图片质量为0.8
				//生成canvas
				var canvas = document.createElement('canvas');
				var ctx = canvas.getContext('2d');
				// 创建属性节点
				var anw = document.createAttribute('width');
				anw.nodeValue = w;
				var anh = document.createAttribute('height');
				anh.nodeValue = h;
				canvas.setAttributeNode(anw);
				canvas.setAttributeNode(anh);
				ctx.drawImage(that, 0, 0, w, h);
				// 图像质量
				if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
					quality = obj.quality;
				}
				// quality值越小，所绘制出的图像越模糊
				var base64 = canvas.toDataURL('image/jpeg', quality);
				// 回调函数返回base64的值
				callback(base64);
			};
		},

		/**
		 * 预览图片
		 * @param {string, object} item 文件信息
		 * */
		previewImage(item) {
			const that = this;

			if (that.fileUrlType(item) === 'video' || item.type === 'video') return false;
			if (!that.isPreviewImage) return false;

			const imgs = that.FileList.filter(item => {
				return that.fileUrlType(item) !== 'video' && item.type !== 'video';
			});
			const current = imgs.indexOf(item);

			uni.previewImage({
				current: current,
				urls: imgs,
				indicator: that.indicator,
				loop: true,
				success() {}
			});
		},

		/**
		 * 预览视频
		 * @param {string, object} item 文件信息
		 * */
		onPlay(item, index) {
			this.$emit('onVideo', {
				item,
				index
			});
			this.tempVideoUrl = item.url || item;
		},
		offPlay(item, index) {
			this.$emit('offVideo');
			this.tempVideoUrl = '';
		},

		/**
		 * 是否img类型
		 * @param {string, object} item 文件信息
		 * */
		fileUrlType(item) {
			if (!item) {
				console.error('列表文件尾缀或地址错误');
				return false;
			}

			const url = item.url || item.path || item || false;
			const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;

			if (IMAGE_REGEXP.test(url) || this.isBase64(url)) {
				return 'image';
			} else {
				return 'video';
			}
		},
		isBase64(str) {
			return str.includes('data:image/jpeg;base64,') || str.includes('blob:');
		}
	}
};
</script>

<style lang="scss" scoped>
.cl-updata {
	.file-list {
		display: grid;

		&-row {
			display: inline-flex;
			align-items: center;
			position: relative;

			image {
				height: 100%;
				width: 100%;
			}

			._video {
				position: relative;
				width: 100%;
				height: 100%;

				.play {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 30%;
					z-index: 9;
				}
			}

			.remove {
				position: absolute;
				top: 0;
				right: 0;
				background-color: #373737;
				height: 50rpx;
				width: 50rpx;
				border-bottom-left-radius: 200rpx;
				z-index: 3;

				image {
					width: 20rpx;
					height: 20rpx;
					position: absolute;
					right: 12rpx;
					top: 12rpx;
				}
			}
		}

		.add-image {
			display: flex;
			align-items: center;
			justify-content: center;
			border: 2rpx dashed #ccc;

			&:active {
				opacity: 0.8;
			}

			image {
				width: 40%;
			}
		}
	}

	.mask {
		height: 100vh;
		background-color: #000;
		position: fixed;
		top: 0%;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 9999;

		.block {
			position: absolute;
			width: 100%;
			bottom: 0;
			video {
				width: 100%;
			}
		}

		._root {
			width: 30rpx;
			height: 30rpx;
			position: absolute;
			z-index: 999;
			right: 20px;
			top: 13px;
		}
	}
}
</style>
