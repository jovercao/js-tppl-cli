const { Command } = require('commander')
const _ = require('lodash')
const program = new Command()
const pkgInfo = require('./package.json')
const nodePath = require('path')
const fs = require('fs')
const Logger = require('./src/logger')
const executor = require('./src/renderer')
const defaultOptions = require('./src/options/default.json')

program.version(pkgInfo.version)

const RCFileName = '.tpplrc'

program.command('compile <path>', '编译模板，当path为目录时，会自动查找文件', { isDefault: true })
  .option('-d, --output-dir <dir>', '输出文件夹,文件名与模板文件相同，默认为当前目录')
  .option('-o, --output-file <file>', '输出文件路径及文件名，默认为：当前文件同名的.js文件')
  .option('-i, --input-data-file <file>', '[可选],输入数据文件路径，将被注入到模板上下文的data属性中')
  .option('-l, --enable-log', '启用日志输出，默认路径为logs/tppl.log')
  .option('-e', '--output-extname <extname>', '默认输出文扩展名，默认为：.js')
  .option('-t', '--tpl-extname <extname>', '默认模板文件扩展名，自动查找的扩展名，默认为：.tppl')
  .action((path, options) => {
    const mode = fs.statSync(path).isFile() ? 'file' : 'dir'

    if (!path) {
      path = process.cwd()
    }

    const cwdOptionsPath = nodePath.resolve(process.cwd(), RCFileName)
    let cwdOptions = {}
    if (fs.existsSync(cwdOptionsPath)) {
      cwdOptions = require(cwdOptionsPath)
    }

    const userOptionsPath = nodePath.resolve('~', RCFileName)
    let userOptions = {}
    if (fs.existsSync(userOptionsPath)) {
      userOptions = require(userOptionsPath)
    }

    let dirRcOptions = {}
    if (mode === 'dir') {
      const dirRcOptionPath = nodePath.resolve(process.cwd(), path, RCFileName)
      if (fs.existsSync(dirRcOptionPath)) {
        dirRcOptions = require(dirRcOptionPath)
      }
    }

    // 配置选项，命令参数 > 输入路径 > Cwd当前路径 > ~用户目录 > 默认配置
    options = _.defaults(options, dirRcOptions, cwdOptions, userOptions, defaultOptions)
    const logger = Logger({ enabled: options.enableLog, logPath: 'logs/tpl.log' })

    if (!path) {
      path = './'
    }
    path = nodePath.resolve(process.cwd(), path)

    if (!fs.existsSync(path)) {
      logger.error(`路径${path}不存在！`)
      return
    }

    switch (mode) {
      case 'file':
        if (options.outputDir && options.outputFile) {
          logger.warn('当--output-dir与--output-file同时指定时，--output-dir不生效')
        }
        executor.renderFile(path, options)
        break
      case 'dir':
        if (options.inputDataFile) {
          logger.warn('当[path]指定为路径时，--input-data-file 无效')
        }
        if (options.outputFile) {
          logger.warn('当[path]指定为路径时，--output-file 无效')
        }
        executor.renderDir(path, options)
        break
    }
  })

program.parse(process.argv)
