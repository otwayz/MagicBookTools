Vue.component('input-item', {
    props: {
        id: Number,
        type: String,
        tag: String,
        text: String,
        tip: String
    },

    computed: {
        rgba: function () {
            var i;
            var hex = this.text
            if (hex.length === 3) {
                var hexExpanded = '';
                for (i = 0; i < 3; i++) {
                    hexExpanded += hex[i] + hex[i];
                }
                hex = hexExpanded;
            }

            var hasAlpha = (hex.length === 8) ? true : false;

            if (hasAlpha) {
                hex = hex.substr(2, 8) + hex.substr(0, 2);
            } else {
                hex += "FF";
            }
            return hex;
        },
        visible: function () {
            return this.type === "color"
        },
    },

    template: '<div class="block-container">{{ id }}. {{ tip}} &nbsp;<input type="text" :value="text" v-on:input="$emit(\'input\', $event.target.value)"><div v-if="visible" class="block" :style="`background-color: #${rgba}`"></div></div>'
})

var app = new Vue({
    el: '#app',
    methods: {
        json2xml() {
            var xmlStr = "<theme>"

            for (themeKey in this.theme) {
                if (themeKey === 'read_page') {
                    xmlStr += this.parseReadPage()
                } else {
                    var reg = /^[0-9a-fA-F]{8}$/
                    xmlStr += "<" + themeKey + ">"
                    this.theme[themeKey].forEach(element => {
                        if(element.type === 'color'){
                            if(!reg.test(element.text)){
                                var tip = element.text + ' 为无效色值 ！请使用8位有效色值 ~'
                                if(element.text.length === 0){
                                    tip = '请填写所有空白输入框 ~'
                                }
                                alert(tip)
                                throw 'invalid color'
                            }
                        }
                        xmlStr += "<!--" + element.tip + "-->"
                        xmlStr += "<" + element.tag + ">" + element.text + "</" + element.tag + ">"
                    });
                    xmlStr += "</" + themeKey + ">"
                }
            }
            xmlStr += "</theme>"
            // console.log(xmlStr)

            // var format = require('xml-formatter');
            // var formattedXml = format(xmlStr);
            // console.log(formattedXml);

            this.downloadFile("theme.xml", xmlStr)
        },

        downloadFile(fileName, content) {
            var aTag = document.createElement('a');
            var blob = new Blob([content]);
            aTag.download = fileName;
            aTag.href = URL.createObjectURL(blob);
            aTag.click();
            URL.revokeObjectURL(blob);
        },

        parseReadPage() {
            var reg = /^[0-9a-fA-F]{8}$/
            var str = ""
            str += "<read_page>"
            for (readPageItemKey in this.theme.read_page) {
                str += "<" + readPageItemKey + ">"
                var items = this.theme.read_page[readPageItemKey]
                items.forEach(element => {
                    if(element.type === 'color'){
                        if(!reg.test(element.text)){
                            var tip = element.text + ' 为无效色值 ！请使用8位有效色值 ~'
                                if(element.text.length === 0){
                                    tip = '请填写所有空白输入框 ~'
                                }
                                alert(tip)
                            throw 'invalid color'
                        }
                    }
                    str += "<!--" + element.tip + "-->"
                    str += "<" + element.tag + ">" + element.text + "</" + element.tag + ">"
                })
                str += "</" + readPageItemKey + ">"
            }
            str += "</read_page>"
            return str
        },

        hex2Rgba() {
            var i;
            var hex = this.text
            if (hex.length === 3) {
                var hexExpanded = '';
                for (i = 0; i < 3; i++) {
                    hexExpanded += hex[i] + hex[i];
                }
                hex = hexExpanded;
            }

            var hasAlpha = (hex.length === 8) ? true : false;

            if (hasAlpha) {
                hex = hex.substr(2, 8) + hex.substr(0, 2);
            } else {
                hex += "FF";
            }
            return "#" + hex;
        },

        importFile() {
            var selectedFile = document.getElementById("files").files[0]; //获取读取的File对象
            var name = selectedFile.name; //读取选中文件的文件名
            var size = selectedFile.size; //读取选中文件的大小

            var reader = new FileReader(); //这里是核心！！！读取操作就是由它完成的。
            reader.readAsText(selectedFile); //读取文件的内容('xml-formatter');
            var that = this
            reader.onload = function () {
                // console.log(this.result); //当读取完成之后会回调这个函数，然后此时文件的内容存储到了result中。直接操作即可。
                var xmlDoc = that.xmlParser(this.result)
                that.fillData(xmlDoc)
            };
        },

        xmlParser(xmlString) {
            var xmlDoc = null;
            //判断浏览器的类型
            //支持IE浏览器 
            if (!window.DOMParser && window.ActiveXObject) { //window.DOMParser 判断是否是非ie浏览器
                var xmlDomVersions = ['MSXML.2.DOMDocument.6.0', 'MSXML.2.DOMDocument.3.0', 'Microsoft.XMLDOM'];
                for (var i = 0; i < xmlDomVersions.length; i++) {
                    try {
                        xmlDoc = new ActiveXObject(xmlDomVersions[i]);
                        xmlDoc.async = false;
                        xmlDoc.loadXML(xmlString); //loadXML方法载入xml字符串
                        break;
                    } catch (e) {}
                }
            }
            //支持Mozilla浏览器
            else if (window.DOMParser && document.implementation && document.implementation.createDocument) {
                try {
                    /* DOMParser 对象解析 XML 文本并返回一个 XML Document 对象。
                     * 要使用 DOMParser，使用不带参数的构造函数来实例化它，然后调用其 parseFromString() 方法
                     * parseFromString(text, contentType) 参数text:要解析的 XML 标记 参数contentType文本的内容类型
                     * 可能是 "text/xml" 、"application/xml" 或 "application/xhtml+xml" 中的一个。注意，不支持 "text/html"。
                     */
                    domParser = new DOMParser();
                    xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
                } catch (e) {
                    console.log(e);
                }
            } else {
                return null;
            }

            return xmlDoc;
        },

        // 解析选中 xml 文件 填充到 data 数据中
        fillData(xmlDoc) {
            for (themeKey in this.theme) {
                if (themeKey === 'read_page') {
                    var read_page_child = xmlDoc.getElementsByTagName("read_page")[0].childNodes
                    // console.log(read_page_child);
                    const length = read_page_child.length
                    for (let index = 0; index < length; index++) {
                        const element = read_page_child[index];
                        // console.log(element.nodeName)
                        // var items = this.theme.read_page[element.nodeName]
                        // console.log(element.childNodes)
                        if (element.nodeType === 3 || element.nodeType === 8) { //过滤注释
                            continue
                        }

                        const nodeName = element.nodeName;
                        const childNodes = element.childNodes
                        var items = this.theme.read_page[nodeName]
                        items.forEach(item => {
                            for (let index = 0; index < childNodes.length; index++) {
                                const element2 = childNodes[index];
                                const childNodeName = element2.nodeName
                                if (element2.nodeType === 3 || element2.nodeType === 8) { //过滤注释
                                    continue
                                }
                                if (item.tag === childNodeName) {
                                    item.text = element2.childNodes[0].nodeValue
                                }
                            }
                        })
                    }
                } else {
                    this.theme[themeKey].forEach(element => {
                        var childItems = xmlDoc.getElementsByTagName(themeKey)[0].childNodes;
                        childItems.forEach(item => {
                            if (item.nodeType === 3 || item.nodeType === 8) {
                                return
                            }
                            if (element.tag === item.nodeName) {
                                element.text = item.childNodes[0].nodeValue
                            }
                        })
                    });
                }
            }
        },
    },
    data: {
        theme: {
            read_page: {
                toolbar: [{
                        id: 1,
                        type: 'color',
                        tag: 'bg_color',
                        text: '',
                        tip: '阅读工具栏背景色'
                    },
                    {
                        id: 2,
                        type: 'color',
                        tag: 'icon_color',
                        text: '',
                        tip: '阅读工具栏图标颜色'
                    },
                    {
                        id: 3,
                        type: 'color',
                        tag: 'dividing_line_color',
                        text: '',
                        tip: '阅读工具栏分割线颜色'
                    },
                    {
                        id: 4,
                        type: 'color',
                        tag: 'text_color',
                        text: '',
                        tip: '阅读工具栏字体颜色'
                    },
                    {
                        id: 5,
                        type: 'color',
                        tag: 'menu_textsize_selected_bg_color',
                        text: '',
                        tip: '阅读工具栏当前字体大小设置背景色'
                    },
                    {
                        id: 6,
                        type: 'color',
                        tag: 'menu_search_hint_text_color',
                        text: '',
                        tip: '阅读工具栏搜索提示文案意思'
                    },
                ],
                catalog: [{
                        id: 7,
                        type: 'image',
                        tag: 'bg_image',
                        text: 'xxx.png',
                        tip: '目录背景图'
                    },
                    {
                        id: 8,
                        type: 'color',
                        tag: 'text_color',
                        text: '',
                        tip: '目录常规字体颜色'
                    },
                    {
                        id: 11,
                        type: 'color',
                        tag: 'catalog_item_selected_bg_color',
                        text: '',
                        tip: '目录被选中背景颜色'
                    },
                    {
                        id: 12,
                        type: 'color',
                        tag: 'catalog_item_finished_icon_color',
                        text: '',
                        tip: '目录完成图标颜色'
                    },
                    {
                        id: 13,
                        type: 'color',
                        tag: 'author_text_color',
                        text: '',
                        tip: '目录作者字体颜色'
                    },
                    {
                        id: 14,
                        type: 'color',
                        tag: 'catalog_item_locked_icon_color',
                        text: '',
                        tip: '未解锁目录图标颜色'
                    },
                    {
                        id: 15,
                        type: 'color',
                        tag: 'catalog_item_locked_text_color',
                        text: '',
                        tip: '未解锁目录字体颜色'
                    },
                    {
                        id: 16,
                        type: 'color',
                        tag: 'catalog_item_selected_text_color',
                        text: '',
                        tip: '目录被选中字体颜色'
                    },
                    {
                        id: 17,
                        type: 'color',
                        tag: 'catalog_item_length_text_color',
                        text: '',
                        tip: '目录章节字数字体颜色'
                    }
                ],
                body: [{
                        id: 1,
                        type: 'image',
                        tag: 'bg_image',
                        text: 'xxx.png',
                        tip: '阅读背景图'
                    },
                    {
                        id: 2,
                        type: 'color',
                        tag: 'text_color',
                        text: 'ff333333',
                        tip: '阅读正文字体颜色'
                    },
                    {
                        id: 3,
                        type: 'color',
                        tag: 'title_text_color',
                        text: '',
                        tip: '阅读标题字体颜色'
                    },
                    {
                        id: 4,
                        type: 'color',
                        tag: 'title_dividing_line_color',
                        text: '',
                        tip: '阅读标题分割线颜色'
                    },
                    {
                        id: 5,
                        type: 'color',
                        tag: 'words_highlight_bg_color',
                        text: '',
                        tip: '查词高亮背景颜色'
                    },
                    {
                        id: 6,
                        type: 'color',
                        tag: 'words_highlight_text_color',
                        text: '',
                        tip: '查词高亮字体颜色'
                    },
                ],
                panel: [{
                        id: 7,
                        type: 'color',
                        tag: 'bg_color',
                        text: '',
                        tip: '查词框背景色'
                    },
                    {
                        id: 8,
                        type: 'image',
                        tag: 'bg_image',
                        text: 'xxx.png',
                        tip: '查词框背景图'
                    },
                    {
                        id: 9,
                        type: 'image',
                        tag: 'panel_icon_image',
                        text: 'xxx.png',
                        tip: '查词框右上图标'
                    },
                    {
                        id: 10,
                        type: 'color',
                        tag: 'speaker_icon_color',
                        text: '',
                        tip: '查词框发音图标'
                    },
                    {
                        id: 11,
                        type: 'image',
                        tag: 'dict_icon_image',
                        text: 'xxx.png',
                        tip: '查词框词典释义图标'
                    },
                    {
                        id: 12,
                        type: 'color',
                        tag: 'definition_text_color',
                        text: '',
                        tip: '查词框单词释义颜色'
                    },
                    {
                        id: 13,
                        type: 'color',
                        tag: 'phonetic_text_color',
                        text: '',
                        tip: '查词框单词音标颜色'
                    },
                    {
                        id: 14,
                        type: 'color',
                        tag: 'highlight_text_color',
                        text: '',
                        tip: '查词框高亮字体颜色'
                    },
                    {
                        id: 15,
                        type: 'color',
                        tag: 'drag_icon_color',
                        text: '',
                        tip: '抽屉图标颜色'
                    },
                ]
            },
            general_definition_page: [{
                    id: 1,
                    type: 'color',
                    tag: 'bg_color',
                    text: '',
                    tip: '普通词典背景色'
                },
                {
                    id: 2,
                    type: 'image',
                    tag: 'card_bg_image',
                    text: 'xxx.png',
                    tip: '普通词典card背景图'
                },
                {
                    id: 3,
                    type: 'color',
                    tag: 'dividing_line_color',
                    text: '',
                    tip: '普通词典分割线颜色'
                },
                {
                    id: 4,
                    type: 'text',
                    tag: 'toolbar_title_text',
                    text: '魔法字典',
                    tip: '普通词典工具栏标题'
                },
                {
                    id: 5,
                    type: 'color',
                    tag: 'toolbar_bg_color',
                    text: '',
                    tip: '普通词典工具栏背景颜色'
                },
                {
                    id: 6,
                    type: 'color',
                    tag: 'toolbar_text_color',
                    text: '',
                    tip: '普通词典工具栏字体颜色'
                },
                {
                    id: 7,
                    type: 'color',
                    tag: 'toolbar_icon_color',
                    text: '',
                    tip: '普通词典工具栏图标颜色'
                },
                {
                    id: 8,
                    type: 'color',
                    tag: 'speaker_icon_color',
                    text: '',
                    tip: '普通词典发音图标颜色'
                },
                {
                    id: 9,
                    type: 'color',
                    tag: 'word_text_color',
                    text: '',
                    tip: '普通词典单词颜色'
                },
                {
                    id: 10,
                    type: 'color',
                    tag: 'definition_text_color',
                    text: '',
                    tip: '普通词典单词释义颜色'
                },
                {
                    id: 11,
                    type: 'color',
                    tag: 'phonetic_text_color',
                    text: '',
                    tip: '普通词典单词音标颜色'
                },
                {
                    id: 12,
                    type: 'color',
                    tag: 'example_text_color',
                    text: '',
                    tip: '普通词典单词例句颜色'
                },
                {
                    id: 13,
                    type: 'color',
                    tag: 'translation_text_color',
                    text: '',
                    tip: '普通词典单词例句翻译颜色'
                },
                {
                    id: 14,
                    type: 'color',
                    tag: 'highlight_color',
                    text: '',
                    tip: '普通词典所有高亮颜色'
                },
                {
                    id: 15,
                    type: 'color',
                    tag: 'drag_icon_color',
                    text: '',
                    tip: '抽屉图标颜色'
                },
                {
                    id: 16,
                    type: 'color',
                    tag: 'drag_divider_color',
                    text: '',
                    tip: '抽屉分割线颜色'
                },
            ],
            featured_definition_page: [{
                    id: 1,
                    type: 'color',
                    tag: 'bg_color',
                    text: '',
                    tip: '特色词典背景色'
                },
                {
                    id: 2,
                    type: 'color',
                    tag: 'text_color',
                    text: '',
                    tip: '特色词典正文字体颜色'
                },
                {
                    id: 3,
                    type: 'color',
                    tag: 'toolbar_bg_color',
                    text: '',
                    tip: '特色词典工具栏背景颜色'
                },
                {
                    id: 4,
                    type: 'text',
                    tag: 'toolbar_title_text',
                    text: '魔法字典',
                    tip: '特色词典工具栏标题'
                },
                {
                    id: 5,
                    type: 'color',
                    tag: 'toolbar_text_color',
                    text: '',
                    tip: '特色词典工具栏上字体颜色'
                },
                {
                    id: 6,
                    type: 'color',
                    tag: 'toolbar_icon_color',
                    text: '',
                    tip: '特色词典工具栏上图标颜色'
                },
                {
                    id: 7,
                    type: 'color',
                    tag: 'speaker_icon_color',
                    text: '',
                    tip: '特色词典发音图标颜色'
                },
                {
                    id: 8,
                    type: 'image',
                    tag: 'definition_bg_image',
                    text: 'xxx.png',
                    tip: '特色词典单词释义图片'
                },
                {
                    id: 9,
                    type: 'color',
                    tag: 'definition_image_text_color',
                    text: '',
                    tip: '特色词典单词释义图片上的字体颜色'
                },
                {
                    id: 10,
                    type: 'image',
                    tag: 'dividing_image_image',
                    text: 'xxx.png',
                    tip: '特色词典默认分割图'
                },
                {
                    id: 11,
                    type: 'color',
                    tag: 'definition_text_color',
                    text: '',
                    tip: '特色词典单词释义颜色'
                },
                {
                    id: 12,
                    type: 'color',
                    tag: 'phonetic_text_color',
                    text: '',
                    tip: '特色词典单词音标颜色'
                },
                {
                    id: 13,
                    type: 'color',
                    tag: 'highlight_color',
                    text: '',
                    tip: '特色词典高亮颜色'
                },
                {
                    id: 14,
                    type: 'text',
                    tag: 'general_definition_hint_text',
                    text: '麻瓜世界',
                    tip: '特色词典普通释义提示文案'
                },
                // {id:15, type:'image', tag:'promotion_icon_image', text:'dict_magic_promotion_icon_image.png', tip:'特色词典推广图标'},
                {
                    id: 15,
                    type: 'color',
                    tag: 'words_highlight_bg_color',
                    text: '',
                    tip: '查词高亮背景颜色'
                },
                {
                    id: 16,
                    type: 'color',
                    tag: 'words_highlight_text_color',
                    text: '',
                    tip: '查词高亮字体颜色'
                },
                {
                    id: 17,
                    type: 'color',
                    tag: 'drag_icon_color',
                    text: '',
                    tip: '抽屉图标颜色'
                },
                {
                    id: 18,
                    type: 'color',
                    tag: 'drag_divider_color',
                    text: '',
                    tip: '抽屉分割线颜色'
                },
            ],
            featured_bilingual_window: [{
                    id: 1,
                    type: 'color',
                    tag: 'shadow_color',
                    text: '',
                    tip: '周边阴影颜色'
                },
                {
                    id: 2,
                    type: 'color',
                    tag: 'bg_color',
                    text: '',
                    tip: '背景色'
                },
                {
                    id: 3,
                    type: 'color',
                    tag: 'border_color',
                    text: '',
                    tip: '边框线颜色'
                },
                {
                    id: 4,
                    type: 'color',
                    tag: 'thumb_color',
                    text: '',
                    tip: '滚动条颜色'
                },
                {
                    id: 6,
                    type: 'color',
                    tag: 'content_text_color',
                    text: '',
                    tip: '弹窗中文本颜色'
                },
                {
                    id: 7,
                    type: 'color',
                    tag: 'selected_rect_color',
                    text: '',
                    tip: '长按选中背景色'
                },
                {
                    id: 8,
                    type: 'color',
                    tag: 'selected_text_color',
                    text: '',
                    tip: '长按选中文本色'
                },
            ],
        }
    }
})