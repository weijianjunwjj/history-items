import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import { Script } from 'node:vm';
import ts from 'typescript';
import * as vue from 'vue';

const require = createRequire(import.meta.url);
const { parse, compileScript, compileTemplate } = require('vue/compiler-sfc');
const pagePath = new URL('../src/view/goods/specs/index.vue', import.meta.url);
const dataPath = new URL('../src/view/goods/specs/data.ts', import.meta.url);

function evaluate(source, dependencies = {}) {
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  const wrapper = new Script(`(function(require, module, exports) { ${compiled}\n})`).runInThisContext();
  wrapper(name => name in dependencies ? dependencies[name] : require(name), module, module.exports);
  return module.exports;
}

const data = evaluate(readFileSync(dataPath, 'utf8'));
const descriptor = parse(readFileSync(pagePath, 'utf8')).descriptor;
const script = compileScript(descriptor, { id: 'specs-test' });
const names = [{ label: '颜色', value: 1 }, { label: '尺码', value: 2 }];
const records = (id = 1, val = '红', valueId = 11) => [
  { spec: [{ dictionaryId: id, specVal: [{ val, id: valueId }] }] },
];
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const settle = () => new Promise(resolve => setImmediate(resolve));

async function page(overrides = {}) {
  const calls = [], notices = [];
  let mount, unmount;
  const api = {
    getSpecsNames: async () => ({ data: { list: names } }),
    fetchList: async () => ({ data: [] }),
    add: async payload => { calls.push(['add', payload]); },
    edit: async payload => { calls.push(['edit', payload]); },
    ...overrides,
  };
  const component = evaluate(script.content, {
    vue: { ...vue, onMounted: fn => { mount = fn; }, onBeforeUnmount: fn => { unmount = fn; } },
    'naive-ui': { useMessage: () => Object.fromEntries(['success', 'warning', 'error'].map(kind => [kind, text => notices.push([kind, text])])) },
    '@vicons/ionicons5': { RemoveCircleOutline: {} },
    '@/api/goods/category': { getCategory: async () => ({ data: { list: [{ id: 5, name: '服装' }] } }) },
    '@/api/goods/specs': api,
    './data': data,
  }).default;
  const state = component.setup({}, { expose() {} });
  state.formRef.value = { validate: async () => {}, restoreValidation() {} };
  await mount();
  return { ...state, calls, notices, unmount };
}

test('SFC template compiles with the actual setup bindings', () => {
  const template = compileTemplate({ source: descriptor.template.content, filename: 'index.vue', id: 'specs-test', compilerOptions: { bindingMetadata: script.bindings } });
  assert.deepEqual(template.errors, []);
});

test('response conversion reads every spec, preserves IDs and creates stable unique keys', () => {
  const specs = data.toSpecDrafts([{ spec: [...records()[0].spec, ...records(2, 'M', 22)[0].spec] }]);
  assert.equal(specs.length, 2);
  assert.equal(specs[1].specVal[0].id, 22);
  const keys = specs.flatMap(spec => [spec.key, ...spec.specVal.map(value => value.key)]);
  assert.equal(new Set(keys).size, keys.length);
  assert.throws(() => data.toSpecDrafts({}), /格式异常/);
});

test('mixed blank values, whitespace and duplicate names are rejected; payload contains no UI keys', () => {
  const form = { categoryId: 5, specs: data.toSpecDrafts(records()) };
  form.specs[0].specVal.push(data.createSpecValue('   '));
  assert.match(data.getSpecFormError(form, names), /每个规格值/);
  form.specs[0].specVal.pop();
  form.specs.push(data.toSpecDrafts(records())[0]);
  assert.match(data.getSpecFormError(form, names), /不能重复/);
  form.specs.pop();
  form.specs[0].specVal[0].label = ' 红 ';
  assert.deepEqual(data.toSpecPayload(form, false), { categoryId: 5, spec: [{ dictionaryId: 1, specVal: [{ val: '红' }] }] });
  assert.deepEqual(data.toSpecPayload(form, true).spec[0].specVal, [{ val: '红', id: 11 }]);
});

test('category options handle leaves and deeper trees', () => {
  assert.deepEqual(data.toCategoryOptions([{ id: 1, name: 'A', children: [{ id: 2, name: 'B', children: [{ id: 3, name: 'C' }] }] }]), [
    { value: 1, label: 'A', children: [{ value: 2, label: 'B', children: [{ value: 3, label: 'C' }] }] },
  ]);
});

test('new category uses add, refreshes IDs, then uses edit', async () => {
  let saved = false;
  const state = await page({
    fetchList: async () => ({ data: saved ? records() : [] }),
    add: async payload => { state.calls.push(['add', payload]); saved = true; },
  });
  state.handleCategoryChange(5);
  await settle();
  state.addSpec();
  state.form.specs[0].dictionaryId = 1;
  state.form.specs[0].specVal[0].label = '红';
  await state.onSave();
  assert.equal(state.calls[0][0], 'add');
  assert.equal(state.form.specs[0].specVal[0].id, 11);
  await state.onSave();
  assert.equal(state.calls[1][0], 'edit');
  assert.equal(state.calls[1][1].spec[0].specVal[0].id, 11);
});

test('changing and removing selections immediately frees the correct options', async () => {
  const state = await page({ fetchList: async () => ({ data: records() }) });
  state.handleCategoryChange(5);
  await settle();
  state.addSpec();
  assert.equal(state.getSpecOptions(null)[0].disabled, true);
  assert.equal(state.getSpecOptions(1)[0].disabled, false);
  state.form.specs[0].dictionaryId = 2;
  assert.equal(state.getSpecOptions(null)[0].disabled, false);
  assert.equal(state.getSpecOptions(null)[1].disabled, true);
  state.removeSpec(0);
  assert.ok(state.getSpecOptions(null).every(option => !option.disabled));
});

test('value deletion targets the chosen value and keeps at least one', async () => {
  const state = await page({ fetchList: async () => ({ data: records() }) });
  state.handleCategoryChange(5);
  await settle();
  const spec = state.form.specs[0];
  state.addSpecValue(spec);
  spec.specVal[1].label = '蓝';
  const remainingKey = spec.specVal[1].key;
  state.removeSpecValue(spec, 0);
  assert.equal(spec.specVal[0].label, '蓝');
  assert.equal(spec.specVal[0].key, remainingKey);
  state.removeSpecValue(spec, 0);
  assert.equal(spec.specVal.length, 1);
});

test('latest category wins even when responses arrive out of order; clear invalidates requests', async () => {
  const first = deferred(), second = deferred(), third = deferred();
  const state = await page({ fetchList: id => id === 5 ? first.promise : id === 6 ? second.promise : third.promise });
  state.handleCategoryChange(5);
  state.handleCategoryChange(6);
  second.resolve({ data: records(2, 'M', 22) });
  await settle();
  first.resolve({ data: records() });
  await settle();
  assert.equal(state.form.categoryId, 6);
  assert.equal(state.form.specs[0].dictionaryId, 2);
  assert.equal(state.loading.value, false);
  state.handleCategoryChange(7);
  state.handleCategoryChange(null);
  third.resolve({ data: records() });
  await settle();
  assert.deepEqual(state.form.specs, []);
  assert.equal(state.loading.value, false);
});

test('duplicate clicks are locked before async validation; save failure unlocks for retry', async () => {
  const pendingValidation = deferred();
  let attempts = 0;
  const state = await page({ fetchList: async () => ({ data: records() }), edit: async () => { attempts++; throw new Error('network'); } });
  state.handleCategoryChange(5);
  await settle();
  state.formRef.value.validate = () => pendingValidation.promise;
  const firstSave = state.onSave();
  await state.onSave();
  assert.equal(state.saving.value, true);
  pendingValidation.resolve();
  await firstSave;
  assert.equal(attempts, 1);
  assert.equal(state.saving.value, false);
  await state.onSave();
  assert.equal(attempts, 2);
});

test('failed validation never submits and releases the save lock', async () => {
  const state = await page({ fetchList: async () => ({ data: records() }) });
  state.handleCategoryChange(5);
  await settle();
  state.formRef.value.validate = async () => { throw []; };
  await state.onSave();
  assert.equal(state.calls.length, 0);
  assert.equal(state.saving.value, false);
});

test('failed refresh after save blocks further writes until a successful reload', async () => {
  let fetches = 0;
  const state = await page({ fetchList: async () => {
    if (++fetches === 2) throw new Error('network');
    return { data: records() };
  } });
  state.handleCategoryChange(5);
  await settle();
  await state.onSave();
  assert.equal(state.loadFailed.value, true);
  assert.equal(state.form.specs[0].specVal[0].id, 11);
  await state.onSave();
  assert.equal(state.calls.length, 1);
  state.retryLoad();
  await settle();
  assert.equal(state.loadFailed.value, false);
  await state.onSave();
  assert.equal(state.calls.length, 2);
});

test('request finishing after unmount does not update page state', async () => {
  const request = deferred();
  const state = await page({ fetchList: () => request.promise });
  state.handleCategoryChange(5);
  state.unmount();
  request.resolve({ data: records() });
  await settle();
  assert.deepEqual(state.form.specs, []);
});
