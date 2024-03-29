(() => {
  "use strict";
  var t = {
      50377: (t, e) => {
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.InterceptorAdapter = e.RequestValidator = void 0);
        e.RequestValidator = class {};
        e.InterceptorAdapter = class {};
      },
      46444: (t, e) => {
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.MessageScriptType = e.MessageContentType = void 0),
          (function (t) {
            (t.ECOMMERCE_INIT = "ECOMMERCE_INIT"),
              (t.ECOMMERCE_RE_INIT = "ECOMMERCE_RE_INIT"),
              (t.ECOMMERCE_TRACK = "ECOMMERCE_TRACK"),
              (t.ECOMMERCE_RUNTIME_STORAGE_SAVE =
                "ECOMMERCE_RUNTIME_STORAGE_SAVE"),
              (t.ERROR_TRACE = "ERROR_TRACE"),
              (t.ECOMMERCE_INIT_SHOPIFY = "ECOMMERCE_INIT_SHOPIFY");
          })(e.MessageContentType || (e.MessageContentType = {})),
          (function (t) {
            (t.INIT_HTTP_CONFIG = "INIT_HTTP_CONFIG"),
              (t.SAVE_HTTP_DATA = "SAVE_HTTP_DATA"),
              (t.CUSTOM_ON_URL_CHANGED = "CUSTOM_ON_URL_CHANGED"),
              (t.HTTP_SCRIPT_INITIATED = "HTTP_SCRIPT_INITIATED"),
              (t.SHOPIFY_DETECTED = "SHOPIFY_DETECTED");
          })(e.MessageScriptType || (e.MessageScriptType = {}));
      },
    },
    e = {};
  function s(n) {
    var a = e[n];
    if (void 0 !== a) return a.exports;
    var i = (e[n] = { exports: {} });
    return t[n](i, i.exports, s), i.exports;
  }
  (() => {
    const t = s(46444),
      e = s(50377);
    ((s) => {
      class n extends e.RequestValidator {
        validateRequest(t, e = "GET") {
          return (
            !!this.onHttpRequest?.length &&
            (this.onHttpRequest.find(this.httpMatherPredicate(t, e)) ?? !1)
          );
        }
        validateResponse(t, e = "GET") {
          return (
            !!this.onHttpResponse?.length &&
            (this.onHttpResponse.find(this.httpMatherPredicate(t, e)) ?? !1)
          );
        }
        setConfig(t, e) {
          (this.onHttpRequest = t), (this.onHttpResponse = e);
        }
        httpMatherPredicate(t, e) {
          return ({ regex: s, methods: n }) => {
            const a = new RegExp(s, "i");
            return n.includes(e) && a.test(t);
          };
        }
      }
      class a extends e.InterceptorAdapter {
        constructor(t, e) {
          super(),
            (this.validator = t),
            (this.communicator = e),
            this.initInterceptor();
        }
        static init(t, e) {
          this.instance || (this.instance = new a(t, e));
        }
        async interceptRequest(t, e) {
          const s = e?.method,
            n = this.validator.validateRequest(t, s);
          n &&
            this.communicator.dispatchEvent({
              variable: n.var,
              payload: { url: t, params: e },
            });
        }
        async interceptResponse(t, [e, s]) {
          const n = s?.method,
            a = this.validator.validateResponse(e, n);
          a && (await this.proceedResponse(t, a.var));
        }
        async proceedResponse(t, e) {
          const s = await t.clone(),
            n = t.headers.get("content-type");
          n &&
            (n.includes("json")
              ? this.communicator.dispatchEvent({
                  variable: e,
                  payload: await s.json(),
                })
              : n.includes("text") &&
                this.communicator.dispatchEvent({
                  variable: e,
                  payload: await s.text(),
                }));
        }
        initInterceptor() {
          const t = s.fetch;
          s.fetch = async (...e) => {
            this.interceptRequest(...e);
            const s = await t(...e);
            return this.interceptResponse(s, e), s;
          };
        }
      }
      class i extends e.InterceptorAdapter {
        constructor(t, e) {
          super(),
            (this.validator = t),
            (this.communicator = e),
            this.initInterceptor();
        }
        static init(t, e) {
          this.instance || (this.instance = new i(t, e));
        }
        async interceptRequest({ method: t, url: e, body: s }) {
          const n = this.validator.validateRequest(e, t);
          n &&
            this.communicator.dispatchEvent({
              variable: n.var,
              payload: { url: e, params: { method: t, body: s } },
            });
        }
        async interceptResponse({
          status: t,
          response: e,
          responseType: s,
          method: n,
          url: a,
        }) {
          const i = this.validator.validateResponse(a, n);
          `${t}`.startsWith("20") && i && this.proceedResponse(e, s, i.var);
        }
        proceedResponse(t, e, s) {
          if ("json" === e)
            this.communicator.dispatchEvent({ variable: s, payload: t });
          else if ("text" === e || "" === e)
            try {
              this.communicator.dispatchEvent({
                variable: s,
                payload: JSON.parse(t),
              });
            } catch {
              this.communicator.dispatchEvent({ variable: s, payload: t });
            }
        }
        initInterceptor() {
          const t = XMLHttpRequest.prototype.open,
            e = XMLHttpRequest.prototype.send,
            n = this;
          (s.XMLHttpRequest.prototype.open = function (...e) {
            return (
              (this.__METHOD__ = e[0]),
              (this.__URL__ = e[1]),
              this.addEventListener("load", function ({ target: t }) {
                n.interceptResponse({
                  status: t.status,
                  response: t.response,
                  responseType: t.responseType,
                  method: e[0],
                  url: e[1],
                });
              }),
              t.apply(this, e)
            );
          }),
            (s.XMLHttpRequest.prototype.send = function (...t) {
              return (
                n.interceptRequest({
                  method: this.__METHOD__,
                  url: this.__URL__,
                  body: t[0],
                }),
                e.apply(this, t)
              );
            });
        }
      }
      const o = new (class {
          constructor() {
            this.dispatchInitEvent();
          }
          dispatchEvent(e) {
            const n = {
              _custom_type_: t.MessageScriptType.SAVE_HTTP_DATA,
              payload: e,
            };
            s.postMessage(n);
          }
          dispatchInitEvent() {
            const e = {
              _custom_type_: t.MessageScriptType.HTTP_SCRIPT_INITIATED,
            };
            s.postMessage(e);
          }
        })(),
        r = new n();
      a.init(r, o),
        i.init(r, o),
        s.addEventListener("message", (e) => {
          if (e.data?._custom_type_ !== t.MessageScriptType.INIT_HTTP_CONFIG)
            return;
          const { onHttpRequest: s, onHttpResponse: n } = e.data.payload;
          r.setConfig(s, n);
        });
    })(window || globalThis);
  })();
})();
