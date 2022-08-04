import {
	isOpen,
	openDB,
	execSql,
	closeSQLDB
} from '@/utils/sqlite.js'
import {
	getFocusTime
} from '@/utils/util.js'
async function initDatabase() {
	await openDatabase()
	await createTable()
}

async function openDatabase() {
	let open = isOpen();
	if (open == true) {
		await createTable();
	} else {
		await openDB()
		openDatabase()
	}
}
async function createTable() {
	let sql = `
			CREATE TABLE IF NOT EXISTS "event_tbl"(
			  id INTEGER PRIMARY KEY AUTOINCREMENT,
			  name VARCHAR(20) NOT NULL
			);
		`
	let sql2 = `
			CREATE TABLE IF NOT EXISTS "focus_tbl"(
			   id INTEGER PRIMARY KEY AUTOINCREMENT,
			   event_id INT UNSIGNED NOT NULL,
			   focus_time INT UNSIGNED NOT NULL,
			   created_time DATETIME NOT NULL DEFAULT (datetime('now','localtime'))
			);
		`
	await execSql(sql).then(res => {}).catch(err => {});
	await execSql(sql2).then(res => {}).catch(err => {});
}
async function selectEvent() {
	let sql =
		`SELECT e.id,e.name,SUM(f.focus_time) as totalFocusTime,count(f.id) as focusCount FROM event_tbl AS e left JOIN focus_tbl AS f ON e.id = f.event_id and f.created_time>=date('now','start of day') group by e.id`
	let data = null
	await execSql(sql).then(res => {
		data = res
	})
	return data
}

async function insertEvent(eventName) {
	let sql = `insert into event_tbl (name) values ('${eventName}');`
	await execSql(sql)
}
async function deleteEvent(eventId) {
	let sql = `delete from event_tbl where id=${eventId}`
	let sql2 = `delete from focus_tbl where event_id=${eventId}`
	await execSql(sql)
	await execSql(sql2)
}
async function addFocusTime(eventId, time) {
	execSql(`insert into focus_tbl (event_id,focus_time) values (${eventId},'${time}')`)
}

async function queryTotalFocusData() {
	let data = []
	await execSql(`
	select sum(focus_time) as totalFocusTime, sum(totalFocusCount) as totalCount,(sum(focus_time) / count(created_time)) as avgFocusTime from
	(select date(created_time) as created_time, sum(focus_time) as focus_time, count(id) as totalFocusCount 
	from focus_tbl
	group by date(created_time))
	`).then(res => {
		data = res

	})
	return data
}
async function queryDayFocusData(time) {
	let data = []
	await execSql(`
	select count(id) as focusCount,IFNULL(sum(focus_time),0) as focusTime,date(created_time) as today from focus_tbl where created_time between datetime('${time} 00:00:00') and datetime('${time} 23:59:59')
		`).then(res => {
		data = res
	})
	return data
}

async function queryFocusPieData(type, extra) {
	let sql;
	if (type === 'day') {
		sql =
			`select sum(focus_time) as focusTime,e.id,e.name from focus_tbl as f,event_tbl as e where f.event_id = e.id and f.created_time between datetime('${extra} 00:00:00') and datetime('${extra} 23:59:59') group by e.id`
	} else if (type === 'week') {
		sql =
			`select sum(focus_time) as focusTime,e.id,e.name from focus_tbl as f,event_tbl as e where f.event_id = e.id and f.created_time between datetime('${extra[0]} 00:00:00') and  datetime('${extra[1]} 23:59:59') group by e.id`
	} else if (type === 'month') {
		sql =
			`select sum(focus_time) as focusTime,e.id,e.name from focus_tbl as f,event_tbl as e where f.event_id = e.id and f.created_time between datetime('${extra[0]} 00:00:00') and  datetime('${extra[1]} 23:59:59') group by e.id`
	}
	let data = {
		series: [{
			data: [],
			disableLegend: true
		}]
	}
	await execSql(sql).then(res => {
		res.forEach(r => {
			data.series[0].data.push({
				"name": r.name,
				"value": r.focusTime,
				"labelText": getFocusTime(r.focusTime, true)
			})
		})
	})
	return data
}


// execSql(`insert into event_tbl (name) values ('考研英语')`)
// execSql(`
// insert into focus_tbl (focus_time,event_id,created_time) values ('120',6,'2022-07-28 14:02:00')
// `)
// execSql(`delete from focus_tbl where event_id=2`)
// execSql(`
// select * from focus_tbl;

// 		`).then(res => {
// 	console.log(res)
// })

export {
	initDatabase,
	selectEvent,
	insertEvent,
	deleteEvent,
	addFocusTime,
	queryTotalFocusData,
	queryDayFocusData,
	queryFocusPieData
}
