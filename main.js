// ==UserScript==
// @name         Queer Flag Highlighter
// @namespace    scriptcat.Yeosangist.queer-flag-highlighter
// @version      1.0.0
// @description  Highlights queer-related words using their associated pride flag colours.
// @author       Yeosangist
// @license      CC BY-NC-SA
// @match        *://*/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

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
            words: ['queer', 'lgbtq', 'lgbtq+', 'lgbt', 'lgbt+'],
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
            words: ['gay', 'achillean'],
            colors: [
                '#078D70',
                '#26CEAA',
                '#98E8C1',
                '#FFFFFF',
                '#7BADE2',
                '#5049CC',
                '#3D1A78'
            ]
        },

        // Lesbian
        {
            words: ['lesbian'],
            colors: [
                '#D52D00',
                '#EF7627',
                '#FF9A56',
                '#FFFFFF',
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
                '#FFFFFF',
                '#F5A9B8',
                '#5BCEFA'
            ]
        },

        // Non-binary
        {
            words: ['nonbinary', 'non-binary', 'enby'],
            colors: [
                '#FCF434',
                '#FFFFFF',
                '#9C59D1',
                '#2C2C2C'
            ]
        },

        // Asexual
        {
            words: ['asexual', 'ace'],
            colors: [
                '#000000',
                '#A3A3A3',
                '#FFFFFF',
                '#800080'
            ]
        },

        // Aromantic
        {
            words: ['aromantic', 'aro'],
            colors: [
                '#3DA542',
                '#A7D379',
                '#FFFFFF',
                '#A9A9A9',
                '#000000'
            ]
        },

        // Demisexual
        {
            words: ['demisexual', 'demi'],
            colors: [
                '#000000',
                '#6E0070',
                '#FFFFFF',
                '#D2D2D2'
            ]
        },

        // Demiromantic
        {
            words: ['demiromantic'],
            colors: [
                '#39A94A',
                '#B5DF9B',
                '#FFFFFF',
                '#A9A9A9',
                '#000000'
            ]
        },

        // Genderfluid
        {
            words: ['genderfluid', 'gender-fluid'],
            colors: [
                '#FF75A2',
                '#FFFFFF',
                '#BE18D6',
                '#000000',
                '#333EBD'
            ]
        },

        // Genderqueer
        {
            words: ['genderqueer', 'gender-queer'],
            colors: [
                '#B57EDC',
                '#FFFFFF',
                '#4A8123'
            ]
        },

        // Agender
        {
            words: ['agender'],
            colors: [
                '#000000',
                '#B9B9B9',
                '#FFFFFF',
                '#B8F483',
                '#FFFFFF',
                '#B9B9B9',
                '#000000'
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
                '#FFF798',
                '#FDD1F0',
                '#FFB5E5',
                '#FFFFFF'
            ]
        },

        // Omnisexual
        {
            words: ['omnisexual', 'omni'],
            colors: [
                '#FF9A4D',
                '#FF53BF',
                '#FFFFFF',
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
                '#FFFFFF',
                '#D629A9',
                '#7B1FA2'
            ]
        },

        // Achillean / MLM
        {
            words: ['mlm'],
            colors: [
                '#078D70',
                '#26CEAA',
                '#98E8C1',
                '#FFFFFF',
                '#7BADE2',
                '#5049CC',
                '#3D1A78'
            ]
        },

        // WLW
        {
            words: ['wlw'],
            colors: [
                '#D52D00',
                '#EF7627',
                '#FF9A56',
                '#FFFFFF',
                '#D162A4',
                '#B55690',
                '#A30262'
            ]
        },

        // Questioning
        {
            words: ['questioning'],
            colors: [
                '#FF75A2',
                '#FFFFFF',
                '#9C59D1',
                '#2C2C2C',
                '#5BCEFA'
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

    function processTextNode(node) {
        if (!node || !node.parentElement) {
            return;
        }

        const parent = node.parentElement;

        if (IGNORED_ELEMENTS.has(parent.tagName) || parent.isContentEditable) {
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

                    if (IGNORED_ELEMENTS.has(parent.tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    if (parent.isContentEditable) {
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