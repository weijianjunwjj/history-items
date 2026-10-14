<template>
	<view class="page-processing-results">
		<u--form :model="form" ref="form" class="my-form">
			<u-form-item
				label="是否处理"
				required
				prop="deal"
				labelPosition="top"
				labelWidth="140"
				@click="show1 = true"
			>
				<u-input
					v-model="form.deal"
					placeholder="请选择工单类型"
					:disabled="true"
					suffixIcon="arrow-down"
					suffixIconStyle="color: #909399"
					customStyle="background:#fff"
				/>
			</u-form-item>

			<u-form-item label="备注" labelPosition="top" labelWidth="140">
				<u-textarea
					v-model="form.ticketResultContent"
					height="120"
					placeholder="请输入您认为需要记录的内容"
				></u-textarea>
			</u-form-item>

			<u-form-item
				label="上传图片 （最多九张，大小不超过5M)"
				labelPosition="top"
				labelWidth="520"
			>
				<u-upload
					width="200"
					height="200"
					:fileList="form.fileListPic"
					@afterRead="afterRead"
					@delete="deleteFile"
					name="Pic"
					multiple
					:previewFullImage="true"
					:maxCount="9"
				></u-upload>
			</u-form-item>

			<u-form-item
				label="上传视频 （最多一个，大小不超过200M)"
				prop="fileListVideo"
				labelPosition="top"
				labelWidth="555"
			>
				<u-upload
					v-if="!showVideo"
					width="200"
					height="200"
					:fileList="form.fileListVideo"
					@afterRead="afterRead"
					@delete="deleteFile"
					name="Video"
					multiple
					:maxCount="1"
					:maxSize="200 * 1024 * 1024"
					:previewFullImage="true"
					accept="video"
				></u-upload>
				<cl-upload
					v-else
					v-model="form.fileListVideo"
					:action="action"
					:headers="headers"
					:max="1"
					:videoFromData="formData"
					:listStyle="{
						columns: 3,
						ratio: '1/1',
						height: '200rpx'
					}"
					fileType="video"
					@onSuccess="onSuccess"
					@input="onVideoInput"
				></cl-upload>
			</u-form-item>

			<u-form-item>
				<u-button type="primary" class="btn mb-4" @click="submit">提交</u-button>
			</u-form-item>
		</u--form>

		<work-order-progress-mod className="mtb-2" :current="workOrderInfo.ticketState" />

		<responsible-engineer-mod className="mtb-2 plr-3" :info="workOrderInfo" :showDispatchOrder="true" />

		<related-device-mod className="mtb-2" :info="workOrderInfo" />

		<work-order-info-mod
			className="mtb-2 plr-3 pb-3 bg-white"
			:info="workOrderInfo"
			:workOrderType="workOrderType"
		/>

		<u-picker
			:show="show1"
			itemHeight="66"
			keyName="label"
			:columns="dealList"
			@confirm="onDealConfirm"
			@cancel="show1 = false"
		></u-picker>
	</view>
</template>

<script>
import { upload, closeWorkTicket,getWorkTicketTypeList,getWorkTicket } from '@/config/api.js';
export default {
	data() {
		return {
			workOrderType:'',
			workOrderInfo: {},
			showVideo: false,
			action: uni.$url + '/file/upload',
			headers: {
				Authorization: uni.getStorageSync('token')
					? 'Bearer ' + uni.getStorageSync('token')
					: ''
			},
			formData: {
				folder: `workticket/video/$day`
			},
			show1: false,
			dealList: [
				[
					{
						label: '未处理',
						value: 0
					},
					{
						label: '已处理',
						value: 1
					}
				]
			],
			form: {
				deal: '',
				fileListPic: [],
				fileListVideo: [],
				ticketResultContent: ''
			},
			rules: {
				deal: [
					{
						required: true,
						message: '请选择工单类型',
						trigger: ['blur', 'change']
					}
				],
				fileListPic: [
					{
						// 自定义验证函数，见上说明
						validator: (rule, value, callback) => {
							// 上面有说，返回true表示校验通过，返回false表示不通过
							console.log('value :>> ', value);
							if (!value.length) {
								callback(1);
							} else {
								callback();
							}
						},
						message: '请上传图片',
						// 触发器可以同时用blur和change
						trigger: ['change', 'blur']
					}
				],
				fileListVideo: [
					{
						// 自定义验证函数，见上说明
						validator: (rule, value, callback) => {
							// 上面有说，返回true表示校验通过，返回false表示不通过
							console.log('value2 :>> ', value);
							if (!value.length && !this.form.fileListPic.length) {
								callback(1);
							} else {
								callback();
							}
						},
						message: '请上传视频或上传图片',
						// 触发器可以同时用blur和change
						trigger: ['change', 'blur']
					}
				]
			}
		};
	},
	onLoad(options) {
		const workOrderInfo = JSON.parse(options.workOrderInfo);
		console.log('workOrderInfo :>> ', workOrderInfo);
		this.workOrderInfo = workOrderInfo;
		this.getWorkorderList()
		this.getWorkTicket()
	},
	onReady() {
		//onReady 为uni-app支持的生命周期之一
		this.$refs.form.setRules(this.rules);
	},
	methods: {
		async getWorkorderList() {
			const data = await getWorkTicketTypeList();
			console.log('data :>> ', data);
			this.workOrderType=data.find(item => item.id===this.workOrderInfo.ticketTypeId)?.ticketType;
			console.log('this.workOrderType :>> ', this.workOrderType);
		},
		getWorkTicket(){
			getWorkTicket(this.workOrderInfo.id).then(res=>{
				console.log('res :>> ', res);
				if (res.id) {
					this.workOrderInfo = res;
				}
			})
		},
		submit() {
			this.$refs.form
				.validate()
				.then(res => {
					console.log('res :>> ', res);
					const ticketResultImages = this.form.fileListPic
						.map(item => {
							return item.url;
						})
						?.join();
					const ticketResultVideo = this.form.fileListVideo
						.map(item => {
							return item.url;
						})
						?.join();

					const ticketResultState = this.dealList[0].find(
						item => item.label === this.form.deal
					)?.value;

					const params = {
						id: this.workOrderInfo.id,
						ticketResultState,
						ticketResultContent: this.form.ticketResultContent,
						ticketResultImages,
						ticketResultVideo
					};
					closeWorkTicket(params).then(res => {
						uni.showToast({
							title: '提交成功'
						});
						setTimeout(() => {
							uni.$emit('refreshData_getUnfinishWorkorderList');
							uni.navigateBack();
						}, 1500);
					});
				})
				.catch(errors => {
					console.log(errors);
				});
		},
		onVideoInput(list) {
			console.log('list :>> ', list);
			this.showVideo = false;
		},
		/**
		 * 自动上传返回的是一张图片信息
		 * 手动上传返回的是已选中所有图片或者视频信息
		 * */

		onSuccess(result) {
			// 把服务端返回的图片地址添加到list中与组件数据同步
			console.log('result :>> ', result);
			this.form.fileListVideo.push(result.data.url);
		},
		// 删除图片
		deleteFile(event) {
			this.form[`fileList${event.name}`].splice(event.index, 1);
		},
		// 新增图片
		async afterRead(event) {
			// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
			console.error('1-event :>> ', event);
			let lists = [].concat(event.file);
			console.error('2-lists :>> ', lists);
			let fileListLen = this.form[`fileList${event.name}`].length;
			console.error('3-fileListLen :>> ', fileListLen);
			lists.map(item => {
				this.form[`fileList${event.name}`].push({
					...item,
					status: 'uploading',
					message: '上传中'
				});
			});
			for (let i = 0; i < lists.length; i++) {
				const result = await this.uploadFilePromise(lists[i].url, event.name);
				console.error('5-result :>> ', result);
				const fileListX = `fileList${event.name}`;
				let item = this.form[fileListX][fileListLen];
				this.form[`fileList${event.name}`].splice(
					fileListLen,
					1,
					Object.assign(item, {
						status: 'success',
						message: '',
						url: result.url
					})
				);
				fileListLen++;
				
				console.error('6-this.form :>> ', this.form);
			}
			if (event.name === 'Video') {
				this.showVideo = true;
				this.$refs.form.validateField('fileListVideo');
				console.error('7-event.name :>> ',event.name);
			} else {
				this.$refs.form.validateField('fileListPic');
			}
		},
		uploadFilePromise(url, type) {
			console.error('4-uploadFilePromise------------------');
			console.log('url :>> ', url);
			const headers = this.headers;
			console.log('headers :>> ', headers);
			return new Promise((resolve, reject) => {
				const uploadTask = uni.uploadFile({
					url: this.action, // 仅为示例，非真实的接口地址
					filePath: url,
					name: 'file',
					header: headers,
					formData: {
						folder: `workticket/pic/$day`
					},
					success: res => {
						console.log('upload-success!');
						console.log('res :>> ', res);
						const data = JSON.parse(res.data);
						console.log('data :>> ', data);
						resolve(data.data);
					}
				});

				uploadTask.onProgressUpdate(res => {
					// console.log('上传进度' + res.progress);
					// console.log('已经上传的数据长度' + res.totalBytesSent);
					// console.log(
					// 	'预期需要上传的数据总长度' + res.totalBytesExpectedToSend
					// );
				});
			});
		},
		onDealConfirm(e) {
			this.form.deal = e.value[0].label;
			this.form.ticketResultState = e.value[0].value;
			this.show1 = false;
		}
	}
};
</script>

<style lang="scss" scoped>
.page-processing-results {
	margin-top: 20rpx;
	.my-form {
		padding: 0 15px;
		background-color: #fff;
	}
	::v-deep {
		.u-form-item__body__left__content__label {
			margin-bottom: 5px;
			color: $txt-c-2;
		}
		.u-form-item__body__right {
			// margin-bottom: 20px;
		}
		.u-form-item__body__right__message {
			margin-left: 0 !important;
		}
		.u-form-item__body__left__content__required {
			left: auto;
			right: 0 !important;
		}
		.uicon-camera-fill {
			font-size: 46rpx !important;
		}
		.cl-updata {
			width: 100%;
		}
		.u-upload__wrap__preview__other {
			width: 200rpx !important;
			height: 200rpx !important;
		}
		.u-upload__deletable {
			height: 50rpx;
			width: 50rpx;
		}
		.u-upload__deletable__icon {
			transform: none !important;
		}
		.uicon-close {
			font-size: 20rpx !important;
			line-height: 38rpx !important;
			margin-right: 8rpx !important;
		}
	}
}
</style>
