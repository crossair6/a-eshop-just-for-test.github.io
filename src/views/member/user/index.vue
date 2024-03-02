<template>
    <div class="user-container">
        <div class="avatar-container">
            <img
                :src="$store.state.user.profile.avatar"
                alt=""
                class="avatar-img"
            />
            <span class="change-avatar" @click="changeAvatar"
                >点击更新头像</span
            >
            <span class="avatar-info"
                >请选择图片上传：大小400 *
                400像素,支持JPG、PNG等格式，图片需小于5M</span
            >
            <input
                type="file"
                ref="inputFileRef"
                @change="onSelectImage"
                accept="image/*"
            />
        </div>
        <Form
            class="xtx-form"
            :validation-schema="profileSchema"
            autocomplete="off"
            v-slot="{ errors }"
            ref="formRef"
        >
            <div class="xtx-form-item">
                <div class="label">
                    <span class="word">昵称</span>
                    <span class="colon">:</span>
                </div>
                <div class="field">
                    <Field
                        class="input"
                        name="nickname"
                        placeholder="请输入昵称"
                        v-model.trim="profile.nickname"
                    />
                    <div class="error" v-if="errors.nickname">
                        <i class="iconfont icon-warning" />{{ errors.nickname }}
                    </div>
                </div>
            </div>
            <div class="xtx-form-item">
                <div class="label">
                    <span class="word">出生日期</span>
                    <span class="colon">:</span>
                </div>
                <div class="field">
                    <Field
                        class="input"
                        name="birthday"
                        placeholder="请输入出生日期"
                        v-model.trim="profile.birthday"
                        type="date"
                    />
                    <div class="error" v-if="errors.birthday">
                        <i class="iconfont icon-warning" />{{ errors.birthday }}
                    </div>
                </div>
            </div>
            <div class="xtx-form-item">
                <div class="label">
                    <span class="word">性别</span>
                    <span class="colon">:</span>
                </div>
                <div class="field">
                    <Field
                        class="input"
                        name="gender"
                        placeholder="请选择性别"
                        v-model.trim="profile.gender"
                        as="select"
                    >
                        <option
                            v-for="item in genderList"
                            :key="item"
                            :selected="item === profile.gender"
                        >
                            {{ item }}
                        </option>
                    </Field>
                    <div class="error" v-if="errors.gender">
                        <i class="iconfont icon-warning" />{{ errors.gender }}
                    </div>
                </div>
            </div>
            <div class="xtx-form-item">
                <div class="label">
                    <span class="word">职业</span>
                    <span class="colon">:</span>
                </div>
                <div class="field">
                    <Field
                        class="input"
                        name="profession"
                        placeholder="请输入职业"
                        v-model.trim="profile.profession"
                    />
                    <div class="error" v-if="errors.profession">
                        <i class="iconfont icon-warning" />{{
                            errors.profession
                        }}
                    </div>
                </div>
            </div>
            <div class="xtx-form-item">
                <div class="label">
                    <span class="word">地区</span>
                    <span class="colon">:</span>
                </div>
                <div class="field">
                    <Field
                        as="XtxCity"
                        name="profession"
                        placeholder="请输入职业"
                        @changeAddress="changeAddress"
                        :defaultAddress="defaultAddress"
                    />
                    <div class="error" v-if="errors.profession">
                        <i class="iconfont icon-warning" />{{
                            errors.profession
                        }}
                    </div>
                </div>
            </div>
        </Form>
        <div class="footer">
            <XtxButton type="primary" @click="saveProfile">保存</XtxButton>
        </div>
    </div>
    <XtxDialog
        title="更新头像"
        v-model="changeAvatarDialogVisible"
        id="changeAvatarDialog"
    >
        <div class="main">
            <div class="select">
                <div class="square-bg">
                    <div class="img-container" v-show="showCutImg">
                        <img alt="" class="bgImg" id="bgImg" />
                        <div
                            class="cutImg-operator"
                            id="cutImgOperator"
                            @mousedown="imgDown"
                        >
                            <div class="cutImg-container" id="cutImgContainer">
                                <img class="cutImg" id="cutImg" />
                            </div>
                            <div class="operator" id="operator">
                                <div
                                    class="dot"
                                    @mousedown="dotDown($event, 'leftTop')"
                                ></div>
                                <div
                                    class="dot"
                                    @mousedown="dotDown($event, 'rightTop')"
                                ></div>
                                <div
                                    class="dot"
                                    @mousedown="dotDown($event, 'leftBottom')"
                                ></div>
                                <div
                                    class="dot"
                                    @mousedown="dotDown($event, 'rightBottom')"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="change-avatar" @click="changeAvatar">重新选择</div>
            </div>
            <div class="line"></div>
            <div class="preview">
                <div class="image" id="previewImgContainer">
                    <img alt="" class="previewImg" id="previewImg" />
                </div>
                <span class="info">预览头像</span>
            </div>
        </div>
        <template #footer>
            <XtxButton type="primary" @click="uploadAvatar">更新头像</XtxButton>
            <XtxButton type="warning" @click="changeAvatarDialogVisible = false"
                >取消</XtxButton
            >
        </template>
    </XtxDialog>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { Form, Field } from 'vee-validate'
import {
    getMemberProfileAPI,
    updateMemberProfileAPI,
    uploadAvatarAPI
} from '@/api/member'
import schema, { genderList } from '@/utils/vee-validate-schema'
import Message from '@/components/library/XtxMessage'
import { useStore } from 'vuex'
const store = useStore()
getMemberProfile()
const showCutImg = ref(false)
const changeAvatarDialogVisible = ref(false)
let 裁剪初始size = 0
let 裁剪初始left = 0
let 裁剪初始Top = 0
let 裁剪leftMax = 0
let 裁剪topMax = 0
let isImgDown = false
let isDotDown = false
let 鼠标初始x = 0
let 鼠标初始y = 0
let dotType = ''
let 裁剪当前size = 0
const 图片上传尺寸 = 400
let imgSrc = ''
const cutInfo = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    size: 0
}
// 初始化裁剪区域
function initCutImg() {
    showCutImg.value = true
    console.log('initCutImg', showCutImg.value)
    nextTick(() => {
        // const 裁剪sizeMax = Math.min(bgImg.offsetWidth, bgImg.offsetHeight)
        裁剪初始size = Math.min(bgImg.offsetWidth, bgImg.offsetHeight)
        裁剪leftMax = bgImg.offsetWidth - 裁剪初始size
        裁剪topMax = bgImg.offsetHeight - 裁剪初始size
        cutImg.style.width = bgImg.offsetWidth + 'px'
        cutImg.style.height = bgImg.offsetHeight + 'px'
        裁剪初始left = 裁剪leftMax / 2
        裁剪初始Top = 裁剪topMax / 2
        updateCutImg(裁剪初始size, 裁剪初始left, 裁剪初始Top)
    })
}
// 更新裁剪区域的大小和位置
function updateCutImg(size, left, top) {
    const 裁剪sizeMax = Math.min(bgImg.offsetWidth, bgImg.offsetHeight)
    if (size > 裁剪sizeMax) {
        size = 裁剪sizeMax
        return
    }
    const 当前leftMax = bgImg.offsetWidth - size
    const 当前topMax = bgImg.offsetHeight - size
    if (isImgDown) {
        if (left < 0) {
            left = 0
        }
        if (left >= 当前leftMax) {
            left = 当前leftMax
        }
        if (top < 0) {
            top = 0
        }
        if (top >= 当前topMax) {
            top = 当前topMax
        }
    }
    if (isDotDown && size > 裁剪当前size) {
        if (left < 0) {
            return
        }
        if (left > 当前leftMax) {
            return
        }
        if (top < 0) {
            return
        }
        if (top > 当前topMax) {
            return
        }
    }
    cutImgOperator.style.width = size + 'px'
    cutImgOperator.style.height = size + 'px'
    裁剪当前size = size
    cutImgOperator.style.left = left + 'px'
    cutImgOperator.style.top = top + 'px'
    cutImg.style.left = -left + 'px'
    cutImg.style.top = -top + 'px'
    // 更新getInfo
    cutInfo.width = bgImg.offsetWidth
    cutInfo.height = bgImg.offsetHeight
    cutInfo.size = size
    cutInfo.left = left
    cutInfo.top = top
    updatePreviewImg()
}
function updatePreviewImg() {
    const ratio = cutInfo.size / previewImgContainer.offsetWidth
    const width = cutInfo.width / ratio
    const height = cutInfo.height / ratio
    const left = cutInfo.left / ratio
    const top = cutInfo.top / ratio
    previewImg.style.width = width + 'px'
    previewImg.style.height = height + 'px'
    previewImg.style.left = -left + 'px'
    previewImg.style.top = -top + 'px'
}
// 上传头像
function uploadAvatar() {
    const ratio = bgImg.naturalWidth / bgImg.offsetWidth
    const uploadCutInfo = {
        left: cutInfo.left * ratio,
        top: cutInfo.top * ratio,
        width: cutInfo.size * ratio,
        height: cutInfo.size * ratio,
        uploadWidth: 图片上传尺寸,
        uploadHeight: 图片上传尺寸
    }
    console.log(uploadCutInfo)
    const canvas = document.createElement('canvas')
    canvas.width = uploadCutInfo.uploadWidth
    canvas.height = uploadCutInfo.uploadHeight
    const context = canvas.getContext('2d')
    console.log(imgSrc)
    const img = new Image()
    img.src = imgSrc
    img.onload = () => {
        context.drawImage(
            img,
            uploadCutInfo.left,
            uploadCutInfo.top,
            uploadCutInfo.width,
            uploadCutInfo.height,
            0,
            0,
            uploadCutInfo.uploadWidth,
            uploadCutInfo.uploadHeight
        )

        canvas.toBlob(async (blob) => {
            const file = new File([blob], 'avatar.jpg', {
                type: 'image/jpeg'
            })
            console.log(file)
            console.log(file.size / 1024)
            const formData = new FormData()
            formData.append('file', file)
            const res = await uploadAvatarAPI(formData)
            console.log(res)
            Message({
                type: 'success',
                text: '更新头像成功'
            })
            changeAvatarDialogVisible.value = false
            getMemberProfile()
        }, 'image/jpeg')
    }
}
// 鼠标在裁剪框区域按下
function imgDown(e) {
    if (isDotDown) {
        return
    }
    isImgDown = true
    鼠标初始x = e.pageX
    鼠标初始y = e.pageY
    裁剪初始left = -cutImg.offsetLeft
    裁剪初始Top = -cutImg.offsetTop
    // console.log('鼠标初始', 鼠标初始x, 鼠标初始y, offsetLeft, offsetTop)
}
// 拖动裁剪框
function imgMove(e) {
    const 鼠标当前x = e.pageX
    const 鼠标当前y = e.pageY
    const 鼠标移动x = 鼠标当前x - 鼠标初始x
    const 鼠标移动y = 鼠标当前y - 鼠标初始y
    const size = cutImgOperator.offsetWidth
    const left = 裁剪初始left + 鼠标移动x
    const top = 裁剪初始Top + 鼠标移动y
    updateCutImg(size, left, top)
}
// 鼠标在dot区域按下
function dotDown(e, type) {
    isDotDown = true
    dotType = type
    console.log(dotType)
    鼠标初始x = e.pageX
    鼠标初始y = e.pageY
    裁剪初始size = cutImgOperator.offsetWidth
    console.log(裁剪初始size)
    裁剪初始left = -cutImg.offsetLeft
    裁剪初始Top = -cutImg.offsetTop
    裁剪leftMax = bgImg.offsetWidth - 裁剪初始size
    裁剪topMax = bgImg.offsetHeight - 裁剪初始size
}
// 改变裁剪框大小和位置
function dotMove(e) {
    const 鼠标当前x = e.pageX
    const 鼠标移动x = 鼠标初始x - 鼠标当前x
    let size = 0
    let left = 0
    let top = 0
    if (dotType === 'leftTop') {
        size = 裁剪初始size + 鼠标移动x
        left = 裁剪初始left - 鼠标移动x
        top = 裁剪初始Top - 鼠标移动x
    } else if (dotType === 'rightTop') {
        size = 裁剪初始size - 鼠标移动x
        left = 裁剪初始left
        top = 裁剪初始Top + 鼠标移动x
    } else if (dotType === 'leftBottom') {
        size = 裁剪初始size + 鼠标移动x
        left = 裁剪初始left - 鼠标移动x
        top = 裁剪初始Top
    } else {
        size = 裁剪初始size - 鼠标移动x
        left = 裁剪初始left
        top = 裁剪初始Top
    }
    if (size <= 10) {
        return
    }
    updateCutImg(size, left, top)
}
// 全局监听mousemove和mouseup事件
const body = document.querySelector('body')
body.addEventListener('mousemove', (e) => {
    if (isImgDown) {
        imgMove(e)
    }
    if (isDotDown) {
        dotMove(e)
    }
})
body.addEventListener('mouseup', (e) => {
    isImgDown = false
    isDotDown = false
    dotType = ''
})
// 个人资料验证规则
const profileSchema = ref({
    nickname: schema.nickname,
    birthday: schema.birthday,
    gender: schema.gender,
    provinceCode: schema.provinceCode,
    cityCode: schema.cityCode,
    countyCode: schema.countyCode,
    profession: schema.profession
})
const profile = ref({})
// 给xtxCity传递的默认地址
const defaultAddress = ref({
    provinceCode: '',
    cityCode: '',
    countyCode: '',
    fullLocation: '',
    provinceName: '',
    cityName: '',
    countyName: ''
})
// 获取个人资料
async function getMemberProfile() {
    const res = await getMemberProfileAPI()
    console.log(res.result)
    store.commit('user/setUser', res.result)
    for (const key in res.result) {
        profile.value[key] = res.result[key]
    }
    // 將返回的地区string转换成数字代码
    const areaArray = res.result.fullLocation.split(' ')
    // console.log(areaArray)
    const 直辖市 = ['北京市', '天津市', '重庆市', '上海市']
    if (直辖市.includes(areaArray[0])) {
        areaArray[0] = areaArray[0].replace('市', '')
    }
    const province = window.cityData.find(
        (province) => province.name === areaArray[0]
    )
    profile.value.provinceCode = province.code
    profile.value.provinceName = province.name
    const city = province.areaList.find((city) => city.name === areaArray[1])
    profile.value.cityCode = city.code
    profile.value.cityName = city.name
    const county = city.areaList.find((county) => county.name === areaArray[2])
    profile.value.countyCode = county.code
    profile.value.countyName = county.name
    console.log(profile.value)
    for (const key in profile.value) {
        if (key in defaultAddress.value) {
            defaultAddress.value[key] = profile.value[key]
        }
    }
    console.log(defaultAddress.value)
    if (res.result.gender === null) {
        res.result.gender = '未知'
    }
}
// 更改地址
function changeAddress(e) {
    console.log(e)
    console.log(window.cityData)
    profile.value.provinceCode = e.provinceCode
    profile.value.cityCode = e.cityCode
    profile.value.countyCode = e.countyCode
}
// 保存个人资料
const formRef = ref(null)
async function saveProfile() {
    const isValid = await formRef.value.validate()
    console.log(isValid)
    if (!isValid) {
        return Message({
            type: 'error',
            text: '个人信息填写有误，请检查'
        })
    }

    try {
        const res = await updateMemberProfileAPI(profile.value)
        console.log(res)
        Message({
            type: 'success',
            text: '更新个人信息成功'
        })
    } catch (e) {
        Message({
            type: 'error',
            text: '更新个人信息失败,请稍后再试'
        })
    }
}
// 点击更新头像
const inputFileRef = ref(null)
async function changeAvatar() {
    console.log(inputFileRef.value)
    inputFileRef.value.click()
    const file = inputFileRef.value.files[0]
    console.log(file)
}
// 选择文件之后
function onSelectImage() {
    if (inputFileRef.value.files.length === 0) {
        return
    }
    // 拿到选择的文件
    const file = inputFileRef.value.files[0]

    const isValid = validateFile(file)
    if (isValid) {
        changeAvatarDialogVisible.value = true
        // onMounted(() => {
        //     bgImg.onload = initCutImg
        // })
        // 文件校验通过，可以上传
        // 执行上传操作
        // 假设您已经获取到了文件对象，命名为file
        const reader = new FileReader()
        // 当读取完成时触发的回调函数
        reader.onload = function (event) {
            imgSrc = event.target.result
            // 在这里可以对文件内容进行处理
            bgImg.src = imgSrc
            cutImg.src = imgSrc
            previewImg.src = imgSrc
            bgImg.onload = initCutImg
        }
        // 开始读取文件
        const res = reader.readAsDataURL(file) // 以文本形式读取文件内容
        console.log(res)
    }
}
// 选择文件之后验证文件
function validateFile(file) {
    // 文件类型验证
    if (!file.type.startsWith('image/')) {
        Message({
            type: 'error',
            text: '请选择图片文件'
        })
        return false
    }
    // 文件大小验证
    if (file.size > 1024 * 1024 * 5) {
        Message({
            type: 'error',
            text: '文件大小不得超过5M'
        })
        return false
    }
    return true
}
</script>

<style lang="less" scoped>
::v-deep .xtx-city .option {
    margin-top: 20px;
}
.xtx-dialog {
    user-select: none;
    .main {
        display: flex;
        height: 500px;
        align-items: center;
        justify-content: space-between;
        .select {
            width: 350px;
            // background-color: pink;
            height: 450px;

            .square-bg {
                width: 350px;
                height: 350px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: yellow;
                .img-container {
                    position: relative;
                    max-width: 350px;
                    max-height: 350px;
                    .bgImg {
                        filter: brightness(0.2);

                        max-width: 350px;
                        max-height: 350px;
                    }

                    .cutImg-operator {
                        width: 100px;
                        height: 100px;
                        position: absolute;
                        top: 0;
                        left: 0;
                        cursor: move;

                        .cutImg-container {
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            overflow: hidden;
                            .cutImg {
                                position: absolute;
                                width: 100%;
                                height: 100%;
                            }
                        }
                        .operator {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            border: 2px dashed #ccc;

                            .dot {
                                position: absolute;
                                width: 30px;
                                height: 30px;
                                border-radius: 50%;
                                &:nth-child(1) {
                                    transform: translate(-50%, -50%);
                                    background-color: red;
                                    cursor: nwse-resize;
                                }
                                &:nth-child(2) {
                                    top: 0;
                                    right: 0;
                                    transform: translate(50%, -50%);
                                    background-color: orange;
                                    cursor: nesw-resize;
                                }
                                &:nth-child(3) {
                                    bottom: 0;
                                    left: 0;
                                    transform: translate(-50%, 50%);
                                    background-color: green;
                                    cursor: nesw-resize;
                                }
                                &:nth-child(4) {
                                    bottom: 0;
                                    right: 0;
                                    transform: translate(50%, 50%);
                                    background-color: purple;
                                    cursor: nwse-resize;
                                }
                            }
                        }
                    }
                }
            }
            .change-avatar {
                height: 100px;
                color: @linkColor;
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        .line {
            width: 1px;
            height: 80%;
            background-color: red;
        }
        .preview {
            width: 150px;
            height: 150px;
            // background-color: pink;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;

            .image {
                width: 100px;
                height: 100px;
                position: relative;
                border-radius: 50%;
                overflow: hidden;
                .previewImg {
                    position: absolute;
                    // border-radius: 50%;
                }
            }

            .info {
                position: absolute;
                bottom: 0;
                color: #ccc;
                font-size: 12px;
                margin-top: 20px;
            }
        }
    }
    .xtx-button {
        margin-left: 20px;
    }
}
.user-container {
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-radius: 5px;
    // box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    .avatar-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 20px 0;
        .avatar-img {
            width: 200px;
            height: 200px;
            border-radius: 50%;
        }
        .change-avatar {
            color: @linkColor;
            margin: 20px;
            cursor: pointer;
            font-size: 12px;
        }

        input[type='file'] {
            display: none;
        }
        .avatar-info {
            color: #ccc;
        }
    }
    select {
        outline: none;
        option {
            appearance: none;

            -moz-appearance: none;

            -webkit-appearance: none;
        }
    }
    .footer {
        margin-top: 50px;
        display: flex;
        justify-content: center;
    }
}
.xtx-form {
    padding: 0;
    input {
        outline: none;
        &::placeholder {
            color: #ccc;
        }
    }
    .xtx-form-item {
        .label {
            // background-color: yellow;
            font-weight: 700;
            .word {
                width: 80px;
                display: inline-block;
                text-align-last: justify;
            }
        }
    }
    ::v-deep .xtx-city .select {
        height: 50px;
        width: 320px;
        display: flex;
        align-items: center;
        justify-content: start;
    }
    ::v-deep .xtx-city .select .value {
        font-size: 14px;
    }
}
</style>
