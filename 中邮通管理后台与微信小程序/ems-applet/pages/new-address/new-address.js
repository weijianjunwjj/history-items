// pages/new-address/new-address.js
import { areaList } from '@vant/area-data';
import {
  reverseArrayKeyValues,
  debounce,
  openLocation,
  getPhoneNumber,
  getUserProfile,
} from '../../utils/util.js';
import validate from '../../utils/validate.js';
import { usePCS } from '../../utils/PCS.js';
import AddressParse from 'address-parse';

const Citys = usePCS();
const areaList2 = JSON.parse(JSON.stringify(areaList));
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    form: {
      name: '',
      phone: '',
      pcr: '',
      address: '',
    },
    nameErrMsg: '',
    phoneErrMsg: '',
    addressErrMsg: '',
    isSubmit: false,
    disabledAddr: false,
    show: false,
    searchCity: '',
    hotCitys: ['北京', '上海', '广州', '成都', '深圳', '杭州', '西安', '南京'],
    areaList,
    btnGroup1: undefined,
    autosize: {
      maxHeight: 100,
      minHeight: 50,
    },
    show2: false,
    actions: [
      {
        id: 1,
        name: '拍照',
      },
      {
        id: 2,
        name: '从手机相册选择',
      },
    ],
    btnName: '保存',
    loading: false,
    pcrValue: [110101],
    edit: 0,
    id: null,
    saveAddrChecked: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(_options) {
    const options = _options || {};
    const { type, edit, id, addrDefault, editUnsaveAddr } = options;
    console.log('edit :>> ', edit);
    this.setData({
      edit,
      id,
      type,
      addrDefault,
    });
    if (edit) {
      wx.setNavigationBarTitle({
        title: '修改地址',
      });
      this.setData({
        btnName: '确认修改',
        type,
      });
      if (id) {
        console.log('Citys :>> ', Citys);

        wx.api.address.addressDetail({ id }).then(res => {
          console.log('addressDetail-res :>> ', res);
          const { province, city, area, town, address } = res.data;
          const areaCode = this.getAreaCode({ province, city, area });
          const town0 = town || '';
          this.setData({
            form: {
              ...res.data,
              pcr: province + city + area,
              address: town0 + address,
            },
            pcrValue: [areaCode],
          });
        });
      }
    }

    if (addrDefault) {
      const defaultSenderAddress = wx.getStorageSync('defaultSenderAddress');
      console.log('defaultSenderAddress :>> ', defaultSenderAddress);
      const pcr =
        defaultSenderAddress.province +
        defaultSenderAddress.city +
        defaultSenderAddress.district;

      // 不能修改默认地址
      this.setData({
        disabledAddr: true,
        'form.address': addrDefault,
        'form.pcr': pcr,
        defaultPcr: pcr,
      });
    }

    wx.setStorageSync('isNew', 1);

    app.$bus.on('onAddressData2', addressData => {
      console.log('addressData :>> ', addressData);
      const { province, city, area, town, address } = addressData;
      const areaCode = this.getAreaCode({ province, city, area });
      const town0 = town || '';

      if (addrDefault) {
        this.setData({
          'form.name': addressData.name,
          'form.phone': addressData.phone,
        });
      } else {
        this.setData({
          form: {
            ...addressData,
            pcr: province + city + area,
            address: town0 + address,
          },
          pcrValue: [areaCode],
        });
      }
    });

    if (editUnsaveAddr) {
      const addressData = app.globalData.editUnsaveAddr;
      console.error('editUnsaveAddr', addressData);
      const { province, city, area, town, address } = addressData;
      const areaCode = this.getAreaCode({ province, city, area });
      const town0 = town || '';
      this.setData({
        form: {
          ...addressData,
          pcr: province + city + area,
          address: town0 + address,
        },
        pcrValue: [areaCode],
      });
      console.log('this.data.form :>> ', this.data.form);
    }
  },
  // onUnload() {
  //   app.$bus.off('onAddressData')
  // },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow(e) {
  },

  toAddressList() {
    wx.navigateTo({
      url:
        '/pages/address-book/address-book?type=' +
        this.data.type +
        '&emitType=2',
    });
  },

  onChangeSaveAddrChecked(e) {
    const { detail: val } = e;
    console.log('e :>> ', e);
    console.log('val :>> ', val);
    this.setData({
      saveAddrChecked: val,
    });
  },

  onSearch(e) {
    const { detail: val } = e;
    console.log('val :>> ', val);
    console.log('areaList2 :>> ', areaList2);
    const firstWord = val[0];
    console.log('firstWord :>> ', firstWord);
    try {
      const arr1 = Object.entries(areaList2.province_list).filter(
        arr => arr[1][0] === firstWord
      );
      const arr2 = Object.entries(areaList2.city_list).filter(
        arr => arr[1][0] === firstWord
      );
      const arr3 = Object.entries(areaList2.county_list).filter(
        arr => arr[1][0] === firstWord
      );

      const arrAll = [...arr1, ...arr2, ...arr3];
      const target = arrAll.find(item => item[1].includes(val));
      let areaCode = target[0];
      console.log('areaCode :>> ', areaCode);
      if (areaCode.endsWith('00') && !areaCode.endsWith('0000')) {
        let fullCode = null;
        fullCode = Citys.find(
          item => item.value.substring(0, 2) === areaCode.substring(0, 2)
        )?.children.find(item => item.value === areaCode)?.children[0]?.value;
        console.log('城市');
        areaCode = fullCode;
      } else if (areaCode.endsWith('0000')) {
        console.log('省份');
        let fullCode = null;
        fullCode = Citys.find(item => item.value === areaCode)?.children[0]
          ?.children[0]?.value;
        console.log('fullCode :>> ', fullCode);
        areaCode = fullCode;
      } else {
        console.log('县区');
      }
      this.setData({
        pcrValue: [Number(areaCode)],
      });
      // console.log('areaCode :>> ', areaCode);
      const cityCode = Number(String(areaCode).substring(0, 4) + '00');
      // console.log('cityCode :>> ', cityCode);
      const provinceCode = Number(String(areaCode).substring(0, 2) + '0000');
      // console.log('provinceCode :>> ', provinceCode);
      const provinceName = areaList2.province_list[provinceCode] || '';
      // console.log('provinceName :>> ', provinceName);
      const cityName = areaList2.city_list[cityCode] || '';
      // console.log('cityName :>> ', cityName);
      const areaName = areaList2.county_list[areaCode] || '';
      // console.log('areaName :>> ', areaName);
      const pcr = provinceName + cityName + areaName;
      console.log('pcr :>> ', pcr);
      this.setData({
        pcrLabel: pcr,
      });
    } catch (error) {
      console.error(error);
      wx.showToast({
        icon: 'none',
        title: '没有查到',
      });
    }
  },
  onBtnGroup1Click(e) {
    const { index } = e.currentTarget.dataset;
    const target = this.data.hotCitys[index];
    console.log('target :>> ', target);
    this.onSearch({ detail: target });
    this.setData({
      btnGroup1: index,
    });
  },
  getPhoneNumber,
  getUserProfile,

  onSave: debounce(function () {
    this.setData({
      loading: true,
    });
    const form = this.data.form;
    console.log('form :>> ', form);
    const pcr0 = form.pcr;
    console.log('pcr0 :>> ', pcr0);
    const result = AddressParse.parse(pcr0)[0];
    console.log('result :>> ', result);
    const { province, city, area } = result;
    this.checkName();
    this.checkPhone();
    this.checkAddress();

    setTimeout(() => {
      const { nameErrMsg, phoneErrMsg, addressErrMsg } = this.data;
      const isPass = nameErrMsg || phoneErrMsg || addressErrMsg;
      if (isPass) {
        return console.error('校验未通过');
      } else {
        if (!this.data.form.pcr) {
          wx.showToast({
            icon: 'none',
            title: '请选择省市区',
          });
          return;
        }

        const params = {
          name: form.name,
          phone: form.phone,
          address: form.address,
          type: this.data.type,
          province,
          city,
          area,
        };

        if (!this.data.saveAddrChecked) {
          app.$bus.emit('onAddressData', params);
          wx.navigateBack({
            delta: 1,
          });
          return;
        }

        wx.showLoading({
          title: '加载中',
        });

        wx.api.address
          .addressAdd(params)
          .then(res => {
            console.log('res :>> ', res);
            const data = res.data;
            console.log('data :>> ', data);
            const app = getApp();
            app.$bus.emit('onAddressData', data);
            wx.showToast({
              title: '添加成功',
              success: () => {
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1,
                  });
                }, 500);
              },
            });
          })
          .catch(err => {
            console.error(err);
          })
          .finally(() => {
            // wx.hideLoading();
          });
      }
    }, 100);
  }, 300),
  onUpdate: debounce(function () {
    this.setData({
      loading: true,
    });
    const form = this.data.form;

    const result = AddressParse.parse(this.data.form.pcr)[0];
    const { province, city, area } = result;
    this.checkName();
    this.checkPhone();
    this.checkAddress();

    setTimeout(() => {
      const { nameErrMsg, phoneErrMsg, addressErrMsg } = this.data;
      const isPass = nameErrMsg || phoneErrMsg || addressErrMsg;
      if (isPass) {
        return console.error('校验未通过');
      } else {
        if (!this.data.form.pcr) {
          wx.showToast({
            icon: 'none',
            title: '请选择省市区',
          });
          return;
        }
        const params = {
          id: this.data.id,
          name: form.name,
          phone: form.phone,
          address: form.address,
          type: this.data.type,
          province,
          city,
          area,
        };
        wx.showLoading({
          title: '加载中',
        });
        wx.api.address
          .addressUpdate(params)
          .then(res => {
            console.log('res :>> ', res);
            wx.showToast({
              title: '修改成功',
              success: () => {
                app.$bus.emit('onAddressData', params);
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1,
                  });
                }, 500);
              },
            });
          })
          .catch(err => {
            console.error(err);
          })
          .finally(() => {
            wx.hideLoading();
          });
      }
    }, 100);
  }, 300),
  onSaveCity: debounce(function (e) {
    console.log('e :>> ', e);
    console.log('this.data.pcrValue :>> ', this.data.pcrValue);
    console.log('this.data.pcrLabel :>> ', this.data.pcrLabel);
    //根据pcrValue对form.pcr赋值
    this.setData({
      'form.pcr': this.data.pcrLabel,
    });
    setTimeout(() => {
      this.onClosePop();
      console.log('this.data.form.pcr :>> ', this.data.form.pcr);
      if (!this.data.form.pcr) {
        // 打开城市选择框后，点确定默认选择北京
        this.setData({
          pcrValue: [110101],
          'form.pcr': `北京市北京市东城区`,
        });
      }
    }, 0);
  }, 200),
  onAreaChange(event) {
    const { values } = event.detail;
    console.log('values :>> ', values);
    const [province, city, county] = values;
    const isUndefined = [undefined, 'undefined'].includes(county?.name);
    const name = isUndefined ? '' : county?.name;
    // 更新选中的地区值
    const selectedArea = province.name + ' ' + city.name + ' ' + name;
    console.log('selectedArea :>> ', selectedArea);
    const selectedCode = county?.code;
    this.setData({
      pcrLabel: selectedArea,
      pcrValue: selectedCode,
    });
    console.log('selectedCode :>> ', selectedCode);
    console.log('this.data.form.pcr :>> ', this.data.form.pcr);
    // this.setData({ selectedArea });

    // 执行其他逻辑
    // ...
  },
  onChange1(event) {
    // event.detail 为当前输入的值
    this.setData({
      'form.name': event.detail,
    });
  },
  onChange2(event) {
    // event.detail 为当前输入的值
    console.log('event.detail :>> ', event.detail);
    this.setData({
      'form.phone': event.detail,
    });
    console.log('this.data.form.phone :>> ', this.data.form.phone);
  },
  onChange4(event) {
    // event.detail 为当前输入的值
    this.setData({
      'form.address': event.detail,
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
  checkPhone() {
    const phone = this.data.form.phone;
    console.log('this.data.form.phone :>> ', this.data.form.phone);
    let msg = null;
    if (!validate.phone.test(phone)) {
      msg = '请输入正确的手机格式';
    }
    this.setData({
      phoneErrMsg: msg,
    });
  },
  checkAddress() {
    if (!this.data.form.address) {
      this.setData({
        addressErrMsg: '请输入地址',
      });
    } else if (this.data.form.address.toString().length >= 200) {
      this.setData({
        addressErrMsg: '地址过长',
      });
    } else {
      this.setData({
        addressErrMsg: null,
      });
    }
  },
  getAreaCode({ province, city, area }) {
    const municipality = ['北京', '上海', '天津', '重庆'];
    console.log('province',province)
    console.log('city',city)
    console.log('area',area)
    if (!area) {
      wx.showToast({
        title: '请选择县/区',
        icon: 'none',
        duration: 3000
      })
    }
    const provinceChildren = Citys.find(
      item =>
        item.label ==
        (municipality.find(name => name === province)
          ? province + '市'
          : province)
    )?.children;

    console.log('provinceChildren',provinceChildren)

    const cityChildren = provinceChildren.find(
      item => item.label == city
    ).children;
    const areaChildren = cityChildren.find(item => item.label == area);
    const areaCode = areaChildren?.value || null;
  
    return areaCode;
  },
  onInput: debounce(function (e) {
    let { detail } = e;
    if (!detail) return;
    wx.showLoading({
      title: '解析中...',
    });

    // 去除空格
    detail = detail.replace(/\s+/g, '');
    // 去除换行
    detail = detail.replace(/\n/g, '');
    console.log('detail :>> ', detail);
    const result = AddressParse.parse(detail)[0];

    console.log('result :>> ', result);

    const { name, mobile, phone, province, city, details: addr } = result;
    let { area } = result;
    //将经开区映射为经济开发区
    if (area == '' && addr.startsWith('经开区')) {
      area = '经济开发区';
    }
    const pcr = province + city + area;
    console.log('province', province);
    console.log('Citys', Citys);

    const municipality = ['北京', '上海', '天津', '重庆'];
    const provinceChildren = Citys.find(
      item =>
        item.label ==
        (municipality.find(name => name === province)
          ? province + '市'
          : province)
    ).children;
    const cityChildren = provinceChildren.find(
      item => item.label == city
    ).children;
    console.log('cityChildren', cityChildren);
    console.log('area :>> ', area);
    const areaChildren = cityChildren.find(item => item.label == area);
    console.log('areaChildren :>> ', areaChildren);
    const areaCode = areaChildren?.value;

    if(areaCode==undefined){
      wx.showToast({
        title: '解析失败，请手动填写',
        icon: 'none',
        duration: 3000,
      });
    }

    const form = {};
    if (name) {
      form.name = name;
    }
    if (mobile) {
      form.phone = mobile;
    }

    if (phone) {
      form.phone = phone;
    }
    if (pcr) {
      form.pcr = pcr;
    }

    if (addr) {
      form.address = addr;
    }

    if (this.data.addrDefault) {
      this.setData({
        'form.name': form.name,
        'form.phone': form.phone,
        pcrValue: [areaCode],
      });
    } else {
      this.setData({
        form,
        pcrValue: [areaCode],
      });
    }

    setTimeout(() => {
      wx.hideLoading();
    }, 500);
  }, 300),

  onClose2() {
    this.setData({
      show2: false,
    });
  },

  openShow2() {
    this.setData({
      show2: true,
    });
  },

  onSelect2(event) {
    const { id } = event.detail;
    if (id == 1) {
      wx.chooseImage({
        count: 1, // 最多可选择的图片数量
        sourceType: ['camera'], // 指定使用相机拍照
        sizeType: ['original', 'compressed'],
        success: async function (res) {
          // 选择图片成功后的回调函数
          var tempFilePaths = res.tempFilePaths; // 获取选中图片的临时文件路径
          // 在这里可以对选中的图片进行处理或上传等操作
          console.log('tempFilePaths :>> ', tempFilePaths);
          // 'https://zyt.5dsp.com/api/upload'

          wx.getImageInfo({
            src: tempFilePaths[0],
            success: function (infoRes) {
              console.log('infoRes :>> ', infoRes);
              console.log('原图大小：', infoRes.size);
              wx.compressImage({
                src: tempFilePaths[0],
                quality: 70,
                success: function (compressRes) {
                  console.log('compressRes :>> ', compressRes);
                  console.log('压缩后大小：', compressRes.size);
                  // 在这里可以将压缩后的图片上传到服务器或进行其他处理
                },
              });
            },
          });

          // 获取图片地址
          const f1 = () => {
            return new Promise((resolve, reject) => {
              wx.uploadFile({
                url: 'https://zyt.5dsp.com/api/upload', // 上传接口地址
                filePath: tempFilePaths[0], // 要上传的文件路径
                name: 'file', // 上传文件对应的 key
                success(res) {
                  const data = JSON.parse(res.data);
                  resolve(data.data);
                },
                fail(err) {
                  console.error(err); // 上传失败后的错误信息
                },
              });
            });
          };
        },
      });
    } else {
      wx.chooseImage({
        count: 1, // 最多可选择的图片数量
        sourceType: ['album'], // 指定使用相机拍照
        success: function (res) {
          // 选择图片成功后的回调函数
          var tempFilePaths = res.tempFilePaths; // 获取选中图片的临时文件路径
          // 在这里可以对选中的图片进行处理或上传等操作
          console.log('tempFilePaths :>> ', tempFilePaths);
        },
      });
    }
  },

  onClick0(event) {
    const { name } = event.currentTarget.dataset;
    console.log('name :>> ', name);
    this.setData({
      expressIndex: name,
    });
  },

  openLocation() {
    wx.showLoading({
      title: '加载中...',
    });
    const that=this
    wx.chooseLocation({
      success(res) {
        console.log('res :>> ', res);
        wx.hideLoading()
        const {
          address
        } = res
        console.log(address)
        const result = AddressParse.parse(address)[0];
        console.log('result :>> ', result);
        const {
          province,
          city,
          area,
          address: address0,
          name,
        } = result;
        const pcr = province + city + area || '';
        console.log('province :>> ', province);
        console.log('city :>> ', city);
        console.log('area :>> ', area);
        const areaCode = that.getAreaCode({ province, city, area });
        console.log('result :>> ', result);
        const { details: addr } = result;
        console.log('addr :>> ', addr);
        that.setData({
          pcrValue: [areaCode],
        });
        if (!that.data.addrDefault) {
          that.setData({
            'form.address': addr || name,
            'form.pcr': pcr,
          });
        }
      },
      fail(e) {
        console.error(e)
      }
    })
  },

  onClosePop() {
    this.setData({
      show: false,
    });
  },

  onClickShow() {
    if (!this.data.defaultPcr) {
      this.setData({
        show: true,
      });
    } else {
      wx.showToast({
        title: '不可编辑打印机省市区',
        icon: 'none',
      });
    }
  },
});
