function checkAdmin(role, callback) {
  if (role !== "admin") {
    callback("Access Denied");
  } else {
    callback(null, "Welcome");
  }
}

// 測試兩種狀況
checkAdmin("guest", (err, res) => err ? console.error(err) : console.log(res));
checkAdmin("admin", (err, res) => err ? console.error(err) : console.log(res));