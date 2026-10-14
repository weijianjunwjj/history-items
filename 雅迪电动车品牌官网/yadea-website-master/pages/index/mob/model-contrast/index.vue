<!--
 * @Author: yqq
 * @Date: 2023-01-12 13:08:47
 * @LastEditors: yqq
 * @LastEditTime: 2023-03-10 15:44:48
 * @FilePath: \website\pages\index\mob\model-contrast\index.vue
 * @Description: 
 * 
-->
<template>
  <div class="m-model-contrast-box">
    <div v-if="!isFixedCarTitle" class="model-contrast-title fs-24-mvw">雅迪车型比较</div>
    <!-- <div v-if="!isFixedCarTitle" class="tab-box">
                        <div :class="activeKey === 1 && 'txt-special'" class="fs-20-vw fw-600" @click="activeKey = 1">车型对比</div>
                        <div :class="activeKey === 2 && 'txt-special'" class="fs-20-vw fw-600" @click="activeKey = 2">外观对比</div>
                      </div> -->
    <div v-if="activeKey === 1">
      <div v-if="!isFixedCarTitle" class="car-box">
        <div v-if="carDetailList.length !== 0" class="car-items">
          <template v-for="(item, index) in carDetailList" :key="item.id">
            <div class="car-item">
              <img :src="item?.colorUrl || emptyImg" alt="图片" />
              <p class="fs-14-mvw fw-500 car-item-title">{{ item?.name }}</p>
              <span class="fs-12-mvw reselect" @click="handleClickReselect(index)">重新选择</span>
              <div class="color-select-box">
                <MobileColorButtonGroup>
                  <template v-for="(colorItem, colorIndex) in item?.vehicleColor" :key="colorItem.id">
                    <MobileColorButtonItem
                      :is-border="colorIndex === 0"
                      :bg-color="colorItem?.productColor"
                      @click-index="handleChangeColor($event, index)"
                    ></MobileColorButtonItem>
                  </template>
                </MobileColorButtonGroup>
              </div>
              <div class="line"></div>
              <div>
                <!-- <MobileButton class-name="shop-mall fs-16 border-box" type="primary" href="/mob/all-models">购买</MobileButton> -->
                <MobileButton
                  v-if="!item.mobileButtonUrl1 && isHavePng(item.buttonUrl1)"
                  class-name="shop-mall fs-16-vw border-box"
                  type="primary"
                  @click="handleOpenCode(item.buttonUrl1)"
                >
                  <div class="flex-hvc" style="line-height: 1.2">
                    <span class="fs-12-mvw" style="color: #fff">{{ item.button1 }}</span>
                  </div>
                </MobileButton>
                <MobileButton
                  v-else-if="!item.mobileButtonUrl1 && !isHavePng(item.buttonUrl1)"
                  class-name="shop-mall fs-16-vw border-box"
                  :href="item.buttonUrl1"
                  type="primary"
                  @click="handleOpenCode(item.buttonUrl1)"
                >
                  <div class="flex-hvc" style="line-height: 1.2">
                    <span class="fs-12-mvw" style="color: #fff">{{ item.button1 }}</span>
                  </div>
                </MobileButton>
                <MobileButton v-else class-name="shop-mall fs-16-vw border-box" type="primary" :href="item.mobileButtonUrl1">
                  <div class="flex-hvc" style="line-height: 1.2">
                    <span class="fs-12-mvw" style="color: #fff">{{ item.button1 }}</span>
                  </div>
                </MobileButton>
              </div>
              <div class="learn-more" @click="handleGoDetail(item?.model_static)">了解更多</div>
            </div>
          </template>
        </div>
        <div v-if="carDetailList.length < 2" class="add-car-model">
          <SvgIcon name="addCarModel" @click="handleOpenModal"></SvgIcon>
        </div>
        <div v-if="carDetailList.length < 1" class="add-car-model">
          <SvgIcon name="addCarModel" @click="handleOpenModal"></SvgIcon>
        </div>
      </div>
      <div v-else class="car-box-fixed">
        <div v-if="carDetailList.length !== 0" class="car-items">
          <template v-for="(item, index) in carDetailList" :key="item.id">
            <div class="car-item">
              <p class="fs-30-vw fw-500 car-item-title-fixed">{{ item?.name }}</p>
              <span class="fs-20-vw reselect" @click="handleClickReselect(index)">重新选择</span>
            </div>
          </template>
        </div>
        <div v-if="carDetailList.length < 1" class="add-car-model">
          <SvgIcon name="blackAddCarModel" @click="handleOpenModal"></SvgIcon>
        </div>
        <div v-if="carDetailList.length < 2" class="add-car-model">
          <SvgIcon name="blackAddCarModel" @click="handleOpenModal"></SvgIcon>
        </div>
      </div>
      <div v-if="carDetailList.length < 1" class="fs-11-mvw opt65 txt-c add-now-box">点击立即添加车型</div>
      <div v-show="carDetailList.length !== 0" class="basic-params-box">
        <div class="basic-params-title">
          <span class="">基本参数</span>
          <div class="line"></div>
          <div>
            <client-only>
              <a-checkbox v-model:checked="checked" @change="handleChangeHideFlag"><span class="hide-same">隐藏相同选项</span> </a-checkbox>
            </client-only>
          </div>
        </div>
        <div class="line"></div>
        <div id="basic-params-container" class="basic-params-items">
          <template v-for="item in carDetailList" :key="item.id">
            <div class="basic-params-item">
              <div v-show="item?.vehicleParameters?.vehicleSize_show" class="basic-params-item-box" attr="vehicleParameters.vehicleSize">
                <div class="basic-params-item-title fs-20-vw">整车尺寸</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">{{ item?.vehicleParameters?.vehicleSize || '-' }}</div>
              </div>
              <div v-show="item?.vehicleParameters?.braking_show" class="basic-params-item-box" attr="vehicleParameters.braking">
                <div class="basic-params-item-title fs-20-vw">制动</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">{{ item?.vehicleParameters?.braking || '-' }}</div>
              </div>
              <div v-show="item?.vehicleParameters?.braking_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">减震</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">{{ item?.vehicleParameters?.shockAbsorption || '-' }}</div>
              </div>
              <div v-show="item?.vehicleParameters?.braking_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">轮胎</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">{{ item?.vehicleParameters?.tyre || '-' }}</div>
              </div>
              <div v-show="item?.vehicleParameters?.theft_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">防盗</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleParameters?.theft" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleParameters?.span_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">档距</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">{{ item?.vehicleParameters?.span || '-' }}</div>
              </div>
              <div v-show="item?.vehicleParameters?.ratedLoad_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">额定负载</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">{{ item?.vehicleParameters?.ratedLoad || '-' }}</div>
              </div>
              <div v-show="item?.vehicleParameters?.barrelCapacity_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">座桶容量</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">{{ item?.vehicleParameters?.barrelCapacity || '-' }}</div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div v-show="carDetailList.length !== 0" class="basic-params-box technology-params-box">
        <div class="basic-params-title fs-32-vw fw-600">性能科技</div>
        <div class="line"></div>
        <div class="basic-params-items">
          <template v-for="item in carDetailList" :key="item.id">
            <div class="basic-params-item">
              <div v-show="item?.vehicleSmartTechnology?.electricMachinery_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">电机</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">{{ item?.vehicleSmartTechnology?.electricMachinery || '-' }}</div>
              </div>
              <div v-show="item?.vehicleSmartTechnology?.motorPower_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">电机功率</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">{{ item?.vehicleSmartTechnology?.motorPower || '-' }}</div>
              </div>
              <div v-show="item?.vehicleSmartTechnology?.speed_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">最高时速</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">{{ item?.vehicleSmartTechnology?.speed || '-' }}</div>
              </div>
              <div v-show="item?.vehicleSmartTechnology?.battery_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">电池</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">{{ item?.vehicleSmartTechnology?.battery || '-' }}</div>
              </div>
              <div v-show="item?.vehicleSmartTechnology?.batteryModel_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">电池型号</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <div class="basic-params-item-text fs-24-vw fw-500 mt-2">{{ item?.vehicleSmartTechnology?.batteryModel || '-' }}</div>
                </div>
              </div>
              <div v-show="item?.vehicleSmartTechnology?.bms_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">BMS管理系统</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleSmartTechnology?.bms" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleSmartTechnology?.controller_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">控制器</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">{{ item?.vehicleSmartTechnology?.controller || '-' }}</div>
              </div>
              <div v-show="item?.vehicleSmartTechnology?.charger_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">充电器</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">{{ item?.vehicleSmartTechnology?.charger || '-' }}</div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div v-show="carDetailList.length !== 0" class="basic-params-box technology-params-box">
        <div class="basic-params-title">智慧科技</div>
        <div class="line"></div>
        <div class="basic-params-items">
          <template v-for="item in carDetailList" :key="item.id">
            <div class="basic-params-item">
              <div v-show="item?.vehicleTechnology?.routineUnlock_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">小程序解锁</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.routineUnlock" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.bluetoothUnlock_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">蓝牙解锁</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.bluetoothUnlock" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.appUnlock_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">APP解锁</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.appUnlock" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.phoneNfcUnlock_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">手机NFC卡解锁</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.phoneNfcUnlock" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.nfcUnlock_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">NFC卡解锁</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                    <span v-if="item?.vehicleTechnology?.nfcUnlock" class="haveParams"></span>
                    <span v-else class="noHaveParams"></span>
                  </div>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.watchUnlock_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">手表解锁</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.watchUnlock" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.voiceUnlock_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">智能语音</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.voiceUnlock" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.sensingSeat_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">感应坐垫</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.sensingSeat" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.assistInPromotion_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">助力推行</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.assistInPromotion" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.singlePowerFailure_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">单撑断电</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.singlePowerFailure" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.electronicFence_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">电子围栏</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.electronicFence" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.gps_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">GPS定位</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.gps" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.automaticLocking_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">离车自动上锁/关机</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.automaticLocking" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.abnormalAlarm_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">异动报警</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.abnormalAlarm" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.fullChargeReminder_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">充电满电提醒</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.fullChargeReminder" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.powerOffReminder_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">异常断电提醒</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.powerOffReminder" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.sentryMode_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">哨兵模式</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.sentryMode" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.lossReportingMode_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">报失模式</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.lossReportingMode" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.cyclingStatistics_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">骑行统计</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.cyclingStatistics" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.sensitiveHeadlight_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">智能光感大灯</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.sensitiveHeadlight" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.smartApp_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">智能APP</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.smartApp" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.intelligentInstrument_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">智能仪表</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.intelligentInstrument" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.multiThemeReplace_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">多主题更换</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.multiThemeReplace" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.chordReplacement_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">和弦音更换</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.chordReplacement" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.mobilePhoneWidget_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">手机小组件</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.mobilePhoneWidget" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
              <div v-show="item?.vehicleTechnology?.ota_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">OTA升级</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">
                  <span v-if="item?.vehicleTechnology?.ota" class="haveParams"></span>
                  <span v-else class="noHaveParams"></span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div v-show="carDetailList.length !== 0" class="bottom-desc opt65">
        *参数配置表中，实心圆代表有此项配置，空心圆代表无此项配置，具体请以实际购买车型为准。
      </div>
    </div>
    <div v-if="activeKey === 2" class="appearance-comparison-box">
      <div class="appearance-box have-car-box">
        <div class="operation-box">
          <SvgIcon name="change"></SvgIcon>
          <SvgIcon name="contrast-close"></SvgIcon>
        </div>
        <div class="car-model-box">
          <span class="man-text fs-20-vw">男模: 180cm</span>
          <span class="woman-text fs-20-vw">女模: 160cm</span>
          <img class="man" src="@/assets/images/model-contrast/man.png" alt="图片" />
          <img class="woman" src="@/assets/images/model-contrast/woman.png" alt="图片" />
          <img class="car" src="@/assets/images/model-contrast/car.png" alt="图片" />
        </div>
        <div class="appearance-params-box">
          <div class="appearance-params-item">
            <div class="fs-20-vw">长</div>
            <div class="fs-24-vw fw-500">1662mm</div>
          </div>
          <div class="appearance-params-item">
            <div class="fs-20-vw">宽</div>
            <div class="fs-24-vw fw-500">660mm</div>
          </div>
          <div class="appearance-params-item">
            <div class="fs-20-vw">高</div>
            <div class="fs-24-vw fw-500">1085mm-1210mm</div>
          </div>
          <div class="appearance-params-item">
            <div class="fs-20-vw">档距</div>
            <div class="fs-24-vw fw-500">285mm</div>
          </div>
          <div class="appearance-params-item">
            <div class="fs-20-vw">额定负载</div>
            <div class="fs-24-vw fw-500">75KG</div>
          </div>
          <div class="appearance-params-item">
            <div class="fs-20-vw">座桶容量</div>
            <div class="fs-24-vw fw-500">-</div>
          </div>
        </div>
      </div>
      <div class="appearance-box have-car-box"></div>
      <div class="appearance-box nohave-car-box">
        <SvgIcon name="blackAddCarModel"></SvgIcon>
        <div class="fs-20-vw opt65 mt-6-vw">点击添加对比车型</div>
      </div>
      <div class="appearance-box nohave-car-box">
        <SvgIcon name="blackAddCarModel"></SvgIcon>
        <div class="fs-20-vw opt65 mt-6-vw">点击添加对比车型</div>
      </div>
    </div>
    <client-only>
      <a-modal
        v-model:visible="visible"
        class="m-model-contrast-modal"
        width="100%"
        wrap-class-name="full-modal"
        :footer="null"
        :closable="false"
      >
        <div class="modal-top">
          <div class="modal-top-left">
            <div class="drop-box">
              <div class="drop-title fs-20-mvw fw-500">
                {{ currentCategoryItem.attributes.name ?? '' }}
              </div>
              <!-- <div class="drop-menu" :class="dropVisible && 'drop-menu-show'">
                <template v-for="item in categoryList" :key="item.id">
                  <div class="fs-24-vw" @click="handleSelectCarCategory(item)">{{ item.name }}</div>
                </template>
              </div> -->
            </div>
          </div>
          <div class="modal-top-right">
            <SvgIcon name="cha" :size="24" @click="visible = false"></SvgIcon>
          </div>
        </div>
        <div class="modal-content">
          <div class="modal-car-items">
            <template v-for="item in productsList" :key="item.id">
              <div class="modal-car-item flex-col align-center" @click="handleOpenEditionModal(item.id)">
                <div class="modal-car-item-top">
                  <a-radio v-if="!isSelected(item)" :checked="isSelected(item)"></a-radio>
                  <a-radio v-else :checked="isSelected(item)"></a-radio>
                  <!-- class="isSelected" -->
                </div>
                <img :src="item.picUrl" alt="图片" />
                <div class="fs-12-mvw fw-500 ellipsis-1">{{ item.attributes.name }}</div>
              </div>
            </template>
          </div>
        </div>
      </a-modal>
    </client-only>
    <client-only>
      <a-modal v-model:visible="editionVisible" class="model-edition-contrast-modal-mob" width="80%" :footer="null" :closable="false">
        <div class="modal-top">
          <div class="modal-top-left">
            <div class="drop-box">
              <div class="drop-title fs-20-mvw fw-500">版本选择</div>
            </div>
          </div>
        </div>
        <div class="modal-content">
          <div class="fs-13-mvw opt65 title">版本</div>
          <template v-for="item in editionList" :key="item.id">
            <div v-if="!isVersionSelected(item)" class="edition">
              <div class="edition-left fs-13-mvw fw-600">{{ item.name }}</div>
              <div class="edition-right bgc-black" @click="handleSelectCar(item)">
                <SvgIcon name="whiteAdd" class="white-add-icon"></SvgIcon>
                <span class="white-add-title">对比</span>
              </div>
            </div>
            <div v-else class="edition">
              <div class="edition-left fs-13-mvw fw-600">{{ item.name }}</div>
              <div class="edition-right bgc-orange" @click="handleDeleteCar(item)">
                <SvgIcon name="whiteClose" class="white-add-icon"></SvgIcon>
                <span class="white-add-title">取消</span>
              </div>
            </div>
          </template>
        </div>
      </a-modal>
    </client-only>
    <client-only>
      <a-modal v-model:visible="modalVisible" class="mobile-all-models-model" :footer="null" :width="320">
        <img :src="replaceImgUrl(codeImg)" alt="" />
        <span>扫码识别, 在线商城</span>
      </a-modal>
    </client-only>
  </div>
</template>

<script setup>
useHead({
  meta: [
    { name: 'keywords', content: '电动车,雅迪冠能,雅迪电动车,电动车品牌,电动自行车,智能电动车,电动摩托车,锂电池电动车' },
    {
      name: 'description',
      content:
        '雅迪致力于让亿万人享受美好出行,全球建有7大基地,自研雅迪冠能系列,雅迪冠能3 S9 MAX、雅迪冠能3 E9等旗舰产品,畅销全球超100个国家和地区。 '
    }
  ]
})

const { modelContrastApi } = useApi()
// tab栏选中
const activeKey = ref(1)
const isFixedCarTitle = $ref(false)

// 是否隐藏相同选项
const checked = $ref(false)

const sourceCarDetailList = $ref([])

// 隐藏相同选项
const handleChangeHideFlag = e => {
  if (e.target.checked) {
    sourceCarDetailList = clone(carDetailList)
    if (carDetailList.length >= 2) {
      try {
        const obj1 = carDetailList[0]
        const arr2 = carDetailList.filter((item, index) => index !== 0).flat()
        const $p1 = obj1.vehicleParameters
        const $p2 = obj1.vehicleTechnology
        const $p3 = obj1.vehicleSmartTechnology

        arr2.forEach(item => {
          const p1 = item.vehicleParameters
          const p2 = item.vehicleTechnology
          const p3 = item.vehicleSmartTechnology
          const allP = [p1, p2, p3].filter(Boolean)

          allP.forEach((p, index) => {
            Object.keys(p).forEach(key => {
              if (!key.endsWith('_show')) {
                const $val = (function () {
                  if (index === 0) {
                    return $p1[key]
                  }
                  if (index === 1) {
                    return $p2[key]
                  }
                  if (index === 2) {
                    return $p3[key]
                  }
                })()

                const val = p[key]

                if (val === $val) {
                  // 相同项隐藏
                  const $key = key + '_show'
                  p[$key] = false
                  if (index === 0) {
                    $p1[$key] = false
                  }
                  if (index === 1) {
                    $p2[$key] = false
                  }
                  if (index === 2) {
                    $p3[$key] = false
                  }
                }
              }
            })
          })
        })
      } catch (error) {
        console.log(error)
      }
    }
  } else {
    carDetailList = clone(sourceCarDetailList)
  }
}

// 打开二维码
const modalVisible = ref(false)
const codeImg = ref('')
const handleOpenCode = img => {
  modalVisible.value = true
  codeImg.value = img
}

// 前往车型详情
const handleGoDetail = url => {
  if (url) window.location.href = url
}

// 弹框是否展开
const visible = $ref(false)

// 下拉框是否展开
const dropVisible = $ref(false)

// 版本选择弹框是否展开
const editionVisible = $ref(false)

// 版本选择车辆list
const editionList = $ref([])

// 重新选择替换index
const reselectIndex = $ref(null)

// 标题状态切换
const showCarTitle = async e => {
  e = e || window.event
  let offsetTop
  if (!isFixedCarTitle) {
    offsetTop = document.querySelector('.car-box').getBoundingClientRect().top
    if (offsetTop <= 0) {
      isFixedCarTitle = true
    } else {
      isFixedCarTitle = false
    }
  } else {
    if (e.wheelDelta) {
      //第一步：先判断浏览器IE，谷歌滑轮事件
      if (e.wheelDelta > 0) {
        //当滑轮向上滚动时
        isFixedCarTitle = false
      }
      if (e.wheelDelta < 0) {
        //当滑轮向下滚动时
        isFixedCarTitle = true
      }
    } else if (e.detail) {
      //Firefox滑轮事件
      if (e.detail > 0) {
        //当滑轮向上滚动时
        isFixedCarTitle = false
      }
      if (e.detail < 0) {
        //当滑轮向下滚动时
        isFixedCarTitle = true
      }
    }
  }
}

// 打开版本选择弹框
const handleOpenEditionModal = id => {
  editionVisible = true
  getCarProduct(id)
}

// 打开弹框
const handleOpenModal = () => {
  visible = true
  getProductsCategory()
}

// 所有车辆产品list
const productsList = $ref([])

// 车辆类别list
const categoryList = $ref([])

// 当前选中的车辆类别
const currentCategoryItem = $ref({
  attributes: {
    name: ''
  }
})

// 获取车辆所有产品
const getCarProducts = async categoryId => {
  try {
    const { data } = await modelContrastApi.getProducts(categoryId)
    watchVal(data, () => {
      const newProductsList = data.value.data.map(item => {
        if (item.attributes.picUrl.data) {
          return { ...item, picUrl: item.attributes.picUrl.data[0].attributes.url }
        }
        return { ...item }
      })
      productsList = [...newProductsList]
    })
  } catch (error) {}
}

// 获取车辆类别
const getProductsCategory = async () => {
  try {
    const { data } = await modelContrastApi.getProductsCategory()
    watchVal(data, () => {
      categoryList = data.value.data
    })
    currentCategoryItem = categoryList.find(item => {
      return item.attributes.name === '冠能系列'
    })
    getCarProducts(currentCategoryItem.id)
    // visible = true
  } catch (error) {}
}

// // 选中车辆产品类别
// const handleSelectCarCategory = item => {
//   currentCategoryItem = item
//   dropVisible = false
//   getCarProducts(item.id)
// }

// 车辆详情list
const carDetailList = $ref([])

// 获取车辆详情
const getCarProduct = async id => {
  try {
    const { data: $data } = await modelContrastApi.getProduct(id)
    watchVal($data, () => {
      $data.value.data.attributes.vehicleVersion.forEach(item => {
        item.model_static = $data.value.data.attributes.model_static
        item.pid = id
        item.button1 = $data.value.data.attributes.button1
        item.button2 = $data.value.data.attributes.button2
        item.mobileButtonUrl1 = $data.value.data.attributes.mobileButtonUrl1
        item.buttonUrl1 = $data.value.data.attributes.buttonUrl1
        item.buttonUrl2 = $data.value.data.attributes.buttonUrl2
      })
      editionList = { ...$data.value.data.attributes.vehicleVersion }
    })
  } catch (error) {}
}

// 点击对比按钮
const handleSelectCar = item => {
  const data = clone(item)
  const p1 = data.vehicleParameters
  const p2 = data.vehicleSmartTechnology
  const p3 = data.vehicleTechnology
  const allP = [p1, p2, p3].filter(Boolean)
  allP.forEach(p => {
    if (p) {
      const keys = Object.keys(p)
      keys.forEach(key0 => {
        const key = key0 + '_show'
        p[key] = true
      })
    }
  })

  if (reselectIndex !== null) {
    if (data.vehicleColor.length !== 0) {
      carDetailList[reselectIndex] = {
        ...data,
        colorUrl: data.vehicleColor[0].pic?.data?.attributes?.url
      }
    } else {
      carDetailList[reselectIndex] = { ...data }
    }
  } else {
    if (data.vehicleColor.length !== 0) {
      carDetailList.push({ ...data, colorUrl: data.vehicleColor[0].pic?.data?.attributes?.url })
    } else {
      carDetailList.push({ ...data })
    }
  }

  visible = false
  editionVisible = false
  reselectIndex = null
}

// 点击取消按钮
const handleDeleteCar = car => {
  carDetailList.map((item, index) => {
    if (item.name === car.name) {
      carDetailList.splice(index, 1)
    }
  })
}

// 重新选择
const handleClickReselect = index => {
  reselectIndex = index
  visible = true
}

// 判断是否已选择
const isSelected = item => {
  return carDetailList.find(ele => {
    return ele.name === item.attributes.name
  })
}

// 判断版本是否已选择
const isVersionSelected = item => {
  return carDetailList.find(ele => {
    return ele.name === item.name
  })
}

// 切换车身颜色
const handleChangeColor = (e, index) => {
  carDetailList[index].colorUrl = carDetailList[index].vehicleColor[e].pic.data.attributes.url
}

onMounted(async () => {
  await nextTick()
  if (process.client) {
    //给页面绑定滑轮滚动事件
    if (document.addEventListener) {
      //firefox
      document.addEventListener('DOMMouseScroll', showCarTitle, false)
    }
    //滚动滑轮触发scrollFunc方法 //ie 谷歌
    window.onmousewheel = document.onmousewheel = showCarTitle
  }
})

onUnmounted(() => {
  if (process.client) {
    if (document.addEventListener) {
      //firefox
      document.removeEventListener('DOMMouseScroll', showCarTitle, false)
    }
    window.onmousewheel = document.onmousewheel = null
  }
})

definePageMeta({
  layout: 'mobile'
})
</script>

<style lang="less">
.mobile-all-models-model {
  .ant-modal-body {
    margin-top: 200mpxvw;
    padding-top: 50mpxvw;
    text-align: center;
    img {
      width: 180mpxvw;
      height: 180mpxvw;
      object-fit: cover;
      object-position: center;
    }

    span {
      color: #888;
      text-align: center;
      display: block;
      margin: 20mpxvw 0 20mpxvw;
    }
  }
}

.m-model-contrast-box {
  background: #f8f8f8;
  padding-top: 182pxvw;
  overflow: hidden;

  .model-contrast-title {
    text-align: center;
    .m-fs(24);
    .m-mt(48);
    .m-mb(30);
    font-weight: 500;
  }

  .hide-same {
    .m-fs(13);
    font-weight: 400;
  }

  .tab-box {
    display: flex;
    flex-direction: row;
    justify-content: center;

    div {
      margin: 0 53pxvw;

      &:first-of-type {
        position: relative;

        &::after {
          content: '';
          width: 2pxvw;
          height: 16pxvw;
          position: absolute;
          top: 50%;
          right: -53pxvw;
          transform: translateY(-35%);
          background: #000;
        }
      }
    }
  }

  .car-box,
  .car-box-fixed {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-evenly;
    // padding: 0 245pxvw 10pxvw;

    .car-items {
      display: flex;
      flex-direction: row;
      align-items: center;

      .car-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 50vw;
        min-height: 82mpxvw;

        &:first-of-type {
          margin-left: 0;
        }

        img {
          width: 186mpxvw;
          height: 140mpxvw;
          object-fit: cover;
          object-position: center center;
        }

        &-title-fixed {
          margin: 40pxvw 0 0;
          .m-fs(16);
          font-weight: bold;
        }

        .reselect {
          color: #0094ff;
          margin-top: 10pxvw;
          border-bottom: 2px solid #0094ff;
        }

        .color-select-box {
          margin-top: 28mpxvw;
          height: 64px;
          padding-left: 15mpxvw;
        }

        .line {
          width: calc(100% - 28mpxvw);
          height: 1px;
          background: #e9e9e9;
          margin-top: 15mpxvw;
          margin-bottom: 20mpxvw;
          margin-left: auto;
          margin-right: auto;
        }

        :deep(.shop-mall) {
          width: 124pxvw !important;
          max-width: 124px;
          height: 40pxvw !important;
          max-height: 40pxvw;
          margin-top: 40pxvw;
          color: #fff;
        }
      }
    }

    .add-car-model {
      width: 50%;
      text-align: center;
      cursor: pointer;
      margin-bottom: 16mpxvw;
      width: 165mpxvw;
      height: 165mpxvw;
      border-radius: 10mpxvw;
      border: 1px solid #dadada;
      display: flex;
      justify-content: center;
      align-items: center;
      svg {
        width: 48mpxvw;
        height: 48mpxvw;
      }
    }
  }
  .add-now-box {
    padding-bottom: 150mpxvw;
  }

  .car-box-fixed {
    position: fixed;
    background: #fff;
    top: @layout-m-header-height;
    width: 100%;
    z-index: 80;

    .add-car-model {
      width: 50%;
      height: 85mpxvw;
      border: none;
      margin: 0;
    }
  }

  .line {
    height: 1px;
    background-color: #e9e9e9;
    .m-mtb(20);
  }

  .learn-more {
    font-size: 12mpxvw;
    color: #0094ff;
    margin-top: 18mpxvw;
  }

  .basic-params-box {
    margin-top: 44mpxvw;
    padding: 0 15mpxvw;

    .basic-params-title {
      .m-fs(20);
      font-weight: 500;
      padding-bottom: 30pxvw;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .basic-params-items {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;

      .basic-params-item {
        width: 186mpxvw;
        // padding: 0 50pxvw;
        margin-left: 50pxvw;

        // &:first-of-type {
        //   margin-left: 0;
        // }

        .basic-params-item-box {
          // padding: 50pxvw 0 9pxvw;
          height: 74mpxvw;

          .basic-params-item-title {
            .m-fs(13);
            font-weight: 400;
            color: #000000;
            opacity: 0.5;
          }

          .basic-params-item-text {
            margin-top: 9pxvw;
            .m-fs(13);
            font-weight: 500;
            color: #212121;

            .haveParams {
              width: 12mpxvw;
              height: 12mpxvw;
              background: #000;
              border-radius: 100%;
              display: inline-block;
            }

            .noHaveParams {
              width: 12mpxvw;
              height: 12mpxvw;
              border: 1px solid #000;
              border-radius: 100%;
              display: inline-block;
            }
          }
        }
      }
    }
  }

  .bottom-desc {
    padding: 40mpxvw 15mpxvw 20mpxvw;
    color: #000000;
  }

  .technology-params-box {
    margin-top: 90pxvw;
  }

  .appearance-comparison-box {
    width: 100%;
    padding: 70pxvw 260pxvw 80pxvw;
    overflow: hidden;

    .appearance-box {
      background: #fff;
      width: 680pxvw;
      height: 877pxvw;
      float: left;
      margin-top: 40pxvw;

      &:nth-of-type(2n) {
        margin-left: 40pxvw;
      }
    }

    .nohave-car-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      svg {
        width: 100pxvw;
        height: 100pxvw;
      }
    }

    .have-car-box {
      .operation-box {
        padding: 30pxvw 30pxvw 0;
        text-align: right;

        svg {
          width: 30pxvw;
          height: 30pxvw;
          margin-left: 16pxvw;
        }
      }

      .car-model-box {
        padding: 30pxvw 30pxvw;
        position: relative;
        height: 520pxvw;
        width: 100%;
        border-bottom: 1px solid #e9e9e9;

        .man-text {
          position: absolute;
          top: 8pxvw;
          left: 60pxvw;
          border-bottom: 1px dashed #e9e9e9;
          width: 220pxvw;
          text-align: left;
        }

        .woman-text {
          position: absolute;
          top: 50pxvw;
          right: 60pxvw;
          border-bottom: 1px dashed #e9e9e9;
          width: 190pxvw;
          text-align: right;
        }

        .man {
          position: absolute;
          top: 40pxvw;
          left: 225pxvw;
        }

        .woman {
          position: absolute;
          top: 80pxvw;
          right: 209pxvw;
        }

        .car {
          position: absolute;
          top: 100pxvw;
          left: 77pxvw;
        }
      }

      .appearance-params-box {
        padding: 10pxvw 70pxvw;
        display: flex;
        flex-wrap: wrap;

        .appearance-params-item {
          margin-top: 30pxvw;
          width: 50%;
          text-align: left;
        }
      }
    }
  }
}
</style>

<style lang="less">
.m-model-contrast-modal {
  .icon-cha {
    width: 24mpxvw !important;
    height: 24mpxvw !important;
  }
  .ant-modal-content {
    border-radius: 10pxvw;
    width: 100% !important;
    height: 100vh !important;
    margin: 0 auto;
    padding-bottom: 50pxvw;
    overflow: auto;
  }

  .ant-modal-body {
    padding: 0;
  }

  .modal-top {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 25mpxvw 20mpxvw;

    .modal-top-left {
      .drop-box {
        position: relative;

        svg {
          width: 38pxvw;
          height: 38pxvw;
          margin-left: 24pxvw;
        }

        .svgRotate {
          transform: rotate(180deg);
          transition: all 0.5s;
        }

        .drop-menu {
          position: absolute;
          width: 200mpxvw;
          padding: 10mpxvw;
          display: none;
          box-shadow: 0px 7px 44px 0px rgba(0, 0, 0, 0.08);
          border-radius: 8mpxvw;
          z-index: 999;
          background: #fff;

          div {
            margin: 10mpxvw;
            padding-bottom: 10mpxvw;
            border-bottom: 1px solid #e9e9e9;

            &:first-of-type {
              margin-top: 0;
            }
          }
        }

        .drop-menu-show {
          display: block;
        }
      }
    }

    .modal-top-right {
      svg {
        width: 32pxvw;
        height: 32pxvw;
      }
    }
  }

  .modal-content {
    .modal-car-items {
      display: flex;
      flex-direction: row;
      padding-left: 20pxvw;
      flex-wrap: wrap;
      justify-content: center;

      .modal-car-item {
        width: 163mpxvw;
        height: 186mpxvw;
        background: #ffffff;
        border-radius: 10mpxvw 10mpxvw 10mpxvw 10mpxvw;
        border: 1px solid #e9e9e9;
        margin-left: 5mpxvw;
        margin-right: 5mpxvw;
        margin-top: 10mpxvw;
        overflow: hidden;
        position: relative;
        .m-p(10);

        .modal-car-item-top {
          width: 100%;
          text-align: right;
        }

        img {
          width: 143mpxvw;
          height: 112mpxvw;
          object-fit: contain;
          object-position: center center;
        }

        .fs-24-vw {
          width: 100%;
          text-align: center;
          position: absolute;
          bottom: 40pxvw;
        }
      }
    }
  }
}

.model-edition-contrast-modal-mob {
  .ant-modal-content {
    border-radius: 4mpxvw;
    // width: 800pxvw !important;
    // height: 450pxvw !important;
    // margin: 200pxvw auto;
    padding: 20mpxvw 20mpxvw 50mpxvw;
  }
  .ant-modal-body {
    padding: 0;
  }

  .modal-top {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .modal-top-right {
      svg {
        width: 32pxvw;
        height: 32pxvw;
      }
    }
  }

  .modal-content {
    .title {
      padding: 20mpxvw 0 8mpxvw;
      border-bottom: 1px solid #e9e9e9;
    }

    .edition {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 12mpxvw 0;
      border-bottom: 1px solid #e9e9e9;

      .edition-right {
        width: 62mpxvw;
        height: 29mpxvw;
        display: flex;
        flex-direction: row;
        align-items: center;
        background-color: #000000;

        .white-add-icon {
          margin: 0 4mpxvw 0 12mpxvw;
          width: 10mpxvw;
          height: 10mpxvw;
        }

        .white-add-title {
          color: #fff;
          font-size: 12mpxvw;
        }

        // div {
        //   width: 94pxvw;
        //   height: 41pxvw;
        //   display: flex;
        //   flex-direction: row;
        //   align-items: center;
        //   justify-content: center;

        //   svg {
        //     width: 20pxvw;
        //     height: 20pxvw;
        //     margin-right: 10pxvw;
        //   }

        //   &:first-of-type {
        //     background: #000000;
        //   }

        //   &:last-of-type {
        //     background: #ff5f00;
        //   }
        // }
      }

      .bgc-black {
        background-color: #000;
      }

      .bgc-orange {
        background-color: #ff5f00;
      }
    }
  }
}
</style>
