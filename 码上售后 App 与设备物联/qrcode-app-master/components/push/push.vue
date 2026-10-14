<template>
    <view class="content">
        <button type="primary" @click="turnOn()">开启语音播报</button>
        <button type="primary" @click="closure()">关闭语音播报</button>
        <button type="primary" @click="createMessage()">创建本地通知</button>
    </view>
</template>

<script>
    const KJNotificationService = uni.requireNativePlugin('KJ-NotificationService');
    console.log(KJNotificationService)
    export default {
        data() {
            return {
                title: 'KJ-NotificationService'
            }
        },
        onLoad() {
            /**
             * 前台(本地通知/非apns)语言播报
             * 在前台时，监听到的通知回调，
             * 本地通知/个推/uniPush平台，在前台时，不会走apns通道，不走apns通道，就不会触发ios通知扩展，极光推送则可以
             * 所以在使用 本地通知/个推/uniPush平台，在前台时做语言播报，需要加该段代码，如果使用极光推送则不需要
             * */
            plus.push.addEventListener('receive', function(msg) {
                console.log(msg)
                if (msg.aps == null) {
                    KJNotificationService.contentToAudio({
                        "GroupIdentifier": "group.com.kj.KJDocument.share",
                        "content": msg.content,
                        "isAutoPlay": true
                    }, (res) => {
                        console.log(res);
                        var type = res.type;
                        if (type == "generateAudio") {
                            console.log("生成音频");
                        } else if (type == "playStart") {
                            console.log("播放开始");
                        } else if (type == "playFinish") {
                            console.log("播放完成");
                        } else if (type == "playError") {
                            console.log("播放错误");
                        } else {
                            console.log("异常");
                        }
                    });
                }
            }, false);
        },
        methods: {
            turnOn() {
                /**
                 * audios 根据推送body字符串，识别播放音频
                 * */
                var dic = {
                    "GroupIdentifier": "group.com.kj.KJDocument.share",
                    "rate": 2.0, //语音播报速率 1为正常
                    "keyWords": [{
                        "name": "到账"
                    }], //根据关键词来，来判断是否要播放音频，不存在则不播放，显示系统声音
                    "audios": [{
                            "type": "start", //数字前面的内容
                            "value": [{
                                "name": "收钱吧到账",
                                "fileName": "pre.mp3"
                            }]
                        },
                        {
                            "type": "number", //数字内容，name字段不可以修改，否则不能识别中文数字
                            "value": [{
                                    "name": "零",
                                    "fileName": "0.mp3"
                                },
                                {
                                    "name": "一",
                                    "fileName": "1.mp3"
                                },
                                {
                                    "name": "二",
                                    "fileName": "2.mp3"
                                },
                                {
                                    "name": "三",
                                    "fileName": "3.mp3"
                                },
                                {
                                    "name": "四",
                                    "fileName": "4.mp3"
                                },
                                {
                                    "name": "五",
                                    "fileName": "5.mp3"
                                },
                                {
                                    "name": "六",
                                    "fileName": "6.mp3"
                                },
                                {
                                    "name": "七",
                                    "fileName": "7.mp3"
                                },
                                {
                                    "name": "八",
                                    "fileName": "8.mp3"
                                },
                                {
                                    "name": "九",
                                    "fileName": "9.mp3"
                                },
                                {
                                    "name": "十",
                                    "fileName": "10.mp3"
                                },
                                {
                                    "name": "百",
                                    "fileName": "hundred.mp3"
                                },
                                {
                                    "name": "千",
                                    "fileName": "thousand.mp3"
                                },
                                {
                                    "name": "万",
                                    "fileName": "ten_thousand.mp3"
                                },
                                // {
                                //  "name": "亿",
                                //  "fileName": "ten_thousand.mp3"//由于收钱吧app，没有提供亿的音频，推送可以限制最大99999999
                                // },
                                {
                                    "name": ".",
                                    "fileName": "dot.mp3"
                                },
                            ]
                        },
                        {
                            "type": "end", //数字后面的内容
                            "value": [{
                                "name": "元",
                                "fileName": "yuan.mp3"
                            }]
                        }
                    ]
                }
                console.log(dic);
                KJNotificationService.init(dic);
            },
            closure() {
                var dic = {
                    "GroupIdentifier": "group.com.kj.KJDocument.share",
                    "rate": 2.0, //语音播报速率 1为正常
                    "keyWords": [],
                    "audios": []
                }
                KJNotificationService.init(dic);
            },
            createMessage() {
                plus.push.createMessage('收钱吧到账12345678.12元', '2')
            }
        }
    }
</script>

<style>

</style>