// 通知状态常量
export const enum NOTICE_RELEASE_STATE {
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
