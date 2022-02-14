import { ElMessageBox, ElMessage, ElLoading } from "element-plus"

export const dateFormat = function (date: any, formatStr = 'yyyy-MM-dd', netTimeStamp = false) {
  if (!date || date === '') return '-/-/-'
  if (typeof date === 'string') {
    // 去除时区时差影响
    date = date.replace('T', ' ')
    date = new Date(date)
  } else if (typeof date === 'number') {
    if (netTimeStamp) {
      // 如果是 .net 时间戳, 单位为秒
      date = new Date(date * 1000)
    } else {
      // 不是则自动判断
      // 如果 * 1000 后超过 2100/12/31 则自动判断为毫秒时间戳
      // 否则则自动判断为秒时间戳
      if (date * 1000 > 4133865600000) {
        date = new Date(date)
      } else {
        date = new Date(date * 1000)
      }
    }
  } else {
    date = new Date(date)
  }
  const week: any = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d'
  }
  const map: any = {
    'M': date.getMonth() + 1, // 月份
    'd': date.getDate(), // 日
    'h': date.getHours(), // 小时
    'm': date.getMinutes(), // 分
    's': date.getSeconds(), // 秒
    'q': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  formatStr = formatStr.replace(/([yMdhmsEqS])+/g, function (all, t) {
    let v = map[t]
    if (v !== undefined) {
      if (all.length > 1) {
        v = '0' + v
        v = v.substr(v.length - 2)
      }
      return v
    } else if (t === 'y') {
      return (date.getFullYear() + '').substr(4 - all.length)
    } else if (t === 'E') {
      const w = week[date.getDay()]
      if (all.length === 1) {
        return w
      } else if (all.length === 2) {
        return '\u5468' + w
      } else {
        return '\u661f\u671f' + w
      }
    }
    return all
  })
  return formatStr
}

export const isNotEmpty = (val: any) => {
  return val !== null && val !== undefined && val !== '' && val !== NaN;
}

/** 确认框 */
export const $confirm = (msg: string) => {
  return ElMessageBox.confirm(msg, { confirmButtonText: "确认", cancelButtonText: "取消" });
}

/** 消息提醒 */
export const $message = (msg: string) => {
  return ElMessage({
    message: msg,
    // duration: 1000
  });
}


/** 全局loading实例 */
let globalLoadingInstance: any = null;

/** 开全局loading */
export const $loading = (options?: any) => {
  if (!globalLoadingInstance) {
    globalLoadingInstance = ElLoading.service(options);
  }
}

/** 关全局loading */
export const $closeLoading = () => {
  if (globalLoadingInstance) {
    globalLoadingInstance.close();
    globalLoadingInstance = null;
  }
}
