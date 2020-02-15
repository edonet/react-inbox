/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2019-11-30 22:30:48
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 数据
 *****************************************
 */
interface Data {
    [key: string]: unknown;
}


/**
 *****************************************
 * 判断为对象
 *****************************************
 */
function isObject(obj: unknown): obj is object {
    return obj && typeof obj === 'object';
}


/**
 *****************************************
 * 判断为日期
 *****************************************
 */
function isDate(obj: unknown): boolean {
    return obj instanceof Date;
}


/**
 *****************************************
 * 判断为【NaN】
 *****************************************
 */
function isBeNaN(value: unknown): boolean {
    return typeof value === 'number' && isNaN(value);
}


/**
 *****************************************
 * 比较数组
 *****************************************
 */
function eachEqual<T>(value: T[], expected: T[], handler: (k1: T, k2: T, v1: T[], v2: T[]) => boolean): boolean {
    let len = value.length;

    // 比较长度
    if (len !== expected.length) {
        return false;
    }

    // 比较项
    for (let i = 0; i < len; i ++) {
        if (!handler(value[i], expected[i], value, expected)) {
            return false;
        }
    }

    // 返回结果
    return true;
}


/**
 *****************************************
 * 判断值相等
 *****************************************
 */
export default function equal<T>(value: T, expected: T): boolean {
    if (value !== expected) {

        // 比较对象
        if (isObject(value)) {

            // 非对象匹配
            if (!isObject(expected)) {
                return false;
            }

            // 比较数组
            if (Array.isArray(value)) {
                return (
                    Array.isArray(expected) &&
                    eachEqual(value, expected, equal)
                );
            }

            // 比较集合
            if (value instanceof Set) {
                return (
                    expected instanceof Set &&
                    eachEqual([...value], [...expected], equal)
                );
            }

            // 比较映射
            if (value instanceof Map) {
                return (
                    expected instanceof Map &&
                    eachEqual(
                        [...value.keys()],
                        [...expected.keys()],
                        k1 => (
                            expected.has(k1) &&
                            equal(value.get(k1), expected.get(k1))
                        )
                    )
                );
            }

            // 比较日期
            if (isDate(value)) {
                return isDate(expected) && + value === + expected;
            }

            // 比较对象
            return eachEqual(
                Object.keys(value),
                Object.keys(expected),
                (k1, k2, v1, v2) => (
                    v2.includes(k1) &&
                    equal((value as Data)[k1], (expected as Data)[k1])
                )
            );
        }

        // 比较【NaN】
        return isBeNaN(value) && isBeNaN(expected);
    }

    // 完全相等
    return true;
}

