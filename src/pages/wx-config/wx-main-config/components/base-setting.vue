<template>
    <div class="base-setting">
        <el-form class="form" ref="form" :model="form" :rules="formRules" v-loading="formLoading">
            <div class="form-contain-item">
                <el-form-item prop="wxName">
                    <div class="form-item-title">公众帐号名称<span class="border"></span><span class="EnName">WXNAME</span></div>
                    <el-input v-model="form.wxName" placeholder="请输入公众帐号名称"></el-input>
                </el-form-item>
                <el-form-item prop="wxID">
                    <div class="form-item-title">公众号原始ID<span class="border"></span><span class="EnName">WXID</span></div>
                    <el-input v-model="form.wxID" placeholder="请输入公众号原始ID"></el-input>
                </el-form-item>
                <el-form-item prop="weChatID">
                    <div class="form-item-title">微信号<span class="border"></span><span class="EnName">WECHATID</span></div>
                    <el-input v-model="form.weChatID" placeholder="请输入微信号"></el-input>
                </el-form-item>
            </div>
            <div class="form-contain-item">
                <el-form-item prop="appId">
                    <div class="form-item-title">AppId<span class="border"></span><span class="EnName">APPID</span></div>
                    <el-input v-model="form.appId" placeholder="请输入AppId"></el-input>
                </el-form-item>
                <el-form-item prop="appSecret">
                    <div class="form-item-title">AppSecret<span class="border"></span><span class="EnName">APPSECRET</span></div>
                    <el-input v-model="form.appSecret" placeholder="请输入AppSecret"></el-input>
                </el-form-item>
            </div>
            <div class="form-contain-item">
                <el-form-item prop="headImg">
                    <div class="form-item-title">头像<span class="border"></span><span class="EnName">HEADIMAGE</span></div>
                    <my-upload :imgs="form.headImgs"
                        :limitUploadImgs="1"
                        ref="uploadImg"
                        @handleDisabledSubmit="handleDisabledSubmit"
                        @handleRemoveImg="handleRemoveImg('headImg', 1, $event)"
                        @handleUploadImg="handleUploadImg('headImg', 1, $event)">
                    </my-upload>
                </el-form-item>
            </div>
            <div class="form-contain-item">
                <el-form-item>
                    <el-button type="primary" :loading="submitLoading" :disabled="disabledSubmit" @click="formSubmit">提交</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script type="text/ecmascript-6">
import {WXGetByCid, WXOperation} from '@/api/system'
import myUpload from '@/components/my-upload'
export default {
    name: 'base-setting',
    components: {
        myUpload
    },
    data () {
        return {
            // form校验规则
            formRules: {
                wxName: [
                    {required: true, message: '请输入公众帐号名称', trigger: 'blur'}
                ],
                wxID: [
                    {required: true, message: '请输入公众号原始ID', trigger: 'blur'}
                ],
                weChatID: [
                    {required: true, message: '请输入微信号', trigger: 'blur'}
                ],
                appId: [
                    {required: true, message: '请输入AppId', trigger: 'blur'}
                ],
                appSecret: [
                    {required: true, message: '请输入AppSecret', trigger: 'blur'}
                ]
            },
            // 控制提交按钮是否禁用
            disabledSubmit: false,
            form: {},
            formLoading: false,
            submitLoading: false,
            // 默认是添加
            operateAction: 0
        }
    },
    methods: {
        // 是否禁用提交按钮,与上传相关
        handleDisabledSubmit (val) {
            this.disabledSubmit = val
        },
        // 删除图片
        handleRemoveImg (txt, limitUploadImgs, fileList) {
            if (limitUploadImgs > 1) {
                this.form[txt] = fileList
            } else {
                this.form[txt] = ''
            }
        },
        // 图片上传成功回调
        handleUploadImg (txt, limitUploadImgs, imgObj) {
            if (limitUploadImgs > 1) {
                if (!this.form[txt]) {
                    this.$set(this.form, txt, [])
                }
                this.form[txt].push(JSON.parse(JSON.stringify(imgObj)))
            } else {
                this.form[txt] = imgObj.url || ''
            }
        },
        // 各种清空
        clear: function () {
            this.submitLoading = false
            this.disabledSubmit = false
            this.$refs['form'].clearValidate()
            this.$refs['form'].resetFields()
            this.$refs.uploadImg.clearFiles()
            this.form = {}
            this.init()
        },
        // 提交
        formSubmit () {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.submitLoading = true
                        // 设置创建人、角色ID、cid
                        this.$set(this.form, 'creater', this.$store.state.UserID)
                        this.$set(this.form, 'roleid', this.$store.state.UserRole)
                        this.$set(this.form, 'cid', this.$store.state._cid)
                        let params = {
                            Dto: Object.assign({}, this.form),
                            Action: this.operateAction
                        }
                        WXOperation(params).then(res => {
                            this.$message({
                                message: res.msg,
                                type: res.success ? 'success' : 'error'
                            })
                            this.clear()
                        })
                    })
                }
            })
        },
        // 上传图片change事件,添加文件、上传成功和上传失败时都会被调用
        onChange (file, fileList) {
            this.hiddenUpload = fileList.length >= this.limitUploadImgs
        },
        async init () {
            let params = {
                pageSize: 0,
                pageIndex: 0,
                isPage: false,
                isOrder: true,
                isAsc: true,
                creater: this.$store.state.UserID,
                roleid: this.$store.state.UserRole,
                cid: this.$store.state._cid
            }
            this.formLoading = true
            await WXGetByCid(params).then(res => {
                if (res.success) {
                    // console.log(res.data)
                    let data = res.data
                    if (data !== {}) {
                        // 有值，设为编辑
                        this.operateAction = 1
                        this.form = data
                        this.formLoading = false
                        if (data.headImg !== undefined && data.headImg !== null && data.headImg !== '') {
                            this.form.headImgs = []
                            this.form.headImgs.push({url: data.headImg})
                        }
                    }
                } else {
                    this.formLoading = false
                    this.$message.error(res.msg)
                }
            }, err => {
                this.formLoading = false
                this.$message.error(err.msg)
            })
        }
    },
    mounted () {
        this.init()
    }
}
</script>

<style lang="scss" scoped>
    .base-setting {
        .form {
            /deep/ .el-input {
                width: 400px !important;
            }
            .form-contain-item {
                display: flex;
                display: -webkit-flex;
                flex-wrap: wrap;
                .el-form-item {
                    margin-left: 20px;
                    .el-form-item__content {
                        .form-item-title {
                            font-weight: bolder;
                            font-size: 16px;
                            position: relative;
                            .border {
                                width: 1px;
                                height: 16px;
                                position: absolute;
                                background-color: #000000;
                                display: inline-block;
                                top: 10px;
                                margin-left: 8px;
                            }
                            .EnName {
                                font-weight: normal;
                                font-size: 14px;
                                position: absolute;
                                bottom: 0;
                                margin-left: 17px;
                            }
                        }
                        .el-input {
                            width: 210px;
                        }
                    }
                }
            }
        }
    }
</style>
