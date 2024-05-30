// 通知状态常量
export enum NOTICE_RELEASE_STATE {
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

// 通知发布对象
export enum NOTICE_RELEASE_OBJECT {
  /**广播(所有人) */
  PUBLISH_TO_All,
  /**分组发送用户 */
  PUBLISH_TO_Group,
  /**指定用户 */
  PUBLISH_TO_USER
}

// 判断是否为指定用户发送
export enum NOTICE_RELEASE_USER {
  FALSE,
  TRUE
}

// 判断是否为指定分组发送
export enum NOTICE_RELEASE_GROUP {
  FALSE,
  TRUE
}
