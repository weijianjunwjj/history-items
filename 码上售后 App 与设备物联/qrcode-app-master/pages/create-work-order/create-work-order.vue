<template>
	<view class="page-create-work-order">
		<u--form :model="form" ref="form" class="my-form">
			<u-form-item
				label="工单类型"
				required
				prop="workOrderType"
				labelPosition="top"
				labelWidth="140"
				@click="onShow1"
			>
				<u-input
					v-model="form.workOrderType"
					placeholder="请选择工单类型"
					:disabled="true"
					suffixIcon="arrow-down"
					suffixIconStyle="color: #909399"
					customStyle="background:#fff"
				/>
			</u-form-item>

			<u-form-item
				label="问题描述"
				required
				prop="problemDes"
				labelPosition="top"
				labelWidth="140"
			>
				<u-textarea
					v-model="form.problemDes"
					height="120"
					placeholder="请输入您所遇到的问题"
				></u-textarea>
			</u-form-item>

			<u-form-item
				label="负责工程师"
				labelPosition="top"
				labelWidth="170"
				@click="onShow2"
			>
				<u-input
					v-model="form.engineer"
					placeholder="请选择负责工程师"
					:disabled="true"
					suffixIcon="arrow-down"
					suffixIconStyle="color: #909399"
					customStyle="background:#fff"
				/>
			</u-form-item>

			<u-form-item label="建议处理方式" labelPosition="top" labelWidth="220">
				<u-textarea
					v-model="form.handlingMethod"
					height="120"
					placeholder="请输入您认为合适的处理方式"
				></u-textarea>
			</u-form-item>

			<u-form-item>
				<u-button type="primary" class="btn mb-4" @click="submit">提交</u-button>
			</u-form-item>
		</u--form>


		<related-device-mod className="mtb-2" :info="deviceInfo" />

		<repairer-mod className="mt-2 mb-6" :info="deviceInfo" />

		<u-picker
			:show="show1"
			itemHeight="66"
			:columns="workOrderType"
			@confirm="onWorkOrderTypeConfirm"
			@cancel="onWorkOrderTypeCancel"
		></u-picker>

		<u-picker
			:show="show2"
			itemHeight="66"
			:columns="engineers"
			@confirm="onEngineerConfirm"
			@cancel="onEngineerCancel"
		></u-picker>
	</view>
</template>

<script>
import {
	getWorkorderList,
	getWorkTicketTypeList,
	getEngineerList,
	addWorkTicket
} from '@/config/api.js';
export default {
	data() {
		return {
			deviceInfo: {},
			show1: false,
			show2: false,
			workOrderType0: [],
			workOrderType: [[]],
			engineers0: [],
			engineers: [[]],
			form: {
				workOrderType: '',
				problemDes: '',
				engineer: '',
				handlingMethod: ''
			},
			rules: {
				workOrderType: [
					{
						required: true,
						message: '请选择工单类型',
						trigger: ['blur', 'change']
					}
				],
				problemDes: [
					{
						required: true,
						message: '请填写问题描述',
						trigger: ['blur', 'change']
					}
				],
				engineer: [
					{
						required: true,
						message: '请选择负责工程师',
						trigger: ['blur', 'change']
					}
				]
			}
		};
	},
	onLoad(option) {
		this.getWorkorderList();
		this.getEngineers();
		const deviceInfo = JSON.parse(option.deviceInfo);
		console.log('deviceInfo :>> ', deviceInfo);
		this.deviceInfo = deviceInfo;
	},
	onReady() {
		//onReady 为uni-app支持的生命周期之一
		this.$refs.form.setRules(this.rules);
	},
	methods: {
		onEngineerConfirm(e) {
			console.log('e :>> ', e);
			this.form.engineer = e.value[0];
			this.show2 = false;
		},
		onEngineerCancel(e) {
			console.log('e :>> ', e);
			this.show2 = false;
		},
		onWorkOrderTypeConfirm(e) {
			console.log('e :>> ', e);
			this.form.workOrderType = e.value[0];
			this.show1 = false;
		},
		onWorkOrderTypeCancel(e) {
			console.log('e :>> ', e);
			this.show1 = false;
		},
		async getWorkorderList() {
			const data = await getWorkTicketTypeList();
			console.log('data :>> ', data);
			const labels = data.map(_ => _.ticketType);
			console.log('labels :>> ', labels);
			this.workOrderType0 = data;
			this.workOrderType = [labels];
			console.log('this.workOrderType :>> ', this.workOrderType);
		},
		async getEngineers() {
			const data = await getEngineerList();
			const arr0 = [];
			const arr = [];
			data.forEach(item => {
				arr0.push({
					...item,
					label: item.nickName,
					value: item.userId
				});
				arr.push(item.nickName);
			});
			this.engineers0 = arr0;
			this.engineers = [arr];
		},
		onShow1() {
			this.show1 = true;
		},
		onShow2() {
			this.show2 = true;
		},
		submit() {
			this.$refs.form
				.validate()
				.then(res => {
					const ticketTypeId = this.workOrderType0.find(
						item => item.ticketType === this.form.workOrderType
					)?.id;
					const engineerId = this.engineers0.find(
						item => item.nickName === this.form.engineer
					)?.userId;
					const params = {
						ticketTypeId,
						ticketType: 'DEVICE_FAULT',
						ticketContent: this.form.problemDes,
						engineerId,
						ticketRecommend: this.form.handlingMethod,
						faceTimeRecordId:this.deviceInfo.id
					};
					addWorkTicket(params).then(res => {
						console.log('res :>> ', res);
						uni.$u.toast('创建成功');
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/work-order-admin/work-order-admin'
							});
						}, 500);
					});
				})
				.catch(errors => {
					console.log(errors);
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.page-create-work-order {
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
	}
}
</style>
