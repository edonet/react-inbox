/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-02-16 10:31:30
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载模块
 *****************************************
 */
import { store, subscribe, nextTick } from '../';


/**
 *****************************************
 * 测试模块
 *****************************************
 */
describe('inbox', () => {
    test('store', async () => {
        let state = store({ name: '', value: 1, count: 0 }),
            cb = jest.fn(),
            cancel = subscribe(
                () => cb(state.value, state.count)
            );


        // 校验结果
        expect(cb.mock.calls).toEqual([
            [1, 0],
        ]);

        // 更新状态
        state.value ++;
        state.count ++;

        // 等待更新
        await nextTick();

        // 校验结果
        expect(cb.mock.calls).toEqual([
            [1, 0],
            [2, 1],
        ]);

        // 更新状态
        state.value ++;

        // 等待更新
        await nextTick();

        // 校验结果
        expect(cb.mock.calls).toEqual([
            [1, 0],
            [2, 1],
            [3, 1],
        ]);

        // 更新状态
        state.count ++;

        // 等待更新
        await nextTick();

        // 校验结果
        expect(cb.mock.calls).toEqual([
            [1, 0],
            [2, 1],
            [3, 1],
            [3, 2],
        ]);

        // 更新状态
        state.name = 'ignore';

        // 等待更新
        await nextTick();

        // 校验结果
        expect(cb.mock.calls).toEqual([
            [1, 0],
            [2, 1],
            [3, 1],
            [3, 2],
        ]);

        // 取消订阅
        cancel();

        // 更新状态
        state.value ++;
        state.count ++;

        // 等待更新
        await nextTick();

        // 校验结果
        expect(cb.mock.calls).toEqual([
            [1, 0],
            [2, 1],
            [3, 1],
            [3, 2],
        ]);
    });
});
