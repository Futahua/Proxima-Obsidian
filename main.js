"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ProjectOSPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian8 = require("obsidian");

// node_modules/svelte/src/runtime/internal/utils.js
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    for (const callback of callbacks) {
      callback(void 0);
    }
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
  let value;
  subscribe(store, (_) => value = _)();
  return value;
}
function component_subscribe(component, store, callback) {
  component.$$.on_destroy.push(subscribe(store, callback));
}

// node_modules/svelte/src/runtime/internal/globals.js
var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : (
  // @ts-ignore Node typings have this
  global
);

// node_modules/svelte/src/runtime/internal/ResizeObserverSingleton.js
var ResizeObserverSingleton = class {
  /** @param {ResizeObserverOptions} options */
  constructor(options) {
    /**
     * @private
     * @readonly
     * @type {WeakMap<Element, import('./private.js').Listener>}
     */
    __publicField(this, "_listeners", "WeakMap" in globals ? /* @__PURE__ */ new WeakMap() : void 0);
    /**
     * @private
     * @type {ResizeObserver}
     */
    __publicField(this, "_observer");
    /** @type {ResizeObserverOptions} */
    __publicField(this, "options");
    this.options = options;
  }
  /**
   * @param {Element} element
   * @param {import('./private.js').Listener} listener
   * @returns {() => void}
   */
  observe(element2, listener) {
    this._listeners.set(element2, listener);
    this._getObserver().observe(element2, this.options);
    return () => {
      this._listeners.delete(element2);
      this._observer.unobserve(element2);
    };
  }
  /**
   * @private
   */
  _getObserver() {
    var _a;
    return (_a = this._observer) != null ? _a : this._observer = new ResizeObserver((entries) => {
      var _a2;
      for (const entry of entries) {
        ResizeObserverSingleton.entries.set(entry.target, entry);
        (_a2 = this._listeners.get(entry.target)) == null ? void 0 : _a2(entry);
      }
    });
  }
};
ResizeObserverSingleton.entries = "WeakMap" in globals ? /* @__PURE__ */ new WeakMap() : void 0;

// node_modules/svelte/src/runtime/internal/dom.js
var is_hydrating = false;
function start_hydrating() {
  is_hydrating = true;
}
function end_hydrating() {
  is_hydrating = false;
}
function append(target, node) {
  target.appendChild(node);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i])
      iterations[i].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function empty() {
  return text("");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function stop_propagation(fn) {
  return function(event) {
    event.stopPropagation();
    return fn.call(this, event);
  };
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.data === data)
    return;
  text2.data = /** @type {string} */
  data;
}
function set_input_value(input, value) {
  input.value = value == null ? "" : value;
}
function set_style(node, key, value, important) {
  if (value == null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, important ? "important" : "");
  }
}
function select_option(select, value, mounting) {
  for (let i = 0; i < select.options.length; i += 1) {
    const option = select.options[i];
    if (option.__value === value) {
      option.selected = true;
      return;
    }
  }
  if (!mounting || value !== void 0) {
    select.selectedIndex = -1;
  }
}
function select_value(select) {
  const selected_option = select.querySelector(":checked");
  return selected_option && selected_option.__value;
}
var crossorigin;
function is_crossorigin() {
  if (crossorigin === void 0) {
    crossorigin = false;
    try {
      if (typeof window !== "undefined" && window.parent) {
        void window.parent.document;
      }
    } catch (error) {
      crossorigin = true;
    }
  }
  return crossorigin;
}
function add_iframe_resize_listener(node, fn) {
  const computed_style = getComputedStyle(node);
  if (computed_style.position === "static") {
    node.style.position = "relative";
  }
  const iframe = element("iframe");
  iframe.setAttribute(
    "style",
    "display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;"
  );
  iframe.setAttribute("aria-hidden", "true");
  iframe.tabIndex = -1;
  const crossorigin2 = is_crossorigin();
  let unsubscribe;
  if (crossorigin2) {
    iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}<\/script>";
    unsubscribe = listen(
      window,
      "message",
      /** @param {MessageEvent} event */
      (event) => {
        if (event.source === iframe.contentWindow)
          fn();
      }
    );
  } else {
    iframe.src = "about:blank";
    iframe.onload = () => {
      unsubscribe = listen(iframe.contentWindow, "resize", fn);
      fn();
    };
  }
  append(node, iframe);
  return () => {
    if (crossorigin2) {
      unsubscribe();
    } else if (unsubscribe && iframe.contentWindow) {
      unsubscribe();
    }
    detach(iframe);
  };
}
function toggle_class(element2, name, toggle) {
  element2.classList.toggle(name, !!toggle);
}
function get_custom_elements_slots(element2) {
  const result = {};
  element2.childNodes.forEach(
    /** @param {Element} node */
    (node) => {
      result[node.slot || "default"] = true;
    }
  );
  return result;
}

// node_modules/svelte/src/runtime/internal/lifecycle.js
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function bubble(component, event) {
  const callbacks = component.$$.callbacks[event.type];
  if (callbacks) {
    callbacks.slice().forEach((fn) => fn.call(this, event));
  }
}

// node_modules/svelte/src/runtime/internal/scheduler.js
var dirty_components = [];
var binding_callbacks = [];
var render_callbacks = [];
var flush_callbacks = [];
var resolved_promise = /* @__PURE__ */ Promise.resolve();
var update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function tick() {
  schedule_update();
  return resolved_promise;
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
var seen_callbacks = /* @__PURE__ */ new Set();
var flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
function flush_render_callbacks(fns) {
  const filtered = [];
  const targets = [];
  render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
  targets.forEach((c) => c());
  render_callbacks = filtered;
}

// node_modules/svelte/src/runtime/internal/transitions.js
var outroing = /* @__PURE__ */ new Set();
var outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
    // parent group
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}

// node_modules/svelte/src/runtime/internal/each.js
function ensure_array_like(array_like_or_iterator) {
  return (array_like_or_iterator == null ? void 0 : array_like_or_iterator.length) !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
}
function destroy_block(block, lookup) {
  block.d(1);
  lookup.delete(block.key);
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block8, next, get_context) {
  let o = old_blocks.length;
  let n = list.length;
  let i = o;
  const old_indexes = {};
  while (i--)
    old_indexes[old_blocks[i].key] = i;
  const new_blocks = [];
  const new_lookup = /* @__PURE__ */ new Map();
  const deltas = /* @__PURE__ */ new Map();
  const updates = [];
  i = n;
  while (i--) {
    const child_ctx = get_context(ctx, list, i);
    const key = get_key(child_ctx);
    let block = lookup.get(key);
    if (!block) {
      block = create_each_block8(key, child_ctx);
      block.c();
    } else if (dynamic) {
      updates.push(() => block.p(child_ctx, dirty));
    }
    new_lookup.set(key, new_blocks[i] = block);
    if (key in old_indexes)
      deltas.set(key, Math.abs(i - old_indexes[key]));
  }
  const will_move = /* @__PURE__ */ new Set();
  const did_move = /* @__PURE__ */ new Set();
  function insert2(block) {
    transition_in(block, 1);
    block.m(node, next);
    lookup.set(block.key, block);
    next = block.first;
    n--;
  }
  while (o && n) {
    const new_block = new_blocks[n - 1];
    const old_block = old_blocks[o - 1];
    const new_key = new_block.key;
    const old_key = old_block.key;
    if (new_block === old_block) {
      next = new_block.first;
      o--;
      n--;
    } else if (!new_lookup.has(old_key)) {
      destroy(old_block, lookup);
      o--;
    } else if (!lookup.has(new_key) || will_move.has(new_key)) {
      insert2(new_block);
    } else if (did_move.has(old_key)) {
      o--;
    } else if (deltas.get(new_key) > deltas.get(old_key)) {
      did_move.add(new_key);
      insert2(new_block);
    } else {
      will_move.add(old_key);
      o--;
    }
  }
  while (o--) {
    const old_block = old_blocks[o];
    if (!new_lookup.has(old_block.key))
      destroy(old_block, lookup);
  }
  while (n)
    insert2(new_blocks[n - 1]);
  run_all(updates);
  return new_blocks;
}

// node_modules/svelte/src/shared/boolean_attributes.js
var _boolean_attributes = (
  /** @type {const} */
  [
    "allowfullscreen",
    "allowpaymentrequest",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "defer",
    "disabled",
    "formnovalidate",
    "hidden",
    "inert",
    "ismap",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "selected"
  ]
);
var boolean_attributes = /* @__PURE__ */ new Set([..._boolean_attributes]);

// node_modules/svelte/src/runtime/internal/Component.js
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  add_render_callback(() => {
    const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
    if (component.$$.on_destroy) {
      component.$$.on_destroy.push(...new_on_destroy);
    } else {
      run_all(new_on_destroy);
    }
    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance9, create_fragment9, not_equal, props, append_styles = null, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    // state
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    // everything else
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance9 ? instance9(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment9 ? create_fragment9($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      start_hydrating();
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    end_hydrating();
    flush();
  }
  set_current_component(parent_component);
}
var SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    constructor($$componentCtor, $$slots, use_shadow_dom) {
      super();
      /** The Svelte component constructor */
      __publicField(this, "$$ctor");
      /** Slots */
      __publicField(this, "$$s");
      /** The Svelte component instance */
      __publicField(this, "$$c");
      /** Whether or not the custom element is connected */
      __publicField(this, "$$cn", false);
      /** Component props data */
      __publicField(this, "$$d", {});
      /** `true` if currently in the process of reflecting component props back to attributes */
      __publicField(this, "$$r", false);
      /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
      __publicField(this, "$$p_d", {});
      /** @type {Record<string, Function[]>} Event listeners */
      __publicField(this, "$$l", {});
      /** @type {Map<Function, Function>} Event listener unsubscribe functions */
      __publicField(this, "$$l_u", /* @__PURE__ */ new Map());
      this.$$ctor = $$componentCtor;
      this.$$s = $$slots;
      if (use_shadow_dom) {
        this.attachShadow({ mode: "open" });
      }
    }
    addEventListener(type, listener, options) {
      this.$$l[type] = this.$$l[type] || [];
      this.$$l[type].push(listener);
      if (this.$$c) {
        const unsub = this.$$c.$on(type, listener);
        this.$$l_u.set(listener, unsub);
      }
      super.addEventListener(type, listener, options);
    }
    removeEventListener(type, listener, options) {
      super.removeEventListener(type, listener, options);
      if (this.$$c) {
        const unsub = this.$$l_u.get(listener);
        if (unsub) {
          unsub();
          this.$$l_u.delete(listener);
        }
      }
      if (this.$$l[type]) {
        const idx = this.$$l[type].indexOf(listener);
        if (idx >= 0) {
          this.$$l[type].splice(idx, 1);
        }
      }
    }
    async connectedCallback() {
      this.$$cn = true;
      if (!this.$$c) {
        let create_slot = function(name) {
          return () => {
            let node;
            const obj = {
              c: function create() {
                node = element("slot");
                if (name !== "default") {
                  attr(node, "name", name);
                }
              },
              /**
               * @param {HTMLElement} target
               * @param {HTMLElement} [anchor]
               */
              m: function mount(target, anchor) {
                insert(target, node, anchor);
              },
              d: function destroy(detaching) {
                if (detaching) {
                  detach(node);
                }
              }
            };
            return obj;
          };
        };
        await Promise.resolve();
        if (!this.$$cn || this.$$c) {
          return;
        }
        const $$slots = {};
        const existing_slots = get_custom_elements_slots(this);
        for (const name of this.$$s) {
          if (name in existing_slots) {
            $$slots[name] = [create_slot(name)];
          }
        }
        for (const attribute of this.attributes) {
          const name = this.$$g_p(attribute.name);
          if (!(name in this.$$d)) {
            this.$$d[name] = get_custom_element_value(name, attribute.value, this.$$p_d, "toProp");
          }
        }
        for (const key in this.$$p_d) {
          if (!(key in this.$$d) && this[key] !== void 0) {
            this.$$d[key] = this[key];
            delete this[key];
          }
        }
        this.$$c = new this.$$ctor({
          target: this.shadowRoot || this,
          props: {
            ...this.$$d,
            $$slots,
            $$scope: {
              ctx: []
            }
          }
        });
        const reflect_attributes = () => {
          this.$$r = true;
          for (const key in this.$$p_d) {
            this.$$d[key] = this.$$c.$$.ctx[this.$$c.$$.props[key]];
            if (this.$$p_d[key].reflect) {
              const attribute_value = get_custom_element_value(
                key,
                this.$$d[key],
                this.$$p_d,
                "toAttribute"
              );
              if (attribute_value == null) {
                this.removeAttribute(this.$$p_d[key].attribute || key);
              } else {
                this.setAttribute(this.$$p_d[key].attribute || key, attribute_value);
              }
            }
          }
          this.$$r = false;
        };
        this.$$c.$$.after_update.push(reflect_attributes);
        reflect_attributes();
        for (const type in this.$$l) {
          for (const listener of this.$$l[type]) {
            const unsub = this.$$c.$on(type, listener);
            this.$$l_u.set(listener, unsub);
          }
        }
        this.$$l = {};
      }
    }
    // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
    // and setting attributes through setAttribute etc, this is helpful
    attributeChangedCallback(attr2, _oldValue, newValue) {
      var _a;
      if (this.$$r)
        return;
      attr2 = this.$$g_p(attr2);
      this.$$d[attr2] = get_custom_element_value(attr2, newValue, this.$$p_d, "toProp");
      (_a = this.$$c) == null ? void 0 : _a.$set({ [attr2]: this.$$d[attr2] });
    }
    disconnectedCallback() {
      this.$$cn = false;
      Promise.resolve().then(() => {
        if (!this.$$cn && this.$$c) {
          this.$$c.$destroy();
          this.$$c = void 0;
        }
      });
    }
    $$g_p(attribute_name) {
      return Object.keys(this.$$p_d).find(
        (key) => this.$$p_d[key].attribute === attribute_name || !this.$$p_d[key].attribute && key.toLowerCase() === attribute_name
      ) || attribute_name;
    }
  };
}
function get_custom_element_value(prop, value, props_definition, transform) {
  var _a;
  const type = (_a = props_definition[prop]) == null ? void 0 : _a.type;
  value = type === "Boolean" && typeof value !== "boolean" ? value != null : value;
  if (!transform || !props_definition[prop]) {
    return value;
  } else if (transform === "toAttribute") {
    switch (type) {
      case "Object":
      case "Array":
        return value == null ? null : JSON.stringify(value);
      case "Boolean":
        return value ? "" : null;
      case "Number":
        return value == null ? null : value;
      default:
        return value;
    }
  } else {
    switch (type) {
      case "Object":
      case "Array":
        return value && JSON.parse(value);
      case "Boolean":
        return value;
      case "Number":
        return value != null ? +value : value;
      default:
        return value;
    }
  }
}
var SvelteComponent = class {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    __publicField(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    __publicField(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(props) {
    if (this.$$set && !is_empty(props)) {
      this.$$.skip_bound = true;
      this.$$set(props);
      this.$$.skip_bound = false;
    }
  }
};

// node_modules/svelte/src/shared/version.js
var PUBLIC_VERSION = "4";

// node_modules/svelte/src/runtime/store/index.js
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update2(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set, update2) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update: update2, subscribe: subscribe2 };
}

// src/data/FileManager.ts
var import_obsidian = require("obsidian");

// src/stores/data.ts
var projectsStore = writable([]);
var tasksStore = writable([]);
function getProjectTasks(tasks, projectId) {
  if (projectId)
    return tasks.filter((t) => t.project === projectId);
  return tasks.filter((t) => !t.project);
}

// src/data/FileManager.ts
var PROJECTS_FOLDER = "projects";
var TASKS_FOLDER = "tasks";
function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m)
    return {};
  const data = {};
  m[1].split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1)
      return;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (val === "true" || val === "false")
      val = val === "true";
    else if (val === "null" || val === "undefined")
      val = null;
    else if (!isNaN(val) && val !== "")
      val = Number(val);
    data[key] = val;
  });
  return data;
}
function serializeFrontmatter(fields) {
  let s = "---\n";
  for (const [k, v] of Object.entries(fields)) {
    if (v !== void 0 && v !== null)
      s += `${k}: ${v}
`;
  }
  s += "---\n";
  return s;
}
var FileManager = class {
  constructor(app) {
    this.app = app;
  }
  async initialize() {
    await this.ensureFolder(PROJECTS_FOLDER);
    await this.ensureFolder(TASKS_FOLDER);
    await this.loadAll();
  }
  async ensureFolder(folder) {
    try {
      const exists = await this.app.vault.adapter.exists(folder);
      if (!exists) {
        await this.app.vault.createFolder(folder);
      }
    } catch (e) {
      console.log(`Folder ${folder} already exists or could not be created:`, e);
    }
  }
  /**
   * Resolve the project note file path.
   * Supports both subfolder convention (projects/{id}/index.md) and flat convention (projects/{id}.md).
   */
  resolveProjectNotePath(id) {
    const subfolderPath = `${PROJECTS_FOLDER}/${id}/index.md`;
    const flatPath = `${PROJECTS_FOLDER}/${id}.md`;
    if (this.app.vault.getAbstractFileByPath(subfolderPath) instanceof import_obsidian.TFile) {
      return subfolderPath;
    }
    if (this.app.vault.getAbstractFileByPath(flatPath) instanceof import_obsidian.TFile) {
      return flatPath;
    }
    return null;
  }
  /**
   * Check if a project uses the subfolder convention.
   */
  isSubfolderProject(id) {
    const subfolderPath = `${PROJECTS_FOLDER}/${id}/index.md`;
    return this.app.vault.getAbstractFileByPath(subfolderPath) instanceof import_obsidian.TFile;
  }
  /**
   * Get the directory path for a project's files.
   * For subfolder projects: projects/{id}/
   * For flat projects: projects/ (but files are the single .md)
   */
  getProjectFolderPath(id) {
    return `${PROJECTS_FOLDER}/${id}`;
  }
  async loadAll() {
    const projects = [];
    const tasks = [];
    const seenProjectIds = /* @__PURE__ */ new Set();
    const allFiles = this.app.vault.getMarkdownFiles().filter((f) => f.path.startsWith(PROJECTS_FOLDER + "/"));
    for (const f of allFiles) {
      const c = await this.app.vault.read(f);
      const fm = parseFrontmatter(c);
      if (fm.type !== "project")
        continue;
      let projectId;
      const pathParts = f.path.replace(PROJECTS_FOLDER + "/", "").split("/");
      if (pathParts.length >= 2 && f.name === "index.md") {
        projectId = pathParts[0];
      } else if (pathParts.length === 1) {
        projectId = f.basename;
      } else {
        continue;
      }
      if (seenProjectIds.has(projectId))
        continue;
      seenProjectIds.add(projectId);
      projects.push({
        id: projectId,
        name: fm.name || projectId,
        description: fm.description || "",
        createdAt: fm.createdAt || new Date(f.stat.ctime).toISOString(),
        status: fm.status || "active"
      });
    }
    projects.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    projectsStore.set(projects);
    const taskFiles = this.app.vault.getMarkdownFiles().filter((f) => f.path.startsWith(TASKS_FOLDER + "/"));
    for (const f of taskFiles) {
      const c = await this.app.vault.read(f);
      const fm = parseFrontmatter(c);
      const body = c.replace(/^---\r?\n[\s\S]*?\r?\n---/, "").trim();
      let deadline = null;
      if (fm.deadline) {
        const d = new Date(fm.deadline);
        if (!isNaN(d.getTime()))
          deadline = d.toISOString();
      }
      let startDate = null;
      if (fm.startDate) {
        const d = new Date(fm.startDate);
        if (!isNaN(d.getTime()))
          startDate = d.toISOString();
      }
      tasks.push({
        id: f.basename,
        name: fm.name || f.basename,
        description: body || "",
        project: fm.project || null,
        status: fm.status || "backlog",
        weight: fm.weight || 1,
        orderIndex: fm.orderIndex || 0,
        isFixedDuration: fm.isFixedDuration || false,
        fixedDuration: fm.fixedDuration || null,
        maxDuration: fm.maxDuration || null,
        isCompleted: fm.isCompleted || false,
        createdAt: fm.createdAt || new Date(f.stat.ctime).toISOString(),
        startDate,
        deadline,
        ganttRow: fm.ganttRow || 0
      });
    }
    tasks.sort((a, b) => a.orderIndex - b.orderIndex);
    tasksStore.set(tasks);
  }
  async updateTask(id, updates) {
    tasksStore.update((tasks) => {
      const i = tasks.findIndex((t) => t.id === id);
      if (i > -1) {
        tasks[i] = { ...tasks[i], ...updates };
      }
      return tasks;
    });
    const file = this.app.vault.getAbstractFileByPath(`${TASKS_FOLDER}/${id}.md`);
    if (!(file instanceof import_obsidian.TFile))
      return;
    const c = await this.app.vault.read(file);
    const fm = parseFrontmatter(c);
    const body = c.replace(/^---\r?\n[\s\S]*?\r?\n---/, "").trim();
    let newBody = body;
    if (updates.description !== void 0) {
      newBody = updates.description;
    }
    const fmUpdates = { ...updates };
    delete fmUpdates.id;
    delete fmUpdates.description;
    Object.assign(fm, fmUpdates);
    for (const k in fm)
      if (fm[k] === void 0)
        delete fm[k];
    await this.app.vault.modify(file, serializeFrontmatter(fm) + "\n" + newBody);
  }
  async createTask(data) {
    const id = `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const initialStatus = data.status || "backlog";
    const fm = {
      name: data.name,
      project: data.project || null,
      status: initialStatus,
      weight: data.weight || 1,
      orderIndex: data.orderIndex || 0,
      isFixedDuration: data.isFixedDuration || false,
      fixedDuration: data.isFixedDuration ? data.fixedDuration : null,
      isCompleted: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (data.deadline)
      fm.deadline = data.deadline;
    if (data.startDate)
      fm.startDate = data.startDate;
    const c = serializeFrontmatter(fm) + "\n" + (data.description || "");
    await this.app.vault.create(`${TASKS_FOLDER}/${id}.md`, c);
    tasksStore.update((t) => [...t, {
      ...data,
      id,
      project: fm.project,
      status: initialStatus,
      weight: fm.weight,
      orderIndex: fm.orderIndex,
      isFixedDuration: fm.isFixedDuration,
      fixedDuration: fm.fixedDuration,
      isCompleted: false,
      createdAt: fm.createdAt,
      startDate: fm.startDate || null,
      deadline: fm.deadline || null,
      description: data.description || "",
      name: fm.name,
      ganttRow: data.ganttRow || 0
    }]);
    return id;
  }
  async deleteTask(id) {
    tasksStore.update((tasks) => tasks.filter((t) => t.id !== id));
    const file = this.app.vault.getAbstractFileByPath(`${TASKS_FOLDER}/${id}.md`);
    if (file instanceof import_obsidian.TFile)
      await this.app.vault.delete(file);
  }
  async getProjectContent(id) {
    const notePath = this.resolveProjectNotePath(id);
    if (!notePath)
      return "";
    const file = this.app.vault.getAbstractFileByPath(notePath);
    if (!(file instanceof import_obsidian.TFile))
      return "";
    const c = await this.app.vault.read(file);
    return c.replace(/^---\r?\n[\s\S]*?\r?\n---/, "").trim();
  }
  async saveProjectContent(id, newBody) {
    const notePath = this.resolveProjectNotePath(id);
    if (!notePath)
      return;
    const file = this.app.vault.getAbstractFileByPath(notePath);
    if (!(file instanceof import_obsidian.TFile))
      return;
    const c = await this.app.vault.read(file);
    const fm = parseFrontmatter(c);
    const serialized = serializeFrontmatter(fm) + "\n" + newBody;
    await this.app.vault.modify(file, serialized);
  }
  /**
   * Get all files associated with a project in its subfolder.
   * Returns files from projects/{id}/ directory (excluding index.md frontmatter).
   */
  getProjectFiles(id) {
    const folderPath = this.getProjectFolderPath(id);
    const folder = this.app.vault.getAbstractFileByPath(folderPath);
    if (!(folder instanceof import_obsidian.TFolder)) {
      const flatPath = `${PROJECTS_FOLDER}/${id}.md`;
      const flatFile = this.app.vault.getAbstractFileByPath(flatPath);
      if (flatFile instanceof import_obsidian.TFile) {
        return [{
          path: flatFile.path,
          name: flatFile.name,
          extension: flatFile.extension,
          size: flatFile.stat.size,
          mtime: flatFile.stat.mtime
        }];
      }
      return [];
    }
    const files = [];
    const collectFiles = (parent) => {
      for (const child of parent.children) {
        if (child instanceof import_obsidian.TFile) {
          files.push({
            path: child.path,
            name: child.name,
            extension: child.extension,
            size: child.stat.size,
            mtime: child.stat.mtime
          });
        } else if (child instanceof import_obsidian.TFolder) {
          collectFiles(child);
        }
      }
    };
    collectFiles(folder);
    files.sort((a, b) => {
      if (a.name === "index.md")
        return -1;
      if (b.name === "index.md")
        return 1;
      return a.name.localeCompare(b.name);
    });
    return files;
  }
  /**
   * Create a new file inside the project's subfolder.
   * Ensures the subfolder exists first.
   */
  async createProjectFile(projectId, filename, content) {
    const folderPath = this.getProjectFolderPath(projectId);
    await this.ensureFolder(folderPath);
    const filePath = `${folderPath}/${filename}`;
    const existing = this.app.vault.getAbstractFileByPath(filePath);
    if (existing instanceof import_obsidian.TFile)
      return existing;
    const file = await this.app.vault.create(filePath, content);
    return file;
  }
  /**
   * Get the TFile for the project's main note (index.md or flat .md).
   */
  getProjectNoteFile(id) {
    const notePath = this.resolveProjectNotePath(id);
    if (!notePath)
      return null;
    const file = this.app.vault.getAbstractFileByPath(notePath);
    return file instanceof import_obsidian.TFile ? file : null;
  }
};

// node_modules/svelte/src/runtime/internal/disclose-version/index.js
if (typeof window !== "undefined")
  (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);

// src/ui/views/AgingView.svelte
var import_obsidian3 = require("obsidian");

// src/utils.ts
function calculateLiquidTimeline(tasks, startTime, deadline) {
  const totalMin = (deadline.getTime() - startTime.getTime()) / 6e4;
  if (totalMin <= 0)
    return [];
  let remaining = totalMin;
  const durMap = /* @__PURE__ */ new Map();
  for (const t of tasks) {
    if (t.isFixedDuration && t.fixedDuration && t.fixedDuration > 0) {
      durMap.set(t.id, t.fixedDuration);
      remaining -= t.fixedDuration;
    }
  }
  const elastic = tasks.filter((t) => !(t.isFixedDuration && t.fixedDuration && t.fixedDuration > 0));
  if (elastic.length && remaining > 0) {
    const tw = elastic.reduce((s, t) => s + t.weight, 0) || 1;
    for (const t of elastic) {
      let d = t.weight / tw * remaining;
      if (t.maxDuration && d > t.maxDuration)
        d = t.maxDuration;
      durMap.set(t.id, d);
    }
  }
  let cur = startTime.getTime();
  const tl = [];
  for (const t of tasks) {
    const dur = durMap.get(t.id) || 0;
    const end = new Date(cur + dur * 6e4);
    tl.push({
      id: t.id,
      startTime: new Date(cur).toISOString(),
      endTime: end.toISOString(),
      calculatedDuration: dur
    });
    cur = end.getTime();
  }
  return tl;
}
function formatAge(createdAtIso, now2 = Date.now()) {
  const diff = now2 - new Date(createdAtIso).getTime();
  const mins = Math.floor(diff / 6e4);
  if (mins < 1)
    return "just now";
  if (mins < 60)
    return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24)
    return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30)
    return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}
function formatCountdown(diffMs) {
  const isPast = diffMs < 0;
  const abs = Math.abs(diffMs);
  const totalSecs = Math.floor(abs / 1e3);
  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor(totalSecs % 86400 / 3600);
  const mins = Math.floor(totalSecs % 3600 / 60);
  const secs = totalSecs % 60;
  let str = "";
  if (days > 0)
    str += `${days}d `;
  if (hours > 0)
    str += `${hours}h `;
  str += `${mins}m ${secs}s`;
  return isPast ? `overdue by ${str}` : str;
}
function fmtDate(iso) {
  return iso ? new Date(iso).toISOString().slice(0, 10) : "";
}
function fmtTime(iso) {
  if (!iso)
    return "";
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
function fmtDur(m) {
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
}

// src/modals/Modals.ts
var import_obsidian2 = require("obsidian");
var EditTaskModal = class extends import_obsidian2.Modal {
  constructor(app, task, onSave) {
    super(app);
    this.task = task;
    this.onSave = onSave;
  }
  onOpen() {
    const { contentEl, task } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: "Edit Task" });
    const inp = contentEl.createEl("input", {
      type: "text",
      placeholder: "Task name",
      cls: "pos-modal-input"
    });
    inp.value = task.name;
    const desc = contentEl.createEl("textarea", {
      placeholder: "Description",
      cls: "pos-modal-textarea"
    });
    desc.value = task.description;
    const wr = contentEl.createEl("div", { cls: "pos-modal-row" });
    wr.createEl("label", { text: "Weight:" });
    const wInp = wr.createEl("input", {
      type: "number",
      attr: { min: "1" },
      cls: "pos-modal-number"
    });
    wInp.value = task.weight.toString();
    const fr = contentEl.createEl("div", { cls: "pos-modal-row" });
    const fChk = fr.createEl("input", { type: "checkbox" });
    fChk.checked = task.isFixedDuration;
    fr.createEl("label", { text: " Fixed duration (min):" });
    const fInp = fr.createEl("input", {
      type: "number",
      attr: { min: "1" },
      cls: "pos-modal-number"
    });
    fInp.value = (task.fixedDuration || 30).toString();
    fInp.disabled = !task.isFixedDuration;
    fChk.addEventListener("change", () => {
      fInp.disabled = !fChk.checked;
    });
    const dr = contentEl.createEl("div", { cls: "pos-modal-row" });
    const dChk = dr.createEl("input", { type: "checkbox" });
    dChk.checked = !!task.deadline;
    dr.createEl("label", { text: " Deadline:" });
    const dInp = dr.createEl("input", { type: "datetime-local", cls: "pos-modal-datetime" });
    dInp.disabled = !task.deadline;
    if (task.deadline) {
      const dlDate = new Date(task.deadline);
      if (!isNaN(dlDate.getTime()))
        dInp.value = dlDate.toISOString().slice(0, 16);
    }
    dChk.addEventListener("change", () => {
      dInp.disabled = !dChk.checked;
    });
    const br = contentEl.createEl("div", { cls: "pos-modal-buttons" });
    br.createEl("button", { text: "Cancel" }).addEventListener("click", () => this.close());
    br.createEl("button", { text: "Save", cls: "pos-modal-primary" }).addEventListener("click", () => {
      const name = inp.value.trim();
      if (!name) {
        new import_obsidian2.Notice("Task name is required");
        return;
      }
      const updates = {
        name,
        description: desc.value.trim(),
        // BUG FIX: Included description in updates
        weight: Math.max(1, Number(wInp.value) || 1),
        isFixedDuration: fChk.checked,
        fixedDuration: fChk.checked ? Number(fInp.value) || 30 : null
      };
      if (dChk.checked && dInp.value) {
        const dlDate = new Date(dInp.value);
        if (!isNaN(dlDate.getTime()))
          updates.deadline = dlDate.toISOString();
      } else {
        updates.deadline = null;
      }
      this.onSave(updates);
      this.close();
    });
  }
  onClose() {
    this.contentEl.empty();
  }
};
var ConfirmModal = class extends import_obsidian2.Modal {
  constructor(app, title, message, onConfirm) {
    super(app);
    this.title = title;
    this.message = message;
    this.onConfirm = onConfirm;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: this.title });
    contentEl.createEl("p", { text: this.message });
    const br = contentEl.createEl("div", { cls: "pos-modal-buttons" });
    br.createEl("button", { text: "Cancel" }).addEventListener("click", () => this.close());
    br.createEl("button", { text: "Confirm", cls: "pos-modal-primary pos-del" }).addEventListener("click", () => {
      this.onConfirm();
      this.close();
    });
  }
  onClose() {
    this.contentEl.empty();
  }
};
var NewProjectModal = class extends import_obsidian2.Modal {
  constructor(app, onCreate) {
    super(app);
    this.onCreate = onCreate;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: "Create New Project" });
    const inp = contentEl.createEl("input", {
      type: "text",
      placeholder: "Project name",
      cls: "pos-modal-input"
    });
    const desc = contentEl.createEl("textarea", {
      placeholder: "Description (optional)",
      cls: "pos-modal-textarea"
    });
    const br = contentEl.createEl("div", { cls: "pos-modal-buttons" });
    br.createEl("button", { text: "Cancel" }).addEventListener("click", () => this.close());
    br.createEl("button", { text: "Create", cls: "pos-modal-primary" }).addEventListener("click", () => {
      const name = inp.value.trim();
      if (!name) {
        new import_obsidian2.Notice("Project name is required");
        return;
      }
      this.onCreate(name, desc.value.trim());
      this.close();
    });
  }
  onClose() {
    this.contentEl.empty();
  }
};
var NewTaskModal = class extends import_obsidian2.Modal {
  constructor(app, onCreate) {
    super(app);
    this.onCreate = onCreate;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: "Create New Task" });
    const inp = contentEl.createEl("input", {
      type: "text",
      placeholder: "Task name",
      cls: "pos-modal-input"
    });
    const br = contentEl.createEl("div", { cls: "pos-modal-buttons" });
    br.createEl("button", { text: "Cancel" }).addEventListener("click", () => this.close());
    br.createEl("button", { text: "Create", cls: "pos-modal-primary" }).addEventListener("click", () => {
      const name = inp.value.trim();
      if (!name) {
        new import_obsidian2.Notice("Task name is required");
        return;
      }
      this.onCreate(name);
      this.close();
    });
  }
  onClose() {
    this.contentEl.empty();
  }
};
var QuickEditTaskModal = class extends import_obsidian2.Modal {
  constructor(app, task, onSave, onOpenNative) {
    super(app);
    this.task = task;
    this.onSave = onSave;
    this.onOpenNative = onOpenNative;
  }
  onOpen() {
    const { contentEl, task } = this;
    contentEl.empty();
    const hdr = contentEl.createEl("div", { cls: "pos-modal-row", attr: { style: "justify-content: space-between; margin-bottom: 16px;" } });
    hdr.createEl("h3", { text: "Edit Task", attr: { style: "margin: 0;" } });
    const nativeBtn = hdr.createEl("button", { text: "\u{1F4C4} Open Native Note", cls: "pos-modal-primary" });
    nativeBtn.addEventListener("click", () => {
      this.close();
      this.onOpenNative();
    });
    const inp = contentEl.createEl("input", {
      type: "text",
      placeholder: "Task name",
      cls: "pos-modal-input"
    });
    inp.value = task.name;
    const sr = contentEl.createEl("div", { cls: "pos-modal-row" });
    sr.createEl("label", { text: "Status:" });
    const sSel = sr.createEl("select", { cls: "pos-modal-input", attr: { style: "width: 150px;" } });
    ["planned", "backlog", "running", "review"].forEach((st) => {
      sSel.createEl("option", { value: st, text: st }).selected = task.status === st;
    });
    const sdr = contentEl.createEl("div", { cls: "pos-modal-row" });
    const sdChk = sdr.createEl("input", { type: "checkbox" });
    sdChk.checked = !!task.startDate;
    sdr.createEl("label", { text: " Start Date:" });
    const sdInp = sdr.createEl("input", { type: "datetime-local", cls: "pos-modal-datetime" });
    sdInp.disabled = !task.startDate;
    if (task.startDate) {
      const sdDate = new Date(task.startDate);
      if (!isNaN(sdDate.getTime()))
        sdInp.value = sdDate.toISOString().slice(0, 16);
    }
    sdChk.addEventListener("change", () => {
      sdInp.disabled = !sdChk.checked;
    });
    const dr = contentEl.createEl("div", { cls: "pos-modal-row" });
    const dChk = dr.createEl("input", { type: "checkbox" });
    dChk.checked = !!task.deadline;
    dr.createEl("label", { text: " Deadline:" });
    const dInp = dr.createEl("input", { type: "datetime-local", cls: "pos-modal-datetime" });
    dInp.disabled = !task.deadline;
    if (task.deadline) {
      const dlDate = new Date(task.deadline);
      if (!isNaN(dlDate.getTime()))
        dInp.value = dlDate.toISOString().slice(0, 16);
    }
    dChk.addEventListener("change", () => {
      dInp.disabled = !dChk.checked;
    });
    const desc = contentEl.createEl("textarea", {
      placeholder: "Description",
      cls: "pos-modal-textarea",
      attr: { style: "margin-top: 10px; min-height: 80px;" }
    });
    desc.value = task.description;
    const br = contentEl.createEl("div", { cls: "pos-modal-buttons", attr: { style: "margin-top: 16px;" } });
    br.createEl("button", { text: "Edit Natively" }).addEventListener("click", () => {
      const file = this.app.vault.getAbstractFileByPath(`tasks/${task.id}.md`);
      if (file instanceof TFile) {
        this.app.workspace.getLeaf().openFile(file);
      }
      this.close();
    });
    br.createEl("button", { text: "Cancel" }).addEventListener("click", () => this.close());
    br.createEl("button", { text: "Save", cls: "pos-modal-primary" }).addEventListener("click", () => {
      const name = inp.value.trim();
      if (!name) {
        new import_obsidian2.Notice("Task name is required");
        return;
      }
      const updates = {
        name,
        description: desc.value.trim(),
        status: sSel.value,
        isCompleted: sSel.value === "review"
      };
      if (sdChk.checked && sdInp.value) {
        const sdDate = new Date(sdInp.value);
        if (!isNaN(sdDate.getTime()))
          updates.startDate = sdDate.toISOString();
      } else {
        updates.startDate = null;
      }
      if (dChk.checked && dInp.value) {
        const dlDate = new Date(dInp.value);
        if (!isNaN(dlDate.getTime()))
          updates.deadline = dlDate.toISOString();
      } else {
        updates.deadline = null;
      }
      this.onSave(updates);
      this.close();
    });
  }
  onClose() {
    this.contentEl.empty();
  }
};

// src/ui/views/AgingView.svelte
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[23] = list[i];
  const constants_0 = (
    /*tasks*/
    child_ctx[4].filter(function func2(...args) {
      return (
        /*func*/
        ctx[21](
          /*p*/
          child_ctx[23],
          ...args
        )
      );
    })
  );
  child_ctx[24] = constants_0;
  const constants_1 = {
    running: (
      /*pTasks*/
      child_ctx[24].filter((t) => t.status === "running").length
    ),
    review: (
      /*pTasks*/
      child_ctx[24].filter((t) => t.status === "review").length
    ),
    total: (
      /*pTasks*/
      child_ctx[24].length
    )
  };
  child_ctx[25] = constants_1;
  return child_ctx;
}
function create_else_block(ctx) {
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let each_1_anchor;
  let each_value = ensure_array_like(
    /*activeProjects*/
    ctx[1]
  );
  const get_key = (ctx2) => (
    /*p*/
    ctx2[23].id
  );
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
  }
  return {
    c() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
    },
    m(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(target, anchor);
        }
      }
      insert(target, each_1_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*getHue, activeProjects, range, minTime, handleDeleteProject, handleSelectProject, tasks, now*/
      447) {
        each_value = ensure_array_like(
          /*activeProjects*/
          ctx2[1]
        );
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block, each_1_anchor, get_each_context);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(each_1_anchor);
      }
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d(detaching);
      }
    }
  };
}
function create_if_block(ctx) {
  let p_1;
  return {
    c() {
      p_1 = element("p");
      p_1.textContent = 'No projects yet. Click "+ New Project" above to build your first project workspace!';
      attr(p_1, "class", "pos-empty");
    },
    m(target, anchor) {
      insert(target, p_1, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(p_1);
      }
    }
  };
}
function create_if_block_3(ctx) {
  let div;
  let t_value = (
    /*p*/
    ctx[23].description + ""
  );
  let t;
  return {
    c() {
      div = element("div");
      t = text(t_value);
      attr(div, "class", "pos-card-desc");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t);
    },
    p(ctx2, dirty) {
      if (dirty & /*activeProjects*/
      2 && t_value !== (t_value = /*p*/
      ctx2[23].description + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block_2(ctx) {
  let span;
  let t0_value = (
    /*counts*/
    ctx[25].running + ""
  );
  let t0;
  let t1;
  return {
    c() {
      span = element("span");
      t0 = text(t0_value);
      t1 = text(" active");
      attr(span, "class", "pos-pwc-active-badge");
      set_style(span, "background", "rgba(167, 201, 87, 0.4)");
      set_style(span, "color", "#101010");
      set_style(span, "border", "1px solid rgba(0,0,0,0.1)");
      set_style(span, "font-size", "0.9em");
      set_style(span, "padding", "1px 6px");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t0);
      append(span, t1);
    },
    p(ctx2, dirty) {
      if (dirty & /*tasks, activeProjects*/
      18 && t0_value !== (t0_value = /*counts*/
      ctx2[25].running + ""))
        set_data(t0, t0_value);
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_if_block_1(ctx) {
  let span;
  let t0_value = (
    /*counts*/
    ctx[25].review + ""
  );
  let t0;
  let t1;
  return {
    c() {
      span = element("span");
      t0 = text(t0_value);
      t1 = text(" completed");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t0);
      append(span, t1);
    },
    p(ctx2, dirty) {
      if (dirty & /*tasks, activeProjects*/
      18 && t0_value !== (t0_value = /*counts*/
      ctx2[25].review + ""))
        set_data(t0, t0_value);
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_each_block(key_1, ctx) {
  let div4;
  let div0;
  let t0_value = (
    /*p*/
    ctx[23].name + ""
  );
  let t0;
  let t1;
  let t2;
  let div1;
  let t3;
  let t4_value = formatAge(
    /*p*/
    ctx[23].createdAt,
    /*now*/
    ctx[2]
  ) + "";
  let t4;
  let t5;
  let div2;
  let span;
  let t6_value = (
    /*counts*/
    ctx[25].total + ""
  );
  let t6;
  let t7;
  let t8;
  let t9;
  let t10;
  let div3;
  let button0;
  let t12;
  let button1;
  let t14;
  let mounted;
  let dispose;
  function click_handler() {
    return (
      /*click_handler*/
      ctx[18](
        /*p*/
        ctx[23]
      )
    );
  }
  let if_block0 = (
    /*p*/
    ctx[23].description && create_if_block_3(ctx)
  );
  let if_block1 = (
    /*counts*/
    ctx[25].running > 0 && create_if_block_2(ctx)
  );
  let if_block2 = (
    /*counts*/
    ctx[25].review > 0 && create_if_block_1(ctx)
  );
  function click_handler_1() {
    return (
      /*click_handler_1*/
      ctx[19](
        /*p*/
        ctx[23]
      )
    );
  }
  function click_handler_2() {
    return (
      /*click_handler_2*/
      ctx[20](
        /*p*/
        ctx[23]
      )
    );
  }
  return {
    key: key_1,
    first: null,
    c() {
      div4 = element("div");
      div0 = element("div");
      t0 = text(t0_value);
      t1 = space();
      if (if_block0)
        if_block0.c();
      t2 = space();
      div1 = element("div");
      t3 = text("Age: ");
      t4 = text(t4_value);
      t5 = space();
      div2 = element("div");
      span = element("span");
      t6 = text(t6_value);
      t7 = text(" tasks");
      t8 = space();
      if (if_block1)
        if_block1.c();
      t9 = space();
      if (if_block2)
        if_block2.c();
      t10 = space();
      div3 = element("div");
      button0 = element("button");
      button0.textContent = "Workspace";
      t12 = space();
      button1 = element("button");
      button1.textContent = "Delete";
      t14 = space();
      attr(div0, "class", "pos-card-name");
      set_style(div0, "cursor", "pointer");
      set_style(div0, "font-weight", "bold");
      set_style(div0, "font-size", "1.15em");
      attr(div1, "class", "pos-age");
      attr(div2, "class", "pos-card-meta");
      attr(button0, "class", "pos-ptc-start-btn");
      attr(button1, "class", "pos-del");
      attr(button1, "title", "Delete project");
      attr(div3, "class", "pos-card-acts");
      set_style(div3, "margin-top", "12px");
      set_style(div3, "display", "flex");
      set_style(div3, "gap", "6px");
      set_style(div3, "flex-wrap", "wrap");
      attr(div4, "class", "pos-card pos-project-card");
      set_style(div4, "background-color", "hsl(" + /*getHue*/
      ctx[5](
        /*p*/
        ctx[23].createdAt,
        /*range*/
        ctx[3],
        /*minTime*/
        ctx[0]
      ) + ", 70%, 90%)");
      this.first = div4;
    },
    m(target, anchor) {
      insert(target, div4, anchor);
      append(div4, div0);
      append(div0, t0);
      append(div4, t1);
      if (if_block0)
        if_block0.m(div4, null);
      append(div4, t2);
      append(div4, div1);
      append(div1, t3);
      append(div1, t4);
      append(div4, t5);
      append(div4, div2);
      append(div2, span);
      append(span, t6);
      append(span, t7);
      append(div2, t8);
      if (if_block1)
        if_block1.m(div2, null);
      append(div2, t9);
      if (if_block2)
        if_block2.m(div2, null);
      append(div4, t10);
      append(div4, div3);
      append(div3, button0);
      append(div3, t12);
      append(div3, button1);
      append(div4, t14);
      if (!mounted) {
        dispose = [
          listen(div0, "click", click_handler),
          listen(button0, "click", click_handler_1),
          listen(button1, "click", click_handler_2)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & /*activeProjects*/
      2 && t0_value !== (t0_value = /*p*/
      ctx[23].name + ""))
        set_data(t0, t0_value);
      if (
        /*p*/
        ctx[23].description
      ) {
        if (if_block0) {
          if_block0.p(ctx, dirty);
        } else {
          if_block0 = create_if_block_3(ctx);
          if_block0.c();
          if_block0.m(div4, t2);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (dirty & /*activeProjects, now*/
      6 && t4_value !== (t4_value = formatAge(
        /*p*/
        ctx[23].createdAt,
        /*now*/
        ctx[2]
      ) + ""))
        set_data(t4, t4_value);
      if (dirty & /*tasks, activeProjects*/
      18 && t6_value !== (t6_value = /*counts*/
      ctx[25].total + ""))
        set_data(t6, t6_value);
      if (
        /*counts*/
        ctx[25].running > 0
      ) {
        if (if_block1) {
          if_block1.p(ctx, dirty);
        } else {
          if_block1 = create_if_block_2(ctx);
          if_block1.c();
          if_block1.m(div2, t9);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (
        /*counts*/
        ctx[25].review > 0
      ) {
        if (if_block2) {
          if_block2.p(ctx, dirty);
        } else {
          if_block2 = create_if_block_1(ctx);
          if_block2.c();
          if_block2.m(div2, null);
        }
      } else if (if_block2) {
        if_block2.d(1);
        if_block2 = null;
      }
      if (dirty & /*activeProjects, range, minTime*/
      11) {
        set_style(div4, "background-color", "hsl(" + /*getHue*/
        ctx[5](
          /*p*/
          ctx[23].createdAt,
          /*range*/
          ctx[3],
          /*minTime*/
          ctx[0]
        ) + ", 70%, 90%)");
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div4);
      }
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
      if (if_block2)
        if_block2.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment(ctx) {
  let div3;
  let div2;
  let div0;
  let h2;
  let t1;
  let button;
  let t3;
  let p_1;
  let t5;
  let div1;
  let mounted;
  let dispose;
  function select_block_type(ctx2, dirty) {
    if (
      /*activeProjects*/
      ctx2[1].length === 0
    )
      return create_if_block;
    return create_else_block;
  }
  let current_block_type = select_block_type(ctx, -1);
  let if_block = current_block_type(ctx);
  return {
    c() {
      div3 = element("div");
      div2 = element("div");
      div0 = element("div");
      h2 = element("h2");
      h2.textContent = "Projects Hub";
      t1 = space();
      button = element("button");
      button.textContent = "+ New Project";
      t3 = space();
      p_1 = element("p");
      p_1.textContent = "Select or create a workspace to manage project notes and tasks modularly in a central tab.";
      t5 = space();
      div1 = element("div");
      if_block.c();
      attr(h2, "class", "pos-workspace-title");
      set_style(h2, "margin", "0");
      attr(button, "class", "pos-modal-primary pos-create-new-project-btn");
      attr(div0, "class", "pos-workspace-header-row");
      set_style(div0, "display", "flex");
      set_style(div0, "justify-content", "space-between");
      set_style(div0, "align-items", "center");
      set_style(div0, "margin-bottom", "12px");
      attr(p_1, "class", "pos-subtitle");
      attr(div1, "class", "pos-project-list");
      attr(div2, "class", "pos-projects-central-pane");
      attr(div3, "class", "pos-projects-selection-layout");
    },
    m(target, anchor) {
      insert(target, div3, anchor);
      append(div3, div2);
      append(div2, div0);
      append(div0, h2);
      append(div0, t1);
      append(div0, button);
      append(div2, t3);
      append(div2, p_1);
      append(div2, t5);
      append(div2, div1);
      if_block.m(div1, null);
      if (!mounted) {
        dispose = listen(
          button,
          "click",
          /*handleCreateProject*/
          ctx[6]
        );
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (current_block_type === (current_block_type = select_block_type(ctx2, dirty)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(div1, null);
        }
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div3);
      }
      if_block.d();
      mounted = false;
      dispose();
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let activeProjects;
  let tasks;
  let allTimes;
  let minTime;
  let maxTime;
  let range;
  let $tasksStore;
  let $projectsStore;
  component_subscribe($$self, tasksStore, ($$value) => $$invalidate(16, $tasksStore = $$value));
  component_subscribe($$self, projectsStore, ($$value) => $$invalidate(17, $projectsStore = $$value));
  let { app } = $$props;
  let { fileManager } = $$props;
  let { plugin } = $$props;
  let { isFullPage = false } = $$props;
  let { onSelect } = $$props;
  let timer;
  let now2 = Date.now();
  onMount(() => {
    timer = window.setInterval(
      () => {
        $$invalidate(2, now2 = Date.now());
      },
      6e4
    );
  });
  onDestroy(() => {
    window.clearInterval(timer);
  });
  function getHue(createdAt, range2, minTime2) {
    const tMs = new Date(createdAt).getTime();
    const ratio = range2 > 1 ? (tMs - minTime2) / range2 : 0;
    return 120 * (1 - ratio);
  }
  function handleCreateProject() {
    new NewProjectModal(
      app,
      async (name, desc) => {
        const id = `proj-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
        const fm = {
          type: "project",
          name,
          description: desc || "",
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          status: "active"
        };
        const content = "---\n" + Object.entries(fm).map(([k, v]) => `${k}: ${v}`).join("\n") + "\n---\n\n# " + name + "\n";
        await fileManager.ensureFolder(`projects/${id}`);
        await app.vault.create(`projects/${id}/index.md`, content);
        await fileManager.loadAll();
        if (isFullPage) {
          onSelect(id, "elastic");
        } else {
          plugin.activateWorkspaceView(id);
        }
        new import_obsidian3.Notice("Project created successfully!");
      }
    ).open();
  }
  async function handleDeleteProject(id) {
    if (confirm("Delete project and its Markdown file? Tasks remain but will be uncategorized.")) {
      const file = app.vault.getAbstractFileByPath(`projects/${id}.md`);
      if (file) {
        await app.vault.delete(file);
        const linked = tasks.filter((t) => t.project === id);
        for (const t of linked) {
          await fileManager.updateTask(t.id, { project: null });
        }
        await fileManager.loadAll();
        new import_obsidian3.Notice("Project deleted.");
      }
    }
  }
  function handleSelectProject(id) {
    if (isFullPage) {
      onSelect(id, "elastic");
    } else {
      plugin.activateWorkspaceView(id);
    }
  }
  const click_handler = (p) => handleSelectProject(p.id);
  const click_handler_1 = (p) => handleSelectProject(p.id);
  const click_handler_2 = (p) => handleDeleteProject(p.id);
  const func2 = (p, t) => t.project === p.id;
  $$self.$$set = ($$props2) => {
    if ("app" in $$props2)
      $$invalidate(9, app = $$props2.app);
    if ("fileManager" in $$props2)
      $$invalidate(10, fileManager = $$props2.fileManager);
    if ("plugin" in $$props2)
      $$invalidate(11, plugin = $$props2.plugin);
    if ("isFullPage" in $$props2)
      $$invalidate(12, isFullPage = $$props2.isFullPage);
    if ("onSelect" in $$props2)
      $$invalidate(13, onSelect = $$props2.onSelect);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*$projectsStore*/
    131072) {
      $:
        $$invalidate(1, activeProjects = $projectsStore.filter((p) => p.status === "active"));
    }
    if ($$self.$$.dirty & /*$tasksStore*/
    65536) {
      $:
        $$invalidate(4, tasks = $tasksStore);
    }
    if ($$self.$$.dirty & /*activeProjects*/
    2) {
      $:
        $$invalidate(15, allTimes = activeProjects.map((p) => new Date(p.createdAt).getTime()));
    }
    if ($$self.$$.dirty & /*allTimes*/
    32768) {
      $:
        $$invalidate(0, minTime = Math.min(...allTimes));
    }
    if ($$self.$$.dirty & /*allTimes*/
    32768) {
      $:
        $$invalidate(14, maxTime = Math.max(...allTimes));
    }
    if ($$self.$$.dirty & /*maxTime, minTime*/
    16385) {
      $:
        $$invalidate(3, range = maxTime - minTime || 1);
    }
  };
  return [
    minTime,
    activeProjects,
    now2,
    range,
    tasks,
    getHue,
    handleCreateProject,
    handleDeleteProject,
    handleSelectProject,
    app,
    fileManager,
    plugin,
    isFullPage,
    onSelect,
    maxTime,
    allTimes,
    $tasksStore,
    $projectsStore,
    click_handler,
    click_handler_1,
    click_handler_2,
    func2
  ];
}
var AgingView = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {
      app: 9,
      fileManager: 10,
      plugin: 11,
      isFullPage: 12,
      onSelect: 13
    });
  }
};
var AgingView_default = AgingView;

// src/ui/views/ElasticView.svelte
var import_obsidian4 = require("obsidian");
function get_each_context2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[70] = list[i];
  child_ctx[72] = i;
  return child_ctx;
}
function get_each_context_1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[70] = list[i];
  child_ctx[72] = i;
  const constants_0 = (
    /*timeline*/
    child_ctx[6].find(function func2(...args) {
      return (
        /*func*/
        ctx[53](
          /*task*/
          child_ctx[70],
          ...args
        )
      );
    })
  );
  child_ctx[73] = constants_0;
  return child_ctx;
}
function get_each_context_2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[70] = list[i];
  child_ctx[72] = i;
  return child_ctx;
}
function create_if_block_12(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "pos-drag-placeholder");
      set_style(
        div,
        "height",
        /*dragHeight*/
        ctx[12] + "px"
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*dragHeight*/
      4096) {
        set_style(
          div,
          "height",
          /*dragHeight*/
          ctx2[12] + "px"
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block_11(ctx) {
  let div;
  let t_value = (
    /*task*/
    ctx[70].description + ""
  );
  let t;
  return {
    c() {
      div = element("div");
      t = text(t_value);
      attr(div, "class", "pos-card-desc");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*backlog*/
      32768 && t_value !== (t_value = /*task*/
      ctx2[70].description + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_each_block_2(key_1, ctx) {
  let first;
  let t0;
  let div3;
  let div1;
  let div0;
  let t1_value = (
    /*task*/
    ctx[70].name + ""
  );
  let t1;
  let t2;
  let t3;
  let div2;
  let button;
  let mounted;
  let dispose;
  let if_block0 = (
    /*dragOverStatus*/
    ctx[10] === "backlog" && /*dragOverIndex*/
    ctx[11] === /*i*/
    ctx[72] && create_if_block_12(ctx)
  );
  let if_block1 = (
    /*task*/
    ctx[70].description && create_if_block_11(ctx)
  );
  function click_handler_3() {
    return (
      /*click_handler_3*/
      ctx[41](
        /*task*/
        ctx[70]
      )
    );
  }
  function click_handler_4() {
    return (
      /*click_handler_4*/
      ctx[42](
        /*task*/
        ctx[70]
      )
    );
  }
  function dragstart_handler(...args) {
    return (
      /*dragstart_handler*/
      ctx[43](
        /*task*/
        ctx[70],
        ...args
      )
    );
  }
  return {
    key: key_1,
    first: null,
    c() {
      first = empty();
      if (if_block0)
        if_block0.c();
      t0 = space();
      div3 = element("div");
      div1 = element("div");
      div0 = element("div");
      t1 = text(t1_value);
      t2 = space();
      if (if_block1)
        if_block1.c();
      t3 = space();
      div2 = element("div");
      button = element("button");
      button.textContent = "Delete";
      attr(div0, "class", "pos-card-name");
      set_style(div1, "cursor", "pointer");
      attr(button, "class", "pos-del");
      attr(div2, "class", "pos-card-acts");
      attr(div3, "class", "pos-card");
      attr(div3, "draggable", "true");
      toggle_class(
        div3,
        "pos-dragging-source",
        /*dragId*/
        ctx[9] === /*task*/
        ctx[70].id
      );
      this.first = first;
    },
    m(target, anchor) {
      insert(target, first, anchor);
      if (if_block0)
        if_block0.m(target, anchor);
      insert(target, t0, anchor);
      insert(target, div3, anchor);
      append(div3, div1);
      append(div1, div0);
      append(div0, t1);
      append(div1, t2);
      if (if_block1)
        if_block1.m(div1, null);
      append(div3, t3);
      append(div3, div2);
      append(div2, button);
      if (!mounted) {
        dispose = [
          listen(div1, "click", click_handler_3),
          listen(button, "click", click_handler_4),
          listen(div3, "dragstart", dragstart_handler),
          listen(
            div3,
            "dragend",
            /*handleDragEnd*/
            ctx[25]
          )
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (
        /*dragOverStatus*/
        ctx[10] === "backlog" && /*dragOverIndex*/
        ctx[11] === /*i*/
        ctx[72]
      ) {
        if (if_block0) {
          if_block0.p(ctx, dirty);
        } else {
          if_block0 = create_if_block_12(ctx);
          if_block0.c();
          if_block0.m(t0.parentNode, t0);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (dirty[0] & /*backlog*/
      32768 && t1_value !== (t1_value = /*task*/
      ctx[70].name + ""))
        set_data(t1, t1_value);
      if (
        /*task*/
        ctx[70].description
      ) {
        if (if_block1) {
          if_block1.p(ctx, dirty);
        } else {
          if_block1 = create_if_block_11(ctx);
          if_block1.c();
          if_block1.m(div1, null);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (dirty[0] & /*dragId, backlog*/
      33280) {
        toggle_class(
          div3,
          "pos-dragging-source",
          /*dragId*/
          ctx[9] === /*task*/
          ctx[70].id
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(first);
        detach(t0);
        detach(div3);
      }
      if (if_block0)
        if_block0.d(detaching);
      if (if_block1)
        if_block1.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_10(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "pos-drag-placeholder");
      set_style(
        div,
        "height",
        /*dragHeight*/
        ctx[12] + "px"
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*dragHeight*/
      4096) {
        set_style(
          div,
          "height",
          /*dragHeight*/
          ctx2[12] + "px"
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block_9(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "pos-drag-placeholder");
      set_style(
        div,
        "height",
        /*dragHeight*/
        ctx[12] + "px"
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*dragHeight*/
      4096) {
        set_style(
          div,
          "height",
          /*dragHeight*/
          ctx2[12] + "px"
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block_8(ctx) {
  let div;
  let t_value = (
    /*task*/
    ctx[70].description + ""
  );
  let t;
  return {
    c() {
      div = element("div");
      t = text(t_value);
      attr(div, "class", "pos-card-desc");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*running*/
      32 && t_value !== (t_value = /*task*/
      ctx2[70].description + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block_7(ctx) {
  let span;
  let t0;
  let t1_value = (
    /*task*/
    ctx[70].fixedDuration + ""
  );
  let t1;
  let t2;
  return {
    c() {
      span = element("span");
      t0 = text("Fixed ");
      t1 = text(t1_value);
      t2 = text("m");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t0);
      append(span, t1);
      append(span, t2);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*running*/
      32 && t1_value !== (t1_value = /*task*/
      ctx2[70].fixedDuration + ""))
        set_data(t1, t1_value);
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_if_block_6(ctx) {
  let span;
  let t0_value = fmtTime(
    /*ti*/
    ctx[73].endTime
  ) + "";
  let t0;
  let t1;
  let t2_value = fmtDur(Math.round(
    /*ti*/
    ctx[73].calculatedDuration
  )) + "";
  let t2;
  let t3;
  return {
    c() {
      span = element("span");
      t0 = text(t0_value);
      t1 = text(" (");
      t2 = text(t2_value);
      t3 = text(")");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t0);
      append(span, t1);
      append(span, t2);
      append(span, t3);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*timeline, running*/
      96 && t0_value !== (t0_value = fmtTime(
        /*ti*/
        ctx2[73].endTime
      ) + ""))
        set_data(t0, t0_value);
      if (dirty[0] & /*timeline, running*/
      96 && t2_value !== (t2_value = fmtDur(Math.round(
        /*ti*/
        ctx2[73].calculatedDuration
      )) + ""))
        set_data(t2, t2_value);
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_if_block_5(ctx) {
  let input;
  let input_value_value;
  let mounted;
  let dispose;
  function change_handler_1(...args) {
    return (
      /*change_handler_1*/
      ctx[50](
        /*task*/
        ctx[70],
        ...args
      )
    );
  }
  return {
    c() {
      input = element("input");
      attr(input, "type", "number");
      attr(input, "min", "1");
      attr(input, "class", "pos-fixed-input");
      input.value = input_value_value = /*task*/
      ctx[70].fixedDuration || 30;
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (!mounted) {
        dispose = [
          listen(input, "click", stop_propagation(
            /*click_handler_1*/
            ctx[33]
          )),
          listen(input, "keydown", stop_propagation(
            /*keydown_handler*/
            ctx[34]
          )),
          listen(input, "keypress", stop_propagation(
            /*keypress_handler*/
            ctx[35]
          )),
          listen(input, "keyup", stop_propagation(
            /*keyup_handler*/
            ctx[36]
          )),
          listen(input, "change", change_handler_1)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & /*running*/
      32 && input_value_value !== (input_value_value = /*task*/
      ctx[70].fixedDuration || 30) && input.value !== input_value_value) {
        input.value = input_value_value;
      }
    },
    d(detaching) {
      if (detaching) {
        detach(input);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_each_block_1(key_1, ctx) {
  let first;
  let t0;
  let div4;
  let div2;
  let div0;
  let t1_value = (
    /*task*/
    ctx[70].name + ""
  );
  let t1;
  let t2;
  let t3;
  let div1;
  let t4;
  let t5;
  let div3;
  let span1;
  let button0;
  let t7;
  let span0;
  let t8_value = (
    /*task*/
    ctx[70].weight + ""
  );
  let t8;
  let t9;
  let button1;
  let t11;
  let label;
  let input;
  let input_checked_value;
  let t12;
  let span2;
  let t14;
  let t15;
  let button2;
  let mounted;
  let dispose;
  let if_block0 = (
    /*dragOverStatus*/
    ctx[10] === "running" && /*dragOverIndex*/
    ctx[11] === /*i*/
    ctx[72] && create_if_block_9(ctx)
  );
  let if_block1 = (
    /*task*/
    ctx[70].description && create_if_block_8(ctx)
  );
  let if_block2 = (
    /*task*/
    ctx[70].isFixedDuration && /*task*/
    ctx[70].fixedDuration && create_if_block_7(ctx)
  );
  let if_block3 = (
    /*ti*/
    ctx[73] && create_if_block_6(ctx)
  );
  function click_handler_5() {
    return (
      /*click_handler_5*/
      ctx[46](
        /*task*/
        ctx[70]
      )
    );
  }
  function click_handler_6() {
    return (
      /*click_handler_6*/
      ctx[47](
        /*task*/
        ctx[70]
      )
    );
  }
  function click_handler_7() {
    return (
      /*click_handler_7*/
      ctx[48](
        /*task*/
        ctx[70]
      )
    );
  }
  function change_handler(...args) {
    return (
      /*change_handler*/
      ctx[49](
        /*task*/
        ctx[70],
        ...args
      )
    );
  }
  let if_block4 = (
    /*task*/
    ctx[70].isFixedDuration && create_if_block_5(ctx)
  );
  function click_handler_8() {
    return (
      /*click_handler_8*/
      ctx[51](
        /*task*/
        ctx[70]
      )
    );
  }
  function dragstart_handler_1(...args) {
    return (
      /*dragstart_handler_1*/
      ctx[52](
        /*task*/
        ctx[70],
        ...args
      )
    );
  }
  return {
    key: key_1,
    first: null,
    c() {
      first = empty();
      if (if_block0)
        if_block0.c();
      t0 = space();
      div4 = element("div");
      div2 = element("div");
      div0 = element("div");
      t1 = text(t1_value);
      t2 = space();
      if (if_block1)
        if_block1.c();
      t3 = space();
      div1 = element("div");
      if (if_block2)
        if_block2.c();
      t4 = space();
      if (if_block3)
        if_block3.c();
      t5 = space();
      div3 = element("div");
      span1 = element("span");
      button0 = element("button");
      button0.textContent = "\u2212";
      t7 = space();
      span0 = element("span");
      t8 = text(t8_value);
      t9 = space();
      button1 = element("button");
      button1.textContent = "+";
      t11 = space();
      label = element("label");
      input = element("input");
      t12 = space();
      span2 = element("span");
      span2.textContent = "Fixed";
      t14 = space();
      if (if_block4)
        if_block4.c();
      t15 = space();
      button2 = element("button");
      button2.textContent = "Delete";
      attr(div0, "class", "pos-card-name");
      attr(div1, "class", "pos-card-meta");
      set_style(div2, "cursor", "pointer");
      attr(span1, "class", "pos-wg");
      attr(input, "type", "checkbox");
      input.checked = input_checked_value = /*task*/
      ctx[70].isFixedDuration;
      attr(label, "class", "pos-fixed");
      attr(button2, "class", "pos-del");
      attr(div3, "class", "pos-card-acts");
      attr(div4, "class", "pos-card");
      set_style(
        div4,
        "height",
        /*taskHeights*/
        ctx[14][
          /*task*/
          ctx[70].id
        ] ? (
          /*taskHeights*/
          ctx[14][
            /*task*/
            ctx[70].id
          ] + "px"
        ) : "auto"
      );
      attr(div4, "draggable", "true");
      toggle_class(
        div4,
        "pos-dragging-source",
        /*dragId*/
        ctx[9] === /*task*/
        ctx[70].id
      );
      this.first = first;
    },
    m(target, anchor) {
      insert(target, first, anchor);
      if (if_block0)
        if_block0.m(target, anchor);
      insert(target, t0, anchor);
      insert(target, div4, anchor);
      append(div4, div2);
      append(div2, div0);
      append(div0, t1);
      append(div2, t2);
      if (if_block1)
        if_block1.m(div2, null);
      append(div2, t3);
      append(div2, div1);
      if (if_block2)
        if_block2.m(div1, null);
      append(div1, t4);
      if (if_block3)
        if_block3.m(div1, null);
      append(div4, t5);
      append(div4, div3);
      append(div3, span1);
      append(span1, button0);
      append(span1, t7);
      append(span1, span0);
      append(span0, t8);
      append(span1, t9);
      append(span1, button1);
      append(div3, t11);
      append(div3, label);
      append(label, input);
      append(label, t12);
      append(label, span2);
      append(div3, t14);
      if (if_block4)
        if_block4.m(div3, null);
      append(div3, t15);
      append(div3, button2);
      if (!mounted) {
        dispose = [
          listen(div2, "click", click_handler_5),
          listen(button0, "click", click_handler_6),
          listen(button1, "click", click_handler_7),
          listen(input, "change", change_handler),
          listen(label, "click", stop_propagation(
            /*click_handler*/
            ctx[37]
          )),
          listen(button2, "click", click_handler_8),
          listen(div4, "dragstart", dragstart_handler_1),
          listen(
            div4,
            "dragend",
            /*handleDragEnd*/
            ctx[25]
          )
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (
        /*dragOverStatus*/
        ctx[10] === "running" && /*dragOverIndex*/
        ctx[11] === /*i*/
        ctx[72]
      ) {
        if (if_block0) {
          if_block0.p(ctx, dirty);
        } else {
          if_block0 = create_if_block_9(ctx);
          if_block0.c();
          if_block0.m(t0.parentNode, t0);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (dirty[0] & /*running*/
      32 && t1_value !== (t1_value = /*task*/
      ctx[70].name + ""))
        set_data(t1, t1_value);
      if (
        /*task*/
        ctx[70].description
      ) {
        if (if_block1) {
          if_block1.p(ctx, dirty);
        } else {
          if_block1 = create_if_block_8(ctx);
          if_block1.c();
          if_block1.m(div2, t3);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (
        /*task*/
        ctx[70].isFixedDuration && /*task*/
        ctx[70].fixedDuration
      ) {
        if (if_block2) {
          if_block2.p(ctx, dirty);
        } else {
          if_block2 = create_if_block_7(ctx);
          if_block2.c();
          if_block2.m(div1, t4);
        }
      } else if (if_block2) {
        if_block2.d(1);
        if_block2 = null;
      }
      if (
        /*ti*/
        ctx[73]
      ) {
        if (if_block3) {
          if_block3.p(ctx, dirty);
        } else {
          if_block3 = create_if_block_6(ctx);
          if_block3.c();
          if_block3.m(div1, null);
        }
      } else if (if_block3) {
        if_block3.d(1);
        if_block3 = null;
      }
      if (dirty[0] & /*running*/
      32 && t8_value !== (t8_value = /*task*/
      ctx[70].weight + ""))
        set_data(t8, t8_value);
      if (dirty[0] & /*running*/
      32 && input_checked_value !== (input_checked_value = /*task*/
      ctx[70].isFixedDuration)) {
        input.checked = input_checked_value;
      }
      if (
        /*task*/
        ctx[70].isFixedDuration
      ) {
        if (if_block4) {
          if_block4.p(ctx, dirty);
        } else {
          if_block4 = create_if_block_5(ctx);
          if_block4.c();
          if_block4.m(div3, t15);
        }
      } else if (if_block4) {
        if_block4.d(1);
        if_block4 = null;
      }
      if (dirty[0] & /*taskHeights, running*/
      16416) {
        set_style(
          div4,
          "height",
          /*taskHeights*/
          ctx[14][
            /*task*/
            ctx[70].id
          ] ? (
            /*taskHeights*/
            ctx[14][
              /*task*/
              ctx[70].id
            ] + "px"
          ) : "auto"
        );
      }
      if (dirty[0] & /*dragId, running*/
      544) {
        toggle_class(
          div4,
          "pos-dragging-source",
          /*dragId*/
          ctx[9] === /*task*/
          ctx[70].id
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(first);
        detach(t0);
        detach(div4);
      }
      if (if_block0)
        if_block0.d(detaching);
      if (if_block1)
        if_block1.d();
      if (if_block2)
        if_block2.d();
      if (if_block3)
        if_block3.d();
      if (if_block4)
        if_block4.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_4(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "pos-drag-placeholder");
      set_style(
        div,
        "height",
        /*dragHeight*/
        ctx[12] + "px"
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*dragHeight*/
      4096) {
        set_style(
          div,
          "height",
          /*dragHeight*/
          ctx2[12] + "px"
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block_32(ctx) {
  let div0;
  let t;
  let div1;
  return {
    c() {
      div0 = element("div");
      t = space();
      div1 = element("div");
      attr(div0, "class", "pos-wipe");
      set_style(div0, "top", "0px");
      set_style(
        div0,
        "height",
        /*lockWipeHeight*/
        ctx[8] + "px"
      );
      attr(div1, "class", "pos-redline");
      set_style(
        div1,
        "top",
        /*lockLineTop*/
        ctx[7] + "px"
      );
    },
    m(target, anchor) {
      insert(target, div0, anchor);
      insert(target, t, anchor);
      insert(target, div1, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*lockWipeHeight*/
      256) {
        set_style(
          div0,
          "height",
          /*lockWipeHeight*/
          ctx2[8] + "px"
        );
      }
      if (dirty[0] & /*lockLineTop*/
      128) {
        set_style(
          div1,
          "top",
          /*lockLineTop*/
          ctx2[7] + "px"
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div0);
        detach(t);
        detach(div1);
      }
    }
  };
}
function create_if_block_22(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "pos-drag-placeholder");
      set_style(
        div,
        "height",
        /*dragHeight*/
        ctx[12] + "px"
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*dragHeight*/
      4096) {
        set_style(
          div,
          "height",
          /*dragHeight*/
          ctx2[12] + "px"
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_each_block2(key_1, ctx) {
  let first;
  let t0;
  let div3;
  let div1;
  let div0;
  let t1_value = (
    /*task*/
    ctx[70].name + ""
  );
  let t1;
  let t2;
  let div2;
  let button;
  let mounted;
  let dispose;
  let if_block = (
    /*dragOverStatus*/
    ctx[10] === "review" && /*dragOverIndex*/
    ctx[11] === /*i*/
    ctx[72] && create_if_block_22(ctx)
  );
  function click_handler_9() {
    return (
      /*click_handler_9*/
      ctx[57](
        /*task*/
        ctx[70]
      )
    );
  }
  function click_handler_10() {
    return (
      /*click_handler_10*/
      ctx[58](
        /*task*/
        ctx[70]
      )
    );
  }
  function dragstart_handler_2(...args) {
    return (
      /*dragstart_handler_2*/
      ctx[59](
        /*task*/
        ctx[70],
        ...args
      )
    );
  }
  return {
    key: key_1,
    first: null,
    c() {
      first = empty();
      if (if_block)
        if_block.c();
      t0 = space();
      div3 = element("div");
      div1 = element("div");
      div0 = element("div");
      t1 = text(t1_value);
      t2 = space();
      div2 = element("div");
      button = element("button");
      button.textContent = "Delete";
      attr(div0, "class", "pos-card-name");
      set_style(div1, "cursor", "pointer");
      attr(button, "class", "pos-del");
      attr(div2, "class", "pos-card-acts");
      attr(div3, "class", "pos-card pos-completed");
      attr(div3, "draggable", "true");
      toggle_class(
        div3,
        "pos-dragging-source",
        /*dragId*/
        ctx[9] === /*task*/
        ctx[70].id
      );
      this.first = first;
    },
    m(target, anchor) {
      insert(target, first, anchor);
      if (if_block)
        if_block.m(target, anchor);
      insert(target, t0, anchor);
      insert(target, div3, anchor);
      append(div3, div1);
      append(div1, div0);
      append(div0, t1);
      append(div3, t2);
      append(div3, div2);
      append(div2, button);
      if (!mounted) {
        dispose = [
          listen(div1, "click", click_handler_9),
          listen(button, "click", click_handler_10),
          listen(div3, "dragstart", dragstart_handler_2),
          listen(
            div3,
            "dragend",
            /*handleDragEnd*/
            ctx[25]
          )
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (
        /*dragOverStatus*/
        ctx[10] === "review" && /*dragOverIndex*/
        ctx[11] === /*i*/
        ctx[72]
      ) {
        if (if_block) {
          if_block.p(ctx, dirty);
        } else {
          if_block = create_if_block_22(ctx);
          if_block.c();
          if_block.m(t0.parentNode, t0);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (dirty[0] & /*review*/
      8192 && t1_value !== (t1_value = /*task*/
      ctx[70].name + ""))
        set_data(t1, t1_value);
      if (dirty[0] & /*dragId, review*/
      8704) {
        toggle_class(
          div3,
          "pos-dragging-source",
          /*dragId*/
          ctx[9] === /*task*/
          ctx[70].id
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(first);
        detach(t0);
        detach(div3);
      }
      if (if_block)
        if_block.d(detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_13(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "pos-drag-placeholder");
      set_style(
        div,
        "height",
        /*dragHeight*/
        ctx[12] + "px"
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*dragHeight*/
      4096) {
        set_style(
          div,
          "height",
          /*dragHeight*/
          ctx2[12] + "px"
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block2(ctx) {
  let div;
  let button0;
  let t1;
  let button1;
  let mounted;
  let dispose;
  return {
    c() {
      div = element("div");
      button0 = element("button");
      button0.textContent = "Restore All";
      t1 = space();
      button1 = element("button");
      button1.textContent = "Delete All";
      attr(div, "class", "pos-bulk-row");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, button0);
      append(div, t1);
      append(div, button1);
      if (!mounted) {
        dispose = [
          listen(
            button0,
            "click",
            /*confirmRestoreAll*/
            ctx[21]
          ),
          listen(
            button1,
            "click",
            /*confirmDeleteAll*/
            ctx[22]
          )
        ];
        mounted = true;
      }
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment2(ctx) {
  let div1;
  let div0;
  let input0;
  let t0;
  let input1;
  let t1;
  let button0;
  let t3;
  let button1;
  let t4_value = (
    /*isLocked*/
    ctx[3] ? "Unlock" : "Lock"
  );
  let t4;
  let t5;
  let div12;
  let div5;
  let h40;
  let t6;
  let t7_value = (
    /*backlog*/
    ctx[15].length + ""
  );
  let t7;
  let t8;
  let t9;
  let div4;
  let div3;
  let each_blocks_2 = [];
  let each0_lookup = /* @__PURE__ */ new Map();
  let t10;
  let t11;
  let div2;
  let button2;
  let t13;
  let div8;
  let h41;
  let t14;
  let t15_value = (
    /*running*/
    ctx[5].length + ""
  );
  let t15;
  let t16;
  let t17;
  let div7;
  let div6;
  let each_blocks_1 = [];
  let each1_lookup = /* @__PURE__ */ new Map();
  let t18;
  let t19;
  let div7_resize_listener;
  let t20;
  let div11;
  let h42;
  let t21;
  let t22_value = (
    /*review*/
    ctx[13].length + ""
  );
  let t22;
  let t23;
  let t24;
  let div10;
  let div9;
  let each_blocks = [];
  let each2_lookup = /* @__PURE__ */ new Map();
  let t25;
  let t26;
  let mounted;
  let dispose;
  let each_value_2 = ensure_array_like(
    /*backlog*/
    ctx[15]
  );
  const get_key = (ctx2) => (
    /*task*/
    ctx2[70].id
  );
  for (let i = 0; i < each_value_2.length; i += 1) {
    let child_ctx = get_each_context_2(ctx, each_value_2, i);
    let key = get_key(child_ctx);
    each0_lookup.set(key, each_blocks_2[i] = create_each_block_2(key, child_ctx));
  }
  let if_block0 = (
    /*dragOverStatus*/
    ctx[10] === "backlog" && /*dragOverIndex*/
    ctx[11] >= /*backlog*/
    ctx[15].length && create_if_block_10(ctx)
  );
  let each_value_1 = ensure_array_like(
    /*running*/
    ctx[5]
  );
  const get_key_1 = (ctx2) => (
    /*task*/
    ctx2[70].id
  );
  for (let i = 0; i < each_value_1.length; i += 1) {
    let child_ctx = get_each_context_1(ctx, each_value_1, i);
    let key = get_key_1(child_ctx);
    each1_lookup.set(key, each_blocks_1[i] = create_each_block_1(key, child_ctx));
  }
  let if_block1 = (
    /*dragOverStatus*/
    ctx[10] === "running" && /*dragOverIndex*/
    ctx[11] >= /*running*/
    ctx[5].length && create_if_block_4(ctx)
  );
  let if_block2 = (
    /*isLocked*/
    ctx[3] && create_if_block_32(ctx)
  );
  let each_value = ensure_array_like(
    /*review*/
    ctx[13]
  );
  const get_key_2 = (ctx2) => (
    /*task*/
    ctx2[70].id
  );
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context2(ctx, each_value, i);
    let key = get_key_2(child_ctx);
    each2_lookup.set(key, each_blocks[i] = create_each_block2(key, child_ctx));
  }
  let if_block3 = (
    /*dragOverStatus*/
    ctx[10] === "review" && /*dragOverIndex*/
    ctx[11] >= /*review*/
    ctx[13].length && create_if_block_13(ctx)
  );
  let if_block4 = (
    /*review*/
    ctx[13].length > 0 && create_if_block2(ctx)
  );
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      input0 = element("input");
      t0 = space();
      input1 = element("input");
      t1 = space();
      button0 = element("button");
      button0.textContent = "Apply";
      t3 = space();
      button1 = element("button");
      t4 = text(t4_value);
      t5 = space();
      div12 = element("div");
      div5 = element("div");
      h40 = element("h4");
      t6 = text("Backlog (");
      t7 = text(t7_value);
      t8 = text(")");
      t9 = space();
      div4 = element("div");
      div3 = element("div");
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        each_blocks_2[i].c();
      }
      t10 = space();
      if (if_block0)
        if_block0.c();
      t11 = space();
      div2 = element("div");
      button2 = element("button");
      button2.textContent = "+ New Task";
      t13 = space();
      div8 = element("div");
      h41 = element("h4");
      t14 = text("Running (");
      t15 = text(t15_value);
      t16 = text(")");
      t17 = space();
      div7 = element("div");
      div6 = element("div");
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].c();
      }
      t18 = space();
      if (if_block1)
        if_block1.c();
      t19 = space();
      if (if_block2)
        if_block2.c();
      t20 = space();
      div11 = element("div");
      h42 = element("h4");
      t21 = text("Review (");
      t22 = text(t22_value);
      t23 = text(")");
      t24 = space();
      div10 = element("div");
      div9 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t25 = space();
      if (if_block3)
        if_block3.c();
      t26 = space();
      if (if_block4)
        if_block4.c();
      attr(input0, "type", "date");
      attr(input1, "type", "time");
      attr(input1, "step", "60");
      attr(button1, "class", "pos-lock-btn");
      toggle_class(
        button1,
        "locked",
        /*isLocked*/
        ctx[3]
      );
      attr(div0, "class", "pos-deadline-controls");
      attr(div1, "class", "pos-header");
      attr(h40, "class", "pos-col-title");
      attr(button2, "class", "pos-newtask-btn");
      attr(div2, "class", "pos-newtask-row");
      attr(div3, "class", "pos-list");
      attr(div4, "class", "pos-list-wrapper");
      attr(div5, "class", "pos-col");
      attr(h41, "class", "pos-col-title");
      attr(div6, "class", "pos-list");
      attr(div7, "class", "pos-list-wrapper");
      add_render_callback(() => (
        /*div7_elementresize_handler*/
        ctx[54].call(div7)
      ));
      attr(div8, "class", "pos-col");
      attr(h42, "class", "pos-col-title");
      attr(div9, "class", "pos-list");
      attr(div10, "class", "pos-list-wrapper");
      attr(div11, "class", "pos-col");
      attr(div12, "class", "pos-columns");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      append(div0, input0);
      set_input_value(
        input0,
        /*dDate*/
        ctx[1]
      );
      append(div0, t0);
      append(div0, input1);
      set_input_value(
        input1,
        /*dTime*/
        ctx[2]
      );
      append(div0, t1);
      append(div0, button0);
      append(div0, t3);
      append(div0, button1);
      append(button1, t4);
      insert(target, t5, anchor);
      insert(target, div12, anchor);
      append(div12, div5);
      append(div5, h40);
      append(h40, t6);
      append(h40, t7);
      append(h40, t8);
      append(div5, t9);
      append(div5, div4);
      append(div4, div3);
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        if (each_blocks_2[i]) {
          each_blocks_2[i].m(div3, null);
        }
      }
      append(div3, t10);
      if (if_block0)
        if_block0.m(div3, null);
      append(div3, t11);
      append(div3, div2);
      append(div2, button2);
      append(div12, t13);
      append(div12, div8);
      append(div8, h41);
      append(h41, t14);
      append(h41, t15);
      append(h41, t16);
      append(div8, t17);
      append(div8, div7);
      append(div7, div6);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        if (each_blocks_1[i]) {
          each_blocks_1[i].m(div6, null);
        }
      }
      append(div6, t18);
      if (if_block1)
        if_block1.m(div6, null);
      append(div7, t19);
      if (if_block2)
        if_block2.m(div7, null);
      div7_resize_listener = add_iframe_resize_listener(
        div7,
        /*div7_elementresize_handler*/
        ctx[54].bind(div7)
      );
      append(div12, t20);
      append(div12, div11);
      append(div11, h42);
      append(h42, t21);
      append(h42, t22);
      append(h42, t23);
      append(div11, t24);
      append(div11, div10);
      append(div10, div9);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div9, null);
        }
      }
      append(div9, t25);
      if (if_block3)
        if_block3.m(div9, null);
      append(div9, t26);
      if (if_block4)
        if_block4.m(div9, null);
      if (!mounted) {
        dispose = [
          listen(
            input0,
            "input",
            /*input0_input_handler*/
            ctx[38]
          ),
          listen(
            input1,
            "input",
            /*input1_input_handler*/
            ctx[39]
          ),
          listen(
            button0,
            "click",
            /*click_handler_2*/
            ctx[40]
          ),
          listen(
            button1,
            "click",
            /*toggleLock*/
            ctx[23]
          ),
          listen(
            button2,
            "click",
            /*createTask*/
            ctx[16]
          ),
          listen(
            div4,
            "dragover",
            /*dragover_handler*/
            ctx[44]
          ),
          listen(
            div4,
            "drop",
            /*drop_handler*/
            ctx[45]
          ),
          listen(
            div7,
            "dragover",
            /*dragover_handler_1*/
            ctx[55]
          ),
          listen(
            div7,
            "drop",
            /*drop_handler_1*/
            ctx[56]
          ),
          listen(
            div10,
            "dragover",
            /*dragover_handler_2*/
            ctx[60]
          ),
          listen(
            div10,
            "drop",
            /*drop_handler_2*/
            ctx[61]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*dDate*/
      2) {
        set_input_value(
          input0,
          /*dDate*/
          ctx2[1]
        );
      }
      if (dirty[0] & /*dTime*/
      4) {
        set_input_value(
          input1,
          /*dTime*/
          ctx2[2]
        );
      }
      if (dirty[0] & /*isLocked*/
      8 && t4_value !== (t4_value = /*isLocked*/
      ctx2[3] ? "Unlock" : "Lock"))
        set_data(t4, t4_value);
      if (dirty[0] & /*isLocked*/
      8) {
        toggle_class(
          button1,
          "locked",
          /*isLocked*/
          ctx2[3]
        );
      }
      if (dirty[0] & /*backlog*/
      32768 && t7_value !== (t7_value = /*backlog*/
      ctx2[15].length + ""))
        set_data(t7, t7_value);
      if (dirty[0] & /*dragId, backlog, handleDragStart, handleDragEnd, deleteTask, editTask, dragHeight, dragOverStatus, dragOverIndex*/
      51551744) {
        each_value_2 = ensure_array_like(
          /*backlog*/
          ctx2[15]
        );
        each_blocks_2 = update_keyed_each(each_blocks_2, dirty, get_key, 1, ctx2, each_value_2, each0_lookup, div3, destroy_block, create_each_block_2, t10, get_each_context_2);
      }
      if (
        /*dragOverStatus*/
        ctx2[10] === "backlog" && /*dragOverIndex*/
        ctx2[11] >= /*backlog*/
        ctx2[15].length
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0 = create_if_block_10(ctx2);
          if_block0.c();
          if_block0.m(div3, t11);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (dirty[0] & /*running*/
      32 && t15_value !== (t15_value = /*running*/
      ctx2[5].length + ""))
        set_data(t15, t15_value);
      if (dirty[0] & /*taskHeights, running, dragId, handleDragStart, handleDragEnd, deleteTask, setFixed, toggleFixed, fileManager, editTask, timeline, dragHeight, dragOverStatus, dragOverIndex*/
      52321889) {
        each_value_1 = ensure_array_like(
          /*running*/
          ctx2[5]
        );
        each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key_1, 1, ctx2, each_value_1, each1_lookup, div6, destroy_block, create_each_block_1, t18, get_each_context_1);
      }
      if (
        /*dragOverStatus*/
        ctx2[10] === "running" && /*dragOverIndex*/
        ctx2[11] >= /*running*/
        ctx2[5].length
      ) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block_4(ctx2);
          if_block1.c();
          if_block1.m(div6, null);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (
        /*isLocked*/
        ctx2[3]
      ) {
        if (if_block2) {
          if_block2.p(ctx2, dirty);
        } else {
          if_block2 = create_if_block_32(ctx2);
          if_block2.c();
          if_block2.m(div7, null);
        }
      } else if (if_block2) {
        if_block2.d(1);
        if_block2 = null;
      }
      if (dirty[0] & /*review*/
      8192 && t22_value !== (t22_value = /*review*/
      ctx2[13].length + ""))
        set_data(t22, t22_value);
      if (dirty[0] & /*dragId, review, handleDragStart, handleDragEnd, deleteTask, editTask, dragHeight, dragOverStatus, dragOverIndex*/
      51527168) {
        each_value = ensure_array_like(
          /*review*/
          ctx2[13]
        );
        each_blocks = update_keyed_each(each_blocks, dirty, get_key_2, 1, ctx2, each_value, each2_lookup, div9, destroy_block, create_each_block2, t25, get_each_context2);
      }
      if (
        /*dragOverStatus*/
        ctx2[10] === "review" && /*dragOverIndex*/
        ctx2[11] >= /*review*/
        ctx2[13].length
      ) {
        if (if_block3) {
          if_block3.p(ctx2, dirty);
        } else {
          if_block3 = create_if_block_13(ctx2);
          if_block3.c();
          if_block3.m(div9, t26);
        }
      } else if (if_block3) {
        if_block3.d(1);
        if_block3 = null;
      }
      if (
        /*review*/
        ctx2[13].length > 0
      ) {
        if (if_block4) {
          if_block4.p(ctx2, dirty);
        } else {
          if_block4 = create_if_block2(ctx2);
          if_block4.c();
          if_block4.m(div9, null);
        }
      } else if (if_block4) {
        if_block4.d(1);
        if_block4 = null;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div1);
        detach(t5);
        detach(div12);
      }
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        each_blocks_2[i].d();
      }
      if (if_block0)
        if_block0.d();
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].d();
      }
      if (if_block1)
        if_block1.d();
      if (if_block2)
        if_block2.d();
      div7_resize_listener();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
      if (if_block3)
        if_block3.d();
      if (if_block4)
        if_block4.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance2($$self, $$props, $$invalidate) {
  let projectTasks;
  let backlog;
  let running;
  let review;
  let timeline;
  let taskHeights;
  let $tasksStore;
  component_subscribe($$self, tasksStore, ($$value) => $$invalidate(32, $tasksStore = $$value));
  let { app } = $$props;
  let { fileManager } = $$props;
  let { projectId } = $$props;
  let deadline = /* @__PURE__ */ new Date();
  deadline.setHours(17, 0, 0, 0);
  let dDate = fmtDate(deadline.toISOString());
  let dTime = fmtTime(deadline.toISOString());
  let isLocked = false;
  let lockAt = null;
  let lockDeadline = null;
  let lockedTimeline = [];
  let now2 = Date.now();
  let timer;
  let runningWrapperHeight = 300;
  let lockLineTop = 0;
  let lockWipeHeight = 0;
  function updateLockProgress() {
    if (!isLocked || !lockAt || !lockDeadline)
      return;
    const start = new Date(lockAt).getTime();
    const end = new Date(lockDeadline).getTime();
    const p = Math.min(1, Math.max(0, (Date.now() - start) / (end - start)));
    const totalHeight = runningWrapperHeight;
    $$invalidate(7, lockLineTop = p * totalHeight);
    $$invalidate(8, lockWipeHeight = lockLineTop);
  }
  onMount(() => {
    timer = window.setInterval(
      () => {
        now2 = Date.now();
        if (isLocked) {
          updateLockProgress();
        }
      },
      1e3
    );
  });
  onDestroy(() => {
    window.clearInterval(timer);
  });
  function createTask() {
    new NewTaskModal(
      app,
      async (name) => {
        await fileManager.createTask({ name, project: projectId });
      }
    ).open();
  }
  function editTask(task) {
    new EditTaskModal(
      app,
      task,
      async (updates) => {
        await fileManager.updateTask(task.id, updates);
      }
    ).open();
  }
  function openTaskFile(taskId) {
    const file = app.vault.getAbstractFileByPath(`tasks/${taskId}.md`);
    if (file instanceof import_obsidian4.TFile) {
      app.workspace.getLeaf().openFile(file);
    }
  }
  async function updateStatus(task, status) {
    await fileManager.updateTask(task.id, { status, isCompleted: status === "review" });
  }
  async function toggleFixed(task, isFixed) {
    await fileManager.updateTask(task.id, {
      isFixedDuration: isFixed,
      fixedDuration: isFixed ? task.fixedDuration || 30 : null
    });
  }
  async function setFixed(task, duration) {
    await fileManager.updateTask(task.id, {
      isFixedDuration: true,
      fixedDuration: duration
    });
  }
  async function deleteTask(id) {
    await fileManager.deleteTask(id);
  }
  function confirmRestoreAll() {
    new ConfirmModal(
      app,
      "Restore All",
      "Move all review tasks back to running?",
      () => {
        review.forEach((t) => fileManager.updateTask(t.id, { status: "running", isCompleted: false }));
      }
    ).open();
  }
  function confirmDeleteAll() {
    new ConfirmModal(
      app,
      "Delete All",
      "Permanently delete all tasks in review?",
      () => {
        review.forEach((t) => fileManager.deleteTask(t.id));
      }
    ).open();
  }
  function toggleLock() {
    if (isLocked) {
      $$invalidate(3, isLocked = false);
      lockAt = null;
      lockDeadline = null;
      $$invalidate(30, lockedTimeline = []);
    } else {
      const dl = /* @__PURE__ */ new Date(`${dDate}T${dTime}`);
      lockAt = (/* @__PURE__ */ new Date()).toISOString();
      lockDeadline = dl.toISOString();
      $$invalidate(30, lockedTimeline = calculateLiquidTimeline(running, /* @__PURE__ */ new Date(), dl));
      $$invalidate(3, isLocked = true);
      updateLockProgress();
    }
  }
  let dragId = null;
  let dragOverStatus = null;
  let dragOverIndex = -1;
  let dragHeight = 60;
  function handleDragStart(e, id) {
    const target = e.target.closest(".pos-card");
    if (target) {
      const rect = target.getBoundingClientRect();
      $$invalidate(12, dragHeight = rect.height);
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", id);
        const clone = target.cloneNode(true);
        clone.style.position = "absolute";
        clone.style.top = "-9999px";
        clone.style.left = "-9999px";
        clone.style.width = rect.width + "px";
        clone.style.height = rect.height + "px";
        clone.style.opacity = "1";
        clone.classList.remove("pos-dragging-source");
        document.body.appendChild(clone);
        e.dataTransfer.setDragImage(clone, e.clientX - rect.left, e.clientY - rect.top);
        setTimeout(
          () => {
            if (clone.parentNode)
              clone.parentNode.removeChild(clone);
          },
          50
        );
      }
    } else {
      if (e.dataTransfer)
        e.dataTransfer.setData("text/plain", id);
    }
    setTimeout(
      () => {
        $$invalidate(9, dragId = id);
      },
      0
    );
  }
  function handleDragEnd() {
    $$invalidate(9, dragId = null);
    $$invalidate(10, dragOverStatus = null);
    $$invalidate(11, dragOverIndex = -1);
  }
  function handleDragOver(e, status) {
    e.preventDefault();
    if (!dragId)
      return;
    const task = $tasksStore.find((t) => t.id === dragId);
    if (!task)
      return;
    if (isLocked && (task.status === "running" || status === "running") && task.status !== status) {
      if (e.dataTransfer)
        e.dataTransfer.dropEffect = "none";
      return;
    }
    const listEl = e.currentTarget.querySelector(".pos-list");
    if (!listEl)
      return;
    const isPlaceholderInThisColumn = dragOverStatus === status && dragOverIndex !== -1;
    const placeholderShift = dragHeight + 8;
    const cards = Array.from(listEl.querySelectorAll(".pos-card"));
    let index = 0;
    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect();
      let virtualTop = rect.top;
      if (isPlaceholderInThisColumn && dragOverIndex <= i) {
        virtualTop -= placeholderShift;
      }
      if (e.clientY < virtualTop + rect.height / 2) {
        index = i;
        break;
      }
      index = i + 1;
    }
    $$invalidate(10, dragOverStatus = status);
    $$invalidate(11, dragOverIndex = index);
  }
  async function handleDrop(e, status) {
    e.preventDefault();
    if (!dragId)
      return;
    const task = $tasksStore.find((t) => t.id === dragId);
    if (!task)
      return;
    const oldStatus = task.status;
    const targetIndex = dragOverIndex;
    $$invalidate(9, dragId = null);
    $$invalidate(10, dragOverStatus = null);
    $$invalidate(11, dragOverIndex = -1);
    const allTasksOfProject = $tasksStore.filter((t) => t.project === projectId);
    if (oldStatus === status) {
      const colTasks = allTasksOfProject.filter((t) => t.status === status);
      const cardToMove = colTasks.find((t) => t.id === task.id);
      if (!cardToMove)
        return;
      const oldIndex = colTasks.indexOf(cardToMove);
      if (oldIndex === targetIndex || oldIndex === targetIndex - 1)
        return;
      const newColTasks = [...colTasks];
      newColTasks.splice(oldIndex, 1);
      let adjustedTarget = targetIndex;
      if (oldIndex < targetIndex)
        adjustedTarget--;
      newColTasks.splice(adjustedTarget, 0, cardToMove);
      await Promise.all(newColTasks.map((t, idx) => fileManager.updateTask(t.id, { orderIndex: idx })));
    } else {
      if (isLocked && status === "running")
        return;
      const sourceCol = allTasksOfProject.filter((t) => t.status === oldStatus && t.id !== task.id);
      const destCol = allTasksOfProject.filter((t) => t.status === status);
      destCol.splice(targetIndex, 0, {
        ...task,
        status,
        isCompleted: status === "review"
      });
      await Promise.all([
        ...sourceCol.map((t, idx) => fileManager.updateTask(t.id, { orderIndex: idx })),
        ...destCol.map((t, idx) => fileManager.updateTask(t.id, {
          orderIndex: idx,
          status: t.id === task.id ? status : t.status,
          isCompleted: t.id === task.id ? status === "review" : t.isCompleted
        }))
      ]);
    }
  }
  function click_handler_1(event) {
    bubble.call(this, $$self, event);
  }
  function keydown_handler(event) {
    bubble.call(this, $$self, event);
  }
  function keypress_handler(event) {
    bubble.call(this, $$self, event);
  }
  function keyup_handler(event) {
    bubble.call(this, $$self, event);
  }
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  function input0_input_handler() {
    dDate = this.value;
    $$invalidate(1, dDate);
  }
  function input1_input_handler() {
    dTime = this.value;
    $$invalidate(2, dTime);
  }
  const click_handler_2 = () => {
    if (isLocked)
      return;
    $$invalidate(1, dDate);
  };
  const click_handler_3 = (task) => editTask(task);
  const click_handler_4 = (task) => deleteTask(task.id);
  const dragstart_handler = (task, e) => handleDragStart(e, task.id);
  const dragover_handler = (e) => handleDragOver(e, "backlog");
  const drop_handler = (e) => handleDrop(e, "backlog");
  const click_handler_5 = (task) => editTask(task);
  const click_handler_6 = (task) => fileManager.updateTask(task.id, { weight: Math.max(1, task.weight - 1) });
  const click_handler_7 = (task) => fileManager.updateTask(task.id, { weight: task.weight + 1 });
  const change_handler = (task, e) => toggleFixed(task, e.currentTarget.checked);
  const change_handler_1 = (task, e) => setFixed(task, Number(e.currentTarget.value));
  const click_handler_8 = (task) => deleteTask(task.id);
  const dragstart_handler_1 = (task, e) => handleDragStart(e, task.id);
  const func2 = (task, t) => t.id === task.id;
  function div7_elementresize_handler() {
    runningWrapperHeight = this.clientHeight;
    $$invalidate(4, runningWrapperHeight);
  }
  const dragover_handler_1 = (e) => handleDragOver(e, "running");
  const drop_handler_1 = (e) => handleDrop(e, "running");
  const click_handler_9 = (task) => editTask(task);
  const click_handler_10 = (task) => deleteTask(task.id);
  const dragstart_handler_2 = (task, e) => handleDragStart(e, task.id);
  const dragover_handler_2 = (e) => handleDragOver(e, "review");
  const drop_handler_2 = (e) => handleDrop(e, "review");
  $$self.$$set = ($$props2) => {
    if ("app" in $$props2)
      $$invalidate(28, app = $$props2.app);
    if ("fileManager" in $$props2)
      $$invalidate(0, fileManager = $$props2.fileManager);
    if ("projectId" in $$props2)
      $$invalidate(29, projectId = $$props2.projectId);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*projectId*/
    536870912 | $$self.$$.dirty[1] & /*$tasksStore*/
    2) {
      $:
        $$invalidate(31, projectTasks = getProjectTasks($tasksStore, projectId));
    }
    if ($$self.$$.dirty[1] & /*projectTasks*/
    1) {
      $:
        $$invalidate(15, backlog = projectTasks.filter((t) => t.status === "backlog"));
    }
    if ($$self.$$.dirty[1] & /*projectTasks*/
    1) {
      $:
        $$invalidate(5, running = projectTasks.filter((t) => t.status === "running"));
    }
    if ($$self.$$.dirty[1] & /*projectTasks*/
    1) {
      $:
        $$invalidate(13, review = projectTasks.filter((t) => t.status === "review"));
    }
    if ($$self.$$.dirty[0] & /*isLocked, lockedTimeline, running, dDate, dTime*/
    1073741870) {
      $:
        $$invalidate(6, timeline = isLocked ? lockedTimeline : calculateLiquidTimeline(running, /* @__PURE__ */ new Date(), /* @__PURE__ */ new Date(`${dDate}T${dTime}`)));
    }
    if ($$self.$$.dirty[0] & /*runningWrapperHeight, running, timeline*/
    112) {
      $:
        $$invalidate(14, taskHeights = (() => {
          const H = runningWrapperHeight;
          const heights = {};
          if (running.length === 0)
            return heights;
          const tl = timeline;
          const total = tl.reduce((s, t) => s + t.calculatedDuration, 0);
          if (total <= 0 || H <= 0) {
            const tw = running.reduce((s, t) => s + t.weight, 0) || 1;
            running.forEach((t) => {
              heights[t.id] = Math.max(65, t.weight / tw * Math.max(H, 300));
            });
            return heights;
          }
          running.forEach((t) => {
            const ti = tl.find((item) => item.id === t.id);
            const dur = ti ? ti.calculatedDuration : 0;
            heights[t.id] = Math.max(65, dur / total * H);
          });
          return heights;
        })());
    }
  };
  return [
    fileManager,
    dDate,
    dTime,
    isLocked,
    runningWrapperHeight,
    running,
    timeline,
    lockLineTop,
    lockWipeHeight,
    dragId,
    dragOverStatus,
    dragOverIndex,
    dragHeight,
    review,
    taskHeights,
    backlog,
    createTask,
    editTask,
    toggleFixed,
    setFixed,
    deleteTask,
    confirmRestoreAll,
    confirmDeleteAll,
    toggleLock,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    app,
    projectId,
    lockedTimeline,
    projectTasks,
    $tasksStore,
    click_handler_1,
    keydown_handler,
    keypress_handler,
    keyup_handler,
    click_handler,
    input0_input_handler,
    input1_input_handler,
    click_handler_2,
    click_handler_3,
    click_handler_4,
    dragstart_handler,
    dragover_handler,
    drop_handler,
    click_handler_5,
    click_handler_6,
    click_handler_7,
    change_handler,
    change_handler_1,
    click_handler_8,
    dragstart_handler_1,
    func2,
    div7_elementresize_handler,
    dragover_handler_1,
    drop_handler_1,
    click_handler_9,
    click_handler_10,
    dragstart_handler_2,
    dragover_handler_2,
    drop_handler_2
  ];
}
var ElasticView = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance2, create_fragment2, safe_not_equal, { app: 28, fileManager: 0, projectId: 29 }, null, [-1, -1, -1]);
  }
};
var ElasticView_default = ElasticView;

// src/ui/views/components/ProjectDeadlines.svelte
var { window: window_1 } = globals;
function get_each_context_7(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[97] = list[i];
  return child_ctx;
}
function get_each_context_8(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[89] = list[i];
  const constants_0 = new Date(
    /*task*/
    child_ctx[89].deadline || ""
  ).getTime() - /*now*/
  child_ctx[1];
  child_ctx[100] = constants_0;
  const constants_1 = new Date(
    /*task*/
    child_ctx[89].deadline || ""
  ).getTime() - new Date(
    /*task*/
    child_ctx[89].createdAt
  ).getTime();
  child_ctx[101] = constants_1;
  const constants_2 = (
    /*now*/
    child_ctx[1] - new Date(
      /*task*/
      child_ctx[89].createdAt
    ).getTime()
  );
  child_ctx[102] = constants_2;
  const constants_3 = (
    /*totalMs*/
    child_ctx[101] > 0 ? Math.min(1, Math.max(
      0,
      /*elapsed*/
      child_ctx[102] / /*totalMs*/
      child_ctx[101]
    )) : 1
  );
  child_ctx[103] = constants_3;
  return child_ctx;
}
function get_each_context_4(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[86] = list[i];
  return child_ctx;
}
function get_each_context_5(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[89] = list[i];
  const constants_0 = (
    /*getGanttPixelOffsets*/
    child_ctx[26](
      /*task*/
      child_ctx[89].startDate || /*task*/
      child_ctx[89].createdAt,
      /*task*/
      child_ctx[89].deadline || "",
      /*ganttZoom*/
      child_ctx[2]
    )
  );
  child_ctx[90] = constants_0;
  const constants_1 = new Date(
    /*task*/
    child_ctx[89].deadline || ""
  ).getTime() - /*now*/
  child_ctx[1];
  child_ctx[91] = constants_1;
  const constants_2 = (
    /*diffMs*/
    child_ctx[91] > 0 ? getHueForRemaining(
      /*diffMs*/
      child_ctx[91]
    ) : 0
  );
  child_ctx[92] = constants_2;
  return child_ctx;
}
function get_each_context_6(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[95] = list[i];
  child_ctx[85] = i;
  return child_ctx;
}
function get_each_context3(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[74] = list[i];
  return child_ctx;
}
function get_each_context_12(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[77] = list[i];
  return child_ctx;
}
function get_each_context_22(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[80] = list[i];
  return child_ctx;
}
function get_each_context_3(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[83] = list[i];
  child_ctx[85] = i;
  return child_ctx;
}
function create_if_block_82(ctx) {
  let div;
  let button;
  let mounted;
  let dispose;
  return {
    c() {
      div = element("div");
      button = element("button");
      button.textContent = "Today";
      attr(button, "class", "pos-dl-nav-btn pos-dl-today-btn");
      attr(div, "class", "pos-dl-cal-nav");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, button);
      if (!mounted) {
        dispose = listen(
          button,
          "click",
          /*click_handler_3*/
          ctx[48]
        );
        mounted = true;
      }
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_72(ctx) {
  let div;
  let button0;
  let t1;
  let span;
  let t2;
  let t3;
  let t4;
  let t5;
  let button1;
  let t7;
  let button2;
  let mounted;
  let dispose;
  return {
    c() {
      div = element("div");
      button0 = element("button");
      button0.textContent = "\u2039";
      t1 = space();
      span = element("span");
      t2 = text(
        /*monthName*/
        ctx[19]
      );
      t3 = space();
      t4 = text(
        /*year*/
        ctx[9]
      );
      t5 = space();
      button1 = element("button");
      button1.textContent = "\u203A";
      t7 = space();
      button2 = element("button");
      button2.textContent = "Today";
      attr(button0, "class", "pos-dl-nav-btn");
      attr(span, "class", "pos-dl-cal-label");
      attr(button1, "class", "pos-dl-nav-btn");
      attr(button2, "class", "pos-dl-nav-btn pos-dl-today-btn");
      attr(div, "class", "pos-dl-cal-nav");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, button0);
      append(div, t1);
      append(div, span);
      append(span, t2);
      append(span, t3);
      append(span, t4);
      append(div, t5);
      append(div, button1);
      append(div, t7);
      append(div, button2);
      if (!mounted) {
        dispose = [
          listen(
            button0,
            "click",
            /*prevMonth*/
            ctx[21]
          ),
          listen(
            button1,
            "click",
            /*nextMonth*/
            ctx[22]
          ),
          listen(
            button2,
            "click",
            /*goToToday*/
            ctx[23]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*monthName*/
      524288)
        set_data(
          t2,
          /*monthName*/
          ctx2[19]
        );
      if (dirty[0] & /*year*/
      512)
        set_data(
          t4,
          /*year*/
          ctx2[9]
        );
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_else_block2(ctx) {
  let div;
  let each_value_7 = ensure_array_like(
    /*countdownGroups*/
    ctx[17]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value_7.length; i += 1) {
    each_blocks[i] = create_each_block_7(get_each_context_7(ctx, each_value_7, i));
  }
  return {
    c() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div, "class", "pos-dl-countdown-list");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div, null);
        }
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*countdownGroups, now, openTaskEditor*/
      134348802) {
        each_value_7 = ensure_array_like(
          /*countdownGroups*/
          ctx2[17]
        );
        let i;
        for (i = 0; i < each_value_7.length; i += 1) {
          const child_ctx = get_each_context_7(ctx2, each_value_7, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block_7(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(div, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value_7.length;
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_if_block_23(ctx) {
  let div2;
  let div1;
  let div0;
  let t;
  let mounted;
  let dispose;
  let each_value_6 = ensure_array_like(
    /*timelineDates*/
    ctx[7]
  );
  let each_blocks_1 = [];
  for (let i = 0; i < each_value_6.length; i += 1) {
    each_blocks_1[i] = create_each_block_6(get_each_context_6(ctx, each_value_6, i));
  }
  let each_value_4 = ensure_array_like(
    /*gridRows*/
    ctx[20]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value_4.length; i += 1) {
    each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
  }
  return {
    c() {
      div2 = element("div");
      div1 = element("div");
      div0 = element("div");
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].c();
      }
      t = space();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div0, "class", "pos-dl-gantt-dates");
      set_style(div0, "cursor", "grab");
      attr(div1, "class", "pos-dl-gantt");
      set_style(
        div1,
        "--gantt-cols",
        /*ganttCols*/
        ctx[8]
      );
      set_style(
        div1,
        "--gantt-col-width",
        /*ganttZoom*/
        ctx[2] + "px"
      );
      attr(div2, "class", "pos-dl-gantt-scroll");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, div1);
      append(div1, div0);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        if (each_blocks_1[i]) {
          each_blocks_1[i].m(div0, null);
        }
      }
      append(div1, t);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div1, null);
        }
      }
      ctx[52](div2);
      if (!mounted) {
        dispose = [
          listen(
            div0,
            "mousedown",
            /*onHeaderMouseDown*/
            ctx[33]
          ),
          listen(
            div2,
            "wheel",
            /*handleWheel*/
            ctx[25]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*timelineDates, ganttZoom*/
      132) {
        each_value_6 = ensure_array_like(
          /*timelineDates*/
          ctx2[7]
        );
        let i;
        for (i = 0; i < each_value_6.length; i += 1) {
          const child_ctx = get_each_context_6(ctx2, each_value_6, i);
          if (each_blocks_1[i]) {
            each_blocks_1[i].p(child_ctx, dirty);
          } else {
            each_blocks_1[i] = create_each_block_6(child_ctx);
            each_blocks_1[i].c();
            each_blocks_1[i].m(div0, null);
          }
        }
        for (; i < each_blocks_1.length; i += 1) {
          each_blocks_1[i].d(1);
        }
        each_blocks_1.length = each_value_6.length;
      }
      if (dirty[0] & /*ganttZoom, gridRows, tasksByRow, now, draggingTaskId, tempDragLeft, getGanttPixelOffsets, tempDragWidth, ganttDragMode, tempDragTranslateY, hoverTaskId, hoverSide, handleBarMouseMove, todayColIndex*/
      1142029398 | dirty[1] & /*handleBarMouseLeave, onGanttMouseDown*/
      3) {
        each_value_4 = ensure_array_like(
          /*gridRows*/
          ctx2[20]
        );
        let i;
        for (i = 0; i < each_value_4.length; i += 1) {
          const child_ctx = get_each_context_4(ctx2, each_value_4, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block_4(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(div1, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value_4.length;
      }
      if (dirty[0] & /*ganttCols*/
      256) {
        set_style(
          div1,
          "--gantt-cols",
          /*ganttCols*/
          ctx2[8]
        );
      }
      if (dirty[0] & /*ganttZoom*/
      4) {
        set_style(
          div1,
          "--gantt-col-width",
          /*ganttZoom*/
          ctx2[2] + "px"
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      destroy_each(each_blocks_1, detaching);
      destroy_each(each_blocks, detaching);
      ctx[52](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_14(ctx) {
  let div3;
  let div2;
  let div0;
  let t;
  let div1;
  let each_value_3 = ensure_array_like(
    /*weekDays*/
    ctx[24]
  );
  let each_blocks_1 = [];
  for (let i = 0; i < each_value_3.length; i += 1) {
    each_blocks_1[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
  }
  let each_value = ensure_array_like(
    /*gridWeeks*/
    ctx[18]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block3(get_each_context3(ctx, each_value, i));
  }
  return {
    c() {
      div3 = element("div");
      div2 = element("div");
      div0 = element("div");
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].c();
      }
      t = space();
      div1 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div0, "class", "pos-dl-cal-weekrow");
      attr(div1, "class", "pos-dl-cal-cells");
      attr(div2, "class", "pos-dl-cal-grid");
      attr(div3, "class", "pos-dl-cal-scroll");
    },
    m(target, anchor) {
      insert(target, div3, anchor);
      append(div3, div2);
      append(div2, div0);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        if (each_blocks_1[i]) {
          each_blocks_1[i].m(div0, null);
        }
      }
      append(div2, t);
      append(div2, div1);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div1, null);
        }
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*weekDays*/
      16777216) {
        each_value_3 = ensure_array_like(
          /*weekDays*/
          ctx2[24]
        );
        let i;
        for (i = 0; i < each_value_3.length; i += 1) {
          const child_ctx = get_each_context_3(ctx2, each_value_3, i);
          if (each_blocks_1[i]) {
            each_blocks_1[i].p(child_ctx, dirty);
          } else {
            each_blocks_1[i] = create_each_block_3(child_ctx);
            each_blocks_1[i].c();
            each_blocks_1[i].m(div0, null);
          }
        }
        for (; i < each_blocks_1.length; i += 1) {
          each_blocks_1[i].d(1);
        }
        each_blocks_1.length = each_value_3.length;
      }
      if (dirty[0] & /*gridWeeks, openTaskEditor*/
      134479872) {
        each_value = ensure_array_like(
          /*gridWeeks*/
          ctx2[18]
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context3(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block3(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(div1, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div3);
      }
      destroy_each(each_blocks_1, detaching);
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_if_block3(ctx) {
  let div1;
  return {
    c() {
      div1 = element("div");
      div1.innerHTML = `<div class="pos-dl-empty-icon">\u{1F4ED}</div> <p>No tasks with deadlines yet.</p> <p class="pos-dl-empty-hint">Add deadlines to your tasks via Edit to see them here.</p>`;
      attr(div1, "class", "pos-dl-empty");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
    }
  };
}
function create_each_block_8(key_1, ctx) {
  let div7;
  let div2;
  let div0;
  let t0_value = (
    /*task*/
    ctx[89].name + ""
  );
  let t0;
  let t1;
  let div1;
  let t2;
  let t3_value = formatDeadlineDate(
    /*task*/
    ctx[89].deadline || ""
  ) + "";
  let t3;
  let t4;
  let div6;
  let div3;
  let t5_value = formatCountdown(
    /*diff*/
    ctx[100]
  ) + "";
  let t5;
  let t6;
  let div5;
  let div4;
  let div4_class_value;
  let t7;
  let div7_class_value;
  let mounted;
  let dispose;
  function click_handler_5() {
    return (
      /*click_handler_5*/
      ctx[53](
        /*task*/
        ctx[89]
      )
    );
  }
  return {
    key: key_1,
    first: null,
    c() {
      div7 = element("div");
      div2 = element("div");
      div0 = element("div");
      t0 = text(t0_value);
      t1 = space();
      div1 = element("div");
      t2 = text("Due ");
      t3 = text(t3_value);
      t4 = space();
      div6 = element("div");
      div3 = element("div");
      t5 = text(t5_value);
      t6 = space();
      div5 = element("div");
      div4 = element("div");
      t7 = space();
      attr(div0, "class", "pos-dl-cc-name");
      attr(div1, "class", "pos-dl-cc-date");
      attr(div2, "class", "pos-dl-cc-info");
      attr(div3, "class", "pos-dl-cc-timer");
      attr(div4, "class", div4_class_value = "pos-dl-cc-progress-fill " + urgencyClass(
        /*diff*/
        ctx[100]
      ));
      set_style(
        div4,
        "width",
        /*progress*/
        ctx[103] * 100 + "%"
      );
      attr(div5, "class", "pos-dl-cc-progress-track");
      attr(div6, "class", "pos-dl-cc-right");
      attr(div7, "class", div7_class_value = "pos-dl-countdown-card " + urgencyClass(
        /*diff*/
        ctx[100]
      ));
      this.first = div7;
    },
    m(target, anchor) {
      insert(target, div7, anchor);
      append(div7, div2);
      append(div2, div0);
      append(div0, t0);
      append(div2, t1);
      append(div2, div1);
      append(div1, t2);
      append(div1, t3);
      append(div7, t4);
      append(div7, div6);
      append(div6, div3);
      append(div3, t5);
      append(div6, t6);
      append(div6, div5);
      append(div5, div4);
      append(div7, t7);
      if (!mounted) {
        dispose = listen(div7, "click", click_handler_5);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & /*countdownGroups*/
      131072 && t0_value !== (t0_value = /*task*/
      ctx[89].name + ""))
        set_data(t0, t0_value);
      if (dirty[0] & /*countdownGroups*/
      131072 && t3_value !== (t3_value = formatDeadlineDate(
        /*task*/
        ctx[89].deadline || ""
      ) + ""))
        set_data(t3, t3_value);
      if (dirty[0] & /*countdownGroups, now*/
      131074 && t5_value !== (t5_value = formatCountdown(
        /*diff*/
        ctx[100]
      ) + ""))
        set_data(t5, t5_value);
      if (dirty[0] & /*countdownGroups, now*/
      131074 && div4_class_value !== (div4_class_value = "pos-dl-cc-progress-fill " + urgencyClass(
        /*diff*/
        ctx[100]
      ))) {
        attr(div4, "class", div4_class_value);
      }
      if (dirty[0] & /*countdownGroups, now*/
      131074) {
        set_style(
          div4,
          "width",
          /*progress*/
          ctx[103] * 100 + "%"
        );
      }
      if (dirty[0] & /*countdownGroups, now*/
      131074 && div7_class_value !== (div7_class_value = "pos-dl-countdown-card " + urgencyClass(
        /*diff*/
        ctx[100]
      ))) {
        attr(div7, "class", div7_class_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div7);
      }
      mounted = false;
      dispose();
    }
  };
}
function create_each_block_7(ctx) {
  let div2;
  let div0;
  let t0_value = (
    /*group*/
    ctx[97].label + ""
  );
  let t0;
  let t1;
  let span;
  let t2_value = (
    /*group*/
    ctx[97].tasks.length + ""
  );
  let t2;
  let div0_class_value;
  let t3;
  let div1;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let t4;
  let each_value_8 = ensure_array_like(
    /*group*/
    ctx[97].tasks
  );
  const get_key = (ctx2) => (
    /*task*/
    ctx2[89].id
  );
  for (let i = 0; i < each_value_8.length; i += 1) {
    let child_ctx = get_each_context_8(ctx, each_value_8, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block_8(key, child_ctx));
  }
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      t0 = text(t0_value);
      t1 = space();
      span = element("span");
      t2 = text(t2_value);
      t3 = space();
      div1 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t4 = space();
      attr(span, "class", "pos-dl-group-count");
      attr(div0, "class", div0_class_value = "pos-dl-group-header " + /*group*/
      ctx[97].cls);
      attr(div1, "class", "pos-dl-group-items");
      attr(div2, "class", "pos-dl-group");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, div0);
      append(div0, t0);
      append(div0, t1);
      append(div0, span);
      append(span, t2);
      append(div2, t3);
      append(div2, div1);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div1, null);
        }
      }
      append(div2, t4);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*countdownGroups*/
      131072 && t0_value !== (t0_value = /*group*/
      ctx2[97].label + ""))
        set_data(t0, t0_value);
      if (dirty[0] & /*countdownGroups*/
      131072 && t2_value !== (t2_value = /*group*/
      ctx2[97].tasks.length + ""))
        set_data(t2, t2_value);
      if (dirty[0] & /*countdownGroups*/
      131072 && div0_class_value !== (div0_class_value = "pos-dl-group-header " + /*group*/
      ctx2[97].cls)) {
        attr(div0, "class", div0_class_value);
      }
      if (dirty[0] & /*countdownGroups, now, openTaskEditor*/
      134348802) {
        each_value_8 = ensure_array_like(
          /*group*/
          ctx2[97].tasks
        );
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value_8, each_1_lookup, div1, destroy_block, create_each_block_8, null, get_each_context_8);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
    }
  };
}
function create_if_block_62(ctx) {
  let span;
  return {
    c() {
      span = element("span");
      attr(span, "class", "pos-dl-gd-today-dot");
    },
    m(target, anchor) {
      insert(target, span, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_if_block_52(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.innerHTML = `<span>12a</span><span>6a</span><span>12p</span><span>6p</span>`;
      attr(div, "class", "pos-dl-gantt-hours");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_each_block_6(ctx) {
  let div;
  let span0;
  let t0_value = (
    /*td*/
    ctx[95].dayLabel + ""
  );
  let t0;
  let t1;
  let span1;
  let t2_value = (
    /*td*/
    ctx[95].label + ""
  );
  let t2;
  let t3;
  let t4;
  let t5;
  let if_block0 = (
    /*td*/
    ctx[95].isToday && create_if_block_62(ctx)
  );
  let if_block1 = (
    /*ganttZoom*/
    ctx[2] > 150 && create_if_block_52(ctx)
  );
  return {
    c() {
      div = element("div");
      span0 = element("span");
      t0 = text(t0_value);
      t1 = space();
      span1 = element("span");
      t2 = text(t2_value);
      t3 = space();
      if (if_block0)
        if_block0.c();
      t4 = space();
      if (if_block1)
        if_block1.c();
      t5 = space();
      attr(span0, "class", "pos-dl-gd-day");
      attr(span1, "class", "pos-dl-gd-num");
      attr(div, "class", "pos-dl-gantt-date");
      toggle_class(
        div,
        "today",
        /*td*/
        ctx[95].isToday
      );
      toggle_class(
        div,
        "weekend",
        /*td*/
        ctx[95].isWeekend
      );
      toggle_class(
        div,
        "is-monday",
        /*td*/
        ctx[95].isMonday
      );
      toggle_class(
        div,
        "is-month-start",
        /*td*/
        ctx[95].isMonthStart
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, span0);
      append(span0, t0);
      append(div, t1);
      append(div, span1);
      append(span1, t2);
      append(div, t3);
      if (if_block0)
        if_block0.m(div, null);
      append(div, t4);
      if (if_block1)
        if_block1.m(div, null);
      append(div, t5);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*timelineDates*/
      128 && t0_value !== (t0_value = /*td*/
      ctx2[95].dayLabel + ""))
        set_data(t0, t0_value);
      if (dirty[0] & /*timelineDates*/
      128 && t2_value !== (t2_value = /*td*/
      ctx2[95].label + ""))
        set_data(t2, t2_value);
      if (
        /*td*/
        ctx2[95].isToday
      ) {
        if (if_block0) {
        } else {
          if_block0 = create_if_block_62(ctx2);
          if_block0.c();
          if_block0.m(div, t4);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (
        /*ganttZoom*/
        ctx2[2] > 150
      ) {
        if (if_block1) {
        } else {
          if_block1 = create_if_block_52(ctx2);
          if_block1.c();
          if_block1.m(div, t5);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (dirty[0] & /*timelineDates*/
      128) {
        toggle_class(
          div,
          "today",
          /*td*/
          ctx2[95].isToday
        );
      }
      if (dirty[0] & /*timelineDates*/
      128) {
        toggle_class(
          div,
          "weekend",
          /*td*/
          ctx2[95].isWeekend
        );
      }
      if (dirty[0] & /*timelineDates*/
      128) {
        toggle_class(
          div,
          "is-monday",
          /*td*/
          ctx2[95].isMonday
        );
      }
      if (dirty[0] & /*timelineDates*/
      128) {
        toggle_class(
          div,
          "is-month-start",
          /*td*/
          ctx2[95].isMonthStart
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
    }
  };
}
function create_if_block_42(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "pos-dl-gantt-today-line");
      set_style(div, "left", "calc(var(--gantt-col-width, 40px) * " + /*todayColIndex*/
      ctx[6] + " + (var(--gantt-col-width, 40px) / 2))");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*todayColIndex*/
      64) {
        set_style(div, "left", "calc(var(--gantt-col-width, 40px) * " + /*todayColIndex*/
        ctx2[6] + " + (var(--gantt-col-width, 40px) / 2))");
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block_33(ctx) {
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let each_1_anchor;
  let each_value_5 = ensure_array_like(
    /*tasksByRow*/
    ctx[4][
      /*rowIdx*/
      ctx[86]
    ]
  );
  const get_key = (ctx2) => (
    /*task*/
    ctx2[89].id
  );
  for (let i = 0; i < each_value_5.length; i += 1) {
    let child_ctx = get_each_context_5(ctx, each_value_5, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block_5(key, child_ctx));
  }
  return {
    c() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
    },
    m(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(target, anchor);
        }
      }
      insert(target, each_1_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*tasksByRow, gridRows, now, draggingTaskId, tempDragLeft, getGanttPixelOffsets, ganttZoom, tempDragWidth, ganttDragMode, tempDragTranslateY, hoverTaskId, hoverSide, handleBarMouseMove*/
      1142029334 | dirty[1] & /*handleBarMouseLeave, onGanttMouseDown*/
      3) {
        each_value_5 = ensure_array_like(
          /*tasksByRow*/
          ctx2[4][
            /*rowIdx*/
            ctx2[86]
          ]
        );
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value_5, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block_5, each_1_anchor, get_each_context_5);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(each_1_anchor);
      }
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d(detaching);
      }
    }
  };
}
function create_each_block_5(key_1, ctx) {
  let div;
  let span;
  let t0_value = (
    /*task*/
    ctx[89].name + ""
  );
  let t0;
  let t1;
  let div_class_value;
  let div_title_value;
  let mounted;
  let dispose;
  function mousemove_handler(...args) {
    return (
      /*mousemove_handler*/
      ctx[50](
        /*task*/
        ctx[89],
        ...args
      )
    );
  }
  function mousedown_handler(...args) {
    return (
      /*mousedown_handler*/
      ctx[51](
        /*task*/
        ctx[89],
        ...args
      )
    );
  }
  return {
    key: key_1,
    first: null,
    c() {
      div = element("div");
      span = element("span");
      t0 = text(t0_value);
      t1 = space();
      attr(span, "class", "pos-dl-gantt-bar-label");
      attr(div, "class", div_class_value = "pos-dl-gantt-bar " + urgencyClass(
        /*diffMs*/
        ctx[91]
      ));
      set_style(
        div,
        "left",
        /*draggingTaskId*/
        (ctx[10] === /*task*/
        ctx[89].id ? (
          /*tempDragLeft*/
          ctx[12]
        ) : (
          /*pos*/
          ctx[90].leftPx
        )) + "px"
      );
      set_style(
        div,
        "width",
        /*draggingTaskId*/
        (ctx[10] === /*task*/
        ctx[89].id ? (
          /*tempDragWidth*/
          ctx[13]
        ) : (
          /*pos*/
          ctx[90].widthPx
        )) + "px"
      );
      set_style(
        div,
        "--bar-hue",
        /*hue*/
        ctx[92]
      );
      set_style(div, "transform", "translateY(" + /*draggingTaskId*/
      (ctx[10] === /*task*/
      ctx[89].id && /*ganttDragMode*/
      ctx[11] === "move" ? (
        /*tempDragTranslateY*/
        ctx[14]
      ) : 0) + "px)");
      attr(div, "title", div_title_value = /*task*/
      ctx[89].name + " \u2014 " + formatCountdown(
        /*diffMs*/
        ctx[91]
      ));
      toggle_class(
        div,
        "dragging",
        /*draggingTaskId*/
        ctx[10] === /*task*/
        ctx[89].id
      );
      toggle_class(
        div,
        "hover-left-half",
        /*hoverTaskId*/
        ctx[15] === /*task*/
        ctx[89].id && /*hoverSide*/
        ctx[16] === "left"
      );
      toggle_class(
        div,
        "hover-right-half",
        /*hoverTaskId*/
        ctx[15] === /*task*/
        ctx[89].id && /*hoverSide*/
        ctx[16] === "right"
      );
      this.first = div;
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, span);
      append(span, t0);
      append(div, t1);
      if (!mounted) {
        dispose = [
          listen(div, "mousemove", mousemove_handler),
          listen(
            div,
            "mouseleave",
            /*handleBarMouseLeave*/
            ctx[31]
          ),
          listen(div, "mousedown", mousedown_handler)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & /*tasksByRow, gridRows*/
      1048592 && t0_value !== (t0_value = /*task*/
      ctx[89].name + ""))
        set_data(t0, t0_value);
      if (dirty[0] & /*tasksByRow, gridRows, now*/
      1048594 && div_class_value !== (div_class_value = "pos-dl-gantt-bar " + urgencyClass(
        /*diffMs*/
        ctx[91]
      ))) {
        attr(div, "class", div_class_value);
      }
      if (dirty[0] & /*draggingTaskId, tasksByRow, gridRows, tempDragLeft, ganttZoom*/
      1053716) {
        set_style(
          div,
          "left",
          /*draggingTaskId*/
          (ctx[10] === /*task*/
          ctx[89].id ? (
            /*tempDragLeft*/
            ctx[12]
          ) : (
            /*pos*/
            ctx[90].leftPx
          )) + "px"
        );
      }
      if (dirty[0] & /*draggingTaskId, tasksByRow, gridRows, tempDragWidth, ganttZoom*/
      1057812) {
        set_style(
          div,
          "width",
          /*draggingTaskId*/
          (ctx[10] === /*task*/
          ctx[89].id ? (
            /*tempDragWidth*/
            ctx[13]
          ) : (
            /*pos*/
            ctx[90].widthPx
          )) + "px"
        );
      }
      if (dirty[0] & /*tasksByRow, gridRows, now*/
      1048594) {
        set_style(
          div,
          "--bar-hue",
          /*hue*/
          ctx[92]
        );
      }
      if (dirty[0] & /*draggingTaskId, tasksByRow, gridRows, ganttDragMode, tempDragTranslateY*/
      1068048) {
        set_style(div, "transform", "translateY(" + /*draggingTaskId*/
        (ctx[10] === /*task*/
        ctx[89].id && /*ganttDragMode*/
        ctx[11] === "move" ? (
          /*tempDragTranslateY*/
          ctx[14]
        ) : 0) + "px)");
      }
      if (dirty[0] & /*tasksByRow, gridRows, now*/
      1048594 && div_title_value !== (div_title_value = /*task*/
      ctx[89].name + " \u2014 " + formatCountdown(
        /*diffMs*/
        ctx[91]
      ))) {
        attr(div, "title", div_title_value);
      }
      if (dirty[0] & /*tasksByRow, gridRows, now, draggingTaskId, tasksByRow, gridRows*/
      1049618) {
        toggle_class(
          div,
          "dragging",
          /*draggingTaskId*/
          ctx[10] === /*task*/
          ctx[89].id
        );
      }
      if (dirty[0] & /*tasksByRow, gridRows, now, hoverTaskId, tasksByRow, gridRows, hoverSide*/
      1146898) {
        toggle_class(
          div,
          "hover-left-half",
          /*hoverTaskId*/
          ctx[15] === /*task*/
          ctx[89].id && /*hoverSide*/
          ctx[16] === "left"
        );
      }
      if (dirty[0] & /*tasksByRow, gridRows, now, hoverTaskId, tasksByRow, gridRows, hoverSide*/
      1146898) {
        toggle_class(
          div,
          "hover-right-half",
          /*hoverTaskId*/
          ctx[15] === /*task*/
          ctx[89].id && /*hoverSide*/
          ctx[16] === "right"
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_each_block_4(ctx) {
  let div;
  let t0;
  let t1;
  let div_style_value;
  let if_block0 = (
    /*todayColIndex*/
    ctx[6] >= 0 && create_if_block_42(ctx)
  );
  let if_block1 = (
    /*tasksByRow*/
    ctx[4][
      /*rowIdx*/
      ctx[86]
    ] && create_if_block_33(ctx)
  );
  return {
    c() {
      div = element("div");
      if (if_block0)
        if_block0.c();
      t0 = space();
      if (if_block1)
        if_block1.c();
      t1 = space();
      attr(div, "class", "pos-dl-gantt-row");
      attr(div, "style", div_style_value = /*ganttZoom*/
      ctx[2] > 150 ? "background-image: repeating-linear-gradient(90deg, transparent, transparent calc(" + /*ganttZoom*/
      ctx[2] + "px / 4 - 1px), rgba(0,0,0,0.05) calc(" + /*ganttZoom*/
      ctx[2] + "px / 4 - 1px), rgba(0,0,0,0.05) calc(" + /*ganttZoom*/
      ctx[2] + "px / 4)); background-size: " + /*ganttZoom*/
      ctx[2] + "px 100%;" : "");
      toggle_class(
        div,
        "alt",
        /*rowIdx*/
        ctx[86] % 2 === 1
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (if_block0)
        if_block0.m(div, null);
      append(div, t0);
      if (if_block1)
        if_block1.m(div, null);
      append(div, t1);
    },
    p(ctx2, dirty) {
      if (
        /*todayColIndex*/
        ctx2[6] >= 0
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0 = create_if_block_42(ctx2);
          if_block0.c();
          if_block0.m(div, t0);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (
        /*tasksByRow*/
        ctx2[4][
          /*rowIdx*/
          ctx2[86]
        ]
      ) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block_33(ctx2);
          if_block1.c();
          if_block1.m(div, t1);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (dirty[0] & /*ganttZoom*/
      4 && div_style_value !== (div_style_value = /*ganttZoom*/
      ctx2[2] > 150 ? "background-image: repeating-linear-gradient(90deg, transparent, transparent calc(" + /*ganttZoom*/
      ctx2[2] + "px / 4 - 1px), rgba(0,0,0,0.05) calc(" + /*ganttZoom*/
      ctx2[2] + "px / 4 - 1px), rgba(0,0,0,0.05) calc(" + /*ganttZoom*/
      ctx2[2] + "px / 4)); background-size: " + /*ganttZoom*/
      ctx2[2] + "px 100%;" : "")) {
        attr(div, "style", div_style_value);
      }
      if (dirty[0] & /*gridRows*/
      1048576) {
        toggle_class(
          div,
          "alt",
          /*rowIdx*/
          ctx2[86] % 2 === 1
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
    }
  };
}
function create_each_block_3(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.textContent = `${/*wd*/
      ctx[83]}`;
      attr(div, "class", "pos-dl-cal-weekday");
      toggle_class(
        div,
        "weekend",
        /*i*/
        ctx[85] === 0 || /*i*/
        ctx[85] === 6
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_each_block_22(ctx) {
  let div1;
  let div0;
  let span;
  let t0_value = (
    /*cell*/
    ctx[80].dayNum + ""
  );
  let t0;
  let t1;
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      span = element("span");
      t0 = text(t0_value);
      t1 = space();
      toggle_class(
        span,
        "today-badge",
        /*cell*/
        ctx[80].isToday
      );
      attr(div0, "class", "pos-dl-day-num");
      attr(div1, "class", "pos-dl-cal-day");
      toggle_class(div1, "other-month", !/*cell*/
      ctx[80].isCurrentMonth);
      toggle_class(
        div1,
        "today",
        /*cell*/
        ctx[80].isToday
      );
      toggle_class(
        div1,
        "weekend",
        /*cell*/
        ctx[80].isWeekend
      );
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      append(div0, span);
      append(span, t0);
      append(div1, t1);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*gridWeeks*/
      262144 && t0_value !== (t0_value = /*cell*/
      ctx2[80].dayNum + ""))
        set_data(t0, t0_value);
      if (dirty[0] & /*gridWeeks*/
      262144) {
        toggle_class(
          span,
          "today-badge",
          /*cell*/
          ctx2[80].isToday
        );
      }
      if (dirty[0] & /*gridWeeks*/
      262144) {
        toggle_class(div1, "other-month", !/*cell*/
        ctx2[80].isCurrentMonth);
      }
      if (dirty[0] & /*gridWeeks*/
      262144) {
        toggle_class(
          div1,
          "today",
          /*cell*/
          ctx2[80].isToday
        );
      }
      if (dirty[0] & /*gridWeeks*/
      262144) {
        toggle_class(
          div1,
          "weekend",
          /*cell*/
          ctx2[80].isWeekend
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
    }
  };
}
function create_each_block_12(key_1, ctx) {
  let button;
  let span;
  let t0_value = (
    /*pt*/
    ctx[77].task.name + ""
  );
  let t0;
  let t1;
  let button_class_value;
  let button_title_value;
  let mounted;
  let dispose;
  function click_handler_4() {
    return (
      /*click_handler_4*/
      ctx[49](
        /*pt*/
        ctx[77]
      )
    );
  }
  return {
    key: key_1,
    first: null,
    c() {
      button = element("button");
      span = element("span");
      t0 = text(t0_value);
      t1 = space();
      attr(span, "class", "pos-dl-cal-bar-title");
      attr(button, "class", button_class_value = "pos-dl-cal-bar " + urgencyClass(
        /*pt*/
        ctx[77].diffMs
      ));
      set_style(
        button,
        "left",
        /*pt*/
        ctx[77].leftPct + "%"
      );
      set_style(
        button,
        "width",
        /*pt*/
        ctx[77].widthPct + "%"
      );
      set_style(
        button,
        "top",
        /*pt*/
        ctx[77].row * 28 + 4 + "px"
      );
      attr(button, "title", button_title_value = /*pt*/
      ctx[77].task.name);
      toggle_class(
        button,
        "is-start",
        /*pt*/
        ctx[77].isStart
      );
      toggle_class(
        button,
        "is-end",
        /*pt*/
        ctx[77].isEnd
      );
      this.first = button;
    },
    m(target, anchor) {
      insert(target, button, anchor);
      append(button, span);
      append(span, t0);
      append(button, t1);
      if (!mounted) {
        dispose = listen(button, "click", click_handler_4);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & /*gridWeeks*/
      262144 && t0_value !== (t0_value = /*pt*/
      ctx[77].task.name + ""))
        set_data(t0, t0_value);
      if (dirty[0] & /*gridWeeks*/
      262144 && button_class_value !== (button_class_value = "pos-dl-cal-bar " + urgencyClass(
        /*pt*/
        ctx[77].diffMs
      ))) {
        attr(button, "class", button_class_value);
      }
      if (dirty[0] & /*gridWeeks*/
      262144) {
        set_style(
          button,
          "left",
          /*pt*/
          ctx[77].leftPct + "%"
        );
      }
      if (dirty[0] & /*gridWeeks*/
      262144) {
        set_style(
          button,
          "width",
          /*pt*/
          ctx[77].widthPct + "%"
        );
      }
      if (dirty[0] & /*gridWeeks*/
      262144) {
        set_style(
          button,
          "top",
          /*pt*/
          ctx[77].row * 28 + 4 + "px"
        );
      }
      if (dirty[0] & /*gridWeeks*/
      262144 && button_title_value !== (button_title_value = /*pt*/
      ctx[77].task.name)) {
        attr(button, "title", button_title_value);
      }
      if (dirty[0] & /*gridWeeks, gridWeeks*/
      262144) {
        toggle_class(
          button,
          "is-start",
          /*pt*/
          ctx[77].isStart
        );
      }
      if (dirty[0] & /*gridWeeks, gridWeeks*/
      262144) {
        toggle_class(
          button,
          "is-end",
          /*pt*/
          ctx[77].isEnd
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(button);
      }
      mounted = false;
      dispose();
    }
  };
}
function create_each_block3(ctx) {
  let div2;
  let div0;
  let t0;
  let div1;
  let each_blocks = [];
  let each1_lookup = /* @__PURE__ */ new Map();
  let t1;
  let each_value_2 = ensure_array_like(
    /*week*/
    ctx[74].cells
  );
  let each_blocks_1 = [];
  for (let i = 0; i < each_value_2.length; i += 1) {
    each_blocks_1[i] = create_each_block_22(get_each_context_22(ctx, each_value_2, i));
  }
  let each_value_1 = ensure_array_like(
    /*week*/
    ctx[74].tasks
  );
  const get_key = (ctx2) => (
    /*pt*/
    ctx2[77].task.id
  );
  for (let i = 0; i < each_value_1.length; i += 1) {
    let child_ctx = get_each_context_12(ctx, each_value_1, i);
    let key = get_key(child_ctx);
    each1_lookup.set(key, each_blocks[i] = create_each_block_12(key, child_ctx));
  }
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].c();
      }
      t0 = space();
      div1 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t1 = space();
      attr(div0, "class", "pos-dl-cal-week-bg");
      attr(div1, "class", "pos-dl-cal-week-events");
      set_style(
        div1,
        "height",
        /*week*/
        (ctx[74].tasks.length > 0 ? Math.max(.../*week*/
        ctx[74].tasks.map(func)) * 28 + 10 : 10) + "px"
      );
      attr(div2, "class", "pos-dl-cal-week");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, div0);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        if (each_blocks_1[i]) {
          each_blocks_1[i].m(div0, null);
        }
      }
      append(div2, t0);
      append(div2, div1);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div1, null);
        }
      }
      append(div2, t1);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*gridWeeks*/
      262144) {
        each_value_2 = ensure_array_like(
          /*week*/
          ctx2[74].cells
        );
        let i;
        for (i = 0; i < each_value_2.length; i += 1) {
          const child_ctx = get_each_context_22(ctx2, each_value_2, i);
          if (each_blocks_1[i]) {
            each_blocks_1[i].p(child_ctx, dirty);
          } else {
            each_blocks_1[i] = create_each_block_22(child_ctx);
            each_blocks_1[i].c();
            each_blocks_1[i].m(div0, null);
          }
        }
        for (; i < each_blocks_1.length; i += 1) {
          each_blocks_1[i].d(1);
        }
        each_blocks_1.length = each_value_2.length;
      }
      if (dirty[0] & /*gridWeeks, openTaskEditor*/
      134479872) {
        each_value_1 = ensure_array_like(
          /*week*/
          ctx2[74].tasks
        );
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value_1, each1_lookup, div1, destroy_block, create_each_block_12, null, get_each_context_12);
      }
      if (dirty[0] & /*gridWeeks*/
      262144) {
        set_style(
          div1,
          "height",
          /*week*/
          (ctx2[74].tasks.length > 0 ? Math.max(.../*week*/
          ctx2[74].tasks.map(func)) * 28 + 10 : 10) + "px"
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      destroy_each(each_blocks_1, detaching);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
    }
  };
}
function create_fragment3(ctx) {
  let div3;
  let div1;
  let div0;
  let button0;
  let t2;
  let button1;
  let t5;
  let button2;
  let t8;
  let t9;
  let div2;
  let mounted;
  let dispose;
  function select_block_type(ctx2, dirty) {
    if (
      /*viewMode*/
      ctx2[0] === "calendar"
    )
      return create_if_block_72;
    if (
      /*viewMode*/
      ctx2[0] === "timeline"
    )
      return create_if_block_82;
  }
  let current_block_type = select_block_type(ctx, [-1, -1, -1, -1]);
  let if_block0 = current_block_type && current_block_type(ctx);
  function select_block_type_1(ctx2, dirty) {
    if (
      /*deadlinedTasks*/
      ctx2[5].length === 0
    )
      return create_if_block3;
    if (
      /*viewMode*/
      ctx2[0] === "calendar"
    )
      return create_if_block_14;
    if (
      /*viewMode*/
      ctx2[0] === "timeline"
    )
      return create_if_block_23;
    return create_else_block2;
  }
  let current_block_type_1 = select_block_type_1(ctx, [-1, -1, -1, -1]);
  let if_block1 = current_block_type_1(ctx);
  return {
    c() {
      div3 = element("div");
      div1 = element("div");
      div0 = element("div");
      button0 = element("button");
      button0.innerHTML = `<span class="pos-dl-mode-icon">\u{1F4C5}</span> Calendar`;
      t2 = space();
      button1 = element("button");
      button1.innerHTML = `<span class="pos-dl-mode-icon">\u{1F4CA}</span> Timeline`;
      t5 = space();
      button2 = element("button");
      button2.innerHTML = `<span class="pos-dl-mode-icon">\u23F3</span> Countdowns`;
      t8 = space();
      if (if_block0)
        if_block0.c();
      t9 = space();
      div2 = element("div");
      if_block1.c();
      attr(button0, "class", "pos-dl-mode-btn");
      toggle_class(
        button0,
        "active",
        /*viewMode*/
        ctx[0] === "calendar"
      );
      attr(button1, "class", "pos-dl-mode-btn");
      toggle_class(
        button1,
        "active",
        /*viewMode*/
        ctx[0] === "timeline"
      );
      attr(button2, "class", "pos-dl-mode-btn");
      toggle_class(
        button2,
        "active",
        /*viewMode*/
        ctx[0] === "list"
      );
      attr(div0, "class", "pos-dl-modes");
      attr(div1, "class", "pos-dl-header");
      attr(div2, "class", "pos-dl-body");
      attr(div3, "class", "pos-dl-container");
    },
    m(target, anchor) {
      insert(target, div3, anchor);
      append(div3, div1);
      append(div1, div0);
      append(div0, button0);
      append(div0, t2);
      append(div0, button1);
      append(div0, t5);
      append(div0, button2);
      append(div1, t8);
      if (if_block0)
        if_block0.m(div1, null);
      append(div3, t9);
      append(div3, div2);
      if_block1.m(div2, null);
      if (!mounted) {
        dispose = [
          listen(
            window_1,
            "keydown",
            /*handleKeyDown*/
            ctx[28]
          ),
          listen(
            window_1,
            "keyup",
            /*handleKeyUp*/
            ctx[29]
          ),
          listen(
            button0,
            "click",
            /*click_handler*/
            ctx[45]
          ),
          listen(
            button1,
            "click",
            /*click_handler_1*/
            ctx[46]
          ),
          listen(
            button2,
            "click",
            /*click_handler_2*/
            ctx[47]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*viewMode*/
      1) {
        toggle_class(
          button0,
          "active",
          /*viewMode*/
          ctx2[0] === "calendar"
        );
      }
      if (dirty[0] & /*viewMode*/
      1) {
        toggle_class(
          button1,
          "active",
          /*viewMode*/
          ctx2[0] === "timeline"
        );
      }
      if (dirty[0] & /*viewMode*/
      1) {
        toggle_class(
          button2,
          "active",
          /*viewMode*/
          ctx2[0] === "list"
        );
      }
      if (current_block_type === (current_block_type = select_block_type(ctx2, dirty)) && if_block0) {
        if_block0.p(ctx2, dirty);
      } else {
        if (if_block0)
          if_block0.d(1);
        if_block0 = current_block_type && current_block_type(ctx2);
        if (if_block0) {
          if_block0.c();
          if_block0.m(div1, null);
        }
      }
      if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx2, dirty)) && if_block1) {
        if_block1.p(ctx2, dirty);
      } else {
        if_block1.d(1);
        if_block1 = current_block_type_1(ctx2);
        if (if_block1) {
          if_block1.c();
          if_block1.m(div2, null);
        }
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div3);
      }
      if (if_block0) {
        if_block0.d();
      }
      if_block1.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function getHueForRemaining(diffMs) {
  const daysLeft = diffMs / (1e3 * 60 * 60 * 24);
  if (daysLeft <= 0)
    return 0;
  if (daysLeft >= 7)
    return 120;
  return 120 * (daysLeft / 7);
}
function urgencyClass(diffMs) {
  const days = diffMs / 864e5;
  if (days < 0)
    return "overdue";
  if (days < 1)
    return "critical";
  if (days < 3)
    return "warning";
  if (days < 7)
    return "caution";
  return "safe";
}
function getDaysInMonth(y, m) {
  return new Date(y, m + 1, 0).getDate();
}
function getFirstDayOfWeek(y, m) {
  return new Date(y, m, 1).getDay();
}
function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}
function formatDeadlineDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("default", { month: "short", day: "numeric" });
}
var func = (t) => t.row + 1;
function instance3($$self, $$props, $$invalidate) {
  let projectTasks;
  let deadlinedTasks;
  let tasksByRow;
  let maxRow;
  let gridRows;
  let year;
  let month;
  let monthName;
  let daysInMonth;
  let firstDayOfWeek;
  let gridCells;
  let gridWeeks;
  let ganttCols;
  let timelineDates;
  let todayColIndex;
  let zeroMs;
  let countdownGroups;
  let $tasksStore;
  component_subscribe($$self, tasksStore, ($$value) => $$invalidate(44, $tasksStore = $$value));
  let { app } = $$props;
  let { fileManager } = $$props;
  let { projectId } = $$props;
  let viewMode = "calendar";
  let now2 = Date.now();
  let timer;
  onMount(() => {
    timer = window.setInterval(
      () => {
        $$invalidate(1, now2 = Date.now());
      },
      1e3
    );
  });
  onDestroy(() => {
    window.clearInterval(timer);
  });
  let currentDate = /* @__PURE__ */ new Date();
  function prevMonth() {
    $$invalidate(37, currentDate = new Date(year, month - 1, 1));
  }
  function nextMonth() {
    $$invalidate(37, currentDate = new Date(year, month + 1, 1));
  }
  function goToToday() {
    $$invalidate(37, currentDate = /* @__PURE__ */ new Date());
  }
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let ganttZoom = 40;
  let ganttScrollContainer;
  async function handleWheel(e) {
    if (e.ctrlKey && ganttScrollContainer) {
      e.preventDefault();
      const rect = ganttScrollContainer.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const currentScrollLeft = ganttScrollContainer.scrollLeft;
      const msPerDay = 864e5;
      const msUnderCursor = zeroMs + (currentScrollLeft + mouseX) / ganttZoom * msPerDay;
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(10, Math.min(300, ganttZoom * zoomFactor));
      $$invalidate(2, ganttZoom = newZoom);
      const newPixelForMs = (msUnderCursor - zeroMs) / msPerDay * newZoom;
      await tick();
      if (ganttScrollContainer) {
        $$invalidate(3, ganttScrollContainer.scrollLeft = newPixelForMs - mouseX, ganttScrollContainer);
      }
    }
  }
  function panGantt(dir) {
    if (ganttScrollContainer) {
      ganttScrollContainer.scrollBy({ left: dir * 300, behavior: "smooth" });
    }
  }
  function getGanttPixelOffsets(startDateStr, deadlineStr, currentZoom) {
    const msPerDay = 864e5;
    const startMs = (startDateStr ? new Date(startDateStr) : /* @__PURE__ */ new Date()).getTime();
    const endMs = new Date(deadlineStr).getTime();
    const leftPx = (startMs - zeroMs) / msPerDay * currentZoom;
    const widthPx = (endMs - startMs) / msPerDay * currentZoom;
    return {
      leftPx: Math.max(0, leftPx),
      widthPx: Math.max(widthPx, 24)
    };
  }
  function openTaskEditor(task) {
    new QuickEditTaskModal(
      app,
      task,
      async (updates) => {
        await fileManager.updateTask(task.id, updates);
      },
      () => {
        const file = app.vault.getAbstractFileByPath(`tasks/${task.id}.md`);
        if (file)
          app.workspace.getLeaf("tab").openFile(file);
      }
    ).open();
  }
  let calDraggingTaskId = null;
  let calDragOverDateStr = null;
  function handleCalDragStart(e, taskId) {
    calDraggingTaskId = taskId;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", taskId);
    }
  }
  function handleCalDragOver(e, dateStr) {
    e.preventDefault();
    if (calDraggingTaskId && e.dataTransfer) {
      e.dataTransfer.dropEffect = "move";
      calDragOverDateStr = dateStr;
    }
  }
  function handleCalDragLeave(e) {
    calDragOverDateStr = null;
  }
  async function handleCalDrop(e, dateStr) {
    e.preventDefault();
    if (!calDraggingTaskId) {
      calDragOverDateStr = null;
      return;
    }
    const task = deadlinedTasks.find((t) => t.id === calDraggingTaskId);
    if (task && task.deadline) {
      const oldDl = new Date(task.deadline);
      const newDl = new Date(dateStr);
      const oldTime = oldDl.getTime();
      const shiftMs = newDl.getTime() - new Date(oldDl.toISOString().slice(0, 10)).getTime();
      const updatedDl = new Date(oldTime + shiftMs);
      const updates = { deadline: updatedDl.toISOString() };
      if (task.startDate) {
        const sd = new Date(task.startDate);
        updates.startDate = new Date(sd.getTime() + shiftMs).toISOString();
      } else {
        const ca = new Date(task.createdAt);
        updates.createdAt = new Date(ca.getTime() + shiftMs).toISOString();
      }
      await fileManager.updateTask(task.id, updates);
    }
    calDraggingTaskId = null;
    calDragOverDateStr = null;
  }
  let draggingTaskId = null;
  let ganttDragMode = null;
  let grabOffsetPx = 0;
  let initialClientX = 0;
  let initialClientY = 0;
  let tempDragLeft = 0;
  let tempDragWidth = 0;
  let tempDragTranslateY = 0;
  let isShiftPressed = false;
  let hoverTaskId = null;
  let hoverSide = null;
  function handleKeyDown(e) {
    if (e.key === "Shift") {
      isShiftPressed = true;
      document.body.setAttribute("data-shift-pressed", "true");
    }
  }
  function handleKeyUp(e) {
    if (e.key === "Shift") {
      isShiftPressed = false;
      document.body.removeAttribute("data-shift-pressed");
    }
  }
  function handleBarMouseMove(e, taskId) {
    if (draggingTaskId)
      return;
    $$invalidate(15, hoverTaskId = taskId);
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    if (e.clientX < rect.left + rect.width / 2) {
      $$invalidate(16, hoverSide = "left");
    } else {
      $$invalidate(16, hoverSide = "right");
    }
  }
  function handleBarMouseLeave() {
    $$invalidate(15, hoverTaskId = null);
    $$invalidate(16, hoverSide = null);
  }
  function onGanttMouseDown(e, taskId) {
    e.stopPropagation();
    e.preventDefault();
    $$invalidate(10, draggingTaskId = taskId);
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    let mode = "move";
    if (e.shiftKey) {
      mode = e.clientX < rect.left + rect.width / 2 ? "resize-left" : "resize-right";
    }
    $$invalidate(11, ganttDragMode = mode);
    initialClientX = e.clientX;
    initialClientY = e.clientY;
    $$invalidate(14, tempDragTranslateY = 0);
    const task = deadlinedTasks.find((t) => t.id === taskId);
    if (task) {
      const pos = getGanttPixelOffsets(task.startDate || task.createdAt, task.deadline || "", ganttZoom);
      $$invalidate(12, tempDragLeft = pos.leftPx);
      $$invalidate(13, tempDragWidth = pos.widthPx);
    }
    if (mode === "move") {
      document.body.classList.add("pos-is-moving");
    } else {
      document.body.classList.add("pos-is-resizing");
    }
    if (mode === "move") {
      grabOffsetPx = e.clientX - rect.left;
    } else {
      grabOffsetPx = e.clientX - rect.left;
    }
    window.addEventListener("mousemove", onGanttMouseMove);
    window.addEventListener("mouseup", onGanttMouseUp);
  }
  function onGanttMouseMove(e) {
    if (!draggingTaskId || !ganttScrollContainer)
      return;
    const containerRect = ganttScrollContainer.getBoundingClientRect();
    const dropPx = e.clientX - containerRect.left + ganttScrollContainer.scrollLeft;
    const task = deadlinedTasks.find((t) => t.id === draggingTaskId);
    if (!task)
      return;
    const pos = getGanttPixelOffsets(task.startDate || task.createdAt, task.deadline || "", ganttZoom);
    if (ganttDragMode === "move") {
      $$invalidate(12, tempDragLeft = dropPx - grabOffsetPx);
      $$invalidate(13, tempDragWidth = pos.widthPx);
      $$invalidate(14, tempDragTranslateY = e.clientY - initialClientY);
    } else if (ganttDragMode === "resize-left") {
      const rightEdge = pos.leftPx + pos.widthPx;
      $$invalidate(12, tempDragLeft = Math.min(dropPx, rightEdge - 24));
      $$invalidate(13, tempDragWidth = rightEdge - tempDragLeft);
    } else if (ganttDragMode === "resize-right") {
      $$invalidate(13, tempDragWidth = Math.max(24, dropPx - pos.leftPx));
    }
  }
  async function onGanttMouseUp(e) {
    window.removeEventListener("mousemove", onGanttMouseMove);
    window.removeEventListener("mouseup", onGanttMouseUp);
    document.body.classList.remove("pos-is-moving");
    document.body.classList.remove("pos-is-resizing");
    if (!draggingTaskId || !ganttScrollContainer) {
      $$invalidate(10, draggingTaskId = null);
      $$invalidate(11, ganttDragMode = null);
      return;
    }
    const task = deadlinedTasks.find((t) => t.id === draggingTaskId);
    if (Math.abs(e.clientX - initialClientX) < 3 && Math.abs(e.clientY - initialClientY) < 3) {
      if (task)
        openTaskEditor(task);
      $$invalidate(10, draggingTaskId = null);
      $$invalidate(11, ganttDragMode = null);
      return;
    }
    const containerRect = ganttScrollContainer.getBoundingClientRect();
    const dropPx = e.clientX - containerRect.left + ganttScrollContainer.scrollLeft;
    const msPerDay = 864e5;
    if (!task)
      return;
    const updates = {};
    if (ganttDragMode === "move") {
      const newLeftPx = dropPx - grabOffsetPx;
      const newStartMs = zeroMs + newLeftPx / ganttZoom * msPerDay;
      const oldStartMs2 = (task.startDate ? new Date(task.startDate) : new Date(task.createdAt)).getTime();
      const oldEndMs2 = new Date(task.deadline).getTime();
      const durationMs = oldEndMs2 - oldStartMs2;
      updates.deadline = new Date(newStartMs + durationMs).toISOString();
      if (task.startDate) {
        updates.startDate = new Date(newStartMs).toISOString();
      } else {
        updates.createdAt = new Date(newStartMs).toISOString();
      }
      const rowShift = Math.round(tempDragTranslateY / 40);
      if (rowShift !== 0) {
        updates.ganttRow = Math.max(0, (task.ganttRow || 0) + rowShift);
      }
    } else if (ganttDragMode === "resize-left") {
      const newStartMs = zeroMs + dropPx / ganttZoom * msPerDay;
      updates.startDate = new Date(newStartMs).toISOString();
    } else if (ganttDragMode === "resize-right") {
      const newEndMs = zeroMs + dropPx / ganttZoom * msPerDay;
      updates.deadline = new Date(newEndMs).toISOString();
    }
    const oldStartMs = (task.startDate ? new Date(task.startDate) : new Date(task.createdAt)).getTime();
    const oldEndMs = new Date(task.deadline).getTime();
    const newStartMsFinal = updates.startDate ? new Date(updates.startDate).getTime() : updates.createdAt ? new Date(updates.createdAt).getTime() : oldStartMs;
    const newEndMsFinal = updates.deadline ? new Date(updates.deadline).getTime() : oldEndMs;
    let targetRow = updates.ganttRow !== void 0 ? updates.ganttRow : task.ganttRow || 0;
    let rowCollides = true;
    while (rowCollides) {
      rowCollides = false;
      if (tasksByRow[targetRow]) {
        for (const otherTask of tasksByRow[targetRow]) {
          if (otherTask.id === task.id)
            continue;
          const otherStart = (otherTask.startDate ? new Date(otherTask.startDate) : new Date(otherTask.createdAt)).getTime();
          const otherEnd = new Date(otherTask.deadline).getTime();
          if (newStartMsFinal <= otherEnd && newEndMsFinal >= otherStart) {
            rowCollides = true;
            targetRow++;
            break;
          }
        }
      }
    }
    if (targetRow !== (task.ganttRow || 0)) {
      updates.ganttRow = targetRow;
    }
    if (Object.keys(updates).length > 0) {
      await fileManager.updateTask(task.id, updates);
    }
    $$invalidate(10, draggingTaskId = null);
    $$invalidate(11, ganttDragMode = null);
  }
  let isPanningHeader = false;
  let panStartX = 0;
  let panScrollStart = 0;
  function onHeaderMouseDown(e) {
    isPanningHeader = true;
    panStartX = e.clientX;
    panScrollStart = ganttScrollContainer ? ganttScrollContainer.scrollLeft : 0;
    document.body.classList.add("pos-is-moving");
    window.addEventListener("mousemove", onHeaderMouseMove);
    window.addEventListener("mouseup", onHeaderMouseUp);
  }
  function onHeaderMouseMove(e) {
    if (!isPanningHeader || !ganttScrollContainer)
      return;
    const dx = e.clientX - panStartX;
    $$invalidate(3, ganttScrollContainer.scrollLeft = panScrollStart - dx, ganttScrollContainer);
  }
  function onHeaderMouseUp(e) {
    isPanningHeader = false;
    document.body.classList.remove("pos-is-moving");
    window.removeEventListener("mousemove", onHeaderMouseMove);
    window.removeEventListener("mouseup", onHeaderMouseUp);
  }
  const click_handler = () => $$invalidate(0, viewMode = "calendar");
  const click_handler_1 = () => $$invalidate(0, viewMode = "timeline");
  const click_handler_2 = () => $$invalidate(0, viewMode = "list");
  const click_handler_3 = () => {
    if (todayColIndex > -1 && ganttScrollContainer) {
      $$invalidate(3, ganttScrollContainer.scrollLeft = Math.max(0, todayColIndex * ganttZoom - 100), ganttScrollContainer);
    }
  };
  const click_handler_4 = (pt) => openTaskEditor(pt.task);
  const mousemove_handler = (task, e) => handleBarMouseMove(e, task.id);
  const mousedown_handler = (task, e) => onGanttMouseDown(e, task.id);
  function div2_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      ganttScrollContainer = $$value;
      $$invalidate(3, ganttScrollContainer), $$invalidate(0, viewMode), $$invalidate(7, timelineDates), $$invalidate(6, todayColIndex), $$invalidate(2, ganttZoom), $$invalidate(8, ganttCols);
    });
  }
  const click_handler_5 = (task) => openTaskEditor(task);
  $$self.$$set = ($$props2) => {
    if ("app" in $$props2)
      $$invalidate(34, app = $$props2.app);
    if ("fileManager" in $$props2)
      $$invalidate(35, fileManager = $$props2.fileManager);
    if ("projectId" in $$props2)
      $$invalidate(36, projectId = $$props2.projectId);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[1] & /*$tasksStore, projectId*/
    8224) {
      $:
        $$invalidate(43, projectTasks = getProjectTasks($tasksStore, projectId));
    }
    if ($$self.$$.dirty[1] & /*projectTasks*/
    4096) {
      $:
        $$invalidate(5, deadlinedTasks = projectTasks.filter((t) => t.deadline && !t.isCompleted).sort((a, b) => new Date(a.deadline || "").getTime() - new Date(b.deadline || "").getTime()));
    }
    if ($$self.$$.dirty[0] & /*deadlinedTasks*/
    32) {
      $:
        $$invalidate(4, tasksByRow = (() => {
          const acc = {};
          const placedRows = {};
          const sortedTasks = [...deadlinedTasks].sort((a, b) => {
            const aStart = (a.startDate ? new Date(a.startDate) : new Date(a.createdAt || 0)).getTime();
            const bStart = (b.startDate ? new Date(b.startDate) : new Date(b.createdAt || 0)).getTime();
            return aStart - bStart;
          });
          for (const t of sortedTasks) {
            const startMs = (t.startDate ? new Date(t.startDate) : new Date(t.createdAt || 0)).getTime();
            const endMs = new Date(t.deadline || "").getTime();
            let r = t.ganttRow || 0;
            let collides = true;
            while (collides) {
              collides = false;
              const rowItems = placedRows[r];
              if (rowItems) {
                for (const item of rowItems) {
                  if (startMs <= item.end && endMs >= item.start) {
                    collides = true;
                    r++;
                    break;
                  }
                }
              }
            }
            if (!placedRows[r])
              placedRows[r] = [];
            placedRows[r].push({ start: startMs, end: endMs });
            if (!acc[r])
              acc[r] = [];
            acc[r].push(t);
          }
          return acc;
        })());
    }
    if ($$self.$$.dirty[0] & /*tasksByRow*/
    16) {
      $:
        $$invalidate(42, maxRow = Object.keys(tasksByRow).reduce((max, rStr) => Math.max(max, parseInt(rStr, 10)), 0));
    }
    if ($$self.$$.dirty[1] & /*maxRow*/
    2048) {
      $:
        $$invalidate(20, gridRows = Array.from({ length: Math.max(300, maxRow + 20) }, (_, i) => i));
    }
    if ($$self.$$.dirty[1] & /*currentDate*/
    64) {
      $:
        $$invalidate(9, year = currentDate.getFullYear());
    }
    if ($$self.$$.dirty[1] & /*currentDate*/
    64) {
      $:
        $$invalidate(39, month = currentDate.getMonth());
    }
    if ($$self.$$.dirty[1] & /*currentDate*/
    64) {
      $:
        $$invalidate(19, monthName = currentDate.toLocaleString("default", { month: "long" }));
    }
    if ($$self.$$.dirty[0] & /*year*/
    512 | $$self.$$.dirty[1] & /*month*/
    256) {
      $:
        $$invalidate(40, daysInMonth = getDaysInMonth(year, month));
    }
    if ($$self.$$.dirty[0] & /*year*/
    512 | $$self.$$.dirty[1] & /*month*/
    256) {
      $:
        $$invalidate(41, firstDayOfWeek = getFirstDayOfWeek(year, month));
    }
    if ($$self.$$.dirty[0] & /*year*/
    512 | $$self.$$.dirty[1] & /*month, firstDayOfWeek, daysInMonth*/
    1792) {
      $:
        $$invalidate(38, gridCells = (() => {
          const cells = [];
          const prevMonthDays = getDaysInMonth(year, month - 1);
          for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const prevDay = prevMonthDays - i;
            const d = new Date(year, month - 1, prevDay);
            cells.push({
              dateStr: d.toISOString().slice(0, 10),
              dayNum: prevDay,
              isCurrentMonth: false,
              isToday: isSameDay(d, /* @__PURE__ */ new Date()),
              isWeekend: d.getDay() === 0 || d.getDay() === 6
            });
          }
          for (let i = 1; i <= daysInMonth; i++) {
            const d = new Date(year, month, i);
            cells.push({
              dateStr: d.toISOString().slice(0, 10),
              dayNum: i,
              isCurrentMonth: true,
              isToday: isSameDay(d, /* @__PURE__ */ new Date()),
              isWeekend: d.getDay() === 0 || d.getDay() === 6
            });
          }
          const remaining = 42 - cells.length;
          for (let i = 1; i <= remaining; i++) {
            const d = new Date(year, month + 1, i);
            cells.push({
              dateStr: d.toISOString().slice(0, 10),
              dayNum: i,
              isCurrentMonth: false,
              isToday: isSameDay(d, /* @__PURE__ */ new Date()),
              isWeekend: d.getDay() === 0 || d.getDay() === 6
            });
          }
          return cells;
        })());
    }
    if ($$self.$$.dirty[0] & /*deadlinedTasks*/
    32 | $$self.$$.dirty[1] & /*gridCells*/
    128) {
      $:
        $$invalidate(18, gridWeeks = (() => {
          const weeks = [];
          for (let i = 0; i < gridCells.length; i += 7) {
            const weekCells = gridCells.slice(i, i + 7);
            const weekStartMs = new Date(weekCells[0].dateStr).getTime();
            const weekEndMs = new Date(weekCells[6].dateStr).getTime() + 864e5;
            const overlappingTasks = deadlinedTasks.filter((t) => {
              const startMs = (t.startDate ? new Date(t.startDate) : new Date(t.createdAt)).getTime();
              const endMs = t.deadline ? new Date(t.deadline).getTime() : startMs + 864e5;
              return startMs < weekEndMs && endMs > weekStartMs;
            }).sort((a, b) => {
              const as = (a.startDate ? new Date(a.startDate) : new Date(a.createdAt)).getTime();
              const bs = (b.startDate ? new Date(b.startDate) : new Date(b.createdAt)).getTime();
              return as - bs;
            });
            const placedTasks = [];
            for (const t of overlappingTasks) {
              const startMs = (t.startDate ? new Date(t.startDate) : new Date(t.createdAt)).getTime();
              const endMs = t.deadline ? new Date(t.deadline).getTime() : startMs + 864e5;
              const clampedStartMs = Math.max(startMs, weekStartMs);
              const clampedEndMs = Math.min(endMs, weekEndMs);
              const leftPct = (clampedStartMs - weekStartMs) / (7 * 864e5) * 100;
              let widthPct = (clampedEndMs - clampedStartMs) / (7 * 864e5) * 100;
              if (widthPct < 5)
                widthPct = 5;
              let r = 0;
              while (placedTasks.some((p) => p.row === r && !(leftPct >= p.rightPct || leftPct + widthPct <= p.leftPct))) {
                r++;
              }
              placedTasks.push({
                task: t,
                row: r,
                leftPct,
                widthPct,
                rightPct: leftPct + widthPct,
                isStart: startMs >= weekStartMs,
                isEnd: endMs <= weekEndMs,
                diffMs: endMs - Date.now()
              });
            }
            weeks.push({ cells: weekCells, tasks: placedTasks });
          }
          return weeks;
        })());
    }
    if ($$self.$$.dirty[0] & /*ganttCols*/
    256) {
      $:
        $$invalidate(7, timelineDates = (() => {
          const dates = [];
          const today = /* @__PURE__ */ new Date();
          const offset = -30;
          const count = ganttCols;
          for (let i = offset; i < count + offset; i++) {
            const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
            dates.push({
              dateStr: d.toISOString().slice(0, 10),
              label: `${d.getMonth() + 1}/${d.getDate()}`,
              dayLabel: ["S", "M", "T", "W", "T", "F", "S"][d.getDay()],
              isToday: i === 0,
              isWeekend: d.getDay() === 0 || d.getDay() === 6,
              isMonday: d.getDay() === 1,
              isMonthStart: d.getDate() === 1,
              d
            });
          }
          return dates;
        })());
    }
    if ($$self.$$.dirty[0] & /*timelineDates*/
    128) {
      $:
        $$invalidate(6, todayColIndex = timelineDates.findIndex((td) => td.isToday));
    }
    if ($$self.$$.dirty[0] & /*timelineDates*/
    128) {
      $:
        zeroMs = timelineDates.length > 0 ? timelineDates[0].d.getTime() : 0;
    }
    if ($$self.$$.dirty[0] & /*viewMode, ganttScrollContainer, timelineDates, todayColIndex, ganttZoom*/
    205) {
      $: {
        if (viewMode === "timeline" && ganttScrollContainer && timelineDates.length) {
          setTimeout(
            () => {
              if (todayColIndex > -1 && ganttScrollContainer.scrollLeft === 0) {
                const scrollPos = todayColIndex * ganttZoom - 100;
                $$invalidate(3, ganttScrollContainer.scrollLeft = scrollPos > 0 ? scrollPos : 0, ganttScrollContainer);
              }
            },
            50
          );
        }
      }
    }
    if ($$self.$$.dirty[0] & /*deadlinedTasks, now*/
    34) {
      $:
        $$invalidate(17, countdownGroups = (() => {
          const groups = [
            {
              label: "\u{1F534} Overdue",
              cls: "overdue",
              tasks: []
            },
            {
              label: "\u{1F7E0} Due Today",
              cls: "critical",
              tasks: []
            },
            {
              label: "\u{1F7E1} Next 3 Days",
              cls: "warning",
              tasks: []
            },
            {
              label: "\u{1F7E2} This Week",
              cls: "caution",
              tasks: []
            },
            {
              label: "\u{1F535} Later",
              cls: "safe",
              tasks: []
            }
          ];
          for (const t of deadlinedTasks) {
            const diff = new Date(t.deadline || "").getTime() - now2;
            const days = diff / 864e5;
            if (days < 0)
              groups[0].tasks.push(t);
            else if (days < 1)
              groups[1].tasks.push(t);
            else if (days < 3)
              groups[2].tasks.push(t);
            else if (days < 7)
              groups[3].tasks.push(t);
            else
              groups[4].tasks.push(t);
          }
          return groups.filter((g) => g.tasks.length > 0);
        })());
    }
  };
  $:
    $$invalidate(8, ganttCols = 180);
  return [
    viewMode,
    now2,
    ganttZoom,
    ganttScrollContainer,
    tasksByRow,
    deadlinedTasks,
    todayColIndex,
    timelineDates,
    ganttCols,
    year,
    draggingTaskId,
    ganttDragMode,
    tempDragLeft,
    tempDragWidth,
    tempDragTranslateY,
    hoverTaskId,
    hoverSide,
    countdownGroups,
    gridWeeks,
    monthName,
    gridRows,
    prevMonth,
    nextMonth,
    goToToday,
    weekDays,
    handleWheel,
    getGanttPixelOffsets,
    openTaskEditor,
    handleKeyDown,
    handleKeyUp,
    handleBarMouseMove,
    handleBarMouseLeave,
    onGanttMouseDown,
    onHeaderMouseDown,
    app,
    fileManager,
    projectId,
    currentDate,
    gridCells,
    month,
    daysInMonth,
    firstDayOfWeek,
    maxRow,
    projectTasks,
    $tasksStore,
    click_handler,
    click_handler_1,
    click_handler_2,
    click_handler_3,
    click_handler_4,
    mousemove_handler,
    mousedown_handler,
    div2_binding,
    click_handler_5
  ];
}
var ProjectDeadlines = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance3, create_fragment3, safe_not_equal, { app: 34, fileManager: 35, projectId: 36 }, null, [-1, -1, -1, -1]);
  }
};
var ProjectDeadlines_default = ProjectDeadlines;

// src/ui/views/DeadlinesView.svelte
function create_fragment4(ctx) {
  let div;
  let projectdeadlines;
  let current;
  projectdeadlines = new ProjectDeadlines_default({
    props: {
      app: (
        /*app*/
        ctx[0]
      ),
      fileManager: (
        /*fileManager*/
        ctx[1]
      ),
      projectId: (
        /*projectId*/
        ctx[2]
      )
    }
  });
  return {
    c() {
      div = element("div");
      create_component(projectdeadlines.$$.fragment);
      set_style(div, "height", "100%");
      set_style(div, "display", "flex");
      set_style(div, "flex-direction", "column");
      set_style(div, "overflow", "hidden");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(projectdeadlines, div, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      const projectdeadlines_changes = {};
      if (dirty & /*app*/
      1)
        projectdeadlines_changes.app = /*app*/
        ctx2[0];
      if (dirty & /*fileManager*/
      2)
        projectdeadlines_changes.fileManager = /*fileManager*/
        ctx2[1];
      if (dirty & /*projectId*/
      4)
        projectdeadlines_changes.projectId = /*projectId*/
        ctx2[2];
      projectdeadlines.$set(projectdeadlines_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(projectdeadlines.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(projectdeadlines.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_component(projectdeadlines);
    }
  };
}
function instance4($$self, $$props, $$invalidate) {
  let { app } = $$props;
  let { fileManager } = $$props;
  let { projectId } = $$props;
  $$self.$$set = ($$props2) => {
    if ("app" in $$props2)
      $$invalidate(0, app = $$props2.app);
    if ("fileManager" in $$props2)
      $$invalidate(1, fileManager = $$props2.fileManager);
    if ("projectId" in $$props2)
      $$invalidate(2, projectId = $$props2.projectId);
  };
  return [app, fileManager, projectId];
}
var DeadlinesView = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance4, create_fragment4, safe_not_equal, { app: 0, fileManager: 1, projectId: 2 });
  }
};
var DeadlinesView_default = DeadlinesView;

// src/ui/App.svelte
function get_each_context4(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[12] = list[i];
  return child_ctx;
}
function create_if_block_34(ctx) {
  let div;
  let label;
  let t1;
  let select;
  let option;
  let option_value_value;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let mounted;
  let dispose;
  let each_value = ensure_array_like(
    /*activeProjects*/
    ctx[5]
  );
  const get_key = (ctx2) => (
    /*p*/
    ctx2[12].id
  );
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context4(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block4(key, child_ctx));
  }
  return {
    c() {
      div = element("div");
      label = element("label");
      label.textContent = "Project:";
      t1 = space();
      select = element("select");
      option = element("option");
      option.textContent = "\u2014 Uncategorized \u2014";
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(label, "for", "project-select");
      option.__value = option_value_value = null;
      set_input_value(option, option.__value);
      attr(select, "id", "project-select");
      attr(select, "class", "pos-project-selector");
      if (
        /*selectedProjectId*/
        ctx[4] === void 0
      )
        add_render_callback(() => (
          /*select_change_handler*/
          ctx[10].call(select)
        ));
      attr(div, "class", "pos-project-selector-row");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, label);
      append(div, t1);
      append(div, select);
      append(select, option);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(select, null);
        }
      }
      select_option(
        select,
        /*selectedProjectId*/
        ctx[4],
        true
      );
      if (!mounted) {
        dispose = listen(
          select,
          "change",
          /*select_change_handler*/
          ctx[10]
        );
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*activeProjects*/
      32) {
        each_value = ensure_array_like(
          /*activeProjects*/
          ctx2[5]
        );
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, select, destroy_block, create_each_block4, null, get_each_context4);
      }
      if (dirty & /*selectedProjectId, activeProjects*/
      48) {
        select_option(
          select,
          /*selectedProjectId*/
          ctx2[4]
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
      mounted = false;
      dispose();
    }
  };
}
function create_each_block4(key_1, ctx) {
  let option;
  let t_value = (
    /*p*/
    ctx[12].name + ""
  );
  let t;
  let option_value_value;
  return {
    key: key_1,
    first: null,
    c() {
      option = element("option");
      t = text(t_value);
      option.__value = option_value_value = /*p*/
      ctx[12].id;
      set_input_value(option, option.__value);
      this.first = option;
    },
    m(target, anchor) {
      insert(target, option, anchor);
      append(option, t);
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & /*activeProjects*/
      32 && t_value !== (t_value = /*p*/
      ctx[12].name + ""))
        set_data(t, t_value);
      if (dirty & /*activeProjects*/
      32 && option_value_value !== (option_value_value = /*p*/
      ctx[12].id)) {
        option.__value = option_value_value;
        set_input_value(option, option.__value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(option);
      }
    }
  };
}
function create_if_block_24(ctx) {
  let deadlinesview;
  let current;
  deadlinesview = new DeadlinesView_default({
    props: {
      app: (
        /*app*/
        ctx[0]
      ),
      fileManager: (
        /*fileManager*/
        ctx[1]
      ),
      projectId: (
        /*selectedProjectId*/
        ctx[4]
      )
    }
  });
  return {
    c() {
      create_component(deadlinesview.$$.fragment);
    },
    m(target, anchor) {
      mount_component(deadlinesview, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const deadlinesview_changes = {};
      if (dirty & /*app*/
      1)
        deadlinesview_changes.app = /*app*/
        ctx2[0];
      if (dirty & /*fileManager*/
      2)
        deadlinesview_changes.fileManager = /*fileManager*/
        ctx2[1];
      if (dirty & /*selectedProjectId*/
      16)
        deadlinesview_changes.projectId = /*selectedProjectId*/
        ctx2[4];
      deadlinesview.$set(deadlinesview_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(deadlinesview.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(deadlinesview.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(deadlinesview, detaching);
    }
  };
}
function create_if_block_15(ctx) {
  let elasticview;
  let current;
  elasticview = new ElasticView_default({
    props: {
      app: (
        /*app*/
        ctx[0]
      ),
      fileManager: (
        /*fileManager*/
        ctx[1]
      ),
      projectId: (
        /*selectedProjectId*/
        ctx[4]
      )
    }
  });
  return {
    c() {
      create_component(elasticview.$$.fragment);
    },
    m(target, anchor) {
      mount_component(elasticview, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const elasticview_changes = {};
      if (dirty & /*app*/
      1)
        elasticview_changes.app = /*app*/
        ctx2[0];
      if (dirty & /*fileManager*/
      2)
        elasticview_changes.fileManager = /*fileManager*/
        ctx2[1];
      if (dirty & /*selectedProjectId*/
      16)
        elasticview_changes.projectId = /*selectedProjectId*/
        ctx2[4];
      elasticview.$set(elasticview_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(elasticview.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(elasticview.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(elasticview, detaching);
    }
  };
}
function create_if_block4(ctx) {
  let projectshub;
  let current;
  projectshub = new AgingView_default({
    props: {
      app: (
        /*app*/
        ctx[0]
      ),
      fileManager: (
        /*fileManager*/
        ctx[1]
      ),
      plugin: (
        /*plugin*/
        ctx[2]
      ),
      onSelect: (
        /*func*/
        ctx[11]
      )
    }
  });
  return {
    c() {
      create_component(projectshub.$$.fragment);
    },
    m(target, anchor) {
      mount_component(projectshub, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const projectshub_changes = {};
      if (dirty & /*app*/
      1)
        projectshub_changes.app = /*app*/
        ctx2[0];
      if (dirty & /*fileManager*/
      2)
        projectshub_changes.fileManager = /*fileManager*/
        ctx2[1];
      if (dirty & /*plugin*/
      4)
        projectshub_changes.plugin = /*plugin*/
        ctx2[2];
      if (dirty & /*selectedProjectId, mode*/
      24)
        projectshub_changes.onSelect = /*func*/
        ctx2[11];
      projectshub.$set(projectshub_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(projectshub.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(projectshub.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(projectshub, detaching);
    }
  };
}
function create_fragment5(ctx) {
  let div2;
  let div0;
  let button0;
  let t1;
  let button1;
  let t3;
  let button2;
  let t5;
  let t6;
  let div1;
  let current_block_type_index;
  let if_block1;
  let current;
  let mounted;
  let dispose;
  let if_block0 = (
    /*mode*/
    ctx[3] !== "projects" && create_if_block_34(ctx)
  );
  const if_block_creators = [create_if_block4, create_if_block_15, create_if_block_24];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*mode*/
      ctx2[3] === "projects"
    )
      return 0;
    if (
      /*mode*/
      ctx2[3] === "elastic"
    )
      return 1;
    if (
      /*mode*/
      ctx2[3] === "deadlines"
    )
      return 2;
    return -1;
  }
  if (~(current_block_type_index = select_block_type(ctx, -1))) {
    if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  }
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      button0 = element("button");
      button0.textContent = "Projects";
      t1 = space();
      button1 = element("button");
      button1.textContent = "Elastic";
      t3 = space();
      button2 = element("button");
      button2.textContent = "Deadlines";
      t5 = space();
      if (if_block0)
        if_block0.c();
      t6 = space();
      div1 = element("div");
      if (if_block1)
        if_block1.c();
      attr(button0, "class", "pos-mode-btn");
      toggle_class(
        button0,
        "pos-mode-active",
        /*mode*/
        ctx[3] === "projects"
      );
      attr(button1, "class", "pos-mode-btn");
      toggle_class(
        button1,
        "pos-mode-active",
        /*mode*/
        ctx[3] === "elastic"
      );
      attr(button2, "class", "pos-mode-btn");
      toggle_class(
        button2,
        "pos-mode-active",
        /*mode*/
        ctx[3] === "deadlines"
      );
      attr(div0, "class", "pos-mode-bar");
      attr(div1, "class", "pos-content");
      attr(div2, "class", "pos-view");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, div0);
      append(div0, button0);
      append(div0, t1);
      append(div0, button1);
      append(div0, t3);
      append(div0, button2);
      append(div0, t5);
      if (if_block0)
        if_block0.m(div0, null);
      append(div2, t6);
      append(div2, div1);
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].m(div1, null);
      }
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            button0,
            "click",
            /*click_handler*/
            ctx[7]
          ),
          listen(
            button1,
            "click",
            /*click_handler_1*/
            ctx[8]
          ),
          listen(
            button2,
            "click",
            /*click_handler_2*/
            ctx[9]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (!current || dirty & /*mode*/
      8) {
        toggle_class(
          button0,
          "pos-mode-active",
          /*mode*/
          ctx2[3] === "projects"
        );
      }
      if (!current || dirty & /*mode*/
      8) {
        toggle_class(
          button1,
          "pos-mode-active",
          /*mode*/
          ctx2[3] === "elastic"
        );
      }
      if (!current || dirty & /*mode*/
      8) {
        toggle_class(
          button2,
          "pos-mode-active",
          /*mode*/
          ctx2[3] === "deadlines"
        );
      }
      if (
        /*mode*/
        ctx2[3] !== "projects"
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0 = create_if_block_34(ctx2);
          if_block0.c();
          if_block0.m(div0, null);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2, dirty);
      if (current_block_type_index === previous_block_index) {
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        }
      } else {
        if (if_block1) {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
        }
        if (~current_block_type_index) {
          if_block1 = if_blocks[current_block_type_index];
          if (!if_block1) {
            if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block1.c();
          } else {
            if_block1.p(ctx2, dirty);
          }
          transition_in(if_block1, 1);
          if_block1.m(div1, null);
        } else {
          if_block1 = null;
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      if (if_block0)
        if_block0.d();
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].d();
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance5($$self, $$props, $$invalidate) {
  let activeProjects;
  let $projectsStore;
  component_subscribe($$self, projectsStore, ($$value) => $$invalidate(6, $projectsStore = $$value));
  let { app } = $$props;
  let { fileManager } = $$props;
  let { plugin } = $$props;
  let mode = "projects";
  let selectedProjectId = null;
  const click_handler = () => $$invalidate(3, mode = "projects");
  const click_handler_1 = () => $$invalidate(3, mode = "elastic");
  const click_handler_2 = () => $$invalidate(3, mode = "deadlines");
  function select_change_handler() {
    selectedProjectId = select_value(this);
    $$invalidate(4, selectedProjectId);
    $$invalidate(5, activeProjects), $$invalidate(6, $projectsStore);
  }
  const func2 = (id, m) => {
    $$invalidate(4, selectedProjectId = id);
    $$invalidate(3, mode = m);
  };
  $$self.$$set = ($$props2) => {
    if ("app" in $$props2)
      $$invalidate(0, app = $$props2.app);
    if ("fileManager" in $$props2)
      $$invalidate(1, fileManager = $$props2.fileManager);
    if ("plugin" in $$props2)
      $$invalidate(2, plugin = $$props2.plugin);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*$projectsStore*/
    64) {
      $:
        $$invalidate(5, activeProjects = $projectsStore.filter((p) => p.status === "active"));
    }
  };
  return [
    app,
    fileManager,
    plugin,
    mode,
    selectedProjectId,
    activeProjects,
    $projectsStore,
    click_handler,
    click_handler_1,
    click_handler_2,
    select_change_handler,
    func2
  ];
}
var App3 = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance5, create_fragment5, safe_not_equal, { app: 0, fileManager: 1, plugin: 2 });
  }
};
var App_default = App3;

// src/ui/views/ProjectsView.svelte
var import_obsidian7 = require("obsidian");

// src/ui/views/components/ProjectTaskBoard.svelte
var import_obsidian5 = require("obsidian");
function get_each_context5(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[53] = list[i];
  child_ctx[55] = i;
  return child_ctx;
}
function get_each_context_13(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[53] = list[i];
  child_ctx[55] = i;
  return child_ctx;
}
function get_each_context_23(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[53] = list[i];
  child_ctx[55] = i;
  return child_ctx;
}
function get_each_context_32(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[53] = list[i];
  child_ctx[55] = i;
  return child_ctx;
}
function create_if_block_132(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "pos-drag-placeholder");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block_122(ctx) {
  let div;
  let t_value = (
    /*task*/
    ctx[53].description + ""
  );
  let t;
  return {
    c() {
      div = element("div");
      t = text(t_value);
      attr(div, "class", "pos-card-desc");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*planned*/
      256 && t_value !== (t_value = /*task*/
      ctx2[53].description + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_each_block_32(key_1, ctx) {
  let first;
  let t0;
  let div5;
  let div3;
  let input;
  let input_checked_value;
  let t1;
  let div2;
  let div0;
  let t2_value = (
    /*task*/
    ctx[53].name + ""
  );
  let t2;
  let t3;
  let t4;
  let div1;
  let span;
  let t5;
  let t6_value = (
    /*task*/
    ctx[53].weight + ""
  );
  let t6;
  let t7;
  let div4;
  let button;
  let mounted;
  let dispose;
  let if_block0 = (
    /*dragOverStatus*/
    ctx[2] === "planned" && /*dragOverIndex*/
    ctx[3] === /*i*/
    ctx[55] && create_if_block_132(ctx)
  );
  function change_handler() {
    return (
      /*change_handler*/
      ctx[24](
        /*task*/
        ctx[53]
      )
    );
  }
  let if_block1 = (
    /*task*/
    ctx[53].description && create_if_block_122(ctx)
  );
  function click_handler_2() {
    return (
      /*click_handler_2*/
      ctx[25](
        /*task*/
        ctx[53]
      )
    );
  }
  function click_handler_3() {
    return (
      /*click_handler_3*/
      ctx[26](
        /*task*/
        ctx[53]
      )
    );
  }
  function dragstart_handler(...args) {
    return (
      /*dragstart_handler*/
      ctx[27](
        /*task*/
        ctx[53],
        ...args
      )
    );
  }
  return {
    key: key_1,
    first: null,
    c() {
      first = empty();
      if (if_block0)
        if_block0.c();
      t0 = space();
      div5 = element("div");
      div3 = element("div");
      input = element("input");
      t1 = space();
      div2 = element("div");
      div0 = element("div");
      t2 = text(t2_value);
      t3 = space();
      if (if_block1)
        if_block1.c();
      t4 = space();
      div1 = element("div");
      span = element("span");
      t5 = text("W:");
      t6 = text(t6_value);
      t7 = space();
      div4 = element("div");
      button = element("button");
      button.textContent = "Delete";
      attr(input, "type", "checkbox");
      input.checked = input_checked_value = false;
      attr(input, "class", "pos-task-checkbox");
      attr(div0, "class", "pos-card-name");
      attr(div1, "class", "pos-ptc-meta");
      attr(div2, "class", "pos-ptc-body");
      set_style(div2, "cursor", "pointer");
      attr(div3, "class", "pos-ptc-header");
      attr(button, "class", "pos-del");
      attr(div4, "class", "pos-ptc-acts");
      attr(div5, "class", "pos-card pos-board-card");
      attr(div5, "draggable", "true");
      toggle_class(
        div5,
        "pos-dragging-source",
        /*dragId*/
        ctx[1] === /*task*/
        ctx[53].id
      );
      this.first = first;
    },
    m(target, anchor) {
      insert(target, first, anchor);
      if (if_block0)
        if_block0.m(target, anchor);
      insert(target, t0, anchor);
      insert(target, div5, anchor);
      append(div5, div3);
      append(div3, input);
      append(div3, t1);
      append(div3, div2);
      append(div2, div0);
      append(div0, t2);
      append(div2, t3);
      if (if_block1)
        if_block1.m(div2, null);
      append(div2, t4);
      append(div2, div1);
      append(div1, span);
      append(span, t5);
      append(span, t6);
      append(div5, t7);
      append(div5, div4);
      append(div4, button);
      if (!mounted) {
        dispose = [
          listen(input, "change", change_handler),
          listen(div2, "click", click_handler_2),
          listen(button, "click", click_handler_3),
          listen(div5, "dragstart", dragstart_handler),
          listen(
            div5,
            "dragend",
            /*handleDragEnd*/
            ctx[10]
          )
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (
        /*dragOverStatus*/
        ctx[2] === "planned" && /*dragOverIndex*/
        ctx[3] === /*i*/
        ctx[55]
      ) {
        if (if_block0) {
        } else {
          if_block0 = create_if_block_132(ctx);
          if_block0.c();
          if_block0.m(t0.parentNode, t0);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (dirty[0] & /*planned*/
      256 && t2_value !== (t2_value = /*task*/
      ctx[53].name + ""))
        set_data(t2, t2_value);
      if (
        /*task*/
        ctx[53].description
      ) {
        if (if_block1) {
          if_block1.p(ctx, dirty);
        } else {
          if_block1 = create_if_block_122(ctx);
          if_block1.c();
          if_block1.m(div2, t4);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (dirty[0] & /*planned*/
      256 && t6_value !== (t6_value = /*task*/
      ctx[53].weight + ""))
        set_data(t6, t6_value);
      if (dirty[0] & /*dragId, planned*/
      258) {
        toggle_class(
          div5,
          "pos-dragging-source",
          /*dragId*/
          ctx[1] === /*task*/
          ctx[53].id
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(first);
        detach(t0);
        detach(div5);
      }
      if (if_block0)
        if_block0.d(detaching);
      if (if_block1)
        if_block1.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_112(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "pos-drag-placeholder");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block_102(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "pos-drag-placeholder");
      set_style(
        div,
        "height",
        /*dragHeight*/
        ctx[4] + "px"
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*dragHeight*/
      16) {
        set_style(
          div,
          "height",
          /*dragHeight*/
          ctx2[4] + "px"
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block_92(ctx) {
  let div;
  let t_value = (
    /*task*/
    ctx[53].description + ""
  );
  let t;
  return {
    c() {
      div = element("div");
      t = text(t_value);
      attr(div, "class", "pos-card-desc");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*backlog*/
      128 && t_value !== (t_value = /*task*/
      ctx2[53].description + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_each_block_23(key_1, ctx) {
  let first;
  let t0;
  let div5;
  let div3;
  let input;
  let input_checked_value;
  let t1;
  let div2;
  let div0;
  let t2_value = (
    /*task*/
    ctx[53].name + ""
  );
  let t2;
  let t3;
  let t4;
  let div1;
  let span;
  let t5;
  let t6_value = (
    /*task*/
    ctx[53].weight + ""
  );
  let t6;
  let t7;
  let div4;
  let button;
  let mounted;
  let dispose;
  let if_block0 = (
    /*dragOverStatus*/
    ctx[2] === "backlog" && /*dragOverIndex*/
    ctx[3] === /*i*/
    ctx[55] && create_if_block_102(ctx)
  );
  function change_handler_1() {
    return (
      /*change_handler_1*/
      ctx[31](
        /*task*/
        ctx[53]
      )
    );
  }
  let if_block1 = (
    /*task*/
    ctx[53].description && create_if_block_92(ctx)
  );
  function click_handler_5() {
    return (
      /*click_handler_5*/
      ctx[32](
        /*task*/
        ctx[53]
      )
    );
  }
  function click_handler_6() {
    return (
      /*click_handler_6*/
      ctx[33](
        /*task*/
        ctx[53]
      )
    );
  }
  function dragstart_handler_1(...args) {
    return (
      /*dragstart_handler_1*/
      ctx[34](
        /*task*/
        ctx[53],
        ...args
      )
    );
  }
  return {
    key: key_1,
    first: null,
    c() {
      first = empty();
      if (if_block0)
        if_block0.c();
      t0 = space();
      div5 = element("div");
      div3 = element("div");
      input = element("input");
      t1 = space();
      div2 = element("div");
      div0 = element("div");
      t2 = text(t2_value);
      t3 = space();
      if (if_block1)
        if_block1.c();
      t4 = space();
      div1 = element("div");
      span = element("span");
      t5 = text("W:");
      t6 = text(t6_value);
      t7 = space();
      div4 = element("div");
      button = element("button");
      button.textContent = "Delete";
      attr(input, "type", "checkbox");
      input.checked = input_checked_value = true;
      attr(input, "class", "pos-task-checkbox");
      attr(div0, "class", "pos-card-name");
      attr(div1, "class", "pos-ptc-meta");
      attr(div2, "class", "pos-ptc-body");
      set_style(div2, "cursor", "pointer");
      attr(div3, "class", "pos-ptc-header");
      attr(button, "class", "pos-del");
      attr(div4, "class", "pos-ptc-acts");
      attr(div5, "class", "pos-card pos-board-card");
      attr(div5, "draggable", "true");
      toggle_class(
        div5,
        "pos-dragging-source",
        /*dragId*/
        ctx[1] === /*task*/
        ctx[53].id
      );
      this.first = first;
    },
    m(target, anchor) {
      insert(target, first, anchor);
      if (if_block0)
        if_block0.m(target, anchor);
      insert(target, t0, anchor);
      insert(target, div5, anchor);
      append(div5, div3);
      append(div3, input);
      append(div3, t1);
      append(div3, div2);
      append(div2, div0);
      append(div0, t2);
      append(div2, t3);
      if (if_block1)
        if_block1.m(div2, null);
      append(div2, t4);
      append(div2, div1);
      append(div1, span);
      append(span, t5);
      append(span, t6);
      append(div5, t7);
      append(div5, div4);
      append(div4, button);
      if (!mounted) {
        dispose = [
          listen(input, "change", change_handler_1),
          listen(div2, "click", click_handler_5),
          listen(button, "click", click_handler_6),
          listen(div5, "dragstart", dragstart_handler_1),
          listen(
            div5,
            "dragend",
            /*handleDragEnd*/
            ctx[10]
          )
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (
        /*dragOverStatus*/
        ctx[2] === "backlog" && /*dragOverIndex*/
        ctx[3] === /*i*/
        ctx[55]
      ) {
        if (if_block0) {
          if_block0.p(ctx, dirty);
        } else {
          if_block0 = create_if_block_102(ctx);
          if_block0.c();
          if_block0.m(t0.parentNode, t0);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (dirty[0] & /*backlog*/
      128 && t2_value !== (t2_value = /*task*/
      ctx[53].name + ""))
        set_data(t2, t2_value);
      if (
        /*task*/
        ctx[53].description
      ) {
        if (if_block1) {
          if_block1.p(ctx, dirty);
        } else {
          if_block1 = create_if_block_92(ctx);
          if_block1.c();
          if_block1.m(div2, t4);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (dirty[0] & /*backlog*/
      128 && t6_value !== (t6_value = /*task*/
      ctx[53].weight + ""))
        set_data(t6, t6_value);
      if (dirty[0] & /*dragId, backlog*/
      130) {
        toggle_class(
          div5,
          "pos-dragging-source",
          /*dragId*/
          ctx[1] === /*task*/
          ctx[53].id
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(first);
        detach(t0);
        detach(div5);
      }
      if (if_block0)
        if_block0.d(detaching);
      if (if_block1)
        if_block1.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_83(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "pos-drag-placeholder");
      set_style(
        div,
        "height",
        /*dragHeight*/
        ctx[4] + "px"
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*dragHeight*/
      16) {
        set_style(
          div,
          "height",
          /*dragHeight*/
          ctx2[4] + "px"
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block_73(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "pos-drag-placeholder");
      set_style(
        div,
        "height",
        /*dragHeight*/
        ctx[4] + "px"
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*dragHeight*/
      16) {
        set_style(
          div,
          "height",
          /*dragHeight*/
          ctx2[4] + "px"
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block_63(ctx) {
  let div;
  let t_value = (
    /*task*/
    ctx[53].description + ""
  );
  let t;
  return {
    c() {
      div = element("div");
      t = text(t_value);
      attr(div, "class", "pos-card-desc");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*running*/
      64 && t_value !== (t_value = /*task*/
      ctx2[53].description + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block_53(ctx) {
  let span;
  let t0;
  let t1_value = (
    /*task*/
    ctx[53].fixedDuration + ""
  );
  let t1;
  let t2;
  return {
    c() {
      span = element("span");
      t0 = text("Fixed ");
      t1 = text(t1_value);
      t2 = text("m");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t0);
      append(span, t1);
      append(span, t2);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*running*/
      64 && t1_value !== (t1_value = /*task*/
      ctx2[53].fixedDuration + ""))
        set_data(t1, t1_value);
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_if_block_43(ctx) {
  let input;
  let input_value_value;
  let mounted;
  let dispose;
  function change_handler_3(...args) {
    return (
      /*change_handler_3*/
      ctx[42](
        /*task*/
        ctx[53],
        ...args
      )
    );
  }
  return {
    c() {
      input = element("input");
      attr(input, "type", "number");
      attr(input, "min", "1");
      attr(input, "class", "pos-fixed-input");
      input.value = input_value_value = /*task*/
      ctx[53].fixedDuration || 30;
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (!mounted) {
        dispose = [
          listen(input, "click", stop_propagation(
            /*click_handler_1*/
            ctx[22]
          )),
          listen(input, "change", change_handler_3)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & /*running*/
      64 && input_value_value !== (input_value_value = /*task*/
      ctx[53].fixedDuration || 30) && input.value !== input_value_value) {
        input.value = input_value_value;
      }
    },
    d(detaching) {
      if (detaching) {
        detach(input);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_each_block_13(key_1, ctx) {
  let first;
  let t0;
  let div5;
  let div3;
  let div2;
  let div0;
  let t1_value = (
    /*task*/
    ctx[53].name + ""
  );
  let t1;
  let t2;
  let t3;
  let div1;
  let span0;
  let t4;
  let t5_value = (
    /*task*/
    ctx[53].weight + ""
  );
  let t5;
  let t6;
  let t7;
  let div4;
  let span2;
  let button0;
  let t9;
  let span1;
  let t10_value = (
    /*task*/
    ctx[53].weight + ""
  );
  let t10;
  let t11;
  let button1;
  let t13;
  let label;
  let input;
  let input_checked_value;
  let t14;
  let span3;
  let t16;
  let t17;
  let button2;
  let mounted;
  let dispose;
  let if_block0 = (
    /*dragOverStatus*/
    ctx[2] === "running" && /*dragOverIndex*/
    ctx[3] === /*i*/
    ctx[55] && create_if_block_73(ctx)
  );
  let if_block1 = (
    /*task*/
    ctx[53].description && create_if_block_63(ctx)
  );
  let if_block2 = (
    /*task*/
    ctx[53].isFixedDuration && /*task*/
    ctx[53].fixedDuration && create_if_block_53(ctx)
  );
  function click_handler_8() {
    return (
      /*click_handler_8*/
      ctx[38](
        /*task*/
        ctx[53]
      )
    );
  }
  function click_handler_9() {
    return (
      /*click_handler_9*/
      ctx[39](
        /*task*/
        ctx[53]
      )
    );
  }
  function click_handler_10() {
    return (
      /*click_handler_10*/
      ctx[40](
        /*task*/
        ctx[53]
      )
    );
  }
  function change_handler_2(...args) {
    return (
      /*change_handler_2*/
      ctx[41](
        /*task*/
        ctx[53],
        ...args
      )
    );
  }
  let if_block3 = (
    /*task*/
    ctx[53].isFixedDuration && create_if_block_43(ctx)
  );
  function click_handler_11() {
    return (
      /*click_handler_11*/
      ctx[43](
        /*task*/
        ctx[53]
      )
    );
  }
  function dragstart_handler_2(...args) {
    return (
      /*dragstart_handler_2*/
      ctx[44](
        /*task*/
        ctx[53],
        ...args
      )
    );
  }
  return {
    key: key_1,
    first: null,
    c() {
      first = empty();
      if (if_block0)
        if_block0.c();
      t0 = space();
      div5 = element("div");
      div3 = element("div");
      div2 = element("div");
      div0 = element("div");
      t1 = text(t1_value);
      t2 = space();
      if (if_block1)
        if_block1.c();
      t3 = space();
      div1 = element("div");
      span0 = element("span");
      t4 = text("W:");
      t5 = text(t5_value);
      t6 = space();
      if (if_block2)
        if_block2.c();
      t7 = space();
      div4 = element("div");
      span2 = element("span");
      button0 = element("button");
      button0.textContent = "\u2212";
      t9 = space();
      span1 = element("span");
      t10 = text(t10_value);
      t11 = space();
      button1 = element("button");
      button1.textContent = "+";
      t13 = space();
      label = element("label");
      input = element("input");
      t14 = space();
      span3 = element("span");
      span3.textContent = "Fixed";
      t16 = space();
      if (if_block3)
        if_block3.c();
      t17 = space();
      button2 = element("button");
      button2.textContent = "Delete";
      attr(div0, "class", "pos-card-name");
      attr(div1, "class", "pos-ptc-meta");
      attr(div2, "class", "pos-ptc-body");
      set_style(div2, "cursor", "pointer");
      attr(div3, "class", "pos-ptc-header");
      attr(span2, "class", "pos-wg");
      attr(input, "type", "checkbox");
      input.checked = input_checked_value = /*task*/
      ctx[53].isFixedDuration;
      attr(label, "class", "pos-fixed");
      attr(button2, "class", "pos-del");
      attr(div4, "class", "pos-ptc-acts");
      attr(div5, "class", "pos-card pos-board-card");
      attr(div5, "draggable", "true");
      toggle_class(
        div5,
        "pos-dragging-source",
        /*dragId*/
        ctx[1] === /*task*/
        ctx[53].id
      );
      this.first = first;
    },
    m(target, anchor) {
      insert(target, first, anchor);
      if (if_block0)
        if_block0.m(target, anchor);
      insert(target, t0, anchor);
      insert(target, div5, anchor);
      append(div5, div3);
      append(div3, div2);
      append(div2, div0);
      append(div0, t1);
      append(div2, t2);
      if (if_block1)
        if_block1.m(div2, null);
      append(div2, t3);
      append(div2, div1);
      append(div1, span0);
      append(span0, t4);
      append(span0, t5);
      append(div1, t6);
      if (if_block2)
        if_block2.m(div1, null);
      append(div5, t7);
      append(div5, div4);
      append(div4, span2);
      append(span2, button0);
      append(span2, t9);
      append(span2, span1);
      append(span1, t10);
      append(span2, t11);
      append(span2, button1);
      append(div4, t13);
      append(div4, label);
      append(label, input);
      append(label, t14);
      append(label, span3);
      append(div4, t16);
      if (if_block3)
        if_block3.m(div4, null);
      append(div4, t17);
      append(div4, button2);
      if (!mounted) {
        dispose = [
          listen(div2, "click", click_handler_8),
          listen(button0, "click", click_handler_9),
          listen(button1, "click", click_handler_10),
          listen(input, "change", change_handler_2),
          listen(label, "click", stop_propagation(
            /*click_handler*/
            ctx[23]
          )),
          listen(button2, "click", click_handler_11),
          listen(div5, "dragstart", dragstart_handler_2),
          listen(
            div5,
            "dragend",
            /*handleDragEnd*/
            ctx[10]
          )
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (
        /*dragOverStatus*/
        ctx[2] === "running" && /*dragOverIndex*/
        ctx[3] === /*i*/
        ctx[55]
      ) {
        if (if_block0) {
          if_block0.p(ctx, dirty);
        } else {
          if_block0 = create_if_block_73(ctx);
          if_block0.c();
          if_block0.m(t0.parentNode, t0);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (dirty[0] & /*running*/
      64 && t1_value !== (t1_value = /*task*/
      ctx[53].name + ""))
        set_data(t1, t1_value);
      if (
        /*task*/
        ctx[53].description
      ) {
        if (if_block1) {
          if_block1.p(ctx, dirty);
        } else {
          if_block1 = create_if_block_63(ctx);
          if_block1.c();
          if_block1.m(div2, t3);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (dirty[0] & /*running*/
      64 && t5_value !== (t5_value = /*task*/
      ctx[53].weight + ""))
        set_data(t5, t5_value);
      if (
        /*task*/
        ctx[53].isFixedDuration && /*task*/
        ctx[53].fixedDuration
      ) {
        if (if_block2) {
          if_block2.p(ctx, dirty);
        } else {
          if_block2 = create_if_block_53(ctx);
          if_block2.c();
          if_block2.m(div1, null);
        }
      } else if (if_block2) {
        if_block2.d(1);
        if_block2 = null;
      }
      if (dirty[0] & /*running*/
      64 && t10_value !== (t10_value = /*task*/
      ctx[53].weight + ""))
        set_data(t10, t10_value);
      if (dirty[0] & /*running*/
      64 && input_checked_value !== (input_checked_value = /*task*/
      ctx[53].isFixedDuration)) {
        input.checked = input_checked_value;
      }
      if (
        /*task*/
        ctx[53].isFixedDuration
      ) {
        if (if_block3) {
          if_block3.p(ctx, dirty);
        } else {
          if_block3 = create_if_block_43(ctx);
          if_block3.c();
          if_block3.m(div4, t17);
        }
      } else if (if_block3) {
        if_block3.d(1);
        if_block3 = null;
      }
      if (dirty[0] & /*dragId, running*/
      66) {
        toggle_class(
          div5,
          "pos-dragging-source",
          /*dragId*/
          ctx[1] === /*task*/
          ctx[53].id
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(first);
        detach(t0);
        detach(div5);
      }
      if (if_block0)
        if_block0.d(detaching);
      if (if_block1)
        if_block1.d();
      if (if_block2)
        if_block2.d();
      if (if_block3)
        if_block3.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_35(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "pos-drag-placeholder");
      set_style(
        div,
        "height",
        /*dragHeight*/
        ctx[4] + "px"
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*dragHeight*/
      16) {
        set_style(
          div,
          "height",
          /*dragHeight*/
          ctx2[4] + "px"
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block_25(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "pos-drag-placeholder");
      set_style(
        div,
        "height",
        /*dragHeight*/
        ctx[4] + "px"
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*dragHeight*/
      16) {
        set_style(
          div,
          "height",
          /*dragHeight*/
          ctx2[4] + "px"
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block_16(ctx) {
  let div;
  let t_value = (
    /*task*/
    ctx[53].description + ""
  );
  let t;
  return {
    c() {
      div = element("div");
      t = text(t_value);
      attr(div, "class", "pos-card-desc");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*review*/
      32 && t_value !== (t_value = /*task*/
      ctx2[53].description + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_each_block5(key_1, ctx) {
  let first;
  let t0;
  let div5;
  let div3;
  let div2;
  let div0;
  let t1_value = (
    /*task*/
    ctx[53].name + ""
  );
  let t1;
  let t2;
  let t3;
  let div1;
  let span;
  let t4;
  let t5_value = (
    /*task*/
    ctx[53].weight + ""
  );
  let t5;
  let t6;
  let div4;
  let button;
  let mounted;
  let dispose;
  let if_block0 = (
    /*dragOverStatus*/
    ctx[2] === "review" && /*dragOverIndex*/
    ctx[3] === /*i*/
    ctx[55] && create_if_block_25(ctx)
  );
  let if_block1 = (
    /*task*/
    ctx[53].description && create_if_block_16(ctx)
  );
  function click_handler_12() {
    return (
      /*click_handler_12*/
      ctx[47](
        /*task*/
        ctx[53]
      )
    );
  }
  function click_handler_13() {
    return (
      /*click_handler_13*/
      ctx[48](
        /*task*/
        ctx[53]
      )
    );
  }
  function dragstart_handler_3(...args) {
    return (
      /*dragstart_handler_3*/
      ctx[49](
        /*task*/
        ctx[53],
        ...args
      )
    );
  }
  return {
    key: key_1,
    first: null,
    c() {
      first = empty();
      if (if_block0)
        if_block0.c();
      t0 = space();
      div5 = element("div");
      div3 = element("div");
      div2 = element("div");
      div0 = element("div");
      t1 = text(t1_value);
      t2 = space();
      if (if_block1)
        if_block1.c();
      t3 = space();
      div1 = element("div");
      span = element("span");
      t4 = text("W:");
      t5 = text(t5_value);
      t6 = space();
      div4 = element("div");
      button = element("button");
      button.textContent = "Delete";
      attr(div0, "class", "pos-card-name");
      attr(div1, "class", "pos-ptc-meta");
      attr(div2, "class", "pos-ptc-body");
      set_style(div2, "cursor", "pointer");
      attr(div3, "class", "pos-ptc-header");
      attr(button, "class", "pos-del");
      attr(div4, "class", "pos-ptc-acts");
      attr(div5, "class", "pos-card pos-board-card pos-completed");
      attr(div5, "draggable", "true");
      toggle_class(
        div5,
        "pos-dragging-source",
        /*dragId*/
        ctx[1] === /*task*/
        ctx[53].id
      );
      this.first = first;
    },
    m(target, anchor) {
      insert(target, first, anchor);
      if (if_block0)
        if_block0.m(target, anchor);
      insert(target, t0, anchor);
      insert(target, div5, anchor);
      append(div5, div3);
      append(div3, div2);
      append(div2, div0);
      append(div0, t1);
      append(div2, t2);
      if (if_block1)
        if_block1.m(div2, null);
      append(div2, t3);
      append(div2, div1);
      append(div1, span);
      append(span, t4);
      append(span, t5);
      append(div5, t6);
      append(div5, div4);
      append(div4, button);
      if (!mounted) {
        dispose = [
          listen(div2, "click", click_handler_12),
          listen(button, "click", click_handler_13),
          listen(div5, "dragstart", dragstart_handler_3),
          listen(
            div5,
            "dragend",
            /*handleDragEnd*/
            ctx[10]
          )
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (
        /*dragOverStatus*/
        ctx[2] === "review" && /*dragOverIndex*/
        ctx[3] === /*i*/
        ctx[55]
      ) {
        if (if_block0) {
          if_block0.p(ctx, dirty);
        } else {
          if_block0 = create_if_block_25(ctx);
          if_block0.c();
          if_block0.m(t0.parentNode, t0);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (dirty[0] & /*review*/
      32 && t1_value !== (t1_value = /*task*/
      ctx[53].name + ""))
        set_data(t1, t1_value);
      if (
        /*task*/
        ctx[53].description
      ) {
        if (if_block1) {
          if_block1.p(ctx, dirty);
        } else {
          if_block1 = create_if_block_16(ctx);
          if_block1.c();
          if_block1.m(div2, t3);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (dirty[0] & /*review*/
      32 && t5_value !== (t5_value = /*task*/
      ctx[53].weight + ""))
        set_data(t5, t5_value);
      if (dirty[0] & /*dragId, review*/
      34) {
        toggle_class(
          div5,
          "pos-dragging-source",
          /*dragId*/
          ctx[1] === /*task*/
          ctx[53].id
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(first);
        detach(t0);
        detach(div5);
      }
      if (if_block0)
        if_block0.d(detaching);
      if (if_block1)
        if_block1.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block5(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "pos-drag-placeholder");
      set_style(
        div,
        "height",
        /*dragHeight*/
        ctx[4] + "px"
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*dragHeight*/
      16) {
        set_style(
          div,
          "height",
          /*dragHeight*/
          ctx2[4] + "px"
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_fragment6(ctx) {
  let div12;
  let div2;
  let h40;
  let t0;
  let t1_value = (
    /*planned*/
    ctx[8].length + ""
  );
  let t1;
  let t2;
  let t3;
  let div1;
  let div0;
  let each_blocks_3 = [];
  let each0_lookup = /* @__PURE__ */ new Map();
  let t4;
  let t5;
  let button0;
  let t7;
  let div5;
  let h41;
  let t8;
  let t9_value = (
    /*backlog*/
    ctx[7].length + ""
  );
  let t9;
  let t10;
  let t11;
  let div4;
  let div3;
  let each_blocks_2 = [];
  let each1_lookup = /* @__PURE__ */ new Map();
  let t12;
  let t13;
  let button1;
  let t15;
  let div8;
  let h42;
  let t16;
  let t17_value = (
    /*running*/
    ctx[6].length + ""
  );
  let t17;
  let t18;
  let t19;
  let div7;
  let div6;
  let each_blocks_1 = [];
  let each2_lookup = /* @__PURE__ */ new Map();
  let t20;
  let t21;
  let div11;
  let h43;
  let t22;
  let t23_value = (
    /*review*/
    ctx[5].length + ""
  );
  let t23;
  let t24;
  let t25;
  let div10;
  let div9;
  let each_blocks = [];
  let each3_lookup = /* @__PURE__ */ new Map();
  let t26;
  let mounted;
  let dispose;
  let each_value_3 = ensure_array_like(
    /*planned*/
    ctx[8]
  );
  const get_key = (ctx2) => (
    /*task*/
    ctx2[53].id
  );
  for (let i = 0; i < each_value_3.length; i += 1) {
    let child_ctx = get_each_context_32(ctx, each_value_3, i);
    let key = get_key(child_ctx);
    each0_lookup.set(key, each_blocks_3[i] = create_each_block_32(key, child_ctx));
  }
  let if_block0 = (
    /*dragOverStatus*/
    ctx[2] === "planned" && /*dragOverIndex*/
    ctx[3] >= /*planned*/
    ctx[8].length && create_if_block_112(ctx)
  );
  let each_value_2 = ensure_array_like(
    /*backlog*/
    ctx[7]
  );
  const get_key_1 = (ctx2) => (
    /*task*/
    ctx2[53].id
  );
  for (let i = 0; i < each_value_2.length; i += 1) {
    let child_ctx = get_each_context_23(ctx, each_value_2, i);
    let key = get_key_1(child_ctx);
    each1_lookup.set(key, each_blocks_2[i] = create_each_block_23(key, child_ctx));
  }
  let if_block1 = (
    /*dragOverStatus*/
    ctx[2] === "backlog" && /*dragOverIndex*/
    ctx[3] >= /*backlog*/
    ctx[7].length && create_if_block_83(ctx)
  );
  let each_value_1 = ensure_array_like(
    /*running*/
    ctx[6]
  );
  const get_key_2 = (ctx2) => (
    /*task*/
    ctx2[53].id
  );
  for (let i = 0; i < each_value_1.length; i += 1) {
    let child_ctx = get_each_context_13(ctx, each_value_1, i);
    let key = get_key_2(child_ctx);
    each2_lookup.set(key, each_blocks_1[i] = create_each_block_13(key, child_ctx));
  }
  let if_block2 = (
    /*dragOverStatus*/
    ctx[2] === "running" && /*dragOverIndex*/
    ctx[3] >= /*running*/
    ctx[6].length && create_if_block_35(ctx)
  );
  let each_value = ensure_array_like(
    /*review*/
    ctx[5]
  );
  const get_key_3 = (ctx2) => (
    /*task*/
    ctx2[53].id
  );
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context5(ctx, each_value, i);
    let key = get_key_3(child_ctx);
    each3_lookup.set(key, each_blocks[i] = create_each_block5(key, child_ctx));
  }
  let if_block3 = (
    /*dragOverStatus*/
    ctx[2] === "review" && /*dragOverIndex*/
    ctx[3] >= /*review*/
    ctx[5].length && create_if_block5(ctx)
  );
  return {
    c() {
      div12 = element("div");
      div2 = element("div");
      h40 = element("h4");
      t0 = text("Planned (");
      t1 = text(t1_value);
      t2 = text(")");
      t3 = space();
      div1 = element("div");
      div0 = element("div");
      for (let i = 0; i < each_blocks_3.length; i += 1) {
        each_blocks_3[i].c();
      }
      t4 = space();
      if (if_block0)
        if_block0.c();
      t5 = space();
      button0 = element("button");
      button0.textContent = "+ Plan Task";
      t7 = space();
      div5 = element("div");
      h41 = element("h4");
      t8 = text("Backlog (");
      t9 = text(t9_value);
      t10 = text(")");
      t11 = space();
      div4 = element("div");
      div3 = element("div");
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        each_blocks_2[i].c();
      }
      t12 = space();
      if (if_block1)
        if_block1.c();
      t13 = space();
      button1 = element("button");
      button1.textContent = "+ Add Backlog";
      t15 = space();
      div8 = element("div");
      h42 = element("h4");
      t16 = text("Running (");
      t17 = text(t17_value);
      t18 = text(")");
      t19 = space();
      div7 = element("div");
      div6 = element("div");
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].c();
      }
      t20 = space();
      if (if_block2)
        if_block2.c();
      t21 = space();
      div11 = element("div");
      h43 = element("h4");
      t22 = text("Review (");
      t23 = text(t23_value);
      t24 = text(")");
      t25 = space();
      div10 = element("div");
      div9 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t26 = space();
      if (if_block3)
        if_block3.c();
      attr(h40, "class", "pos-board-col-title planned");
      attr(button0, "class", "pos-board-add-btn");
      attr(div0, "class", "pos-board-list");
      attr(div1, "class", "pos-board-list-wrapper");
      attr(div2, "class", "pos-board-col");
      attr(h41, "class", "pos-board-col-title backlog");
      attr(button1, "class", "pos-board-add-btn");
      attr(div3, "class", "pos-board-list");
      attr(div4, "class", "pos-board-list-wrapper");
      attr(div5, "class", "pos-board-col");
      attr(h42, "class", "pos-board-col-title running");
      attr(div6, "class", "pos-board-list");
      attr(div7, "class", "pos-board-list-wrapper");
      attr(div8, "class", "pos-board-col");
      attr(h43, "class", "pos-board-col-title review");
      attr(div9, "class", "pos-board-list");
      attr(div10, "class", "pos-board-list-wrapper");
      attr(div11, "class", "pos-board-col");
      attr(div12, "class", "pos-board-workspace");
    },
    m(target, anchor) {
      insert(target, div12, anchor);
      append(div12, div2);
      append(div2, h40);
      append(h40, t0);
      append(h40, t1);
      append(h40, t2);
      append(div2, t3);
      append(div2, div1);
      append(div1, div0);
      for (let i = 0; i < each_blocks_3.length; i += 1) {
        if (each_blocks_3[i]) {
          each_blocks_3[i].m(div0, null);
        }
      }
      append(div0, t4);
      if (if_block0)
        if_block0.m(div0, null);
      append(div0, t5);
      append(div0, button0);
      append(div12, t7);
      append(div12, div5);
      append(div5, h41);
      append(h41, t8);
      append(h41, t9);
      append(h41, t10);
      append(div5, t11);
      append(div5, div4);
      append(div4, div3);
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        if (each_blocks_2[i]) {
          each_blocks_2[i].m(div3, null);
        }
      }
      append(div3, t12);
      if (if_block1)
        if_block1.m(div3, null);
      append(div3, t13);
      append(div3, button1);
      append(div12, t15);
      append(div12, div8);
      append(div8, h42);
      append(h42, t16);
      append(h42, t17);
      append(h42, t18);
      append(div8, t19);
      append(div8, div7);
      append(div7, div6);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        if (each_blocks_1[i]) {
          each_blocks_1[i].m(div6, null);
        }
      }
      append(div6, t20);
      if (if_block2)
        if_block2.m(div6, null);
      append(div12, t21);
      append(div12, div11);
      append(div11, h43);
      append(h43, t22);
      append(h43, t23);
      append(h43, t24);
      append(div11, t25);
      append(div11, div10);
      append(div10, div9);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div9, null);
        }
      }
      append(div9, t26);
      if (if_block3)
        if_block3.m(div9, null);
      if (!mounted) {
        dispose = [
          listen(
            button0,
            "click",
            /*click_handler_4*/
            ctx[28]
          ),
          listen(
            div1,
            "dragover",
            /*dragover_handler*/
            ctx[29]
          ),
          listen(
            div1,
            "drop",
            /*drop_handler*/
            ctx[30]
          ),
          listen(
            button1,
            "click",
            /*click_handler_7*/
            ctx[35]
          ),
          listen(
            div4,
            "dragover",
            /*dragover_handler_1*/
            ctx[36]
          ),
          listen(
            div4,
            "drop",
            /*drop_handler_1*/
            ctx[37]
          ),
          listen(
            div7,
            "dragover",
            /*dragover_handler_2*/
            ctx[45]
          ),
          listen(
            div7,
            "drop",
            /*drop_handler_2*/
            ctx[46]
          ),
          listen(
            div10,
            "dragover",
            /*dragover_handler_3*/
            ctx[50]
          ),
          listen(
            div10,
            "drop",
            /*drop_handler_3*/
            ctx[51]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*planned*/
      256 && t1_value !== (t1_value = /*planned*/
      ctx2[8].length + ""))
        set_data(t1, t1_value);
      if (dirty[0] & /*dragId, planned, handleDragStart, handleDragEnd, deleteTask, editTask, updateStatus, dragOverStatus, dragOverIndex*/
      313102) {
        each_value_3 = ensure_array_like(
          /*planned*/
          ctx2[8]
        );
        each_blocks_3 = update_keyed_each(each_blocks_3, dirty, get_key, 1, ctx2, each_value_3, each0_lookup, div0, destroy_block, create_each_block_32, t4, get_each_context_32);
      }
      if (
        /*dragOverStatus*/
        ctx2[2] === "planned" && /*dragOverIndex*/
        ctx2[3] >= /*planned*/
        ctx2[8].length
      ) {
        if (if_block0) {
        } else {
          if_block0 = create_if_block_112(ctx2);
          if_block0.c();
          if_block0.m(div0, t5);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (dirty[0] & /*backlog*/
      128 && t9_value !== (t9_value = /*backlog*/
      ctx2[7].length + ""))
        set_data(t9, t9_value);
      if (dirty[0] & /*dragId, backlog, handleDragStart, handleDragEnd, deleteTask, editTask, updateStatus, dragHeight, dragOverStatus, dragOverIndex*/
      312990) {
        each_value_2 = ensure_array_like(
          /*backlog*/
          ctx2[7]
        );
        each_blocks_2 = update_keyed_each(each_blocks_2, dirty, get_key_1, 1, ctx2, each_value_2, each1_lookup, div3, destroy_block, create_each_block_23, t12, get_each_context_23);
      }
      if (
        /*dragOverStatus*/
        ctx2[2] === "backlog" && /*dragOverIndex*/
        ctx2[3] >= /*backlog*/
        ctx2[7].length
      ) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block_83(ctx2);
          if_block1.c();
          if_block1.m(div3, t13);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (dirty[0] & /*running*/
      64 && t17_value !== (t17_value = /*running*/
      ctx2[6].length + ""))
        set_data(t17, t17_value);
      if (dirty[0] & /*dragId, running, handleDragStart, handleDragEnd, deleteTask, setFixed, toggleFixed, fileManager, editTask, dragHeight, dragOverStatus, dragOverIndex*/
      476767) {
        each_value_1 = ensure_array_like(
          /*running*/
          ctx2[6]
        );
        each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key_2, 1, ctx2, each_value_1, each2_lookup, div6, destroy_block, create_each_block_13, t20, get_each_context_13);
      }
      if (
        /*dragOverStatus*/
        ctx2[2] === "running" && /*dragOverIndex*/
        ctx2[3] >= /*running*/
        ctx2[6].length
      ) {
        if (if_block2) {
          if_block2.p(ctx2, dirty);
        } else {
          if_block2 = create_if_block_35(ctx2);
          if_block2.c();
          if_block2.m(div6, null);
        }
      } else if (if_block2) {
        if_block2.d(1);
        if_block2 = null;
      }
      if (dirty[0] & /*review*/
      32 && t23_value !== (t23_value = /*review*/
      ctx2[5].length + ""))
        set_data(t23, t23_value);
      if (dirty[0] & /*dragId, review, handleDragStart, handleDragEnd, deleteTask, editTask, dragHeight, dragOverStatus, dragOverIndex*/
      280126) {
        each_value = ensure_array_like(
          /*review*/
          ctx2[5]
        );
        each_blocks = update_keyed_each(each_blocks, dirty, get_key_3, 1, ctx2, each_value, each3_lookup, div9, destroy_block, create_each_block5, t26, get_each_context5);
      }
      if (
        /*dragOverStatus*/
        ctx2[2] === "review" && /*dragOverIndex*/
        ctx2[3] >= /*review*/
        ctx2[5].length
      ) {
        if (if_block3) {
          if_block3.p(ctx2, dirty);
        } else {
          if_block3 = create_if_block5(ctx2);
          if_block3.c();
          if_block3.m(div9, null);
        }
      } else if (if_block3) {
        if_block3.d(1);
        if_block3 = null;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div12);
      }
      for (let i = 0; i < each_blocks_3.length; i += 1) {
        each_blocks_3[i].d();
      }
      if (if_block0)
        if_block0.d();
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        each_blocks_2[i].d();
      }
      if (if_block1)
        if_block1.d();
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].d();
      }
      if (if_block2)
        if_block2.d();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
      if (if_block3)
        if_block3.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance6($$self, $$props, $$invalidate) {
  let planned;
  let backlog;
  let running;
  let review;
  let { app } = $$props;
  let { fileManager } = $$props;
  let { projectId } = $$props;
  let { projectTasks } = $$props;
  let dragId = null;
  let dragOverStatus = null;
  let dragOverIndex = -1;
  let dragHeight = 60;
  function handleDragStart(e, id) {
    const target = e.target.closest(".pos-board-card");
    if (target) {
      const rect = target.getBoundingClientRect();
      $$invalidate(4, dragHeight = rect.height);
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", id);
        const clone = target.cloneNode(true);
        clone.style.position = "absolute";
        clone.style.top = "-9999px";
        clone.style.left = "-9999px";
        clone.style.width = rect.width + "px";
        clone.style.height = rect.height + "px";
        clone.style.opacity = "1";
        clone.classList.remove("pos-dragging-source");
        document.body.appendChild(clone);
        e.dataTransfer.setDragImage(clone, e.clientX - rect.left, e.clientY - rect.top);
        setTimeout(
          () => {
            if (clone.parentNode)
              clone.parentNode.removeChild(clone);
          },
          50
        );
      }
    } else {
      if (e.dataTransfer)
        e.dataTransfer.setData("text/plain", id);
    }
    setTimeout(
      () => {
        $$invalidate(1, dragId = id);
      },
      0
    );
  }
  function handleDragEnd() {
    $$invalidate(1, dragId = null);
    $$invalidate(2, dragOverStatus = null);
    $$invalidate(3, dragOverIndex = -1);
  }
  function handleDragOver(e, status) {
    e.preventDefault();
    if (!dragId)
      return;
    const listEl = e.currentTarget.querySelector(".pos-board-list");
    if (!listEl)
      return;
    const isPlaceholderInThisColumn = dragOverStatus === status && dragOverIndex !== -1;
    const placeholderShift = dragHeight + 8;
    const cards = Array.from(listEl.querySelectorAll(".pos-board-card"));
    let index = 0;
    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect();
      let virtualTop = rect.top;
      if (isPlaceholderInThisColumn && dragOverIndex <= i) {
        virtualTop -= placeholderShift;
      }
      if (e.clientY < virtualTop + rect.height / 2) {
        index = i;
        break;
      }
      index = i + 1;
    }
    $$invalidate(2, dragOverStatus = status);
    $$invalidate(3, dragOverIndex = index);
  }
  async function handleDrop(e, status) {
    e.preventDefault();
    if (!dragId)
      return;
    const task = projectTasks.find((t) => t.id === dragId);
    if (!task)
      return;
    const oldStatus = task.status;
    const targetIndex = dragOverIndex;
    $$invalidate(1, dragId = null);
    $$invalidate(2, dragOverStatus = null);
    $$invalidate(3, dragOverIndex = -1);
    if (oldStatus === status) {
      const colTasks = projectTasks.filter((t) => t.status === status);
      const cardToMove = colTasks.find((t) => t.id === task.id);
      if (!cardToMove)
        return;
      const oldIndex = colTasks.indexOf(cardToMove);
      if (oldIndex === targetIndex || oldIndex === targetIndex - 1)
        return;
      const newColTasks = [...colTasks];
      newColTasks.splice(oldIndex, 1);
      let adjustedTarget = targetIndex;
      if (oldIndex < targetIndex)
        adjustedTarget--;
      newColTasks.splice(adjustedTarget, 0, cardToMove);
      await Promise.all(newColTasks.map((t, idx) => fileManager.updateTask(t.id, { orderIndex: idx })));
    } else {
      const sourceCol = projectTasks.filter((t) => t.status === oldStatus && t.id !== task.id);
      const destCol = projectTasks.filter((t) => t.status === status);
      destCol.splice(targetIndex, 0, {
        ...task,
        status,
        isCompleted: status === "review"
      });
      await Promise.all([
        ...sourceCol.map((t, idx) => fileManager.updateTask(t.id, { orderIndex: idx })),
        ...destCol.map((t, idx) => fileManager.updateTask(t.id, {
          orderIndex: idx,
          status: t.id === task.id ? status : t.status,
          isCompleted: t.id === task.id ? status === "review" : t.isCompleted
        }))
      ]);
    }
  }
  function createPlannedTask(status) {
    new NewTaskModal(
      app,
      async (name) => {
        await fileManager.createTask({
          name,
          project: projectId,
          status,
          orderIndex: projectTasks.filter((t) => t.status === status).length
        });
      }
    ).open();
  }
  function editTask(task) {
    new EditTaskModal(
      app,
      task,
      async (updates) => {
        await fileManager.updateTask(task.id, updates);
      }
    ).open();
  }
  function openTaskFile(taskId) {
    const file = app.vault.getAbstractFileByPath(`tasks/${taskId}.md`);
    if (file instanceof import_obsidian5.TFile) {
      app.workspace.getLeaf().openFile(file);
    }
  }
  async function updateStatus(task, status) {
    await fileManager.updateTask(task.id, { status, isCompleted: status === "review" });
  }
  async function toggleFixed(task, isFixed) {
    await fileManager.updateTask(task.id, {
      isFixedDuration: isFixed,
      fixedDuration: isFixed ? task.fixedDuration || 30 : null
    });
  }
  async function setFixed(task, duration) {
    await fileManager.updateTask(task.id, {
      isFixedDuration: true,
      fixedDuration: duration
    });
  }
  async function deleteTask(id) {
    await fileManager.deleteTask(id);
  }
  function click_handler_1(event) {
    bubble.call(this, $$self, event);
  }
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  const change_handler = (task) => updateStatus(task, "backlog");
  const click_handler_2 = (task) => editTask(task);
  const click_handler_3 = (task) => deleteTask(task.id);
  const dragstart_handler = (task, e) => handleDragStart(e, task.id);
  const click_handler_4 = () => createPlannedTask("planned");
  const dragover_handler = (e) => handleDragOver(e, "planned");
  const drop_handler = (e) => handleDrop(e, "planned");
  const change_handler_1 = (task) => updateStatus(task, "planned");
  const click_handler_5 = (task) => editTask(task);
  const click_handler_6 = (task) => deleteTask(task.id);
  const dragstart_handler_1 = (task, e) => handleDragStart(e, task.id);
  const click_handler_7 = () => createPlannedTask("backlog");
  const dragover_handler_1 = (e) => handleDragOver(e, "backlog");
  const drop_handler_1 = (e) => handleDrop(e, "backlog");
  const click_handler_8 = (task) => editTask(task);
  const click_handler_9 = (task) => fileManager.updateTask(task.id, { weight: Math.max(1, task.weight - 1) });
  const click_handler_10 = (task) => fileManager.updateTask(task.id, { weight: task.weight + 1 });
  const change_handler_2 = (task, e) => toggleFixed(task, e.currentTarget.checked);
  const change_handler_3 = (task, e) => setFixed(task, Number(e.currentTarget.value));
  const click_handler_11 = (task) => deleteTask(task.id);
  const dragstart_handler_2 = (task, e) => handleDragStart(e, task.id);
  const dragover_handler_2 = (e) => handleDragOver(e, "running");
  const drop_handler_2 = (e) => handleDrop(e, "running");
  const click_handler_12 = (task) => editTask(task);
  const click_handler_13 = (task) => deleteTask(task.id);
  const dragstart_handler_3 = (task, e) => handleDragStart(e, task.id);
  const dragover_handler_3 = (e) => handleDragOver(e, "review");
  const drop_handler_3 = (e) => handleDrop(e, "review");
  $$self.$$set = ($$props2) => {
    if ("app" in $$props2)
      $$invalidate(19, app = $$props2.app);
    if ("fileManager" in $$props2)
      $$invalidate(0, fileManager = $$props2.fileManager);
    if ("projectId" in $$props2)
      $$invalidate(20, projectId = $$props2.projectId);
    if ("projectTasks" in $$props2)
      $$invalidate(21, projectTasks = $$props2.projectTasks);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*projectTasks*/
    2097152) {
      $:
        $$invalidate(8, planned = projectTasks.filter((t) => t.status === "planned"));
    }
    if ($$self.$$.dirty[0] & /*projectTasks*/
    2097152) {
      $:
        $$invalidate(7, backlog = projectTasks.filter((t) => t.status === "backlog"));
    }
    if ($$self.$$.dirty[0] & /*projectTasks*/
    2097152) {
      $:
        $$invalidate(6, running = projectTasks.filter((t) => t.status === "running"));
    }
    if ($$self.$$.dirty[0] & /*projectTasks*/
    2097152) {
      $:
        $$invalidate(5, review = projectTasks.filter((t) => t.status === "review"));
    }
  };
  return [
    fileManager,
    dragId,
    dragOverStatus,
    dragOverIndex,
    dragHeight,
    review,
    running,
    backlog,
    planned,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    createPlannedTask,
    editTask,
    updateStatus,
    toggleFixed,
    setFixed,
    deleteTask,
    app,
    projectId,
    projectTasks,
    click_handler_1,
    click_handler,
    change_handler,
    click_handler_2,
    click_handler_3,
    dragstart_handler,
    click_handler_4,
    dragover_handler,
    drop_handler,
    change_handler_1,
    click_handler_5,
    click_handler_6,
    dragstart_handler_1,
    click_handler_7,
    dragover_handler_1,
    drop_handler_1,
    click_handler_8,
    click_handler_9,
    click_handler_10,
    change_handler_2,
    change_handler_3,
    click_handler_11,
    dragstart_handler_2,
    dragover_handler_2,
    drop_handler_2,
    click_handler_12,
    click_handler_13,
    dragstart_handler_3,
    dragover_handler_3,
    drop_handler_3
  ];
}
var ProjectTaskBoard = class extends SvelteComponent {
  constructor(options) {
    super();
    init(
      this,
      options,
      instance6,
      create_fragment6,
      safe_not_equal,
      {
        app: 19,
        fileManager: 0,
        projectId: 20,
        projectTasks: 21
      },
      null,
      [-1, -1]
    );
  }
};
var ProjectTaskBoard_default = ProjectTaskBoard;

// src/ui/views/components/ProjectTaskGrid.svelte
var import_obsidian6 = require("obsidian");
function get_each_context6(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[30] = list[i];
  return child_ctx;
}
function create_if_block_26(ctx) {
  let div1;
  let span;
  let t0_value = (
    /*selectedTaskIds*/
    ctx[5].size + ""
  );
  let t0;
  let t1;
  let t2;
  let div0;
  let button0;
  let t4;
  let button1;
  let t6;
  let button2;
  let t8;
  let button3;
  let mounted;
  let dispose;
  return {
    c() {
      div1 = element("div");
      span = element("span");
      t0 = text(t0_value);
      t1 = text(" tasks selected");
      t2 = space();
      div0 = element("div");
      button0 = element("button");
      button0.textContent = "Activate (Move to Backlog)";
      t4 = space();
      button1 = element("button");
      button1.textContent = "Deactivate (Move to Planned)";
      t6 = space();
      button2 = element("button");
      button2.textContent = "Complete";
      t8 = space();
      button3 = element("button");
      button3.textContent = "Delete Permanently";
      attr(span, "class", "pos-bulk-bar-count");
      attr(button0, "class", "pos-bulk-act-btn activate");
      attr(button1, "class", "pos-bulk-act-btn plan");
      attr(button2, "class", "pos-bulk-act-btn complete");
      attr(button3, "class", "pos-bulk-act-btn delete pos-del");
      attr(div0, "class", "pos-bulk-bar-acts");
      attr(div1, "class", "pos-bulk-bar");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, span);
      append(span, t0);
      append(span, t1);
      append(div1, t2);
      append(div1, div0);
      append(div0, button0);
      append(div0, t4);
      append(div0, button1);
      append(div0, t6);
      append(div0, button2);
      append(div0, t8);
      append(div0, button3);
      if (!mounted) {
        dispose = [
          listen(
            button0,
            "click",
            /*bulkActivate*/
            ctx[10]
          ),
          listen(
            button1,
            "click",
            /*bulkPlan*/
            ctx[11]
          ),
          listen(
            button2,
            "click",
            /*bulkComplete*/
            ctx[12]
          ),
          listen(
            button3,
            "click",
            /*bulkDelete*/
            ctx[13]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*selectedTaskIds*/
      32 && t0_value !== (t0_value = /*selectedTaskIds*/
      ctx2[5].size + ""))
        set_data(t0, t0_value);
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_else_block3(ctx) {
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let each_1_anchor;
  let each_value = ensure_array_like(
    /*sortedTasks*/
    ctx[6]
  );
  const get_key = (ctx2) => (
    /*task*/
    ctx2[30].id
  );
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context6(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block6(key, child_ctx));
  }
  return {
    c() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
    },
    m(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(target, anchor);
        }
      }
      insert(target, each_1_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*selectedTaskIds, sortedTasks, fileManager, editTask, toggleSelection*/
      33121) {
        each_value = ensure_array_like(
          /*sortedTasks*/
          ctx2[6]
        );
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block6, each_1_anchor, get_each_context6);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(each_1_anchor);
      }
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d(detaching);
      }
    }
  };
}
function create_if_block6(ctx) {
  let tr;
  return {
    c() {
      tr = element("tr");
      tr.innerHTML = `<td colspan="6" class="pos-empty-grid">No tasks match your search filters.</td>`;
    },
    m(target, anchor) {
      insert(target, tr, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(tr);
      }
    }
  };
}
function create_if_block_17(ctx) {
  let span;
  let t_value = (
    /*task*/
    ctx[30].description + ""
  );
  let t;
  return {
    c() {
      span = element("span");
      t = text(t_value);
      attr(span, "class", "pos-td-task-desc");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*sortedTasks*/
      64 && t_value !== (t_value = /*task*/
      ctx2[30].description + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_each_block6(key_1, ctx) {
  let tr;
  let td0;
  let input;
  let input_checked_value;
  let t0;
  let td1;
  let div0;
  let span0;
  let t1_value = (
    /*task*/
    ctx[30].name + ""
  );
  let t1;
  let t2;
  let t3;
  let td2;
  let span1;
  let t4_value = (
    /*task*/
    ctx[30].status.toUpperCase() + ""
  );
  let t4;
  let span1_class_value;
  let t5;
  let td3;
  let t6_value = (
    /*task*/
    ctx[30].weight + ""
  );
  let t6;
  let t7;
  let td4;
  let t8_value = new Date(
    /*task*/
    ctx[30].createdAt
  ).toLocaleDateString() + "";
  let t8;
  let t9;
  let td5;
  let div1;
  let button;
  let t11;
  let mounted;
  let dispose;
  function change_handler() {
    return (
      /*change_handler*/
      ctx[26](
        /*task*/
        ctx[30]
      )
    );
  }
  function click_handler_4() {
    return (
      /*click_handler_4*/
      ctx[27](
        /*task*/
        ctx[30]
      )
    );
  }
  let if_block = (
    /*task*/
    ctx[30].description && create_if_block_17(ctx)
  );
  function click_handler_5() {
    return (
      /*click_handler_5*/
      ctx[28](
        /*task*/
        ctx[30]
      )
    );
  }
  return {
    key: key_1,
    first: null,
    c() {
      tr = element("tr");
      td0 = element("td");
      input = element("input");
      t0 = space();
      td1 = element("td");
      div0 = element("div");
      span0 = element("span");
      t1 = text(t1_value);
      t2 = space();
      if (if_block)
        if_block.c();
      t3 = space();
      td2 = element("td");
      span1 = element("span");
      t4 = text(t4_value);
      t5 = space();
      td3 = element("td");
      t6 = text(t6_value);
      t7 = space();
      td4 = element("td");
      t8 = text(t8_value);
      t9 = space();
      td5 = element("td");
      div1 = element("div");
      button = element("button");
      button.textContent = "Delete";
      t11 = space();
      attr(input, "type", "checkbox");
      input.checked = input_checked_value = /*selectedTaskIds*/
      ctx[5].has(
        /*task*/
        ctx[30].id
      );
      attr(td0, "class", "pos-td-check");
      attr(span0, "class", "pos-td-task-title");
      attr(div0, "class", "pos-td-name-cell");
      attr(td1, "class", "pos-td-name");
      attr(span1, "class", span1_class_value = "pos-ptc-status-badge " + /*task*/
      ctx[30].status);
      attr(td2, "class", "pos-td-status");
      attr(td3, "class", "pos-td-weight font-mono");
      attr(td4, "class", "pos-td-date font-mono");
      attr(button, "class", "pos-del");
      attr(div1, "class", "pos-grid-row-acts");
      attr(td5, "class", "pos-td-acts");
      toggle_class(
        tr,
        "selected",
        /*selectedTaskIds*/
        ctx[5].has(
          /*task*/
          ctx[30].id
        )
      );
      toggle_class(
        tr,
        "completed",
        /*task*/
        ctx[30].isCompleted
      );
      this.first = tr;
    },
    m(target, anchor) {
      insert(target, tr, anchor);
      append(tr, td0);
      append(td0, input);
      append(tr, t0);
      append(tr, td1);
      append(td1, div0);
      append(div0, span0);
      append(span0, t1);
      append(div0, t2);
      if (if_block)
        if_block.m(div0, null);
      append(tr, t3);
      append(tr, td2);
      append(td2, span1);
      append(span1, t4);
      append(tr, t5);
      append(tr, td3);
      append(td3, t6);
      append(tr, t7);
      append(tr, td4);
      append(td4, t8);
      append(tr, t9);
      append(tr, td5);
      append(td5, div1);
      append(div1, button);
      append(tr, t11);
      if (!mounted) {
        dispose = [
          listen(input, "change", change_handler),
          listen(span0, "click", click_handler_4),
          listen(button, "click", click_handler_5)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & /*selectedTaskIds, sortedTasks*/
      96 && input_checked_value !== (input_checked_value = /*selectedTaskIds*/
      ctx[5].has(
        /*task*/
        ctx[30].id
      ))) {
        input.checked = input_checked_value;
      }
      if (dirty[0] & /*sortedTasks*/
      64 && t1_value !== (t1_value = /*task*/
      ctx[30].name + ""))
        set_data(t1, t1_value);
      if (
        /*task*/
        ctx[30].description
      ) {
        if (if_block) {
          if_block.p(ctx, dirty);
        } else {
          if_block = create_if_block_17(ctx);
          if_block.c();
          if_block.m(div0, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (dirty[0] & /*sortedTasks*/
      64 && t4_value !== (t4_value = /*task*/
      ctx[30].status.toUpperCase() + ""))
        set_data(t4, t4_value);
      if (dirty[0] & /*sortedTasks*/
      64 && span1_class_value !== (span1_class_value = "pos-ptc-status-badge " + /*task*/
      ctx[30].status)) {
        attr(span1, "class", span1_class_value);
      }
      if (dirty[0] & /*sortedTasks*/
      64 && t6_value !== (t6_value = /*task*/
      ctx[30].weight + ""))
        set_data(t6, t6_value);
      if (dirty[0] & /*sortedTasks*/
      64 && t8_value !== (t8_value = new Date(
        /*task*/
        ctx[30].createdAt
      ).toLocaleDateString() + ""))
        set_data(t8, t8_value);
      if (dirty[0] & /*selectedTaskIds, sortedTasks*/
      96) {
        toggle_class(
          tr,
          "selected",
          /*selectedTaskIds*/
          ctx[5].has(
            /*task*/
            ctx[30].id
          )
        );
      }
      if (dirty[0] & /*sortedTasks*/
      64) {
        toggle_class(
          tr,
          "completed",
          /*task*/
          ctx[30].isCompleted
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(tr);
      }
      if (if_block)
        if_block.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment7(ctx) {
  let div2;
  let div0;
  let input0;
  let t0;
  let select;
  let option0;
  let option1;
  let option2;
  let option3;
  let t5;
  let t6;
  let div1;
  let table;
  let thead;
  let tr;
  let th0;
  let input1;
  let t7;
  let th1;
  let t8;
  let t9_value = (
    /*sortBy*/
    ctx[3] === "name" ? (
      /*sortOrder*/
      ctx[4] === "asc" ? "\u25B2" : "\u25BC"
    ) : ""
  );
  let t9;
  let t10;
  let th2;
  let t11;
  let t12_value = (
    /*sortBy*/
    ctx[3] === "status" ? (
      /*sortOrder*/
      ctx[4] === "asc" ? "\u25B2" : "\u25BC"
    ) : ""
  );
  let t12;
  let t13;
  let th3;
  let t14;
  let t15_value = (
    /*sortBy*/
    ctx[3] === "weight" ? (
      /*sortOrder*/
      ctx[4] === "asc" ? "\u25B2" : "\u25BC"
    ) : ""
  );
  let t15;
  let t16;
  let th4;
  let t17;
  let t18_value = (
    /*sortBy*/
    ctx[3] === "createdAt" ? (
      /*sortOrder*/
      ctx[4] === "asc" ? "\u25B2" : "\u25BC"
    ) : ""
  );
  let t18;
  let t19;
  let th5;
  let t21;
  let tbody;
  let mounted;
  let dispose;
  let if_block0 = (
    /*selectedTaskIds*/
    ctx[5].size > 0 && create_if_block_26(ctx)
  );
  function select_block_type(ctx2, dirty) {
    if (
      /*sortedTasks*/
      ctx2[6].length === 0
    )
      return create_if_block6;
    return create_else_block3;
  }
  let current_block_type = select_block_type(ctx, [-1, -1]);
  let if_block1 = current_block_type(ctx);
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      input0 = element("input");
      t0 = space();
      select = element("select");
      option0 = element("option");
      option0.textContent = "All Task States";
      option1 = element("option");
      option1.textContent = "Planned (Inactive)";
      option2 = element("option");
      option2.textContent = "Active (Backlog/Running)";
      option3 = element("option");
      option3.textContent = "Review (Completed)";
      t5 = space();
      if (if_block0)
        if_block0.c();
      t6 = space();
      div1 = element("div");
      table = element("table");
      thead = element("thead");
      tr = element("tr");
      th0 = element("th");
      input1 = element("input");
      t7 = space();
      th1 = element("th");
      t8 = text("Task Name ");
      t9 = text(t9_value);
      t10 = space();
      th2 = element("th");
      t11 = text("Status ");
      t12 = text(t12_value);
      t13 = space();
      th3 = element("th");
      t14 = text("Weight ");
      t15 = text(t15_value);
      t16 = space();
      th4 = element("th");
      t17 = text("Created ");
      t18 = text(t18_value);
      t19 = space();
      th5 = element("th");
      th5.textContent = "Actions";
      t21 = space();
      tbody = element("tbody");
      if_block1.c();
      attr(input0, "type", "text");
      attr(input0, "placeholder", "Search planned task names or descriptions...");
      attr(input0, "class", "pos-grid-search-input");
      option0.__value = "all";
      set_input_value(option0, option0.__value);
      option1.__value = "planned";
      set_input_value(option1, option1.__value);
      option2.__value = "active";
      set_input_value(option2, option2.__value);
      option3.__value = "review";
      set_input_value(option3, option3.__value);
      attr(select, "class", "pos-grid-select-filter");
      if (
        /*statusFilter*/
        ctx[2] === void 0
      )
        add_render_callback(() => (
          /*select_change_handler*/
          ctx[21].call(select)
        ));
      attr(div0, "class", "pos-grid-filter-bar");
      attr(input1, "type", "checkbox");
      input1.checked = /*allSelected*/
      ctx[7];
      attr(th0, "class", "pos-th-check");
      attr(th1, "class", "pos-th-name");
      attr(th2, "class", "pos-th-status");
      attr(th3, "class", "pos-th-weight");
      attr(th4, "class", "pos-th-date");
      attr(th5, "class", "pos-th-acts");
      attr(table, "class", "pos-grid-table");
      attr(div1, "class", "pos-grid-table-container");
      attr(div2, "class", "pos-grid-workspace");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, div0);
      append(div0, input0);
      set_input_value(
        input0,
        /*searchQuery*/
        ctx[1]
      );
      append(div0, t0);
      append(div0, select);
      append(select, option0);
      append(select, option1);
      append(select, option2);
      append(select, option3);
      select_option(
        select,
        /*statusFilter*/
        ctx[2],
        true
      );
      append(div2, t5);
      if (if_block0)
        if_block0.m(div2, null);
      append(div2, t6);
      append(div2, div1);
      append(div1, table);
      append(table, thead);
      append(thead, tr);
      append(tr, th0);
      append(th0, input1);
      append(tr, t7);
      append(tr, th1);
      append(th1, t8);
      append(th1, t9);
      append(tr, t10);
      append(tr, th2);
      append(th2, t11);
      append(th2, t12);
      append(tr, t13);
      append(tr, th3);
      append(th3, t14);
      append(th3, t15);
      append(tr, t16);
      append(tr, th4);
      append(th4, t17);
      append(th4, t18);
      append(tr, t19);
      append(tr, th5);
      append(table, t21);
      append(table, tbody);
      if_block1.m(tbody, null);
      if (!mounted) {
        dispose = [
          listen(
            input0,
            "input",
            /*input0_input_handler*/
            ctx[20]
          ),
          listen(
            select,
            "change",
            /*select_change_handler*/
            ctx[21]
          ),
          listen(
            input1,
            "change",
            /*toggleSelectAll*/
            ctx[9]
          ),
          listen(
            th1,
            "click",
            /*click_handler*/
            ctx[22]
          ),
          listen(
            th2,
            "click",
            /*click_handler_1*/
            ctx[23]
          ),
          listen(
            th3,
            "click",
            /*click_handler_2*/
            ctx[24]
          ),
          listen(
            th4,
            "click",
            /*click_handler_3*/
            ctx[25]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*searchQuery*/
      2 && input0.value !== /*searchQuery*/
      ctx2[1]) {
        set_input_value(
          input0,
          /*searchQuery*/
          ctx2[1]
        );
      }
      if (dirty[0] & /*statusFilter*/
      4) {
        select_option(
          select,
          /*statusFilter*/
          ctx2[2]
        );
      }
      if (
        /*selectedTaskIds*/
        ctx2[5].size > 0
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0 = create_if_block_26(ctx2);
          if_block0.c();
          if_block0.m(div2, t6);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (dirty[0] & /*allSelected*/
      128) {
        input1.checked = /*allSelected*/
        ctx2[7];
      }
      if (dirty[0] & /*sortBy, sortOrder*/
      24 && t9_value !== (t9_value = /*sortBy*/
      ctx2[3] === "name" ? (
        /*sortOrder*/
        ctx2[4] === "asc" ? "\u25B2" : "\u25BC"
      ) : ""))
        set_data(t9, t9_value);
      if (dirty[0] & /*sortBy, sortOrder*/
      24 && t12_value !== (t12_value = /*sortBy*/
      ctx2[3] === "status" ? (
        /*sortOrder*/
        ctx2[4] === "asc" ? "\u25B2" : "\u25BC"
      ) : ""))
        set_data(t12, t12_value);
      if (dirty[0] & /*sortBy, sortOrder*/
      24 && t15_value !== (t15_value = /*sortBy*/
      ctx2[3] === "weight" ? (
        /*sortOrder*/
        ctx2[4] === "asc" ? "\u25B2" : "\u25BC"
      ) : ""))
        set_data(t15, t15_value);
      if (dirty[0] & /*sortBy, sortOrder*/
      24 && t18_value !== (t18_value = /*sortBy*/
      ctx2[3] === "createdAt" ? (
        /*sortOrder*/
        ctx2[4] === "asc" ? "\u25B2" : "\u25BC"
      ) : ""))
        set_data(t18, t18_value);
      if (current_block_type === (current_block_type = select_block_type(ctx2, dirty)) && if_block1) {
        if_block1.p(ctx2, dirty);
      } else {
        if_block1.d(1);
        if_block1 = current_block_type(ctx2);
        if (if_block1) {
          if_block1.c();
          if_block1.m(tbody, null);
        }
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      if (if_block0)
        if_block0.d();
      if_block1.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance7($$self, $$props, $$invalidate) {
  let filteredTasks;
  let sortedTasks;
  let allSelected;
  let { app } = $$props;
  let { fileManager } = $$props;
  let { projectId } = $$props;
  let { projectTasks } = $$props;
  let searchQuery = "";
  let statusFilter = "all";
  let sortBy = "name";
  let sortOrder = "asc";
  let selectedTaskIds = /* @__PURE__ */ new Set();
  function toggleSelection(id) {
    if (selectedTaskIds.has(id)) {
      selectedTaskIds.delete(id);
    } else {
      selectedTaskIds.add(id);
    }
    $$invalidate(5, selectedTaskIds);
  }
  function toggleSelectAll() {
    if (allSelected) {
      sortedTasks.forEach((t) => selectedTaskIds.delete(t.id));
    } else {
      sortedTasks.forEach((t) => selectedTaskIds.add(t.id));
    }
    $$invalidate(5, selectedTaskIds);
  }
  async function bulkActivate() {
    if (selectedTaskIds.size === 0)
      return;
    const ids = Array.from(selectedTaskIds);
    await Promise.all(ids.map((id) => fileManager.updateTask(id, { status: "backlog", isCompleted: false })));
    selectedTaskIds.clear();
    $$invalidate(5, selectedTaskIds);
  }
  async function bulkPlan() {
    if (selectedTaskIds.size === 0)
      return;
    const ids = Array.from(selectedTaskIds);
    await Promise.all(ids.map((id) => fileManager.updateTask(id, { status: "planned", isCompleted: false })));
    selectedTaskIds.clear();
    $$invalidate(5, selectedTaskIds);
  }
  async function bulkComplete() {
    if (selectedTaskIds.size === 0)
      return;
    const ids = Array.from(selectedTaskIds);
    await Promise.all(ids.map((id) => fileManager.updateTask(id, { status: "review", isCompleted: true })));
    selectedTaskIds.clear();
    $$invalidate(5, selectedTaskIds);
  }
  function bulkDelete() {
    if (selectedTaskIds.size === 0)
      return;
    new ConfirmModal(
      app,
      "Bulk Delete Tasks",
      `Permanently delete all ${selectedTaskIds.size} selected tasks?`,
      async () => {
        const ids = Array.from(selectedTaskIds);
        await Promise.all(ids.map((id) => fileManager.deleteTask(id)));
        selectedTaskIds.clear();
        $$invalidate(5, selectedTaskIds);
      }
    ).open();
  }
  function toggleSort(field) {
    if (sortBy === field) {
      $$invalidate(4, sortOrder = sortOrder === "asc" ? "desc" : "asc");
    } else {
      $$invalidate(3, sortBy = field);
      $$invalidate(4, sortOrder = "asc");
    }
  }
  function editTask(task) {
    new EditTaskModal(
      app,
      task,
      async (updates) => {
        await fileManager.updateTask(task.id, updates);
      }
    ).open();
  }
  function openTaskFile(taskId) {
    const file = app.vault.getAbstractFileByPath(`tasks/${taskId}.md`);
    if (file instanceof import_obsidian6.TFile) {
      app.workspace.getLeaf().openFile(file);
    }
  }
  function input0_input_handler() {
    searchQuery = this.value;
    $$invalidate(1, searchQuery);
  }
  function select_change_handler() {
    statusFilter = select_value(this);
    $$invalidate(2, statusFilter);
  }
  const click_handler = () => toggleSort("name");
  const click_handler_1 = () => toggleSort("status");
  const click_handler_2 = () => toggleSort("weight");
  const click_handler_3 = () => toggleSort("createdAt");
  const change_handler = (task) => toggleSelection(task.id);
  const click_handler_4 = (task) => editTask(task);
  const click_handler_5 = (task) => fileManager.deleteTask(task.id);
  $$self.$$set = ($$props2) => {
    if ("app" in $$props2)
      $$invalidate(16, app = $$props2.app);
    if ("fileManager" in $$props2)
      $$invalidate(0, fileManager = $$props2.fileManager);
    if ("projectId" in $$props2)
      $$invalidate(17, projectId = $$props2.projectId);
    if ("projectTasks" in $$props2)
      $$invalidate(18, projectTasks = $$props2.projectTasks);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*projectTasks, searchQuery, statusFilter*/
    262150) {
      $:
        $$invalidate(19, filteredTasks = projectTasks.filter((task) => {
          const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) || task.description.toLowerCase().includes(searchQuery.toLowerCase());
          if (!matchesSearch)
            return false;
          if (statusFilter === "planned")
            return task.status === "planned";
          if (statusFilter === "active")
            return task.status === "backlog" || task.status === "running";
          if (statusFilter === "review")
            return task.status === "review";
          return true;
        }));
    }
    if ($$self.$$.dirty[0] & /*filteredTasks, sortBy, sortOrder*/
    524312) {
      $:
        $$invalidate(6, sortedTasks = [...filteredTasks].sort((a, b) => {
          let fieldA = a[sortBy];
          let fieldB = b[sortBy];
          if (typeof fieldA === "string") {
            fieldA = fieldA.toLowerCase();
            fieldB = fieldB.toLowerCase();
          }
          if (fieldA < fieldB)
            return sortOrder === "asc" ? -1 : 1;
          if (fieldA > fieldB)
            return sortOrder === "asc" ? 1 : -1;
          return 0;
        }));
    }
    if ($$self.$$.dirty[0] & /*sortedTasks, selectedTaskIds*/
    96) {
      $:
        $$invalidate(7, allSelected = sortedTasks.length > 0 && sortedTasks.every((t) => selectedTaskIds.has(t.id)));
    }
  };
  return [
    fileManager,
    searchQuery,
    statusFilter,
    sortBy,
    sortOrder,
    selectedTaskIds,
    sortedTasks,
    allSelected,
    toggleSelection,
    toggleSelectAll,
    bulkActivate,
    bulkPlan,
    bulkComplete,
    bulkDelete,
    toggleSort,
    editTask,
    app,
    projectId,
    projectTasks,
    filteredTasks,
    input0_input_handler,
    select_change_handler,
    click_handler,
    click_handler_1,
    click_handler_2,
    click_handler_3,
    change_handler,
    click_handler_4,
    click_handler_5
  ];
}
var ProjectTaskGrid = class extends SvelteComponent {
  constructor(options) {
    super();
    init(
      this,
      options,
      instance7,
      create_fragment7,
      safe_not_equal,
      {
        app: 16,
        fileManager: 0,
        projectId: 17,
        projectTasks: 18
      },
      null,
      [-1, -1]
    );
  }
};
var ProjectTaskGrid_default = ProjectTaskGrid;

// src/ui/views/ProjectsView.svelte
function get_each_context7(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[31] = list[i];
  return child_ctx;
}
function get_else_ctx(ctx) {
  const child_ctx = ctx.slice();
  const constants_0 = (
    /*$tasksStore*/
    child_ctx[9].filter((t) => t.project === /*selectedProject*/
    child_ctx[4].id).sort((a, b) => a.orderIndex - b.orderIndex)
  );
  child_ctx[34] = constants_0;
  return child_ctx;
}
function create_else_block4(ctx) {
  let div5;
  let header;
  let div1;
  let button0;
  let t1;
  let div0;
  let h3;
  let t2_value = (
    /*selectedProject*/
    ctx[4].name + ""
  );
  let t2;
  let t3;
  let div2;
  let button1;
  let t5;
  let button2;
  let t7;
  let button3;
  let t9;
  let button4;
  let t11;
  let div3;
  let t12;
  let div4;
  let current_block_type_index;
  let if_block;
  let current;
  let mounted;
  let dispose;
  const if_block_creators = [create_if_block_18, create_if_block_44, create_else_block_2];
  const if_blocks = [];
  function select_block_type_1(ctx2, dirty) {
    if (
      /*projectTab*/
      ctx2[8] === "notes"
    )
      return 0;
    if (
      /*projectTab*/
      ctx2[8] === "deadlines"
    )
      return 1;
    return 2;
  }
  function select_block_ctx(ctx2, index) {
    if (index === 2)
      return get_else_ctx(ctx2);
    return ctx2;
  }
  current_block_type_index = select_block_type_1(ctx, [-1, -1]);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](select_block_ctx(ctx, current_block_type_index));
  return {
    c() {
      div5 = element("div");
      header = element("header");
      div1 = element("div");
      button0 = element("button");
      button0.textContent = "\u2190 Back";
      t1 = space();
      div0 = element("div");
      h3 = element("h3");
      t2 = text(t2_value);
      t3 = space();
      div2 = element("div");
      button1 = element("button");
      button1.textContent = "\u{1F4C4} Notes";
      t5 = space();
      button2 = element("button");
      button2.textContent = "\u{1F4CB} Task Board";
      t7 = space();
      button3 = element("button");
      button3.textContent = "\u{1F4CA} Backlog";
      t9 = space();
      button4 = element("button");
      button4.textContent = "\u{1F4C5} Deadlines";
      t11 = space();
      div3 = element("div");
      t12 = space();
      div4 = element("div");
      if_block.c();
      attr(button0, "class", "pos-back-btn");
      attr(div0, "class", "pos-editor-project-title");
      attr(div1, "class", "pos-editor-header-left");
      attr(button1, "class", "pos-tab-btn");
      toggle_class(
        button1,
        "active",
        /*projectTab*/
        ctx[8] === "notes"
      );
      attr(button2, "class", "pos-tab-btn");
      toggle_class(
        button2,
        "active",
        /*projectTab*/
        ctx[8] === "board"
      );
      attr(button3, "class", "pos-tab-btn");
      toggle_class(
        button3,
        "active",
        /*projectTab*/
        ctx[8] === "grid"
      );
      attr(button4, "class", "pos-tab-btn");
      toggle_class(
        button4,
        "active",
        /*projectTab*/
        ctx[8] === "deadlines"
      );
      attr(div2, "class", "pos-editor-header-tabs");
      set_style(div3, "width", "40px");
      attr(header, "class", "pos-editor-header");
      attr(div4, "class", "pos-project-workspace-body");
      attr(div5, "class", "pos-project-full-workspace");
    },
    m(target, anchor) {
      insert(target, div5, anchor);
      append(div5, header);
      append(header, div1);
      append(div1, button0);
      append(div1, t1);
      append(div1, div0);
      append(div0, h3);
      append(h3, t2);
      append(header, t3);
      append(header, div2);
      append(div2, button1);
      append(div2, t5);
      append(div2, button2);
      append(div2, t7);
      append(div2, button3);
      append(div2, t9);
      append(div2, button4);
      append(header, t11);
      append(header, div3);
      append(div5, t12);
      append(div5, div4);
      if_blocks[current_block_type_index].m(div4, null);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            button0,
            "click",
            /*click_handler*/
            ctx[17]
          ),
          listen(
            button1,
            "click",
            /*click_handler_1*/
            ctx[18]
          ),
          listen(
            button2,
            "click",
            /*click_handler_2*/
            ctx[19]
          ),
          listen(
            button3,
            "click",
            /*click_handler_3*/
            ctx[20]
          ),
          listen(
            button4,
            "click",
            /*click_handler_4*/
            ctx[21]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if ((!current || dirty[0] & /*selectedProject*/
      16) && t2_value !== (t2_value = /*selectedProject*/
      ctx2[4].name + ""))
        set_data(t2, t2_value);
      if (!current || dirty[0] & /*projectTab*/
      256) {
        toggle_class(
          button1,
          "active",
          /*projectTab*/
          ctx2[8] === "notes"
        );
      }
      if (!current || dirty[0] & /*projectTab*/
      256) {
        toggle_class(
          button2,
          "active",
          /*projectTab*/
          ctx2[8] === "board"
        );
      }
      if (!current || dirty[0] & /*projectTab*/
      256) {
        toggle_class(
          button3,
          "active",
          /*projectTab*/
          ctx2[8] === "grid"
        );
      }
      if (!current || dirty[0] & /*projectTab*/
      256) {
        toggle_class(
          button4,
          "active",
          /*projectTab*/
          ctx2[8] === "deadlines"
        );
      }
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type_1(ctx2, dirty);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(select_block_ctx(ctx2, current_block_type_index), dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](select_block_ctx(ctx2, current_block_type_index));
          if_block.c();
        } else {
          if_block.p(select_block_ctx(ctx2, current_block_type_index), dirty);
        }
        transition_in(if_block, 1);
        if_block.m(div4, null);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div5);
      }
      if_blocks[current_block_type_index].d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block7(ctx) {
  let projectshub;
  let current;
  projectshub = new AgingView_default({
    props: {
      app: (
        /*app*/
        ctx[1]
      ),
      fileManager: (
        /*fileManager*/
        ctx[2]
      ),
      plugin: (
        /*plugin*/
        ctx[3]
      ),
      isFullPage: true,
      onSelect: (
        /*func*/
        ctx[16]
      )
    }
  });
  return {
    c() {
      create_component(projectshub.$$.fragment);
    },
    m(target, anchor) {
      mount_component(projectshub, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const projectshub_changes = {};
      if (dirty[0] & /*app*/
      2)
        projectshub_changes.app = /*app*/
        ctx2[1];
      if (dirty[0] & /*fileManager*/
      4)
        projectshub_changes.fileManager = /*fileManager*/
        ctx2[2];
      if (dirty[0] & /*plugin*/
      8)
        projectshub_changes.plugin = /*plugin*/
        ctx2[3];
      if (dirty[0] & /*selectedProjectId*/
      1)
        projectshub_changes.onSelect = /*func*/
        ctx2[16];
      projectshub.$set(projectshub_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(projectshub.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(projectshub.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(projectshub, detaching);
    }
  };
}
function create_else_block_2(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block_54, create_else_block_3];
  const if_blocks = [];
  function select_block_type_3(ctx2, dirty) {
    if (
      /*projectTab*/
      ctx2[8] === "board"
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type_3(ctx, [-1, -1]);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type_3(ctx2, dirty);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if_blocks[current_block_type_index].d(detaching);
    }
  };
}
function create_if_block_44(ctx) {
  let div;
  let projectdeadlines;
  let current;
  projectdeadlines = new ProjectDeadlines_default({
    props: {
      app: (
        /*app*/
        ctx[1]
      ),
      fileManager: (
        /*fileManager*/
        ctx[2]
      ),
      projectId: (
        /*selectedProject*/
        ctx[4].id
      )
    }
  });
  return {
    c() {
      div = element("div");
      create_component(projectdeadlines.$$.fragment);
      set_style(div, "height", "100%");
      set_style(div, "overflow", "hidden");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(projectdeadlines, div, null);
      current = true;
    },
    p(ctx2, dirty) {
      const projectdeadlines_changes = {};
      if (dirty[0] & /*app*/
      2)
        projectdeadlines_changes.app = /*app*/
        ctx2[1];
      if (dirty[0] & /*fileManager*/
      4)
        projectdeadlines_changes.fileManager = /*fileManager*/
        ctx2[2];
      if (dirty[0] & /*selectedProject*/
      16)
        projectdeadlines_changes.projectId = /*selectedProject*/
        ctx2[4].id;
      projectdeadlines.$set(projectdeadlines_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(projectdeadlines.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(projectdeadlines.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_component(projectdeadlines);
    }
  };
}
function create_if_block_18(ctx) {
  let div8;
  let div3;
  let div0;
  let span0;
  let t1;
  let button0;
  let t3;
  let div2;
  let div1;
  let t4;
  let div7;
  let div5;
  let span1;
  let t6;
  let div4;
  let button1;
  let t8;
  let t9;
  let div6;
  let mounted;
  let dispose;
  let if_block0 = (
    /*showNewFileMenu*/
    ctx[7] && create_if_block_36(ctx)
  );
  function select_block_type_2(ctx2, dirty) {
    if (
      /*projectFiles*/
      ctx2[6].length === 0
    )
      return create_if_block_27;
    return create_else_block_1;
  }
  let current_block_type = select_block_type_2(ctx, [-1, -1]);
  let if_block1 = current_block_type(ctx);
  return {
    c() {
      div8 = element("div");
      div3 = element("div");
      div0 = element("div");
      span0 = element("span");
      span0.textContent = "\u{1F4C4} Project Note";
      t1 = space();
      button0 = element("button");
      button0.textContent = "Edit Natively \u2197";
      t3 = space();
      div2 = element("div");
      div1 = element("div");
      t4 = space();
      div7 = element("div");
      div5 = element("div");
      span1 = element("span");
      span1.textContent = "\u{1F4C1} Project Files";
      t6 = space();
      div4 = element("div");
      button1 = element("button");
      button1.textContent = "+ New";
      t8 = space();
      if (if_block0)
        if_block0.c();
      t9 = space();
      div6 = element("div");
      if_block1.c();
      attr(span0, "class", "pos-note-bar-label");
      attr(button0, "class", "pos-modal-primary pos-note-edit-btn");
      attr(div0, "class", "pos-native-note-bar");
      attr(div1, "class", "markdown-preview-view markdown-rendered pos-note-md-render");
      attr(div2, "class", "pos-note-preview-body");
      attr(div3, "class", "pos-note-preview-section");
      attr(span1, "class", "pos-fb-title");
      attr(button1, "class", "pos-fb-new-btn");
      attr(div4, "class", "pos-fb-actions");
      attr(div5, "class", "pos-fb-header");
      attr(div6, "class", "pos-fb-list");
      attr(div7, "class", "pos-file-browser");
      attr(div8, "class", "pos-notes-layout");
    },
    m(target, anchor) {
      insert(target, div8, anchor);
      append(div8, div3);
      append(div3, div0);
      append(div0, span0);
      append(div0, t1);
      append(div0, button0);
      append(div3, t3);
      append(div3, div2);
      append(div2, div1);
      ctx[22](div1);
      append(div8, t4);
      append(div8, div7);
      append(div7, div5);
      append(div5, span1);
      append(div5, t6);
      append(div5, div4);
      append(div4, button1);
      append(div4, t8);
      if (if_block0)
        if_block0.m(div4, null);
      append(div7, t9);
      append(div7, div6);
      if_block1.m(div6, null);
      if (!mounted) {
        dispose = [
          listen(
            button0,
            "click",
            /*handleOpenNoteNatively*/
            ctx[10]
          ),
          listen(
            button1,
            "click",
            /*click_handler_5*/
            ctx[23]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (
        /*showNewFileMenu*/
        ctx2[7]
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0 = create_if_block_36(ctx2);
          if_block0.c();
          if_block0.m(div4, null);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (current_block_type === (current_block_type = select_block_type_2(ctx2, dirty)) && if_block1) {
        if_block1.p(ctx2, dirty);
      } else {
        if_block1.d(1);
        if_block1 = current_block_type(ctx2);
        if (if_block1) {
          if_block1.c();
          if_block1.m(div6, null);
        }
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div8);
      }
      ctx[22](null);
      if (if_block0)
        if_block0.d();
      if_block1.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_else_block_3(ctx) {
  let projecttaskgrid;
  let current;
  projecttaskgrid = new ProjectTaskGrid_default({
    props: {
      app: (
        /*app*/
        ctx[1]
      ),
      fileManager: (
        /*fileManager*/
        ctx[2]
      ),
      projectId: (
        /*selectedProject*/
        ctx[4].id
      ),
      projectTasks: (
        /*projectTasks*/
        ctx[34]
      )
    }
  });
  return {
    c() {
      create_component(projecttaskgrid.$$.fragment);
    },
    m(target, anchor) {
      mount_component(projecttaskgrid, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const projecttaskgrid_changes = {};
      if (dirty[0] & /*app*/
      2)
        projecttaskgrid_changes.app = /*app*/
        ctx2[1];
      if (dirty[0] & /*fileManager*/
      4)
        projecttaskgrid_changes.fileManager = /*fileManager*/
        ctx2[2];
      if (dirty[0] & /*selectedProject*/
      16)
        projecttaskgrid_changes.projectId = /*selectedProject*/
        ctx2[4].id;
      if (dirty[0] & /*$tasksStore, selectedProject*/
      528)
        projecttaskgrid_changes.projectTasks = /*projectTasks*/
        ctx2[34];
      projecttaskgrid.$set(projecttaskgrid_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(projecttaskgrid.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(projecttaskgrid.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(projecttaskgrid, detaching);
    }
  };
}
function create_if_block_54(ctx) {
  let projecttaskboard;
  let current;
  projecttaskboard = new ProjectTaskBoard_default({
    props: {
      app: (
        /*app*/
        ctx[1]
      ),
      fileManager: (
        /*fileManager*/
        ctx[2]
      ),
      projectId: (
        /*selectedProject*/
        ctx[4].id
      ),
      projectTasks: (
        /*projectTasks*/
        ctx[34]
      )
    }
  });
  return {
    c() {
      create_component(projecttaskboard.$$.fragment);
    },
    m(target, anchor) {
      mount_component(projecttaskboard, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const projecttaskboard_changes = {};
      if (dirty[0] & /*app*/
      2)
        projecttaskboard_changes.app = /*app*/
        ctx2[1];
      if (dirty[0] & /*fileManager*/
      4)
        projecttaskboard_changes.fileManager = /*fileManager*/
        ctx2[2];
      if (dirty[0] & /*selectedProject*/
      16)
        projecttaskboard_changes.projectId = /*selectedProject*/
        ctx2[4].id;
      if (dirty[0] & /*$tasksStore, selectedProject*/
      528)
        projecttaskboard_changes.projectTasks = /*projectTasks*/
        ctx2[34];
      projecttaskboard.$set(projecttaskboard_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(projecttaskboard.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(projecttaskboard.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(projecttaskboard, detaching);
    }
  };
}
function create_if_block_36(ctx) {
  let div;
  let button0;
  let t1;
  let button1;
  let t3;
  let button2;
  let mounted;
  let dispose;
  return {
    c() {
      div = element("div");
      button0 = element("button");
      button0.textContent = "\u{1F4C4} Markdown Note";
      t1 = space();
      button1 = element("button");
      button1.textContent = "\u{1F5FA}\uFE0F Canvas";
      t3 = space();
      button2 = element("button");
      button2.textContent = "\u{1F3A8} Excalidraw";
      attr(div, "class", "pos-fb-dropdown");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, button0);
      append(div, t1);
      append(div, button1);
      append(div, t3);
      append(div, button2);
      if (!mounted) {
        dispose = [
          listen(
            button0,
            "click",
            /*click_handler_6*/
            ctx[24]
          ),
          listen(
            button1,
            "click",
            /*click_handler_7*/
            ctx[25]
          ),
          listen(
            button2,
            "click",
            /*click_handler_8*/
            ctx[26]
          )
        ];
        mounted = true;
      }
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_else_block_1(ctx) {
  let each_1_anchor;
  let each_value = ensure_array_like(
    /*projectFiles*/
    ctx[6]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block7(get_each_context7(ctx, each_value, i));
  }
  return {
    c() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
    },
    m(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(target, anchor);
        }
      }
      insert(target, each_1_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*projectFiles, openFile*/
      2112) {
        each_value = ensure_array_like(
          /*projectFiles*/
          ctx2[6]
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context7(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block7(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
    },
    d(detaching) {
      if (detaching) {
        detach(each_1_anchor);
      }
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_if_block_27(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.textContent = 'No files yet. Click "+ New" to create one.';
      attr(div, "class", "pos-fb-empty");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_each_block7(ctx) {
  let button;
  let span0;
  let t0_value = fileIcon(
    /*f*/
    ctx[31].extension
  ) + "";
  let t0;
  let t1;
  let div;
  let span1;
  let t2_value = (
    /*f*/
    ctx[31].name + ""
  );
  let t2;
  let t3;
  let span2;
  let t4_value = formatFileSize(
    /*f*/
    ctx[31].size
  ) + "";
  let t4;
  let t5;
  let t6_value = formatFileDate(
    /*f*/
    ctx[31].mtime
  ) + "";
  let t6;
  let t7;
  let button_title_value;
  let mounted;
  let dispose;
  function click_handler_9() {
    return (
      /*click_handler_9*/
      ctx[27](
        /*f*/
        ctx[31]
      )
    );
  }
  return {
    c() {
      button = element("button");
      span0 = element("span");
      t0 = text(t0_value);
      t1 = space();
      div = element("div");
      span1 = element("span");
      t2 = text(t2_value);
      t3 = space();
      span2 = element("span");
      t4 = text(t4_value);
      t5 = text(" \xB7 ");
      t6 = text(t6_value);
      t7 = space();
      attr(span0, "class", "pos-fb-icon");
      attr(span1, "class", "pos-fb-name");
      attr(span2, "class", "pos-fb-meta");
      attr(div, "class", "pos-fb-info");
      attr(button, "class", "pos-fb-item");
      attr(button, "title", button_title_value = /*f*/
      ctx[31].path);
    },
    m(target, anchor) {
      insert(target, button, anchor);
      append(button, span0);
      append(span0, t0);
      append(button, t1);
      append(button, div);
      append(div, span1);
      append(span1, t2);
      append(div, t3);
      append(div, span2);
      append(span2, t4);
      append(span2, t5);
      append(span2, t6);
      append(button, t7);
      if (!mounted) {
        dispose = listen(button, "click", click_handler_9);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & /*projectFiles*/
      64 && t0_value !== (t0_value = fileIcon(
        /*f*/
        ctx[31].extension
      ) + ""))
        set_data(t0, t0_value);
      if (dirty[0] & /*projectFiles*/
      64 && t2_value !== (t2_value = /*f*/
      ctx[31].name + ""))
        set_data(t2, t2_value);
      if (dirty[0] & /*projectFiles*/
      64 && t4_value !== (t4_value = formatFileSize(
        /*f*/
        ctx[31].size
      ) + ""))
        set_data(t4, t4_value);
      if (dirty[0] & /*projectFiles*/
      64 && t6_value !== (t6_value = formatFileDate(
        /*f*/
        ctx[31].mtime
      ) + ""))
        set_data(t6, t6_value);
      if (dirty[0] & /*projectFiles*/
      64 && button_title_value !== (button_title_value = /*f*/
      ctx[31].path)) {
        attr(button, "title", button_title_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(button);
      }
      mounted = false;
      dispose();
    }
  };
}
function create_fragment8(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block7, create_else_block4];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (!/*selectedProject*/
    ctx2[4])
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx, [-1, -1]);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2, dirty);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if_blocks[current_block_type_index].d(detaching);
    }
  };
}
function fileIcon(ext) {
  switch (ext) {
    case "md":
      return "\u{1F4C4}";
    case "canvas":
      return "\u{1F5FA}\uFE0F";
    case "excalidraw":
      return "\u{1F3A8}";
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
    case "webp":
      return "\u{1F5BC}\uFE0F";
    case "pdf":
      return "\u{1F4D5}";
    default:
      return "\u{1F4CE}";
  }
}
function formatFileSize(bytes) {
  if (bytes < 1024)
    return `${bytes} B`;
  if (bytes < 1048576)
    return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}
function formatFileDate(mtime) {
  return new Date(mtime).toLocaleDateString("default", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function instance8($$self, $$props, $$invalidate) {
  let activeProjects;
  let $projectsStore;
  let $tasksStore;
  component_subscribe($$self, projectsStore, ($$value) => $$invalidate(15, $projectsStore = $$value));
  component_subscribe($$self, tasksStore, ($$value) => $$invalidate(9, $tasksStore = $$value));
  let { app } = $$props;
  let { fileManager } = $$props;
  let { plugin } = $$props;
  let { selectedProjectId = null } = $$props;
  let selectedProject = null;
  let projectContent = "";
  let previewEl;
  let projectFiles = [];
  let showNewFileMenu = false;
  let projectTab = "notes";
  async function loadProjectContent(id) {
    $$invalidate(13, projectContent = await fileManager.getProjectContent(id));
  }
  function refreshProjectFiles(id) {
    $$invalidate(6, projectFiles = fileManager.getProjectFiles(id));
  }
  function handleOpenNoteNatively() {
    if (!selectedProject)
      return;
    const file = fileManager.getProjectNoteFile(selectedProject.id);
    if (file) {
      app.workspace.getLeaf("tab").openFile(file);
    }
  }
  function openFile(filePath) {
    const file = app.vault.getAbstractFileByPath(filePath);
    if (file instanceof import_obsidian7.TFile) {
      app.workspace.getLeaf("tab").openFile(file);
    }
  }
  function getAvailableFilename(baseName, extension) {
    const existingNames = projectFiles.map((f) => f.name);
    let filename = `${baseName}${extension}`;
    let counter = 1;
    while (existingNames.includes(filename)) {
      filename = `${baseName} ${counter}${extension}`;
      counter++;
    }
    return filename;
  }
  async function createNewFile(type) {
    if (!selectedProject)
      return;
    $$invalidate(7, showNewFileMenu = false);
    let filename;
    let content;
    switch (type) {
      case "md":
        filename = getAvailableFilename("Untitled Note", ".md");
        content = `# New Note

Created in project: ${selectedProject.name}
`;
        break;
      case "canvas":
        filename = getAvailableFilename("Untitled Canvas", ".canvas");
        content = '{"nodes":[],"edges":[]}';
        break;
      case "excalidraw":
        filename = getAvailableFilename("Untitled Drawing", ".excalidraw.md");
        content = `---
excalidraw-plugin: parsed
tags: [excalidraw]
---

==\u26A0  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. \u26A0==

# Drawing

\`\`\`json
{"type":"excalidraw","version":2,"source":"","elements":[],"appState":{"gridSize":null,"viewBackgroundColor":"#ffffff"},"files":{}}
\`\`\`
`;
        break;
    }
    try {
      const file = await fileManager.createProjectFile(selectedProject.id, filename, content);
      refreshProjectFiles(selectedProject.id);
      app.workspace.getLeaf("tab").openFile(file);
      new import_obsidian7.Notice(`Created ${filename}`);
    } catch (e) {
      new import_obsidian7.Notice("Failed to create file: " + e.message);
    }
  }
  const func2 = (id, m) => {
    $$invalidate(0, selectedProjectId = id);
  };
  const click_handler = () => $$invalidate(0, selectedProjectId = null);
  const click_handler_1 = () => $$invalidate(8, projectTab = "notes");
  const click_handler_2 = () => $$invalidate(8, projectTab = "board");
  const click_handler_3 = () => $$invalidate(8, projectTab = "grid");
  const click_handler_4 = () => $$invalidate(8, projectTab = "deadlines");
  function div1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      previewEl = $$value;
      $$invalidate(5, previewEl);
    });
  }
  const click_handler_5 = () => $$invalidate(7, showNewFileMenu = !showNewFileMenu);
  const click_handler_6 = () => createNewFile("md");
  const click_handler_7 = () => createNewFile("canvas");
  const click_handler_8 = () => createNewFile("excalidraw");
  const click_handler_9 = (f) => openFile(f.path);
  $$self.$$set = ($$props2) => {
    if ("app" in $$props2)
      $$invalidate(1, app = $$props2.app);
    if ("fileManager" in $$props2)
      $$invalidate(2, fileManager = $$props2.fileManager);
    if ("plugin" in $$props2)
      $$invalidate(3, plugin = $$props2.plugin);
    if ("selectedProjectId" in $$props2)
      $$invalidate(0, selectedProjectId = $$props2.selectedProjectId);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*$projectsStore*/
    32768) {
      $:
        $$invalidate(14, activeProjects = $projectsStore.filter((p) => p.status === "active"));
    }
    if ($$self.$$.dirty[0] & /*selectedProjectId, activeProjects*/
    16385) {
      $: {
        if (selectedProjectId) {
          const proj = activeProjects.find((p) => p.id === selectedProjectId);
          if (proj) {
            $$invalidate(4, selectedProject = proj);
            loadProjectContent(selectedProjectId);
            refreshProjectFiles(selectedProjectId);
          } else {
            $$invalidate(4, selectedProject = null);
            $$invalidate(13, projectContent = "");
            $$invalidate(6, projectFiles = []);
          }
        } else {
          $$invalidate(4, selectedProject = null);
          $$invalidate(13, projectContent = "");
          $$invalidate(8, projectTab = "notes");
          $$invalidate(6, projectFiles = []);
        }
      }
    }
    if ($$self.$$.dirty[0] & /*previewEl, projectContent, selectedProject, fileManager, plugin*/
    8252) {
      $: {
        if (previewEl && projectContent !== void 0 && selectedProject) {
          previewEl.empty();
          import_obsidian7.MarkdownRenderer.renderMarkdown(projectContent, previewEl, fileManager.resolveProjectNotePath(selectedProject.id) || `projects/${selectedProject.id}.md`, plugin);
        }
      }
    }
  };
  return [
    selectedProjectId,
    app,
    fileManager,
    plugin,
    selectedProject,
    previewEl,
    projectFiles,
    showNewFileMenu,
    projectTab,
    $tasksStore,
    handleOpenNoteNatively,
    openFile,
    createNewFile,
    projectContent,
    activeProjects,
    $projectsStore,
    func2,
    click_handler,
    click_handler_1,
    click_handler_2,
    click_handler_3,
    click_handler_4,
    div1_binding,
    click_handler_5,
    click_handler_6,
    click_handler_7,
    click_handler_8,
    click_handler_9
  ];
}
var ProjectsView = class extends SvelteComponent {
  constructor(options) {
    super();
    init(
      this,
      options,
      instance8,
      create_fragment8,
      safe_not_equal,
      {
        app: 1,
        fileManager: 2,
        plugin: 3,
        selectedProjectId: 0
      },
      null,
      [-1, -1]
    );
  }
};
var ProjectsView_default = ProjectsView;

// src/main.ts
var VIEW_TYPE = "project-os-view";
var WORKSPACE_VIEW_TYPE = "project-os-workspace-view";
var ProjectOSView = class extends import_obsidian8.ItemView {
  constructor(leaf, fileManager, plugin) {
    super(leaf);
    __publicField(this, "component", null);
    __publicField(this, "fileManager");
    __publicField(this, "plugin");
    this.fileManager = fileManager;
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE;
  }
  getDisplayText() {
    return "Project OS";
  }
  getIcon() {
    return "layout-dashboard";
  }
  async onOpen() {
    this.component = new App_default({
      target: this.contentEl,
      props: {
        app: this.app,
        fileManager: this.fileManager,
        plugin: this.plugin
      }
    });
  }
  async onClose() {
    if (this.component) {
      this.component.$destroy();
    }
  }
};
var ProjectWorkspaceView = class extends import_obsidian8.ItemView {
  constructor(leaf, fileManager, plugin) {
    super(leaf);
    __publicField(this, "component", null);
    __publicField(this, "fileManager");
    __publicField(this, "plugin");
    __publicField(this, "projectId", null);
    this.fileManager = fileManager;
    this.plugin = plugin;
  }
  getViewType() {
    return WORKSPACE_VIEW_TYPE;
  }
  getDisplayText() {
    if (this.projectId) {
      const proj = get_store_value(projectsStore).find((p) => p.id === this.projectId);
      if (proj)
        return `${proj.name} - Project Workspace`;
    }
    return "Project Workspace";
  }
  getIcon() {
    return "folder-kanban";
  }
  async setState(state, result) {
    this.projectId = state.projectId || null;
    this.leaf.updateHeader();
    if (this.component) {
      this.component.$set({ selectedProjectId: this.projectId });
    } else {
      this.component = new ProjectsView_default({
        target: this.contentEl,
        props: {
          app: this.app,
          fileManager: this.fileManager,
          plugin: this.plugin,
          selectedProjectId: this.projectId,
          isFullPage: true
        }
      });
    }
    await super.setState(state, result);
  }
  async onClose() {
    if (this.component) {
      this.component.$destroy();
    }
  }
};
var ProjectOSPlugin = class extends import_obsidian8.Plugin {
  constructor() {
    super(...arguments);
    __publicField(this, "fileManager");
  }
  async onload() {
    console.log("Initializing Project OS...");
    new import_obsidian8.Notice("Initializing Project OS...");
    this.fileManager = new FileManager(this.app);
    this.app.workspace.onLayoutReady(async () => {
      try {
        await this.fileManager.initialize();
        console.log("Project OS: data initialized successfully!");
      } catch (e) {
        console.error("Project OS: failed to initialize data", e);
        new import_obsidian8.Notice("Project OS failed to initialize: " + e.message);
      }
    });
    this.registerView(
      VIEW_TYPE,
      (leaf) => new ProjectOSView(leaf, this.fileManager, this)
    );
    this.registerView(
      WORKSPACE_VIEW_TYPE,
      (leaf) => new ProjectWorkspaceView(leaf, this.fileManager, this)
    );
    this.addRibbonIcon("layout-dashboard", "Open Project OS", () => {
      this.activateView();
    });
    this.addCommand({
      id: "open-project-os",
      name: "Open Project OS Dashboard",
      callback: () => this.activateView()
    });
    this.registerEvent(
      this.app.metadataCache.on("changed", async (file) => {
        if (file.path.startsWith("tasks/") || file.path.startsWith("projects/")) {
          await this.fileManager.loadAll();
        }
      })
    );
    this.registerEvent(
      this.app.vault.on("create", async (file) => {
        if (file.path.startsWith("tasks/") || file.path.startsWith("projects/")) {
          await this.fileManager.loadAll();
        }
      })
    );
    this.registerEvent(
      this.app.vault.on("delete", async (file) => {
        if (file.path.startsWith("tasks/") || file.path.startsWith("projects/")) {
          await this.fileManager.loadAll();
        }
      })
    );
  }
  async activateView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE)[0];
    if (!leaf) {
      leaf = workspace.getRightLeaf(false) || workspace.getLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }
    workspace.revealLeaf(leaf);
  }
  async activateWorkspaceView(projectId) {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(WORKSPACE_VIEW_TYPE).find((l) => {
      const view = l.view;
      return view.projectId === projectId;
    });
    if (!leaf) {
      leaf = workspace.getLeaf("tab");
      await leaf.setViewState({
        type: WORKSPACE_VIEW_TYPE,
        active: true,
        state: { projectId }
      });
    }
    workspace.revealLeaf(leaf);
  }
};
