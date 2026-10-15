import logo from "@/assets/logo-min.png"

export default {
    baseUrl: '/api/',
    uploadUrl: '/api/',
    whiteList: ["/login"],
    resetPath: "/login",
    website: {
        logo,
        title: "LiveShop后台管理"
    }
}
