import { Ref } from 'nuxt/dist/app/compat/vue-demi'

export function useTransform(
  imgDom: Ref,
  imgUrl: string,
  transform: 'translateY' | 'translateX' = 'translateX',
  timerSpeed: 100,
  num1 = 10,
  num2 = 120,
  endValue = 200,
  countChange = 10,
  rCountChange = 15
) {
  const count = ref<number>(num1)
  const rCount = ref<number>(num2)
  const timer = ref<any>(null)

  function animationFn() {
    clearInterval(timer.value)
    timer.value = setInterval(() => {
      if (count.value >= num1 && count.value < num2) {
        count.value += countChange
        imgDom.value.style.transform = `${transform}(${count.value}%)`
      } else if (count.value === num2) {
        imgDom.value.src = replaceImgUrl(imgUrl)
        rCount.value -= rCountChange
        count.value += countChange
      } else if (count.value > num2 && count.value <= endValue) {
        imgDom.value.style.transform = `${transform}(${rCount.value}%)`
        rCount.value -= rCountChange
        count.value += countChange
      } else {
        clearInterval(timer.value)
        count.value = num1
        rCount.value = num2
      }
    }, timerSpeed)
  }

  return { animationFn }
}
