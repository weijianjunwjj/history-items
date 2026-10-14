-- v0.8 local replay schema. All sample records are synthetic.
CREATE TABLE workspace_meta(id INTEGER PRIMARY KEY CHECK(id=1), revision INTEGER NOT NULL);
INSERT INTO workspace_meta VALUES(1,0);
CREATE TABLE workspace_state(
 area TEXT NOT NULL CHECK(area IN ('local','session')),
 key TEXT NOT NULL, value TEXT CHECK(value IS NULL OR json_valid(value)),
 revision INTEGER NOT NULL, updated_at TEXT NOT NULL,
 PRIMARY KEY(area,key)
) STRICT;
-- Null values are tombstones: stale clients cannot resurrect a deleted entry silently.
CREATE TABLE committed_requests(id TEXT PRIMARY KEY, body_hash TEXT NOT NULL, response TEXT NOT NULL CHECK(json_valid(response))) STRICT;
CREATE TABLE crm_activities(id TEXT PRIMARY KEY, name TEXT NOT NULL, game_product_id TEXT NOT NULL,
 status TEXT NOT NULL, document TEXT NOT NULL CHECK(json_valid(document))) STRICT;
CREATE TABLE crm_prizes(activity_id TEXT NOT NULL REFERENCES crm_activities(id) ON DELETE CASCADE,
 group_id TEXT NOT NULL, id TEXT NOT NULL, name TEXT NOT NULL, probability REAL NOT NULL,
 sort_order INTEGER NOT NULL, document TEXT NOT NULL CHECK(json_valid(document)),
 PRIMARY KEY(activity_id,group_id,id)) STRICT;
CREATE TABLE report_fields(id TEXT PRIMARY KEY, alias TEXT NOT NULL, product TEXT NOT NULL,
 document TEXT NOT NULL CHECK(json_valid(document)), UNIQUE(product,alias)) STRICT;
CREATE TABLE report_events(id TEXT PRIMARY KEY, alias TEXT NOT NULL, product TEXT NOT NULL,
 revision INTEGER NOT NULL, document TEXT NOT NULL CHECK(json_valid(document)), UNIQUE(product,alias)) STRICT;
CREATE TABLE behavior_records(id TEXT PRIMARY KEY, day TEXT NOT NULL, timestamp TEXT NOT NULL,
 module TEXT NOT NULL, device_id TEXT NOT NULL, channel TEXT NOT NULL, os TEXT NOT NULL,
 status TEXT NOT NULL, document TEXT NOT NULL CHECK(json_valid(document))) STRICT;
CREATE INDEX behavior_scope ON behavior_records(day,module,device_id);
CREATE INDEX behavior_device ON behavior_records(device_id,day);
CREATE TABLE sdk_samples(id TEXT PRIMARY KEY, event_id TEXT NOT NULL, day TEXT NOT NULL,
 minute INTEGER NOT NULL CHECK(minute>=0 AND minute<720), region TEXT NOT NULL,
 product TEXT NOT NULL, device_id TEXT NOT NULL, os TEXT NOT NULL,
 reports INTEGER NOT NULL CHECK(reports>0)) STRICT;
CREATE INDEX sdk_scope ON sdk_samples(event_id,region,day,minute,os,product);
CREATE INDEX sdk_device ON sdk_samples(device_id,day);
CREATE TABLE seed_versions(name TEXT PRIMARY KEY, applied_at TEXT NOT NULL) STRICT;
