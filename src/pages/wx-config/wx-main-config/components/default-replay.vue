<template>
    <div class="default-replay">
        <div class="top-tip">只能选择其一</div>
        <el-tabs v-model="tabIndex" class="tabs" tab-position="left">
            <!--文本pane-->
            <el-tab-pane label="文本" name="first">
                <el-form class="text-form">
                    <el-form-item label="内容">
                        <el-input type="textarea" :rows="10" :maxlength="1000" placeholder="请输入内容" v-model="textReplay" style="width: 600px;"></el-input>
                    </el-form-item>
                    <el-form-item style="float: right;">
                        <el-button type="primary">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <!--图文pane-->
            <el-tab-pane label="图文" name="second">
                <el-col :span="24" style="margin-bottom: 20px;">
                    <el-button type="primary" style="float: right;" @click="handleFormVisable">添加图文</el-button>
                </el-col>
                <el-table class="img-txt-table" ref="imgTxtTable" :data="imgTxtList" border tooltip-effect="dark" v-loading="imgTxtListLoading">
                    <el-table-column align="center" prop="serial" label="序号" width="80"></el-table-column>
                    <el-table-column align="center" prop="productName" label="标题" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="categoryName" label="图片" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="productCode" label="排序" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="sales" label="链接" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="操作" width="250" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button type="warning" size="mini" @click="operateFunc(scope.row, '查看', 'Update')" style="background: #FFC835;border-color: #FFC835;">查看</el-button>
                            <el-button type="primary" size="mini" @click="operateFunc(scope.row, '编辑', 1)">编辑</el-button>
                            <el-button type="danger" size="mini" style="background: #FF4040;border-color: #FF4040;" @click="operateFunc(scope.row, '删除', 2)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-col :span="24">
                    <el-pagination @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="pageIndex"
                                :page-size="pageSize"
                                :page-sizes="[10, 15, 20, 25]"
                                :total="total"
                                layout="total, sizes, prev, pager, next"
                                background
                                style="float:right;">
                    </el-pagination>
                </el-col>
                <!--图文form-->
                <el-dialog title="新增 / 编辑" :visible.sync="imgTxtFormVisible" width="600px" @closed="closedImgTxtForm">
                    <el-form :model="imgTxtForm" label-width="80px" :rules="imgTxtFormRules" ref="form">
                        <el-form-item label="标题" prop="title">
                            <el-input type="textarea" :rows="2" :maxlength="30" v-model="imgTxtForm.title" style="width: 370px;"></el-input>
                        </el-form-item>
                        <el-form-item label="图片" prop="img">
                            <el-upload
                                :file-list="imgTxtForm.imgs"
                                action=""
                                :http-request="uploadImg"
                                list-type="picture-card"
                                :on-preview="handlePictureCardPreview"
                                :on-remove="handleRemove"
                                :before-upload="beforeUpload"
                                :on-exceed="onExceed"
                                :limit="1">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false">
                                <img width="100%" :src="dialogImageUrl" alt="">
                            </el-dialog>
                        </el-form-item>
                        <el-form-item label="内容" prop="content">
                            <el-input type="textarea" :rows="2" :maxlength="30" v-model="imgTxtForm.content" style="width: 370px;"></el-input>
                        </el-form-item>
                        <el-form-item label="链接" prop="links">
                            <el-input type="textarea" :rows="2" :maxlength="30" v-model="imgTxtForm.links" style="width: 370px;"></el-input>
                        </el-form-item>
                        <el-form-item label="排序" prop="orders">
                            <el-input v-model="imgTxtForm.orders" style="width: 370px;"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="imgTxtFormVisible = false">取消</el-button>
                        <el-button type="primary" @click.native="imgTxtFormSubmit" :loading="imgTxtFormLoading" :disabled="disabledSubmit">提交</el-button>
                    </div>
                </el-dialog>
            </el-tab-pane>
            <!--语音pane-->
            <el-tab-pane label="语音" name="third">
                <el-form class="voice-form" :model="voiceForm">
                    <el-form-item label="音乐标题">
                        <el-input :maxlength="30" v-model="voiceForm.title" style="width: 600px;"></el-input>
                    </el-form-item>
                    <el-form-item label="音乐链接">
                        <el-upload
                        :file-list="voiceForm.imgs"
                        action=""
                        :http-request="uploadVoice"
                        :on-remove="handleRemoveVoice"
                        :before-upload="beforeUploadVoice"
                        :on-exceed="onExceed"
                        :limit="1">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">支持mp3格式，可以填写网上的链接，也可以本地上传</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="音乐描述">
                        <el-input :maxlength="30" v-model="voiceForm.remark" style="width: 600px;"></el-input>
                    </el-form-item>
                    <el-form-item style="float: right;">
                        <el-button type="primary">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script type="text/ecmascript-6">
import {UploadImg1} from '@/api/system'
export default {
    name: 'default-replay',
    data () {
        return {
            tabIndex: 'first',
            // 文本回复内容
            textReplay: '',
            // 控制是否显示图文列表或者form的loading
            imgTxtListLoading: false,
            imgTxtFormLoading: false,
            // 图文列表数据
            imgTxtList: [],
            // 控制是否显示form
            imgTxtFormVisible: false,
            // 图文的form
            imgTxtForm: {},
            imgTxtFormRules: {},
            // 是否禁用提交按钮
            disabledSubmit: false,
            dialogImageUrl: '',
            dialogVisible: false,
            // 分页相关
            total: 0,
            pageIndex: 1,
            pageSize: 10,
            // 音乐form
            voiceForm: {}
        }
    },
    methods: {
        // 打开form
        handleFormVisable () {
            this.imgTxtFormVisible = true
        },
        // submit
        imgTxtFormSubmit () {
             console.log('提交')
        },
        // 增删改查
        operateFunc (row, title, action) {
            console.log('增删改查')
        },
        // pageSize 改变
        handleSizeChange (val) {
            console.log('pageSize 改变')
            this.pageSize = val
        },
        // currentPage 改变
        handleCurrentChange (val) {
            console.log('currentPage 改变')
            this.pageIndex = val
        },
        // 关闭form
        closedImgTxtForm () {
            this.imgTxtFormVisible = false
        },
        // 上传图片
        uploadImg (param) {
            let file = param.file
            let formData = new FormData()
            formData.append('file', file)
            UploadImg1(formData).then(res => {
                if (res.success) {
                let data = res.data
                if (!this.imgTxtForm.img) {
                    this.$set(this.imgTxtForm, 'img', {url: '', thumUrl: '', absoluteUrl: ''})
                }
                this.imgTxtForm.img.url = (data.length > 0) ? data[0] : ''
                this.disabledSubmit = false
                }
            }, err => {
                console.log(err)
                this.$message({
                    message: err.msg,
                    type: 'error'
                })
                this.disabledSubmit = false
            })
        },
        // 上传之前
        beforeUpload (file) {
            this.disabledSubmit = true
            console.log(file.type)
            if ((file.type === 'image/jpeg') ||
                (file.type === 'image/jpg') ||
                (file.type === 'image/png') ||
                (file.type === 'image/gif') ||
                (file.type === 'image/x-icon')) {
                return true
            } else {
                this.$message({
                message: '请上传jpg、jpeg、png、ico、gif格式的图片!',
                type: 'warning'
                })
                return false
            }
        },
        // 删除上传文件钩子
        handleRemove (file, fileList) {
            this.$set(this.imgTxtForm, 'img', {url: '', thumUrl: '', absoluteUrl: ''})
            this.disabledSubmit = false
        },
        // 点击上传图片钩子
        handlePictureCardPreview (file) {
            this.dialogImageUrl = file.url
            this.dialogVisible = true
        },
        // 上传图片超出限制
        onExceed (files, fileList) {
            this.$message({
                message: '只能上传一张图片',
                type: 'warning'
            })
        },
        // 上传音乐
        uploadVoice () {

        },
        beforeUploadVoice () {

        },
        handleRemoveVoice () {

        }
    }
}
</script>

<style lang="scss" scoped>
    .default-replay {
        .top-tip {
            height: 50px;
            line-height: 50px;
            background-color: #fcf8e3;
            padding-left: 15px;
            font-size: 14px;
            color: #8a6d3b;
            border: 1px solid #faebcc;
            margin-bottom: 20px;
        }
        .text-form {
            padding: 10px 0 0 50px;
            width: 708px;
            /deep/ .el-form-item__label {
                font-size: 22px;
                line-height: none;
            }
        }
        .img-txt-table {
            margin-bottom: 15px;
        }
        .voice-form {
            padding: 10px 0 0 50px;
            width: 720px;
        }
    }
</style>
