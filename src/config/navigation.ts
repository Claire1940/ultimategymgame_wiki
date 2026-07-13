import type { LucideIcon } from 'lucide-react'
import {
	Ticket,
	BookOpen,
	Dumbbell,
	Flame,
	Coins,
	Apple,
	HeartPulse,
	TrendingUp,
} from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'codes' -> t('nav.codes')
	path: string // URL 路径，如 '/codes'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// 导航配置：8 个内容分类，与 content/{locale}/ 目录结构一一对应
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'codes', path: '/codes', icon: Ticket, isContentType: true },
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'exercises', path: '/exercises', icon: Dumbbell, isContentType: true },
	{ key: 'strength', path: '/strength', icon: Flame, isContentType: true },
	{ key: 'money', path: '/money', icon: Coins, isContentType: true },
	{ key: 'nutrition', path: '/nutrition', icon: Apple, isContentType: true },
	{ key: 'physique', path: '/physique', icon: HeartPulse, isContentType: true },
	{ key: 'upgrades', path: '/upgrades', icon: TrendingUp, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> ['codes', 'guide', ...]

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
