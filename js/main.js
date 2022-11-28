(function() {
    "use strict";
    var S = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {},
        _ = {
            exports: {}
        };
    (function(v, E) {
        (function(u, l) {
            v.exports = l()
        })(S, function() {
            var u = window.CustomEvent;
            (!u || typeof u == "object") && (u = function(t, o) {
                o = o || {};
                var i = document.createEvent("CustomEvent");
                return i.initCustomEvent(t, !!o.bubbles, !!o.cancelable, o.detail || null), i
            }, u.prototype = window.Event.prototype);

            function l(e, t) {
                var o = "on" + t.type.toLowerCase();
                return typeof e[o] == "function" && e[o](t), e.dispatchEvent(t)
            }

            function g(e) {
                for (; e && e !== document.body;) {
                    var t = window.getComputedStyle(e),
                        o = function(i, a) {
                            return !(t[i] === void 0 || t[i] === a)
                        };
                    if (t.opacity < 1 || o("zIndex", "auto") || o("transform", "none") || o("mixBlendMode", "normal") || o("filter", "none") || o("perspective", "none") || t.isolation === "isolate" || t.position === "fixed" || t.webkitOverflowScrolling === "touch") return !0;
                    e = e.parentElement
                }
                return !1
            }

            function f(e) {
                for (; e;) {
                    if (e.localName === "dialog") return e;
                    e.parentElement ? e = e.parentElement : e.parentNode ? e = e.parentNode.host : e = null
                }
                return null
            }

            function b(e) {
                for (; e && e.shadowRoot && e.shadowRoot.activeElement;) e = e.shadowRoot.activeElement;
                e && e.blur && e !== document.body && e.blur()
            }

            function y(e, t) {
                for (var o = 0; o < e.length; ++o)
                    if (e[o] === t) return !0;
                return !1
            }

            function s(e) {
                return !e || !e.hasAttribute("method") ? !1 : e.getAttribute("method").toLowerCase() === "dialog"
            }

            function h(e) {
                var t = ["button", "input", "keygen", "select", "textarea"],
                    o = t.map(function(c) {
                        return c + ":not([disabled])"
                    });
                o.push('[tabindex]:not([disabled]):not([tabindex=""])');
                var i = e.querySelector(o.join(", "));
                if (!i && "attachShadow" in Element.prototype)
                    for (var a = e.querySelectorAll("*"), r = 0; r < a.length && !(a[r].tagName && a[r].shadowRoot && (i = h(a[r].shadowRoot), i)); r++);
                return i
            }

            function d(e) {
                return e.isConnected || document.body.contains(e)
            }

            function w(e) {
                if (e.submitter) return e.submitter;
                var t = e.target;
                if (!(t instanceof HTMLFormElement)) return null;
                var o = n.formSubmitter;
                if (!o) {
                    var i = e.target,
                        a = "getRootNode" in i && i.getRootNode() || document;
                    o = a.activeElement
                }
                return !o || o.form !== t ? null : o
            }

            function L(e) {
                if (!e.defaultPrevented) {
                    var t = e.target,
                        o = n.imagemapUseValue,
                        i = w(e);
                    o === null && i && (o = i.value);
                    var a = f(t);
                    if (!!a) {
                        var r = i && i.getAttribute("formmethod") || t.getAttribute("method");
                        r === "dialog" && (e.preventDefault(), o != null ? a.close(o) : a.close())
                    }
                }
            }

            function M(e) {
                if (this.dialog_ = e, this.replacedStyleTop_ = !1, this.openAsModal_ = !1, e.hasAttribute("role") || e.setAttribute("role", "dialog"), e.show = this.show.bind(this), e.showModal = this.showModal.bind(this), e.close = this.close.bind(this), e.addEventListener("submit", L, !1), "returnValue" in e || (e.returnValue = ""), "MutationObserver" in window) {
                    var t = new MutationObserver(this.maybeHideModal.bind(this));
                    t.observe(e, {
                        attributes: !0,
                        attributeFilter: ["open"]
                    })
                } else {
                    var o = !1,
                        i = function() {
                            o ? this.downgradeModal() : this.maybeHideModal(), o = !1
                        }.bind(this),
                        a, r = function(c) {
                            if (c.target === e) {
                                var p = "DOMNodeRemoved";
                                o |= c.type.substr(0, p.length) === p, window.clearTimeout(a), a = window.setTimeout(i, 0)
                            }
                        };
                    ["DOMAttrModified", "DOMNodeRemoved", "DOMNodeRemovedFromDocument"].forEach(function(c) {
                        e.addEventListener(c, r)
                    })
                }
                Object.defineProperty(e, "open", {
                    set: this.setOpen.bind(this),
                    get: e.hasAttribute.bind(e, "open")
                }), this.backdrop_ = document.createElement("div"), this.backdrop_.className = "backdrop", this.backdrop_.addEventListener("mouseup", this.backdropMouseEvent_.bind(this)), this.backdrop_.addEventListener("mousedown", this.backdropMouseEvent_.bind(this)), this.backdrop_.addEventListener("click", this.backdropMouseEvent_.bind(this))
            }
            M.prototype = {
                get dialog() {
                    return this.dialog_
                },
                maybeHideModal: function() {
                    this.dialog_.hasAttribute("open") && d(this.dialog_) || this.downgradeModal()
                },
                downgradeModal: function() {
                    !this.openAsModal_ || (this.openAsModal_ = !1, this.dialog_.style.zIndex = "", this.replacedStyleTop_ && (this.dialog_.style.top = "", this.replacedStyleTop_ = !1), this.backdrop_.parentNode && this.backdrop_.parentNode.removeChild(this.backdrop_), n.dm.removeDialog(this))
                },
                setOpen: function(e) {
                    e ? this.dialog_.hasAttribute("open") || this.dialog_.setAttribute("open", "") : (this.dialog_.removeAttribute("open"), this.maybeHideModal())
                },
                backdropMouseEvent_: function(e) {
                    if (this.dialog_.hasAttribute("tabindex")) this.dialog_.focus();
                    else {
                        var t = document.createElement("div");
                        this.dialog_.insertBefore(t, this.dialog_.firstChild), t.tabIndex = -1, t.focus(), this.dialog_.removeChild(t)
                    }
                    var o = document.createEvent("MouseEvents");
                    o.initMouseEvent(e.type, e.bubbles, e.cancelable, window, e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget), this.dialog_.dispatchEvent(o), e.stopPropagation()
                },
                focus_: function() {
                    var e = this.dialog_.querySelector("[autofocus]:not([disabled])");
                    !e && this.dialog_.tabIndex >= 0 && (e = this.dialog_), e || (e = h(this.dialog_)), b(document.activeElement), e && e.focus()
                },
                updateZIndex: function(e, t) {
                    if (e < t) throw new Error("dialogZ should never be < backdropZ");
                    this.dialog_.style.zIndex = e, this.backdrop_.style.zIndex = t
                },
                show: function() {
                    this.dialog_.open || (this.setOpen(!0), this.focus_())
                },
                showModal: function() {
                    if (this.dialog_.hasAttribute("open")) throw new Error("Failed to execute 'showModal' on dialog: The element is already open, and therefore cannot be opened modally.");
                    if (!d(this.dialog_)) throw new Error("Failed to execute 'showModal' on dialog: The element is not in a Document.");
                    if (!n.dm.pushDialog(this)) throw new Error("Failed to execute 'showModal' on dialog: There are too many open modal dialogs.");
                    g(this.dialog_.parentElement) && console.warn("A dialog is being shown inside a stacking context. This may cause it to be unusable. For more information, see this link: https://github.com/GoogleChrome/dialog-polyfill/#stacking-context"), this.setOpen(!0), this.openAsModal_ = !0, n.needsCentering(this.dialog_) ? (n.reposition(this.dialog_), this.replacedStyleTop_ = !0) : this.replacedStyleTop_ = !1, this.dialog_.parentNode.insertBefore(this.backdrop_, this.dialog_.nextSibling), this.focus_()
                },
                close: function(e) {
                    if (!this.dialog_.hasAttribute("open")) throw new Error("Failed to execute 'close' on dialog: The element does not have an 'open' attribute, and therefore cannot be closed.");
                    this.setOpen(!1), e !== void 0 && (this.dialog_.returnValue = e);
                    var t = new u("close", {
                        bubbles: !1,
                        cancelable: !1
                    });
                    l(this.dialog_, t)
                }
            };
            var n = {};
            if (n.reposition = function(e) {
                    var t = document.body.scrollTop || document.documentElement.scrollTop,
                        o = t + (window.innerHeight - e.offsetHeight) / 2;
                    e.style.top = Math.max(t, o) + "px"
                }, n.isInlinePositionSetByStylesheet = function(e) {
                    for (var t = 0; t < document.styleSheets.length; ++t) {
                        var o = document.styleSheets[t],
                            i = null;
                        try {
                            i = o.cssRules
                        } catch {}
                        if (!!i)
                            for (var a = 0; a < i.length; ++a) {
                                var r = i[a],
                                    c = null;
                                try {
                                    c = document.querySelectorAll(r.selectorText)
                                } catch {}
                                if (!(!c || !y(c, e))) {
                                    var p = r.style.getPropertyValue("top"),
                                        k = r.style.getPropertyValue("bottom");
                                    if (p && p !== "auto" || k && k !== "auto") return !0
                                }
                            }
                    }
                    return !1
                }, n.needsCentering = function(e) {
                    var t = window.getComputedStyle(e);
                    return t.position !== "absolute" || e.style.top !== "auto" && e.style.top !== "" || e.style.bottom !== "auto" && e.style.bottom !== "" ? !1 : !n.isInlinePositionSetByStylesheet(e)
                }, n.forceRegisterDialog = function(e) {
                    if ((window.HTMLDialogElement || e.showModal) && console.warn("This browser already supports <dialog>, the polyfill may not work correctly", e), e.localName !== "dialog") throw new Error("Failed to register dialog: The element is not a dialog.");
                    new M(e)
                }, n.registerDialog = function(e) {
                    e.showModal || n.forceRegisterDialog(e)
                }, n.DialogManager = function() {
                    this.pendingDialogStack = [];
                    var e = this.checkDOM_.bind(this);
                    this.overlay = document.createElement("div"), this.overlay.className = "_dialog_overlay", this.overlay.addEventListener("click", function(t) {
                        this.forwardTab_ = void 0, t.stopPropagation(), e([])
                    }.bind(this)), this.handleKey_ = this.handleKey_.bind(this), this.handleFocus_ = this.handleFocus_.bind(this), this.zIndexLow_ = 1e5, this.zIndexHigh_ = 1e5 + 150, this.forwardTab_ = void 0, "MutationObserver" in window && (this.mo_ = new MutationObserver(function(t) {
                        var o = [];
                        t.forEach(function(i) {
                            for (var a = 0, r; r = i.removedNodes[a]; ++a) {
                                if (r instanceof Element) r.localName === "dialog" && o.push(r);
                                else continue;
                                o = o.concat(r.querySelectorAll("dialog"))
                            }
                        }), o.length && e(o)
                    }))
                }, n.DialogManager.prototype.blockDocument = function() {
                    document.documentElement.addEventListener("focus", this.handleFocus_, !0), document.addEventListener("keydown", this.handleKey_), this.mo_ && this.mo_.observe(document, {
                        childList: !0,
                        subtree: !0
                    })
                }, n.DialogManager.prototype.unblockDocument = function() {
                    document.documentElement.removeEventListener("focus", this.handleFocus_, !0), document.removeEventListener("keydown", this.handleKey_), this.mo_ && this.mo_.disconnect()
                }, n.DialogManager.prototype.updateStacking = function() {
                    for (var e = this.zIndexHigh_, t = 0, o; o = this.pendingDialogStack[t]; ++t) o.updateZIndex(--e, --e), t === 0 && (this.overlay.style.zIndex = --e);
                    var i = this.pendingDialogStack[0];
                    if (i) {
                        var a = i.dialog.parentNode || document.body;
                        a.appendChild(this.overlay)
                    } else this.overlay.parentNode && this.overlay.parentNode.removeChild(this.overlay)
                }, n.DialogManager.prototype.containedByTopDialog_ = function(e) {
                    for (; e = f(e);) {
                        for (var t = 0, o; o = this.pendingDialogStack[t]; ++t)
                            if (o.dialog === e) return t === 0;
                        e = e.parentElement
                    }
                    return !1
                }, n.DialogManager.prototype.handleFocus_ = function(e) {
                    var t = e.composedPath ? e.composedPath()[0] : e.target;
                    if (!this.containedByTopDialog_(t) && document.activeElement !== document.documentElement && (e.preventDefault(), e.stopPropagation(), b(t), this.forwardTab_ !== void 0)) {
                        var o = this.pendingDialogStack[0],
                            i = o.dialog,
                            a = i.compareDocumentPosition(t);
                        return a & Node.DOCUMENT_POSITION_PRECEDING && (this.forwardTab_ ? o.focus_() : t !== document.documentElement && document.documentElement.focus()), !1
                    }
                }, n.DialogManager.prototype.handleKey_ = function(e) {
                    if (this.forwardTab_ = void 0, e.keyCode === 27) {
                        e.preventDefault(), e.stopPropagation();
                        var t = new u("cancel", {
                                bubbles: !1,
                                cancelable: !0
                            }),
                            o = this.pendingDialogStack[0];
                        o && l(o.dialog, t) && o.dialog.close()
                    } else e.keyCode === 9 && (this.forwardTab_ = !e.shiftKey)
                }, n.DialogManager.prototype.checkDOM_ = function(e) {
                    var t = this.pendingDialogStack.slice();
                    t.forEach(function(o) {
                        e.indexOf(o.dialog) !== -1 ? o.downgradeModal() : o.maybeHideModal()
                    })
                }, n.DialogManager.prototype.pushDialog = function(e) {
                    var t = (this.zIndexHigh_ - this.zIndexLow_) / 2 - 1;
                    return this.pendingDialogStack.length >= t ? !1 : (this.pendingDialogStack.unshift(e) === 1 && this.blockDocument(), this.updateStacking(), !0)
                }, n.DialogManager.prototype.removeDialog = function(e) {
                    var t = this.pendingDialogStack.indexOf(e);
                    t !== -1 && (this.pendingDialogStack.splice(t, 1), this.pendingDialogStack.length === 0 && this.unblockDocument(), this.updateStacking())
                }, n.dm = new n.DialogManager, n.formSubmitter = null, n.imagemapUseValue = null, window.HTMLDialogElement === void 0) {
                var D = document.createElement("form");
                if (D.setAttribute("method", "dialog"), D.method !== "dialog") {
                    var m = Object.getOwnPropertyDescriptor(HTMLFormElement.prototype, "method");
                    if (m) {
                        var A = m.get;
                        m.get = function() {
                            return s(this) ? "dialog" : A.call(this)
                        };
                        var C = m.set;
                        m.set = function(e) {
                            return typeof e == "string" && e.toLowerCase() === "dialog" ? this.setAttribute("method", e) : C.call(this, e)
                        }, Object.defineProperty(HTMLFormElement.prototype, "method", m)
                    }
                }
                document.addEventListener("click", function(e) {
                    if (n.formSubmitter = null, n.imagemapUseValue = null, !e.defaultPrevented) {
                        var t = e.target;
                        if ("composedPath" in e) {
                            var o = e.composedPath();
                            t = o.shift() || t
                        }
                        if (!(!t || !s(t.form))) {
                            var i = t.type === "submit" && ["button", "input"].indexOf(t.localName) > -1;
                            if (!i) {
                                if (!(t.localName === "input" && t.type === "image")) return;
                                n.imagemapUseValue = e.offsetX + "," + e.offsetY
                            }
                            var a = f(t);
                            !a || (n.formSubmitter = t)
                        }
                    }
                }, !1), document.addEventListener("submit", function(e) {
                    var t = e.target,
                        o = f(t);
                    if (!o) {
                        var i = w(e),
                            a = i && i.getAttribute("formmethod") || t.getAttribute("method");
                        a === "dialog" && e.preventDefault()
                    }
                });
                var O = HTMLFormElement.prototype.submit,
                    N = function() {
                        if (!s(this)) return O.call(this);
                        var e = f(this);
                        e && e.close()
                    };
                HTMLFormElement.prototype.submit = N
            }
            return n
        })
    })(_);
    var x = _.exports;

    function T(v, E, u = !0) {
        const l = document.querySelector(v),
            g = document.querySelector(E);
        if (!l || !g) return;
        typeof HTMLDialogElement != "function" && x.registerDialog(l);
        const f = (s = !0) => {
                document.body.style.overflow = s ? "hidden" : ""
            },
            b = (s, h, d) => {
                !h.target.closest(s) || (d.close(), g.setAttribute("aria-expanded", "false"))
            },
            y = (s, h) => {
                const d = h.getBoundingClientRect();
                d.top <= s.clientY && s.clientY <= d.top + d.height && d.left <= s.clientX && s.clientX <= d.left + d.width || h.close("dismiss")
            };
        g.addEventListener("click", () => {
            g.setAttribute("aria-expanded", "true"), u ? (l.showModal(), f()) : l.show()
        }), l.addEventListener("click", s => {
            b(".close", s, l)
        }), l.addEventListener("mouseup", s => {
            y(s, l)
        }), u && (l.addEventListener("close", () => f(!1)), l.addEventListener("cancel", () => f(!1)))
    }
    T("#offcanvas-menu", "#show-offcanvas-menu"), window.addEventListener("load", () => {
        "serviceWorker" in navigator && navigator.serviceWorker.register("/sw.js")
    })
})();
