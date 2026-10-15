# 本地后端接口清单

本清单由 `node scripts/api-inventory.mjs --docs` 使用 TypeScript AST 从 `src/api` 生成，忽略注释，展开模板地址中的新增/编辑分支，并按 HTTP 方法和地址去重。

当前共 **109 个方法与地址组合**，对应 **109 个唯一地址**。前端多个函数调用相同接口只计一次；相同地址的 GET 与 POST 分别计数。

## 本地能力

- 保留 Vue 管理后台，以 Node.js HTTP 服务和 SQLite 数据库替代失效的公司后端。
- 登录、验证码、本地会话、菜单、管理员、权限组、数据字典与操作日志。
- 商品、类目、规格、活动、预约、订单及充值订单查询；订单退款审核和物流状态维护。
- 用户资料、黑名单、社区话题与动态、广告、消息模板、通知配置、积分规则与充值档位管理。
- 数据修改持久化保存；统计页面从本地用户、订单和充值记录计算数据；图片与视频可上传至本地目录。
- 初始化数据为独立的中文示例数据，不包含原公司数据库、真实客户或历史交易。

## 第三方服务与边界

- Google/X 登录、PayPal/Google 支付、跨境物流、邮件和站外通知服务尚未接入；界面中的渠道名称用于展示已有的数据字段。
- 退款审核和物流更新修改本地订单记录，不会触发真实退款或向承运商发送请求。
- 消息通知开关、积分规则和充值档位可维护和持久化，尚未连接真实用户端事件、积分发放任务或支付回调。
- 当前定位为本地演示及后续开发基础。原公司的私有业务逻辑、活动开奖规则和外部服务凭证无法从前端还原。

## 覆盖验证

运行 `node --test tests/api-coverage.test.mjs`，逐一检查下面的前端接口能被主 HTTP 路由或三个业务模块识别。测试使用独立内存数据库；缺少请求字段而触发的正常参数校验异常算作已识别，所有处理器均返回 `undefined` 才算接口遗漏。此检查验证路由覆盖；具体 CRUD、登录和持久化行为由后端集成测试验证。

## 接口列表

| 方法 | 地址 | 前端来源 |
| --- | --- | --- |
| POST | `/api/Activity/add` | `src/api/activity/index.ts` |
| POST | `/api/Activity/booking/add` | `src/api/activity/index.ts` |
| POST | `/api/Activity/booking/del` | `src/api/activity/index.ts` |
| POST | `/api/Activity/booking/edit` | `src/api/activity/index.ts` |
| POST | `/api/Activity/booking/index` | `src/api/activity/index.ts` |
| POST | `/api/Activity/booking/setOnSale` | `src/api/activity/index.ts` |
| POST | `/api/Activity/del` | `src/api/activity/index.ts` |
| POST | `/api/Activity/edit` | `src/api/activity/index.ts` |
| POST | `/api/Activity/index` | `src/api/activity/index.ts` |
| POST | `/api/Activity/setOnSale` | `src/api/activity/index.ts` |
| POST | `/api/Advertisement/add` | `src/api/operate/poster.ts` |
| POST | `/api/Advertisement/del` | `src/api/operate/poster.ts` |
| POST | `/api/Advertisement/edit` | `src/api/operate/poster.ts` |
| GET | `/api/Advertisement/index` | `src/api/operate/poster.ts` |
| POST | `/api/Advertisement/putOn` | `src/api/operate/poster.ts` |
| POST | `/api/Advertisement/takeOff` | `src/api/operate/poster.ts` |
| POST | `/api/AppUser/ban` | `src/api/operate/user.ts` |
| POST | `/api/AppUser/del` | `src/api/operate/user.ts` |
| GET | `/api/AppUser/detail` | `src/api/operate/user.ts` |
| POST | `/api/AppUser/edit` | `src/api/operate/user.ts` |
| GET | `/api/AppUser/index` | `src/api/operate/user.ts` |
| POST | `/api/AppUser/unban` | `src/api/operate/user.ts` |
| POST | `/api/Auth/add` | `src/api/system/auth.ts` |
| POST | `/api/Auth/authMenu` | `src/api/system/auth.ts` |
| POST | `/api/Auth/changeStatus` | `src/api/system/auth.ts` |
| POST | `/api/Auth/del` | `src/api/system/auth.ts` |
| POST | `/api/Auth/delMember` | `src/api/system/auth.ts` |
| POST | `/api/Auth/edit` | `src/api/system/auth.ts` |
| POST | `/api/Auth/editRule` | `src/api/system/auth.ts` |
| POST | `/api/Auth/getRuleList` | `src/api/system/auth.ts` |
| POST | `/api/Auth/groupUsers` | `src/api/system/auth.ts` |
| POST | `/api/Auth/index` | `src/api/system/auth.ts` |
| POST | `/api/Base/captcha` | `src/api/login.ts` |
| POST | `/api/Base/login` | `src/api/login.ts` |
| POST | `/api/BasePrivate/uploadFile` | `src/api/system/upload.ts` |
| GET | `/api/BasePrivate/userData` | `src/api/login.ts` |
| POST | `/api/BasePrivate/userEditData` | `src/api/system/user.ts` |
| POST | `/api/Category/add` | `src/api/goods/category.ts` |
| POST | `/api/Category/del` | `src/api/goods/category.ts` |
| POST | `/api/Category/edit` | `src/api/goods/category.ts` |
| POST | `/api/Category/index` | `src/api/goods/category.ts` |
| POST | `/api/Coin/add` | `src/api/promotion/recharge.ts` |
| GET | `/api/Coin/del` | `src/api/promotion/recharge.ts` |
| POST | `/api/Coin/edit` | `src/api/promotion/recharge.ts` |
| GET | `/api/Coin/index` | `src/api/promotion/recharge.ts` |
| POST | `/api/Dictionary/add` | `src/api/system/dictionary.ts` |
| POST | `/api/Dictionary/changeStatus` | `src/api/system/dictionary.ts` |
| GET | `/api/Dictionary/del` | `src/api/system/dictionary.ts` |
| POST | `/api/Dictionary/edit` | `src/api/system/dictionary.ts` |
| GET | `/api/Dictionary/getDictSn` | `src/api/goods/specs.ts` |
| POST | `/api/Dictionary/index` | `src/api/system/dictionary.ts` |
| POST | `/api/GroupOrder/changeShippingStatus` | `src/api/order-manage/order.ts` |
| POST | `/api/GroupOrder/crowd/index` | `src/api/order-manage/order.ts` |
| POST | `/api/GroupOrder/goods/index` | `src/api/order-manage/order.ts` |
| POST | `/api/GroupOrder/group/index` | `src/api/order-manage/order.ts` |
| POST | `/api/GroupOrder/index` | `src/api/order-manage/order.ts` |
| POST | `/api/GroupOrder/refundAudit` | `src/api/order-manage/order.ts` |
| GET | `/api/IntegralRecord/index` | `src/api/operate/user.ts` |
| GET | `/api/Log/del` | `src/api/system/log.ts` |
| POST | `/api/Log/index` | `src/api/system/log.ts` |
| POST | `/api/Menu/add` | `src/api/system/menu.ts` |
| GET | `/api/Menu/del` | `src/api/system/menu.ts` |
| DELETE | `/api/Menu/deleteByIds` | `src/api/system/menu.ts` |
| POST | `/api/Menu/edit` | `src/api/system/menu.ts` |
| GET | `/api/Menu/index` | `src/api/system/menu.ts` |
| POST | `/api/Msg/add` | `src/api/operate/message.ts` |
| POST | `/api/Msg/changeStatus` | `src/api/operate/message.ts` |
| POST | `/api/Msg/del` | `src/api/operate/message.ts` |
| POST | `/api/Msg/edit` | `src/api/operate/message.ts` |
| POST | `/api/Msg/index` | `src/api/operate/message.ts` |
| POST | `/api/Notification/add` | `src/api/operate/message.ts` |
| POST | `/api/Notification/changeStatus` | `src/api/operate/message.ts` |
| POST | `/api/Notification/del` | `src/api/operate/message.ts` |
| POST | `/api/Notification/index` | `src/api/operate/message.ts` |
| POST | `/api/Post/add` | `src/api/community/updates.ts` |
| POST | `/api/Post/del` | `src/api/community/updates.ts` |
| POST | `/api/Post/details` | `src/api/community/updates.ts` |
| POST | `/api/Post/edit` | `src/api/community/updates.ts` |
| GET | `/api/Post/index` | `src/api/community/updates.ts` |
| POST | `/api/Product/add` | `src/api/goods/center.ts` |
| POST | `/api/Product/center/index` | `src/api/goods/center.ts` |
| POST | `/api/Product/changeStatus` | `src/api/goods/center.ts` |
| GET | `/api/Product/del` | `src/api/goods/center.ts` |
| GET | `/api/Product/details` | `src/api/goods/center.ts` |
| POST | `/api/Product/edit` | `src/api/goods/center.ts` |
| POST | `/api/Product/index` | `src/api/goods/list.ts` |
| POST | `/api/RechargeOrder/index` | `src/api/order-manage/order.ts` |
| POST | `/api/SceneRule/add` | `src/api/promotion/rule.ts` |
| POST | `/api/SceneRule/del` | `src/api/promotion/rule.ts` |
| POST | `/api/SceneRule/edit` | `src/api/promotion/rule.ts` |
| POST | `/api/SceneRule/index` | `src/api/promotion/rule.ts` |
| POST | `/api/Spec/add` | `src/api/goods/specs.ts` |
| POST | `/api/Spec/del` | `src/api/goods/specs.ts` |
| GET | `/api/Spec/details` | `src/api/goods/specs.ts` |
| POST | `/api/Spec/edit` | `src/api/goods/specs.ts` |
| GET | `/api/Spec/getById` | `src/api/goods/specs.ts` |
| GET | `/api/Spec/index/details` | `src/api/goods/center.ts` |
| POST | `/api/Statistic/detail` | `src/api/operate/graph.ts` |
| POST | `/api/Topic/add` | `src/api/community/topic.ts` |
| POST | `/api/Topic/del` | `src/api/community/topic.ts` |
| POST | `/api/Topic/details` | `src/api/community/topic.ts` |
| POST | `/api/Topic/edit` | `src/api/community/topic.ts` |
| POST | `/api/Topic/index` | `src/api/community/topic.ts` |
| POST | `/api/User/add` | `src/api/system/user.ts` |
| GET | `/api/User/changeStatus` | `src/api/system/user.ts` |
| GET | `/api/User/del` | `src/api/system/user.ts` |
| POST | `/api/User/edit` | `src/api/system/user.ts` |
| POST | `/api/User/index` | `src/api/system/user.ts` |
| POST | `/api/User/logout` | `src/api/login.ts` |
