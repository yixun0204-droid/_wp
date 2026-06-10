function fetchData(id, callback) {
  const data = { id: id, status: "success" };
  callback(null, data); // Error 為 null，資料為 data
}
fetchData(1, (err, data) => console.log(data));