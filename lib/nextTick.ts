/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-02-16 10:36:23
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
 * 等待下一帧
 *****************************************
 */
export default function nextTick<T>(callback?: () => T): Promise<T> {
    return new Promise(
        resolve => rAF(() => resolve(callback && callback()))
    );
}
