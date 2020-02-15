/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-02-15 09:45:14
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import { observer } from './observer';
import equal from './equal';


/**
 *****************************************
 * 创建状态仓储
 *****************************************
 */
export default function store<T>(state: T): T {
    let proxy = Object.create(null);

    // 校验参数
    if (typeof state !== 'object') {
        throw new Error('expect `state` to be a object!');
    }

    // 代理属性
    Object.keys(state).forEach(key => {
        let cached = state[key as keyof T],
            data = cached,
            ob = observer(() => {
                let shouldUpdate = !equal(data, cached);

                // 更新缓存
                cached = data;

                // 返回是否更新
                return shouldUpdate;
            });

        // 劫持属性
        Object.defineProperty(proxy, key, {
            set(value) {

                // 更新值
                data = value;

                // 更新事件
                ob.notify();
            },
            get() {

                // 更新监听器
                ob.subscribe();

                // 返回数据
                return data;
            }
        });
    });

    // 返回结果
    return proxy;
}
