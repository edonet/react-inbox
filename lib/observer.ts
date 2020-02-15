/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-02-15 09:49:55
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import rAF from './rAF';


/**
 *****************************************
 * 监听对象
 *****************************************
 */
export interface Listener {
    handler?(): void;
}


/**
 *****************************************
 * 订阅者
 *****************************************
 */
interface Observer {
    subscribe(): void;
    notify(): void;
}


/**
 *****************************************
 * 定义调用栈
 *****************************************
 */
const stack = new Set<Listener>();


/**
 *****************************************
 * 创建订阅
 *****************************************
 */
export function observer(shouldUpdate: () => boolean): Observer {
    let listeners = new Set<Listener>(),
        cancel: undefined | (() => void);

    // 执行回调
    function refresh(): void {

        // 清空取消回调
        cancel = undefined;

        // 更新数据
        if (shouldUpdate()) {
            let list = listeners;

            // 更新监听列表
            listeners = new Set<Listener>();

            // 执行事件
            list.forEach(cb => {
                if (cb.handler) {
                    listeners.add(cb);
                    cb.handler();
                }
            });
        }
    }

    // 返回接口
    return {
        subscribe() {
            stack.forEach(cb => listeners.add(cb));
        },
        notify() {
            if (!cancel) {
                cancel = rAF(refresh);
            }
        }
    };
}


/**
 *****************************************
 * 添加监听
 *****************************************
 */
export function addListener(listener: Listener): void {
    stack.add(listener);
}


/**
 *****************************************
 * 移除监听
 *****************************************
 */
export function removeListener(listener: Listener): void {
    stack.delete(listener);
}
