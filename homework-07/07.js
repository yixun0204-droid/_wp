function fakeGet(sql, params, callback) {
  callback(null, { title: "Fake Title" });
}
fakeGet("SELECT * FROM posts", [], (err, result) => {
  console.log(result.title);
});