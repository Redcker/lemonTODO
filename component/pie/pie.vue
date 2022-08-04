<template>
	<view class=" pie-card">
		<u-row class="f-14">
			<u-col :span="10">
				<view>专注时长分布<text class="f-11">（{{timeStr}}）</text></view>
			</u-col>
			<u-col :span="2">
				<u-row justify="space-between" v-show="!isShare">
					<u-col :span="3">
						<u-icon name="arrow-left" @click="getPreviousFocusData"></u-icon>
					</u-col>
					<u-col :span="3">
						<u-icon name="arrow-right" @click="getNextFocusData"></u-icon>
					</u-col>
				</u-row>
			</u-col>
		</u-row>
		<view class="pie-subsection f-14">
			<view v-for='i in [0,1,2]' :key="i" style="display: inline-block;">
				<u-button size="mini" @click="sectionChange(i)" :type="typeArr[i]">
					{{['日','周','月'][i]}}
				</u-button>
			</view>
		</view>
		<view class="charts-box">
			<qiun-data-charts type="ring" :opts="opts" :chartData="data" />
		</view>
	</view>
</template>

<script>
	import {
		queryFocusPieData
	} from '@/utils/db.js'
	import {
		getFocusTime,
		getDate,
		getWeek,
		getMonth
	} from '@/utils/util.js'
	export default {
		props: {
			isShare: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				typeArr: ['primary', 'info', 'info'],
				list: ['日', '周', '月'],
				current: 0,
				data: {},
				timeDelta: 0,
				timeStr: '',
				currentMonthArr: [],
				opts: {
					rotate: false,
					rotateLock: false,
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					fontSize: 12,
					padding: [10, 40, 10, 40],
					dataLabel: true,
					legend: {
						show: true,
						position: "bottom",
						lineHeight: 25
					},
					title: {
						name: "总专注时长",
						fontSize: 13,
						color: "#666666"
					},
					subtitle: {
						name: "0小时0分",
						fontSize: 12,
						color: "#7cb5ec"
					},
					extra: {
						ring: {
							customRadius: 80,
							ringWidth: 20,
							activeOpacity: 0.5,
							activeRadius: 5,
							offsetAngle: 0,
							labelWidth: 15,
							border: true,
							borderWidth: 2,
							borderColor: "#FFFFFF",
							linearType: "custom",
						}
					}
				}
			}
		},
		mounted() {
			this.handleData('day', getDate(this.timeDelta))
		},
		methods: {
			async getPreviousFocusData() {
				if (this.current === 0) {
					this.timeDelta -= 1
					this.handleData('day', getDate(this.timeDelta))
				} else if (this.current === 1) {
					this.timeDelta -= 7
					let lastWeekDay = getDate(this.timeDelta, new Date(getWeek()[0]))
					this.handleData('week', getWeek(lastWeekDay))
				} else if (this.current === 2) {
					let lastMonthDay = getDate(-1, new Date(this.currentMonthArr[0]))
					this.currentMonthArr = getMonth(lastMonthDay)
					this.handleData('month', this.currentMonthArr)
				}
			},
			async getNextFocusData() {
				if (this.current === 0) {
					this.timeDelta += 1
					this.handleData('day', getDate(this.timeDelta))
				} else if (this.current === 1) {
					this.timeDelta += 7
					let lastWeekDay = getDate(this.timeDelta, new Date(getWeek()[0]))
					this.handleData('week', getWeek(lastWeekDay))
				} else if (this.current === 2) {
					let lastMonthDay = getDate(1, new Date(this.currentMonthArr[1]))
					this.currentMonthArr = getMonth(lastMonthDay)
					this.handleData('month', this.currentMonthArr)
				}
			},
			async sectionChange(index) {
				if (index === 0) {
					this.typeArr = ['primary', 'info', 'info']
					this.timeDelta = 0
					this.handleData('day', getDate(this.timeDelta))
				} else if (index === 1) {
					this.typeArr = ['info', 'primary', 'info']
					this.timeDelta = 0
					this.handleData('week', getWeek())
				} else if (index === 2) {
					this.typeArr = ['info', 'info', 'primary']
					this.timeDelta = 0
					this.currentMonthArr = getMonth()
					this.handleData('month', this.currentMonthArr)
				}
				this.current = index;
			},
			async handleData(type, extra) {
				if (type === 'day') {
					this.timeStr = extra
				} else if (type === 'week') {
					this.timeStr = `${extra[0]} - ${extra[1]}`
				} else if (type === 'month') {
					this.timeStr = `${extra[0]} - ${extra[1]}`
				}
				let pieData = await queryFocusPieData(type, extra)
				let time = 0
				this.data = pieData
				pieData.series[0].data.forEach(d => {
					time += d.value
				})
				let timeData = getFocusTime(time)
				if (timeData.hour == 0) {
					this.opts.subtitle.name = `${timeData.minutes}分钟`
				} else {
					this.opts.subtitle.name = `${timeData.hour}小时${timeData.minutes}分钟`
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.charts-box {
		width: 100%;
		height: 300px;
	}

	.pie-card {
		padding: 10px 10px;
		font-size: 13px;

		.pie-subsection {
			text-align: center;
			margin: 20px 0 0
		}

	}
</style>
