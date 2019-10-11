测试模板:
[:
if (typeof name === 'undefined') {
  Object.assign(this, {
    "name": "名字",
    "sex": "男",
    "age": 18,
    "addr": "广东省广州市三溪地铁站"
  })
}
:]
<h1>欢迎光临, [:=this.name:]</h1>
<p>姓名： [:=this.name:] </p>
<p>年龄： [:=this.age:]</p>
<p>性别： [:=this.sex:]</p>
<p>住止</p>
<p>[:=this.addr:]</p>
