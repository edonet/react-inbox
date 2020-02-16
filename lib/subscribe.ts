/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-02-16 00:39:16
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import { Listener, addListener, removeListener } from './observer';


/**
 *****************************************
 * 订阅更新
 *****************************************
 */
export default function subscribe(handler: (count: number) => void): () => void {
    let cb: Listener = {},
        count: 0;

    // 生成回调函数
    cb.handler = () => {
        addListener(cb);
        handler(count ++);
        removeListener(cb);
    };

    // 更新数据
    cb.handler();

    // 返回取消函数
    return () => {
        cb.handler = undefined;
    };
}
