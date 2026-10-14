export const getOpts = (num: number) => {
  const get = (_num: number) => {
    return `${_num}px`
  }

  const three = [
    {
      label: `${num} (默认)`,
      value: get(num),
    },
    {
      label: `${num + 2}`,
      value: get(num + 2),
    },
    {
      label: `${num + 4}`,
      value: get(num + 4),
    },
  ]

  if (num <= 13) {
    return [...three]
  }

  if (num <= 15) {
    return [
      {
        label: `${num - 2}`,
        value: get(num - 2),
      },
      ...three,
    ]
  }

  return [
    {
      label: `${num - 4}`,
      value: get(num - 4),
    },
    {
      label: `${num - 2}`,
      value: get(num - 2),
    },
    ...three,
  ]
}

export const cardsSize = {
  titleSize: '',
  descSize: '',
}

export const intro = {
  intro1: {
    text: '点击圆圈，即刻连线客服报修',
  },
  intro2: {
    text: '点击此处，使用全部功能',
  },
}
