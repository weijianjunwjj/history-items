const notifyCustomList = ref([
  {
    icon: '/static/images/system/logistics.png',
    title: 'Logistics Services',
    type: 1,
  },
  {
    icon: '/static/images/system/service.png',
    title: 'Service Notification',
    type: 2,
  },
  {
    icon: '/static/images/system/dynamic.png',
    title: 'Dynamic Notification',
    type: 3,
  },
  {
    icon: '/static/images/system/system.png',
    title: 'System Notification',
    type: 4,
  },
  {
    icon: '/static/images/system/follow.png',
    title: 'Follow Notification',
    type: 7,
  },
])
const notifyFormat = notifyCustomList.value.reduce((item, vt) => {
  item[vt.type] = {
    icon: vt.icon,
    title: vt.title,
  }
  return item
}, {})

export {
  notifyCustomList,
  notifyFormat
}