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


/**
 *****************************************
 * 任务队列
 *****************************************
 */
interface Task {
    list: Set<() => Listener[]>;
    cancel?(): void;
}


/**
 *****************************************
 * 定义执行队列
 *****************************************
 */
const task: Task = {
    list: new Set(),
    cancel: undefined
};


/**
 *****************************************
 * 执行任务队列
 *****************************************
 */
function invoke(): void {
    let list = task.list,
        queue: Listener[] = [];

    // 更新监听列表
    task.list = new Set();

    // 遍历任务
    list.forEach(handler => {
        let listeners = handler();

        // 添加队列
        if (listeners.length) {
            queue = queue.concat(listeners);
        }
    });

    // 执行队列
    queue.forEach(cb => cb.handler && cb.handler());
}


/**
 *****************************************
 * 创建订阅
 *****************************************
 */
export function observer(shouldUpdate: () => boolean): Observer {
    let listeners = new Set<Listener>();

    // 执行回调
    function refresh(): Listener[] {
        let queue: Listener[] = [];

        // 更新数据
        if (listeners.size && shouldUpdate()) {
            let list = listeners;

            // 更新监听列表
            listeners = new Set<Listener>();

            // 执行事件
            list.forEach(cb => {
                if (cb.handler) {
                    listeners.add(cb);
                    queue.push(cb);
                }
            });
        }

        // 返回结果
        return queue;
    }

    // 返回接口
    return {
        subscribe() {
            stack.forEach(cb => listeners.add(cb));
        },
        notify() {

            // 启动任务
            if (!task.cancel) {
                task.cancel = rAF(invoke);
            }

            // 添加任务
            task.list.add(refresh);
        }
    };
}
