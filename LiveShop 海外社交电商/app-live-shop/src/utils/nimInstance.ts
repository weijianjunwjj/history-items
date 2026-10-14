import NIM from "nim-web-sdk-ng/dist/v2/NIM_UNIAPP_SDK";
import {useNimStore, useUserStore} from "@/store";
import {useToast} from "wot-design-uni";
import db from "@/utils/sqlite";
import {initNIM} from "@/utils/nim";

export class NimInstance {
  NIMInstance: NIM | null = null;

  // 初始化NIM实例
  async initNIM(callback?: Function) {

    const userStore = useUserStore();
    if (userStore.userInfo.imAccessKey != "" && userStore.userInfo.imAccountId != "" && userStore.userInfo.imToken != "") {
      this.NIMInstance = NIM.getInstance(
        {
          appkey: userStore.userInfo.imAccessKey,
          debugLevel: "off",
          apiVersion: "v2"
        }, {
          V2NIMLoginServiceConfig: {
            lbsUrls: [
              "https://lbs.netease.im/lbs/wxwebconf.jsp"
            ],
            linkUrl: "weblink01-sg.netease.im:443"
          }
        }
      );
      callback(this.NIMInstance);
      try {
        console.log('imToken&id', userStore.userInfo.imAccountId, userStore.userInfo.imToken)
        const login = await this.NIMInstance.V2NIMLoginService.login(userStore.userInfo.imAccountId, userStore.userInfo.imToken, {
          "forceMode": true
        });
        console.log('查看login登录状态', login)

      } catch (err) {
        console.warn(err)
      }
      console.log('callback结束了')
    }
  };

  initGroupId = async () => {
    if (!this.NIMInstance) {
      await initNIM()
    }

    if (this.NIMInstance) {
      console.log('触发initGroupId')
      const nimStore = useNimStore()
      const groupList = await this.NIMInstance.V2NIMConversationGroupService.getConversationGroupList()
      if (groupList.length == 2) {
        if (groupList[0].name == "打招呼") {
          nimStore.setDmId(groupList[0].groupId)
          nimStore.setMfId(groupList[1].groupId)
        } else {
          nimStore.setDmId(groupList[1].groupId)
          nimStore.setMfId(groupList[0].groupId)
        }

        await this.rebuildNimList(groupList[1].groupId, 0)
        await this.rebuildNimList(groupList[0].groupId, 0)
        await this.rebuildNimList(null, 0)
      }
    }
  }

  // 初始化、组变化均会触发，一键更新数据
  async refreshConversationGroup(groupId?: string) {
    await this.rebuildNimList(groupId, 0);
    useToast().show("触发了");
  };

  async rebuildNimList(gid?: string, offset: number) {
    console.warn(typeof gid)
    if (!this.NIMInstance) {
      await this.initListen();
    }

    if (this.NIMInstance) {
      console.log('到这了吧')
      const nimStore = useNimStore();
      const list = await this.NIMInstance.V2NIMConversationService.getConversationListByOption(
        offset,
        100,
        {
          onlyUnread: false,
          conversationGroupIds: gid ? [gid] : []
        }
      );
      console.log('offset===>', offset)
      // 合并会话数据
      if (!gid) {
        list.conversationList = Array.from(
          new Map(
            [...nimStore.dmList.conversationList, ...list.conversationList].map(item => [item.conversationId, item])
          ).values()
        ).sort((a, b) => b.createTime - a.createTime);
        nimStore.setDmList(list);
      } else if (nimStore.dmId == gid) {
        if (offset != 0) {
          list.conversationList = [...nimStore.dmList.conversationList, ...list.conversationList].sort((a, b) => b.createTime - a.createTime);
        }
        nimStore.setDmList(list);
      } else {
        if (offset != 0) {
          list.conversationList = [...nimStore.mfList.conversationList, ...list.conversationList].sort((a, b) => b.createTime - a.createTime);
        }
        nimStore.setMfList(list);
      }
    }
  };

  async initMessageListener() {
    this.NIMInstance.V2NIMMessageService.on("onReceiveMessages", (message) => {
      console.log("监听到了接收的消息", message);
      try {
        const msg = message[0]
        msg.messageSendStatus = 'SUCCESS'
        db.insertTableData({message: msg})
        // 使用uniapp的eventBus传递接收消息的事件
      } catch (err) {
        console.error('监听接收消息异常了', err)
      }
      uni.$emit("receiveTextMessages", ...message);
    });
  }

  // 同步获取登录状态
  getLoginStatus = () => {
    return this.NIMInstance.V2NIMLoginService.getLoginStatus()
  }
  // TODO 搞一个定时器+异步用来检测登录状态,防止登录状态不是1的时候发消息等需要登录的操作无法进行
  checkLoginStatusFunc = (toast?: string) => {
    return new Promise((resolve, reject) => {
      let count = 0;
      const maxAttempts = 10; // 最大尝试次数
      const interval = setInterval(async () => {
        const loginStatus = this.getLoginStatus(); // 每次直接调用 getLoginStatus()
        console.error(loginStatus, count)
        if (loginStatus === 1) {
          clearInterval(interval); // 登录成功时立即清理定时器
          resolve(true);
        } else {
          count++;
          if (count >= maxAttempts) {
            clearInterval(interval); // 超过最大尝试次数时清理定时器
            if (toast) { // 如果传入了toast，则显示
              await uni.showToast({
                title: toast,
                icon: 'none',
                duration: 2000
              });
            }
            reject(false);
          }
        }
      }, 500); // 每300ms检查一次
    });
  };


  // 初始化会话监听器
  async initListen(callback?: Function) {
    console.log("有没有实例:::", this.NIMInstance);

    if (!this.NIMInstance) {
      await this.initNIM(callback);
      await this.initGroupId()
      console.log("初始化了:::", typeof this.NIMInstance, Object.keys(this.NIMInstance));
      // 监听会话组新增会话的情况回调
      this.NIMInstance.V2NIMConversationGroupService.on(
        "onConversationsAddedToGroup",
        this.refreshConversationGroup
      );
      this.NIMInstance.V2NIMMessageService.off('onReceiveMessages', () => {
      })
      await this.initMessageListener();
      // 监听会话组移除会话的情况回调
      this.NIMInstance.V2NIMConversationGroupService.on(
        "onConversationsRemovedFromGroup",
        this.refreshConversationGroup
      );
      this.NIMInstance.V2NIMConversationService.on(
        "onConversationChanged",
        data => {
          console.log('监听会话改变回调', data)
          console.log(data[0].groupIds.length)
          if (data[0].groupIds.length > 0) {
            for (let i of data[0].groupIds) {
              this.refreshConversationGroup(i)
            }
          } else {
            this.refreshConversationGroup()
          }


        }
      );
// this.NIMInstance.V2NIMConversationService.on(
      //   "onConversationChanged",
      //   this.refreshConversationGroup
      // );
    }
  };
}
