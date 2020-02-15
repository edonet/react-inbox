/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-02-15 10:45:28
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
import { FC, createElement, useRef, useReducer, useEffect, ComponentClass } from 'react';
import { addListener, removeListener } from './observer';


/**
 *****************************************
 * 仓储引用
 *****************************************
 */
interface Current<T> {
    data?: T;
    refresh?(): void;
    handler?(): void;
}


/**
 *****************************************
 * 使用仓储
 *****************************************
 */
export function useStore<T>(handler: () => T): T {
    let ref = useRef<Current<T>>({}),
        forceUpdate = useReducer((x: number) => x + 1, 0)[1];

    // 初初化数据
    if (ref.current.refresh === undefined) {

        // 初始化刷新函数
        ref.current.refresh = () => {
            addListener(ref.current);
            ref.current.data = handler();
            removeListener(ref.current);
        };

        // 初始化监听函数
        ref.current.handler = () => {
            if (ref.current.refresh) {
                ref.current.refresh();
                forceUpdate();
            }
        };

        // 获取数据
        ref.current.refresh();
    } else {
        ref.current.handler = () => {
            if (ref.current.refresh) {
                ref.current.refresh();
                forceUpdate();
            }
        };
    }

    // 卸载组件
    useEffect(() => {
        return () => {
            ref.current.handler = undefined;
            ref.current.refresh = undefined;
            ref.current.data = undefined;
        };
    }, []);

    // 返回数据
    return ref.current.data as T;
}


/**
 *****************************************
 * 观察组件
 *****************************************
 */
export function observer(handler: () => object): (component: ComponentClass | FC) => FC {
    return (view: string | FC | ComponentClass) => {
        let Store: FC = ({ children, ...props }) => (
                createElement(view, { ...props, ...useStore(handler) }, children)
            );

        // 定义组件名
        Store.displayName = `observer(${
            view['displayName' as keyof typeof view] ||
            view['name' as keyof typeof view] ||
            'Component'
        })`;

        // 返回对象
        return Store;
    };
}
