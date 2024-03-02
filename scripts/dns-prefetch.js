const urlRegex = require('url-regex')
const fs = require('fs')
// const path = require('path')
const { parse } = require('node-html-parser')
const { glob } = require('glob')
const urlPattern = /(https?:\/\/[^/]*)/
const urls = new Set()

// 遍历dist目录中的所有HTML,js,css文件
async function searchDomain() {
    const files = await glob('dist/**/*.{html,js,css}')
    for (const file of files) {
        const source = fs.readFileSync(file, 'utf8')
        const matches = source.match(urlRegex({ strict: true }))
        if (matches) {
            matches.forEach(url => {
                const match = url.match(urlPattern)
                if (match && match[1]) {
                    urls.add(match[1])
                }
            })
        }
    }
    console.log(urls)
}
// 将所有网址变成link插入到html的head中
async function insertLinks() {
    const files = await glob('./dist/**/*.html')
    const links = [...urls].map(url => `<link ref="dns-prefetch" href="${url}" />`).join('\n')
    for (const file of files) {
        const html = fs.readFileSync(file, 'utf8')
        const root = parse(html)
        const head = root.querySelector('head')
        console.log(head)
        head.insertAdjacentHTML('afterbegin', links)
        fs.writeFileSync(file, root.toString())
    }
}
async function main() {
    await searchDomain()
    await insertLinks()
}
main()
