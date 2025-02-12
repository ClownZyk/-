<template>
    <div class="wx-menu-setting">
        <el-col :span='24' class='top-box'>
            <h3>使用说明及规则，请仔细阅读</h3>
            <ul>
                <li>官方要求：一级菜单按钮个数为1-3个</li>
                <li>官方要求：如果设置了二级菜单，子按钮个数为1-5个</li>
                <li>官方要求：按钮描述，即按钮名字，不超过16个字节，子菜单不超过40个字节</li>
                <li>如果name不填，此按钮将被忽略</li>
                <li>如果一级菜单为空，该列所有设置的二级菜单都会被忽略</li>
                <li>key仅在SingleButton（单击按钮，无下级菜单）的状态下设置，如果此按钮有下级菜单，key将被忽略</li>
                <li>所有二级菜单都为SingleButton</li>
                <li>如果要快速看到微信上的菜单最新状态，需要重新关注，否则需要静静等待N小时</li>
            </ul>
        </el-col>
        <el-col :span='24' class='center-box'>
            <h3>编辑工具</h3>
            <div>
                <el-button type="info" @click="handleClickGetData">获取当前菜单</el-button>
                <el-button type="primary" @click="handleSubmit">更新到服务器</el-button>
            </div>
            <div class="center-state">操作状态：</div>
        </el-col>
        <el-col :span='24' class='bottom-box'>
            <ul class='menu-list'>
                <li class='menu-item'>
                    <div></div>
                    <div>第一列</div>
                    <div>第二列</div>
                    <div>第三列</div>
                </li>
                <li class='menu-item'>
                    <div>二级菜单No.1</div>
                    <div><el-input  class='item-input' v-model="datas[0].sub_button[0].name" @focus='focusInput($event, datas[0].sub_button[0])' @blur='blurInput($event, 0, 0)'></el-input></div>
                    <div><el-input  class='item-input' v-model="datas[1].sub_button[0].name" @focus='focusInput($event, datas[1].sub_button[0])' @blur='blurInput($event, 1, 0)'></el-input></div>
                    <div><el-input  class='item-input' v-model="datas[2].sub_button[0].name" @focus='focusInput($event, datas[2].sub_button[0])' @blur='blurInput($event, 2, 0)'></el-input></div>
                </li>
                <li class='menu-item'>
                    <div>二级菜单No.2</div>
                    <div><el-input  class='item-input' v-model="datas[0].sub_button[1].name" @focus='focusInput($event, datas[0].sub_button[1])' @blur='blurInput($event, 0, 1)'></el-input></div>
                    <div><el-input  class='item-input' v-model="datas[1].sub_button[1].name" @focus='focusInput($event, datas[1].sub_button[1])' @blur='blurInput($event, 1, 1)'></el-input></div>
                    <div><el-input  class='item-input' v-model="datas[2].sub_button[1].name" @focus='focusInput($event, datas[2].sub_button[1])' @blur='blurInput($event, 2, 1)'></el-input></div>
                </li>
                <li class='menu-item'>
                    <div>二级菜单No.3</div>
                    <div><el-input  class='item-input' v-model="datas[0].sub_button[2].name" @focus='focusInput($event, datas[0].sub_button[2])' @blur='blurInput($event, 0, 2)'></el-input></div>
                    <div><el-input  class='item-input' v-model="datas[1].sub_button[2].name" @focus='focusInput($event, datas[1].sub_button[2])' @blur='blurInput($event, 1, 2)'></el-input></div>
                    <div><el-input  class='item-input' v-model="datas[2].sub_button[2].name" @focus='focusInput($event, datas[2].sub_button[2])' @blur='blurInput($event, 2, 2)'></el-input></div>
                </li>
                <li class='menu-item'>
                    <div>二级菜单No.4</div>
                    <div><el-input  class='item-input' v-model="datas[0].sub_button[3].name" @focus='focusInput($event, datas[0].sub_button[3])' @blur='blurInput($event, 0, 3)'></el-input></div>
                    <div><el-input  class='item-input' v-model="datas[1].sub_button[3].name" @focus='focusInput($event, datas[1].sub_button[3])' @blur='blurInput($event, 1, 3)'></el-input></div>
                    <div><el-input  class='item-input' v-model="datas[2].sub_button[3].name" @focus='focusInput($event, datas[2].sub_button[3])' @blur='blurInput($event, 2, 3)'></el-input></div>
                </li>
                <li class='menu-item'>
                    <div>二级菜单No.5</div>
                    <div><el-input  class='item-input' v-model="datas[0].sub_button[4].name" @focus='focusInput($event, datas[0].sub_button[4])' @blur='blurInput($event, 0, 4)'></el-input></div>
                    <div><el-input  class='item-input' v-model="datas[1].sub_button[4].name" @focus='focusInput($event, datas[1].sub_button[4])' @blur='blurInput($event, 1, 4)'></el-input></div>
                    <div><el-input  class='item-input' v-model="datas[2].sub_button[4].name" @focus='focusInput($event, datas[2].sub_button[4])' @blur='blurInput($event, 2, 4)'></el-input></div>
                </li>
                <li class='menu-item'>
                    <div style='color: #E65600;'>一级菜单按钮</div>
                    <div><el-input  class='item-input' v-model="datas[0].name" @focus='focusInput($event, datas[0])' @blur='blurInput($event, 0, "")'></el-input></div>
                    <div><el-input  class='item-input' v-model="datas[1].name" @focus='focusInput($event, datas[1])' @blur='blurInput($event, 1, "")'></el-input></div>
                    <div><el-input  class='item-input' v-model="datas[2].name" @focus='focusInput($event, datas[2])' @blur='blurInput($event, 2, "")'></el-input></div>
                </li>
            </ul>
            <h3>按钮其他参数</h3>
            <el-form :model="form" class="form" label-width="125px">
                <el-form-item label="Name">
                    <el-input v-model="form.name" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="Type">
                    <el-select v-model="form.type" @change='changeSelect'>
                        <el-option label="点击事件(传回服务器)" value="click"></el-option>
                        <el-option label="访问网页(直接跳转)" value="view"></el-option>
                        <el-option label="小程序(直接跳转)" value="miniprogram"></el-option>
                        <el-option label="下发消息(除文本消息)" value="media_id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Key" v-show='(currentShow == "click") ? true : false'>
                    <el-input v-model="form.key"></el-input>
                </el-form-item>
                <el-form-item label="Url" v-show='(currentShow == "view") ? true : false'>
                    <el-input v-model="form.url"></el-input>
                </el-form-item>
                <el-form-item label="小程序AppId" v-show='(currentShow == "miniprogram") ? true : false'>
                    <el-input v-model="form.appid"></el-input>
                </el-form-item>
                <el-form-item label="小程序PagePath" v-show='(currentShow == "miniprogram") ? true : false'>
                    <el-input v-model="form.pagePath"></el-input>
                </el-form-item>
                <el-form-item label="MediaId" v-show='(currentShow == "media_id") ? true : false'>
                    <el-input v-model="form.media_id"></el-input>
                </el-form-item>
            </el-form>
        </el-col>
    </div>
</template>

<script type="text/ecmascript-6">
/* eslint-disable */
export default {
    name: 'wx-menu-setting',
    data () {
        return {
            // 控制当前需要显示的input
            currentShow: '',
            // 当前下标
            x: 0,
            y: 0,
            form: {},
            // 作用一：后台的数据处理后放入该数组； 作用二：处理该数组后，向后台提交数据用该数组
            datas: [
                {name: '', sub_button:[{name: ''}, {name: ''}, {name: ''}, {name: ''}, {name: ''}]},
                {name: '', sub_button:[{name: ''}, {name: ''}, {name: ''}, {name: ''}, {name: ''}]},
                {name: '', sub_button:[{name: ''}, {name: ''}, {name: ''}, {name: ''}, {name: ''}]}
            ],
            button: [
                {url: "http://kc.wxbos.cn/NPLAPI/GetUserInfor?redirecturl=http://kc.wxbos.cn/microshop/index.html", type: "view", name:"微商城"},
                {sub_button: [{url: "http://kc.wxbos.cn/YYLAPI/GetUserInfor?redirecturl=http%3a%2f%2fkc.wxbos.cn%2fphone%2findex.html#source", type:"view", name:"卡券兑换"},
                              {url: "http://kc.wxbos.cn/YYLAPI/GetUserInfor?redirecturl=http%3a%2f%2fkc.wxbos.cn%2fphone%2findex.html%23%2fsource", type:"view", name:"一蟹一码"}],
                              name:"卡券一溯源"},
                {sub_button: [{url: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9c14efac0cd83054&redirect_uri=http://kc.wxbos.cn/YYLAPI/GetSalesOpenid&response_type=code&scope=snsapi_base&state=kcxny#wechat_redirect",
                              type:"view", name:"业务员登录"},
                              {url: "http://s.dkhfy.com//YYLAPI/GetUInfor?redirecturl=http://s.dkhfy.com/microweb/lucky.html", type:"view", name:"幸运抽奖"},
                              {url: "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU0Mzg5ODAxMw==&scene=124#wechat_redirect", type:"view", name:"往期信息回顾"},
                              {media_id: "XNu2FqfyzAbq10y4PK7tve22gFH6WvHH_GiXBNPCQD0", type:"media_id", name:"联系客服"}],
                              name:"会员中心"}
            ]
        }
    },
    methods: {
        // input获得焦点
        focusInput (event, val) {
            // 将form内的值和datas的数据绑定起来
            this.form = val
            this.$set(this.form, 'name', val.name)
            let type = val.type ? val.type : ''
            this.currentShow = type
            this.$set(this.form, 'type', type)
            if (type === 'click') {
                this.$set(this.form, 'key', val.key)
            } else if (type === 'view') {
                this.$set(this.form, 'url', val.url)
            } else if (type === 'miniprogram') {
                this.$set(this.form, 'appid', val.appid)
                this.$set(this.form, 'pagePath', val.pagePath)
            } else if (type === 'media_id') {
                this.$set(this.form, 'media_id',  val.media_id)
            } else {
                this.clear()
            }
        },
        // input失去焦点
        blurInput (event, x, y) {
            // 如果某个菜单对应的值未填全，失去焦点时，清空之前的数据
            let isClear = false
            if (this.form.name === '') {
                isClear = true
            } else if (y !== ''){
                if (this.form.type === '') {
                    isClear = true
                } else {
                    let type = this.form.type
                    if ((type === 'click' && this.form.key === '') ||
                        (type === 'view' && this.form.url === '') ||
                        (type === 'miniprogram' && (this.form.appid === '' || this.form.pagePath === '')) ||
                        (type === 'media_id' && this.form.media_id === '')
                    ) {
                        isClear = true
                    }
                }
            }
            if (isClear) {
                this.clear()
                if (y === '') {
                    this.clearDatas(this.datas[x])
                } else {
                    this.clearDatas( this.datas[x].sub_button[y])
                }
            }
            console.log(this.datas)
        },
        // 下拉选项改变
        changeSelect(currentVal) {
            console.log(currentVal)
            this.currentShow = currentVal
            console.log(this.datas)
            this.clear()
        },
        // 清数据
        clearDatas (obj) {
            obj.name = ''
            obj.type = ''
            obj.key = ''
            obj.url = ''
            obj.appid = ''
            obj.pagePath = ''
            obj.media_id = ''
        },
        // 清空
        clear () {
            this.$set(this.form, 'key', '')
            this.$set(this.form, 'url', '')
            this.$set(this.form, 'appid', '')
            this.$set(this.form, 'pagePath', '')
            this.$set(this.form, 'media_id', '')
        },
        // 点击提交
        handleSubmit () {
            console.log(this.datas)
            let submitDatas =[]
            this.datas.forEach((v, i) => {
                let obj = {}
                for(const key in v) {
                    // console.log(key)
                    // 复制一级菜单
                    if (v[key] !== '' && key !== 'sub_button') {
                        obj[key] = v[key]
                    }
                    // 复制子菜单
                    if (key === 'sub_button') {
                        obj[key] = []
                        // 遍历子菜单
                        let subButton = v[key]
                        subButton.forEach(childV => {
                            let childObj = {}
                            for(const childKey in childV) {
                                if (childV[childKey] !== '') {
                                    childObj[childKey] = childV[childKey]
                                }
                            }
                            if (JSON.stringify(childObj) !== '{}') {
                                obj[key].push(childObj)
                            }
                        })
                        // 子菜单如果为空就不要
                        if (obj[key].length <= 0) {
                            delete obj[key]
                        }
                    }
                }
                submitDatas.push(obj)
            })
            console.log(submitDatas)
        },
        // 点击获取当前菜单
        handleClickGetData () {
            this._getData()
        },
        // 获取数据
        _getData () {
            let array = []
            this.button.forEach((v, i) => {
                if (v.sub_button) {
                    for(let si=0; si<5; si++) {
                        if (!v.sub_button[si]) {
                            console.log('UN得翻')
                            v.sub_button[si] = {name: ''}
                        }
                    }
                    array.push(v)
                } else {
                    v.sub_button = [{name:''}, {name:''}, {name:''}, {name:''}, {name:''}]
                    array.push(v)
                }
            })
            this.datas = array
            console.log(this.datas)
        },
        // 深拷贝
        deepCopy (obj) {
            return JSON.parse(JSON.stringify(obj))
        }
    }
}
</script>

<style lang='scss' scoped>
    .wx-menu-setting {
        padding: 30px 20px 0 20px;
        color: #666666;
        h3 {
            /*font-size: 26px;*/
          font-size: 22px;
            margin-bottom: 10px;
        }
        .top-box {
            padding: 10px;
            width: 100%;
            background-color: #ECECEC;
            ul {
                padding-left: 40px;
                font-size: 15px;
                line-height: 1.5;
                list-style: disc;
            }
        }
        .center-box {
            margin: 10px 0;
            .center-state {
                font-size: 15px;
                background-color: #E7F5FF;
                margin: 10px 0;
                padding: 5px;
            }
        }
        .bottom-box {
            .menu-list {
                margin-bottom: 15px;
                .menu-item {
                    display: flex;
                    text-align: center;
                    margin: 5px 0;
                    div {
                        margin: 0 5px;
                        width: 140px;
                        height: 30px;
                        line-height: 30px;
                        /deep/ .el-input__inner {
                            height: 30px;
                        }
                    }
                }
            }
            .form {
                width: 400px;
                /deep/ .el-form-item {
                    margin-bottom: 5px;
                    .el-input__inner {
                        width: 300px;
                        height: 35px;
                    }
                }
            }
        }
    }
</style>
