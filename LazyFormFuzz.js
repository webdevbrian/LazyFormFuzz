javascript: (function (w) {
    var b = function (e, h) {
        var c = b.resolve(e, h || "/"),
            f = b.modules[c];
        if (!f) throw Error("Failed to resolve module " + e + ", tried " + c);
        return f._cached ? f._cached : f()
    };
    b.paths = [];
    b.modules = {};
    b.extensions = [".js", ".coffee"];
    b._core = {
        assert: !0,
        events: !0,
        fs: !0,
        path: !0,
        vm: !0
    };
    b.resolve = function () {
        return function (e, h) {
            function c(a) {
                if (b.modules[a]) return a;
                for (var g = 0; g < b.extensions.length; g++) {
                    var n = b.extensions[g];
                    if (b.modules[a + n]) return a + n
                }
            }

            function f(a) {
                a = a.replace(/\/+$/, "");
                var g = a + "/package.json";
                if (b.modules[g]) {
                    var g = b.modules[g](),
                        n = g.browserify;
                    if ("object" == typeof n && n.main) {
                        if (g = c(l.resolve(a, n.main))) return g
                    } else if ("string" == typeof n) {
                        if (g = c(l.resolve(a, n))) return g
                    } else if (g.main && (g = c(l.resolve(a, g.main)))) return g
                }
                return c(a + "/index")
            }
            h || (h = "/");
            if (b._core[e]) return e;
            var l = b.modules.path(),
                a = h || ".";
            if (e.match(/^(?:\.\.?\/|\/)/)) {
                var d = c(l.resolve(a, e)) || f(l.resolve(a, e));
                if (d) return d
            }
            if (a = function (a, g) {
                var n;
                "/" === g ? n = [""] : n = l.normalize(g).split("/");
                for (var p = [], q = n.length - 1; 0 <=
                    q; q--)
                    if ("node_modules" !== n[q]) {
                        var d = n.slice(0, q + 1).join("/") + "/node_modules";
                        p.push(d)
                    }
                for (n = 0; n < p.length; n++) {
                    q = p[n];
                    if (d = c(q + "/" + a)) return d;
                    if (q = f(q + "/" + a)) return q
                }
                if (d = c(a)) return d
            }(e, a)) return a;
            throw Error("Cannot find module '" + e + "'");
        }
    }();
    b.alias = function (e, h) {
        var c = b.modules.path(),
            f = null;
        try {
            f = b.resolve(e + "/package.json", "/")
        } catch (l) {
            f = b.resolve(e, "/")
        }
        for (var c = c.dirname(f), f = (Object.keys || function (a) {
                var g = [],
                    n;
                for (n in a) g.push(n);
                return g
            })(b.modules), a = 0; a < f.length; a++) {
            var d =
                f[a];
            d.slice(0, c.length + 1) === c + "/" ? (d = d.slice(c.length), b.modules[h + d] = b.modules[c + d]) : d === c && (b.modules[h] = b.modules[c])
        }
    };
    b.define = function (e, h) {
        var c = b._core[e] ? "" : b.modules.path().dirname(e),
            f = function (a) {
                return b(a, c)
            };
        f.resolve = function (a) {
            return b.resolve(a, c)
        };
        f.modules = b.modules;
        f.define = b.define;
        var l = {
            exports: {}
        };
        b.modules[e] = function () {
            return b.modules[e]._cached = l.exports, h.call(l.exports, f, l, l.exports, c, e), b.modules[e]._cached = l.exports, l.exports
        }
    };
    "undefined" == typeof process && (process = {});
    process.nextTick || (process.nextTick = function () {
        var e = [],
            b = "undefined" != typeof window && window.postMessage && window.addEventListener;
        return b && window.addEventListener("message", function (c) {
            c.source === window && "browserify-tick" === c.data && (c.stopPropagation(), 0 < e.length && e.shift()())
        }, !0),
        function (c) {
            b ? (e.push(c), window.postMessage("browserify-tick", "*")) : setTimeout(c, 0)
        }
    }());
    process.title || (process.title = "browser");
    process.binding || (process.binding = function (e) {
        if ("evals" === e) return b("vm");
        throw Error("No such module");
    });
    process.cwd || (process.cwd = function () {
        return "."
    });
    b.define("path", function (b, h, c, f, l) {
        function a(a, n) {
            for (var p = [], c = 0; c < a.length; c++) n(a[c], c, a) && p.push(a[c]);
            return p
        }

        function d(a, c) {
            for (var p = 0, d = a.length; 0 <= d; d--) {
                var b = a[d];
                "." == b ? a.splice(d, 1) : ".." === b ? (a.splice(d, 1), p++) : p && (a.splice(d, 1), p--)
            }
            if (c)
                for (; p--; p) a.unshift("..");
            return a
        }
        var s = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;
        c.resolve = function () {
            for (var g = "", c = !1, p = arguments.length; - 1 <= p && !c; p--) {
                var b = 0 <= p ? arguments[p] : process.cwd();
                "string" == typeof b && b && (g = b + "/" + g, c = "/" === b.charAt(0))
            }
            return g = d(a(g.split("/"), function (a) {
                return !!a
            }), !c).join("/"), (c ? "/" : "") + g || "."
        };
        c.normalize = function (c) {
            var b = "/" === c.charAt(0),
                p = "/" === c.slice(-1);
            return c = d(a(c.split("/"), function (a) {
                return !!a
            }), !b).join("/"), !c && !b && (c = "."), c && p && (c += "/"), (b ? "/" : "") + c
        };
        c.join = function () {
            var d = Array.prototype.slice.call(arguments, 0);
            return c.normalize(a(d, function (a, c) {
                return a && "string" == typeof a
            }).join("/"))
        };
        c.dirname = function (a) {
            return (a = s.exec(a)[1] ||
                "") ? 1 === a.length ? a : a.substring(0, a.length - 1) : "."
        };
        c.basename = function (a, c) {
            var d = s.exec(a)[2] || "";
            return c && d.substr(-1 * c.length) === c && (d = d.substr(0, d.length - c.length)), d
        };
        c.extname = function (a) {
            return s.exec(a)[3] || ""
        }
    });
    b.define("/node_modules/ret/package.json", function (b, h, c, f, l) {
        h.exports = {
            main: "./lib/index.js"
        }
    });
    b.define("/node_modules/ret/lib/index.js", function (b, h, c, f, l) {
        var a = b("./util"),
            d = b("./types"),
            s = b("./sets"),
            g = b("./positions");
        h.exports = function (c) {
            var b = 0,
                e, m, r = {
                    type: d.ROOT,
                    stack: []
                },
                t = r,
                k = r.stack,
                B = [],
                h = function (b) {
                    a.error(c, "Nothing to repeat at column " + (b - 1))
                }, f = a.strToChars(c);
            for (e = f.length; b < e;) switch (m = f[b++], m) {
            case "\\":
                m = f[b++];
                switch (m) {
                case "b":
                    k.push(g.wordBoundary());
                    break;
                case "B":
                    k.push(g.nonWordBoundary());
                    break;
                case "w":
                    k.push(s.words());
                    break;
                case "W":
                    k.push(s.notWords());
                    break;
                case "d":
                    k.push(s.ints());
                    break;
                case "D":
                    k.push(s.notInts());
                    break;
                case "s":
                    k.push(s.whitespace());
                    break;
                case "S":
                    k.push(s.notWhitespace());
                    break;
                default:
                    /\d/.test(m) ? k.push({
                        type: d.REFERENCE,
                        value: parseInt(m, 10)
                    }) : k.push({
                        type: d.CHAR,
                        value: m.charCodeAt(0)
                    })
                }
                break;
            case "^":
                k.push(g.begin());
                break;
            case "$":
                k.push(g.end());
                break;
            case "[":
                var l;
                "^" === f[b] ? (l = !0, b++) : l = !1;
                m = a.tokenizeClass(f.slice(b), c);
                b += m[1];
                k.push({
                    type: d.SET,
                    set: m[0],
                    not: l
                });
                break;
            case ".":
                k.push(s.anyChar());
                break;
            case "(":
                var v = {
                    type: d.GROUP,
                    stack: [],
                    remember: !0
                };
                m = f[b];
                "?" === m && (m = f[b + 1], b += 2, "=" === m ? v.followedBy = !0 : "!" === m ? v.notFollowedBy = !0 : ":" !== m && a.error(c, "Invalid character '" + m + "' after '?' at column " + (b - 1)),
                    v.remember = !1);
                k.push(v);
                B.push(t);
                t = v;
                k = v.stack;
                break;
            case ")":
                0 === B.length && a.error(c, "Unmatched ) at column " + (b - 1));
                t = B.pop();
                k = t.options ? t.options[t.options.length - 1] : t.stack;
                break;
            case "|":
                t.options || (t.options = [t.stack], delete t.stack);
                k = [];
                t.options.push(k);
                break;
            case "{":
                m = /^(\d+)(,(\d+)?)?\}/.exec(f.slice(b));
                var C, E;
                null !== m ? (C = parseInt(m[1], 10), E = m[2] ? m[3] ? parseInt(m[3], 10) : Infinity : C, b += m[0].length, k.push({
                    type: d.REPETITION,
                    min: C,
                    max: E,
                    value: k.pop()
                })) : k.push({
                    type: d.CHAR,
                    value: 123
                });
                break;
            case "?":
                0 === k.length && h(b);
                k.push({
                    type: d.REPETITION,
                    min: 0,
                    max: 1,
                    value: k.pop()
                });
                break;
            case "+":
                0 === k.length && h(b);
                k.push({
                    type: d.REPETITION,
                    min: 1,
                    max: Infinity,
                    value: k.pop()
                });
                break;
            case "*":
                0 === k.length && h(b);
                k.push({
                    type: d.REPETITION,
                    min: 0,
                    max: Infinity,
                    value: k.pop()
                });
                break;
            default:
                k.push({
                    type: d.CHAR,
                    value: m.charCodeAt(0)
                })
            }
            return r
        };
        h.exports.types = d
    });
    b.define("/node_modules/ret/lib/util.js", function (b, h, c, f, l) {
        var a = b("./types"),
            d = b("./sets"),
            s = {
                0: 0,
                t: 9,
                n: 10,
                v: 11,
                f: 12,
                r: 13
            }, g = h.exports = {
                strToChars: function (a) {
                    return a = a.replace(/(\[\\b\])|\\(?:u([A-F0-9]{4})|x([A-F0-9]{2})|(0?[0-7]{2})|c([@A-Z\[\\\]\^?])|([0tnvfr]))/g, function (a, b, c, r, d, k, g) {
                        a = b ? 8 : c ? parseInt(c, 16) : r ? parseInt(r, 16) : d ? parseInt(d, 8) : k ? "@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^ ?".indexOf(k) : g ? s[g] : w;
                        a = String.fromCharCode(a);
                        return /[\[\]{}\^$.|?*+()]/.test(a) && (a = "\\" + a), a
                    }), a
                },
                tokenizeClass: function (c, b) {
                    for (var e = [], f = /\\(?:(w)|(d)|(s)|(W)|(D)|(S))|((?:(?:\\)(.)|([^\\]))-(?:\\)?([^\]]))|(\])|(?:\\)?(.)/g, r; null != (r = f.exec(c));)
                        if (r[1]) e.push(d.words());
                        else if (r[2]) e.push(d.ints());
                    else if (r[3]) e.push(d.whitespace());
                    else if (r[4]) e.push(d.notWords());
                    else if (r[5]) e.push(d.notInts());
                    else if (r[6]) e.push(d.notWhitespace());
                    else if (r[7]) e.push({
                        type: a.RANGE,
                        from: (r[8] || r[9]).charCodeAt(0),
                        to: r[10].charCodeAt(0)
                    });
                    else {
                        if (!(r = r[12])) return [e, f.lastIndex];
                        e.push({
                            type: a.CHAR,
                            value: r.charCodeAt(0)
                        })
                    }
                    g.error(b, "Missing ']'")
                },
                error: function (a, c) {
                    throw Error("Invalid regular expression: /" + a + "/: " + c);
                }
            }
    });
    b.define("/node_modules/ret/lib/types.js", function (b,
        h, c, f, l) {
        h.exports = {
            ROOT: 0,
            GROUP: 1,
            POSITION: 2,
            SET: 3,
            RANGE: 4,
            REPETITION: 5,
            REFERENCE: 6,
            CHAR: 7
        }
    });
    b.define("/node_modules/ret/lib/sets.js", function (b, h, c, f, l) {
        var a = b("./types"),
            d = function () {
                return [{
                    type: a.RANGE,
                    from: 48,
                    to: 57
                }]
            }, s = function () {
                return [{
                    type: a.RANGE,
                    from: 97,
                    to: 122
                }, {
                    type: a.RANGE,
                    from: 65,
                    to: 90
                }].concat(d())
            }, g = function () {
                return [{
                    type: a.CHAR,
                    value: 12
                }, {
                    type: a.CHAR,
                    value: 10
                }, {
                    type: a.CHAR,
                    value: 13
                }, {
                    type: a.CHAR,
                    value: 9
                }, {
                    type: a.CHAR,
                    value: 11
                }, {
                    type: a.CHAR,
                    value: 160
                }, {
                    type: a.CHAR,
                    value: 5760
                }, {
                    type: a.CHAR,
                    value: 6158
                }, {
                    type: a.CHAR,
                    value: 8192
                }, {
                    type: a.CHAR,
                    value: 8193
                }, {
                    type: a.CHAR,
                    value: 8194
                }, {
                    type: a.CHAR,
                    value: 8195
                }, {
                    type: a.CHAR,
                    value: 8196
                }, {
                    type: a.CHAR,
                    value: 8197
                }, {
                    type: a.CHAR,
                    value: 8198
                }, {
                    type: a.CHAR,
                    value: 8199
                }, {
                    type: a.CHAR,
                    value: 8200
                }, {
                    type: a.CHAR,
                    value: 8201
                }, {
                    type: a.CHAR,
                    value: 8202
                }, {
                    type: a.CHAR,
                    value: 8232
                }, {
                    type: a.CHAR,
                    value: 8233
                }, {
                    type: a.CHAR,
                    value: 8239
                }, {
                    type: a.CHAR,
                    value: 8287
                }, {
                    type: a.CHAR,
                    value: 12288
                }]
            };
        c.words = function () {
            return {
                type: a.SET,
                set: s(),
                not: !1
            }
        };
        c.notWords = function () {
            return {
                type: a.SET,
                set: s(),
                not: !0
            }
        };
        c.ints = function () {
            return {
                type: a.SET,
                set: d(),
                not: !1
            }
        };
        c.notInts = function () {
            return {
                type: a.SET,
                set: d(),
                not: !0
            }
        };
        c.whitespace = function () {
            return {
                type: a.SET,
                set: g(),
                not: !1
            }
        };
        c.notWhitespace = function () {
            return {
                type: a.SET,
                set: g(),
                not: !0
            }
        };
        c.anyChar = function () {
            return {
                type: a.SET,
                set: [{
                    type: a.CHAR,
                    value: 10
                }],
                not: !0
            }
        }
    });
    b.define("/node_modules/ret/lib/positions.js", function (b, h, c, f, l) {
        var a = b("./types");
        c.wordBoundary = function () {
            return {
                type: a.POSITION,
                value: "b"
            }
        };
        c.nonWordBoundary = function () {
            return {
                type: a.POSITION,
                value: "B"
            }
        };
        c.begin = function () {
            return {
                type: a.POSITION,
                value: "^"
            }
        };
        c.end = function () {
            return {
                type: a.POSITION,
                value: "$"
            }
        }
    });
    b.define("/randexp.js", function (b, h, c, f, l) {
        var a = b("ret"),
            d = a.types,
            s = function (a) {
                return a + (97 <= a && 122 >= a ? -32 : 65 <= a && 90 >= a ? 32 : 0)
            }, g = function (a, b, c, d) {
                return a <= c && c <= b ? {
                    from: c,
                    to: Math.min(b, d)
                } : a <= d && d <= b ? {
                    from: Math.max(a, c),
                    to: d
                } : !1
            }, n = function (a, b, c) {
                for (var e, f, h = [], m = !1, l = 0, p = a.length; l < p; l++) switch (e = a[l], e.type) {
                case d.CHAR:
                    f = e.value;
                    if (f === b || c && s(f) === b) return !0;
                    break;
                case d.RANGE:
                    if (e.from <=
                        b && b <= e.to || c && (!1 !== (f = g(97, 122, e.from, e.to)) && f.from <= b && b <= f.to || !1 !== (f = g(65, 90, e.from, e.to)) && f.from <= b && b <= f.to)) return !0;
                    break;
                case d.SET:
                    var q;
                    if (q = 0 < h.length) a: {
                        q = h;
                        for (var w = e, D = 0, G = q.length; D < G; D++) {
                            var x = q[D],
                                u;
                            if (u = x.not !== w.not) b: {
                                x = x.set;
                                u = w.set;
                                var y = void 0,
                                    F = void 0,
                                    z = void 0,
                                    A = void 0;
                                if ((F = x.length) !== u.length) u = !1;
                                else {
                                    for (y = 0; y < F; y++)
                                        for (z in A = x[y], A)
                                            if (A.hasOwnProperty(z) && A[z] !== u[y][z]) {
                                                u = !1;
                                                break b
                                            }
                                    u = !0
                                }
                            }
                            if (u) {
                                q = !0;
                                break a
                            }
                        }
                        q = !1
                    }
                    q ? m = !0 : h.push(e);
                    if (!m && n(e.set, b, c) !== e.not) return !0
                }
                return !1
            },
            p = function (a, b, c) {
                var e, f, g, h;
                switch (a.type) {
                case d.ROOT:
                case d.GROUP:
                    if (a.notFollowedBy) return "";
                    a.remember && (e = b.push(!0) - 1);
                    f = a.options ? a.options[Math.floor(Math.random() * a.options.length)] : a.stack;
                    c = "";
                    g = 0;
                    for (h = f.length; g < h; g++) c += p.call(this, f[g], b);
                    return a.remember && (b[e] = c), c;
                case d.POSITION:
                    return "";
                case d.SET:
                    e = !! c !== a.not;
                    if (!e) return p.call(this, a.set[Math.floor(Math.random() * a.set.length)], b, e);
                    for (;;)
                        if (b = this.anyRandChar(), e = b.charCodeAt(0), !n(a.set, e, this.ignoreCase)) return b;
                    break;
                case d.RANGE:
                    return a = a.from + Math.floor(Math.random() * (1 + a.to - a.from)), String.fromCharCode(this.ignoreCase && 0.5 < Math.random() ? s(a) : a);
                case d.REPETITION:
                    e = a.min + Math.floor(Math.random() * (1 + (Infinity === a.max ? a.min + this.max : a.max) - a.min));
                    c = "";
                    for (g = 0; g < e; g++) c += p.call(this, a.value, b);
                    return c;
                case d.REFERENCE:
                    return b[a.value - 1];
                case d.CHAR:
                    return String.fromCharCode(this.ignoreCase && 0.5 < Math.random() ? s(a.value) : a.value)
                }
            }, q = h.exports = function (b, c) {
                if (b instanceof RegExp) this.ignoreCase = b.ignoreCase,
                this.multiline = b.multiline, "number" == typeof b.max && (this.max = b.max), "function" == typeof b.anyRandChar && (this.anyRandChar = b.anyRandChar), b = b.source;
                else {
                    if ("string" != typeof b) throw Error("Expected a regexp or string");
                    this.ignoreCase = c && -1 !== c.indexOf("i");
                    this.multiline = c && -1 !== c.indexOf("m")
                }
                this.tokens = a(b)
            };
        q.prototype.max = 100;
        q.prototype.anyRandChar = function () {
            return String.fromCharCode(0 + Math.floor(65536 * Math.random()))
        };
        q.prototype.gen = function () {
            return p.call(this, this.tokens, [])
        };
        var m = q.randexp =
            function (a, b) {
                var c;
                return a._randexp === w ? (c = new q(a, b), a._randexp = c) : (c = a._randexp, "number" == typeof a.max && (c.max = a.max), "function" == typeof a.anyRandChar && (c.anyRandChar = a.anyRandChar)), c.gen()
        };
        q.sugar = function () {
            RegExp.prototype.gen = function () {
                return m(this)
            }
        }
    });
    ! function (b, h) {
        "function" == typeof define && "object" == typeof define.amd ? define(b, function () {
            return h
        }) : "undefined" != typeof window && (window[b] = h)
    }("RandExp", b("/randexp.js"))
})();;
/*
 MIT
*/
(function (m, q) {
    var l = {
        email: /[a-z0-9._+\-]{1,20}@[a-z0-9]{3,15}\.[a-z]{2,4}/i,
        url: /^(https?:\/\/)([a-z\.\-]+)\.([a-z\.]{2,6})\/?$/,
        sql: /[a-z0-9"'`\-]{5,17}/,
        text: /[\x20-\x7E]{10,15}/,
        textarea: /[\x20-\x7E]{10,30}/,
        color: /^\#[0-9a-f]{6}$/i,
        tel: /[0-9+\-]{7,15}/,
        alphanumeric: /[A-Z][0-9]+/i,
        week: /(20|1[0-9])[0-9]{2}-W(5[1-2]|[1-4][0-9]|0[1-9])/,
        month: /(20|1[0-9])[0-9]{2}-(1[0-2]|0[1-9])/,
        datetime: /(20|1[0-9])[0-9]{2}-(1[0-2]|0[1-9])-(2[0-8]|1[0-9]|0[1-9])T(2[0-3]|[0-1][0-9]):[0-5][0-9]Z/,
        "datetime-local": /(20|1[0-9])[0-9]{2}-(1[0-2]|0[1-9])-(2[0-8]|1[0-9]|0[1-9])T(2[0-3]|[0-1][0-9]):[0-5][0-9]/,
        date: /(20|1[0-9])[0-9]{2}-(1[0-2]|0[1-9])-(2[0-8]|1[0-9]|0[1-9])/,
        time: /(2[0-3]|[0-1][0-9]):[0-5][0-9]/
    };
    Array.prototype.forEach || (Array.prototype.forEach = function (d, e) {
        for (var b = 0, c = this.length; b < c; ++b) b in this && d.call(e, this[b], b, this)
    });
    var r = function (d) {
        var e = [],
            b = arguments.length,
            c = "",
            a = 1,
            g = "",
            h = {};
        a: for (c in d)
            for (a = 1; a < b; a++) {
                h = arguments[a];
                for (g in h)
                    if (h[g] === d[c]) continue a;
                e.push(d[c])
            }
        return e
    }, s = function (d, e, b) {
            e = e || 1;
            b = b || 0;
            d = Math.round((d || 1E3) / e);
            return Math.ceil(Math.random() * d) *
                e - b
        }, n = function (d, e) {
            var b, c, a, g = d.querySelectorAll("input, select, textarea"),
                h = g.length;
            b = d.querySelectorAll("option");
            [].forEach.call(b, function (a) {
                a.selected = !1
            });
            b = d.querySelectorAll("[checked]");
            [].forEach.call(b, function (a) {
                a.checked = !1
            });
            for (b = 0; b < h; b++)
                if (a = g[b], !a.hasAttribute("readonly") && !a.hasAttribute("disabled"))
                    if (a.hasAttribute("checked") && (a.checked = !1), a.hasAttribute("pattern")) c = a.getAttribute("pattern"), a.value = (new m(c)).gen();
                    else {
                        if (!1 === a.hasAttribute("type") && "INPUT" !== a.nodeName) switch (a.nodeName) {
                        case "TEXTAREA":
                            c =
                                (new m(l.textarea)).gen();
                            a.value = c;
                            continue;
                        case "SELECT":
                            a = a.querySelectorAll("option");
                            a[Math.floor(Math.random() * a.length)].selected = !0;
                            continue;
                        default:
                            continue
                        }
                        c = a.getAttribute("type");
                        var k, f = {};
                        switch (c) {
                        case "radio":
                            null == f[a.name] && (c = r(d.querySelectorAll("input[type=radio][name=" + a.name + "]"), d.querySelectorAll("[name=" + a.name + "][disabled]")), c[Math.floor(Math.random() * c.length)].checked = !0, f[a.name] = !0);
                            continue;
                        case "number":
                        case "range":
                            a.value = s(a.getAttribute("max"), a.getAttribute("step"),
                                a.getAttribute("min"));
                            continue;
                        case "checkbox":
                            c = Math.round(Math.random());
                            a.checked = c;
                            continue;
                        case "search":
                        case "text":
                            k = l.text;
                            break;
                        case "hidden":
                        case "button":
                        case "image":
                        case "file":
                        case "password":
                        case "reset":
                        case "submit":
                            continue;
                        default:
                            null != l[c] && (k = l[c])
                        }
                        null !== k && k !== q && (f = (new m(k)).gen(), a.value = f, String(a.value).toLowerCase() != String(f).toLowerCase() && (console.log(c + " : " + f), console.log(a.value)))
                    }
        };
    n(document);
    var p = document.querySelectorAll("frame, iframe");
    0 < p.length && [].forEach.call(p,
        function (d) {
            n(d.contentWindow.document)
        })
})(RandExp);