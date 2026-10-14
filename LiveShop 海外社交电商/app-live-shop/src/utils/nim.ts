import NIM from 'nim-web-sdk-ng/dist/v2/NIM_UNIAPP_SDK'
import { useUserStore, useNimStore } from '@/store'

const initNIM = async () => {
  const userStore = useUserStore()
  if (userStore.userInfo.imAccessKey != "" && userStore.userInfo.imAccountId != "" && userStore.userInfo.imToken != "") {
    uni.$NIM = NIM.getInstance(
      {
        appkey: userStore.userInfo.imAccessKey,
        debugLevel: "debug",
        apiVersion: "v2"
      }, {
        V2NIMLoginServiceConfig: {
          lbsUrls: [
            "https://lbs.netease.im/lbs/wxwebconf.jsp"
          ],
          linkUrl: "weblink01-sg.netease.im:443"
        }
      }
    )

    await uni.$NIM.V2NIMLoginService.login(userStore.userInfo.imAccountId, userStore.userInfo.imToken, {
      "forceMode": true
    })
  }
}

const initListen = async () => {
  if (!uni.$NIM) {
    await initNIM()

    // 监听会话组新增会话的情况回调
    uni.$NIM.V2NIMConversationGroupService.on(
      'onConversationsAddedToGroup',
      refreshConversationGroup
    )

    // 监听会话组移除会话的情况回调
    uni.$NIM.V2NIMConversationGroupService.on(
      'onConversationsRemovedFromGroup',
      refreshConversationGroup
    )
  }
}

const initGroupId = async () => {
  if (!uni.$NIM) {
    await initNIM()
  }

  if (uni.$NIM) {
    const nimStore = useNimStore()
    const groupList = await uni.$NIM.V2NIMConversationGroupService.getConversationGroupList()
    if (groupList.length == 2) {
      if (groupList[0].name == "打招呼") {
        nimStore.setDmId(groupList[0].groupId)
        nimStore.setMfId(groupList[1].groupId)
      } else {
        nimStore.setDmId(groupList[1].groupId)
        nimStore.setMfId(groupList[0].groupId)
      }

      await rebuildNimList(groupList[1].groupId, 0)
      await rebuildNimList(groupList[0].groupId, 0)
    }
  }
}

const refreshUnread = async () => {
  if (!uni.$NIM) {
    await initNIM()
  }

  if (uni.$NIM) {
    const nimStore = useNimStore()
    const counts = await uni.$NIM.V2NIMConversationService.getUnreadCountByFilter({
      conversationGroupId: nimStore.dmId
    });
    nimStore.setDmUnread(counts)

    const mfCounts = await uni.$NIM.V2NIMConversationService.getUnreadCountByFilter({
      conversationGroupId: nimStore.mfId
    });
    nimStore.setMfUnread(mfCounts)
  }
}

// 初始化、组变化均会触发，一键更新数据
const refreshConversationGroup = async (groupId: string) => {
  await rebuildNimList(groupId, 0)
}

const rebuildNimList = async (gid: string, offset: number) => {
  if (!uni.$NIM) {
    await initNIM()
  }

  if (uni.$NIM) {
    const nimStore = useNimStore()
    const list = await uni.$NIM.V2NIMConversationService.getConversationListByOption(
      offset,
      100,
      {
        onlyUnread: true,
        conversationGroupIds: [gid]
      }
    )

    // 合并会话数据
    if (nimStore.dmId == gid) {
      if (offset != 0) {
        list.conversationList = [...nimStore.dmList.conversationList, ...list.conversationList];
      }
      nimStore.setDmList(list)
    } else {
      if (offset != 0) {
        list.conversationList = [...nimStore.mfList.conversationList, ...list.conversationList];
      }
      nimStore.setMfList(list)
    }
  }
}

/*************** 聊天逻辑备份 ****************/
// 打招呼
// const dzh = async (tid: string) => {
//   const nimStore = useNimStore()
//   const obj = nimStore.nimObj
//
//   const messageBeforeSend = obj.V2NIMMessageCreator.createTextMessage("hello world")
//   const conversationId = obj.V2NIMConversationIdUtil.p2pConversationId(tid)
//
//   const message = await obj.V2NIMMessageService.sendMessage(
//     messageBeforeSend,
//     conversationId
//   )
//
//   console.log(message);
//
// }

// 进会话
// const jhh = async (cid: string) => {
//   const nimStore = useNimStore()
//   const obj = nimStore.nimObj
//
//   const res = await obj.V2NIMMessageService.getMessageList({
//     "conversationId": cid,
//     "direction": 0
//   })
// }


/*************** 聊天逻辑备份 ****************/

export {
  initNIM,
  initListen,
  refreshUnread,
  rebuildNimList,
  refreshConversationGroup
}
