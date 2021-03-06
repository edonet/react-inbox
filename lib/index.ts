/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-02-15 10:41:38
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载接口
 *****************************************
 */
import store from './store';
import rAF from './rAF';
import equal from './equal';
import subscribe from './subscribe';
import nextTick from './nextTick';
import { useStore, observer } from './useStore';


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
export default store;
export { store, useStore, observer, subscribe, rAF, equal, nextTick };
