//监听数据库是否开启
 
let dbname="orangetodo";
 
let path="_doc/orangetodo.db";
function isOpen() {
	//数据库打开了就返回true,否则返回false
	
	let open = plus.sqlite.isOpenDatabase({
		name: dbname,
		path: path,
	})
	return open;
}
 
// 打开数据库
function openDB(){
	return new Promise((resolve, reject) => {
		plus.sqlite.openDatabase({
			name: dbname,
			path: path,
			success(e) {
				resolve(e);
			},
			fail(e) {
				reject(e);
			}
		})
	})
}
 
//查询获取数据库里的数据
function execSql(sql) {
	return new Promise((resolve, reject) => {
			plus.sqlite.selectSql({
			name: dbname,
			sql: sql,
			success(e) {
				resolve(e);
			},
			fail(e) {
				reject(e);
			}
		})
	})
}
//关闭数据库
function closeSQLDB() {
	return new Promise((resolve, reject) => {
		plus.sqlite.closeDatabase({
			name: dbname,
			success(e) {
				resolve(e);
			},
			fail(e) {
				reject(e);
			}
		})
	})
}
export {
	isOpen,
	openDB,
	execSql,
	closeSQLDB
}