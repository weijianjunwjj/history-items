<!--
 * @Author: yqq
 * @Date: 2023-01-12 13:08:47
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-08 15:21:45
 * @FilePath: \yadea-website\pages\index\model-contrast\index.vue
 * @Description: 
 * 
-->
<template>
  <div v-if="isOnMounted" class="model-contrast-box">
    <div v-if="!isFixedCarTitle" class="model-contrast-title fs-48-vw fw-500">雅迪车型比较</div>
    <!-- <div v-if="!isFixedCarTitle" class="tab-box">
      <div :class="activeKey === 1 && 'txt-special'" class="fs-20-vw fw-600" @click="activeKey = 1">车型对比</div>
      <div :class="activeKey === 2 && 'txt-special'" class="fs-20-vw fw-600" @click="activeKey = 2">外观对比</div>
    </div> -->
    <div v-if="activeKey === 1">
      <div v-if="!isFixedCarTitle" class="car-box">
        <div class="car-items">
          <template v-for="(item, index) in carDetailList" :key="item?.id">
            <div class="car-item">
              <img :src="item?.colorUrl" alt="图片" />
              <p class="fs-30-vw fw-500 car-item-title">{{ item?.name }}</p>
              <span class="fs-20-vw" @click="handleClickReselect(index)">重新选择</span>
              <div class="color-select-box">
                <ColorButtonGroup>
                  <template v-for="(colorItem, colorIndex) in item?.vehicleColor" :key="colorItem?.id">
                    <ColorButtonItem
                      :is-border="colorIndex === 0"
                      :bg-color="colorItem?.productColor"
                      @click-index="handleChangeColor($event, index)"
                    ></ColorButtonItem>
                  </template>
                </ColorButtonGroup>
              </div>
              <div class="line"></div>
              <div>
                <MyButton
                  v-if="item.button1 && isHavePng(item.buttonUrl1)"
                  class-name="shop-mall fs-16 border-box"
                  type="primary"
                  @click="handleOpenCode(item.buttonUrl1)"
                >
                  {{ item.button1 }}
                </MyButton>
                <MyButton v-else class-name="shop-mall fs-16 border-box" type="primary" :href="item.buttonUrl1">
                  {{ item.button1 }}
                </MyButton>
                <div>
                  <MyButton class-name="fs-16-vw border-box car-buy-btn learn-more" type="link" :href="item.buttonUrl2">
                    <div class="flex-c flex-end shop-mall-btn">
                      <span class="shop-mall-txt fs-20-vw" style="color: #54514d">
                        {{ item.button2 }}
                        <SvgIcon name="arrow-right-black"></SvgIcon>
                      </span>
                    </div>
                  </MyButton>
                </div>
                <!-- <div class="learn-more cur-point" @click="handleGoDetail(item)">
                  了解更多
                  <SvgIcon name="arrow-right-black"></SvgIcon>
                </div> -->
              </div>
            </div>
          </template>
        </div>
        <div class="add-car-model">
          <div v-show="carDetailList.length == 0">
            <div v-show="carDetailList.length == 0" class="add-car-model-container" @click="handleOpenModal">
              <SvgIcon name="addCarModel"></SvgIcon>
            </div>
            <div v-show="carDetailList.length <= 1" class="add-car-model-container" @click="handleOpenModal">
              <SvgIcon name="addCarModel"></SvgIcon>
            </div>
            <div v-show="carDetailList.length <= 2" class="add-car-model-container" @click="handleOpenModal">
              <SvgIcon name="addCarModel"></SvgIcon>
            </div>
            <div v-show="carDetailList.length <= 3" class="add-car-model-container" @click="handleOpenModal">
              <SvgIcon name="addCarModel"></SvgIcon>
            </div>
          </div>
          <div v-show="carDetailList.length != 0" class="remainder-car-list">
            <div v-show="carDetailList.length <= 1" class="remainder-car-container">
              <SvgIcon name="addCarModel" @click="handleOpenModal"></SvgIcon>
            </div>
            <div v-show="carDetailList.length <= 2" class="remainder-car-container">
              <SvgIcon name="addCarModel" @click="handleOpenModal"></SvgIcon>
            </div>
            <div v-show="carDetailList.length <= 3" class="remainder-car-container">
              <SvgIcon name="addCarModel" @click="handleOpenModal"></SvgIcon>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="car-box-fixed">
        <div class="car-items">
          <template v-for="(item, index) in carDetailList" :key="item?.id">
            <div class="car-item">
              <p class="fs-30-vw fw-500 car-item-title-fixed car-item-fixed">{{ item?.name }}</p>
              <span class="fs-20-vw" @click="handleClickReselect(index)">重新选择</span>
            </div>
          </template>
        </div>
        <div v-if="carDetailList.length <= 3" class="add-car-model">
          <!-- <SvgIcon name="blackAddCarModel" @click="handleOpenModal"></SvgIcon> -->
          <div v-show="carDetailList.length == 0" class="suspension-add-car-container">
            <SvgIcon
              v-show="carDetailList.length == 0"
              class="suspension-add-car"
              name="suspension-add-car-model"
              @click="handleOpenModal"
            ></SvgIcon>
            <SvgIcon
              v-show="carDetailList.length <= 1"
              class="suspension-add-car"
              name="suspension-add-car-model"
              @click="handleOpenModal"
            ></SvgIcon>
            <SvgIcon
              v-show="carDetailList.length <= 2"
              class="suspension-add-car"
              name="suspension-add-car-model"
              @click="handleOpenModal"
            ></SvgIcon>
            <SvgIcon
              v-show="carDetailList.length <= 3"
              class="suspension-add-car"
              name="suspension-add-car-model"
              @click="handleOpenModal"
            ></SvgIcon>
          </div>
          <div v-show="carDetailList.length != 0" class="remainder-car-list">
            <div v-show="carDetailList.length <= 1" class="remainder-car-container suspension-remainder-car-container">
              <SvgIcon name="suspension-add-car-model" @click="handleOpenModal"></SvgIcon>
            </div>
            <div v-show="carDetailList.length <= 2" class="remainder-car-container suspension-remainder-car-container">
              <SvgIcon name="suspension-add-car-model" @click="handleOpenModal"></SvgIcon>
            </div>
            <div v-show="carDetailList.length <= 3" class="remainder-car-container suspension-remainder-car-container">
              <SvgIcon name="suspension-add-car-model" @click="handleOpenModal"></SvgIcon>
            </div>
          </div>
        </div>
      </div>

      <div v-show="carDetailList.length === 0" class="car-add-prompt fs-20-vw">点击立即添加车型</div>
      <div v-show="carDetailList.length !== 0" class="basic-params-box">
        <div class="basic-params-title">
          <span class="fs-32-vw fw-600">基本参数</span>
          <div>
            <client-only>
              <a-checkbox v-model:checked="checked" @change="handleChangeHideFlag">隐藏相同选项</a-checkbox>
            </client-only>
          </div>
        </div>
        <div id="basic-params-container" class="basic-params-items">
          <template v-for="item in carDetailList" :key="item?.id">
            <div class="basic-params-item">
              <div v-show="item?.vehicleParameters?.vehicleSize_show" class="basic-params-item-box" attr="parameters1.vehicleSize">
                <div class="basic-params-item-title fs-20-vw">整车尺寸</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">{{ item?.vehicleParameters?.vehicleSize || '-' }}</div>
              </div>
              <div v-show="item?.vehicleParameters?.braking_show" class="basic-params-item-box" attr="parameters1.braking">
                <div class="basic-params-item-title fs-20-vw">制动</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">{{ item?.vehicleParameters?.braking || '-' }}</div>
              </div>
              <div v-show="item?.vehicleParameters?.shockAbsorption_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">减震</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">{{ item?.vehicleParameters?.shockAbsorption || '-' }}</div>
              </div>
              <div v-show="item?.vehicleParameters?.type1_show" class="basic-params-item-box">
                <div class="basic-params-item-title fs-20-vw">轮胎</div>
                <div class="basic-params-item-text fs-24-vw fw-500 mt-2">{{ item?.vehicleParameters?.type1 || '-' }}</div>
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
        <div class="basic-params-items">
          <template v-for="item in carDetailList" :key="item?.id">
            <div class="basic-params-item">
              <div v-show="item?.vehicleSmartTechnology?.electricMachiner_show" class="basic-params-item-box">
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
        <div class="basic-params-title fs-32-vw fw-600">智慧科技</div>
        <div class="basic-params-items">
          <template v-for="item in carDetailList" :key="item?.id">
            <div v-show="item?.vehicleTechnology?.routineUnlock_show" class="basic-params-item">
              <div class="basic-params-item-box">
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

        <div class="footer-tip">*参数配置表中，实心圆代表有此项配置，空心圆代表无此项配置，具体请以实际购买车型为准。</div>
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
      <a-modal v-model:visible="visible" class="model-contrast-modal" :width="1400" :footer="null" :closable="false">
        <div class="modal-top">
          <div class="modal-top-left">
            <div class="drop-box">
              <div class="drop-title fs-32-vw fw-500 flex-vc" @click="dropVisible = !dropVisible">
                {{ currentCategory.attributes.name }}
                <!-- <SvgIcon name="down" :class="dropVisible && 'svgRotate'"></SvgIcon> -->
              </div>
              <!-- <div class="drop-menu" :class="dropVisible && 'drop-menu-show'">
                <template v-for="item in categoryList" :key="item?.id">
                  <div class="fs-16-vw" @click="handleSelectCarCategory(item)">{{ item.attributes.name }}</div>
                </template>
              </div> -->
            </div>
          </div>
          <div class="modal-top-right">
            <SvgIcon name="cha" @click="visible = false"></SvgIcon>
          </div>
        </div>
        <div class="modal-content">
          <!-- <a-radio-group v-model:value="product"> -->
          <div class="modal-car-items">
            <template v-for="item in productsList" :key="item?.id">
              <div class="modal-car-item" @click="handleOpenEditionModal(item?.id, item)">
                <div class="modal-car-item-top">
                  <a-radio :checked="isInclude(item)"></a-radio>
                </div>
                <img :src="item.picUrl" alt="图片" />
                <div class="fs-18-vw fw-500 ellipsis-1">{{ item.attributes.name }}</div>
              </div>
            </template>
          </div>
          <!-- </a-radio-group> -->
        </div>
      </a-modal>
    </client-only>
    <client-only>
      <a-modal v-model:visible="editionVisible" class="model-edition-contrast-modal" :width="800" :footer="null" :closable="false">
        <div class="modal-top">
          <div class="modal-top-left">
            <div class="drop-box">
              <div class="drop-title fs-32-vw fw-500">版本选择</div>
            </div>
          </div>
          <div class="modal-top-right">
            <SvgIcon name="cha" @click="editionVisible = false"></SvgIcon>
          </div>
        </div>
        <div class="modal-content">
          <div class="fs-20-vw opt65 title">版本</div>
          <template v-for="item in editionList" :key="item?.id">
            <div class="fs-20-vw edition">
              <div class="edition-left fs-20-vw fw-600">{{ item.name }}</div>
              <div class="edition-right">
                <div v-if="!isSelected(item)" class="txt-white contrast fs-20-vw" @click="handleSelectCar(item)">
                  <SvgIcon name="whiteAdd"></SvgIcon>
                  <span>对比</span>
                </div>
                <div v-else class="txt-white fs-20-vw cancel" @click="handleDeleteCar(item)">
                  <SvgIcon name="whiteClose"></SvgIcon>
                  <span>取消</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </a-modal>
    </client-only>
    <client-only>
      <a-modal v-model:visible="modalVisible" class="all-models-model" :footer="null" width="260px">
        <img :src="replaceImgUrl(codeImg)" alt="" style="" />
        <span>扫码识别, 在线商城</span>
      </a-modal>
    </client-only>
  </div>
</template>

<script setup>
import { message } from 'ant-design-vue'
import _ from 'lodash'

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

// 打开二维码
const modalVisible = ref(false)
const codeImg = ref('')
const handleOpenCode = img => {
  modalVisible.value = true
  codeImg.value = img
}

const { modelContrastApi } = useApi()
// tab栏选中
const mySelIds = $ref([])
const activeKey = ref(1)
const isOnMounted = $ref(false)
const isFixedCarTitle = $ref(false)
const sourceCarDetailList = $ref([])
// 是否隐藏相同选项
const checked = $ref(false)
const product = $ref()

function isInclude(item) {
  const id = item?.id
  return carDetailList?.length ? carDetailList.some(item => item?.pid === id) : false
}

// 隐藏相同选项
const handleChangeHideFlag = e => {
  if (e.target.checked) {
    sourceCarDetailList = clone(carDetailList)

    const contrastTwo = () => {
      const obj1 = carDetailList[0]
      const obj2 = carDetailList[1]
      const v11 = obj1.vehicleParameters
      const v12 = obj1.vehicleTechnology
      const v13 = obj1.vehicleSmartTechnology
      const v21 = obj2.vehicleParameters
      const v22 = obj2.vehicleTechnology
      const v23 = obj2.vehicleSmartTechnology
      Object.keys(v11).forEach(key => {
        if (!key.endsWith('_show')) {
          if (v11[key] === v21[key]) {
            v11[key + '_show'] = false
            v21[key + '_show'] = false
          }
        }
      })

      Object.keys(v12).forEach(key => {
        if (!key.endsWith('_show')) {
          if (v12[key] === v22[key]) {
            v12[key + '_show'] = false
            v22[key + '_show'] = false
          }
        }
      })

      Object.keys(v13).forEach(key => {
        if (!key.endsWith('_show')) {
          if (v13[key] === v23[key]) {
            v13[key + '_show'] = false
            v23[key + '_show'] = false
          }
        }
      })
    }

    const contrastThree = () => {
      const obj1 = carDetailList[0]
      const obj2 = carDetailList[1]
      const obj3 = carDetailList[2]
      const v11 = obj1.vehicleParameters
      const v12 = obj1.vehicleTechnology
      const v13 = obj1.vehicleSmartTechnology
      const v21 = obj2.vehicleParameters
      const v22 = obj2.vehicleTechnology
      const v23 = obj2.vehicleSmartTechnology
      const v31 = obj3.vehicleParameters
      const v32 = obj3.vehicleTechnology
      const v33 = obj3.vehicleSmartTechnology
      Object.keys(v11).forEach(key => {
        if (!key.endsWith('_show')) {
          if (v11[key] === v21[key] && v11[key] === v31[key]) {
            v11[key + '_show'] = false
            v21[key + '_show'] = false
            v31[key + '_show'] = false
          }
        }
      })

      Object.keys(v12).forEach(key => {
        if (!key.endsWith('_show')) {
          if (v12[key] === v22[key] && v12[key] === v32[key]) {
            v12[key + '_show'] = false
            v22[key + '_show'] = false
            v32[key + '_show'] = false
          }
        }
      })

      Object.keys(v13).forEach(key => {
        if (!key.endsWith('_show')) {
          if (v13[key] === v23[key] && v13[key] === v33[key]) {
            v13[key + '_show'] = false
            v23[key + '_show'] = false
            v33[key + '_show'] = false
          }
        }
      })
    }

    const contrastFour = () => {
      const obj1 = carDetailList[0]
      const obj2 = carDetailList[1]
      const obj3 = carDetailList[2]
      const obj4 = carDetailList[3]
      const v11 = obj1.vehicleParameters
      const v12 = obj1.vehicleTechnology
      const v13 = obj1.vehicleSmartTechnology
      const v21 = obj2.vehicleParameters
      const v22 = obj2.vehicleTechnology
      const v23 = obj2.vehicleSmartTechnology
      const v31 = obj3.vehicleParameters
      const v32 = obj3.vehicleTechnology
      const v33 = obj3.vehicleSmartTechnology
      const v41 = obj4.vehicleParameters
      const v42 = obj4.vehicleTechnology
      const v43 = obj4.vehicleSmartTechnology
      Object.keys(v11).forEach(key => {
        if (!key.endsWith('_show')) {
          if (v11[key] === v21[key] && v11[key] === v31[key] && v11[key] === v41[key]) {
            v11[key + '_show'] = false
            v21[key + '_show'] = false
            v31[key + '_show'] = false
            v41[key + '_show'] = false
          }
        }
      })

      Object.keys(v12).forEach(key => {
        if (!key.endsWith('_show')) {
          if (v12[key] === v22[key] && v12[key] === v32[key] && v12[key] === v42[key]) {
            v12[key + '_show'] = false
            v22[key + '_show'] = false
            v32[key + '_show'] = false
            v42[key + '_show'] = false
          }
        }
      })

      Object.keys(v13).forEach(key => {
        if (!key.endsWith('_show')) {
          if (v13[key] === v23[key] && v13[key] === v33[key] && v13[key] === v43[key]) {
            v13[key + '_show'] = false
            v23[key + '_show'] = false
            v33[key + '_show'] = false
            v43[key + '_show'] = false
          }
        }
      })
    }

    if (carDetailList.length === 2) {
      contrastTwo()
    }
    if (carDetailList.length === 3) {
      contrastThree()
    }
    if (carDetailList.length === 4) {
      contrastFour()
    }
  } else {
    carDetailList = clone(sourceCarDetailList)
  }
}

// 前往车型详情
const handleGoDetail = item => {
  // console.log(url)
  console.log(item)
  // if (url) window.location.href = url
}

// 弹框是否展开
const visible = $ref(false)

// 下拉框是否展开
const dropVisible = $ref(false)

// 版本选择弹框是否展开
const editionVisible = $ref(false)

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
const handleOpenEditionModal = _.debounce(function (id, item) {
  editionVisible = true
  getCarProduct(id)
  // const flag = carDetailList.find(item => {
  //   return item?.id == id
  // })
  // if (!flag) {
  //   getCarProduct(id)
  // } else {
  //   message.info('已经选择过此款车型')
  // }
}, 100)

// 打开弹框
const handleOpenModal = () => {
  getProductsCategory()
}

// 所有车辆产品list
const productsList = $ref([])

// 车辆类别list
const categoryList = $ref([])

// 当前选中的车辆类别
const currentCategory = $ref('冠能系列')

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
    currentCategory = categoryList.find(item => {
      return item.attributes.name === '冠能系列'
    })
    if (!currentCategory) {
      return
    }
    getCarProducts(currentCategory?.id)
    visible = true
  } catch (error) {}
}

// 选中车辆产品类别
// const handleSelectCarCategory = item => {
//   currentCategory = item.attributes.name
//   dropVisible = false
//   getCarProducts(item?.id)
// }

// 车辆详情list
const carDetailList = $ref([])
const editionList = $ref([])

// 获取车辆详情
const getCarProduct = async id => {
  try {
    const { data: $data } = await modelContrastApi.getProduct(id)
    watchVal($data, () => {
      const attr = $data.value.data.attributes
      const vehicleVersion = attr.vehicleVersion
      vehicleVersion.forEach(item => {
        item.model_static = attr.model_static
        item.pid = id
        item.button1 = attr.button1
        item.button2 = attr.button2
        item.buttonUrl1 = attr.buttonUrl1
        item.buttonUrl2 = attr.buttonUrl2
      })
      editionList = { ...vehicleVersion }
    })
  } catch (error) {
    console.log(error)
  }
}

// 点击对比按钮
const handleSelectCar = item => {
  try {
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
        if (carDetailList.length) {
          carDetailList[reselectIndex] = {
            ...data,
            colorUrl: data.vehicleColor[0].pic?.data?.attributes?.url
          }
        } else {
          carDetailList[0] = {
            ...data,
            colorUrl: data.vehicleColor[0].pic?.data?.attributes?.url
          }
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
  } catch (error) {
    console.log(error)
  }
}

// 点击取消按钮
const handleDeleteCar = car => {
  // console.log('car :>> ', car)
  // console.log('2-mySelIds-del :>> ', mySelIds)
  // const _index = mySelIds.indexOf(car.pid)
  // console.log('_index :>> ', _index)
  // delete mySelIds[_index]
  // console.log('2-mySelIds-del :>> ', mySelIds)
  carDetailList.map((item, index) => {
    if (item.name === car.name) {
      carDetailList.splice(index, 1)
    }
  })
}

// 重新选择替换index
const reselectIndex = $ref(null)

// 重新选择
const handleClickReselect = index => {
  reselectIndex = index
  visible = true
}

// 判断是否已选择
const isSelected = item => {
  return carDetailList.find(ele => {
    return ele.name === item.name
  })
}

// 切换车身颜色
const handleChangeColor = (e, index) => {
  carDetailList[index].colorUrl = carDetailList[index].vehicleColor[e].pic.data.attributes.url
}

onMounted(async () => {
  isOnMounted = true
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
</script>

<style lang="less" scoped>
.model-contrast-box {
  background: #f8f8f8;
  padding-top: 182pxvw;

  .model-contrast-title {
    text-align: center;
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
    align-items: center;
    padding: 0 245pxvw;
    margin-top: 87pxvw;

    .car-items {
      display: flex;
      flex-direction: row;
      align-items: center;

      .car-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 320pxvw;
        margin-left: 50pxvw;

        &:first-of-type {
          margin-left: 0;
        }

        img {
          width: 320pxvw;
          height: 240pxvw;
          object-fit: cover;
          object-position: center center;
        }

        p {
          margin: 40pxvw 0 0;
        }

        span {
          color: #0094ff;
          margin-top: 10pxvw;
          border-bottom: 1px solid #0094ff;
          cursor: pointer;
        }

        .shop-mall {
          letter-spacing: -1px;
        }

        .color-select-box {
          margin-top: 44pxvw;
          height: 64px;
        }

        .line {
          width: 100%;
          height: 1px;
          background: #e9e9e9;
          margin-top: 40pxvw;
        }
        :deep(.learn-more) {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          color: #0094ff;
          justify-content: center;
          margin-top: 10pxvw !important;
          span {
            color: #0094ff !important;
            border-bottom: none;
          }

          svg {
            width: 18pxvw;
            height: 18pxvw;
            color: #0094ff;
          }
        }

        :deep(.shop-mall) {
          width: 124pxvw !important;
          max-width: 124px;
          height: 40pxvw !important;
          max-height: 40pxvw;
          margin-top: 40pxvw;
        }
      }

      .car-item-fixed {
        margin-top: 0 !important;
      }
    }

    .add-car-model {
      position: relative;
      width: 100%;
      text-align: center;
      align-self: start;

      .add-car-model-container {
        display: inline-block;
        cursor: pointer;
        width: 320pxvw;
        height: 320pxvw;
        line-height: 320pxvw;
        border: 1px solid #dadada;
        box-sizing: border-box;
        border-radius: 21pxvw;
        margin-right: 40pxvw;

        &:last-of-type {
          margin-right: 0;
        }

        svg {
          border-radius: 21pxvw;
          width: 100pxvw;
          height: 100pxvw;
        }
      }

      .remainder-car-list {
        width: 100%;

        .remainder-car-container {
          display: inline-block;
          width: 320pxvw;
          height: 320pxvw;
          margin-right: 50pxvw;

          &:last-of-type {
            margin-right: 0;
          }

          svg {
            width: 100pxvw;
            height: 100pxvw;
            margin-top: 100pxvw;
            cursor: pointer;
          }
        }

        .suspension-remainder-car-container {
          height: 110pxvw;
          line-height: 110pxvw;
          svg {
            width: 60pxvw;
            height: 60pxvw;
            margin-top: 0;
            cursor: pointer;
          }
        }
      }

      .suspension-add-car-container {
        display: flex;
        height: 110pxvw;
        align-items: center;
        justify-content: space-around;

        .suspension-add-car {
          display: inline-block;
          width: 48pxvw;
          height: 48pxvw;
          cursor: pointer;
        }
      }
    }
  }

  .car-box-fixed {
    position: fixed;
    background: #ffffff;
    // padding-bottom: 10pxvw;
    top: @layout-header-height;
    margin-top: 0;
    width: 100%;
    z-index: 80;
  }
  .car-add-prompt {
    text-align: center;
    margin-top: 80pxvw;
    padding-bottom: 100pxvw;
    color: #000000;
  }

  .basic-params-box {
    margin-top: 160pxvw;
    padding: 0 260pxvw;

    .basic-params-title {
      padding-bottom: 30pxvw;
      border-bottom: 1px solid #e9e9e9;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .basic-params-items {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;

      .basic-params-item {
        width: 320pxvw;
        // padding: 0 50pxvw;
        margin-left: 50pxvw;
        &:first-of-type {
          margin-left: 0;
        }

        .basic-params-item-box {
          padding: 50pxvw 0 9pxvw;
          height: 110pxvw;

          .basic-params-item-text {
            margin-top: 9pxvw;

            .haveParams {
              width: 20pxvw;
              height: 20pxvw;
              background: #000;
              border-radius: 100%;
              display: inline-block;
            }

            .noHaveParams {
              width: 20pxvw;
              height: 20pxvw;
              border: 1px solid #000;
              border-radius: 100%;
              display: inline-block;
            }
          }
        }
      }
    }
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

.footer-tip {
  .pt(90);
  .pb(72);
  .fs(16);
  opacity: 0.65;
}
</style>

<style lang="less">
.all-models-model {
  .ant-modal-body {
    margin-top: 200pxvw;
    text-align: center;
    img {
      width: 180px;
      height: 180px;
      object-fit: cover;
      object-position: center;
    }

    span {
      color: #888;
      text-align: center;
      display: block;
      margin: 20pxvw 0 20pxvw;
    }
  }
}
.model-contrast-modal {
  width: 1400pxvw !important;
  .ant-modal-content {
    border-radius: 10pxvw;
    width: 1400pxvw !important;
    height: 800pxvw !important;
    margin: 0 auto;
    padding-bottom: 50pxvw;
    overflow-x: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .ant-modal-body {
    padding: 0;
  }

  .modal-top {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 30pxvw 40pxvw 25pxvw 40pxvw;

    .modal-top-left {
      .drop-box {
        position: relative;

        svg {
          width: 38pxvw;
          height: 38pxvw;
          .ml(24);
        }

        .svgRotate {
          transform: rotate(180deg);
          transition: all 0.5s;
        }

        .drop-menu {
          position: absolute;
          width: 200pxvw;
          padding: 10pxvw;
          display: none;
          box-shadow: 0px 7px 44px 0px rgba(0, 0, 0, 0.08);
          border-radius: 8pxvw;
          z-index: 999;
          background: #fff;
          div {
            margin: 10pxvw;
            padding-bottom: 10pxvw;
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
      justify-content: flex-start;

      .modal-car-item {
        width: 315pxvw;
        height: 332pxvw;
        background: #ffffff;
        border-radius: 10px 10px 10px 10px;
        border: 1px solid #e9e9e9;
        margin-left: 20pxvw;
        margin-top: 20pxvw;
        overflow: hidden;
        position: relative;
        box-sizing: border-box;

        .modal-car-item-top {
          text-align: right;
          margin: 15pxvw 15pxvw 5pxvw 0;
          // span {
          //   width: 20pxvw;
          //   height: 20pxvw;
          //   // background: #ff5f00;
          //   display: inline-block;
          //   border-radius: 10pxvw;
          //   border: 1px solid #e9e9e9;
          //   margin: 15pxvw 15pxvw 5pxvw 0;
          // }

          // .isSelected {
          //   border: 1px solid #ff5f00;
          //   position: relative;

          //   &::before {
          //     width: 16pxvw;
          //     height: 16pxvw;
          //     background: #ff5f00;
          //     border-radius: 100%;
          //     content: '';
          //     position: absolute;
          //     left: 50%;
          //     top: 50%;
          //     transform: translate(-50%, -50%);
          //   }
          // }
        }

        img {
          width: 100%;
          height: 197pxvw;
          object-fit: cover;
          object-position: center center;
        }

        .fs-18-vw {
          width: 100%;
          text-align: center;
          // position: absolute;
          // bottom: 40pxvw;
        }
      }
    }
  }
}

.model-edition-contrast-modal {
  .ant-modal-content {
    border-radius: 10pxvw;
    width: 800pxvw !important;
    height: 450pxvw !important;
    margin: 200pxvw auto;
    padding: 50pxvw 50pxvw 50pxvw 50pxvw;
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
      margin-top: 55pxvw;
      padding-bottom: 13pxvw;
      border-bottom: 1px solid #e9e9e9;
    }

    .edition {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 26pxvw 0;
      border-bottom: 1px solid #e9e9e9;

      .edition-right {
        display: flex;
        flex-direction: row;
        align-items: center;
        div {
          width: 94pxvw;
          height: 41pxvw;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          svg {
            width: 20pxvw;
            height: 20pxvw;
            margin-right: 10pxvw;
          }
        }

        .contrast {
          background: #000000;
        }
        .cancel {
          background: #ff5f00;
        }
        span {
          line-height: 0;
        }
      }
    }
  }
}
</style>
