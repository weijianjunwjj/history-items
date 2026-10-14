type IFormType = 'input' | 'password' | 'select' | 'datepicker'

export interface IFormItem {
  field: string
  type: IFormType
  label: string
  // 先注释 为了后面的验证
  rules?: any[]
  trigger?: any[]
  placeholder?: any
  // 针对select
  options?: any[]
  // 针对特殊的属性
  otherOptions?: any
  isHidden?: boolean
}

export interface IForm {
  // 每一项的属性
  formItems: IFormItem[]
  // col占多少
  colLayout?: any
  // 单独一项的样式
  itemLayout?: any
}
