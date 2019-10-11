# tppl模板引擎命令行工具

## 安装&使用

### 安装

**安装到全局:**

```shell
npm i -g js-tppl-cli

```

**安装到当前项目:**

```shell
npm i js-tppl-cli --save

```

### 使用

全局安装的可以请直接运行

项目安装的可以使用`npx`运行

```shell
# 查看帮助
$ npx tppl --help

Usage: js-tppl-cli [options] [command]

Options:
  -V, --version                 output the version number
  -d, --output-dir <dir>        输出文件夹,文件名与模板文件相同，默认为当前目录
  -o, --output-file <file>      输出文件路径及文件名，默认为：当前文件同名的.js文件
  -i, --input-data-file <file>  [可选],输入数据文件路径，将被注入到模板上下文的data属性中
  -l, --enable-log              启用日志输出，默认路径为logs/tppl.log
  -e                            --output-extname <extname>
  -t                            --tpl-extname <extname>
  -h, --help                    output usage information

Commands:
  compile <path>                编译模板，当path为目录时，会自动查找文件
  help [cmd]                    display help for [cmd]

```

## options 文件

配置文件名为`.tpplrc`

**以下为默认配置文件示例：**

```js
{
  // 输出文件扩展名
  "outputExtname": ".js",
  // 模板文件扩展名
  "tplExtname": ".tppl",
  // 是否启用日志，日志文件默认会被输出到 logs/tppl.log
  "enableLog": false
}
```
