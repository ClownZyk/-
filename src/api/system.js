import axios from '@/config/httpConfig'

// 上传图片
export function UploadImg1(param) {
  return axios.post('api/Base/UploadImg1', param)
}
// 上传图片
// export function UploadImg2(param) {
//   return axios.post('api/Base/UploadImg2', param)
// }
// 上传视频
export function UploadVideo(param) {
  return axios.post('api/Base/VideoUpload', param)
}
// 统计
export function StatisticalData(params) {
  return axios.post('/api/Cashier/StatisticalData', params)
}
// (用户/产品)消费统计
export function StatisticsData(param) {
  return axios.post('/api/Cashier/StatisticsData', param)
}
// 门店经营数据
// 获取门店经营数据列表
export function getStoreIncomeData(param) {
  return axios.post('/api/DiGuanTongApi/GetIncomeData', param)
}
/**
 * 人脸识别接口的Controller
 */
// 人脸获取个人信息
export function FaceImgsUplaod(param) {
  return axios.post('api/Face/FaceImgsUplaod', param)
}

// 人脸录入匹配(无底库)
export function ImageFaceMatching(param) {
  return axios.post('api/Face/ImageFaceMatching', param)
}

// 人脸录入匹配（有底库）
export function AddFaceMatching(param) {
  return axios.post('api/Face/AddFaceMatching', param)
}

/**
 * 秒杀模块
 */
// 分页获取信息
export function SeckillGetListByPage(param) {
  return axios.post('api/Seckill/GetListByPage', param)
}
// 获取详情
export function SeckillGetDetailById(param) {
  return axios.post('api/Seckill/GetDetailById', param)
}
// 添加、更新、删除
export function SeckillOperation(param) {
  return axios.post('api/Seckill/Operation', param)
}
// 批量删除
export function SeckillDeleteMany(param) {
  return axios.post('api/Seckill/DeleteMany', param)
}

/**
 * 拼团模块
 */
// 获取拼团模板列表
export function getGrouponTemplateList(param) {
  return axios.post('/api/SpellGroup/GetSpellGroupTemplateList', param)
}
// 获取拼团模板详情
export function getGrouponTemplateDetail(param) {
  return axios.post('/api/SpellGroup/GetTemplateDetailById', param)
}
// 添加更新删除拼团模板
export function grouponTemplateOperation(param) {
  return axios.post('/api/SpellGroup/TemplateOperation', param)
}
// 获取拼团站点信息
export function getGrouponSites(param) {
  return axios.post('/api/SpellGroup/GetSiteSpellGroupList', param)
}
// 分页获取信息
export function SpellGroupGetListByPage(param) {
  return axios.post('api/SpellGroup/GetListByPage', param)
}
// 获取拼团信息
export function getSpellGroupGetList(param) {
  return axios.post('api/SpellGroup/GetSpellGroupList', param)
}
// 获取详情
export function SpellGroupGetDetailById(param) {
  return axios.post('api/SpellGroup/GetDetailById', param)
}
// 添加、更新、删除
export function SpellGroupOperation(param) {
  return axios.post('api/SpellGroup/Operation', param)
}
// 批量删除
export function SpellGroupDeleteMany(param) {
  return axios.post('api/SpellGroup/DeleteMany', param)
}
// 拼团-退款申请
export function postSpellGroupOrderRefund(param) {
  return axios.post('api/GroupOrderRefund/PostGroupOrderRefund', param)
}
// 拼团-退款单列表
export function GroupOrderRefundGetListByPage(param) {
  return axios.post('api/GroupOrderRefund/GetListByPage', param)
}
// 拼团-退款单详情
export function GroupOrderRefundGetOrderDetail(param) {
  return axios.post('api/GroupOrderRefund/GetOrderDetail', param)
}
// 拼团-退款单删除
export function GroupOrderRefundOperation(param) {
  return axios.post('api/GroupOrderRefund/Operation', param)
}
// 拼团-退款单审核
export function GroupOrderRefundUpdateReply(param) {
  return axios.post('api/GroupOrderRefund/UpdateReply', param)
}
// 拼团-订单列表
export function GroupOrderGetListByPage(param) {
  return axios.post('api/GroupOrder/GetListByPage', param)
}
// 拼团-订单导出
export function GroupOrderExportByCondition(param) {
  return axios.postFile('GroupOrder/GroupOrderExcel', param, { responseType: 'arraybuffer' })
}

// 拼团-订单详情
export function GroupOrderGetOrderDetail(param) {
  return axios.post('api/GroupOrder/GetOrderDetail', param)
}
// 拼团-订单删除
export function GroupOrderOperation(param) {
  return axios.post('api/GroupOrder/Operation', param)
}
// 拼团-订单审核
export function GroupOrderUpdateKDReciver(param) {
  return axios.post('api/GroupOrder/UpdateKDReciver', param)
}

// 退款单列表
export function RefoundGetListByPage(param) {
  return axios.post('api/VShopOrderRefound/GetListByPage', param)
}
// 退款单详情
export function RefoundGetOrderDetail(param) {
  return axios.post('api/VShopOrderRefound/GetOrderDetail', param)
}
// 退款单删除
export function RefoundOperation(param) {
  return axios.post('api/VShopOrderRefound/Operation', param)
}
// 退款单审核
export function RefoundUpdateReply(param) {
  return axios.post('api/VShopOrderRefound/UpdateReply', param)
}

/**
 * 商城活动（促销活动）
 */
// 根据权限分页获取列表
export function ProductPromotionGetListByPage(param) {
  return axios.post('api/ProductPromotion/GetListByPage', param)
}
// 获取详情
export function ProductPromotionGetDetailById(param) {
  return axios.post('api/ProductPromotion/GetDetailById', param)
}
// 添加、更新、删除
export function ProductPromotionOperation(param) {
  return axios.post('api/ProductPromotion/Operation', param)
}

/**
 * 产品标签
 */
// 根据权限分页获取勋章规则列表
export function ProductLabelGetListByPage(param) {
  return axios.post('api/ProductLabel/GetListByPage', param)
}
// 获取下拉列表数据键值对
export function ProductLabelGetAll(param) {
  return axios.post('api/ProductLabel/GetAll', param)
}
// 获取标签详情
export function ProductLabelGetDetailById(param) {
  return axios.post('api/ProductLabel/GetDetailById', param)
}
// 添加、更新、删除
export function ProductLabelOperation(param) {
  return axios.post('api/ProductLabel/Operation', param)
}

/**
 * 勋章规则
 */
// 根据权限分页获取勋章规则列表
export function MedalRuleGetListByPage(param) {
  return axios.post('api/MedalRule/GetListByPage', param)
}
// 分页获取所有勋章规则列表
export function MedalRuleGetAllListByPage(param) {
  return axios.post('api/MedalRule/GetAllListByPage', param)
}
// 获取勋章规则的下拉列表
export function MedalRuleGetDropDownList(param) {
  return axios.post('api/MedalRule/GetDropDownList', param)
}
// 添加、更新、删除
export function MedalRuleOperation(param) {
  return axios.post('api/MedalRule/Operation', param)
}

/**
 * 勋章中心
 */
// 根据权限分页获取等级设置列表
export function MedalCenterGetListByPage(param) {
  return axios.post('api/MedalCenter/GetListByPage', param)
}
// 分页获取所有等级设置列表
export function MedalCenterGetAllListByPage(param) {
  return axios.post('api/MedalCenter/GetAllListByPage', param)
}
// 添加、更新、删除
export function MedalCenterOperation(param) {
  return axios.post('api/MedalCenter/Operation', param)
}

/**
 * 投票活动
 */
// 根据权限分页获取活动列表
export function VoteActivityGetListByPage(param) {
  return axios.post('api/VoteActivity/GetListByPage', param)
}
// 分页获取所有活动列表
export function VoteActivityGetAllListByPage(param) {
  return axios.post('api/VoteActivity/GetAllListByPage', param)
}
// 获取投票活动的详情（调用本接口会增加投票对象的浏览量）
export function VoteActivityGetDetails(param) {
  return axios.post('api/VoteActivity/GetDetails', param)
}
// 添加、更新、删除
export function VoteActivityOperation(param) {
  return axios.post('api/VoteActivity/Operation', param)
}

/**
 * 投票项（一个投票活动对应多个投票项）
 */
// 根据权限分页获取活动列表
export function VoteObjectGetListByPage(param) {
  return axios.post('api/VoteObject/GetListByPage', param)
}
// 分页获取所有活动列表
export function VoteObjectGetAllListByPage(param) {
  return axios.post('api/VoteObject/GetAllListByPage', param)
}
// 获取投票活动的详情（调用本接口会增加投票对象的浏览量）
export function VoteObjectGetDetails(param) {
  return axios.post('api/VoteObject/GetDetails', param)
}
// 添加、更新、删除
export function VoteObjectOperation(param) {
  return axios.post('api/VoteObject/Operation', param)
}

/**
 * 营销 - 活动报名
 */
// 根据权限分页获取活动列表
export function ActivityEnrollGetListByPage(param) {
  return axios.post('api/Activity/GetListByPage', param)
}
// 分页获取所有活动列表
export function ActivityEnrollGetAllListByPage(param) {
  return axios.post('api/Activity/GetAllListByPage', param)
}
// 获取活动详情
export function ActivityEnrollGetDetailById(param) {
  return axios.post('api/Activity/GetDetailById', param)
}
// 添加、更新、删除
export function ActivityEnrollOperation(param) {
  return axios.post('api/Activity/Operation', param)
}

/**
 * 微信
 */
// 根据用户的cid查询公号信息
export function WXGetByCid(param) {
  return axios.post('api/WeiXin/GetByCid', param)
}
// 微信公号信息的增加、删除、修改功能
export function WXOperation(param) {
  return axios.post('api/WeiXin/Operation', param)
}

/**
 * 渠道管理
 */
// 提现
// 根据权限分页获取业务员列表
export function WithDrawalsGetListByPage(param) {
  return axios.post('api/WithDrawals/GetListByPage', param)
}

// 分润记录
// 根据权限分页获取业务员列表
export function BenefitLogGetListByPage(param) {
  return axios.post('api/BenefitLog/GetListByPage', param)
}

// 业务员
// 根据权限分页获取业务员列表
export function SalesManGetListByPage(param) {
  return axios.post('api/SalesMan/GetListByPage', param)
}
// 根据_id获取业务员详情
export function SalesManGetDetailById(param) {
  return axios.post('api/SalesMan/GetDetailById', param)
}
// 添加、更新、删除
export function SalesManOperation(param) {
  return axios.post('api/SalesMan/Operation', param)
}

// 渠道专员
// 根据权限分页获取渠道专员列表
export function ChannelGetListByPage(param) {
  return axios.post('api/Channel/GetListByPage', param)
}
// 根据_id获取业务员详情
export function ChannelGetDetailById(param) {
  return axios.post('api/Channel/GetDetailById', param)
}
// 获取渠道专员下拉列表
export function ChannelGetDropDownList(param) {
  return axios.post('api/Channel/GetDropDownList', param)
}
// 添加、更新、删除
export function ChannelOperation(param) {
  return axios.post('api/Channel/Operation', param)
}

/**
 * 商城
 */
// 根据权限分页获取产品列表
export function ShopGetListByPage(param) {
  return axios.post('api/VShopProduct/GetListByPage', param)
}
// 分页获取所有产品列表
export function ShopGetAllListByPage(param) {
  return axios.post('api/VShopProduct/GetAllListByPage', param)
}
// 获取产品详情
export function ShopGetDetailById(param) {
  return axios.post('api/VShopProduct/GetDetailById', param)
}
// 添加、更新、删除
export function ShopOperation(param) {
  return axios.post('api/VShopProduct/Operation', param)
}
// 导入功能
export function ImportExcel(param) {
  return axios.post('api/VShopProduct/ImportExcel', param)
}
// 分页获取所有产品批次列表
export function GetBatchListByPage(param) {
  return axios.post('api/VShopProduct/GetBatchListByPage', param)
}
// 批次产品设置特殊产品处理
export function BatchHandle(param) {
  return axios.post('api/VShopProduct/BatchHandle', param)
}
// 点击批次产品临期报损处理
export function BatchScrap(param) {
  return axios.post('api/VShopProduct/BatchScrap', param)
}
// 点击批次产品临期时间调整
export function BatchTimeScrapOperation(param) {
  return axios.post('api/VShopProduct/BatchTimeScrap', param)
}
/**
 * 支付设置
 */
// 微信支付
// 根据用户的cid查询信息
export function WeChatPayGetByCid(param) {
  return axios.post('api/WeChatPayConfig/GetByCid', param)
}
// 信息的增加、删除、修改功能
export function WeChatPayOperation(param) {
  return axios.post('api/WeChatPayConfig/Operation', param)
}
// 支付宝
// 根据用户的cid查询信息
export function AliPayGetByCid(param) {
  return axios.post('api/AliPayConfig/GetByCid', param)
}
// 信息的增加、删除、修改功能
export function AliPayOperation(param) {
  return axios.post('api/AliPayConfig/Operation', param)
}
// 富友支付
// 根据用户的cid查询信息
export function FuiouGetByCid(param) {
  return axios.post('api/FuiouPayConfig/GetByCid', param)
}
// 信息的增加、删除、修改功能
export function FuiouOperation(param) {
  return axios.post('api/FuiouPayConfig/Operation', param)
}
// 西银惠付
// 根据用户的cid查询信息
export function WestGetByCid(param) {
  return axios.post('api/WestBankPayConfig/GetByCid', param)
}
// 信息的增加、删除、修改功能
export function WestOperation(param) {
  return axios.post('api/WestBankPayConfig/Operation', param)
}

// 宁波银行支付
// 根据用户的cid查询信息
export function ningboGetByCid(param) {
  return axios.post('/api/NBCBPayConfig/GetByCid', param)
}
// 信息的增加、删除、修改功能
export function ningboOperation(param) {
  return axios.post('/api/NBCBPayConfig/Operation', param)
}

/**
 * CMSFIX
 */
// 获取所有分类， 按父子集分开
export function CMSFIXContentList(param) {
  return axios.post('api/Banner/GetListByPage', param)
}
// 批量删除
export function CMSFIXDeleteMany(param) {
  return axios.post('api/Banner/DeleteMany', param)
}
// 获取CMS内容详情
export function CMSFIXGetDetailById(param) {
  return axios.post('api/Banner/GetDetailById', param)
}
// 添加、更新、删除
export function CMSFIXOperation(param) {
  return axios.post('api/Banner/Operation', param)
}

/**
 * CMS
 */
// 获取所有分类， 按父子集分开
export function CMSContentList(param) {
  return axios.post('api/Information/GetListByPage', param)
}

// 批量删除
export function DeleteMany(param) {
  return axios.post('api/Information/DeleteMany', param)
}
// 获取CMS内容详情
export function GetCmsDetailById(param) {
  return axios.post('api/Information/GetDetailById', param)
}
// 添加、更新、删除
export function CMSOperation(param) {
  return axios.post('api/Information/Operation', param)
}
// 分类
export function GetListByPage(param) {
  return axios.post('api/Category/GetListByPage', param)
}

// 获取所有分类， 按父子集分开
export function GetAllCategory(param) {
  return axios.post('api/Category/GetAllCategory', param)
}

// 添加、更新、删除
export function Operation(param) {
  return axios.post('api/Category/Operation', param)
}

/*
 * 菜单管理 *
 */

// 获取所有菜单
export function GetAllMenu(param) {
  return axios.post('api/Menu/GetAllMenu', param)
}

// 分页获取所有菜单
export function GetAllMenuByPage(param) {
  return axios.post('api/Menu/GetAllMenuByPage', param)
}

// 新增 / 更新 / 删除 菜单
export function MenuOperation(param) {
  return axios.post('api/Menu/Operation', param)
}

/*
 * 角色管理 *
 */

// 获取所有角色
export function GetAllUserRole(param) {
  return axios.post('api/UserRole/GetAllUserRole', param)
}

// 获取所有角色, 按父子集分开
export function GetAllUserRoleByLevel(param) {
  return axios.post('api/UserRole/GetAllUserRoleByLevel', param)
}

// 分页获取所有角色
export function GetAllUserRoleByPage(param) {
  return axios.post('api/UserRole/GetAllUserRoleByPage', param)
}

// 新增 / 更新 / 删除 角色
export function UserRoleOperation(param) {
  return axios.post('api/UserRole/Operation', param)
}

/*
 * 组织机构管理 *
 */

// 获取所有组织机构
export function GetAllUserOrganization(param) {
  return axios.post('api/Organization/GetAllUserOrganization', param)
}

// 获取所有组织机构, 按父子集分开
export function GetAllUserOrganizationByLevel(param) {
  return axios.post('api/Organization/GetAllUserOrganizationByLevel', param)
}

// 分页获取所有组织机构
export function GetAllUserOrganizationByPage(param) {
  return axios.post('api/Organization/GetAllUserOrganizationByPage', param)
}

// 新增 / 更新 / 删除 组织机构
export function UserOrganizationOperation(param) {
  return axios.post('api/Organization/Operation', param)
}

/*
 * 角色权限管理 *z
 */

// 获取某一角色权限
export function GetUserPermissionByRoleID(param) {
  return axios.post('api/Permission/GetUserPermissionByRoleID', param)
}

// 新增 / 更新 / 删除 角色权限
export function PermissionOperation(param) {
  return axios.post('api/Permission/Operation', param)
}

/*
 * 用户管理 *
 */

// 分页获取所有用户
export function GetAllUserByPage(param) {
  return axios.post('api/User/GetAllUserByPage', param)
}

// 新增 / 更新 / 删除 用户
export function UserOperation(param) {
  return axios.post('api/User/Operation', param)
}
// 重置系统用户密码
export function sysUserResetPwd(param) {
  return axios.post('api/User/UserPassWordUpdate', param)
}

// 商城设置
// 获取本机构商城设置信息（仅限机构管理员设置）
export function VShopSetUpOperation(param) {
  return axios.post('api/VShopSetUp/Operation', param)
}
// 添加、更新、删除
export function GetSetUpObj(param) {
  return axios.post('api/VShopSetUp/GetSetUpObj', param)
}
// 获取所有店铺信息
export function GetAllShop(param) {
  return axios.post('api/VShopSetUp/GetAllShop', param)
}
// 地图搜索
export function tMapSuggestion(params) {
  return axios.post('/api/VShopSetUp/suggestion', params)
}

// 客户关系管理
// 分页获取客户关系表
export function UserCRMList(param) {
  return axios.post('api/UserCRM/GetListByPage', param)
}
// 获取客户的昵称--openid下拉选项数据集
export function UserCRMid(param) {
  return axios.post('api/UserCRM/GetDropDownListForOpenid', param)
}
// 获取用户详情
export function GetUserDetail(param) {
  return axios.post('api/UserCRM/GetUserDetail', param)
}
// 添加、更新、删除
export function UserCRMOperation(param) {
  return axios.post('api/UserCRM/Operation', param)
}

// 邮费模板
// 分页获取邮费模板列表
export function PostTemplateList(param) {
  return axios.post('api/PostTemplate/GetListByPage', param)
}
// 邮费模板下拉框选项数据集
export function GetDropDownList(param) {
  return axios.post('api/PostTemplate/GetDropDownList', param)
}
// 获取邮费模板详情
export function GetPostTemplateDetail(param) {
  return axios.post('api/PostTemplate/GetDetailById', param)
}
// 添加、更新、删除
export function PostTempOperation(param) {
  return axios.post('api/PostTemplate/Operation', param)
}
// 更新开通vip会员
export function GetVipUser(params) {
  return axios.post('/api/Cashier/GetVipUser', params)
}
// 配送费
// 分页获取配送费列表
export function DistanceList(param) {
  return axios.post('api/DistanceFee/GetListByPage', param)
}
// 添加、更新、删除
export function DistanceOperation(param) {
  return axios.post('api/DistanceFee/Operation', param)
}

// 派送区域
// 分页获取配送费列表
export function DeliveryList(param) {
  return axios.post('api/DeliveryArea/GetListByPage', param)
}
// 手机选择省市区的接口
export function DeliveryProvideArea(param) {
  return axios.post('api/DeliveryArea/ProvideArea', param)
}
// 添加、更新、删除
export function DeliveryOperation(param) {
  return axios.post('api/DeliveryArea/Operation', param)
}

// 收货地址
// 根据openid获取收货地址
export function AddrList(param) {
  return axios.post('api/ReceiveAddress/GetListByOpenid', param)
}
// 添加、更新、删除
export function AddrOperation(param) {
  return axios.post('api/ReceiveAddress/Operation', param)
}
// 订单
// 获取零售，餐食，饮品所有订单列表
export function getAllOrderList(param) {
  return axios.post('api/VShopOrder/GetPayCheckOrderListByPage', param)
}
// 获取零售，餐食，饮品所有订单详情
export function getAllOrderDetail(param) {
  return axios.post('api/VShopOrder/GettPayCheckOrderDetail', param)
}
// 分页获取所有订单列表
export function OrderList(param) {
  return axios.post('api/VShopOrder/GetListByPage', param)
}
// 根据用户的openid查询用户的订单
export function OrderByOpenid(param) {
  return axios.post('api/VShopOrder/GetListByOpenid', param)
}
// 详情
export function GetOrderDetail(param) {
  return axios.post('api/VShopOrder/GetOrderDetail', param)
}
// 导出Excel（按查询条件导出）
export function OrderExport(param) {
  return axios.postFile('api/VShopOrder/ExportByCondition', param, { responseType: 'arraybuffer' })
}
// 导出Excel（批量导出）
export function OrderBatchExcel(param) {
  return axios.post('api/VShopOrder/BatchExcel', param)
}
// 打印订单
export function PrintOrder(param) {
  return axios.post('api/VShopOrder/PrintOrder', param)
}
// 添加、更新、删除
export function OrderOperation(param) {
  return axios.post('api/VShopOrder/Operation', param)
}
// 更新快递信息或者收件人信息
export function VShopOrderUpdateKDReciver(param) {
  return axios.post('api/VShopOrder/UpdateKDReciver', param)
}
// 更新订单状态
export function VShopUpdateOrderStatus(param) {
  return axios.post('api/VShopOrder/UpdateOrderStatus', param)
}

// 订单评价
// 分页获取所有订单列表
export function EvaluateList(param) {
  return axios.post('api/Evaluate/GetListByPage', param)
}
// 添加、更新、删除
export function EvaluateOperation(param) {
  return axios.post('api/Evaluate/Operation', param)
}

// 内容评价
// 分页获取所有订单列表
export function CommentList(param) {
  return axios.post('api/Comments/GetListByPage', param)
}
// 添加、更新、删除
export function CommentOperation(param) {
  return axios.post('api/Comments/Operation', param)
}

// 兑换券GiftCard
// 分页获取所有优惠列表
export function GiftCardList(param) {
  return axios.post('api/GiftCard/GetAllListByPage', param)
}
// 详情
export function GiftCardDetail(param) {
  return axios.post('api/GiftCard/GetDetailById', param)
}
// 添加、更新、删除
export function GiftCardOperation(param) {
  return axios.post('api/GiftCard/Operation', param)
}

// CashCard 代金券
// 分页获取列表
export function CashCardList(param) {
  return axios.post('api/CashCard/GetAllListByPage', param)
}
// 详情
export function CashCardDetail(param) {
  return axios.post('api/CashCard/GetDetailById', param)
}
// 添加、更新、删除
export function CashCardOperation(param) {
  return axios.post('api/CashCard/Operation', param)
}

// DiscountCard 折扣券
// 分页获取列表
export function DiscountCardList(param) {
  return axios.post('api/DiscountCard/GetAllListByPage', param)
}
// 详情
export function DiscountCardDetail(param) {
  return axios.post('api/DiscountCard/GetDetailById', param)
}
// 添加、更新、删除
export function DiscountCardOperation(param) {
  return axios.post('api/DiscountCard/Operation', param)
}

// SmallCard 大小券
export function smallCardList(param) {
  return axios.post('api/SmallCard/GetAllListByPage', param)
}
// 详情
export function smallCardDetail(param) {
  return axios.post('api/SmallCard/GetDetailById', param)
}
// 添加、更新、删除
export function smallCardOperation(param) {
  return axios.post('api/SmallCard/Operation', param)
}

// 积分商城产品库
// 根据权限分页获取积分设置列表
export function IntegralProductList(param) {
  return axios.post('api/IntegralProduct/GetListByPage', param)
}
// 分页获取所有积分设置列表
export function IntegralAllProductList(param) {
  return axios.post('api/IntegralProduct/GetAllListByPage', param)
}
// 获取积分产品库详情
export function IntegralProductDetail(param) {
  return axios.post('api/IntegralProduct/GetDetailById', param)
}
// 添加、更新、删除
export function IntegralProductOperation(param) {
  return axios.post('api/IntegralProduct/Operation', param)
}
// 积分订单发货
export function IntegralOrderUpdateKDReciver(param) {
  return axios.post('api/IntegralOrder/UpdateKDReciver', param)
}

// 积分订单
// 根据权限分页获取积分设置列表
export function IntegralOrderList(param) {
  return axios.post('api/IntegralOrder/GetListByPage', param)
}
// 分页获取所有积分设置列表
export function IntegralAllOrderList(param) {
  return axios.post('api/IntegralOrder/GetAllListByPage', param)
}
// 获取积分订单详情
export function IntegralOrderDetail(param) {
  return axios.post('api/IntegralOrder/GetDetailById', param)
}
// 添加、更新、删除
export function IntegralOrderOperation(param) {
  return axios.post('api/IntegralOrder/Operation', param)
}
// 根据积分产品id 获取积分订单
export function IntegralOrderGetListByProductId(param) {
  return axios.post('api/IntegralOrder/GetListByProductId', param)
}
// RechargeOrder 充值记录
// 分页获取所有积分设置列表
export function rechargeList(param) {
  return axios.post('api/RechargeOrder/GetOrderListByPage', param)
}
// 添加、更新、删除
export function rechargeOperation(param) {
  return axios.post('api/RechargeOrder/Operation', param)
}
// 充值订单退款
export function rechargeOrderRefundOperation(param) {
  return axios.post('api/RechargeOrder/RefundRechargeOrder', param)
}

// RechargeDiscount 充值优惠
// 分页获取所有积分设置列表
export function RechargeDiscountList(param) {
  return axios.post('api/RechargeDiscount/GetAllListByPage', param)
}
// 添加、更新、删除
export function RechargeDiscountOperation(param) {
  return axios.post('api/RechargeDiscount/Operation', param)
}

// UserCardsRecord 用户领取卡券记录
export function userCardsList(param) {
  return axios.post('api/UserCardsRecord/GetAllListByPage', param)
}
// 用户日志
export function UserLogList(param) {
  return axios.post('/api/UserLog/GetDropDownList', param)
}
// (追光定制)积分使用规则的Controller
// 积分列表
export function GetIntegralRule(param) {
  return axios.post('/api/VShopRule/GetIntegralRule', param)
}
// 积分修改
export function IntergralOption(param) {
  return axios.post('/api/VShopRule/Operation', param)
}
// VIP会员卡管理
// 分页获取VIP套餐表
export function GetVIPListByPage(param) {
  return axios.post('/api/UserVIP/GetVIPListByPage', param)
}
// 获取vip套餐详情
export function GetVipDetail(param) {
  return axios.post('/api/UserVIP/GetVipDetail', param)
}
// vip套餐添加、更新、删除
export function vipOption(param) {
  return axios.post('/api/UserVIP/Operation', param)
}
// 分页获取VIP订单表
export function vipOrderList(param) {
  return axios.post('/api/UserVIP/GetOrderListByPage', param)
}
// 获取购买vip订单详情
export function GetVipOrderDetail(param) {
  return axios.post('/api/UserVIP/GetVipOrderDetail', param)
}

// 首单累计赠劵活动区域的Controller
// 分页获取首单活动列表(赠劵)
export function BuyActivityList(param) {
  return axios.post('/api/BuyActivity/GetBuyActListByPage', param)
}
// 获取首单活动详情(赠劵)
export function GetBuyActDetail(param) {
  return axios.post('/api/BuyActivity/GetBuyActDetail', param)
}
// 添加、更新、删除
export function GetBuyActOption(param) {
  return axios.post('/api/BuyActivity/Operation', param)
}
// 分页获取首单赠送卡劵记录表
export function GetGiftOrderByPage(param) {
  return axios.post('/api/BuyActivity/GetGiftOrderByPage', param)
}
// 获取首单赠送卡劵记录详情
export function GetCardOrderDetail(param) {
  return axios.post('/api/BuyActivity/GetVipOrderDetail', param)
}

// 数据统计
// 获取订单数据信息
export function DataStatistics(param) {
  return axios.post('/api/DataStatistics/NewOrderStatistics', param)
}
// 优惠订单信息统计表
export function BenefitGetInfo(param) {
  return axios.post('/api/DataStatistics/BenefitGetInfo', param)
}
// 导出数据
export function DataExportExcel(param) {
  return axios.postFile('api/DataStatistics/ExportExcel', param, { responseType: 'arraybuffer' })
}
// 根据产品id查成本记录
export function ProductCostGetListByPage(param) {
  return axios.post('/api/ProductCost/GetListByPage', param)
}

// 通联支付
// 分页获取
export function AllinpayGetByCid(param) {
  return axios.post('api/Allinpay/GetByCid', param)
}
// 增删改
export function AllinpayOperation(param) {
  return axios.post('api/Allinpay/Operation', param)
}
/**
 * 餐食销售功能版块
 */
// 分页获取餐食分类列表
export function GetMealsType(param) {
  return axios.post('api/ShopMeals/GetMealsType', param)
}
// (餐食分类)添加、更新、删除
export function TypeOperation(param) {
  return axios.post('api/ShopMeals/TypeOperation', param)
}
// 分页获取餐食库列表
export function GetMealsProduct(param) {
  return axios.post('api/ShopMeals/GetMealsProduct', param)
}
// (餐食库)添加、更新、删除
export function MProdOperation(param) {
  return axios.post('api/ShopMeals/MProdOperation', param)
}
// 获取餐食库详情
export function MealsProductId(param) {
  return axios.post('api/ShopMeals/MealsProductId', param)
}
// 获取所有餐食分类
export function AllMealsType(param) {
  return axios.post('api/ShopMeals/AllMealsType', param)
}
// 分页每日餐食排单
export function GetDailyArrange(param) {
  return axios.post('api/ShopMeals/GetDailyArrange', param)
}
// (餐食菜单)添加、更新、删除
export function DailyAryOperation(param) {
  return axios.post('api/ShopMeals/DailyAryOperation', param)
}
// 获取每日餐食排单详情
export function DailyArrangeId(param) {
  return axios.post('api/ShopMeals/DailyArrangeId', param)
}
// 分页获取餐食库列表
export function Getdailyproduct(param) {
  return axios.post('api/ShopMeals/Getdailyproduct', param)
}
// (餐食菜单产品)添加、更新、删除
export function DailyProdOperation(param) {
  return axios.post('api/ShopMeals/DailyProdOperation', param)
}
// 获取餐食菜单产品详情
export function DailyproductId(param) {
  return axios.post('api/ShopMeals/DailyproductId', param)
}
// 餐食菜单产品查询(搜索)
export function ProductSearch(param) {
  return axios.post('api/ShopMeals/ProductSearch', param)
}
// 菜单复用
export function CopyCreate(param) {
  return axios.post('api/ShopMeals/CopyCreate', param)
}
// 分页获取餐食订单列表
export function GetVShopFoodOrder(param) {
  return axios.post('api/ShopMeals/GetVShopFoodOrder', param)
}
// 获取餐食订单详情
export function DailyVShopFoodOrderId(param) {
  return axios.post('api/ShopMeals/DailyVShopFoodOrderId', param)
}
/**
 人脸识别**/
// 分页获取人脸底库列表
export function GetFaceLibrary(param) {
  return axios.post('api/FaceAI/GetFaceLibrary', param)
}
// 分页获取人脸记录列表
export function GetFaceRecord(param) {
  return axios.post('api/FaceAI/GetFaceRecord', param)
}
// 人脸识别参数配置
export function GetFacesetUp(param) {
  return axios.post('api/FaceAI/GetFacesetUp', param)
}
// 分页获取人脸记录列表
export function faceOperation(param) {
  return axios.post('api/FaceAI/Operation', param)
}
// --------------------------------供应链模块
// 供应商模块
// 分页获取列表
export function SupplierGetListByPage(param) {
  return axios.post('api/Supplier/GetListByPage', param)
}
// 获取详情
export function SupplierGetDetailById(param) {
  return axios.post('api/Supplier/GetListById', param)
}
// 添加、更新、删除
export function SupplierOperation(param) {
  return axios.post('api/Supplier/Operation', param)
}
// 供应商-产品模块
// 分页获取列表
export function SupplierProductGetListByPage(param) {
  return axios.post('api/SupplierProduct/GetListByPage', param)
}
// 添加、更新、删除
export function SupplierProductOperation(param) {
  return axios.post('api/SupplierProduct/Operation', param)
}
// 批量新增产品
export function SupplierProductCreateProductList(param) {
  return axios.post('api/SupplierProduct/CreateProductList', param)
}
// 供应商-订单列表
// 分页获取列表
export function GetSupplierGoodsList(param) {
  return axios.post('api/Supplier/GetSupplierGoodsList', param)
}

// 采购单模块
// 分页获取列表
export function SupplierOrderGetListByPage(param) {
  return axios.post('api/SupplierOrder/GetListByPage', param)
}
// 获取详情
export function SupplierOrderGetDetailById(param) {
  return axios.post('api/SupplierOrder/GetSupplierOrderById', param)
}
// 添加、更新、删除
export function SupplierOrderOperation(param) {
  return axios.post('api/SupplierOrder/Operation', param)
}
// 采购单-产品模块
// 分页获取列表
export function SupplierGoodsGetListByPage(param) {
  return axios.post('api/SupplierGoods/GetListByPage', param)
}
// 添加、更新、删除
export function SupplierGoodsOperation(param) {
  return axios.post('api/SupplierGoods/Operation', param)
}
// 根据产品条形码获取供应商列表
export function SupplierGoodsGetSupplierInfo(param) {
  return axios.post('api/SupplierGoods/GetSupplierInfo', param)
}
// 供应商采购单产品同时生成
export function SupplierGoodsCreateOrder(param) {
  return axios.post('api/SupplierGoods/CreateOrder', param)
}
// 采购单产品同时生成
export function PurchaseOrderCreateOrder(param) {
  return axios.post('api/PurchaseOrder/CreateOrder', param)
}

// 已入库产品列表
export function GetGetwStateTrueByPage(param) {
  return axios.post('api/EnterRecord/GetGetwStateTrueByPage', param)
}

// 临其产品列表
export function GetPeriodTimeByPage(param) {
  return axios.post('api/EnterRecord/GetPeriodTimeByPage', param)
}
// 临其产品处理
export function UpdatePeriodTimeStatues(param) {
  return axios.post('api/EnterRecord/UpdatePeriodTimeStatues', param)
}

// 获取分润规则列表-智达毅生用
export function GetRegulationInfo(param) {
  return axios.post('api/Regulation/GetRegulationInfo', param)
}
// 分润规则维护-智达毅生用
export function RegulationOperation(param) {
  return axios.post('api/Regulation/Operation', param)
}
// 根据渠道获取分润列表
export function GetWriteDownListByPage(param) {
  return axios.post('api/Regulation/GetWriteDownListByPage', param)
}

// 提现列表
export function WithdrawList(param) {
  return axios.post('api/Regulation/CashWithdrawalPageList', param)
}
// 提现审核
export function WithdrawAudit(param) {
  return axios.post('api/Regulation/CashWithdrawalOperation', param)
}

// 老年人折扣规则列表
export function OldManList(param) {
  return axios.post('api/OldUserRole/GetListByPage', param)
}
// 老年人折扣规则增删改
export function OldManOperation(param) {
  return axios.post('api/OldUserRole/Operation', param)
}

// 获取渠道的提现列表
export function ChannelWithdrawList(param) {
  return axios.post('api/Regulation/CashWithdrawalMobeilPageList', param)
}
// 获取渠道的用户列表
export function ChannelUserList(param) {
  return axios.post('api/Cashier/GetUserCRMQdList', param)
}

// V6-V8 交互模块
// 校验供货单号是否合法
export function PurchaseOrderCheckOrderNum(param) {
  return axios.post('api/PurchaseOrder/CheckOrderNum', param)
}
// 获取V8产品分类
export function GetV8Category(param) {
  return axios.post('api/Category/GetCategory', param)
}
// 分页获取V8产品列表
export function GetV8ProductList(param) {
  return axios.post('api/PurchaseOrder/GetProductInfoListByPageFromV8', param)
}
// 根据订单号向v8推送订单
export function PushOrderToV8(param) {
  return axios.post('api/PurchaseOrder/PurchaseOrderToV8', param)
}
// 根据订单号从v8获取最新订单信息
export function PullOrderFromV8(param) {
  return axios.post('api/PurchaseOrder/UpdateGoodsFromV8', param)
}
// 根据订单号删除订单（v6,v8）
export function DeleteOrderV6V8(param) {
  return axios.post('api/PurchaseOrder/DeletePurchaseOrderToV8', param)
}
// 入库操作（v6到货签收）
export function EnterRecordOperation(param) {
  return axios.post('api/PurchaseOrder/SignForProduct', param)
}
// 入库操作（供应商采购）
export function EnterRecordOperationSup(param) {
  return axios.post('api/EnterRecord/EnterRecordOperation', param)
}
// 生成预警库存产品的列表
export function StocksForewarnList(param) {
  return axios.post('api/PurchaseOrder/StocksForewarnList', param)
}
// 生成采购单
export function CreatePurchaseOrder(param) {
  return axios.post('api/PurchaseOrder/CreatePurchaseOrder', param)
}
// 加载v8产品分类列表
export function GetV8CategoryInfo(param) {
  return axios.post('api/PurchaseOrder/GetV8CategoryInfo', param)
}
//  同步产品分类
export function SynchronismCategory(param) {
  return axios.post('api/PurchaseOrder/SynchronismCategory', param)
}
//  根据产品分类ID 同步v8产品
export function GetProductInfoByCategory(param) {
  return axios.post('api/PurchaseOrder/GetProductInfoByCategory', param)
}
// 向总仓采购入库（一键入库）
export function totalWarehouseQuick(param) {
  return axios.post('api/PurchaseOrder/QuickWarehous', param)
}
// 向供应商采购入库（一键入库）
export function supplierWarehouseQuick(param) {
  return axios.post('api/PurchaseOrder/QuickWarehousOperation', param)
}
//  推送用户到V8
export function SynchronousUser(param) {
  return axios.post('api/User/SynchronousUser', param)
}

// 分页查询未审核用户信息
export function GetExamineUserByPage(param) {
  return axios.post('api/User/GetExamineUserByPage', param)
}
// 获取详情
export function ChannelUserDetail(param) {
  return axios.post('api/User/GetUserInfoById', param)
}
// 增删改
export function ChannelUserOperation(param) {
  return axios.post('api/User/UserOperation', param)
}
// 审核用户
export function ToExamineUser(param) {
  return axios.post('api/User/ToExamineUser', param)
}

// 充值卡分页获取列表
export function RechargeCardGetList(param) {
  return axios.post('api/RechargeCard/GetAllListByPage', param)
}
// 充值卡增删改
export function RechargeCardOperation(param) {
  return axios.post('api/RechargeCard/Operation', param)
}
// 充值卡激活
export function RechargeCardActive(param) {
  return axios.post('api/RechargeCard/ActiveCard', param)
}
// 充值卡单张激活
export function RechargeCardSingleActive(param) {
  return axios.post('api/RechargeCard/ActiveOneCard', param)
}
// 充值卡导出
export function RechargeCardExcel(param) {
  return axios.postFile('api/RechargeCard/ExcelOutByTitle', param, { responseType: 'arraybuffer' })
}

// 导出产品
export function VShopProductProductExcelNew(param) {
  return axios.postFile('api/VShopProduct/ProductExcelNew', param, { responseType: 'arraybuffer' })
}
// 导入老产品，对比差异
export function VShopProductImporProExcel(param) {
  return axios.postFile('api/VShopProduct/ImporProExcel', param, { responseType: 'arraybuffer' })
}

// 导入产品初始化成本
export function PorductCostImportExcel(param) {
  return axios.postFile('api/VShopProduct/PorductCostImportExcel', param, { responseType: 'arraybuffer' })
}

// 积分规则获取详情根据cid
export function DefineIntegralGetByCid(param) {
  return axios.post('api/DefineIntegral/GetByCid', param)
}
// 积分规则增删改
export function DefineIntegralOperation(param) {
  return axios.post('api/DefineIntegral/Operation', param)
}

// 分页获取调配单列表
export function AlllotOrderList(param) {
  return axios.post('api/AlllotOrder/GetListByPage', param)
}
// 生成调配单
export function AddAllotOrder(param) {
  return axios.post('api/AlllotOrder/AddAllotOrder', param)
}
// 作废调配单（取消收货）
export function CancelAllotOrder(param) {
  return axios.post('api/AlllotOrder/CancelAllotOrder', param)
}

// 入库（确认收货）
export function ConfirmAllotOrder(param) {
  return axios.post('api/AlllotOrder/InStcok', param)
}
// 调拨模块-店名下拉
export function AllotGetUserDropDownList(param) {
  return axios.post('api/AlllotOrder/GetUserDropDownList', param)
}
// 出入库导出
export function allocationExport(param) {
  return axios.postFile('api/AlllotOrder/NewAllotExportExcel', param, { responseType: 'arraybuffer' })
}

// 货架列表
export function ShelfList(param) {
  return axios.post('api/GoodsShelves/GetListByPage', param)
}
// 货架增删改
export function ShelfOperation(param) {
  return axios.post('api/GoodsShelves/Operation', param)
}
// 货架内产品列表
export function ShelfProductList(param) {
  return axios.post('api/GoodsShelvesProduct/GetListByPage', param)
}
// 货架内产品增
export function ShelfProductOperation(param) {
  return axios.post('api/GoodsShelvesProduct/Operation', param)
}
// 货架内产品删改
export function ShelfProductUpdate(param) {
  return axios.post('api/GoodsShelvesProduct/UpdateOperation', param)
}
// 更新用户会员时间
export function updataUserVipTime(param) {
  return axios.post('api/UserCRM/UpdateVIPDate', param)
}
// 更新用户可用余额
export function updataUserAvailableBalance(param) {
  return axios.post('api/UserCRM/UpdateAccountMoney', param)
}
// 根据用户id获取收货地址
export function GetAddressList(param) {
  return axios.post('api/UserCRM/GetAddressList', param)
}
// 打印机设备接口
// 新增打印机设备
export function printerOperation(param) {
  return axios.post('/api/OrderPrint/Operation', param)
}

// 获取打印机列表
export function queryPrinterList(param) {
  return axios.post('/api/OrderPrint/GetAllListByPage', param)
}

// 获取打印机详情
export function queryPrinterDetail(param) {
  return axios.post('/api/OrderPrint/GetDetailById', param)
}
// 获取打印机详情
export function GetOrderPrint(param) {
  return axios.post('/api/VShopOrder/GetOrderPrint', param)
}
// 获取芯烨云打印机列表
export function getXinyePrint(param) {
  return axios.post('/api/OrderPrint/GetPrintListByPage', param)
}
// 获取芯烨云打印机详情
export function getXinyePrintDetail(param) {
  return axios.post('/api/OrderPrint/GetPrintDetailById', param)
}
// 添加，更新，删除芯烨云打印机
export function xinyePrintOperation(param) {
  return axios.post('/api/OrderPrint/PrintOperation', param)
}

// 一键下架
export function UpdateUpDown(param) {
  return axios.post('/api/VShopProduct/UpdateUpDown', param)
}
// 分页获取开店成本费列表
export function GetCostReport(param) {
  return axios.post('/api/DataStatistics/GetCostReport', param)
}
// 获取开店成本费详情
export function DetailCostReport(param) {
  return axios.post('/api/DataStatistics/DetailCostReport', param)
}
// (获开店成本费管理)添加、更新、删除
export function CargodamageOperation(param) {
  return axios.post('/api/DataStatistics/CargodamageOperation', param)
}
// 分页获取其他支出费列表
export function DetailOtherCost(param) {
  return axios.post('/api/DataStatistics/DetailOtherCost', param)
}
// (其他支出费)添加、更新、删除
export function OtherCostOperation(param) {
  return axios.post('/api/DataStatistics/OtherCostOperation', param)
}
// 获取订单数据信息(新)
export function EverydaySale(param) {
  return axios.post('/api/DataStatistics/EverydaySale', param)
}
// 产品消费类型占比
export function NewOrderStateStatistics(param) {
  return axios.post('api/DataStatistics/NewOrderStateStatistics', param)
}
/**
 * 预约
 */
// 分页获取预约项目列表
export function GetReserveItem(param) {
  return axios.post('/api/ShopReserve/GetReserveItem', param)
}
// 分页获取预约项目列表
export function GetReserveItemDetails(param) {
  return axios.post('/api/ShopReserve/GetReserveItemDetails', param)
}
// (预约项目)添加、更新、删除
export function ReserveOperation(param) {
  return axios.post('/api/ShopReserve/ReserveOperation', param)
}
// 分页获取预约产品库列表
export function GetReserveProduct(param) {
  return axios.post('/api/ShopReserve/GetReserveProduct', param)
}
// 获取预约产品库详情
export function ReserveProductId(param) {
  return axios.post('/api/ShopReserve/ReserveProductId', param)
}
// (预约产品库)添加、更新、删除
export function ProdOperation(param) {
  return axios.post('/api/ShopReserve/ProdOperation', param)
}
// 分页获取预约事件列表
export function GetProductPack(param) {
  return axios.post('/api/ShopReserve/GetProductPack', param)
}
// 获取预约事件详情
export function ProductPackDetails(param) {
  return axios.post('/api/ShopReserve/ProductPackDetails', param)
}
// (预约事件)添加、更新、删除
export function PackOperation(param) {
  return axios.post('/api/ShopReserve/PackOperation', param)
}
// 预约控制台
export function GetReserveList(param) {
  return axios.post('/api/ShopReserve/GetReserveList', param)
}
// (预约控制台)添加、更新、删除
export function PlanOperation(param) {
  return axios.post('/api/ShopReserve/PlanOperation', param)
}
// 预约订单列表
export function GetReserveOrder(param) {
  return axios.post('/api/ShopReserve/GetReserveOrder', param)
}
// 获取预约订单详情
export function DailyReserveOrderId(param) {
  return axios.post('/api/ShopReserve/DailyReserveOrderId', param)
}
/**
 * 数据分析汇总展示接口
 */
// 根据日期查询每日结算原始数据
export function GetDailyPayReportOriginData(param) {
  return axios.post('/api/DataAnalysis/GetDailyPayReportOriginData', param)
}
// 根据日期查询餐食和VIP购买和充值余额金额
export function GetVIPFoodChargeMoney(param) {
  return axios.post('/api/DataAnalysis/GetVIPFoodChargeMoney', param)
}
// 根据id查询每日结算数据
export function GetDailyPayReportData(param) {
  return axios.post('/api/DataAnalysis/GetDailyPayReportData', param)
}
// 保存每日结算报表
export function DailyPayReport(param) {
  return axios.post('/api/DataAnalysis/DailyPayReport', param)
}
// 查询餐食饮品成本价
export function getFoodDrinkCost(param) {
  return axios.post('/api/DataAnalysis/QueryCost', param)
}
// 查询餐食饮品货损列表
export function getFoodDrinkDamageList(param) {
  return axios.post('/api/FoodDrinkDamage/GetListByPage', param)
}
// 查询餐食饮品货损详情
export function getFoodDrinkDamageDetail(param) {
  return axios.post('/api/FoodDrinkDamage/GetDetailById', param)
}
// 添加，更新，删除货损操作
export function damageOperation(param) {
  return axios.post('/api/FoodDrinkDamage/Operation', param)
}
// 查询每日结算报表列表
export function DailyPayReportList(param) {
  return axios.post('/api/DataAnalysis/DailyPayReportList', param)
}
// 根据日期查询采购成本
export function GetSupplierOrderMoney(param) {
  return axios.post('/api/DataAnalysis/GetSupplierOrderMoney', param)
}
// 根据日期查询销售成本
export function GetProductCostMoney(param) {
  return axios.post('/api/DataAnalysis/GetProductCostMoney', param)
}
// 查询货值
export function GetProductValue(param) {
  return axios.post('/api/DataAnalysis/GetProductValue', param)
}
// 每日各种支付方式金额
export function GetDailyPayReportOriginDataNoSum(param) {
  return axios.post('/api/DataAnalysis/GetDailyPayReportOriginDataNoSum', param)
}
// 每日各种(支付来源)中的支付方式金额
export function GetDailyPaySummaryBySourceDataNoSum(param) {
  return axios.post('/api/DataAnalysis/GetDailyPaySummaryBySourceDataNoSum', param)
}
// 根据日期查询每日盘库亏损数据
export function getLossRecord(param) {
  return axios.post('/api/TrueInventoryRecord/GetLossRecord', param)
}
/**
 * 产品折扣销售
 */
// 分页获取促销活动列表
export function GetActivity(param) {
  return axios.post('/api/ShopPromotion/GetActivity', param)
}
// 获取促销活动详情
export function ActivityDetails(param) {
  return axios.post('/api/ShopPromotion/ActivityDetails', param)
}
// (促销活动)添加、更新、删除
export function ActivityOperation(param) {
  return axios.post('/api/ShopPromotion/ActivityOperation', param)
}
// 分页获取促销产品列表
export function GetProduct(param) {
  return axios.post('/api/ShopPromotion/GetProduct', param)
}
// 获取促销产品详情
export function ProductDetails(param) {
  return axios.post('/api/ShopPromotion/ProductDetails', param)
}
// (促销产品)添加、更新、删除
export function PActivityOperation(param) {
  return axios.post('/api/ShopPromotion/PActivityOperation', param)
}
// 分页获取组合套餐产品列表
export function GetSetMeal(param) {
  return axios.post('/api/ShopPromotion/GetSetMeal', param)
}
// 获取组合套餐产品详情
export function SetMealDetails(param) {
  return axios.post('/api/ShopPromotion/SetMealDetails', param)
}
// (组合套餐产品)添加、更新、删除
export function SetMealOperation(param) {
  return axios.post('/api/ShopPromotion/SetMealOperation', param)
}
// 分页获取选购组合套餐产品列表
export function GetChooseMeal(param) {
  return axios.post('/api/ShopPromotion/GetChooseSetMeal', param)
}
// 获取选购组合套餐产品详情
export function ChooseMealDetails(param) {
  return axios.post('/api/ShopPromotion/ChooseSetMealDetails', param)
}
// (选购组合套餐产品)添加、更新、删除
export function ChooseMealOperation(param) {
  return axios.post('/api/ShopPromotion/ChooseSetMealOperation', param)
}

// 赠送卡劵
// 分页获取注册赠送卡劵规则
export function GetRegisterRuleByPage(param) {
  return axios.post('/api/Coupons/GetRegisterRuleByPage', param)
}
// 获取报名详情
export function GetRegisterDetailById(param) {
  return axios.post('/api/Coupons/GetRegisterDetailById', param)
}
// 添加、更新、删除(注册赠送卡劵规则)
export function RegisterOperation(param) {
  return axios.post('/api/Coupons/RegisterOperation', param)
}
// 分页获取单笔消费赠劵规则
export function GetSingleRuleByPage(param) {
  return axios.post('/api/Coupons/GetSingleRuleByPage', param)
}
// 获取报名详情
export function GetSingleDetailId(param) {
  return axios.post('/api/Coupons/GetSingleDetailId', param)
}
// 添加、更新、删除
export function SingleOperation(param) {
  return axios.post('/api/Coupons/SingleOperation', param)
}
// 添加、更新、删除
export function GetAllCardList(param) {
  return axios.post('/api/Coupons/GetAllListByPage', param)
}
// 分页领取卡劵记录列表
export function GetGiveRecordByPage(param) {
  return axios.post('/api/Coupons/GetGiveRecordByPage', param)
}
// /*会员制度*/
// 分页获取用户等级规则表
export function GetLevelByPage(param) {
  return axios.post('api/UserLevel/GetLevelByPage', param)
}
// 添加、更新、删除
export function UserLevelOperation(param) {
  return axios.post('api/UserLevel/Operation', param)
}
// 每日签到规则参数设置
export function SignInDayQuery(param) {
  return axios.post('api/GiveRule/SignInDayQuery', param)
}
//
export function SignInDayOperation(param) {
  return axios.post('api/GiveRule/SignInDayOperation', param)
}
// 规则设置(赠送规则类型)
export function GiveRuleType(param) {
  return axios.post('api/GiveRule/GiveRuleType', param)
}
// 条件赠送积分规则参数设置
export function GiveRuleQuery(param) {
  return axios.post('api/GiveRule/GiveRuleQuery', param)
}
// 条件赠送积分规则参数设置）添加、更新、删除
export function GiveOperation(param) {
  return axios.post('api/GiveRule/GiveOperation', param)
}
// 用户身份规则管理
// 条件赠送积分规则参数设置）添加、更新、删除
export function GetUserIdentityByPage(param) {
  return axios.post('api/UserIdentityRule/GetUserIdentityByPage', param)
}
// 添加、更新、删除（会员所处身份）
export function IdentityOperation(param) {
  return axios.post('api/UserIdentityRule/IdentityOperation', param)
}
// 分页获取会员所处身份规则
export function GetIdentityRuleByPage(param) {
  return axios.post('api/UserIdentityRule/GetIdentityRuleByPage', param)
}
// 添加、更新、删除(会员所处身份规则)
export function RuleOperation(param) {
  return axios.post('api/UserIdentityRule/RuleOperation', param)
}
// 分页获取特殊产品(不享有身份规则优惠)
export function GetSpecialProduct(param) {
  return axios.post('api/UserIdentityRule/GetSpecialProduct', param)
}
// 分页获取所有产品列表
export function GetProductByPage(param) {
  return axios.post('api/UserIdentityRule/GetAllListByPage', param)
}
// 添加、更新、删除（特殊产品(不享有身份规则优惠)）
export function SprodOperation(param) {
  return axios.post('api/UserIdentityRule/SprodOperation', param)
}
// 添加、更新、删除（特殊产品(不享有身份规则优惠)）(多天添加)
export function ManyAddRule(param) {
  return axios.post('api/UserIdentityRule/ManyAddRule', param)
}
// 分页获取特殊分类(不享有身份规则优惠)
export function GetSpecialCategory(param) {
  return axios.post('api/UserIdentityRule/GetSpecialCategory', param)
}
// 添加、更新、删除（特殊分类(不享有身份规则优惠)）(多天添加)
export function ManyCategoryRule(param) {
  return axios.post('api/UserIdentityRule/ManyCategoryRule', param)
}
// 添加、更新、删除（特殊分类(不享有身份规则优惠)）
export function SprodCategoryOperation(param) {
  return axios.post('api/UserIdentityRule/SprodCategoryOperation', param)
}
// 用户身份绑定
export function GetIdentityBind(param) {
  return axios.post('api/UserCRM/GetIdentityBind', param)
}
// V6从V8同步单品信息
export function UpdateProduct(param) {
  return axios.post('api/PurchaseOrder/UpdateProduct', param)
}
// TrueInventoryRecord
// 根据BarCode 查询盘点记录
export function GetTimeTrueInventoryRecordByCode(param) {
  return axios.post('api/TrueInventoryRecord/GetTimeTrueInventoryRecordByCode', param)
}
// 导出
export function NewInventoryExportExcel(param) {
  return axios.postFile('api/TrueInventoryRecord/NewInventoryExportExcel', param, { responseType: 'arraybuffer' })
}

// 领劵中心
// 分页获取领劵中心的卡劵
export function CardPlatformList(param) {
  return axios.post('api/CardPlatform/GetAllListByPage', param)
}
// 分页获取领劵中心的卡劵详情
export function GetCardPlatformDetailById(param) {
  return axios.post('api/CardPlatform/GetDetailById', param)
}
// 分页获取领劵中心的卡劵
export function CardPlatformOperation(param) {
  return axios.post('api/CardPlatform/Operation', param)
}
// 分页获取领劵中心领取记录列表
export function CardPlatformRecordListByPage(param) {
  return axios.post('api/CardPlatform/GetRecordListByPage', param)
}
// 大转盘接口模块
// 查询已创建的大转盘列表
export function GetZhuanPanByPage(param) {
  return axios.post('/api/ZhuanPanRule/GetZhuanPanByPage', param)
}
// 查询大转盘活动的详情
export function ZhuanPanDetail(param) {
  return axios.post('/api/ZhuanPanRule/ZhuanPanDetail', param)
}
// 获取所有卡券
export function GetAllCardByPage(param) {
  return axios.post('/api/ZhuanPanRule/GetAllCardByPage', param)
}
// 新增大转盘活动
export function panOperation(param) {
  return axios.post('/api/ZhuanPanRule/Operation', param)
}
// 赠送卡劵
// 分页获取福利活动列表
export function GetActivityWelfareByPage(param) {
  return axios.post('/api/ActivityWelfare/GetActivityWelfare', param)
}
// 获取福利活动详情
export function GetActivityWelfarDetail(param) {
  return axios.post('/api/ActivityWelfare/ActivityWelfarDetail', param)
}
// 添加、更新、删除(福利活动信息)
export function GetWelfarOperation(param) {
  return axios.post('/api/ActivityWelfare/WelfarOperation', param)
}
// 分页获取福利活动记录列表
export function GetWelfareRecordByPage(param) {
  return axios.post('/api/ActivityWelfare/GetWelfareRecordByPage', param)
}

// 生成卡券活动分享地址
export function getSharePathGenerate(param) {
  return axios.post('/api/ActivityWelfare/SharePathGenerate', param)
}

// 单品分类折扣
export function categroyDiscountOperation(param) {
  return axios.post('/api/ShopPromotion/AlladdProduct', param)
}

// 获取所有卡券信息
export function getAllCards(param) {
  return axios.post('/api/AllCard/GetAllListByPage', param)
}

// 手动赠送卡券
// 条件赠送卡券
export function getGiveCards(param) {
  return axios.post('/api/ManualGiveCards/GetGiveCards', param)
}
// 分页获取手动赠送卡券记录
export function getAllGiveCardsRecords(param) {
  return axios.post('/api/ManualGiveCards/GetAllListByCustomerId', param)
}

// 获取商品列表（分大小包）
export function getProductListByPage(param) {
  return axios.post('api/VShopProduct/GetAllBarCodeListByPage', param)
}

// 修改门店开启状态
export function getIsOpen(param) {
  return axios.post('api/User/GetIsOpen', param)
}

// 门店管理
// 获取所有门店信息
export function getAllStore(param) {
  return axios.post('api/AllStore/GetAllShop', param)
}

// 获取订单数据信息
export function getNewOrderStatistics(param) {
  return axios.post('api/AllStore/OrderStatistics', param)
}

// 获取用户消费统计
export function getUserConsumeStatistics(param) {
  return axios.post('api/AllStore/UserConsumeStatistics', param)
}

// 获取分类占比数据
export function getCategoryStatistics(param) {
  return axios.post('api/AllStore/CategoryRatio', param)
}

// 获取店铺订单数据信息
export function getStoreStatistics(param) {
  return axios.post('api/AllStore/StoreStatistics', param)
}

// 获取订单数据信息(每天展示形式)
export function getDayStoreStatistics(param) {
  return axios.post('api/AllStore/DayStoreStatistics', param)
}

// 获取会员状况
export function getUserStatistics(param) {
  return axios.post('api/AllStore/UserStatistics', param)
}

// 数据统计导出
export function saleCountExportExcel(param) {
  return axios.postFile('api/AllStore/StoreStatisticsExport', param, { responseType: 'arraybuffer' })
}

// 数据统计(每天形式)导出
export function dayStoreStatisticsExportExcel(param) {
  return axios.postFile('api/AllStore/DayStoreStatisticsExport', param, { responseType: 'arraybuffer' })
}

// 订单数据信息导出
export function orderStatisticsExportExcel(param) {
  return axios.postFile('api/AllStore/OrderStatisticsExport', param, { responseType: 'arraybuffer' })
}

// 用户消费统计导出
export function userConsumeStatisticsExportExcel(param) {
  return axios.postFile('api/AllStore/UserConsumeStatisticsExport', param, { responseType: 'arraybuffer' })
}

// 对账数据导出
export function bankStatementExport(param) {
  return axios.postFile('api/AllStore/BankStatementExport', param, { responseType: 'arraybuffer' })
}

// 企业信息
// 分页获取企业信息列表
export function getEnterpriseList(param) {
  return axios.post('api/QiYeGou/GetListByPage', param)
}

// 企业信息增删改查
export function enterpriseOperation(param) {
  return axios.post('api/QiYeGou/Operation', param)
}

// 根据企业的_id查询企业订单
export function getEnterpriseOrderById(param) {
  return axios.post('api/QiYeGou/GetQiYeOrderList', param)
}

// 饮品附加标签参数配置

// 分页获取饮品标签列表
export function GetDrinkLabelByPage(param) {
  return axios.post('api/Drink/GetDrinkLabel', param)
}

// 产品标签添加删除修改
export function DrinkLabelOperation(param) {
  return axios.post('api/Drink/LabelOperation', param)
}

// 产品增删改查标签操作
export function DrinkOperation(param) {
  return axios.post('api/Drink/Operation', param)
}

// 获取产品标签详情
export function getDrinkDetail(param) {
  return axios.post('api/Drink/GetDrinkDetail', param)
}

// 自制餐食产品
// 获取自制产品库
export function getVShopMakeProduct(param) {
  return axios.post('api/VShopMakeProduct/GetVShopMakeProduct', param)
}
// 获取自制产品库详情
export function getVShopMakeProductDetail(param) {
  return axios.post('api/VShopMakeProduct/ActivityDetails', param)
}
// 添加、更新、删除自制产品
export function vShopMakeProductOperation(param) {
  return axios.post('api/VShopMakeProduct/Operation', param)
}
// 获取原料库产品
export function getRawProduct(param) {
  return axios.post('api/VShopMakeProduct/GetRawProduct', param)
}
// 获取原料库产品详情
export function getRawProductDetail(param) {
  return axios.post('api/VShopMakeProduct/RawProductDetails', param)
}
// 添加、更新、删除原料产品
export function rawProductOperation(param) {
  return axios.post('api/VShopMakeProduct/RawOperation', param)
}
// 批量添加原料产品
export function batchAddRawProduct(param) {
  return axios.post('api/VShopMakeProduct/AllRawOperation', param)
}
// 自制产品同步（含原料产品）
export function HomemadeProductAsync(param) {
  return axios.post('api/VShopMakeProduct/AllMakeRawProduct', param)
}
// 获取产品批次列表
export function getHomemadeBatchList(param) {
  return axios.post('api/VShopMakeProduct/GetBatchListByPage', param)
}
// 批次产品设置特殊产品处理
export function homemadeBatchOperation(param) {
  return axios.post('api/VShopMakeProduct/BatchHandle', param)
}
// 批次产品临期报损
export function homemadeBatchScrap(param) {
  return axios.post('api/VShopMakeProduct/BatchScrap', param)
}
// 获取餐食选购套餐列表
export function getMakeSetMealList(param) {
  return axios.post('api/ProductSetMeal/GetMakeSetMeal', param)
}
// 获取餐食选购套餐详情
export function getMakeSetMealDetail(param) {
  return axios.post('api/ProductSetMeal/MakeSetMealDetails', param)
}
// 添加，更新，删除餐食选购套餐
export function makeSetMealOperation(param) {
  return axios.post('api/ProductSetMeal/MakeSetMealOperation', param)
}

// 自制餐食产品订单
// 获取餐食订单列表
export function getMakeOrderList(param) {
  return axios.post('api/VShopMakeOrder/GetListByPage', param)
}
// 获取餐食订单详情
export function getMakeOrderDetail(param) {
  return axios.post('api/VShopMakeOrder/GetOrderDetail', param)
}
// 获取餐食订单所有列表
export function getMakeOrderAllList(param) {
  return axios.post('api/VShopMakeOrder/GetAllListByPage', param)
}
// 根据用户openid查询用户订单
export function getMakeOrderByOpenid(param) {
  return axios.post('api/VShopMakeOrder/GetListByOpenid', param)
}
// 导出订单列表
export function makeOrderExport(param) {
  return axios.postFile('api/VShopMakeOrder/ExportByCondition', param, { responseType: 'arraybuffer' })
}
// 打印订单
export function makeOrderPrint(param) {
  return axios.post('api/VShopMakeOrder/PrintOrder', param)
}
// 添加，更新，删除订单
export function makeOrderOperation(param) {
  return axios.post('api/VShopMakeOrder/Operation', param)
}
//
// 更新快递信息和收件人信息
export function updateMakeOrderReciver(param) {
  return axios.post('api/VShopMakeOrder/UpdateKDReciver', param)
}
// 更新订单状态
export function updateMakeOrderStatus(param) {
  return axios.post('api/VShopMakeOrder/UpdateOrderStatus', param)
}

// 餐食分工区域
// 获取餐食分工区域列表
export function getMakeZoneList(param) {
  return axios.post('api/Zone/GetMakeZone', param)
}
// 添加，更新，删除餐食分工区域列表
export function makeZoneOperation(param) {
  return axios.post('api/Zone/MakeOperation', param)
}

// 自制饮品产品
// 获取自制饮品产品列表
export function getDrinkProduct(param) {
  return axios.post('api/VShopDrinkProduct/GetVShopDrinkProduct', param)
}
// 获取自制饮品产品详情
export function getDrinkProductDetail(param) {
  return axios.post('api/VShopDrinkProduct/ActivityDetails', param)
}
// 添加，更新，删除自制饮品列表
export function drinkProductOperation(param) {
  return axios.post('api/VShopDrinkProduct/Operation', param)
}
// 获取原料库产品
export function getDrinkRawProduct(param) {
  return axios.post('api/VShopDrinkProduct/GetRawProduct', param)
}
// 获取原料产品库详情
export function getDrinkRawProductDetail(param) {
  return axios.post('api/VShopDrinkProduct/RawProductDetails', param)
}
// 添加，更新，删除原料产品
export function drinkRawProductOperation(param) {
  return axios.post('api/VShopDrinkProduct/RawOperation', param)
}
// 批量添加原料产品
export function drinkRawProductBatchAdd(param) {
  return axios.post('api/VShopDrinkProduct/AllRawOperation', param)
}
// 自制饮品产品同步
export function drinkRawProductAsync(param) {
  return axios.post('api/VShopDrinkProduct/AllMakeRawProduct', param)
}
// 获取原料产品批次
export function getDrinkRawProductBatch(param) {
  return axios.post('api/VShopDrinkProduct/GetBatchListByPage', param)
}
// 批次产品特殊处理
export function drinkRawProductBatchOperation(param) {
  return axios.post('api/VShopDrinkProduct/BatchHandle', param)
}
// 临期报损处理
export function drinkRawProductBatchScrap(param) {
  return axios.post('api/VShopDrinkProduct/BatchScrap', param)
}
// 原料产品v8同步操作
export function rawProductV8Sync(param) {
  return axios.post('api/VShopDrinkProduct/ProductUpdateSync', param)
}

// 自制饮品订单
// 获取饮品订单列表
export function getDrinkOrderList(param) {
  return axios.post('api/VShopDrinkOrder/GetListByPage', param)
}
// 获取饮品订单详情
export function getDrinkOrderDetail(param) {
  return axios.post('api/VShopDrinkOrder/GetOrderDetail', param)
}
// 获取饮品所有订单列表
export function getDrinkOrderAllList(param) {
  return axios.post('api/VShopDrinkOrder/GetAllListByPage', param)
}
// 根据用户openid查询用户订单
export function getDrinkOrderByOpenid(param) {
  return axios.post('api/VShopDrinkOrder/GetListByOpenid', param)
}
// 导出饮品订单
export function drinkOrderExport(param) {
  return axios.postFile('api/VShopDrinkOrder/ExportByCondition', param, { responseType: 'arraybuffer' })
}
// 订单打印
export function drinkOrderPrint(param) {
  return axios.post('api/VShopDrinkOrder/PrintOrder', param)
}
// 添加，更新，删除订单
export function drinkOrderOperation(param) {
  return axios.post('api/VShopDrinkOrder/Operation', param)
}
// 更新快递信息和收件人信息
export function updateDrinkOrderReciver(param) {
  return axios.post('api/VShopDrinkOrder/UpdateKDReciver', param)
}
// 更新订单状态
export function updateDrinkOrderStatus(param) {
  return axios.post('api/VShopDrinkOrder/UpdateOrderStatus', param)
}

// 饮品分工区域
// 获取饮品分工区域列表
export function getDrinkZoneList(param) {
  return axios.post('api/Zone/GetDrinkZone', param)
}
// 添加，更新，删除饮品分工区域列表
export function DrinkZoneOperation(param) {
  return axios.post('api/Zone/DrinkOperation', param)
}

// 散称产品
// 获取散称产品列表
export function getWeighProduct(param) {
  return axios.post('api/VShopWeighProduct/GetVShopWeighProduct', param)
}

// 获取散称产品库详情
export function getWeighProductDetail(param) {
  return axios.post('api/VShopWeighProduct/ActivityDetails', param)
}

// 添加，更新，删除散称产品库
export function weighProductOperation(param) {
  return axios.post('api/VShopWeighProduct/Operation', param)
}

// 批量同步添加散称产品
export function batchAddWeighProduct(param) {
  return axios.post('api/VShopWeighProduct/BatchOperation', param)
}

// 获取产品批次列表
export function getWeighBatchList(param) {
  return axios.post('api/VShopWeighProduct/GetBatchListByPage', param)
}
// 批次产品设置特殊产品处理
export function weighBatchOperation(param) {
  return axios.post('api/VShopWeighProduct/BatchHandle', param)
}
// 批次产品临期报损
export function weighBatchScrap(param) {
  return axios.post('api/VShopWeighProduct/BatchScrap', param)
}

// 生成内部调拨单
export function insideAllotOrder(param) {
  return axios.post('api/AlllotOrder/MutualInsideAllot', param)
}

// 获取内部调拨单列表
export function getInsideAllotOrderList(param) {
  return axios.post('api/AlllotOrder/GetInsideAllotListByPage', param)
}

// 根据用户的cid查询参数配置信息
export function getShopConfigByCid(param) {
  return axios.post('api/ShopPayConfig/GetByCid', param)
}
// 门店支付信息的增加、删除、修改功能
export function shopConfigOperation(param) {
  return axios.post('api/ShopPayConfig/Operation', param)
}
// 查询所有支付方式
export function getShopPayMethodList(param) {
  return axios.post('api/ShopPayConfig/GetAllPayMethod', param)
}

// 午餐接口（测试）
export function foodPayOperation(param) {
  return axios.post('api/Mobile/GetFoodWXappPayTest', param)
}
// 获取摄像头列表
export function getCameraList(param) {
  return axios.post('api/FaceAI/GetHardwareCamera', param)
}
// 摄像头添加,更新，删除
export function shopCameraOperation(param) {
  return axios.post('api/FaceAI/ShopCameraOperation', param)
}
// 获取已配置好门店的摄像头列表
export function getShopCameraList(param) {
  return axios.post('api/FaceAI/GetShopCamera', param)
}
// 获取应用参数列表
export function getPrintClient(param) {
  return axios.post('api/OrderPrint/GetPintClient', param)
}

// 滴灌通数据查询
// 获取商品订单
export function getProductOrders(param) {
  return axios.post('api/DiGuanTongApi/GetVshopOrd', param)
}
// 获取餐食订单（收银台）
export function getFoodOrders(param) {
  return axios.post('api/Cashier/GetFoodOrders', param)
}
// 获取vip购买订单（收银台)
export function getVipOrders(param) {
  return axios.post('api/Cashier/GetOrderListByPage', param)
}
// 餐食订单打印
export function makeProductOrderPrint(param) {
  return axios.post('/api/Cashier/MakeOrderPrint', param)
}
// 饮品订单打印
export function drinkProductOrderPrint(param) {
  return axios.post('/api/Cashier/DrinkOrderPrint', param)
}
// 飞鹅打印机
// 获取飞鹅打印机列表
export function getFeiePrinterList(param) {
  return axios.post('/api/OrderPrint/GetFeieListByPage', param)
}
// 获取飞鹅打印机详情
export function getFeiePrinterDetail(param) {
  return axios.post('/api/OrderPrint/GetFeieDetailById', param)
}
// 添加 修改 删除飞鹅打印机
export function feiePrinterOperation(param) {
  return axios.post('/api/OrderPrint/FeieOperation', param)
}
// 设置飞鹅打印机logo
export function setFeiePrinterLogo(param) {
  return axios.post('/api/OrderPrint/SetUpLogo', param)
}
// 飞鹅打印机打印操作
export function getFeieOrderPrint(param) {
  return axios.post('/api/VShopOrder/GetFeieOrderPrint', param)
}

// 餐食统计
// 获取餐食统计数据
export function getMealsProductStatistics(param) {
  return axios.post('/api/AllStore/MakeFoodOrderStatistics', param)
}
// 自制餐食统计导出
export function mealsOrderExport(param) {
  return axios.postFile('/api/AllStore/MakeFoodOrderStatisticsExport', param, { responseType: 'arraybuffer' })
}

// 饮品统计
// 获取饮品统计数据
export function getDrinkProductStatistics(param) {
  return axios.post('/api/AllStore/MakeDrinkOrderStatistics', param)
}
// 自制饮品统计导出
export function drinksOrderExport(param) {
  return axios.postFile('/api/AllStore/MakeDrinkOrderStatisticsExport', param, { responseType: 'arraybuffer' })
}

// 订单总打印
export function allOrderPrint(param) {
  return axios.post('/api/Cashier/AllOrderPrint', param)
}
// 获取可用打印机
export function getAvailablePrint(param) {
  return axios.post('/api/Cashier/GetAllPrintDto', param)
}

// 职工
// 获取所有职工列表
export function getWorkerList(param) {
  return axios.post('/api/Worker/GetAllListByPage', param)
}
// 获取职工详情
export function getWorkerDetail(param) {
  return axios.post('/api/Worker/GetDetailById', param)
}
// 添加，修改，删除职工信息
export function workerOperation(param) {
  return axios.post('/api/Worker/Operation', param)
}

// 任务模板
// 获取任务模板列表
export function getTaskTemplateList(param) {
  return axios.post('/api/TaskTemplate/GetAllListByPage', param)
}
// 获取任务模板详情
export function getTaskTemplateDetail(param) {
  return axios.post('/api/TaskTemplate/GetDetailById', param)
}
// 添加，修改，删除任务模板
export function taskTemplateOperation(param) {
  return axios.post('/api/TaskTemplate/Operation', param)
}

// 用户任务
// 获取任务列表
export function getTaskList(param) {
  return axios.post('/api/UserTask/GetAllListByPage', param)
}
// 获取任务详情
export function getTaskDetail(param) {
  return axios.post('/api/UserTask/GetDetailById', param)
}
// 添加，修改，删除任务
export function taskOperation(param) {
  return axios.post('/api/UserTask/Operation', param)
}
// 更新任务状态
export function updateTaskState(param) {
  return axios.post('/api/UserTask/UpdateTaskSubmit', param)
}
// 获取任务评论列表
export function getTaskDiscussList(param) {
  return axios.post('/api/UserTask/GetAllDiscussListByPage', param)
}
// 获取任务评论详情
export function getTaskDiscussDetail(param) {
  return axios.post('/api/UserTask/GetDiscussDetailById', param)
}
// 添加，更新，删除评论
export function taskDiscussOperation(param) {
  return axios.post('/api/UserTask/DiscussOperation', param)
}

// 卡券分享领取活动
// 获取卡券分享活动列表
export function getShareCardActivity(param) {
  return axios.post('/api/ShareCard/GetAllListByPage', param)
}
// 获取卡券分享活动详情
export function getShareCardActivityDetail(param) {
  return axios.post('/api/ShareCard/GetDetailById', param)
}
// 添加，更新，删除卡券分享活动
export function shareCardActivityOpertaion(param) {
  return axios.post('/api/ShareCard/Operation', param)
}
// 获取用户领取卡券列表
export function getShareCardUserList(param) {
  return axios.post('/api/ShareCard/GetAllUserListByPage', param)
}
// 获取用户领取卡券详情
export function getShareCardUserDetail(param) {
  return axios.post('/api/ShareCard/GetUserDetailById', param)
}
// 合伙人
// 获取合伙人列表
export function getPartnerList(param) {
  return axios.post('/api/Partner/GetAllListByPage', param)
}
// 获取合伙人详情
export function getPartnerDetail(param) {
  return axios.post('/api/Partner/GetDetailById', param)
}
// 添加，更新，删除合伙人
export function partnerOperation(param) {
  return axios.post('/api/Partner/Operation', param)
}
// 修改合伙人账号密码
export function partnerPwdUpdate(param) {
  return axios.post('/api/Partner/UpdatePassword', param)
}

// 云点卡
// 获取云点卡列表
export function getValueCardList(param) {
  return axios.post('/api/EntityCard/GetAllListByPage', param)
}
// 获取云点卡充值/消费记录
export function getValueCardRechargeOrConsumeRecord(param) {
  return axios.post('/api/EntityCard/GetEntityCardRecordByPage', param)
}
// 云点卡添加，更新，删除操作
export function valueCardOperation(param) {
  return axios.post('/api/EntityCard/Operation', param)
}
// 云点卡导出
export function valueCardExport(param) {
  return axios.postFile('/api/EntityCard/GetEntityCardExport', param, { responseType: 'arraybuffer' })
}
// 查询云点卡总余额
export function getValueCardTotalAmount(param) {
  return axios.post('/api/EntityCard/GetTotalAmount', param)
}
// 提交办云点卡操作
export function valueCardAddOperation(param) {
  return axios.post('/api/EntityCard/EntityCardSubmit', param)
}
// 云点卡充值操作
export function valueCardRechargeOperation(param) {
  return axios.post('/api/EntityCard/RechargeSubmit', param)
}
// 云点卡挂失操作
export function valueCardLogOffOperation(param) {
  return axios.post('/api/EntityCard/RechargeLoseSubmit', param)
}
// 云点卡充值/消费记录导出
export function valueCardRechargeOrConsumeRecordExport(param) {
  return axios.postFile('/api/EntityCard/GetEntityCardRecordExport', param, { responseType: 'arraybuffer' })
}
// 批量导入云点卡充值
export function valueCardRechargeExcel(param) {
  return axios.post('/api/EntityCard/RechargeExcel', param)
}
// 获取云点卡开卡门店配置
export function getValueCardSetUp(param) {
  return axios.post('/api/EntityCard/GetCardSetUp', param)
}
// 添加，更新，删除云点卡开卡门店限制
export function valueCardSetOperation(param) {
  return axios.post('/api/EntityCard/CardSetUpOperation', param)
}
// 获取云点卡卡面类型列表
export function getValueCardFaceType(param) {
  return axios.post('/api/EntityCard/GetFaceTypeListByPage', param)
}
// 添加，更新，删除云点卡卡面类型
export function valueCardFaceTypeOperation(param) {
  return axios.post('/api/EntityCard/CardFaceOperation', param)
}

// 会员等级
// 获取会员等级规则表
export function getUserIntegralLevel(param) {
  return axios.post('/api/UserLevel/GetLevelByPage', param)
}
// 获取会员等级规则详情
export function getUserIntegralLevelDetail(param) {
  return axios.post('/api/UserLevel/GetUserLevelDetail', param)
}
// 添加，更新，删除会员等级规则
export function userIntegralLevelOperation(param) {
  return axios.post('/api/UserLevel/Operation', param)
}

// 获取积分累计活动信息
export function getDefineIntegralLevel(param) {
  return axios.post('/api/DefineIntegral/GetDefineIntegralList', param)
}
// 获取积分累计活动详情
export function getDefineIntegralLevelDetail(param) {
  return axios.post('/api/DefineIntegral/GetUserLevelDetail', param)
}
// 添加，更新，删除积分累计活动
export function defineIntegralLevelOperation(param) {
  return axios.post('/api/DefineIntegral/Operation', param)
}

// 积分等级累计分类排除
export function getIntegralCategoryExclude(param) {
  return axios.post('/api/ExcludeRule/GetExcludeRuleList', param)
}
export function getIntegralCategoryExcludeDetail(param) {
  return axios.post('/api/ExcludeRule/GetExcludeRuleDetail', param)
}
export function integralCategoryExcludeOperation(param) {
  return axios.post('/api/ExcludeRule/Operation', param)
}

// 售卖机
// 批量生成自编码售卖机
export function bulkInsertVUnionCode(param) {
  return axios.post('/api/JYJustTakeNotifyApi/BulkInsertVUnionCode', param)
}
// 后台售卖机补货入库
export function bindProdStockUpdate(param) {
  return axios.post('/api/JYJustTakeNotifyApi/ProductStockUpdate', param)
}
// 获取未绑定售卖机列表
export function getShopNotBindVendingMachine(param) {
  return axios.post('/api/JYJustTakeNotifyApi/GetNotBindVendingMachine', param)
}
// 获取门店绑定售卖机列表
export function getShopBindVendingMachine(param) {
  return axios.post('/api/JYJustTakeNotifyApi/GetShopBindVendingMachine', param)
}
// 门店绑定售卖机操作
export function shopBindVendingMachineOperation(param) {
  return axios.post('/api/JYJustTakeNotifyApi/ShopBindVendingMachine', param)
}
// 更新设备温度和压缩机开关
export function updateVendingMachine(param) {
  return axios.post('/api/JYJustTakeNotifyApi/UpdateVendingMachine', param)
}
// 获取售卖机详情
export function getVendingMachineDetail(param) {
  return axios.post('/api/JYJustTakeNotifyApi/QueryMachineDetail', param)
}
// 获取售卖机硬件信息
export function getVendingMachineDeviceDetail(param) {
  return axios.post('/api/JYJustTakeNotifyApi/QueryDeviceDetail', param)
}
// 售卖机绑定产品操作
export function vendingMachineBindProd(param) {
  return axios.post('/api/JYJustTakeNotifyApi/VendingMachineBindProd', param)
}
// 获取售卖机绑定产品
export function getVendingMachineBindProd(param) {
  return axios.post('/api/JYJustTakeNotifyApi/GetVendingMachineProds', param)
}
// 获取售卖机绑定产品
export function getVendingMachineBindProdOnSale(param) {
  return axios.post('/api/JYJustTakeNotifyApi/QueryVendingMachineProds', param)
}
// 同步产品到售卖机操作
export function updateVendingMachineProd(param) {
  return axios.post('/api/JYJustTakeNotifyApi/UpdateVendingProd', param)
}
// 更新基础库产品信息
export function baseProdUpdateOperation() {
  return axios.get('/api/JYJustTakeNotifyApi/InitUpdateBaseProd')
}
// 获取第三方产品库
export function getJTBaseProduct(param) {
  return axios.post('/api/JYJustTakeNotifyApi/GetJTBaseProd', param)
}
// 获取售卖机产品详情
export function getVendingMachineBindProdDetail(param) {
  return axios.post('/api/JYJustTakeNotifyApi/GetProductDetailById', param)
}
// 导出售卖机产品
export function GetVendingMachineProdsExport(param) {
  return axios.postFile('/api/JYJustTakeNotifyApi/GetVendingMachineProdsExport', param, { responseType: 'arraybuffer' })
}
// 获取第三方平台售卖机列表
export function getAllVendingMachine(param) {
  return axios.post('/api/JYJustTakeNotifyApi/ThirdPartyTestMachineList', param)
}
// 获取售卖机订单列表（新）
export function getVendingMachineAllOrder(param) {
  return axios.post('/api/JYJustTakeNotifyApi/GetAllProductOrderByPage', param)
}
// 获取售卖机订单列表
export function getVendingMachineOrder(param) {
  return axios.post('/api/JYJustTakeNotifyApi/GetProductOrderByPage', param)
}
// 获取售卖机订单列表导出
export function vendingMachineOrderExport(param) {
  return axios.postFile('/api/JYJustTakeNotifyApi/GetProductOrderByPageExport', param, { responseType: 'arraybuffer' })
}
// 获取售卖机订单详情
export function getVendingMachineOrderDetail(param) {
  return axios.post('/api/JYJustTakeNotifyApi/GetOrderDetail', param)
}
// 获取售卖机订单视频详情
export function getVendingMachineOrderVideo(param) {
  return axios.post(`/api/JYJustTakeNotifyApi/TestGetVideo?type=1&requestId=${param}`)
}
// 获取售卖机异常订单列表
export function getVendingMachineAbnormalOrder(param) {
  return axios.post('/api/JYJustTakeNotifyApi/GetAbnormalOrderByPage', param)
}
// 获取售卖机异常订单详情
export function getVendingMachineAbnormalOrderDetail(param) {
  return axios.post('/api/JYJustTakeNotifyApi/GetAbnormalOrderDetail', param)
}
// 生成售卖机小程序码
export function getVendingMachineQrCode(param) {
  return axios.post('/api/JYJustTakeNotifyApi/GetQrCode', param)
}
// 售卖机产品上下架和产品删除
export function vendingMachineProductUpdate(param) {
  return axios.post('/api/JYJustTakeNotifyApi/ProductUpdate', param)
}
// 异常订单处理
export function abnormalOrderHandleOperation(param) {
  return axios.post('/api/JYJustTakeNotifyApi/OrderHandleSubmit', param)
}
// 售卖机产品修改排序号
export function updateVendingMachineProdsSortNo(param) {
  return axios.post('/api/JYJustTakeNotifyApi/UpdateVendingMachineProdsSortNo', param)
}
// 售卖机补货记录
export function getVendingProdRecord(param) {
  return axios.post('/api/MachineApi/GetProductRecordByPage', param)
}
// 根据产品获取补货记录
export function getVendingRecordByProduct(param) {
  return axios.post('/api/MachineApi/GetProdRecordByPage', param)
}
// 根据产品获取销售记录
export function getVendingSalesByProduct(param) {
  return axios.post('/api/MachineApi/GetProductOrderByPage', param)
}
// 售卖机销量利润数据查询
export function queryVendingSalesData(param) {
  return axios.post('/api/DataAnalysis/GetVendingMachineSalesData', param)
}
// 获取每个售卖柜产品总库存和总货值
export function getVendingMachineProdsData(param) {
  return axios.post('/api/JYJustTakeNotifyApi/GetVendingMachineProdsData', param)
}
// 获取售卖机产品列表(创建售卖机采购单选择产品列表的接口)
export function GetMachineProdByPage(param) {
  return axios.post('/api/JYJustTakeNotifyApi/GetMachineProdByPage', param)
}
// 获取采购单列表
export function GetVmPurchaseOrderByPage(param) {
  return axios.post('/api/JYJustTakeNotifyApi/GetVmPurchaseOrderByPage', param)
}
// 获取采购单详情
export function GetVmPurchaseOrderDetail(param) {
  return axios.post('/api/JYJustTakeNotifyApi/GetVmPurchaseOrderDetail', param)
}
// 创建采购单
export function CreateVmPurchaseOrder(param) {
  return axios.post('/api/JYJustTakeNotifyApi/VmPurchaseOrderAdd', param)
}
// 修改采购单
export function UpdateVmPurchaseOrder(param) {
  return axios.post('/api/JYJustTakeNotifyApi/VmPurchaseOrderUpdate', param)
}
// 微信支付分
// 获取微信支付分订单
export function getPayScoreOrder(param) {
  return axios.post('/api/PayScoreOrder/GetListByPage', param)
}
// 获取微信支付分订单详情
export function getPayScoreOrderDetail(param) {
  return axios.post('/api/PayScoreOrder/GetDetailById', param)
}
// 取消微信支付分订单
export function cancelPayScoreOrder(param) {
  return axios.post('/api/JYPaySore/CancelPayScoreOrder', param)
}
// 修改微信支付分订单
export function updatePayScoreOrder(param) {
  return axios.post('/api/JYPaySore/UpdatePayScoreOrder', param)
}
// 完结微信支付分订单
export function completePayScoreOrder(param) {
  return axios.post('/api/JYPaySore/CompletePayScoreOrder', param)
}
// 同步微信支付分订单
export function syncPayScoreOrder(param) {
  return axios.post('/api/JYPaySore/SyncPayScoreOrder', param)
}
// 微信支付分退款
export function refundPayScoreOrder(param) {
  return axios.post('/api/JYPaySore/RefundsPayScoreOrder', param)
}
// 退款订单查询
export function getRefundPayScoreOrder(param) {
  return axios.post('/api/JYPaySore/QueryTenPayV3Refund', param)
}
// 售卖机广告
// 获取电视广告素材列表
export function getAdvertTvMaterialList(param) {
  return axios.post('/api/JYJustTakeNotifyApi/SourceMaterialsPage', param)
}
// 电视广告素材申请
export function applyAdvertTvMaterial(param) {
  return axios.post('/api/JYJustTakeNotifyApi/SourceMaterialsApply', param)
}
// 电视广告素材删除
export function deleteAdvertTvMaterial(param) {
  return axios.post('/api/JYJustTakeNotifyApi/SourceMaterialsDelete', param)
}
// 获取售卖机广告列表
export function getVendingMachineAdvert(param) {
  return axios.post('/api/JYJustTakeNotifyApi/GetAdList', param)
}
// 获取售卖机广告详情
export function getVendingMachineAdvertDetail(param) {
  return axios.post('/api/JYJustTakeNotifyApi/GetAdDetail', param)
}
// 添加广告
export function addVendingMachineAdvert(param) {
  return axios.post('/api/JYJustTakeNotifyApi/AddAd', param)
}
// 更新广告
export function updateVendingMachineAdvert(param) {
  return axios.post('/api/JYJustTakeNotifyApi/UpdateAd', param)
}
// 删除广告
export function deleteVendingMachineAdvert(param) {
  return axios.post('/api/JYJustTakeNotifyApi/AdDelete', param)
}
// 广告关联设备
export function bindVendingMachineAdvertDev(param) {
  return axios.post('/api/JYJustTakeNotifyApi/AdBindDev', param)
}
// 广告推送设备
export function pushVendingMachineAdvertDev(param) {
  return axios.post('/api/JYJustTakeNotifyApi/AdPushDev', param)
}
// 售卖机申请新品
export function applyVendingMachineNewProd(param) {
  return axios.post('/api/JYJustTakeNotifyApi/ApplyNewProd', param)
}
// 获取售卖机新品申请列表
export function getNewProductApplyList(param) {
  return axios.post('/api/JYJustTakeNotifyApi/ApplyNewProdList', param)
}
// 获取售卖机新品申请详情
export function getNewProdApplyDetail(param) {
  return axios.post('/api/JYJustTakeNotifyApi/ApplyNewProdDetail', param)
}
// 获取售卖机产品模板库
export function getVendingMachineProductTemplate(param) {
  return axios.post('/api/JYJustTakeNotifyApi/GetProdTemplateByPage', param)
}
// 售卖机模板产品添加
export function vendingMachineProductTemplateAdd(param) {
  return axios.post('/api/JYJustTakeNotifyApi/TemplateAdd', param)
}
// 售卖机模版产品删除
export function vendingMachineProductTemplateDelete(param) {
  return axios.post('/api/JYJustTakeNotifyApi/ProdTemplateDelete', param)
}
// 同步模板库到售卖机
export function productAyncDeviceOperation(param) {
  return axios.post('/api/JYJustTakeNotifyApi/DeviceProdAdd', param)
}
// 查询第三方基础库产品
export function getThirdBaseProductList(param) {
  return axios.post('/api/JYJustTakeNotifyApi/QueryJTBaseProd', param)
}

// 获取办卡金额设置列表
export function getValueCardRechargeLimitList(param) {
  return axios.post('/api/Entitylimit/GetAllListByPage', param)
}
// 添加，更新，删除办卡金额
export function valueCardRechargeLimitOperation(param) {
  return axios.post('/api/Entitylimit/Operation', param)
}

// 支付宝支付分
// 获取支付宝支付分订单
export function getAlipayScoreOrderList(param) {
  return axios.post('/api/PayScoreOrder/GetAlipayListByPage', param)
}
// 获取支付宝支付分订单详细
export function getAlipayScoreOrderDetail(param) {
  return axios.post('/api/PayScoreOrder/GetalipayDetailById', param)
}
// 根据支付分签约号查询签约结果
export function queryAlipayScoreOrder(param) {
  return axios.post('/api/JYAlipayScore/QueryPayScoreOrder', param)
}
// 根据支付分签约号解约支付分协议
export function unsignAlipayScoreOrder(param) {
  return axios.post('/api/JYAlipayScore/UnsignPayScoreOrder', param)
}
// 支付宝支付分申请支付完结订单
export function completeAlipayScoreOrder(param) {
  return axios.post('/api/JYAlipayScore/PayScoreOrder', param)
}
// 查询支付宝支付分支付结果
export function queryAlipayScorePayResult(param) {
  return axios.post('/api/JYAlipayScore/QueryScoreOrder', param)
}
// 支付宝支付分申请退款
export function refundAlipayScoreOrder(param) {
  return axios.post('/api/JYAlipayScore/RefundScoreOrder', param)
}
// 支付宝生成小程序二维码
export function getAlipayScoreQrCode(param) {
  return axios.post('/api/JYAlipayScore/CreateQrCode', param)
}
// 自助售卖机产品销售统计
export function getVendingMachineProductStatistics(param) {
  return axios.post('/api/AllStore/MachineStatistics', param)
}
// 自助售卖机所有产品无销售统计
export function getVendingMachineNotHaveProductStatistics(param) {
  return axios.post('/api/AllStore/NotHaveMachineStatistics', param)
}
// 自助售卖机产品销售统计导出
export function vendingMachineProductStatisticsExport(param) {
  return axios.postFile('/api/AllStore/MachineStatisticsExport', param, { responseType: 'arraybuffer' })
}

// 浮动盈亏
// 添加，更新，删除浮动盈亏操作
export function profitAndLossOperation(param) {
  return axios.post('/api/ProfitAndLoss/Operation', param)
}
// 获取浮动盈亏列表
export function getProfitAndLossList(param) {
  return axios.post('/api/ProfitAndLoss/GetListByPage', param)
}
// 获取浮动盈亏详情
export function getProfitAndLossDetail(param) {
  return axios.post('/api/ProfitAndLoss/GetDetailById', param)
}
// 浮动盈亏按月查询
export function queryProfitAndLoss(param) {
  return axios.post('/api/AllStore/QueryProfitAndLoss', param)
}

// 企微营销
// 上传临时素材
export function qiweiImageUpload(param) {
  return axios.post('/api/QiYeWeixin/UploadImg', param)
}
// 添加，更新，删除企微欢迎语
export function groupWelcomeMsgOperation(param) {
  return axios.post('/api/QiYeWeixin/SumbitGroupWelcomeTemplate', param)
}
// 获取企微欢迎语
export function getGroupWelcomeMsg(param) {
  return axios.post('/api/QiYeWeixin/GetListByPage', param)
}

// 站内信消息
// 获取站内信信息列表
export function getNoticeMailList(param) {
  return axios.post('/api/Mail/GetNoticeMailList', param)
}
// 获取站内信信息详情
export function getNoticeMailDetail(param) {
  return axios.post('/api/Mail/GetMailDetailById', param)
}
// 站内信信息已读提交
export function noticeMailReadSubmit(param) {
  return axios.post('/api/Mail/TrawlSubmit', param)
}

// 电视广告
// 获取电视广告列表
export function getAdvertTvList(param) {
  return axios.post('/api/AdvertTV/GetListByPage', param)
}
// 获取电视广告内容详情
export function getAdvertTvDetail(param) {
  return axios.post('/api/AdvertTV/GetDetailById', param)
}
// 添加更新删除电视广告内容
export function advertTvOperation(param) {
  return axios.post('/api/AdvertTV/Operation', param)
}

// 耗材产品
// 获取耗材产品列表
export function getMaterialProductList(param) {
  return axios.post('/api/MaterialProduct/GetMaterialProductListByPage', param)
}
// 获取耗材产品详情
export function getMaterialProductDetail(param) {
  return axios.post('/api/MaterialProduct/MaterialProductDetails', param)
}
// 添加更新删除耗材产品
export function materialProductOperation(param) {
  return axios.post('/api/MaterialProduct/Operation', param)
}
// 获取耗材领用产品记录列表
export function getMaterialProductUseRecord(param) {
  return axios.post('/api/MaterialProduct/GetMaterialUseListByPage', param)
}
// 获取耗材领用产品记录详情
export function getMaterialProductUseRecordDetail(param) {
  return axios.post('/api/MaterialProduct/MaterialUseDetails', param)
}
// 获取耗材领用产品记录列表
export function materialProductUseRecordOperation(param) {
  return axios.post('/api/MaterialProduct/UseOperation', param)
}

// 产品快照
// 获取产品快照列表
export function getProductSnapshotList(param) {
  return axios.post('/api/VShopProductSnapshot/GetAllListByPage', param)
}
// 获取产品快照详情
export function getProductSnapshotDetail(param) {
  return axios.post('/api/VShopProductSnapshot/GetDetailById', param)
}
// 生成产品库存快照
export function productSnapshotOperation(param) {
  return axios.post('/api/VShopProductSnapshot/SaveProdSnapshot', param)
}

// 资产管理
// 获取资产清单列表
export function getPropertyInfoList(param) {
  return axios.post('/api/Property/GetPropertyInfoListByPage', param)
}
// 获取资产清单详情
export function getPropertyInfoDetail(param) {
  return axios.post('/api/Property/PropertyInfoDetails', param)
}
// 添加更新删除资产信息
export function propertyInfoOperation(param) {
  return axios.post('/api/Property/Operation', param)
}
// 获取资产调拨记录列表
export function getPropertyTransferRecordList(param) {
  return axios.post('/api/Property/GetAllocateLogListByPage', param)
}
// 获取资产调拨记录详情
export function getPropertyTransferRecordDetail(param) {
  return axios.post('/api/Property/AllocateLogDetails', param)
}
// 添加更新删除资产调拨记录
export function propertyTransferRecordOperation(param) {
  return axios.post('/api/Property/AllocateLogOperation', param)
}
// 获取资产报修记录列表
export function getPropertyRepairRecordList(param) {
  return axios.post('/api/Property/GetRepairLogListByPage', param)
}
// 获取资产报修记录详情
export function getPropertyRepairRecordDetail(param) {
  return axios.post('/api/Property/RepairLogDetails', param)
}
// 添加更新删除资产报修记录
export function propertyRepairRecordOperation(param) {
  return axios.post('/api/Property/RepairLogOperation', param)
}

// 拼团人员管理
// 获取拼团管理员信息列表
export function getGrouponAdminList(param) {
  return axios.post('/api/VShopSetUp/GetAdministratorList', param)
}
// 绑定设置拼团管理员
export function setGrouponAdmin(param) {
  return axios.post('/api/VShopSetUp/SetUpAdministrator', param)
}
// 更新拼团管理员信息
export function updateGrouponAdminInfo(param) {
  return axios.post('/api/VShopSetUp/SetUpAdministratorUpdate', param)
}

// 查询月报列表
export function getMonthReportList(param) {
  return axios.post('/api/ParterApi/GetMonthReportList', param)
}

// 查询月报详情
export function getMonthReportDetail(param) {
  return axios.post('/api/ParterApi/GetReportDetail', param)
}

// 更新月报差异金额列表
export function updateMonthReportDiff(param) {
  return axios.post('/api/ParterApi/UpdateDiff', param)
}

// 推送月报
export function pushMonthReport(param) {
  return axios.post('/api/ParterApi/UpdatePushStatus', param)
}

// 预付卡
// 开预付卡
export function openPrepayCardOperation(param) {
  return axios.post('/api/JYECNYAPI/OpenCard', param)
}
// 查询预付卡列表
export function getPrepayCardList(param) {
  return axios.post('/api/JYECNYAPI/GetCardList', param)
}
// 查询预付卡信息
export function getPrepayCardDetail(param) {
  return axios.post('/api/JYECNYAPI/QueryCard', param)
}
// 预付卡核销
export function settlePrepayCard(param) {
  return axios.post('/api/JYECNYAPI/Settle', param)
}
// 获取预付卡核销详情
export function getPrepayCardSettleDetail(param) {
  return axios.post('/api/JYECNYAPI/QuerySettle', param)
}
// 获取预付卡核销列表
export function getPrepayCardSettleList(param) {
  return axios.post('/api/JYECNYAPI/GetSettleList', param)
}

// 拉卡拉支付
// 根据cid查询拉卡拉公号信息
export function getLakalaConfigByCid(param) {
  return axios.post('/api/LaKaLaPayConfig/GetByCid', param)
}
// 添加，更新，删除拉卡拉支付信息
export function lakalaConfigOperation(param) {
  return axios.post('/api/LaKaLaPayConfig/Operation', param)
}
// 拉卡拉分账
// 拉卡拉附件上传
export function lakalaUploadFile(param) {
  return axios.post('/api/LaKaLaLedger/UploadFile', param)
}
// 获取商户分账业务申请列表
export function getApplyLedgerMerList(param) {
  return axios.post('/api/LaKaLaLedger/GetApplyLedgerMerList', param)
}
// 商户分账业务申请新增
export function ledgerMerApplyAddOperation(param) {
  return axios.post('/api/LaKaLaLedger/ApplyLedgerMer', param)
}
// 商户分账业务申请变更
export function ledgerMerApplyUpdateOperation(param) {
  return axios.post('/api/LaKaLaLedger/ModifyLedgerMer', param)
}
// 商户分账业务申请最新信息查询
export function queryLedgerMerApplyinfo(param) {
  return axios.post('/api/LaKaLaLedger/QueryLedgerMer', param)
}
// 分账接收方申请列表
export function getApplyLedgerReceiverList(param) {
  return axios.post('/api/LaKaLaLedger/GetLedgerReceiverList', param)
}
// 分账接收方申请新增
export function ledgerReceiverApplyAddOperation(param) {
  return axios.post('/api/LaKaLaLedger/ApplyLedgerReceiver', param)
}
// 分账接收方申请变更
export function ledgerReceiverApplyUpdateOperation(param) {
  return axios.post('/api/LaKaLaLedger/ModifyLedgerReceiver', param)
}
// 分账接收方申请详情
export function getLedgerReceiverApplyDetail(param) {
  return axios.post('/api/LaKaLaLedger/QueryLedgerReceiverDetail', param)
}
export function getLedgerReceiverApplyDetailById(param) {
  return axios.post('/api/LaKaLaLedger/GetLedgerReceiverDetailById', param)
}
// 分账关系绑定
export function ledgerBindApplyOperation(param) {
  return axios.post('/api/LaKaLaLedger/ApplyBind', param)
}
// 分账关系解绑
export function ledgerUnBindApplyOperation(param) {
  return axios.post('/api/LaKaLaLedger/ApplyUnBind', param)
}
// 查询银行卡号开户行信息
export function getBankCardBinInfo(param) {
  return axios.post('/api/LaKaLaLedger/CardBin', param)
}

// 点餐
// 获取桌台区域管理列表
export function getDiningAreaList(param) {
  return axios.post('/api/DiningTable/GetDiningAreaListByPage', param)
}
// 获取桌台区域详情
export function getDiningAreaDetail(param) {
  return axios.post('/api/DiningTable/DiningAreaDetails', param)
}
// 添加，更新，删除桌台区域
export function diningAreaOperation(param) {
  return axios.post('/api/DiningTable/DiningAreaOperation', param)
}
// 获取桌台列表
export function getDiningTableList(param) {
  return axios.post('/api/DiningTable/GetDiningTableListByPage', param)
}
// 获取桌台详情
export function getDiningTableDetail(param) {
  return axios.post('/api/DiningTable/DiningTableDetails', param)
}
// 添加，更新，删除桌台
export function diningTableOperation(param) {
  return axios.post('/api/DiningTable/Operation', param)
}
// 桌码生成
export function createDiningTablePoster(param) {
  return axios.post('/api/DiningTable/CreatePoster', param)
}

// 必点菜方案
// 获取必点菜方案列表
export function getDefaultDishesList(param) {
  return axios.post('/api/DefaultDishes/GetListByPage', param)
}
// 获取必点菜方案详情
export function getDefaultDishesDetail(param) {
  return axios.post('/api/DefaultDishes/DefaultDishesDetails', param)
}
// 添加，更新，删除必点菜方案
export function defaultDishesOperation(param) {
  return axios.post('/api/DefaultDishes/Operation', param)
}

// 扫码餐桌点餐设置
// 获取餐桌点餐设置详情
export function getAppletConfigDetails(param) {
  return axios.post('/api/AppletConfig/AppletConfigDetails', param)
}
// 添加，更新，删除扫码餐桌点餐设置
export function appletConfigOperation(param) {
  return axios.post('/api/AppletConfig/Operation', param)
}

// 菜品库
// 获取菜品列表
export function getTableProductList(param) {
  return axios.post('/api/TableProduct/GetTableProduct', param)
}
// 获取菜品详情
export function getTableProductDetail(param) {
  return axios.post('/api/TableProduct/ActivityDetails', param)
}
// 添加，更新，删除菜品
export function tableProductOperation(param) {
  return axios.post('/api/TableProduct/Operation', param)
}
// 获取菜品套餐列表
export function getTableSetMealList(param) {
  return axios.post('/api/TableProductSetMeal/GetTableSetMeal', param)
}
// 获取菜品套餐详情
export function getTableSetMealDetail(param) {
  return axios.post('/api/TableProductSetMeal/TableSetMealDetails', param)
}
// 添加，更新，删除菜品套餐
export function tableSetMealOperation(param) {
  return axios.post('/api/TableProductSetMeal/MakeSetMealOperation', param)
}
