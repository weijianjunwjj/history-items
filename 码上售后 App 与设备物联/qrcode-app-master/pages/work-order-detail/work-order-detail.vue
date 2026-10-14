<template>
	<view class="page-work-order-detail">
		<work-order-progress-mod className="mtb-2" :current="workOrderInfo.ticketState" />

		<responsible-engineer-mod
			v-if="workOrderInfo.ticketState >= 1"
			className="mtb-2 plr-3"
			:info="workOrderInfo"
		/>

		<related-device-mod className="mtb-2" :info="workOrderInfo" />

		<processing-results-mod
			className="mtb-2 plr-3 pb-3 bg-white"
			:info="workOrderInfo"
			v-if="workOrderInfo.ticketState >= 2"
		/>

		<work-order-info-mod
			v-if="workOrderInfo.ticketState >= 3"
			className="mtb-2 plr-3 pb-3 bg-white"
			:info="workOrderInfo"
			:workOrderType="workOrderType"
		/>
	</view>
</template>

<script>
import { getWorkTicketTypeList, getWorkTicket } from '@/config/api.js';
export default {
	data() {
		return {
			workOrderType: '',
			workOrderInfo: {}
		};
	},
	onLoad(options) {
		const workOrderInfo = JSON.parse(options.workOrderInfo);
		console.log('workOrderInfo :>> ', workOrderInfo);
		this.workOrderInfo = workOrderInfo;
		this.getWorkorderList();
		this.getWorkTicket();
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
		}
	}
};
</script>

<style lang="scss"></style>
