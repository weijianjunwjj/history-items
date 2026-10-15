import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const requestMethods = { get: 'GET', post: 'POST', remove: 'DELETE' };

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : entry.name.endsWith('.ts') ? [path] : [];
  });
}

// Only static string expressions are accepted: a dynamic path must be made
// explicit instead of disappearing from the inventory silently.
function strings(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return [node.text];
  if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isTypeAssertionExpression(node)) return strings(node.expression);
  if (ts.isConditionalExpression(node)) return [...strings(node.whenTrue), ...strings(node.whenFalse)];
  if (ts.isTemplateExpression(node)) {
    let result = [node.head.text];
    for (const span of node.templateSpans) result = result.flatMap(prefix => strings(span.expression).map(value => prefix + value + span.literal.text));
    return result;
  }
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) return strings(node.left).flatMap(left => strings(node.right).map(right => left + right));
  throw new Error(`接口地址无法静态展开：${node.getText()}`);
}

export function collectEndpoints(root = projectRoot) {
  const endpoints = new Map();
  for (const filename of sourceFiles(join(root, 'src', 'api'))) {
    const file = relative(root, filename).replaceAll('\\', '/');
    const source = ts.createSourceFile(filename, readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const methods = new Map();
    for (const statement of source.statements) {
      if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier) || !statement.moduleSpecifier.text.endsWith('/http/request')) continue;
      const bindings = statement.importClause?.namedBindings;
      if (bindings && ts.isNamedImports(bindings)) for (const binding of bindings.elements) {
        const method = requestMethods[binding.propertyName?.text ?? binding.name.text];
        if (method) methods.set(binding.name.text, method);
      }
    }
    const visit = node => {
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && methods.has(node.expression.text) && node.arguments.length) {
        let paths;
        try { paths = strings(node.arguments[0]); } catch (error) {
          const { line } = source.getLineAndCharacterOfPosition(node.getStart(source));
          throw new Error(`${file}:${line + 1} ${error.message}`);
        }
        for (const rawPath of paths) {
          const method = methods.get(node.expression.text);
          const path = rawPath.replace(/^\/+|\/+$/g, '');
          if (!path || path.includes('${')) throw new Error(`${file} 包含无法解析的接口地址：${rawPath}`);
          const key = `${method} ${path}`;
          if (!endpoints.has(key)) endpoints.set(key, { method, path, file });
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  return [...endpoints.values()].sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method));
}

function documentation(endpoints) {
  const pathCount = new Set(endpoints.map(endpoint => endpoint.path)).size;
  const rows = endpoints.map(endpoint => `| ${endpoint.method} | \`/api/${endpoint.path}\` | \`${endpoint.file}\` |`).join('\n');
  return `# 本地后端接口清单

本清单由 \`node scripts/api-inventory.mjs --docs\` 使用 TypeScript AST 从 \`src/api\` 生成，忽略注释，展开模板地址中的新增/编辑分支，并按 HTTP 方法和地址去重。

当前共 **${endpoints.length} 个方法与地址组合**，对应 **${pathCount} 个唯一地址**。前端多个函数调用相同接口只计一次；相同地址的 GET 与 POST 分别计数。

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

运行 \`node --test tests/api-coverage.test.mjs\`，逐一检查下面的前端接口能被主 HTTP 路由或三个业务模块识别。测试使用独立内存数据库；缺少请求字段而触发的正常参数校验异常算作已识别，所有处理器均返回 \`undefined\` 才算接口遗漏。此检查验证路由覆盖；具体 CRUD、登录和持久化行为由后端集成测试验证。

## 接口列表

| 方法 | 地址 | 前端来源 |
| --- | --- | --- |
${rows}
`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const endpoints = collectEndpoints();
  console.log(`前端接口：${endpoints.length} 个方法与地址组合，${new Set(endpoints.map(endpoint => endpoint.path)).size} 个唯一地址。`);
  if (process.argv.includes('--docs')) {
    const path = join(projectRoot, 'docs', 'local-api.md');
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, documentation(endpoints), 'utf8');
    console.log(`已生成 ${relative(projectRoot, path).replaceAll('\\', '/')}`);
  }
}
