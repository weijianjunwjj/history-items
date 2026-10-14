import { debounce, throttle, unique_obj_arr } from '../../utils/util.js';
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isEmpty: false,
    searchValue: undefined,
    editIcon:
      'https://zyt-network.oss-cn-qingdao.aliyuncs.com/images/address-book/edit.png',
    addressList: [],
    result: [],
    type: null,
    params: {
      pageNum: 1,
      pageSize: 10,
    },
    loading: false,
  },

  onclickAddressItem(event) {
    const { index } = event.currentTarget.dataset;
    const addressData = this.data.addressList[index];
    addressData.type = this.data.type;
    const emitType = this.data.emitType;
    if (emitType == 1) {
      app.$bus.emit('onAddressData', addressData);
      setTimeout(() => {
        wx.navigateBack();
      }, 50);
    }
    if (emitType == 2) {
      app.$bus.emit('onAddressData2', addressData);
      setTimeout(() => {
        wx.navigateBack();
      }, 50);
    }
  },

  onRemovex: debounce(function () {
    if (!this.data.result.length) {
      return wx.showToast({
        icon: 'none',
        title: '请选择地址',
      });
    }
    let { result: ids } = this.data;
    ids = ids.join(',');
    console.log('ids :>> ', ids);
    wx.showLoading({
      title: '删除中...',
    });
    wx.api.address
      .addressDelete({
        ids,
      })
      .then(res => {
        console.log('res :>> ', res);
        if (res.code == 0) {
          wx.showToast({
            title: '删除成功',
          });
          setTimeout(() => {
            this.init('', true);
            app.$bus.emit('onDelAddressData', ids);
          }, 300);
        }
      })
      .finally(() => {
        wx.hideLoading();
      });
  }, 300),

  onChange(event) {
    console.log('event.detail :>> ', event.detail);
    this.setData({
      result: event.detail,
    });
  },

  onEditBook(e) {
    console.log('e :>> ', e);
    const id = e.currentTarget.dataset.id;
    console.log('id :>> ', id);
    wx.navigateTo({
      url: '/pages/new-address/new-address?edit=1&id=' + id,
    });
  },

  toggle(event) {
    const { index } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },

  goNewAddress() {
    console.log('newAddress---');
    console.log('this.data.type :>> ', this.data.type);
    wx.navigateTo({
      url: `/pages/new-address/new-address?type=${this.data.type}&clear=1`,
    });
  },

  noop() {
    console.log('noop');
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(_options) {
    const options = _options || {};
    console.log('options :>> ', options);
    const type = options.type;
    const emitType = options.emitType;
    this.setData({
      type,emitType
    });
  },
  onShow() {
    this.setData({
      params: {
        pageNum: 1,
        pageSize: 10,
      },
      addressList: [],
    });
    this.init('', true);
  },
  onSearch: throttle(function (e) {
    const val = e.detail;
    this.init(val, true);
  }, 300),
  async init(information = '', noPage = false) {
    wx.showLoading({
      title: '加载中...',
    });
    let params = { information };
    console.log('noPage :>> ', noPage);
    if (!noPage) {
      params = { ...params, ...this.data.params };
    }
    const { data } = await wx.api.address.selectAddress(this.data.type, params);

    console.log('data :>> ', data);
    let addressList = [];
    if (!noPage) {
      addressList = [...this.data.addressList, ...data.rows];
    } else {
      addressList = data.rows;
    }
    console.log('addressList :>> ', addressList);
    this.setData({
      isEmpty: !addressList.length,
      addressList,
      total: data.total,
    });
    wx.hideLoading();
    this.setData({
      loading: false,
    });
  },

  loadMore() {
    if (this.data.loading) {
      return;
    }
    const pageNum = +this.data.params.pageNum;
    console.log('pageNum :>> ', pageNum);
    const totalNum = +this.data.total / +this.data.params.pageSize;
    console.log('totalNum :>> ', totalNum);
    if (pageNum > totalNum) {
      return wx.showToast({
        icon: 'none',
        title: '到底了~',
      });
    }
    this.setData({
      loading: true,
    });
    const num = +this.data.params.pageNum + 1;
    this.setData({
      'params.pageNum': num,
    });
    this.init();
  },

  onReachBottom() {
    this.loadMore();
  },
});
