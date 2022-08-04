<template>
	<view>
		<u-navbar placeholder title="待办列表" @rightClick="addModalShow=true" leftIcon='' bgColor="inherit"
			:titleStyle="{color:'#000'}">
			<view slot="right">
				<u-icon style="margin-right: 5px;" name="plus" color="#000" size="18">
				</u-icon>
			</view>
		</u-navbar>
		<u-loading-icon class="loading" :show="loading"></u-loading-icon>
		<view class="content" v-show="!loading">
			<view class="card" v-for="event in eventList" :key="event.id" @click="cardClick(event)">
				<u-row>
					<u-col :span="9">
						<h4>{{event.name}}</h4>
						<view style="margin-top: 10px;" class="info">
							今日已专注{{event.focusCount}}次，共{{getFocusTime(event.totalFocusTime,true)}}
							<!-- <u-tag style="flex-direction: inherit;" text="标签" type="error" size="mini"></u-tag> -->
						</view>
					</u-col>
					<u-col :span="3" textAlign="right" class="start_btn">
						<text @click="startEvent(event)">开始</text>
					</u-col>
				</u-row>

			</view>
		</view>
		<u-modal :show="addModalShow" title="添加待办" :negativeTop="40" :closeOnClickOverlay="true"
			@close="addModalShow=false">
			<view>
				<u-input placeholder="请输入待办名称" v-model="eventName" border="bottom"></u-input>
			</view>
			<view slot="confirmButton">
				<u-button :loading="btnLoading" loadingText="保存中" type="primary" shape="circle" @click="addEvent">确定
				</u-button>
			</view>
		</u-modal>
		<u-modal :show="menuShow" :closeOnClickOverlay="true" @close="menuShow=false">
			<view style="text-align: center;">是否 <text
					style="color:red;font-weight: bold;">删除</text>{{currentEvent.name}}?</view>
			<view slot="confirmButton">
				<u-button :loading="btnLoading" loadingText="删除中" type="primary" shape="circle" @click="delEvent">确定
				</u-button>
			</view>
		</u-modal>
		<u-toast ref="uToast"></u-toast>
		<view class="text-center tips-text f-12" @click="update">{{updateStr}}</view>
	</view>
</template>

<script>
	import {
		selectEvent,
		insertEvent,
		deleteEvent
	} from '@/utils/db.js'
	import {
		getFocusTime
	} from '@/utils/util.js'
	export default {
		data() {
			return {
				addModalShow: false,
				eventName: '',
				tabList: [{
					name: '待完成'
				}, {
					name: '已完成'
				}],
				eventList: [],
				loading: true,
				btnLoading: false,
				menuShow: false,
				currentEvent: {},
				getFocusTime: getFocusTime,
				updateStr: '',
				isUpdate: false
			}
		},
		async onLoad() {
			this.eventList = await selectEvent()
			this.loading = false
			this.getUpdate()
		},
		async onShow() {
			this.eventList = await selectEvent()
		},
		methods: {
			cardClick(event) {
				this.currentEvent = event
				this.menuShow = true
			},
			startEvent(event) {
				uni.redirectTo({
					url: `/pages/timer/timer?eventName=${event.name}&eventId=${event.id}`
				})
			},
			async delEvent() {
				this.btnLoading = true
				await deleteEvent(this.currentEvent.id)
				this.eventList = await selectEvent()
				this.menuShow = false
				this.btnLoading = false
			},
			async addEvent() {
				if (!this.eventName) {
					this.$refs.uToast.show({
						type: 'error',
						message: "请输入待办事项",
						position: 'top'
					})
					return
				}
				this.btnLoading = true
				await insertEvent(this.eventName)
				this.eventList = await selectEvent()
				this.eventName = ''
				this.addModalShow = false
				this.btnLoading = false
				this.$refs.uToast.show({
					type: 'success',
					message: "添加成功",
					position: 'top'
				})
			},
			getUpdate() {
				this.updateStr = '当前版本：' + plus.runtime.version
				uni.request({
					url: 'https://api.github.com/repos/Redcker/lemonTODO/releases/latest',
					success: (res) => {
						let currentVersion = res.data['tag_name']
						if (currentVersion > plus.runtime.version) {
							this.isUpdate = true
							this.updateStr = '有新版本啦，点我更新！'
						}
					}
				})
			},
			update() {
				if (this.isUpdate) {
					plus.runtime.openURL('https://jq.qq.com/?_wv=1027&k=7wqdsB20', function(res) {
						console.log(res);
					});
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	::v-deep .u-modal__content {
		display: block;
	}

	::v-deep .u-navbar__content {
		background-color: inherit;
	}

	.content {
		padding: 10px 15px;
	}

	.card {
		box-sizing: border-box;
		margin-bottom: 10px;
		color: #000000d9;
		// font-size: 14px;
		font-variant: tabular-nums;
		line-height: 1.5715;
		list-style: none;
		font-feature-settings: "tnum";
		position: relative;
		// background: ;
		border-radius: 14px;
		padding: 10px 20px;
		background-image: linear-gradient(-225deg, #FFFEFF 0%, #D7FFFE 100%);
	}

	.info {
		color: $u-info;
		font-size: 13px;
	}

	.start_btn {}

	.loading {
		position: absolute;
		top: 50%;
		left: 50%;
		right: 50%;
		transform: translateY(-50%);
	}
</style>
