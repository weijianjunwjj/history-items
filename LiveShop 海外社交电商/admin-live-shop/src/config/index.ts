import logo from "@/assets/logo-min.png"

export default {
    baseUrl: process.env.VITE_API_URL, //测试ip
    uploadUrl: 'https://files.njyykj.com/',
    whiteList: ["/login"],
    resetPath: "/login",
    website: {
        logo,
        title: "LiveShop后台管理"
    }
}
