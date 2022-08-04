<template>
	<view style="height: 100%;">
		<view v-if="loading">
			<u-loading-page :loading="loading" loading-text="努力初始化中..." fontSize="17" image="/static/logo.png"
				icon-size="50"></u-loading-page>
		</view>
		<view style="height: 100%;">
			<view class="bg" :style="{background:`url('${bgUrl}')`,height: '100%',
		backgroundSize: '100% 100%',
		backgroundPosition: '50% 50%',
		backgroundRepeat: 'no-repeat'}">
			</view>
			<u-transition :show="show">
				<view class="audio">
					<u-icon v-if="isAudio" name="volume-fill" size="20" color="#fff" @click="audioControl"></u-icon>
					<u-icon v-else name="volume-off-fill" size="20" color="#fff" @click="audioControl"></u-icon>
				</view>
				<view class="content">
					<view class="quote">
						“
					</view>
					<view class="yy">
						{{yyInfo.hitokoto}}
					</view>
					<view class="timer">
						{{ti}}
					</view>
					<view class="event-area">
						<view class="name">
							{{event.eventName}}
						</view>
						<view class="status">
							{{isStart?'进行中':'暂停中'}}
						</view>
					</view>
					<view class="btn">
						<u-icon @click="begin" v-show="!isStart" name="play-right-fill" size="35" color="#fff"
							style="flex-direction: column;">
						</u-icon>
						<view @click="pause" @longpress="finishModalShow=true" class="finish">
							<u-icon v-show="isStart" name="pause" size="35" color="#fff"
								style="flex-direction: column;">
							</u-icon>
						</view>
					</view>
				</view>
			</u-transition>
			<u-modal :show="finishModalShow"
				:content="`本次已专注${hour?hour +'小时':''}${minutes}分钟,确定结束专注？${(hour<1&&minutes<5)?'（少于5分钟将不计入专注时间）':''}`"
				@cancel="finishModalShow=false" @confirm="quit" :show-cancel-button="true" :asyncClose="true">
			</u-modal>
		</view>
	</view>
</template>

<script>
	import {
		addFocusTime
	} from '../../utils/db.js'
	const bgImgArr = [
		'https://p.qlogo.cn/hy_personal/3e28f14aa0516842180b570aee5d3042e3201c89d74f564be27da57cd757468a/0.jpg',
		'https://p.qlogo.cn/hy_personal/3e28f14aa0516842180b570aee5d3042e8573be4fc111c983b3b42807a6370f0/0.jpg',
		'https://p.qlogo.cn/hy_personal/3e28f14aa0516842180b570aee5d3042bb0b0cd0239971afe93fd54ff267f11f/0.jpg',
		'https://p.qlogo.cn/hy_personal/3e28f14aa0516842180b570aee5d304299d96a7706788ea253cdd6c75506b879/0.jpg',
		'https://p.qlogo.cn/hy_personal/3e28f14aa0516842180b570aee5d304290e0a05b698b9e9173809a4878b0551f/0.jpg',
		'https://p.qlogo.cn/hy_personal/3e28f14aa0516842180b570aee5d3042bc412e72a2c1f875f000f0737e0ca959/0.jpg',
		'https://p.qlogo.cn/hy_personal/3e28f14aa0516842180b570aee5d3042f0576d558546a2107089aa2099441262/0.jpg',
		'https://p.qlogo.cn/hy_personal/3e28f14aa0516842180b570aee5d30421ed92fcb1499f6bc3939ab9ae5dadd93/0.jpg',
		'https://p.qlogo.cn/hy_personal/3e28f14aa0516842180b570aee5d3042fd1aa50a929d916aafd6c212a11e4be1/0.jpg',
		'https://p.qlogo.cn/hy_personal/3e28f14aa0516842180b570aee5d30422e36371dd3d649f275317fdea1eade1e/0.png',
		'https://p.qlogo.cn/hy_personal/3e28f14aa0516842180b570aee5d30420039d125e52c0894b0cb4dc8b9b37a82/0.jpg'
	]
	export default {
		data() {
			return {
				ti: '00:00:00',
				timer: null,
				isStart: true,
				event: {},
				hour: 0,
				minutes: 0,
				seconds: 0,
				finishModalShow: false,
				yyInfo: {
					hitokoto: '',
					from: ''
				},
				show: false,
				audio: null,
				isAudio: false,
				bgUrl: '',
				loading: true
			};
		},
		onLoad(option) {
			this.bgUrl = bgImgArr[Math.floor(Math.random() * 11)]
			setTimeout(() => {
				this.loading = false
				this.show = true
			}, 1000)
			this.event = {
				eventName: option.eventName,
				eventId: option.eventId
			}
			this.getYY()
			this.timer = setInterval(this.startTimer, 1000);
		},
		methods: {
			audioControl() {
				this.isAudio = !this.isAudio
				if (this.isAudio) {
					this.playAudio()
				} else {
					this.audio.pause()
				}
			},
			playAudio() {
				this.audio = uni.createInnerAudioContext();
				this.audio.autoplay = true;
				this.audio.src = '../../static/ticking.mp3';
				this.audio.loop = true
				this.audio.onPlay(() => {});
				this.audio.onError((res) => {});
			},
			begin() {
				this.isStart = !this.isStart
				this.timer = setInterval(this.startTimer, 1000);
				if (this.isAudio) {
					this.audio.play()
				}
			},
			startTimer() {
				this.seconds += 1;
				if (this.seconds >= 60) {
					this.seconds = 0;
					this.minutes = this.minutes + 1;
				}

				if (this.minutes >= 60) {
					this.minutes = 0;
					this.hour = this.hour + 1;
				}
				this.ti = (this.hour < 10 ? '0' + this.hour : this.hour) + ':' + (this.minutes < 10 ? '0' + this.minutes :
					this.minutes) + ':' + (this.seconds < 10 ? '0' + this.seconds : this.seconds);
			},
			// 暂停倒计时
			pause() {
				if (this.timer) {
					clearInterval(this.timer);
					this.isStart = !this.isStart
					if (this.isAudio) {
						this.audio.pause()
					}
				}
			},
			async quit() {
				if (this.hour >= 1 || this.minutes >= 5) {
					let time = this.hour * 60 + this.minutes
					await addFocusTime(this.event.eventId, time)
				}
				clearInterval(this.timer);
				if (this.audio) {
					this.audio.destroy()
				}
				uni.switchTab({
					url: '/pages/index/index'
				})
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
		},
	}
</script>

<style lang="scss">
	.bg {}

	.audio {
		position: absolute;
		top: 50px;
		right: 30px;
	}


	.content {
		position: absolute;
		top: 10%;
		color: #fff;
		font-size: 18px;
		text-align: center;
		z-index: 1;
		width: 100%;

		.quote {
			text-align: left;
			font-size: 50px;
		}

		.yy {
			text-align: center;
			padding: 0 50px;
		}

		.timer {
			font-size: 35px;
			font-weight: bold;
			text-align: center;
			position: fixed;
			top: 50%;
			width: 100%;
			transform: translateY(-50%);
		}

		.finish {
			margin: 0 auto;
			width: fit-content;
		}

		.event-area {
			text-align: center;
			position: fixed;
			bottom: 30%;
			width: 100%;

			.name {
				font-size: 15px;
				font-weight: bold;
				margin-bottom: 10px;
			}

			.status {
				font-size: 13px;
			}
		}

		.btn {
			text-align: center;
			position: fixed;
			bottom: 10%;
			width: 100%;
		}
	}
</style>
