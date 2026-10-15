export interface SpecValueDraft {
  key: string;
  label: string;
  id: number;
}

export interface SpecDraft {
  key: string;
  dictionaryId: number | null;
  specVal: SpecValueDraft[];
}

export interface SpecForm {
  categoryId: number | null;
  specs: SpecDraft[];
}

export interface SpecNameOption {
  label: string;
  value: number;
}

export interface CategoryNode {
  id: number;
  name: string;
  children?: CategoryNode[];
}

export interface CategoryOption {
  label: string;
  value: number;
  children?: CategoryOption[];
}

export interface SpecRecord {
  spec: Array<{
    dictionaryId: number | string;
    specVal: Array<{ val: string; id: number }>;
  }>;
}

export interface SpecPayload {
  categoryId: number;
  spec: Array<{
    dictionaryId: number;
    specVal: Array<{ val: string; id?: number }>;
  }>;
}

let nextKey = 0;
const createKey = () => `spec-${++nextKey}`;

export function createSpecValue(label = '', id = 0): SpecValueDraft {
  return { key: createKey(), label, id };
}

export function createSpec(): SpecDraft {
  return { key: createKey(), dictionaryId: null, specVal: [createSpecValue()] };
}

export function toCategoryOptions(nodes: CategoryNode[]): CategoryOption[] {
  return nodes.map(node => ({
    label: node.name,
    value: Number(node.id),
    ...(node.children?.length ? { children: toCategoryOptions(node.children) } : {}),
  }));
}

// 沿用 getById 的 record.spec[].specVal[] 结构，读取所有规格。
export function toSpecDrafts(records: SpecRecord[] | null): SpecDraft[] {
  if (records === null) return [];
  if (!Array.isArray(records)) throw new Error('规格数据格式异常');
  return records.flatMap(record => {
    if (!Array.isArray(record.spec)) throw new Error('规格数据格式异常');
    return record.spec.map(spec => {
      const dictionaryId = Number(spec.dictionaryId);
      if (!Number.isInteger(dictionaryId) || dictionaryId <= 0 || !Array.isArray(spec.specVal)) {
        throw new Error('规格数据格式异常');
      }
      return {
        key: createKey(),
        dictionaryId,
        specVal: spec.specVal.length
          ? spec.specVal.map(value => createSpecValue(value.val, Number(value.id) || 0))
          : [createSpecValue()],
      };
    });
  });
}

export function getSpecNameError(form: SpecForm, names: SpecNameOption[], index: number): string | null {
  const id = form.specs[index].dictionaryId;
  if (id === null) return '请选择规格名称';
  if (!names.some(option => option.value === id)) return '请选择有效的规格名称';
  if (form.specs.some((spec, otherIndex) => otherIndex !== index && spec.dictionaryId === id)) {
    return '规格名称不能重复';
  }
  return null;
}

export function getSpecFormError(form: SpecForm, names: SpecNameOption[]): string | null {
  if (form.categoryId === null || !Number.isInteger(form.categoryId) || form.categoryId <= 0) {
    return '请选择商品类目';
  }
  if (!form.specs.length) return '请至少添加一个规格';
  for (const [index, spec] of form.specs.entries()) {
    const nameError = getSpecNameError(form, names, index);
    if (nameError) return `第 ${index + 1} 个规格：${nameError}`;
    if (!spec.specVal.length || spec.specVal.some(value => !value.label.trim())) {
      return `第 ${index + 1} 个规格：请填写每个规格值`;
    }
  }
  return null;
}

export function toSpecPayload(form: SpecForm, isEdit: boolean): SpecPayload {
  if (form.categoryId === null) throw new Error('请选择商品类目');
  return {
    categoryId: form.categoryId,
    spec: form.specs.map(spec => {
      if (spec.dictionaryId === null) throw new Error('请选择规格名称');
      return {
        dictionaryId: spec.dictionaryId,
        specVal: spec.specVal.map(value => ({
          val: value.label.trim(),
          ...(isEdit ? { id: value.id } : {}),
        })),
      };
    }),
  };
}
