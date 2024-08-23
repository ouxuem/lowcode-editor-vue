export default [
  {
    url: "/api/data", // 请求地址
    method: "get", // 请求方式
    response: () => {
       return [
        { name: '小明', sex: '男', birthday: new Date('1994-07-07').getTime() },
        { name: '东东', sex: '男', birthday: new Date('1995-06-06').getTime() },
        { name: '小红', sex: '女', birthday: new Date('1996-08-08').getTime() }
      ]
    }
  },
]
