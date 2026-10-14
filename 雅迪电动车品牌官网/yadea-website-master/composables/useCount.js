export function useCounts() {
  const cyclingMileage = ref(243046739758)
  const carbonEmission = ref(243046739758)
  const plantingTrees = ref(243046739758)
  const basicTime = Date.parse(new Date('2022/03/15 00:00:00').toString())
  setInterval(() => {
    // 里程
    const nowTime = Date.parse(new Date().toString())
    const time = (nowTime - basicTime) / 1000
    // cyclingMileage.value = (243046739758 + time * (1400000 / 365 / 24 / 60 / 60)) * (10 / 864000) * time
    cyclingMileage.value = 243046739758 + (600 / 360 / 24 / 60 / 60 + 6000) * time * (1 / 4) * (1 / 4) * (10 / 24 / 60 / 60) * 10000

    // 碳排放
    // 骑行里程*0.07*2.7-骑行里程*0.02*0.785
    carbonEmission.value = cyclingMileage.value * 0.07 * 2.7 - cyclingMileage.value * 0.02 * 0.785

    // 种植树木
    plantingTrees.value = carbonEmission.value / 20
  }, 5000)
  return { cyclingMileage, carbonEmission, plantingTrees }
}
