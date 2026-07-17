/*
* Duolingo (多邻国) 本地会员解锁脚本
* 适用平台: Quantumult X / Loon / Surge
*/

let body = $response.body;

if (body) {
    try {
        let obj = JSON.parse(body);
        
        // 1. 修改基础 Premium 属性
        if (obj.hasOwnProperty('is_premium')) {
            obj.is_premium = true;
        }
        if (obj.hasOwnProperty('has_plus')) {
            obj.has_plus = true;
        }
        
        // 2. 深度遍历并修改嵌套的用户属性 (多邻国核心数据在 users 数组中)
        if (obj.users && Array.isArray(obj.users)) {
            obj.users.forEach(user => {
                user.has_plus = true;
                user.is_premium = true;
                
                // 启用 Plus/Super 订阅期限
                if (user.plus_discounts) {
                    user.plus_discounts = [];
                }
                
                // 开启无限体力值（红心）
                if (user.inventory) {
                    user.inventory.forEach(item => {
                        if (item.name === "rupees" || item.name === "gems") {
                            item.value = 99999; // 顺便修改金币/宝石数量
                        }
                    });
                }
            });
        }

        // 3. 针对部分直接返回单用户对象的接口进行兼容
        if (obj.has_plus !== undefined) obj.has_plus = true;
        if (obj.is_premium !== undefined) obj.is_premium = true;

        body = JSON.stringify(obj);
    } catch (e) {
        console.log("Duolingo 脚本解析 JSON 失败: " + e);
    }
}

$done({ body });
