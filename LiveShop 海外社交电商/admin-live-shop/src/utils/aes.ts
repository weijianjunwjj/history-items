import CryptoJS from 'crypto-js';

export default {
    //随机生成指定数量的16进制key
    generateKey(num: number): string {
        let library: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let key: string = "";
        for (let i: number = 0; i < num; i++) {
            let randomPoz: number = Math.floor(Math.random() * library.length);
            key += library.substring(randomPoz, randomPoz + 1);
        }
        return key;
    },
    //加密
    encrypt(word: string, keyStr: string) {
        keyStr = keyStr ? keyStr : 'ABCDEF0123456789';
        const key = CryptoJS.enc.Utf8.parse(keyStr);
        const srcStr = CryptoJS.enc.Utf8.parse(word);
        return CryptoJS.AES.encrypt(srcStr, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7}).toString();
    },
    //解密
    decrypt(word: string, keyStr: string) {
        keyStr = keyStr ? keyStr : 'ABCDEF0123456789';
        const key = CryptoJS.enc.Utf8.parse(keyStr);
        const decrypt = CryptoJS.AES.decrypt(word, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
        return CryptoJS.enc.Utf8.stringify(decrypt).toString();
    }

}
