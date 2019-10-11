const path = require('path')
const mkdirp = require('mkdirp')
const fs = require('fs')
const getLogger = require('./logger')
const tppl = require('js-tppl')

/**
 * 渲染文件
 * @param {*} tplFile 模板文件
 * @param {*} param1 选项
 */
function renderFile (tplFile, { inputDataFile, outputFile, outputDir, outputExtname }) {
  const extname = path.extname(tplFile)

  // 默认输出路径为同名的js文件
  outputFile = outputFile ||
    (outputDir && path.join(outputDir, path.basename(tplFile).substring(0, extname.length))) ||
    tplFile.substring(0, tplFile.length - extname.length) + outputExtname

  const logger = getLogger()

  outputFile = path.resolve(process.cwd(), outputFile)

  const dir = path.dirname(outputFile)
  tplFile = path.resolve(process.cwd(), tplFile)

  // 创建目录
  if (!fs.existsSync(dir)) {
    mkdirp.sync(dir)
  }

  let data = {}
  if (inputDataFile) {
    inputDataFile = path.resolve(process.cwd(), inputDataFile)
    if (path.extname(inputDataFile).toLowerCase() !== '.json') {
      logger.error('--input-data-file 必须是json格式')
      return
    }
    if (!fs.existsSync(inputDataFile)) {
      logger.error(`--input-data-file 指定的数据文件${inputDataFile}不存在！`)
      return
    }
    const json = fs.readFileSync(inputDataFile).toString()
    data = JSON.parse(json)
  }
  const tpl = fs.readFileSync(tplFile).toString()
  const output = tppl(tpl, data)
  fs.writeFileSync(outputFile, output, { encoding: 'utf-8' })
}

/**
 * 渲染整个目录
 * @param {*} dirPath 目录
 * @param {*} param1 选项
 */
function renderDir (dirPath, { outputDir, tplExtname, outputExtname }) {
  const list = findTppl(dirPath, tplExtname)
  list.forEach(tplFile => {
    // 输出到相对路径
    const outputFile = path.join(outputDir, tplFile.substring(0, tplFile.length - tplExtname.length).substring(dirPath.length) + outputExtname)
    renderFile(tplFile, { outputFile })
  })
}

function findTppl (dirPath, extname, list) {
  if (!list) {
    list = []
  }
  fs.readdirSync(dirPath).forEach(name => {
    const filePath = path.join(dirPath, name)
    if (fs.statSync(filePath).isDirectory()) {
      findTppl(filePath, list)
      return
    }
    if (filePath.endsWith(extname)) {
      list.push(filePath)
    }
  })

  return list
}

module.exports = {
  renderFile,
  renderDir
}
