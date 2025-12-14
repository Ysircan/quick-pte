export type Rarity = 'COMMON' | 'RARE' | 'EPIC';
export type WordTuple = [word: string, meaning: string, rarity: Rarity];

export type ColorClass =
  | 'c-green' | 'c-red' | 'c-blue' | 'c-yellow'
  | 'c-purple' | 'c-teal' | 'c-rose' | 'c-amber';

export const COLORS: ColorClass[] = [
  'c-green','c-red','c-blue','c-yellow','c-purple','c-teal','c-rose','c-amber',
];

export const WORDS: WordTuple[] = [
  ['task queue','自动推送 · 24h节奏','RARE'],
  ['review loop','错题回放 · 复盘闭环','COMMON'],
  ['cohorts','分班分组 · 进度看板','COMMON'],
  ['reports','周报导出 · 一键汇总','COMMON'],
  ['alerts','风险提醒 · 自动通知','RARE'],
  ['integrations','API连接 · 状态监控','RARE'],
  ['onboarding','新生引导 · 快速上手','COMMON'],
  ['dashboard','全局概览 · 一眼看清','COMMON'],
  ['analytics','数据洞察 · 留存曲线','EPIC'],
  ['billing','订阅续费 · 发票管理','RARE'],
  ['agency portal','中介协作 · 分发管理','EPIC'],
  ['content builder','内容构建 · 模板流程','RARE'],
  ['secure access','权限控制 · 安全接入','COMMON'],
  ['sync','多端同步 · 不中断','COMMON'],
  ['launch','快速上线 · v0.1 live','EPIC'],
  ['templates','标准流程 · 可复用','COMMON'],
  ['exports','导出成绩 · CSV/PDF','COMMON'],
  ['audit log','操作记录 · 可追溯','RARE'],
  ['roles','学生/老师/中介','COMMON'],
  ['streak engine','节奏系统 · 连续推进','RARE'],
  ['daily tasks','今日任务 · 自动生成','COMMON'],
  ['progress','完成度 · 可视化','COMMON'],
  ['checkpoint','阶段关卡 · 解锁推进','RARE'],
  ['support','帮助中心 · FAQ','COMMON'],
];
