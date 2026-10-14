// pages/station-master/station-master.js
import validate from '../../utils/validate.js';
import {
  areaList
} from '@vant/area-data';
import {
  openLocation
} from '../../utils/util.js';
// import { parse } from '../../utils/address-parse.js';4
import AddressParse from 'address-parse';

import {
  usePCS
} from '../../utils/PCS.js';
import {
  loginByOpenid
} from '../../wxapi/request.js';

const Citys = usePCS();

console.log('areaList-', areaList);

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showInfoCheck: false,
    optionsTariffL: 0,
    areaList,
    getSrc: wx.getSrc,
    menus: [{
        icon: wx.getSrc('/station-master/icon-1.png'),
        name: '企业',
      },
      {
        icon: wx.getSrc('/station-master/icon-2.png'),
        name: '特产店',
      },
      {
        icon: wx.getSrc('/station-master/icon-3.png'),
        name: '农产地',
      },
      {
        icon: wx.getSrc('/station-master/icon-4.png'),
        name: '超市',
      },
      {
        icon: wx.getSrc('/station-master/icon-5.png'),
        name: '学校',
      },
      {
        icon: wx.getSrc('/station-master/icon-6.png'),
        name: '酒店',
      },
      {
        icon: wx.getSrc('/station-master/icon-7.png'),
        name: '便名店',
      },
      {
        icon: wx.getSrc('/station-master/icon-8.png'),
        name: '烟酒店',
      },
    ],
    form: {
      name: '',
      phone: '',
      postNumber: '',
      printerNumber: '',
      pricePlanTemplate: '',
      ownerName: '',
      ownerPhone: '',
      siteName: '',
      PCD: '',
      addr: '',
      directPost: '',
    },
    PCD: '',
    nameErrMsg: null,
    phoneErrMsg: null,
    postNumberErrMsg: null,
    printerNumberErrMsg: null,
    pricePlanTemplateErrMsg: null,
    ltbErrMsg: null,
    ownerNameErrMsg: null,
    ownerPhoneErrMsg: null,
    siteNameErrMsg: null,
    siteTypeErrMsg: null,
    addrErrMsg: null,
    titleWidth: '200rpx',
    show1: false,
    siteType: '',
    SiteTypes: ['A站点', 'B站点'],
    checked: false,
    fileList: [],
    fileList2: [],
    maxSize: 1024 * 1024 * 5,
    showPopupTariff: false,
    optionsTariff: {
      EMS: [],
      EYB: [],
      POSTB: [],
    },
    selectedItemsTariff: null,
    selectedItemsTariff2: null,
    selectedItemsTariff3: null,
    pricePlanTemplate: null,
    allArr: [],
  },
  reSubmit() {
    wx.redirectTo({
      url: '/pages/station-master/station-master?id='+this.data.id,
    })
  },
  onSureInfo() {
    this.onCloseInfoCheck();
    this.submitFormAPI();
  },
  onCloseInfoCheck() {
    this.setData({
      showInfoCheck: false,
    });
  },
  onClickTariff(e) {
    console.log('e', e);
  },
  showPopupTariff() {
    if (this.data.PCD) {
      this.setData({
        showPopupTariff: true,
      });
    } else {
      wx.showToast({
        title: '先选择省市区/县',
        icon: 'none',
      });
    }
  },
  onCloseTariff() {
    this.setData({
      showPopupTariff: false,
    });
  },
  onChangeTariff(event) {
    console.log('event---', event);
    const name = event.detail;
    if (name === this.data.selectedItemsTariff) {
      // 强制视图更新方法
      this.setData({
        selectedItemsTariff: ''
      }); // 先设置一个非法的值或空字符串
      setTimeout(() => {
        this.setData({
          selectedItemsTariff: null
        }); // 再设置回null，希望此时视图能更新
      }, 10); // 延
    } else {
      // 否则，更新为新的选择
      this.setData({
        selectedItemsTariff: name
      });
    }
  },
  onChangeTariff2(event) {
    console.log('event---', event);
    const name = event.detail;
    if (name === this.data.selectedItemsTariff2) {
      // 强制视图更新方法
      this.setData({
        selectedItemsTariff2: ''
      }); // 先设置一个非法的值或空字符串
      setTimeout(() => {
        this.setData({
          selectedItemsTariff2: null
        }); // 再设置回null，希望此时视图能更新
      }, 10); // 延
    } else {
      // 否则，更新为新的选择
      this.setData({
        selectedItemsTariff2: name
      });
    }
  },
  onChangeTariff3(event) {
    console.log('event---', event);
    const name = event.detail;
    if (name === this.data.selectedItemsTariff3) {
      // 强制视图更新方法
      this.setData({
        selectedItemsTariff3: ''
      }); // 先设置一个非法的值或空字符串
      setTimeout(() => {
        this.setData({
          selectedItemsTariff3: null
        }); // 再设置回null，希望此时视图能更新
      }, 10); // 延
    } else {
      // 否则，更新为新的选择
      this.setData({
        selectedItemsTariff3: name
      });
    }
  },
  onClickTar1(e) {
    console.log('e', e);
    const {
      id
    } = e.currentTarget.dataset;
    if (this.data.selectedItemsTariff == id) {
      this.setData({
        selectedItemsTariff: null,
      });
    } else {
      this.setData({
        selectedItemsTariff: id,
      });
    }
  },
  onClickTar2(e) {
    console.log('e', e);
    const {
      id
    } = e.currentTarget.dataset;
    if (this.data.selectedItemsTariff2 == id) {
      this.setData({
        selectedItemsTariff2: null,
      });
    }
  },
  onClickTar3(e) {
    console.log('e', e);
    const {
      id
    } = e.currentTarget.dataset;
    if (this.data.selectedItemsTariff3 == id) {
      this.setData({
        selectedItemsTariff3: null,
      });
    }
  },
  confirmSelectionTariff() {
    this.setData({
      showPopupTariff: false,
    });
    const s1 = this.data.selectedItemsTariff;
    const s2 = this.data.selectedItemsTariff2;
    const s3 = this.data.selectedItemsTariff3;
    const EMS = this.data.optionsTariff.EMS;
    const EYB = this.data.optionsTariff.EYB;
    const POSTB = this.data.optionsTariff.POSTB;
    const target1 = EMS?.find(item => item.name === s1);
    const target2 = EYB?.find(item => item.name === s2);
    const target3 = POSTB?.find(item => item.name === s3);
    console.log('target1 :>> ', target1);
    console.log('target2 :>> ', target2);
    console.log('target3 :>> ', target3);
    const allArr2 = []
    if (target1) {
      allArr2.push(target1)
    }
    if (target2) {
      allArr2.push(target2)
    }
    if (target3) {
      allArr2.push(target3)
    }
    console.error('allArr2 :>> ', allArr2);
    this.setData({
      allArr: allArr2
    })
    const allArr = [s1, s2, s3].filter(item => item != null);
    const pricePlanTemplate = allArr.map(item => item)?.join('\n');
    this.setData({
      'form.pricePlanTemplate': allArr.map(item => item)?.join(','),
      pricePlanTemplate,
    });
  },
  onLoad(e) {
    console.log('1-station-master-onLoad------------- :>> ', e);
    // loginByOpenid();
    const {
      id
    } = e;
    console.log('id :>> ', id);
    if (id != 'undefined') {
      wx.api.common.siteDetail(id).then(res => {
        console.log('res', res)
        const data = res.data
        const remark = data.remark
        const siteNameDetail = data.siteNameDetail
        let errorMsg
        let ltb
        let siteName
        if (remark) {
          errorMsg = JSON.parse(remark)?.errorMsg
        }
        if (siteNameDetail) {
          ltb = JSON.parse(siteNameDetail)?.ltb
          siteName = JSON.parse(siteNameDetail)?.siteName
        }
        data.errorMsg = errorMsg
        data.ltb = ltb
        data.siteName = siteName
        this.setData({
          form: res.data,
          id
        })
      })
    }


    // "form": {
    //   "PCD": "320104",
    //   "addr": "梅家南路与中和桥路交叉口",
    //   "name": "test",
    //   "ownerName": "test",
    //   "ownerPhone": "18352517082",
    //   "phone": "18352517082",
    //   "postNumber": "012345678901234",
    //   "printerNumber": "012345678901234",
    //   "pricePlanTemplate": "EMS",
    //   "siteName": "123"
    // },
    const res = wx.getSystemInfoSync();
    console.log('res :>> ', res);
    console.log('res.platform :>> ', res.platform);

  },

  onShareAppMessage() {},
  onShareTimeline() {},

  onChangeDirectPost(e) {
    console.log('e :>> ', e);
    this.setData({
      'form.directPost': e.detail,
    });
  },

  submitForm() {
    const {
      name,
      phone,
      postNumber,
      printerNumber,
      pricePlanTemplate,
      ownerName,
      ownerPhone,
      siteName,
      addr,
      ltb,
      directPost,
    } = this.data.form;

    const {
      fileList,
      fileList2,
      PCD
    } = this.data;

    const {
      nameErrMsg,
      phoneErrMsg,
      postNumberErrMsg,
      printerNumberErrMsg,
      pricePlanTemplateErrMsg,
      ownerNameErrMsg,
      ownerPhoneErrMsg,
      siteNameErrMsg,
      siteTypeErrMsg,
      addrErrMsg,
      ltbErrMsg,
    } = this.data;

    const ErrMsgs = [
      nameErrMsg,
      phoneErrMsg,
      postNumberErrMsg,
      printerNumberErrMsg,
      pricePlanTemplateErrMsg,
      ownerNameErrMsg,
      ownerPhoneErrMsg,
      siteNameErrMsg,
      siteTypeErrMsg,
      addrErrMsg,
      ltbErrMsg,
    ];

    const hasErrMsg = ErrMsgs.some(item => item);

    if (!name) {
      return wx.showToast({
        icon: 'none',
        title: '请输入组织内小件员姓名',
      });
    }
    if (!phone) {
      return wx.showToast({
        icon: 'none',
        title: '请输入组织内小件员手机号',
      });
    }
    if (!postNumber) {
      return wx.showToast({
        icon: 'none',
        title: '请输入邮政机构编号',
      });
    }
    if (!printerNumber) {
      return wx.showToast({
        icon: 'none',
        title: '请输入打印机编号',
      });
    }
    if (!pricePlanTemplate) {
      return wx.showToast({
        icon: 'none',
        title: '请选择资费套餐',
      });
    }
    if (!ltb) {
      return wx.showToast({
        icon: 'none',
        title: '请输入揽投部名称',
      });
    }

    if (!ownerName) {
      return wx.showToast({
        icon: 'none',
        title: '请输入店主姓名',
      });
    }
    if (!ownerPhone) {
      return wx.showToast({
        icon: 'none',
        title: '请输入店主手机号',
      });
    }
    if (!siteName) {
      return wx.showToast({
        icon: 'none',
        title: '请输入站点名称',
      });
    }
    if (!PCD) {
      return wx.showToast({
        icon: 'none',
        title: '请选择省市区',
      });
    }
    if (!addr) {
      return wx.showToast({
        icon: 'none',
        title: '请输入详细地址',
      });
    }

    if (hasErrMsg) {
      return wx.showToast({
        icon: 'none',
        title: '校验未通过，请检查',
        duration: 3000,
      });
    }

    if (!this.data.checked) {
      return wx.showToast({
        icon: 'none',
        title: '请勾选《物品托管协议》',
        duration: 3000,
      });
    }
    // this.submitFormAPI();
    // 弹出信息核对
    this.setData({
      showInfoCheck: true,
    });
  },

  submitFormAPI() {
    const {
      name,
      phone,
      postNumber,
      printerNumber,
      pricePlanTemplate,
      ownerName,
      ownerPhone,
      siteName,
      addr,
      ltb,
      directPost,
    } = this.data.form;

    const {
      fileList,
      fileList2,
      PCD
    } = this.data;

    const {
      province,
      city,
      area: district
    } = AddressParse.parse(PCD)[0];

    const formData = {
      // 投递员姓名
      deliveryName: name,
      // 投递员手机号
      deliveryMobile: phone,
      // 邮政机构编号
      postalNumber: postNumber,
      // 打印机编号
      printerId: printerNumber,
      // 产品类型
      pricePlanTemplate,
      // 店主姓名
      siteUserName: ownerName,
      // 店主手机号
      siteUserMobile: ownerPhone,
      // 站点名称
      siteName: province + city + district + ltb + siteName,
      // 省市区
      positionAddress: JSON.stringify({
        province,
        city,
        district,
      }),
      // 详细地址
      positionDetail: addr,
      // 门头照图片url地址
      frontDoorUrl: fileList[0]?.url,
      // 营业执照图片url地址
      businessLicenseUrl: fileList2[0]?.url,
      directPost,
    };

    console.log('formData :>> ', formData);
    wx.showLoading({
      title: '提交中...',
    });
    wx.api.common
      .siteRegister(formData)
      .then(res => {
        console.log('res :>> ', res);
        wx.showToast({
          title: '注册成功！',
        });
        setTimeout(() => {
          wx.hideToast();
          wx.showModal({
            title: '已提交激活中',
            content: '预计1-5分钟告知激活结果，请耐心等待',
            showCancel: true,
            cancelText: '再填一份',
            cancelColor: '#000000',
            confirmText: '查看记录',
            confirmColor: '#3CC51F',
            success: result => {
              console.log('result :>> ', result);
              if (!result.confirm) {
                wx.redirectTo({
                  url: '/pages/station-master/station-master',
                });
              }
            },
            fail: () => {},
            complete: () => {},
          });
        }, 800);
      })
      .catch(() => {});
  },

  onCheckedChange(e) {
    console.log('e :>> ', e);
    this.setData({
      checked: e.detail,
    });
  },
  showProtocol() {
    this.setData({
      protocol: true,
    });
  },
  onClosePop2() {
    this.setData({
      protocol: false,
    });
  },

  onChangeSiteType(e) {
    console.log('e :>> ', e);
  },
  onChange1(e) {
    console.log('e :>> ', e);
    // const arr = e.detail.values;
    // const [province, city, area] = arr;
    // const PCD = province.name + city.name + area.name;
    // console.log('PCD :>> ', PCD);
    // this.setData({
    //   PCD0:PCD,
    //   'form.PCD0':area.code
    // })
  },
  queryPCList() {
    const {
      province,
      city,
      district
    } = this.data.pc;
    console.log('province :>> ', province);
    console.log('city :>> ', city);
    wx.api.common
      .getPriceTemplate({
        province,
        city,
        district,
      })
      .then(res => {
        console.log('res :>> ', res);
        const object = res.data;
        const optionsTariffL = Object.keys(res.data)?.length || 0;
        this.setData({
          optionsTariff: object,
          optionsTariffL,
        });
      });
  },
  onConfirm1(e) {
    console.log('e :>> ', e);
    const arr = e.detail.values;
    const [province, city, area] = arr;
    const isUndefined = [undefined, 'undefined'].includes(area?.name);
    const name = isUndefined ? '' : area?.name;
    // 更新选中的地区值
    const PCD = province.name + city.name + name;
    console.log('PCD :>> ', PCD);
    console.log('area :>> ', area);
    this.setData({
      PCD,
      pc: {
        province: province.name,
        city: city.name,
        district: name,
      },
      'form.PCD': area?.code,
      'form.pricePlanTemplate': null,
      'form.selectedItemsTariff': null,
      'form.selectedItemsTariff2': null,
      'form.selectedItemsTariff3': null,
      selectedItemsTariff: null,
      selectedItemsTariff2: null,
      selectedItemsTariff3: null,
      pricePlanTemplate: null,
    });
    console.log('this.data.form :>> ', this.data.form);
    this.onClose1();
    this.queryPCList();
  },

  openLocation() {
    wx.showLoading({
      title: '加载中...',
    });
    const that = this;
    wx.chooseLocation({
      success(res) {
        console.log('res :>> ', res);
        const {
          address
        } = res;
        console.log(address);
        const result = AddressParse.parse(address)[0];
        const {
          province,
          city,
          area,
          details
        } = result;
        const areaCode = that.getAreaCode({
          province,
          city,
          area,
        });
        console.log('result', result);

        const p0 = {
          name: province,
        };
        const p1 = {
          name: city,
        };
        const p2 = {
          name: area,
          code: areaCode,
        };
        that.onConfirm1({
          detail: {
            values: [p0, p1, p2],
          },
        });
        that.setData({
          areaCode,
          'form.addr': details,
        });
        wx.hideLoading();
      },
      fail(e) {
        console.error(e);
      },
    });
  },

  afterRead(event) {
    console.log('event :>> ', event);
    const {
      file
    } = event.detail;
    wx.api.common.uploadFile(file.url).then(url => {
      this.setData({
        fileList: [{
          name: 'xx',
          url,
        }, ],
      });
    });
  },
  afterRead2(event) {
    const {
      file
    } = event.detail;
    wx.api.common.uploadFile(file.url).then(url => {
      this.setData({
        fileList2: [{
          name: 'xx',
          url,
        }, ],
      });
    });
  },

  beforeRead(e) {
    const {
      file,
      callback
    } = e.detail;
    console.log('file :>> ', file);
    if (file.size > this.data.maxSize) {
      return wx.showToast({
        icon: 'none',
        title: '图片不能大于5MB',
        duration: 3000,
      });
    }
    callback(true);
  },

  onDel(e) {
    console.log('e :>> ', e);
    this.setData({
      fileList: [],
    });
  },
  onDel2(e) {
    console.log('e :>> ', e);
    this.setData({
      fileList2: [],
    });
  },

  onClose1(e) {
    this.setData({
      show1: false,
    });
  },

  onClickSiteType() {
    this.setData({
      show1: true,
    });
  },

  checkName() {
    console.log('this.data.form.name :>> ', this.data.form.name);
    if (!this.data.form.name) {
      this.setData({
        nameErrMsg: '请输入姓名',
      });
    } else if (this.data.form.name.toString().length >= 45) {
      this.setData({
        nameErrMsg: '姓名过长',
      });
    } else {
      this.setData({
        nameErrMsg: null,
      });
    }
  },
  checkOwnerName() {
    let msg = null;
    if (!this.data.form.ownerName) {
      msg = '请输入姓名';
    } else if (this.data.form.ownerName.toString().length >= 45) {
      msg = '姓名过长';
    }

    this.setData({
      ownerNameErrMsg: msg,
    });
  },
  checkPhone() {
    const phone = this.data.form.phone;
    let msg = null;
    if (!phone) {
      msg = '请输入手机号';
    } else if (!validate.phone.test(phone)) {
      msg = '请输入正确的手机号格式';
    }
    this.setData({
      phoneErrMsg: msg,
    });
  },
  checkOwnerPhone() {
    const phone = this.data.form.ownerPhone;
    let msg = null;
    if (!phone) {
      msg = '请输入手机号';
    } else if (!validate.phone.test(phone)) {
      msg = '请输入正确的手机号格式';
    }
    this.setData({
      ownerPhoneErrMsg: msg,
    });
  },
  checkPostNumber() {
    const postNumber = this.data.form.postNumber;
    let msg = null;
    if (!postNumber) {
      msg = '请输入邮政机构编码';
    }
    if (!validate.number.test(postNumber)) {
      msg = '请输入纯数字';
    }
    this.setData({
      postNumberErrMsg: msg,
    });
  },
  checkPrinterNumber() {
    function isValidNumber(str) {
      const pattern = /^86\d{13}$/;
      return pattern.test(str);
    }
    const printerNumber = this.data.form.printerNumber;
    let msg = null;
    if (!printerNumber) {
      msg = '请输入打印机编号';
    }
    if (!isValidNumber(printerNumber)) {
      msg = '请输入86开头的15位数字';
    }
    this.setData({
      printerNumberErrMsg: msg,
    });
  },
  checkpricePlanTemplate() {
    const pricePlanTemplate = this.data.form.pricePlanTemplate;
    let msg = null;
    if (!pricePlanTemplate) {
      msg = '请选择资费套餐';
    }
    this.setData({
      pricePlanTemplateErrMsg: msg,
    });
  },
  checkSiteName() {
    const {
      siteName
    } = this.data.form;
    let msg = null;
    if (!siteName) {
      msg = '请输入站点名称';
    }
    this.setData({
      siteNameErrMsg: msg,
    });
  },
  checkltb() {
    const {
      ltb
    } = this.data.form;
    let msg = null;
    if (!ltb) {
      msg = '请输入揽投部名称';
    }
    this.setData({
      ltbErrMsg: msg,
    });
  },
  checkAddr() {
    const {
      addr
    } = this.data.form;
    let msg = null;
    if (!addr) {
      msg = '请输入详细地址';
    }
    this.setData({
      addrErrMsg: msg,
    });
  },

  getSrc(src) {
    return wx.getSrc(src);
  },

  onChange(event) {
    // event.detail 为当前输入的值
    console.log('event :>> ', event);
    const name = event.currentTarget.dataset.name;
    console.log('name :>> ', name);
    const key = `form.${name}`;
    console.log('key :>> ', key);
    this.setData({
      [key]: event.detail,
    });
    console.log('this.data.form :>> ', this.data.form);
  },
  getAreaCode({
    province,
    city,
    area
  }) {
    const municipality = ['北京', '上海', '天津', '重庆'];
    const provinceChildren = Citys.find(
      item =>
      item.label ==
      (municipality.find(name => name === province) ?
        province + '市' :
        province)
    ).children;

    console.log('provinceChildren', provinceChildren);

    const cityChildren = provinceChildren.find(
      item => item.label == city
    ).children;
    console.log('cityChildren', cityChildren);
    const areaChildren = cityChildren?.find(item => item.label == area);
    console.log('areaChildren', areaChildren);
    const areaCode = areaChildren?.value;
    if (!areaCode) {
      wx.showToast({
        title: '请选择县/区',
        icon: 'none',
        duration: 3000,
      });
    }
    return areaCode;
  },
  onShow(e) {
    console.log('station-master-onShow------------- :>> ', e);
    const printerId = getApp().globalData.printerId;
    console.log('printerId :>> ', printerId);
    if (printerId) {
      this.setData({
        'form.printerNumber': printerId,
      });
    } else {
      console.error('printerId为' + printerId);
    }
  },
  onShare() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage'],
    });
  },
});