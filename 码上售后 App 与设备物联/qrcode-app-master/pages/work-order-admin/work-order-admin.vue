<template>
	<view class="page-work-order-admin">
		<ren-dropdown-filter
			:filterData="filterData"
			:defaultIndex="defaultIndex"
			@onSelected="onSelected"
		></ren-dropdown-filter>

		<scroll-list
			ref="list"
			:option="option"
			top="67px"
			height="calc(100vh - 75px)"
			@load="loadmore"
			@refresh="refresh"
		>
			<view class="u-list-item" v-for="(item, index) in list" :key="index">
				<div class="u-list-item-div flex-vc" @click="workOrderJump(item)">
					<div class="u-list-item-div-top flex-c pt-3 pb-3">
						<u--image
							:showLoading="true"
							:src="item.deviceImage"
							width="40px"
							height="40px"
						></u--image>
						<div class="ml-2 txt-1">
							<div class="fs-18 mb-1">{{ item.deviceSn }}</div>
							<div class="fs-16">{{ item.deviceName }}</div>
						</div>
						<span
							class="status-mod"
							:class="statusMapper[item.ticketState].className"
						>
							{{ statusMapper[item.ticketState].text }}
						</span>
					</div>

					<div class="div-border"></div>

					<div class="u-list-item-div-bottom">
						<div class="fs-12" v-if="workTicketTypeList.length">
							<div class="txt-2">工单类型：</div>
							<div class="txt-1">
								{{ getTicketType(item, workTicketTypeList) }}
							</div>
						</div>

						<div class="fs-12">
							<div class="txt-2">问题描述：</div>
							<div class="txt-1">{{ item.ticketContent }}</div>
						</div>

						<div class="fs-12">
							<div class="txt-2">报修人：</div>
							<div class="txt-1">{{ item.reporterPhone }}</div>
						</div>
						<div class="fs-12">
							<div class="txt-2">报修时间：</div>
							<div class="txt-1">{{ item.createTime }}</div>
						</div>

						<div class="fs-12" style="margin-bottom: 24rpx">
							<div class="txt-2 fs-12">设备归属：</div>
							<div class="txt-1">{{ item.deviceCustomer }}</div>
						</div>
					</div>
				</div>
			</view>
		</scroll-list>
	</view>
</template>

<script>
import { statusCall, statusMapper } from '@/utils/data.js';
import { getWorkorderList, getWorkTicketTypeList } from '@/config/api.js';
import { workOrderJump } from '@/utils/uniapp.js';
import { getTicketType } from '@/utils';

export default {
	data() {
		return {
			option: {
				auto: true
			},
			loading: true,
			searchParams: {},
			list: [],
			status: 'loadmore',
			loadingText: '努力加载中',
			loadmoreText: '轻轻上拉',
			nomoreText: '没有更多数据了',
			showMore: false,
			pageNum: 0,
			pageSize: uni.pageSize,
			statusCall,
			statusMapper,
			filterData: [
				[
					{ text: '全部来源', value: '' },
					{ text: '指派给我的', value: 1 },
					{ text: '我创建的', value: 2 },
					{ text: '客户创建的', value: 3 }
				],
				[
					{ text: '全部状态', value: '' },
					{ text: '待派工', value: 1 },
					{ text: '处理中', value: 2 },
					{ text: '已完成', value: 3 }
				]
			],
			defaultIndex: [0, 0],
			workTicketTypeList: []
		};
	},
	mounted() {
		this.init();
		// this.$refs.list.show_loading()
		uni.$on('refreshData_getUnfinishWorkorderList', () => {
			this.refresh();
		});
	},
	onShow() {},
	onHide() {},
	methods: {
		init() {
			this.getWorkTicketTypeList();
		},
		async getWorkTicketTypeList() {
			const data = await getWorkTicketTypeList();
			this.workTicketTypeList = data;
			console.log('this.workTicketTypeList :>> ', this.workTicketTypeList);
		},
		getTicketType,
		workOrderJump,
		refresh() {
			this.pageNum = 1;
			this.getList('refresh')
				.then(data => {
					this.$refs.list.refreshSuccess(data);
				})
				.catch(() => {
					this.$refs.list.refreshFail();
				});
		},
		getList(type) {
			return new Promise((resolve, reject) => {
				const { pageSize, pageNum } = this;
				const params = {
					pageSize,
					pageNum,
					...this.searchParams
				};

				getWorkorderList(params)
					.then(res => {
						const { items, total } = res;
						if (type == 'refresh') {
							this.list = items;
						} else {
							this.list = [...this.list, ...items];
						}
						// 刷新成功  参数对象{list: 当前列表,total: 数据总长度(后端查询的total)}
						const data = { list: this.list, total };
						resolve(data);
					})
					.catch(() => {
						// 刷新失败  参数对象{list: 当前列表,total: 数据总长度(后端查询的total)}
						reject();
					});
			});
		},
		loadmore(params) {
			this.pageNum = ~~this.pageNum + 1;
			this.getList(params)
				.then(data => {
					this.$refs.list.loadSuccess(data);
				})
				.catch(() => {
					this.$refs.list.loadFail();
				});
		},
		onSelected(obj) {
			const { data } = obj;
			const params = {};
			const sort1 = data[0][0];
			const sort2 = data[1][0];
			const sort1Key = {
				1: 'engineerId',
				2: 'createBy',
				3: 'source'
			};
			const userId = uni.getStorageSync('userinfo').user.userId;
			const sort1Val = {
				engineerId: userId,
				createBy: userId,
				source: sort1.value
			};
			console.log('sort1 :>> ', sort1);
			if (sort1.value) {
				const key = sort1Key[sort1.value];
				if (key === 'engineerId') {
					this.searchParams.engineerId = userId;
					this.searchParams.createBy = undefined;
					this.searchParams.source = undefined;
				}
				if (key === 'createBy') {
					this.searchParams.createBy = userId;
					this.searchParams.engineerId = undefined;
					this.searchParams.source = undefined;
				}
				if (key === 'source') {
					this.searchParams.source = 1;
					this.searchParams.engineerId = undefined;
					this.searchParams.createBy = undefined;
				}
			} else {
				this.searchParams.engineerId = undefined;
				this.searchParams.createBy = undefined;
				this.searchParams.source = undefined;
			}
			if (sort2.value) {
				this.searchParams.ticketState = sort2.value;
			} else {
				this.searchParams.ticketState = undefined;
			}
			this.pageNum = 0;
			this.list = [];
			this.$refs.list.show_loading()
			this.loadmore(params);
		}
	}
};
</script>

<style lang="scss" scoped>
.my-list-class {
	height: calc(100vh - 60px) !important;
}
.page-work-order-admin {
	._rel {
		padding-top: 10px;
		top: 57px;
		position: relative;
	}
	.u-list {
		// @extend .rel;
		// height: calc(100vh - 60px) !important;
		&-item {
			margin-left: 15px;
			margin-right: 15px;
			&:not(:first-child) {
				margin-top: 10px;
			}
			&-div {
				position: relative;
				padding-left: 20rpx;
				padding-right: 20rpx;
				background-color: #ffffff !important;
				border-radius: 4px 4px 4px 4px;
				&-top {
					width: 100%;
					height: 88rpx;
					.status-mod {
						position: absolute;
						top: 0;
						right: 0;
						width: 52px;
						height: 20px;
						line-height: 20px;
						border-radius: 0px 4px 0px 4px;
						font-size: 12px;
						text-align: center;
					}
				}
				&-bottom {
					width: 100%;
					> div {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-top: 24rpx;
					}
				}
			}
		}
	}
}
</style>
