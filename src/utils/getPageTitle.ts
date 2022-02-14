import settings from '@/settings'

const { title } = settings;

/**
 * 设置页面标题
 * @param pageTitle 当前页面标题
 * @returns 最终显示的标题
 */
export default function getPageTitle(pageTitle: string): string {
    if (pageTitle) {
        return `${pageTitle} - ${title}`
    }
    return `${title}`
}