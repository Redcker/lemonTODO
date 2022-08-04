<template>
	<view class="bg">
		<u-navbar placeholder title="统计报表" leftIcon='' bgColor="inherit" :titleStyle="{color:'#000'}">
			<view slot="right">
				<view @click="html2canvas.create">
					<u-icon style="margin-right: 5px;" name="share-square" color="#000" size="20">
					</u-icon>
				</view>

			</view>
		</u-navbar>
		<view class="mask">

			<view id="poster" :class="isShare?'poster-class':''">
				<view class="title" v-show="isShare">
					{{shareDateStr}}
				</view>
				<view class="content">
					<view class="total-card" data-html2canvas-ignore>
						<view class="f-14">累计专注</view>
						<u-row class="total-row" justify="space-between">
							<u-col :span="4">
								<view class="text-center">
									次数
								</view>
								<view class="text-center">
									<text class="count">{{totalData.totalCount||0}}</text> <text class="f-8">次</text>
								</view>
							</u-col>
							<u-col :span="4">
								<view class="text-center">时长</view>
								<view class="text-center">
									<text v-if="getFocusTime(totalData.totalFocusTime).hour>0">
										<text class="count">{{getFocusTime(totalData.totalFocusTime).hour}}</text>
										<text class="f-8">小时</text>
									</text>
									<text class="count">{{getFocusTime(totalData.totalFocusTime).minutes}}</text> <text
										class="f-8">分钟</text>
								</view>
							</u-col>
							<u-col :span="4">
								<view class="text-center">日均时长</view>
								<view class="text-center">
									<text v-if="getFocusTime(totalData.avgFocusTime).hour>0">
										<text class="count">{{getFocusTime(totalData.avgFocusTime).hour}}</text>
										<text class="f-8">小时</text>
									</text>
									<text class="count">{{getFocusTime(totalData.avgFocusTime).minutes}}</text> <text
										class="f-8">分钟</text>
								</view>
							</u-col>
						</u-row>
					</view>
					<view class="current-card">
						<view class="f-14">
							<u-row>
								<u-col :span="10">
									<view>
										当日专注
										<!-- <text class="f-11">（{{dayStr}}）</text> -->
									</view>
								</u-col>
								<u-col :span="2">
									<u-row justify="space-between" v-show="!isShare">
										<u-col :span="3">
											<u-icon name="arrow-left" @click="getPreviousDayFocusData"></u-icon>
										</u-col>
										<u-col :span="3">
											<u-icon name="arrow-right" @click="getNextDayFocusData"></u-icon>
										</u-col>
									</u-row>
								</u-col>
							</u-row>
						</view>
						<u-row justify="space-between" class="current-row">
							<u-col :span="3">
								<view class="text-center">
									次数
								</view>
								<view class="text-center">
									<text class="count">{{todayData.focusCount ||0}}</text> <text class="f-8">次</text>
								</view>
							</u-col>
							<u-col :span="3">
								<view class="text-center">时长</view>
								<view class="text-center">
									<text v-if="getFocusTime(todayData.focusTime).hour>0">
										<text class="count">{{getFocusTime(todayData.focusTime).hour}}</text>
										<text class="f-8" v-if="getFocusTime(todayData.focusTime).hour>0">小时</text>
									</text>
									<text class="count">{{getFocusTime(todayData.focusTime).minutes}}</text> <text
										class="f-8">分钟</text>
								</view>
							</u-col>
						</u-row>
					</view>
					<pie :isShare="isShare" />
				</view>
				<view v-show="isShare">
					<view class="text-center">
						柠檬TODO
					</view>
					<view class="tips-text text-center f-11">
						https://github.com/Redcker/lemonTODO
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import pie from '../../component/pie/pie.vue'
	import {
		queryTotalFocusData,
		queryDayFocusData,
		queryDayFocusPieData,
		queryWeekFocusPieData
	} from '@/utils/db.js'
	import {
		getFocusTime,
		getDate
	} from '@/utils/util.js'
	export default {
		data() {
			return {
				getFocusTime: getFocusTime,
				dayStr: '',
				totalData: {},
				todayData: {},
				dateDelta: 0,
				shareDateStr: '',
				isShare: false,
				yyInfo: {}
			};
		},
		components: {
			pie
		},
		async onShow() {
			this.dayStr = getDate(this.dateDelta)
			let month = this.dayStr.split('-')[1][0] == '0' ? this.dayStr.split('-')[1][1] : this.dayStr.split(
				'-')[1]
			let day = this.dayStr.split('-')[2][0] == '0' ? this.dayStr.split('-')[2][1] : this.dayStr.split(
				'-')[2]
			this.shareDateStr = `${this.dayStr.split('-')[0]} 年 ${month} 月 ${day} 日`
			await this.getData()
		},
		methods: {
			async getPreviousDayFocusData() {
				this.dateDelta -= 1
				this.dayStr = getDate(this.dateDelta)
				let month = this.dayStr.split('-')[1][0] == '0' ? this.dayStr.split('-')[1][1] : this.dayStr.split(
					'-')[1]
				this.shareDateStr = month + '1'
				this.todayData = (await queryDayFocusData(this.dayStr))[0]
			},
			async getNextDayFocusData() {
				this.dateDelta += 1
				this.dayStr = getDate(this.dateDelta)
				this.todayData = (await queryDayFocusData(this.dayStr))[0]
			},
			async getData() {
				this.totalData = (await queryTotalFocusData())[0]
				this.todayData = (await queryDayFocusData(this.dayStr))[0]
			},
			renderFinish(opt) {
				uni.hideLoading()
				this.base64 = opt.path
				var bitmap = new plus.nativeObj.Bitmap();
				let that = this
				bitmap.loadBase64Data(opt.path, () => {
					bitmap.save("DCIM/a.jpg", {
						overwrite: true
					}, (i) => {
						uni.hideLoading()
						uni.shareWithSystem({
							provider: "",
							type: 'image',
							summary: '',
							href: 'https://baidu.com',
							imageUrl: i.target,
							success: (res) => {
								this.isShare = false
							},
							fail: (err) => {
								this.isShare = false
							}
						});
					}, function(e) {
						console.log('保存图片失败：' + JSON.stringify(e));
					});
				}, function(e) {
					console.log('绘制图片失败：' + JSON.stringify(e));
				});

			},
			showLoading() {
				this.isShowPoster = true
				this.isShare = true
				this.getYY()
				uni.showLoading({
					title: '分享图片生成中'
				})
			},
			hideLoading() {
				uni.hideLoading()
			},
			getYY() {
				uni.request({
					url: 'https://v1.hitokoto.cn/?encode=json',
					success: (res) => {
						const {
							data
						} = res
						this.yyInfo = data
					}
				})
			}
		}
	};
</script>
<script module="html2canvas" lang="renderjs">
	import html2canvas from 'html2canvas'
	export default {
		methods: {
			create() {
				this.$ownerInstance.callMethod('showLoading', true) // this.$ownerInstance.callMethod用于两个script之间交流
				const timer = setTimeout(async () => {
					try {
						const dom = document.getElementById('poster')
						const canvas = await html2canvas(dom, {
							width: dom.offsetWidth, //设置canvas尺寸与所截图尺寸相同，防止白边
							height: dom.offsetHeight, //防止白边
							logging: true,
							useCORS: true,
							allowTaint: true,
							scale: window.devicePixelRatio,
							dpi: 300
						})
						const base64 = canvas.toDataURL('image/png');
						this.$ownerInstance.callMethod('renderFinish', {
							path: base64
						})
						clearTimeout(timer)
					} catch (e) {
						this.$ownerInstance.callMethod('hideLoading', true)
					}
				}, 200)
			}
		}
	}
</script>
<style scoped lang="scss">
	.bg {
		background-image: linear-gradient(to top, #accbee 0%, #e7f0fd 100%);
		height: 100%;
	}

	::v-deep .u-navbar__content {
		background-color: inherit;
	}

	.card {
		box-sizing: border-box;
		margin-bottom: 10px;
		color: #000000d9;
		font-variant: tabular-nums;
		line-height: 1.5715;
		list-style: none;
		font-feature-settings: "tnum";
		position: relative;
		background: #fff;
		border-radius: 14px;
	}

	.total-card {
		padding: 10px 10px;
		font-size: 13px;
		margin-bottom: 10px;

		.total-row {
			margin: 20px 0 0 0;
			// padding: 0 5px;
		}
	}

	.current-card {
		padding: 10px 10px;
		font-size: 13px;
		margin-bottom: 10px;

		.current-row {
			margin: 20px 0 0 0;
			padding: 0 20px;
		}
	}



	.count {
		font-weight: 600;
		font-size: 23px;
	}

	#poster {
		padding: 0 20px;

		.title {
			margin-bottom: 20px;
			font-size: 20px;
			font-weight: bold;
		}

		.quote {
			text-align: left;
			font-size: 50px;
		}

		.yy {
			text-align: center;
			padding: 0 50px;
		}
	}

	.poster-class {
		background-image: linear-gradient(to top, #accbee 0%, #e7f0fd 100%);
		padding: 20px !important;
	}
</style>
