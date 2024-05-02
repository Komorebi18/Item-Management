// 时间限制变量
export const enum TIME {
  /** 全部 */
  ALL,
  /** 近三天 */
  THREE_DAYS,
  /** 近一个周 */
  ONE_WEEK,
  /** 近一个月 */
  ONE_MONTH
}

// 通知状态常量
export const enum STATE {
  /**全部 */
  ALL,
  /**未发布-草稿*/
  UNPUBLISHED,
  /**待审核 */
  WAIT_FOR_AUDIT,
  /**审核通过 */
  PASS_THE_AUDIT,
  /**审核未通过 */
  FAIL_THE_AUDIT,
  /**正式发布 */
  PUBLISHED
}

// 通知发布进度常量
export const enum TAB {
  /**全部 */
  ALL = '0',
  /**编辑中*/
  EDITING = '1',
  /**审核中 */
  AUDITING = '2',
  /**已审核 */
  AUDITED = '3'
}
