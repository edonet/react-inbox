/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2019-12-06 19:13:13
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 请求帧函数
 *****************************************
 */
interface RequestAnimationFrame {
    (callback: () => void): number;
}


/**
 *****************************************
 * 取消帧函数
 *****************************************
 */
interface CancelAnimationFrame {
    (id: number): void;
}


/**
 *****************************************
 * 帧函数
 *****************************************
 */
interface RAF {
    (callback: () => void): () => void;
}


/**
 *****************************************
 * 定义帧函数
 *****************************************
 */
declare const webkitRequestAnimationFrame: RequestAnimationFrame;
declare const webkitCancelAnimationFrame: CancelAnimationFrame;
declare const mozRequestAnimationFrame: RequestAnimationFrame;
declare const mozCancelAnimationFrame: CancelAnimationFrame;


/**
 *****************************************
 * 创建帧函数
 *****************************************
 */
function createRAF(): RAF {

    // 标准【api】
    if (typeof requestAnimationFrame !== 'undefined') {
        return function rAF(callback: () => void) {
            let id: number | undefined = requestAnimationFrame(callback);

            // 返回取消函数
            return () => {
                if (id) {
                    cancelAnimationFrame(id);
                    id = undefined;
                }
            };
        };
    }

    // 兼容【webkit】
    if (typeof webkitRequestAnimationFrame !== 'undefined') {
        return function rAF(callback: () => void) {
            let id: number | undefined = webkitRequestAnimationFrame(callback);

            // 返回取消函数
            return () => {
                if (id) {
                    webkitCancelAnimationFrame(id);
                    id = undefined;
                }
            };
        };
    }

    // 兼容【moz】
    if (typeof mozRequestAnimationFrame !== 'undefined') {
        return function rAF(callback: () => void) {
            let id: number | undefined = mozRequestAnimationFrame(callback);

            // 返回取消函数
            return () => {
                if (id) {
                    mozCancelAnimationFrame(id);
                    id = undefined;
                }
            };
        };
    }

    // 定时器延时
    return function rAF(callback: () => void) {
        let id: number | undefined = setTimeout(callback, 16);

        // 返回取消函数
        return () => {
            if (id) {
                clearTimeout(id);
                id = undefined;
            }
        };
    };
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
export default createRAF();
