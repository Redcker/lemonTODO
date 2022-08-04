function getFocusTime(time, flag = false) {
	if (!time) {
		time = 0
	}
	if (time <= 60) {
		if (!flag) {
			return {
				hour: 0,
				minutes: time
			}
		} else {
			return `${time}分钟`
		}
	}
	let hour = Math.floor(time / 60)
	let minutes = time - hour * 60
	if (!flag) {
		return {
			hour: hour,
			minutes: minutes
		}
	} else {
		return `${hour}小时${minutes}分钟`
	}
}

function getDate(delta = 0, time = null) {
	let dd = time ? time : new Date();
	dd.setDate(dd.getDate() + delta); //获取AddDayCount天后的日期
	let y = dd.getFullYear();
	let m = dd.getMonth() + 1; //获取当前月份的日期
	let d = dd.getDate();
	return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
}

function getWeek(time = null) {
	//起止日期数组
	let startStop = new Array();
	//获取当前时间
	let currentDate = time ? new Date(time) : new Date();
	//返回date是一周中的某一天
	let week = currentDate.getDay();
	//返回date是一个月中的某一天
	let month = currentDate.getDate();

	//一天的毫秒数
	let millisecond = 1000 * 60 * 60 * 24;
	//减去的天数
	let minusDay = week != 0 ? week - 1 : 6;
	//alert(minusDay);
	//本周 周一
	let monday = new Date(currentDate.getTime() - (minusDay * millisecond));
	//本周 周日
	let sunday = new Date(monday.getTime() + (6 * millisecond));
	//添加本周时间
	startStop.push(getDate(0, monday)); //本周起始时间
	//添加本周最后一天时间
	startStop.push(getDate(0, sunday)); //本周终止时间
	//返回
	return startStop
}

function getMonth(time = null) {
	//起止日期数组
	let startStop = new Array();
	//获取当前时间
	let currentDate = time ? new Date(time) : new Date();
	//获得当前月份0-11
	let currentMonth = currentDate.getMonth();
	//获得当前年份4位年
	let currentYear = currentDate.getFullYear();
	//求出本月第一天
	let firstDay = new Date(currentYear, currentMonth, 1);


	//当为12月的时候年份需要加1
	//月份需要更新为0 也就是下一年的第一个月
	if (currentMonth == 11) {
		currentYear++;
		currentMonth = 0; //就为
	} else {
		//否则只是月份增加,以便求的下一月的第一天
		currentMonth++;
	}


	//一天的毫秒数
	let millisecond = 1000 * 60 * 60 * 24;
	//下月的第一天
	let nextMonthDayOne = new Date(currentYear, currentMonth, 1);
	//求出上月的最后一天
	let lastDay = new Date(nextMonthDayOne.getTime() - millisecond);

	//添加至数组中返回
	startStop.push(getDate(0, firstDay));
	startStop.push(getDate(0, lastDay));
	//返回
	console.log(startStop)
	return startStop;
}
export {
	getFocusTime,
	getDate,
	getWeek,
	getMonth
}
