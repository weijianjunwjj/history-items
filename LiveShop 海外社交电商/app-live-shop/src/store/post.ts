import { defineStore } from "pinia";

export const usePostStore = defineStore("postStore", {
  state: () => ({
    postLists: {
      Recommend: [],
      Follow: [],
      Update: [],
    },
  }),
  actions: {
    setPosts(type:string, posts) {
      this.postLists[type] = posts; // 设置某类型的帖子列表
    },
    updatePostLike(type, postId, obj) {
      const postIndex = this.postLists[type].findIndex((item) => item.id === postId);
      const curPost=this.postLists[type][postIndex]
      console.log('type', type)
      console.log('postIndex', postIndex)
      console.log('curPost', curPost)
      console.log('obj', obj)
      this.postLists[type][postIndex]={...curPost,...obj}
    },
    clear(type){
      this.postLists[type] = []
    }
  },
});
