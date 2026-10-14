<template>
	<view class="page-work-order-assignment">
		<view class="form-view">
			<u--form :model="form" ref="form" class="my-form">
				<u-form-item
					label="负责工程师"
					required
					prop="engineer"
					labelPosition="top"
					labelWidth="170"
					@click="show2 = true"
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
					<u-button type="primary" class="btn mb-4" @click="submit">
						提交
					</u-button>
				</u-form-item>
			</u--form>
		</view>

		<work-order-progress-mod className="mtb-2" :current="workOrderInfo.ticketState" />

		<related-device-mod className="mtb-2" :info="workOrderInfo" />

		<work-order-info-mod
			className="mtb-2 plr-3 pb-3 bg-white"
			:info="workOrderInfo"
			:workOrderType="workOrderType"
		/>

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
	getEngineerList,
	dispatchWorkTicket,
	getWorkTicketTypeList,
	getWorkTicket
} from '@/config/api.js';
export default {
	data() {
		return {
			engineers0: [],
			engineers: [[]],
			show2: false,
			workOrderType: '',
			workOrderInfo: {},
			form: {
				engineer: '',
				handlingMethod: ''
			},
			rules: {
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
	onLoad(opts) {
		const workOrderInfo = JSON.parse(opts.workOrderInfo);
		console.log('workOrderInfo :>> ', workOrderInfo);
		this.workOrderInfo = workOrderInfo;
		this.getEngineers();
		this.getWorkorderList();
		this.getWorkTicket();
	},
	onReady() {
		//onReady 为uni-app支持的生命周期之一
		this.$refs.form.setRules(this.rules);
	},
	methods: {
		getWorkTicket() {
			getWorkTicket(this.workOrderInfo.id).then(res => {
				console.log('res :>> ', res);
				if (res.id) {
					this.workOrderInfo = res;
				}
			});
		},
		async getWorkorderList() {
			const data = await getWorkTicketTypeList();
			console.log('data :>> ', data);
			this.workOrderType = data.find(
				item => item.id === this.workOrderInfo.ticketTypeId
			)?.ticketType;
			console.log('this.workOrderType :>> ', this.workOrderType);
		},
		submit() {
			this.$refs.form
				.validate()
				.then(res => {
					const engineerId = this.engineers0.find(
						item => item.nickName === this.form.engineer
					)?.userId;
					const params = {
						id: this.workOrderInfo.id,
						engineerId,
						ticketRecommend: this.form.handlingMethod
					};
					dispatchWorkTicket(params).then(res => {
						console.log('res :>> ', res);
						uni.$u.toast('分配成功');
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
		onEngineerConfirm(e) {
			console.log('e :>> ', e);
			this.form.engineer = e.value[0];
			this.show2 = false;
		},
		onEngineerCancel(e) {
			console.log('e :>> ', e);
			this.show2 = false;
		}
	}
};
</script>

<style lang="scss" scoped>
.page-work-order-assignment {
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
