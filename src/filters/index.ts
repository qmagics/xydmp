/**
 * 转位时间显示
 * @param {Date} date 时间
 * @param {string} formatStr 格式化字符串
 */
export function time(date: any, formatStr: string) {
  return date ? new Date(date).format(formatStr) : '-';
}

/**
 * 转为日期显示
 * @param {*} date 
 * @returns 
 */
export function date(date: any, formatStr: string) {
  return time(date, formatStr || 'yyyy-MM-dd');
}