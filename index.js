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
                    xmlStr += "<" + themeKey + ">"
                    this.theme[themeKey].forEach(element => {
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
            var str = ""
            str += "<read_page>"
            for (readPageItemKey in this.theme.read_page) {
                str += "<" + readPageItemKey + ">"
                var items = this.theme.read_page[readPageItemKey]
                items.forEach(element => {
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
    },
    data: {
        theme: {
            read_page: {
                toolbar: [{
                        id: 1,
                        type: 'color',
                        tag: 'bg_color',
                        text: 'fffff6d9',
                        tip: '阅读工具栏背景色'
                    },
                    {
                        id: 2,
                        type: 'color',
                        tag: 'icon_color',
                        text: 'ff816130',
                        tip: '阅读工具栏图标颜色'
                    },
                    {
                        id: 3,
                        type: 'color',
                        tag: 'dividing_line_color',
                        text: 'bf816130',
                        tip: '阅读工具栏分割线颜色'
                    },
                    {
                        id: 4,
                        type: 'color',
                        tag: 'text_color',
                        text: 'ff333333',
                        tip: '阅读工具栏字体颜色'
                    },
                    {
                        id: 5,
                        type: 'color',
                        tag: 'menu_textsize_selected_bg_color',
                        text: 'fffcedc2',
                        tip: '阅读工具栏当前字体大小设置背景色'
                    },
                    {
                        id: 6,
                        type: 'color',
                        tag: 'menu_search_hint_text_color',
                        text: '7f333333',
                        tip: '阅读工具栏搜索提示文案意思'
                    },
                ],
                catalog: [{
                        id: 7,
                        type: 'image',
                        tag: 'bg_image',
                        text: 'reader_catalog_bg_image.png',
                        tip: '目录背景图'
                    },
                    {
                        id: 8,
                        type: 'color',
                        tag: 'text_color',
                        text: 'ff333333',
                        tip: '目录字体颜色'
                    },
                    {
                        id: 9,
                        type: 'color',
                        tag: 'catalog_title_icon_color',
                        text: 'ffa1660c',
                        tip: '目录图标颜色'
                    },
                    {
                        id: 10,
                        type: 'color',
                        tag: 'catalog_dividing_line_color',
                        text: 'e5816130',
                        tip: '目录分割线颜色'
                    },
                    {
                        id: 11,
                        type: 'color',
                        tag: 'catalog_item_selected_bg_color',
                        text: 'fffcedc2',
                        tip: '目录被选中颜色'
                    },
                    {
                        id: 12,
                        type: 'color',
                        tag: 'catalog_item_finished_icon_color',
                        text: 'ffa1660c',
                        tip: '目录完成图标'
                    },
                    {
                        id: 13,
                        type: 'color',
                        tag: 'author_text_color',
                        text: 'ff666666',
                        tip: '目录作者字体颜色'
                    },
                    {
                        id: 14,
                        type: 'color',
                        tag: 'catalog_item_locked_icon_color',
                        text: '80979797',
                        tip: '目录未解锁图标颜色'
                    },
                    {
                        id: 15,
                        type: 'color',
                        tag: 'locked_text_color',
                        text: '99333333',
                        tip: '目录未解锁字体颜色'
                    },
                ],
                body: [{
                        id: 1,
                        type: 'image',
                        tag: 'bg_image',
                        text: 'reader_body_bg_image.png',
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
                        text: 'ff816130',
                        tip: '阅读标题字体颜色'
                    },
                    {
                        id: 4,
                        type: 'color',
                        tag: 'title_dividing_line_color',
                        text: 'ffeed48e',
                        tip: '阅读标题分割线颜色'
                    },
                    {
                        id: 5,
                        type: 'color',
                        tag: 'words_highlight_bg_color',
                        text: 'ff418a8d',
                        tip: '查词高亮背景颜色'
                    },
                    {
                        id: 6,
                        type: 'color',
                        tag: 'words_highlight_text_color',
                        text: 'ffffffff',
                        tip: '查词高亮字体颜色'
                    },
                ],
                panel: [{
                        id: 7,
                        type: 'color',
                        tag: 'bg_color',
                        text: 'ff276667',
                        tip: '查词框背景色'
                    },
                    {
                        id: 8,
                        type: 'image',
                        tag: 'bg_image',
                        text: 'reader_panel_bg_image.png',
                        tip: '查词框背景图'
                    },
                    {
                        id: 9,
                        type: 'image',
                        tag: 'panel_icon_image',
                        text: 'reader_panel_panel_icon_image.png',
                        tip: '查词框右上图标'
                    },
                    {
                        id: 10,
                        type: 'color',
                        tag: 'speaker_icon_color',
                        text: 'ffffffff',
                        tip: '查词框发音图标'
                    },
                    {
                        id: 11,
                        type: 'image',
                        tag: 'dict_icon_image',
                        text: 'reader_panel_dict_icon_image.png',
                        tip: '查词框词典释义图标'
                    },
                    {
                        id: 12,
                        type: 'color',
                        tag: 'definition_text_color',
                        text: 'fffdfdfd',
                        tip: '查词框单词释义颜色'
                    },
                    {
                        id: 13,
                        type: 'color',
                        tag: 'phonetic_text_color',
                        text: '66fdfdfd',
                        tip: '查词框单词音标颜色'
                    },
                    {
                        id: 14,
                        type: 'color',
                        tag: 'highlight_text_color',
                        text: 'ffFFE182',
                        tip: '查词框高亮字体颜色'
                    },
                    {
                        id: 15,
                        type: 'color',
                        tag: 'drag_icon_color',
                        text: 'ffFFE182',
                        tip: '抽屉图标颜色'
                    },
                    {
                        id: 16,
                        type: 'color',
                        tag: 'drag_divider_color',
                        text: 'ffFFE182',
                        tip: '抽屉分割线颜色'
                    },
                ]
            },
            general_definition_page: [{
                    id: 1,
                    type: 'color',
                    tag: 'bg_color',
                    text: 'ff285254',
                    tip: '普通词典背景色'
                },
                {
                    id: 2,
                    type: 'image',
                    tag: 'card_bg_image',
                    text: 'dict_standard_card_bg_image.png',
                    tip: '普通词典card背景图'
                },
                {
                    id: 3,
                    type: 'color',
                    tag: 'dividing_line_color',
                    text: 'ffEEDFB3',
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
                    text: 'ff285253',
                    tip: '普通词典工具栏背景颜色'
                },
                {
                    id: 6,
                    type: 'color',
                    tag: 'toolbar_text_color',
                    text: 'ffffffff',
                    tip: '普通词典工具栏字体颜色'
                },
                {
                    id: 7,
                    type: 'color',
                    tag: 'toolbar_icon_color',
                    text: 'ffffffff',
                    tip: '普通词典工具栏图标颜色'
                },
                {
                    id: 8,
                    type: 'color',
                    tag: 'speaker_icon_color',
                    text: 'ffa1660c',
                    tip: '普通词典发音图标颜色'
                },
                {
                    id: 9,
                    type: 'color',
                    tag: 'word_text_color',
                    text: 'ffa1660c',
                    tip: '普通词典单词颜色'
                },
                {
                    id: 10,
                    type: 'color',
                    tag: 'definition_text_color',
                    text: 'ff333333',
                    tip: '普通词典单词释义颜色'
                },
                {
                    id: 11,
                    type: 'color',
                    tag: 'phonetic_text_color',
                    text: 'ff666666',
                    tip: '普通词典单词音标颜色'
                },
                {
                    id: 12,
                    type: 'color',
                    tag: 'example_text_color',
                    text: 'ff333333',
                    tip: '普通词典单词例句颜色'
                },
                {
                    id: 13,
                    type: 'color',
                    tag: 'translation_text_color',
                    text: 'ff666666',
                    tip: '普通词典单词例句翻译颜色'
                },
                {
                    id: 14,
                    type: 'color',
                    tag: 'highlight_color',
                    text: 'fffff4a4',
                    tip: '普通词典所有高亮颜色'
                },
                {
                    id: 15,
                    type: 'color',
                    tag: 'drag_icon_color',
                    text: 'ffFFE182',
                    tip: '抽屉图标颜色'
                },
                {
                    id: 16,
                    type: 'color',
                    tag: 'drag_divider_color',
                    text: 'ffFFE182',
                    tip: '抽屉分割线颜色'
                },
            ],
            featured_definition_page: [{
                    id: 1,
                    type: 'color',
                    tag: 'bg_color',
                    text: 'ff285254',
                    tip: '特色词典背景色'
                },
                {
                    id: 2,
                    type: 'color',
                    tag: 'text_color',
                    text: 'ffffffff',
                    tip: '特色词典正文字体颜色'
                },
                {
                    id: 3,
                    type: 'color',
                    tag: 'toolbar_bg_color',
                    text: 'ff285254',
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
                    text: 'ffffffff',
                    tip: '特色词典工具栏上字体颜色'
                },
                {
                    id: 6,
                    type: 'color',
                    tag: 'toolbar_icon_color',
                    text: 'ffffffff',
                    tip: '特色词典工具栏上图标颜色'
                },
                {
                    id: 7,
                    type: 'color',
                    tag: 'speaker_icon_color',
                    text: 'ffffffff',
                    tip: '特色词典发音图标颜色'
                },
                {
                    id: 8,
                    type: 'image',
                    tag: 'definition_bg_image',
                    text: 'dict_magic_definition_bg_image.png',
                    tip: '特色词典单词释义图片'
                },
                {
                    id: 9,
                    type: 'color',
                    tag: 'definition_image_text_color',
                    text: 'ff63400f',
                    tip: '特色词典单词释义图片上的字体颜色'
                },
                {
                    id: 10,
                    type: 'image',
                    tag: 'dividing_image_image',
                    text: 'dict_magic_dividing_image_image.png',
                    tip: '特色词典默认分割图'
                },
                {
                    id: 11,
                    type: 'color',
                    tag: 'definition_text_color',
                    text: 'ffffffff',
                    tip: '特色词典单词释义颜色'
                },
                {
                    id: 12,
                    type: 'color',
                    tag: 'phonetic_text_color',
                    text: '66fdfdfd',
                    tip: '特色词典单词音标颜色'
                },
                {
                    id: 13,
                    type: 'color',
                    tag: 'highlight_color',
                    text: 'fffff4a4',
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
                    text: 'ff418a8d',
                    tip: '查词高亮背景颜色'
                },
                {
                    id: 16,
                    type: 'color',
                    tag: 'words_highlight_text_color',
                    text: 'ffffffff',
                    tip: '查词高亮字体颜色'
                },
            ],
            featured_bilingual_window: [{
                    id: 1,
                    type: 'color',
                    tag: 'shadow_color',
                    text: '3f9e957c',
                    tip: '周边阴影颜色'
                },
                {
                    id: 2,
                    type: 'color',
                    tag: 'bg_color',
                    text: 'fffcf0ca',
                    tip: '背景色'
                },
                {
                    id: 3,
                    type: 'color',
                    tag: 'border_color',
                    text: 'ffe5c982',
                    tip: '边框线颜色'
                },
                {
                    id: 4,
                    type: 'color',
                    tag: 'thumb_color',
                    text: 'ffedd599',
                    tip: '滚动条颜色'
                },
                {
                    id: 5,
                    type: 'color',
                    tag: 'divider_color',
                    text: '59e5c982',
                    tip: '弹窗中购买部分与内容部分分割线颜色'
                },
                {
                    id: 6,
                    type: 'color',
                    tag: 'content_text_color',
                    text: 'ff333333',
                    tip: '弹窗中文本颜色'
                },
                {
                    id: 7,
                    type: 'color',
                    tag: 'selected_rect_color',
                    text: 'ffffdb86',
                    tip: '长按选中背景色'
                },
                {
                    id: 8,
                    type: 'color',
                    tag: 'selected_text_color',
                    text: 'ff333333',
                    tip: '长按选中文本色'
                },
            ],
        }
    }
})