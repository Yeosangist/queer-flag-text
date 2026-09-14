// ==UserScript==
// @name         Queer Flag Highlighter
// @namespace    scriptcat.Yeosangist.queer-flag-highlighter
// @version      1.0.0
// @description  Highlights queer-related words using their associated pride flag colours.
// @author       Yeosangist
// @license      CC BY-NC-SA
// @match        *://*/*
// @downloadURL  https://raw.githubusercontent.com/Yeosangist/queer-flag-text/refs/heads/main/main.js
// @updateURL    https://raw.githubusercontent.com/Yeosangist/queer-flag-text/refs/heads/main/main.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

    const hostname = window.location.hostname.toLowerCase();
    const isTumblr =
        hostname === 'tumblr.com' ||
        hostname.endsWith('.tumblr.com');

    const TUMBLR_SAFE_SELECTOR = [
        'article',
        '[role="article"]',
        '[data-testid="post-body"]',
        '[data-testid="post_body"]',
        '.post-body',
        '.post_body',
        '.npf',
        '.npf_text',
        '.reblog-content'
    ].join(',');

    /*
     * ============================================================
     * WORDS / FLAGS
     * ============================================================
     *
     * Add, remove, or modify entries here.
     *
     * Each entry has:
     *   words: words to match
     *   colors: flag colours, from left to right
     *
     * The script uses a linear gradient for multi-colour flags.
     */

    const FLAGS = [

        // Rainbow / LGBTQ+
        {
            words: ['queer', 'lgbtq', 'lgbtq+', 'lgbt', 'lgbt+', 'lgbtqia', 'lgbtqia+', 'pride'],
            colors: [
                '#E40303',
                '#FF8C00',
                '#FFED00',
                '#008026',
                '#004DFF',
                '#750787'
            ]
        },

        // Gay men
        {
            words: ['gay', 'achillean', 'mlm'],
            colors: [
                '#078D70',
                '#26CEAA',
                '#98E8C1',
                '#DDDDDD',
                '#7BADE2',
                '#5049CC',
                '#3D1A78'
            ]
        },

        // Lesbian
        {
            words: ['lesbian', 'wlw'],
            colors: [
                '#D52D00',
                '#EF7627',
                '#FF9A56',
                '#DDDDDD',
                '#D162A4',
                '#B55690',
                '#A30262'
            ]
        },

        // Bisexual
        {
            words: ['bisexual', 'bi'],
            colors: [
                '#D60270',
                '#D60270',
                '#9B4F96',
                '#0038A8',
                '#0038A8'
            ]
        },

        // Pansexual
        {
            words: ['pansexual', 'pan'],
            colors: [
                '#FF218C',
                '#FFD800',
                '#21B1FF'
            ]
        },

        // Transgender
        {
            words: ['transgender', 'trans'],
            colors: [
                '#5BCEFA',
                '#F5A9B8',
                '#DDDDDD',
                '#F5A9B8',
                '#5BCEFA'
            ]
        },

        // Non-binary
        {
            words: ['nonbinary', 'non-binary', 'enby'],
            colors: [
                '#FCF434',
                '#DDDDDD',
                '#9C59D1',
                '#2C2C2C'
            ]
        },

        // Asexual
        {
            words: ['asexual', 'ace'],
            colors: [
                '#2C2C2C',
                '#A3A3A3',
                '#DDDDDD',
                '#800080'
            ]
        },

        // Aromantic
        {
            words: ['aromantic', 'aro', 'aro spectrum', 'aromantic spectrum', 'arospec', 'aro-spec'],
            colors: [
                '#3DA542',
                '#A7D379',
                '#DDDDDD',
                '#A9A9A9',
                '#2C2C2C'
            ]
        },

        // AroAce
        {
            words: ['aroace', 'aromantic-asexual', 'aromantic/asexual'],
            colors: [
                '#DD8A00',
                '#E9CC07',
                '#DDDDDD',
                '#65B0DD',
                '#213C57'
            ]
        },

        // Demisexual
        {
            words: ['demisexual', 'demi'],
            colors: [
                '#2C2C2C',
                '#DDDDDD',
                '#6E0070',
                '#D2D2D2'
            ]
        },

        // Demiromantic
        {
            words: ['demiromantic'],
            colors: [
                '#39A94A',
                '#B5DF9B',
                '#DDDDDD',
                '#A9A9A9',
                '#2C2C2C'
            ]
        },

        // Genderfluid
        {
            words: ['genderfluid', 'gender-fluid'],
            colors: [
                '#FF75A2',
                '#DDDDDD',
                '#BE18D6',
                '#2C2C2C',
                '#333EBD'
            ]
        },

        // Genderqueer
        {
            words: ['genderqueer', 'gender-queer'],
            colors: [
                '#B57EDC',
                '#DDDDDD',
                '#4A8123'
            ]
        },

        // Agender
        {
            words: ['agender'],
            colors: [
                '#2C2C2C',
                '#B9B9B9',
                '#DDDDDD',
                '#B8F483',
                '#DDDDDD',
                '#B9B9B9',
                '#2C2C2C'
            ]
        },

        // Bigender
        {
            words: ['bigender'],
            colors: [
                '#C479D9',
                '#EDA5CD',
                '#D8D8D8',
                '#A4E8D8',
                '#6ADEC9'
            ]
        },

        // Pangender
        {
            words: ['pangender'],
            colors: [
                '#fdf48d',
                '#f3b79c',
                '#fac3ef',
                '#DDDDDD'
            ]
        },

        // Omnisexual
        {
            words: ['omnisexual', 'omni'],
            colors: [
                '#FF9A4D',
                '#FF53BF',
                '#DDDDDD',
                '#625FFF',
                '#1F9BFF'
            ]
        },

        // Polysexual
        {
            words: ['polysexual', 'poly'],
            colors: [
                '#F61CB9',
                '#07D569',
                '#1C92F5'
            ]
        },

        // Intersex
        {
            words: ['intersex'],
            colors: [
                '#FFD800',
                '#7902AA',
                '#FFD800'
            ]
        },

        // Two-spirit
        {
            words: ['two-spirit', 'two spirit', 'twospirit'],
            colors: [
                '#D62828',
                '#F77F00',
                '#FCBF49',
                '#2A9D8F',
                '#277DA1',
                '#7B2CBF'
            ]
        },

        // Sapphic
        {
            words: ['sapphic'],
            colors: [
                '#FF8DC7',
                '#DDDDDD',
                '#D629A9',
                '#7B1FA2'
            ]
        },

        // Questioning
        {
            words: ['questioning'],
            colors: [
                '#FF75A2',
                '#DDDDDD',
                '#9C59D1',
                '#2C2C2C',
                '#5BCEFA'
            ]
        },
        // Polyamorous
        {
            words: ['polyamorous', 'polyamory', 'polyam'],
            colors: [
                '#009FE3',
                '#E50051',
                '#340C46',
                '#DDDDDD',
                '#FCBF00'
            ]
        },

        // Abrosexual
        {
            words: ['abrosexual', 'abro'],
            colors: [
                '#46D294',
                '#A3E9C8',
                '#DDDDDD',
                '#F5A9B8',
                '#EE1766'
            ]
        },

        // Graysexual / Gray-asexual
        {
            words: ['graysexual', 'greysexual', 'gray-asexual', 'grey-asexual', 'gray ace', 'grey ace'],
            colors: [
                '#740195',
                '#B2B2B2',
                '#DDDDDD',
                '#B2B2B2',
                '#740195'
            ]
        },

        // Grayromantic
        {
            words: ['grayromantic', 'greyromantic', 'gray-romantic', 'grey-romantic'],
            colors: [
                '#087D16',
                '#B2B2B2',
                '#DDDDDD',
                '#B2B2B2',
                '#087D16'
            ]
        },

        // Demigender
        {
            words: ['demigender', 'demi-gender'],
            colors: [
                '#7F7F7F',
                '#C4C4C4',
                '#FFEE70',
                '#DDDDDD',
                '#FFEE70',
                '#C4C4C4',
                '#7F7F7F'
            ]
        },

        // Demiboy
        {
            words: ['demiboy', 'demiguy'],
            colors: [
                '#7F7F7F',
                '#C4C4C4',
                '#9AD9EB',
                '#DDDDDD',
                '#9AD9EB',
                '#C4C4C4',
                '#7F7F7F'
            ]
        },

        // Demigirl
        {
            words: ['demigirl'],
            colors: [
                '#7F7F7F',
                '#C4C4C4',
                '#FFAEC9',
                '#DDDDDD',
                '#FFAEC9',
                '#C4C4C4',
                '#7F7F7F'
            ]
        },

        // Genderflux
        {
            words: ['genderflux', 'gender-flux'],
            colors: [
                '#F47694',
                '#F2A3B9',
                '#CECECE',
                '#7CE0F7',
                '#3ECDF9',
                '#FFF48E'
            ]
        },

        // Bigender
        {
            words: ['bigender'],
            colors: [
                '#C479A2',
                '#EDA5CD',
                '#D6C7E8',
                '#DDDDDD',
                '#9AC7E8',
                '#6D82D1'
            ]
        },

        // Genderfae
        {
            words: ['genderfae', 'gender-fae'],
            colors: [
                '#97C3A5',
                '#C3DEAE',
                '#F9FACD',
                '#DDDDDD',
                '#FCA2C4',
                '#DB8AE4',
                '#A97EDD'
            ]
        },

        // Genderfaun
        {
            words: ['genderfaun', 'gender-faun'],
            colors: [
                '#FCD689',
                '#FFF09B',
                '#FAF9CD',
                '#DDDDDD',
                '#8EDED9',
                '#8CACDE',
                '#9782EC'
            ]
        },

        // Xenogender
        {
            words: ['xenogender', 'xeno-gender', 'xenogenders'],
            colors: [
                '#FF6691',
                '#FF9997',
                '#FFB782',
                '#FBFFA6',
                '#84BBFF',
                '#9C84FF',
                '#A317FF'
            ]
        },

        // Lithromantic / Akoiromantic
        {
            words: ['lithromantic', 'lithro', 'akoiromantic', 'akoi'],
            colors: [
                '#7CBE42',
                '#FDEE23',
                '#A2A2A2'
            ]
        },

        // Fraysexual
        {
            words: ['fraysexual', 'fray'],
            colors: [
                '#226CB5',
                '#93E7DD',
                '#DDDDDD',
                '#636363'
            ]
        },

        // Cupiosexual
        {
            words: ['cupiosexual', 'cupio'],
            colors: [
                '#A0A0A0',
                '#C8BFE6',
                '#DDDDDD',
                '#FFB3DA'
            ]
        },

        // Cupioromantic
        {
            words: ['cupioromantic', 'cupio romantic'],
            colors: [
                '#FCA9A3',
                '#FDC5C0',
                '#DDDDDD',
                '#C8BFE6',
                '#A0A0A0'
            ]
        },

        // Aegosexual
        {
            words: ['aegosexual', 'autochorissexual', 'auto-chorissexual', 'aego'],
            colors: [
                '#2C2C2C',
                '#A3A3A3',
                '#DDDDDD',
                '#800080'
            ]
        },
        // Trigender
        {
            words: ['trigender', 'tri-gender'],
            colors: [
                '#FF76A4',
                '#FFB3CB',
                '#DDDDDD',
                '#3DA542',
                '#9AC7E8',
                '#6D82D1',
                '#9C59D1'
            ]
        },

        // Multigender
        {
            words: ['multigender', 'multi-gender'],
            colors: [
                '#3F47CD',
                '#00A3E8',
                '#FA7F27',
                '#00A3E8',
                '#3F47CD'
            ]
        },

        // Polygender
        {
            words: ['polygender', 'poly-gender'],
            colors: [
                '#2C2C2C',
                '#8FA6BF',
                '#E875A8',
                '#F4E64D',
                '#39A9E8'
            ]
        },

        // Androgyne
        {
            words: ['androgyne', 'androgynous', 'androgyny'],
            colors: [
                '#FE007F',
                '#9A00FF',
                '#00B8E7'
            ]
        },

        // Neutrois
        {
            words: ['neutrois'],
            colors: [
                '#DDDDDD',
                '#1F9B00',
                '#2C2C2C'
            ]
        },

        // Maverique
        {
            words: ['maverique'],
            colors: [
                '#FFF344',
                '#DDDDDD',
                '#F49622'
            ]
        },

        // Omnigender
        {
            words: ['omnigender', 'omni-gender'],
            colors: [
                '#F4A6C1',
                '#C8C4E2',
                '#A94BA8',
                '#7194C4',
                '#9AD8E8'
            ]
        },

        // Aporagender
        {
            words: ['aporagender', 'apora-gender', 'apora'],
            colors: [
                '#F5A6C8',
                '#9A8AE8',
                '#F4D44D',
                '#7F9FE8',
                '#F5A6C8'
            ]
        },

        // Gendervoid
        {
            words: ['gendervoid', 'gender void', 'gender-void'],
            colors: [
                '#0B164F',
                '#4A4A4A',
                '#2C2C2C',
                '#4A4A4A',
                '#0B164F'
            ]
        },

        // Greygender
        {
            words: ['greygender', 'graygender', 'grey-gender', 'gray-gender'],
            colors: [
                '#DDDDDD',
                '#ABABAB',
                '#3D3D3D',
                '#9B59B6',
                '#2C2C2C'
            ]
        },

        // Quoiromantic
        {
            words: ['quoiromantic', 'wtfromantic', 'quoi-romantic'],
            colors: [
                '#2C2C2C',
                '#8BCF45',
                '#55C7D9',
                '#A4A4A4'
            ]
        },
    ];


    /*
     * ============================================================
     * SETTINGS
     * ============================================================
     */

    // Case-insensitive matching.
    const CASE_INSENSITIVE = true;

    // Highlight whole words rather than arbitrary substrings.
    const WHOLE_WORDS_ONLY = true;

    // Don't process text inside these elements.
    const IGNORED_ELEMENTS = new Set([
        'SCRIPT',
        'STYLE',
        'NOSCRIPT',
        'TEXTAREA',
        'INPUT',
        'SELECT',
        'OPTION',
        'CODE',
        'PRE',
        'KBD',
        'SAMP',
        'SVG',
        'MATH'
    ]);

    // Class added to generated spans.
    const HIGHLIGHT_CLASS = '__queer_flag_highlight';


    /*
     * ============================================================
     * CSS
     * ============================================================
     */

    const style = document.createElement('style');

    style.textContent = `
        .${HIGHLIGHT_CLASS} {
            display: inline;

            /*
            * Paint the gradient onto the text itself.
            */
            background-image: var(--qfh-gradient) !important;
            background-clip: text !important;
            -webkit-background-clip: text !important;

            /*
            * Make the actual text transparent so the gradient
            * underneath becomes visible.
            */
            color: transparent !important;
            -webkit-text-fill-color: transparent !important;

            /*
            * Preserve the surrounding site's typography.
            */
            font: inherit !important;
        }
    `;

    // document-start means <head> may not exist yet.
    function installStyle() {
        if (document.head) {
            document.head.appendChild(style);
        } else {
            document.documentElement.appendChild(style);
        }
    }

    installStyle();


    /*
     * ============================================================
     * BUILD REGEX
     * ============================================================
     */

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Make a lookup table so each match knows which flag it belongs to.
    const wordToFlag = new Map();

    for (const flag of FLAGS) {
        for (const word of flag.words) {
            wordToFlag.set(word.toLowerCase(), flag);
        }
    }

    // Longest words first.
    // This prevents shorter entries from stealing matches.
    const words = [...wordToFlag.keys()]
        .sort((a, b) => b.length - a.length)
        .map(escapeRegex);

    if (words.length === 0) {
        return;
    }

    let boundaryStart = '';
    let boundaryEnd = '';

    if (WHOLE_WORDS_ONLY) {
        boundaryStart = '(?<![\\p{L}\\p{N}_-])';
        boundaryEnd = '(?![\\p{L}\\p{N}_-])';
    }

    const regex = new RegExp(
        boundaryStart +
        `(${words.join('|')})` +
        boundaryEnd,
        CASE_INSENSITIVE ? 'giu' : 'gu'
    );


    /*
     * ============================================================
     * CREATE HIGHLIGHT
     * ============================================================
     */

    function makeHighlight(text) {
        const flag = wordToFlag.get(text.toLowerCase());

        if (!flag) {
            return document.createTextNode(text);
        }

        const span = document.createElement('span');

        span.className = HIGHLIGHT_CLASS;
        span.textContent = text;

        span.style.setProperty(
            '--qfh-gradient',
            `linear-gradient(90deg, ${flag.colors.join(', ')})`
        );

        return span;
    }


    /*
     * ============================================================
     * PROCESS TEXT NODE
     * ============================================================
     */

    function isTumblrSafeNode(node) {
        if (!isTumblr) {
            return true;
        }

        const element = node.nodeType === Node.ELEMENT_NODE
            ? node
            : node.parentElement;

        return !!element && !!element.closest(TUMBLR_SAFE_SELECTOR);
    }

    function processTextNode(node) {
        if (!node || !node.parentElement) {
            return;
        }

        const parent = node.parentElement;

        if (
            !isTumblrSafeNode(node) ||
            IGNORED_ELEMENTS.has(parent.tagName) ||
            parent.closest('[contenteditable]:not([contenteditable="false"])')
        ) {
            return;
        }

        if (parent.closest(`.${HIGHLIGHT_CLASS}`)) {
            return;
        }

        const text = node.nodeValue;

        if (!text || !regex.test(text)) {
            regex.lastIndex = 0;
            return;
        }

        // Reset regex because RegExp objects with /g retain lastIndex.
        regex.lastIndex = 0;

        const fragment = document.createDocumentFragment();

        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
            const start = match.index;
            const end = start + match[0].length;

            if (start > lastIndex) {
                fragment.appendChild(
                    document.createTextNode(
                        text.slice(lastIndex, start)
                    )
                );
            }

            fragment.appendChild(makeHighlight(match[0]));

            lastIndex = end;
        }

        if (lastIndex < text.length) {
            fragment.appendChild(
                document.createTextNode(
                    text.slice(lastIndex)
                )
            );
        }

        node.parentNode.replaceChild(fragment, node);

        regex.lastIndex = 0;
    }


    /*
     * ============================================================
     * WALK A SUBTREE
     * ============================================================
     */

    function processElement(element) {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) {
            return;
        }

        if (IGNORED_ELEMENTS.has(element.tagName)) {
            return;
        }

        if (element.isContentEditable) {
            return;
        }

        if (
            isTumblr &&
            !element.matches(TUMBLR_SAFE_SELECTOR) &&
            !element.closest(TUMBLR_SAFE_SELECTOR) &&
            !element.querySelector(TUMBLR_SAFE_SELECTOR)
        ) {
            return;
        }

        if (element.classList.contains(HIGHLIGHT_CLASS)) {
            return;
        }

        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    const parent = node.parentElement;

                    if (!parent) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    if (!isTumblrSafeNode(node)) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    if (IGNORED_ELEMENTS.has(parent.tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    if (parent.closest('[contenteditable]:not([contenteditable="false"])')) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    if (parent.closest(`.${HIGHLIGHT_CLASS}`)) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const nodes = [];

        let node;

        while ((node = walker.nextNode())) {
            nodes.push(node);
        }

        for (const textNode of nodes) {
            processTextNode(textNode);
        }
    }


    /*
     * ============================================================
     * INITIAL PAGE
     * ============================================================
     */

    function processPage() {
        if (document.body) {
            processElement(document.body);
        }
    }


    /*
     * ============================================================
     * DYNAMIC CONTENT
     * ============================================================
     *
     * Modern websites constantly add/change content without
     * reloading the page. MutationObserver catches that.
     */

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {

            // Newly inserted elements.
            for (const addedNode of mutation.addedNodes) {
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    processElement(addedNode);
                } else if (addedNode.nodeType === Node.TEXT_NODE) {
                    processTextNode(addedNode);
                }
            }

            // Existing text that has changed.
            if (mutation.type === 'characterData') {
                processTextNode(mutation.target);
            }
        }
    });


    /*
     * ============================================================
     * START
     * ============================================================
     */

    function start() {
        processPage();

        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, {
            once: true
        });
    } else {
        start();
    }

})();