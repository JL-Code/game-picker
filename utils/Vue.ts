/**
 * 取消对象的反应式跟踪
 * @param value 反应式对象
 */

export const unReactive = (value: any) => {
  if (isRef(value)) {
    return JSON.parse(JSON.stringify(unref(value)));
  } else if (isReactive(value)) {
    return JSON.parse(JSON.stringify(value));
  } else {
    return value;
  }
};
