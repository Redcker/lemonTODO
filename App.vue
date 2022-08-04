<script>
	import {
		initDatabase
	} from '@/utils/db.js'
	export default {
		onLaunch: function() {
			initDatabase()
		},
		onShow: function() {

		},
		onHide: function() {},
		methods: {

		}
	}
</script>

<style lang="scss">
	uni-page-body,
	html,
	body {
		height: 100%;
	}

	page {
		// background: rgb(236, 236, 236);
		background-image: linear-gradient(to top, #accbee 0%, #e7f0fd 100%);

	}
	.f-14 {
		font-size: 14px !important;
	}

	.f-8 {
		font-size: 8px !important;
	}

	.f-10 {
		font-size: 10px !important;
	}

	.f-11 {
		font-size: 11px !important;
	}

	.text-center {
		text-align: center;
	}

	.main-text {
		color: $u-main-color;
	}

	.content-text {
		color: $u-content-color
	}

	.tips-text {
		color: $u-tips-color
	}

	.light-text {
		color: $u-light-color
	}

	.text-white {
		color: #fff !important
	}

	/*每个页面公共css */
	@import "uview-ui/index.scss";
</style>
