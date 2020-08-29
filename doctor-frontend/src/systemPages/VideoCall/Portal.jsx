import React, {useState, useEffect} from "react";
import {createPortal} from "react-dom";
import usePortal from "./usePortal";
import {message} from 'antd'

// import './_videoCall.css';

const Portal = props => {
    /**
     *      tl;dr: create a customize Portal base on React.usePortal
     *
     *      insert a div element to DOM depend on parent component,
     *      if that div is NOT exists on DOM
     *
     * go to @exports ./usePortal to read more.
     */
    const target = usePortal(props.id);

    const [detectExternalWindow, setDetectExternalWindow] = useState(null);

    /**
     * This func below is blocked by CORS policy. Dang it!!
     * 
     * @summary https://stackoverflow.com/a/49160760
     *  
     */
    // const copyStyles = (sourceDoc, targetDoc) => {
    //     Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
    //         if (styleSheet.cssRules) {
    //             // true for inline styles
    //             const newStyleEl = sourceDoc.createElement("style");

    //             Array.from(styleSheet.cssRules).forEach(cssRule => {
    //                 newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
    //             });

    //             targetDoc.head.appendChild(newStyleEl);
    //         } else if (styleSheet.href) {
    //             // true for stylesheets loaded from a URL
    //             const newLinkEl = sourceDoc.createElement("link");

    //             newLinkEl.rel = "stylesheet";
    //             newLinkEl.href = styleSheet.href;
    //             targetDoc.head.appendChild(newLinkEl);
    //         }
    //     });
    // }

    /**
     * 
     *  Copy styles from a source document to a target (parent DOM to new window)
     * 
     */
    const copyStyles = (source, target) => {
        Array.from(source.styleSheets).forEach(styleSheet => {
            // For <style> elements
            let rules;
            try {
                rules = styleSheet.cssRules;
            } catch (err) {
                message.error(err,3);
            }
            if (rules) {
                const newStyleEl = source.createElement("style");

                // Write the text of each rule into the body of the style element
                Array.from(styleSheet.cssRules).forEach(cssRule => {
                    const {cssText, type} = cssRule;
                    let returnText = cssText;

                    /**
                     *  Check if the cssRule type is CSSImportRule (3) or CSSFontFaceRule (5) to handle local imports on a about:blank page
                     * 
                     * @example '/custom.css' turns to 'http://ikemen-hhs.com/custom.css'
                     * 
                     */
                    if ([3, 5].includes(type)) {
                        returnText = cssText
                            .split("url(")
                            .map(line => {
                                if (line[1] === "/") {
                                    return `${line.slice(0, 1)}${window.location.origin}${line.slice(1)}`;
                                }
                                return line;
                            })
                            .join("url(");
                    }
                    newStyleEl.appendChild(source.createTextNode(returnText));
                });

                target.head.appendChild(newStyleEl);
            } else if (styleSheet.href) {
                // for <link> elements loading CSS from a URL
                const newLinkEl = source.createElement("link");

                newLinkEl.rel = "stylesheet";
                newLinkEl.href = styleSheet.href;
                target.head.appendChild(newLinkEl);
            }
        });
    };

    /**
     * Centering new window base on parent window (instead of: center of monitor screen)
     *
     * @param url   link to website that new window will open it
     * @param title Title of new window
     * @param w     width of new window
     * @param h     height of new window
     */
    const customWindowCenter = (url, title, w, h) => {
        // Fixes dual-screen position                             Most browsers       Firefox
        const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
        const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

        const width = window.innerWidth
            ? window.innerWidth
            : document.documentElement.clientWidth
                ? document.documentElement.clientWidth
                : window.screen.width;
        const height = window.innerHeight
            ? window.innerHeight
            : document.documentElement.clientHeight
                ? document.documentElement.clientHeight
                : window.screen.height;

        /**
         * @requires systemZoom for users who use on a split screen option of any monitor. Not really neccesary, just center correction.
         * 
         * @example const systemZoom = width / window.screen.availWidth;
                    const left = (width - w) / 2 / systemZoom + dualScreenLeft;
                    const top = (height - h) / 2 / systemZoom + dualScreenTop;
                    const newWindow = window.open(url, title, 
                        `
                        scrollbars=yes,
                        width=${w / systemZoom}, 
                        height=${h / systemZoom},
                        top=${top}, 
                        left=${left}
                        `
                    );
         */

        const left = width / 2 - w / 2 + dualScreenLeft;
        const top = height / 2 - h / 2 + dualScreenTop;
        const newWindow = window.open(
            url,
            title,
            `
            scrollbars=yes,
            width=${w}, 
            height=${h},
            top=${top}, 
            left=${left}
            `
        );

        if (window.focus) newWindow.focus();
        return newWindow;
    };

    
    useEffect(() => {
        let customWindow = customWindowCenter("", "", (window.screen.width * 60) / 100, (window.screen.height * 70) / 100);

        customWindow.document.title = "IKEMEN Video Call service";
        customWindow.document.body.appendChild(target);

        copyStyles(document, customWindow.document);

        customWindow.addEventListener("beforeunload", () => {
            props.closeWindowPortal();
        });

        setDetectExternalWindow(customWindow);

        return () => {
            customWindow.close();
            setDetectExternalWindow(customWindow);
        };
    }, []);

    return createPortal(props.children, target);
};

export default Portal;
