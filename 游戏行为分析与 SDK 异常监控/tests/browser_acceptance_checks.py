"""真实 HTTP / SQLite 的补充验收；只操作隔离测试库中的页面。"""

from pathlib import Path
import json

from playwright.sync_api import expect


ROOT = Path(__file__).resolve().parents[1]


def run_extra(page, ctx, base, settled, data, ok, out):
    """由 browser_local.py 调用，复用其服务、浏览器和 SQL 等待函数。"""
    out = Path(out)
    extra_pages = []
    phase = "开始"

    def nav(path):
        page.locator(f'[data-shell="nav"][data-path="{path}"]').click()
        settled(page)

    def rp(name, attrs=""):
        return page.locator(f'[data-act="rp-{name}"]{attrs}').first

    def step(number):
        rp("step", f'[data-step="{number}"]').click()

    def panel(name):
        rp("panel", f'[data-panel="{name}"]').click()

    def item(node_id):
        rp("select-item", f'[data-id="{node_id}"]').click()

    def add_node(field_id):
        page.locator("#rp-library-select").select_option(field_id)
        rp("add-node").click()
        return page.locator(".rp-tree-node.selected").get_attribute("data-tree-id")

    def add_item(node_id):
        rp("add-item", f'[data-id="{node_id}"]').click()

    def sm(name, attrs=""):
        return page.locator(f'[data-act="sm-{name}"]{attrs}').first

    def cards():
        return page.locator(".sm-grid > .sm-card").evaluate_all(
            "els => els.map(x => x.dataset.cardId)"
        )

    def wait_cards(expected):
        rendered_cards = page.locator(".sm-grid > .sm-card")
        expect(rendered_cards).to_have_count(len(expected))
        for index, card_id in enumerate(expected):
            expect(rendered_cards.nth(index)).to_have_attribute("data-card-id", card_id)

    def chosen():
        return page.locator("[data-sm-selected]").evaluate_all(
            "els => els.map(x => x.dataset.smSelected)"
        )

    def values(workspace, area):
        return {row["key"]: row["value"] for row in workspace["stores"][area]}

    def save_download(target, action, filename):
        with target.expect_download() as download:
            action.click()
        path = out / filename
        download.value.save_as(str(path))
        return json.loads(path.read_text(encoding="utf-8"))

    try:
        # 独立 EBI 入口可能写入自己的查询设置；先取得最新键版本。
        page.reload()
        settled(page)

        phase = "CRM奖品缓存、概率、草稿与正式保存"
        nav("/crm/activities")
        if page.locator('[data-act="crm-back"]').count():
            page.locator('[data-act="crm-back"]').click()
        settled(page)
        prior_crm = values(data()["workspace"], "local")["crm:data"]
        page.locator('[data-act="crm-edit"][data-id="DEMO-CFG-001"]').click()
        page.locator('[data-act="crm-step"][data-step="0"]').click()
        page.locator("#crm-base-configName").fill("本机SQL完整CRM验收")
        page.locator('[data-act="crm-next"]').click()
        page.locator('[data-act="crm-select-prize"][data-pid="P-01"]').click()
        page.locator("#crm-prize-name").fill("本机SQL奖品A独立缓存")
        page.locator("#crm-prize-stock").fill("250")
        page.locator('[data-act="crm-select-prize"][data-pid="P-02"]').click()
        expect(page.locator("#crm-prize-name")).to_have_value("游戏道具礼包")
        expect(page.locator("#crm-prize-stock")).to_have_value("600")
        page.locator('[data-act="crm-select-prize"][data-pid="P-01"]').click()
        expect(page.locator("#crm-prize-name")).to_have_value("本机SQL奖品A独立缓存")
        expect(page.locator("#crm-prize-stock")).to_have_value("250")
        page.locator("#crm-prize-probability").fill("60")
        page.locator('[data-act="crm-next"]').click()
        expect(page.locator(".crm-errors")).to_contain_text("总概率不能超过 100%")
        expect(page.locator(".crm-step.active")).to_contain_text("奖品设置")
        expect(page.locator(".crm-prob-summary.over strong")).to_contain_text("110%")
        page.locator("#crm-prize-probability").fill("20")
        page.locator('[data-act="crm-validate"]').click()
        expect(page.locator("#toast")).to_contain_text("全部配置校验通过")
        expect(page.locator(".crm-errors")).to_have_count(0)
        page.locator('[data-act="crm-move"][data-pid="P-01"][data-to="1"]').click()
        expect(page.locator(".crm-product").first.locator(".crm-prize-node").first).to_have_attribute("data-prize-id", "P-02")
        expect(page.locator("#crm-prize-name")).to_have_value("本机SQL奖品A独立缓存")
        expect(page.locator("#crm-prize-stock")).to_have_value("250")
        nav("/ebi/funnel")
        expect(page.locator("h1")).to_have_text("漏斗详情")
        nav("/crm/activities")
        expect(page.locator("#crm-prize-name")).to_have_value("本机SQL奖品A独立缓存")
        expect(page.locator("#crm-prize-stock")).to_have_value("250")
        expect(page.locator("#crm-prize-probability")).to_have_value("20")
        lifecycle = page.evaluate("() => window.__REPLAY_DEBUG__.snapshot().log")
        crm_events = [entry["event"] for entry in lifecycle if entry["app"] == "crm"]
        assert crm_events[-2:] == ["unmount", "mount"], crm_events
        page.locator('[data-act="crm-next"]').click()
        page.locator("#crm-base-rewardRule").fill("")
        page.locator('[data-act="crm-save"]').click()
        expect(page.locator(".crm-errors")).to_contain_text("请填写领奖规则")
        settled(page)
        assert values(data()["workspace"], "local")["crm:data"] == prior_crm, "非法草稿不得改动正式CRM配置"
        rule = "本机SQL验收领奖规则；全部为模拟，不实际发奖。"
        page.locator("#crm-base-rewardRule").fill(rule)
        page.locator('[data-act="crm-save"]').click()
        expect(page.locator("#toast")).to_contain_text("已保存")
        settled(page)
        saved_crm = json.loads(values(data()["workspace"], "local")["crm:data"])
        activity = next(row for row in saved_crm["activities"] if row["id"] == "DEMO-CFG-001")
        assert activity["configName"] == "本机SQL完整CRM验收" and activity["rewardRule"] == rule
        assert [prize["id"] for prize in activity["groups"][0]["prizes"]] == ["P-02", "P-01"]
        assert sum(float(prize["probability"]) for prize in activity["groups"][0]["prizes"]) == 70
        page.reload()
        settled(page)
        expect(page.locator("#crm-base-rewardRule")).to_have_value(rule)
        page.locator('[data-act="crm-back"]').click()
        expect(page.locator(".crm-activity-table")).to_contain_text("本机SQL完整CRM验收")
        expect(page.locator(".crm-draft-banner")).to_have_count(0)
        page.locator('[data-act="crm-edit"][data-id="DEMO-CFG-001"]').click()
        page.locator('[data-act="crm-step"][data-step="0"]').click()
        expect(page.locator("#crm-base-configName")).to_have_value("本机SQL完整CRM验收")
        page.locator('[data-act="crm-next"]').click()
        expect(page.locator(".crm-product").first.locator(".crm-prize-node").first).to_have_attribute("data-prize-id", "P-02")
        page.locator('[data-act="crm-select-prize"][data-pid="P-01"]').click()
        expect(page.locator("#crm-prize-name")).to_have_value("本机SQL奖品A独立缓存")
        expect(page.locator("#crm-prize-stock")).to_have_value("250")
        settled(page)
        page.screenshot(path=str(out / "extra-crm.png"), full_page=True)
        ok("X00 CRM奖品缓存/排序与跨应用草稿恢复，110%和空规则拦截，70%正式SQL保存刷新重开")

        phase = "日志树与三配置区域"
        nav("/report/events")
        rp("new-event").click()
        page.locator("#rp-base-name").fill("本机SQL三配置验收")
        page.locator("#rp-base-alias").fill("windows_sql_check")
        step(1)
        device = add_node("F-device")
        context = add_node("F-context")
        level = add_node("F-level")
        raw = add_node("F-raw")
        expect(page.locator(f'[data-tree-id="{level}"]')).to_have_attribute("data-depth", "2")
        rp("select-node", f'[data-id="{level}"]').click()
        page.locator("#rp-node-name").fill("本机SQL角色等级")
        rp("select-node", f'[data-id="{device}"]').click()
        rp("select-node", f'[data-id="{level}"]').click()
        expect(page.locator("#rp-node-name")).to_have_value("本机SQL角色等级")
        step(2)
        for node_id in (device, level, raw):
            add_item(node_id)
        item(device)
        page.locator("#rp-item-label").fill("")
        panel("query")
        expect(page.locator(".rp-errors")).to_contain_text("显示文案不能为空")
        expect(page.locator('.rp-zone-tabs [aria-selected="true"]')).to_contain_text("列表展示")
        page.locator("#rp-item-label").fill("本机列表设备")
        rp("move-item", f'[data-id="{level}"][data-to="0"]').click()
        expect(page.locator(".rp-config-item").first).to_have_attribute("data-item-id", level)
        panel("query")
        add_item(raw)
        expect(page.locator("#toast")).to_contain_text("不可作为查询条件")
        expect(page.locator(".rp-config-item")).to_have_count(0)
        add_item(context)
        expect(page.locator("#toast")).to_contain_text("不可作为查询条件")
        expect(page.locator(".rp-config-item")).to_have_count(0)
        for node_id in (device, level):
            add_item(node_id)
        item(device)
        page.locator("#rp-item-queryLabel").fill("本机查询设备")
        item(level)
        page.locator("#rp-item-operator").select_option("gte")
        panel("detail")
        for node_id in (level, device):
            add_item(node_id)
        item(device)
        page.locator("#rp-item-label").fill("本机详情设备")
        rp("save").click()
        expect(page.locator("#toast")).to_contain_text("已保存")
        settled(page)
        page.reload()
        settled(page)
        step(1)
        rp("select-node", f'[data-id="{level}"]').click()
        expect(page.locator("#rp-node-name")).to_have_value("本机SQL角色等级")
        expect(page.locator(f'[data-tree-id="{level}"]')).to_have_attribute("data-depth", "2")
        step(2)
        panel("list")
        expect(page.locator(".rp-config-item")).to_have_count(3)
        expect(page.locator(".rp-config-item").first).to_have_attribute("data-item-id", level)
        item(device)
        expect(page.locator("#rp-item-label")).to_have_value("本机列表设备")
        panel("query")
        expect(page.locator(".rp-config-item")).to_have_count(2)
        item(device)
        expect(page.locator("#rp-item-queryLabel")).to_have_value("本机查询设备")
        item(level)
        expect(page.locator("#rp-item-operator")).to_have_value("gte")
        panel("detail")
        expect(page.locator(".rp-config-item")).to_have_count(2)
        expect(page.locator(".rp-config-item").first).to_have_attribute("data-item-id", level)
        item(device)
        expect(page.locator("#rp-item-label")).to_have_value("本机详情设备")
        settled(page)
        stored_report = json.loads(values(data()["workspace"], "local")["report:data"])
        saved_event = next(e for e in stored_report["events"] if e["alias"] == "windows_sql_check")
        assert [x["nodeId"] for x in saved_event["panels"]["list"]] == [level, device, raw]
        assert saved_event["panels"]["query"][0]["queryConfig"]["label"] == "本机查询设备"
        assert saved_event["panels"]["detail"][1]["label"] == "本机详情设备"
        page.screenshot(path=str(out / "extra-report.png"), full_page=True)
        ok("X01 日志嵌套树与三配置区域SQL保存刷新恢复，非法查询和空文案拦截")

        phase = "SDK选择排序与告警"
        nav("/monitor/overview")
        expect(page.locator("h1")).to_have_text("实时异常事件监控")
        sm("choose").click()
        original = chosen()
        assert "account" not in original
        sm("choice-add", '[data-id="account"]').click()
        while chosen().index("account") > 0:
            target_index = chosen().index("account") - 1
            sm("choice-move", f'[data-id="account"][data-to="{target_index}"]').click()
        expected_cards = chosen()
        assert expected_cards == ["account"] + original
        sm("choice-confirm").click()
        expect(page.locator(".overlay")).to_have_count(0)
        settled(page)
        wait_cards(expected_cards)
        assert cards() == expected_cards
        sm("alerts", '[data-id="login"]').click()
        sm("process", '[data-status="done"]').click()
        expect(page.locator(".sm-error")).to_contain_text("请填写告警原因")
        page.locator("#sm-reason").fill("本机SQL告警原因")
        sm("process", '[data-status="processing"]').click()
        expect(page.locator('[data-card-id="login"] .sm-card-status')).to_contain_text("模拟处理中")
        settled(page)
        sm("alerts", '[data-id="login"]').click()
        expect(page.locator("#sm-reason")).to_have_value("本机SQL告警原因")
        page.locator("#sm-reason").fill("本机SQL处理完成")
        sm("process", '[data-status="done"]').click()
        expect(page.locator('[data-card-id="login"] .sm-badge')).to_have_text("0")
        settled(page)
        page.reload()
        settled(page)
        wait_cards(expected_cards)
        assert cards() == expected_cards
        expect(page.locator('[data-card-id="login"] .sm-badge')).to_have_text("0")
        expect(page.locator('[data-card-id="start"] .sm-badge')).to_have_text("4")
        sm("choose").click()
        assert chosen() == expected_cards
        page.keyboard.press("Escape")
        sm("alerts", '[data-id="login"]').click()
        expect(page.locator("#sm-reason")).to_have_value("本机SQL处理完成")
        expect(page.locator(".sm-alert-context")).to_contain_text("已完成")
        page.keyboard.press("Escape")
        page.screenshot(path=str(out / "extra-monitor.png"), full_page=True)
        ok("X02 SDK图表选择排序和模拟告警SQL保存刷新恢复，其他事件不串改")

        phase = "讲解卡"
        nav("/workbench/recap")
        page.locator('[data-act="wb-track"][data-track="report"]').click()
        expect(page.locator('[data-recap-field="business"]')).to_be_visible()
        page.locator('[data-recap-field="business"]').fill("本机SQL日志配置业务讲解")
        page.locator('[data-recap-field="contribution"]').fill("仅记录本次验收操作，不认领历史贡献")
        page.locator("#recap-state").select_option("uncertain")
        page.locator('[data-act="wb-save-recap"]').click()
        expect(page.locator("#recap-save-status")).to_contain_text("已保存")
        settled(page)
        page.reload()
        settled(page)
        expect(page.locator('[data-recap-field="business"]')).to_have_value("本机SQL日志配置业务讲解")
        expect(page.locator('[data-recap-field="contribution"]')).to_have_value("仅记录本次验收操作，不认领历史贡献")
        expect(page.locator("#recap-state")).to_have_value("uncertain")
        page.locator('[data-act="wb-track"][data-track="crm"]').click()
        expect(page.locator('[data-recap-field="business"]')).to_have_value("")
        settled(page)
        ok("X03 讲解卡保存刷新恢复，卡片文字与回忆状态隔离")

        phase = "独立入口"
        errors = []
        for app in ("crm", "report", "monitor", "journey", "workbench"):
            solo = ctx.new_page()
            extra_pages.append(solo)
            solo.on("pageerror", lambda error, app=app: errors.append(f"{app}: {error}"))
            solo.goto(f"{base}/apps/{app}/index.html")
            expect(solo.locator("h1")).to_be_visible()
            expect(solo.locator(".sidebar")).to_have_count(0)
            settled(solo)
            runtime = solo.evaluate("() => window.__REPLAY_DEBUG__.snapshot()")
            assert runtime["kind"] == "standalone-native-esm", (app, runtime)
            assert runtime["activeApp"] == app and runtime["registered"] == [app], runtime
            assert [e["event"] for e in runtime["log"][:2]] == ["bootstrap", "mount"], runtime
            solo.close()
            extra_pages.remove(solo)
        assert not errors, errors
        page.reload()
        settled(page)
        ok("X04 其余五个独立ESM入口启动并读取SQL，bootstrap/mount真实执行")

        phase = "v0.7导入"
        nav("/workbench/data")
        fixture = ROOT / "tests/fixtures/workspace-v07.json"
        expected_backup = json.loads(fixture.read_text(encoding="utf-8"))
        before = data()["workspace"]
        page.locator("#wb-backup-file").set_input_files(str(fixture))
        expect(page.locator(".wb-import-preview")).to_be_visible()
        expect(page.locator(".wb-import-preview")).to_contain_text("0.7.0")
        expect(page.locator('[data-act="wb-restore"]')).to_be_disabled()
        assert data()["workspace"] == before, "选择旧备份只预览，不得立即写库"
        page.locator("#wb-restore-confirm").check()
        save_download(page, page.locator('[data-act="wb-restore"]'), "extra-before-v07-restore.json")
        expect(page.locator(".wb-message")).to_contain_text("已恢复")
        settled(page)
        restored = data()["workspace"]
        for area in ("local", "session"):
            assert values(restored, area) == values(expected_backup, area), f"v0.7 {area} 必须逐键逐值恢复"
        saved_crm = json.loads(values(expected_backup, "local")["crm:data"])["activities"][0]
        draft_crm = json.loads(values(expected_backup, "session")["crm:workspace"])["workspace"]["draft"]
        saved_report = json.loads(values(expected_backup, "local")["report:data"])["events"][0]
        draft_report = json.loads(values(expected_backup, "session")["report:workspace"])["workspace"]["draft"]
        nav("/crm/activities")
        expect(page.locator("#crm-base-configName")).to_have_value(draft_crm["configName"])
        page.locator('[data-act="crm-back"]').click()
        expect(page.locator(".crm-activity-table")).to_contain_text(saved_crm["configName"])
        expect(page.locator(".crm-activity-table")).not_to_contain_text(draft_crm["configName"])
        page.locator('[data-act="review"]').click()
        fixture_note = json.loads(values(expected_backup, "local")["note:crm"])
        expect(page.locator("#replay-note")).to_have_value(fixture_note)
        page.keyboard.press("Escape")
        nav("/report/events")
        expect(page.locator("#rp-base-name")).to_have_value(draft_report["name"])
        rp("back").click()
        expect(page.locator(".rp-event-table")).to_contain_text(saved_report["name"])
        expect(page.locator(".rp-event-table")).not_to_contain_text(draft_report["name"])
        settled(page)
        ok("X05 v0.7工作区先预览再确认，SQL逐条恢复且正式配置/草稿/笔记不串改")

        phase = "双窗冲突和待写内容导出"
        nav("/crm/activities")
        if page.locator('[data-act="crm-back"]').count():
            page.locator('[data-act="crm-back"]').click()
        settled(page)
        page.locator('[data-act="review"]').click()
        fresh = ctx.new_page()
        extra_pages.append(fresh)
        fresh.goto(base + "/#/crm/activities")
        settled(fresh)
        fresh.locator('[data-act="review"]').click()
        fresh.locator("#replay-note").fill("新窗口已提交的笔记")
        fresh.locator('[data-act="save-note"]').click()
        expect(fresh.locator("#note-status")).to_contain_text("已保存")
        settled(fresh)
        page.locator("#replay-note").fill("旧窗口待导出的笔记")
        with page.expect_response(lambda response: response.url.endswith("/api/workspace/commit")) as response:
            page.locator('[data-act="save-note"]').click()
        assert response.value.status == 409, response.value.status
        expect(page.locator("#sql-connection")).to_have_attribute("data-state", "error")
        state = page.evaluate("() => window.__REPLAY_SQL__.snapshot()")
        assert state["conflict"] and state["pending"] > 0, state
        expect(page.locator("#note-status")).not_to_contain_text("已保存")
        expect(page.locator("#replay-note")).to_have_value("旧窗口待导出的笔记")
        assert json.loads(values(data()["workspace"], "local")["note:crm"]) == "新窗口已提交的笔记"
        page.keyboard.press("Escape")
        # 导出读取当前缓存；此处不调用 settled，以免等待故意保留的冲突写入。
        page.locator('[data-shell="nav"][data-path="/workbench/data"]').click()
        expect(page.locator("h1")).to_have_text("备份与运行检查")
        exported = save_download(page, page.locator('[data-act="wb-export-backup"]'), "extra-unsaved-conflict.json")
        assert json.loads(values(exported, "local")["note:crm"]) == "旧窗口待导出的笔记"
        assert json.loads(values(data()["workspace"], "local")["note:crm"]) == "新窗口已提交的笔记"
        page.screenshot(path=str(out / "extra-conflict.png"), full_page=True)
        fresh.close()
        extra_pages.remove(fresh)
        # 当前待写内容已经实际下载；刷新重新握手，保留SQL中的新窗口版本。
        page.reload()
        settled(page)
        assert json.loads(values(data()["workspace"], "local")["note:crm"]) == "新窗口已提交的笔记"
        ok("X06 双窗409不覆盖SQL新值，不假报成功，当前待写内容可导出后刷新")
    except Exception:
        (out / "extra-failure-phase.txt").write_text(phase, encoding="utf-8")
        page.screenshot(path=str(out / "extra-failure.png"), full_page=True)
        raise
    finally:
        for target in extra_pages:
            if not target.is_closed():
                target.close()
