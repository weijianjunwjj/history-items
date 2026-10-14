import {getMessageList} from "@/service/chat/message";

class LocalMessageDataBase {
  private dbName: string;
  private dbPath: string;
  private limit = 100;
  private offset = 0;

  constructor(private customDbName ?: string, private customDbPath ?: string) {
    this.dbName = customDbName || "localMessage";
    this.dbPath = customDbPath || "_doc/localMessage.db";
  }

  // 使用箭头函数以确保正确的 this 上下文
  isOpenDataBase = (): boolean => {
    try {
      return plus.sqlite.isOpenDatabase({
        name: this.dbName,
        path: this.dbPath
      });
    } catch (error) {
      console.error("Error checking database status:", error);
      return false;
    }
  };
  openDataBase = async () => {
    try {
      plus.sqlite.openDatabase({
        name: this.dbName,
        path: this.dbPath
      });
      await this.createTable("message");
    } catch (err) {
      console.warn("sqlite打开失败");
      await uni.showToast({
        title: 'If the data synchronization fails, please restart the app'
      })

    }
  };
  closeDataBase = () => {
    try {
      plus.sqlite.closeDatabase({
        name: this.dbName

      });

    } catch (err) {
      console.warn("sqlite关闭失败");
    }
  };
  updateMessageStatus = async (messageContent, createTime: bigint, status: 'PENDING' | 'SUCCESS' | 'FAIL', payStatus?: number) => {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE message
                   SET messageSendStatus = '${status}',
                       updateTime        = ${createTime},
                       messageContent    = '${JSON.stringify(messageContent.message)}',
                       spend             = ${payStatus || 0}
                   WHERE id = '${messageContent.message.messageClientId}'`
      plus.sqlite.executeSql({
        sql: [sql],
        name: this.dbName,
        success: (result) => {
          console.log('更新成功', result);
          resolve(result);
        },
        fail: (err) => {
          console.log(err)
          reject(err)
        }
      })
    })
  }
  getMessageByClientId = (clientId: string) => {
    const sql = `SELECT * FROM message WHERE id = '${clientId}'`;
    return new Promise((resolve, reject) => {
      plus.sqlite.selectSql({
        name: this.dbName,
        sql: sql,
        success: (res) => resolve(res),
        fail: (err) => {
          console.log("插入失败");
          reject(err);
        }
      });
    });
  }
  createTable = (tableName: string) => {
    return new Promise((resolve, reject) => {
      const sql = `CREATE TABLE IF NOT EXISTS ${tableName}
                   (
                     'id'
                     PRIMARY
                     KEY,
                     'updateTime'
                     BIGINT,
                     'messageContent'
                     TEXT,
                     'conversationId'
                     TEXT,
                     'messageSendStatus'
                     TEXT,
                     'spend'
                     INT
                   )`;
      plus.sqlite.executeSql({
        name: this.dbName,
        sql: [sql],
        success: (res) => {
          resolve(res)
        },
        fail: (err) => reject(err)
      });
    });
  };
  getAllList = async (nim) => {
    const getList = async () => {
      return await nim.V2NIMConversationService.getConversationList(this.offset, this.limit);
    };
    await this.openDataBase();
    let allArr = [];
    nim.V2NIMConversationService.on("onSyncStarted", () => {
      console.log("onSyncFinished");
    });
    nim.V2NIMConversationService.on("onSyncFinished", async () => {
      const conversationListAll = async (conversationId: string) => {
        let param: object;
        const lastRow = await this.getLastTime();
        const getChatList = async (message?) => {
          if (message && Object.keys(message)) {
            param = {
              conversationId: conversationId,
              anchorMessage: message
            };
          } else {
            if (!lastRow[0]) {
              param = {
                conversationId: conversationId
              };
            } else {
              param = {
                conversationId: conversationId,
                anchorMessage: JSON.parse(lastRow[0].messageContent)
              };
            }
          }
          try {
            const res = await getMessageList(nim, param);
            for (let i of res) {
              const ress = await this.insertTableData({message: i});
            }
            if (res.length !== 0) {
              await getChatList(res[0]);
            }
          } catch (err) {
            console.warn("获取会话详情的时候出问题了：", err);
          }
        };
        await getChatList();
      };
      const get = async () => {
        const result = await getList();
        if (result.conversationList.length > 0) {
          this.offset = this.offset + this.limit;
          allArr.push(...result.conversationList);
          await get();
        } else {
          for (const item of allArr) {
            try {
              const res = await conversationListAll(item.conversationId);
            } catch (error) {
              console.error("看看是不是这一步出问题了", error);
            }
          }
        }
        console.log("========111========");
      };
      await get();
    });
  };
  getLastTime = async () => {
    const sqlGet = "SELECT * FROM message ORDER BY updateTime DESC LIMIT 1";
      return new Promise((resolve, reject) => {
      plus.sqlite.selectSql({
        name: this.dbName,
        sql: sqlGet,
        success: (res) => resolve(res),
        fail: (err) => {
          console.log("插入失败");
          reject(err);
        }
      });
    });
  };
  insertTableData = async (jsonData: any) => {
    if (!this.isOpenDataBase()) {
      await this.openDataBase()
    }
    const jsonDataStr = JSON.stringify(jsonData.message);
    const sql = `INSERT INTO message('id' ,'updateTime', 'messageContent', 'conversationId', 'messageSendStatus', 'spend') VALUES (
        '${jsonData.message.messageClientId}',
        ${jsonData.message.createTime},
        '${jsonDataStr}',
        '${jsonData.message.conversationId}',
        '${!jsonData.message.messageSendStatus ? 'SUCCESS' : jsonData.message.messageSendStatus}',
        2
      )`;

    return new Promise((resolve, reject) => {
      plus.sqlite.executeSql({
        name: this.dbName,
        sql: [sql],
        success: (res) => resolve(res),
        fail: (err) => {
          console.log("插入失败");
          reject(err);
        }
      });
    });
  };
  getListById = (conversationId: string, timesMap: bigint | number) => {
    const sql = `SELECT *
                 FROM message
                 WHERE conversationId = '${conversationId}'
                   AND updateTime < ${timesMap}
                 ORDER BY updateTime DESC LIMIT 20`;
    return new Promise((resolve, reject) => {
      plus.sqlite.selectSql({
        name: this.dbName,
        sql: sql,
        success: (res) => resolve(res),
        fail: (err) => {
          console.log("插入失败");
          reject(err);
        }
      });
    });
  };
  deleteColumn = (id: bigint) => {
    return new Promise((resolve, reject) => {
      const sql = `DELETE
                   FROM message
                   WHERE id = ${id}`
      plus.sqlite.executeSql({
        name: this.dbName,
        sql: [sql],
        success: res => resolve(res),
        fail: err => reject(err)
      })
    })
  }
  dropTable = (tableName: string) => {
    return new Promise((resolve, reject) => {
      plus.sqlite.executeSql({
        name: this.dbName,
        sql: [`DROP TABLE IF EXISTS ${tableName}`],
        success: (res) => resolve(res),
        fail: (err) => reject(err)
      });
    });
  };

}

const db = new LocalMessageDataBase();
export default db;
