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
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block7, next, get_context) {
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
      block = create_each_block7(key, child_ctx);
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
function init(component, options, instance8, create_fragment8, not_equal, props, append_styles = null, dirty = [-1]) {
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
  $$.ctx = instance8 ? instance8(component, options.props || {}, (i, ret, ...rest) => {
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
  $$.fragment = create_fragment8 ? create_fragment8($$.ctx) : false;
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
  async loadAll() {
    const projects = [];
    const tasks = [];
    const projectFiles = this.app.vault.getMarkdownFiles().filter((f) => f.path.startsWith(PROJECTS_FOLDER + "/"));
    for (const f of projectFiles) {
      const c = await this.app.vault.read(f);
      const fm = parseFrontmatter(c);
      if (fm.type !== "project")
        continue;
      projects.push({
        id: f.basename,
        name: fm.name || f.basename,
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
        deadline
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
      deadline: fm.deadline || null,
      description: data.description || "",
      name: fm.name
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
    const file = this.app.vault.getAbstractFileByPath(`${PROJECTS_FOLDER}/${id}.md`);
    if (!(file instanceof import_obsidian.TFile))
      return "";
    const c = await this.app.vault.read(file);
    return c.replace(/^---\r?\n[\s\S]*?\r?\n---/, "").trim();
  }
  async saveProjectContent(id, newBody) {
    const file = this.app.vault.getAbstractFileByPath(`${PROJECTS_FOLDER}/${id}.md`);
    if (!(file instanceof import_obsidian.TFile))
      return;
    const c = await this.app.vault.read(file);
    const fm = parseFrontmatter(c);
    const serialized = serializeFrontmatter(fm) + "\n" + newBody;
    await this.app.vault.modify(file, serialized);
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
function deadlineHue(remainingMs) {
  if (remainingMs < 0)
    return "hsl(300, 60%, 85%)";
  const days = remainingMs / 864e5;
  if (days > 30)
    return "hsl(210, 60%, 85%)";
  if (days >= 7)
    return "hsl(180, 60%, 85%)";
  if (days >= 3)
    return "hsl(60, 70%, 85%)";
  if (days >= 1)
    return "hsl(30, 90%, 80%)";
  return "hsl(0, 90%, 80%)";
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

// src/ui/views/AgingView.svelte
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[23] = list[i];
  const constants_0 = (
    /*tasks*/
    child_ctx[4].filter(function func(...args) {
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
        const content = "---\n" + Object.entries(fm).map(([k, v]) => `${k}: ${v}`).join("\n") + "\n---\n";
        await app.vault.create(`projects/${id}.md`, content);
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
  const func = (p, t) => t.project === p.id;
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
    func
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
  child_ctx[71] = list[i];
  child_ctx[73] = i;
  return child_ctx;
}
function get_each_context_1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[71] = list[i];
  child_ctx[73] = i;
  const constants_0 = (
    /*timeline*/
    child_ctx[6].find(function func(...args) {
      return (
        /*func*/
        ctx[54](
          /*task*/
          child_ctx[71],
          ...args
        )
      );
    })
  );
  child_ctx[74] = constants_0;
  return child_ctx;
}
function get_each_context_2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[71] = list[i];
  child_ctx[73] = i;
  return child_ctx;
}
function create_if_block_12(ctx) {
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
function create_if_block_11(ctx) {
  let div;
  let t_value = (
    /*task*/
    ctx[71].description + ""
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
      16384 && t_value !== (t_value = /*task*/
      ctx2[71].description + ""))
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
  let div2;
  let div0;
  let t1_value = (
    /*task*/
    ctx[71].name + ""
  );
  let t1;
  let t2;
  let t3;
  let div1;
  let button0;
  let t5;
  let button1;
  let mounted;
  let dispose;
  let if_block0 = (
    /*dragOverStatus*/
    ctx[10] === "backlog" && /*dragOverIndex*/
    ctx[11] === /*i*/
    ctx[73] && create_if_block_12(ctx)
  );
  function click_handler_3() {
    return (
      /*click_handler_3*/
      ctx[40](
        /*task*/
        ctx[71]
      )
    );
  }
  let if_block1 = (
    /*task*/
    ctx[71].description && create_if_block_11(ctx)
  );
  function click_handler_4() {
    return (
      /*click_handler_4*/
      ctx[41](
        /*task*/
        ctx[71]
      )
    );
  }
  function click_handler_5() {
    return (
      /*click_handler_5*/
      ctx[42](
        /*task*/
        ctx[71]
      )
    );
  }
  function dragstart_handler(...args) {
    return (
      /*dragstart_handler*/
      ctx[43](
        /*task*/
        ctx[71],
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
      div2 = element("div");
      div0 = element("div");
      t1 = text(t1_value);
      t2 = space();
      if (if_block1)
        if_block1.c();
      t3 = space();
      div1 = element("div");
      button0 = element("button");
      button0.textContent = "Edit";
      t5 = space();
      button1 = element("button");
      button1.textContent = "Delete";
      attr(div0, "class", "pos-card-name");
      attr(button1, "class", "pos-del");
      attr(div1, "class", "pos-card-acts");
      attr(div2, "class", "pos-card");
      attr(div2, "draggable", "true");
      toggle_class(
        div2,
        "pos-dragging-source",
        /*dragId*/
        ctx[9] === /*task*/
        ctx[71].id
      );
      this.first = first;
    },
    m(target, anchor) {
      insert(target, first, anchor);
      if (if_block0)
        if_block0.m(target, anchor);
      insert(target, t0, anchor);
      insert(target, div2, anchor);
      append(div2, div0);
      append(div0, t1);
      append(div2, t2);
      if (if_block1)
        if_block1.m(div2, null);
      append(div2, t3);
      append(div2, div1);
      append(div1, button0);
      append(div1, t5);
      append(div1, button1);
      if (!mounted) {
        dispose = [
          listen(div0, "click", click_handler_3),
          listen(button0, "click", click_handler_4),
          listen(button1, "click", click_handler_5),
          listen(div2, "dragstart", dragstart_handler)
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
        ctx[73]
      ) {
        if (if_block0) {
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
      16384 && t1_value !== (t1_value = /*task*/
      ctx[71].name + ""))
        set_data(t1, t1_value);
      if (
        /*task*/
        ctx[71].description
      ) {
        if (if_block1) {
          if_block1.p(ctx, dirty);
        } else {
          if_block1 = create_if_block_11(ctx);
          if_block1.c();
          if_block1.m(div2, t3);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (dirty[0] & /*dragId, backlog*/
      16896) {
        toggle_class(
          div2,
          "pos-dragging-source",
          /*dragId*/
          ctx[9] === /*task*/
          ctx[71].id
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(first);
        detach(t0);
        detach(div2);
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
function create_if_block_9(ctx) {
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
function create_if_block_8(ctx) {
  let div;
  let t_value = (
    /*task*/
    ctx[71].description + ""
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
      ctx2[71].description + ""))
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
    ctx[71].fixedDuration + ""
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
      ctx2[71].fixedDuration + ""))
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
    ctx[74].endTime
  ) + "";
  let t0;
  let t1;
  let t2_value = fmtDur(Math.round(
    /*ti*/
    ctx[74].calculatedDuration
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
        ctx2[74].endTime
      ) + ""))
        set_data(t0, t0_value);
      if (dirty[0] & /*timeline, running*/
      96 && t2_value !== (t2_value = fmtDur(Math.round(
        /*ti*/
        ctx2[74].calculatedDuration
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
        ctx[71],
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
      ctx[71].fixedDuration || 30;
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (!mounted) {
        dispose = [
          listen(input, "click", stop_propagation(
            /*click_handler_1*/
            ctx[32]
          )),
          listen(input, "keydown", stop_propagation(
            /*keydown_handler*/
            ctx[33]
          )),
          listen(input, "keypress", stop_propagation(
            /*keypress_handler*/
            ctx[34]
          )),
          listen(input, "keyup", stop_propagation(
            /*keyup_handler*/
            ctx[35]
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
      ctx[71].fixedDuration || 30) && input.value !== input_value_value) {
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
  let div3;
  let div0;
  let t1_value = (
    /*task*/
    ctx[71].name + ""
  );
  let t1;
  let t2;
  let t3;
  let div1;
  let t4;
  let t5;
  let div2;
  let span1;
  let button0;
  let t7;
  let span0;
  let t8_value = (
    /*task*/
    ctx[71].weight + ""
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
  let t17;
  let button3;
  let mounted;
  let dispose;
  let if_block0 = (
    /*dragOverStatus*/
    ctx[10] === "running" && /*dragOverIndex*/
    ctx[11] === /*i*/
    ctx[73] && create_if_block_9(ctx)
  );
  function click_handler_6() {
    return (
      /*click_handler_6*/
      ctx[46](
        /*task*/
        ctx[71]
      )
    );
  }
  let if_block1 = (
    /*task*/
    ctx[71].description && create_if_block_8(ctx)
  );
  let if_block2 = (
    /*task*/
    ctx[71].isFixedDuration && /*task*/
    ctx[71].fixedDuration && create_if_block_7(ctx)
  );
  let if_block3 = (
    /*ti*/
    ctx[74] && create_if_block_6(ctx)
  );
  function click_handler_7() {
    return (
      /*click_handler_7*/
      ctx[47](
        /*task*/
        ctx[71]
      )
    );
  }
  function click_handler_8() {
    return (
      /*click_handler_8*/
      ctx[48](
        /*task*/
        ctx[71]
      )
    );
  }
  function change_handler(...args) {
    return (
      /*change_handler*/
      ctx[49](
        /*task*/
        ctx[71],
        ...args
      )
    );
  }
  let if_block4 = (
    /*task*/
    ctx[71].isFixedDuration && create_if_block_5(ctx)
  );
  function click_handler_9() {
    return (
      /*click_handler_9*/
      ctx[51](
        /*task*/
        ctx[71]
      )
    );
  }
  function click_handler_10() {
    return (
      /*click_handler_10*/
      ctx[52](
        /*task*/
        ctx[71]
      )
    );
  }
  function dragstart_handler_1(...args) {
    return (
      /*dragstart_handler_1*/
      ctx[53](
        /*task*/
        ctx[71],
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
      div2 = element("div");
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
      button2.textContent = "Edit";
      t17 = space();
      button3 = element("button");
      button3.textContent = "Delete";
      attr(div0, "class", "pos-card-name");
      attr(div1, "class", "pos-card-meta");
      attr(span1, "class", "pos-wg");
      attr(input, "type", "checkbox");
      input.checked = input_checked_value = /*task*/
      ctx[71].isFixedDuration;
      attr(label, "class", "pos-fixed");
      attr(button3, "class", "pos-del");
      attr(div2, "class", "pos-card-acts");
      attr(div3, "class", "pos-card");
      set_style(
        div3,
        "height",
        /*taskHeights*/
        ctx[13][
          /*task*/
          ctx[71].id
        ] ? (
          /*taskHeights*/
          ctx[13][
            /*task*/
            ctx[71].id
          ] + "px"
        ) : "auto"
      );
      attr(div3, "draggable", "true");
      toggle_class(
        div3,
        "pos-dragging-source",
        /*dragId*/
        ctx[9] === /*task*/
        ctx[71].id
      );
      this.first = first;
    },
    m(target, anchor) {
      insert(target, first, anchor);
      if (if_block0)
        if_block0.m(target, anchor);
      insert(target, t0, anchor);
      insert(target, div3, anchor);
      append(div3, div0);
      append(div0, t1);
      append(div3, t2);
      if (if_block1)
        if_block1.m(div3, null);
      append(div3, t3);
      append(div3, div1);
      if (if_block2)
        if_block2.m(div1, null);
      append(div1, t4);
      if (if_block3)
        if_block3.m(div1, null);
      append(div3, t5);
      append(div3, div2);
      append(div2, span1);
      append(span1, button0);
      append(span1, t7);
      append(span1, span0);
      append(span0, t8);
      append(span1, t9);
      append(span1, button1);
      append(div2, t11);
      append(div2, label);
      append(label, input);
      append(label, t12);
      append(label, span2);
      append(div2, t14);
      if (if_block4)
        if_block4.m(div2, null);
      append(div2, t15);
      append(div2, button2);
      append(div2, t17);
      append(div2, button3);
      if (!mounted) {
        dispose = [
          listen(div0, "click", click_handler_6),
          listen(button0, "click", click_handler_7),
          listen(button1, "click", click_handler_8),
          listen(input, "change", change_handler),
          listen(label, "click", stop_propagation(
            /*click_handler*/
            ctx[36]
          )),
          listen(button2, "click", click_handler_9),
          listen(button3, "click", click_handler_10),
          listen(div3, "dragstart", dragstart_handler_1)
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
        ctx[73]
      ) {
        if (if_block0) {
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
      ctx[71].name + ""))
        set_data(t1, t1_value);
      if (
        /*task*/
        ctx[71].description
      ) {
        if (if_block1) {
          if_block1.p(ctx, dirty);
        } else {
          if_block1 = create_if_block_8(ctx);
          if_block1.c();
          if_block1.m(div3, t3);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (
        /*task*/
        ctx[71].isFixedDuration && /*task*/
        ctx[71].fixedDuration
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
        ctx[74]
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
      ctx[71].weight + ""))
        set_data(t8, t8_value);
      if (dirty[0] & /*running*/
      32 && input_checked_value !== (input_checked_value = /*task*/
      ctx[71].isFixedDuration)) {
        input.checked = input_checked_value;
      }
      if (
        /*task*/
        ctx[71].isFixedDuration
      ) {
        if (if_block4) {
          if_block4.p(ctx, dirty);
        } else {
          if_block4 = create_if_block_5(ctx);
          if_block4.c();
          if_block4.m(div2, t15);
        }
      } else if (if_block4) {
        if_block4.d(1);
        if_block4 = null;
      }
      if (dirty[0] & /*taskHeights, running*/
      8224) {
        set_style(
          div3,
          "height",
          /*taskHeights*/
          ctx[13][
            /*task*/
            ctx[71].id
          ] ? (
            /*taskHeights*/
            ctx[13][
              /*task*/
              ctx[71].id
            ] + "px"
          ) : "auto"
        );
      }
      if (dirty[0] & /*dragId, running*/
      544) {
        toggle_class(
          div3,
          "pos-dragging-source",
          /*dragId*/
          ctx[9] === /*task*/
          ctx[71].id
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
function create_each_block2(key_1, ctx) {
  let first;
  let t0;
  let div2;
  let div0;
  let t1_value = (
    /*task*/
    ctx[71].name + ""
  );
  let t1;
  let t2;
  let div1;
  let button0;
  let t4;
  let button1;
  let mounted;
  let dispose;
  let if_block = (
    /*dragOverStatus*/
    ctx[10] === "review" && /*dragOverIndex*/
    ctx[11] === /*i*/
    ctx[73] && create_if_block_22(ctx)
  );
  function click_handler_11() {
    return (
      /*click_handler_11*/
      ctx[58](
        /*task*/
        ctx[71]
      )
    );
  }
  function click_handler_12() {
    return (
      /*click_handler_12*/
      ctx[59](
        /*task*/
        ctx[71]
      )
    );
  }
  function click_handler_13() {
    return (
      /*click_handler_13*/
      ctx[60](
        /*task*/
        ctx[71]
      )
    );
  }
  function dragstart_handler_2(...args) {
    return (
      /*dragstart_handler_2*/
      ctx[61](
        /*task*/
        ctx[71],
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
      div2 = element("div");
      div0 = element("div");
      t1 = text(t1_value);
      t2 = space();
      div1 = element("div");
      button0 = element("button");
      button0.textContent = "Edit";
      t4 = space();
      button1 = element("button");
      button1.textContent = "Delete";
      attr(div0, "class", "pos-card-name");
      attr(button1, "class", "pos-del");
      attr(div1, "class", "pos-card-acts");
      attr(div2, "class", "pos-card pos-completed");
      attr(div2, "draggable", "true");
      toggle_class(
        div2,
        "pos-dragging-source",
        /*dragId*/
        ctx[9] === /*task*/
        ctx[71].id
      );
      this.first = first;
    },
    m(target, anchor) {
      insert(target, first, anchor);
      if (if_block)
        if_block.m(target, anchor);
      insert(target, t0, anchor);
      insert(target, div2, anchor);
      append(div2, div0);
      append(div0, t1);
      append(div2, t2);
      append(div2, div1);
      append(div1, button0);
      append(div1, t4);
      append(div1, button1);
      if (!mounted) {
        dispose = [
          listen(div0, "click", click_handler_11),
          listen(button0, "click", click_handler_12),
          listen(button1, "click", click_handler_13),
          listen(div2, "dragstart", dragstart_handler_2)
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
        ctx[73]
      ) {
        if (if_block) {
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
      4096 && t1_value !== (t1_value = /*task*/
      ctx[71].name + ""))
        set_data(t1, t1_value);
      if (dirty[0] & /*dragId, review*/
      4608) {
        toggle_class(
          div2,
          "pos-dragging-source",
          /*dragId*/
          ctx[9] === /*task*/
          ctx[71].id
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(first);
        detach(t0);
        detach(div2);
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
    ctx[14].length + ""
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
    ctx[12].length + ""
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
    ctx[14]
  );
  const get_key = (ctx2) => (
    /*task*/
    ctx2[71].id
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
    ctx[14].length && create_if_block_10(ctx)
  );
  let each_value_1 = ensure_array_like(
    /*running*/
    ctx[5]
  );
  const get_key_1 = (ctx2) => (
    /*task*/
    ctx2[71].id
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
    ctx[12]
  );
  const get_key_2 = (ctx2) => (
    /*task*/
    ctx2[71].id
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
    ctx[12].length && create_if_block_13(ctx)
  );
  let if_block4 = (
    /*review*/
    ctx[12].length > 0 && create_if_block2(ctx)
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
        ctx[55].call(div7)
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
        ctx[55].bind(div7)
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
            ctx[37]
          ),
          listen(
            input1,
            "input",
            /*input1_input_handler*/
            ctx[38]
          ),
          listen(
            button0,
            "click",
            /*click_handler_2*/
            ctx[39]
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
            ctx[15]
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
            ctx[56]
          ),
          listen(
            div7,
            "drop",
            /*drop_handler_1*/
            ctx[57]
          ),
          listen(
            div10,
            "dragover",
            /*dragover_handler_2*/
            ctx[62]
          ),
          listen(
            div10,
            "drop",
            /*drop_handler_2*/
            ctx[63]
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
      16384 && t7_value !== (t7_value = /*backlog*/
      ctx2[14].length + ""))
        set_data(t7, t7_value);
      if (dirty[0] & /*dragId, backlog, handleDragStart, deleteTask, editTask, openTaskFile, dragOverStatus, dragOverIndex*/
      18042368) {
        each_value_2 = ensure_array_like(
          /*backlog*/
          ctx2[14]
        );
        each_blocks_2 = update_keyed_each(each_blocks_2, dirty, get_key, 1, ctx2, each_value_2, each0_lookup, div3, destroy_block, create_each_block_2, t10, get_each_context_2);
      }
      if (
        /*dragOverStatus*/
        ctx2[10] === "backlog" && /*dragOverIndex*/
        ctx2[11] >= /*backlog*/
        ctx2[14].length
      ) {
        if (if_block0) {
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
      if (dirty[0] & /*taskHeights, running, dragId, handleDragStart, deleteTask, editTask, setFixed, toggleFixed, fileManager, timeline, openTaskFile, dragOverStatus, dragOverIndex*/
      18820705) {
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
      4096 && t22_value !== (t22_value = /*review*/
      ctx2[12].length + ""))
        set_data(t22, t22_value);
      if (dirty[0] & /*dragId, review, handleDragStart, deleteTask, editTask, openTaskFile, dragOverStatus, dragOverIndex*/
      18030080) {
        each_value = ensure_array_like(
          /*review*/
          ctx2[12]
        );
        each_blocks = update_keyed_each(each_blocks, dirty, get_key_2, 1, ctx2, each_value, each2_lookup, div9, destroy_block, create_each_block2, t25, get_each_context2);
      }
      if (
        /*dragOverStatus*/
        ctx2[10] === "review" && /*dragOverIndex*/
        ctx2[11] >= /*review*/
        ctx2[12].length
      ) {
        if (if_block3) {
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
        ctx2[12].length > 0
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
  component_subscribe($$self, tasksStore, ($$value) => $$invalidate(31, $tasksStore = $$value));
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
      $$invalidate(29, lockedTimeline = []);
    } else {
      const dl = /* @__PURE__ */ new Date(`${dDate}T${dTime}`);
      lockAt = (/* @__PURE__ */ new Date()).toISOString();
      lockDeadline = dl.toISOString();
      $$invalidate(29, lockedTimeline = calculateLiquidTimeline(running, /* @__PURE__ */ new Date(), dl));
      $$invalidate(3, isLocked = true);
      updateLockProgress();
    }
  }
  let dragId = null;
  let dragOverStatus = null;
  let dragOverIndex = -1;
  function handleDragStart(e, id) {
    $$invalidate(9, dragId = id);
    if (e.dataTransfer) {
      e.dataTransfer.setData("text/plain", id);
    }
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
    $$invalidate(10, dragOverStatus = status);
    const listEl = e.currentTarget.querySelector(".pos-list");
    if (!listEl)
      return;
    const cards = Array.from(listEl.querySelectorAll(".pos-card:not(.pos-dragging-source)"));
    let index = 0;
    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect();
      if (e.clientY < rect.top + rect.height / 2) {
        index = i;
        break;
      }
      index = i + 1;
    }
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
  const click_handler_3 = (task) => openTaskFile(task.id);
  const click_handler_4 = (task) => editTask(task);
  const click_handler_5 = (task) => deleteTask(task.id);
  const dragstart_handler = (task, e) => handleDragStart(e, task.id);
  const dragover_handler = (e) => handleDragOver(e, "backlog");
  const drop_handler = (e) => handleDrop(e, "backlog");
  const click_handler_6 = (task) => openTaskFile(task.id);
  const click_handler_7 = (task) => fileManager.updateTask(task.id, { weight: Math.max(1, task.weight - 1) });
  const click_handler_8 = (task) => fileManager.updateTask(task.id, { weight: task.weight + 1 });
  const change_handler = (task, e) => toggleFixed(task, e.currentTarget.checked);
  const change_handler_1 = (task, e) => setFixed(task, Number(e.currentTarget.value));
  const click_handler_9 = (task) => editTask(task);
  const click_handler_10 = (task) => deleteTask(task.id);
  const dragstart_handler_1 = (task, e) => handleDragStart(e, task.id);
  const func = (task, t) => t.id === task.id;
  function div7_elementresize_handler() {
    runningWrapperHeight = this.clientHeight;
    $$invalidate(4, runningWrapperHeight);
  }
  const dragover_handler_1 = (e) => handleDragOver(e, "running");
  const drop_handler_1 = (e) => handleDrop(e, "running");
  const click_handler_11 = (task) => openTaskFile(task.id);
  const click_handler_12 = (task) => editTask(task);
  const click_handler_13 = (task) => deleteTask(task.id);
  const dragstart_handler_2 = (task, e) => handleDragStart(e, task.id);
  const dragover_handler_2 = (e) => handleDragOver(e, "review");
  const drop_handler_2 = (e) => handleDrop(e, "review");
  $$self.$$set = ($$props2) => {
    if ("app" in $$props2)
      $$invalidate(27, app = $$props2.app);
    if ("fileManager" in $$props2)
      $$invalidate(0, fileManager = $$props2.fileManager);
    if ("projectId" in $$props2)
      $$invalidate(28, projectId = $$props2.projectId);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*projectId*/
    268435456 | $$self.$$.dirty[1] & /*$tasksStore*/
    1) {
      $:
        $$invalidate(30, projectTasks = getProjectTasks($tasksStore, projectId));
    }
    if ($$self.$$.dirty[0] & /*projectTasks*/
    1073741824) {
      $:
        $$invalidate(14, backlog = projectTasks.filter((t) => t.status === "backlog"));
    }
    if ($$self.$$.dirty[0] & /*projectTasks*/
    1073741824) {
      $:
        $$invalidate(5, running = projectTasks.filter((t) => t.status === "running"));
    }
    if ($$self.$$.dirty[0] & /*projectTasks*/
    1073741824) {
      $:
        $$invalidate(12, review = projectTasks.filter((t) => t.status === "review"));
    }
    if ($$self.$$.dirty[0] & /*isLocked, lockedTimeline, running, dDate, dTime*/
    536870958) {
      $:
        $$invalidate(6, timeline = isLocked ? lockedTimeline : calculateLiquidTimeline(running, /* @__PURE__ */ new Date(), /* @__PURE__ */ new Date(`${dDate}T${dTime}`)));
    }
    if ($$self.$$.dirty[0] & /*runningWrapperHeight, running, timeline*/
    112) {
      $:
        $$invalidate(13, taskHeights = (() => {
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
    review,
    taskHeights,
    backlog,
    createTask,
    editTask,
    openTaskFile,
    toggleFixed,
    setFixed,
    deleteTask,
    confirmRestoreAll,
    confirmDeleteAll,
    toggleLock,
    handleDragStart,
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
    click_handler_5,
    dragstart_handler,
    dragover_handler,
    drop_handler,
    click_handler_6,
    click_handler_7,
    click_handler_8,
    change_handler,
    change_handler_1,
    click_handler_9,
    click_handler_10,
    dragstart_handler_1,
    func,
    div7_elementresize_handler,
    dragover_handler_1,
    drop_handler_1,
    click_handler_11,
    click_handler_12,
    click_handler_13,
    dragstart_handler_2,
    dragover_handler_2,
    drop_handler_2
  ];
}
var ElasticView = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance2, create_fragment2, safe_not_equal, { app: 27, fileManager: 0, projectId: 28 }, null, [-1, -1, -1]);
  }
};
var ElasticView_default = ElasticView;

// src/ui/views/DeadlinesView.svelte
function get_each_context_4(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[38] = list[i];
  const constants_0 = new Date(
    /*task*/
    child_ctx[38].deadline || ""
  ).getTime() - /*now*/
  child_ctx[3];
  child_ctx[45] = constants_0;
  return child_ctx;
}
function get_each_context_22(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[38] = list[i];
  child_ctx[41] = i;
  const constants_0 = (
    /*getGanttPosition*/
    child_ctx[11](
      /*task*/
      child_ctx[38].createdAt,
      /*task*/
      child_ctx[38].deadline || ""
    )
  );
  child_ctx[39] = constants_0;
  const constants_1 = new Date(
    /*task*/
    child_ctx[38].deadline || ""
  ).getTime() - /*now*/
  child_ctx[3];
  child_ctx[35] = constants_1;
  return child_ctx;
}
function get_each_context_3(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[42] = list[i];
  return child_ctx;
}
function get_each_context3(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[30] = list[i];
  const constants_0 = (
    /*deadlinedTasks*/
    child_ctx[0].filter(function func(...args) {
      return (
        /*func*/
        ctx[26](
          /*cell*/
          child_ctx[30],
          ...args
        )
      );
    })
  );
  child_ctx[31] = constants_0;
  return child_ctx;
}
function get_each_context_12(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[34] = list[i];
  const constants_0 = new Date(
    /*t*/
    child_ctx[34].deadline || ""
  ).getTime() - /*now*/
  child_ctx[3];
  child_ctx[35] = constants_0;
  return child_ctx;
}
function create_if_block_62(ctx) {
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
      button0.textContent = "\u2190";
      t1 = space();
      span = element("span");
      t2 = text(
        /*monthName*/
        ctx[7]
      );
      t3 = space();
      t4 = text(
        /*year*/
        ctx[1]
      );
      t5 = space();
      button1 = element("button");
      button1.textContent = "\u2192";
      t7 = space();
      button2 = element("button");
      button2.textContent = "Today";
      attr(button0, "class", "pos-nav-btn");
      set_style(button0, "padding", "4px 8px");
      set_style(button0, "font-size", "0.82em");
      set_style(button0, "background", "var(--background-secondary)");
      set_style(button0, "border", "1px solid var(--background-modifier-border)");
      set_style(button0, "border-radius", "4px");
      set_style(button0, "cursor", "pointer");
      set_style(span, "font-weight", "700");
      set_style(span, "font-size", "0.9em");
      set_style(span, "min-width", "120px");
      set_style(span, "text-align", "center");
      set_style(span, "color", "var(--text-normal)");
      attr(button1, "class", "pos-nav-btn");
      set_style(button1, "padding", "4px 8px");
      set_style(button1, "font-size", "0.82em");
      set_style(button1, "background", "var(--background-secondary)");
      set_style(button1, "border", "1px solid var(--background-modifier-border)");
      set_style(button1, "border-radius", "4px");
      set_style(button1, "cursor", "pointer");
      attr(button2, "class", "pos-nav-btn");
      set_style(button2, "padding", "4px 10px");
      set_style(button2, "font-size", "0.82em");
      set_style(button2, "font-weight", "600");
      set_style(button2, "background", "var(--background-secondary)");
      set_style(button2, "border", "1px solid var(--background-modifier-border)");
      set_style(button2, "border-radius", "4px");
      set_style(button2, "cursor", "pointer");
      attr(div, "class", "pos-calendar-nav");
      set_style(div, "display", "flex");
      set_style(div, "align-items", "center");
      set_style(div, "gap", "8px");
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
            ctx[8]
          ),
          listen(
            button1,
            "click",
            /*nextMonth*/
            ctx[9]
          ),
          listen(
            button2,
            "click",
            /*goToToday*/
            ctx[10]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*monthName*/
      128)
        set_data(
          t2,
          /*monthName*/
          ctx2[7]
        );
      if (dirty[0] & /*year*/
      2)
        set_data(
          t4,
          /*year*/
          ctx2[1]
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
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let each_value_4 = ensure_array_like(
    /*countdownTasks*/
    ctx[4]
  );
  const get_key = (ctx2) => (
    /*task*/
    ctx2[38].id
  );
  for (let i = 0; i < each_value_4.length; i += 1) {
    let child_ctx = get_each_context_4(ctx, each_value_4, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block_4(key, child_ctx));
  }
  return {
    c() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div, "class", "pos-deadlines-list");
      set_style(div, "display", "flex");
      set_style(div, "flex-direction", "column");
      set_style(div, "gap", "8px");
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
      if (dirty[0] & /*countdownTasks, now, openTaskFile*/
      4120) {
        each_value_4 = ensure_array_like(
          /*countdownTasks*/
          ctx2[4]
        );
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value_4, each_1_lookup, div, destroy_block, create_each_block_4, null, get_each_context_4);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
    }
  };
}
function create_if_block_33(ctx) {
  let div4;
  let div3;
  let div0;
  let t0;
  let div2;
  let div1;
  let t1;
  let each_value_3 = ensure_array_like(
    /*timelineDates*/
    ctx[5]
  );
  let each_blocks_1 = [];
  for (let i = 0; i < each_value_3.length; i += 1) {
    each_blocks_1[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
  }
  let each_value_2 = ensure_array_like(
    /*deadlinedTasks*/
    ctx[0]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value_2.length; i += 1) {
    each_blocks[i] = create_each_block_22(get_each_context_22(ctx, each_value_2, i));
  }
  return {
    c() {
      div4 = element("div");
      div3 = element("div");
      div0 = element("div");
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].c();
      }
      t0 = space();
      div2 = element("div");
      div1 = element("div");
      t1 = space();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div0, "class", "pos-gantt-header");
      set_style(div0, "display", "grid");
      set_style(div0, "grid-template-columns", "repeat(14, 1fr)");
      set_style(div0, "border-bottom", "1px solid var(--background-modifier-border)");
      set_style(div0, "background", "var(--background-secondary)");
      set_style(div0, "padding", "10px 0");
      set_style(div0, "text-align", "center");
      set_style(div0, "font-weight", "700");
      set_style(div0, "font-size", "0.8em");
      set_style(div0, "color", "var(--text-muted)");
      attr(div1, "class", "pos-gantt-today-line");
      set_style(div1, "position", "absolute");
      set_style(div1, "top", "0");
      set_style(div1, "bottom", "0");
      set_style(div1, "left", "calc(100% / 14 * 2)");
      set_style(div1, "border-left", "2px dashed #E5484D");
      set_style(div1, "z-index", "5");
      set_style(div1, "pointer-events", "none");
      set_style(div1, "box-shadow", "0 0 4px rgba(229,72,77,0.2)");
      attr(div2, "class", "pos-gantt-rows");
      set_style(div2, "display", "flex");
      set_style(div2, "flex-direction", "column");
      set_style(div2, "position", "relative");
      set_style(div2, "min-height", "200px");
      attr(div3, "class", "pos-gantt-chart-container");
      set_style(div3, "min-width", "800px");
      set_style(div3, "display", "flex");
      set_style(div3, "flex-direction", "column");
      set_style(div3, "position", "relative");
      attr(div4, "class", "pos-gantt-scroll-wrapper");
      set_style(div4, "overflow-x", "auto");
      set_style(div4, "width", "100%");
      set_style(div4, "border", "1px solid var(--background-modifier-border)");
      set_style(div4, "border-radius", "8px");
      set_style(div4, "background", "var(--background-primary)");
    },
    m(target, anchor) {
      insert(target, div4, anchor);
      append(div4, div3);
      append(div3, div0);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        if (each_blocks_1[i]) {
          each_blocks_1[i].m(div0, null);
        }
      }
      append(div3, t0);
      append(div3, div2);
      append(div2, div1);
      append(div2, t1);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div2, null);
        }
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*timelineDates*/
      32) {
        each_value_3 = ensure_array_like(
          /*timelineDates*/
          ctx2[5]
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
      if (dirty[0] & /*getGanttPosition, deadlinedTasks, now, openTaskFile*/
      6153) {
        each_value_2 = ensure_array_like(
          /*deadlinedTasks*/
          ctx2[0]
        );
        let i;
        for (i = 0; i < each_value_2.length; i += 1) {
          const child_ctx = get_each_context_22(ctx2, each_value_2, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block_22(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(div2, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value_2.length;
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div4);
      }
      destroy_each(each_blocks_1, detaching);
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_if_block_14(ctx) {
  let div10;
  let div9;
  let div7;
  let t7;
  let div8;
  let each_value = ensure_array_like(
    /*gridCells*/
    ctx[6]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block3(get_each_context3(ctx, each_value, i));
  }
  return {
    c() {
      div10 = element("div");
      div9 = element("div");
      div7 = element("div");
      div7.innerHTML = `<div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>`;
      t7 = space();
      div8 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div7, "class", "pos-calendar-weekdays");
      set_style(div7, "display", "grid");
      set_style(div7, "grid-template-columns", "repeat(7, 1fr)");
      set_style(div7, "border-bottom", "1px solid var(--background-modifier-border)");
      set_style(div7, "background", "var(--background-secondary)");
      set_style(div7, "padding", "8px 0");
      set_style(div7, "text-align", "center");
      set_style(div7, "font-weight", "700");
      set_style(div7, "font-size", "0.82em");
      set_style(div7, "color", "var(--text-muted)");
      set_style(div7, "text-transform", "uppercase");
      attr(div8, "class", "pos-calendar-cells");
      set_style(div8, "display", "grid");
      set_style(div8, "grid-template-columns", "repeat(7, 1fr)");
      set_style(div8, "grid-auto-rows", "minmax(90px, 1fr)");
      set_style(div8, "background", "var(--background-modifier-border)");
      set_style(div8, "gap", "1px");
      attr(div9, "class", "pos-calendar-grid-container");
      set_style(div9, "min-width", "720px");
      set_style(div9, "display", "flex");
      set_style(div9, "flex-direction", "column");
      attr(div10, "class", "pos-calendar-scroll-wrapper");
      set_style(div10, "overflow-x", "auto");
      set_style(div10, "width", "100%");
      set_style(div10, "border", "1px solid var(--background-modifier-border)");
      set_style(div10, "border-radius", "8px");
      set_style(div10, "background", "var(--background-primary)");
    },
    m(target, anchor) {
      insert(target, div10, anchor);
      append(div10, div9);
      append(div9, div7);
      append(div9, t7);
      append(div9, div8);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div8, null);
        }
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*gridCells, deadlinedTasks, now, openTaskFile*/
      4169) {
        each_value = ensure_array_like(
          /*gridCells*/
          ctx2[6]
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context3(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block3(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(div8, null);
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
        detach(div10);
      }
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_if_block3(ctx) {
  let p;
  return {
    c() {
      p = element("p");
      p.textContent = "No active tasks with upcoming deadlines in this project.";
      attr(p, "class", "pos-empty");
    },
    m(target, anchor) {
      insert(target, p, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(p);
      }
    }
  };
}
function create_if_block_52(ctx) {
  let div;
  let t_1_value = (
    /*task*/
    ctx[38].description + ""
  );
  let t_1;
  return {
    c() {
      div = element("div");
      t_1 = text(t_1_value);
      set_style(div, "font-size", "0.8em");
      set_style(div, "color", "var(--text-muted)");
      set_style(div, "margin-top", "2px");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t_1);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*countdownTasks*/
      16 && t_1_value !== (t_1_value = /*task*/
      ctx2[38].description + ""))
        set_data(t_1, t_1_value);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_each_block_4(key_1, ctx) {
  let div3;
  let div1;
  let div0;
  let t0_value = (
    /*task*/
    ctx[38].name + ""
  );
  let t0;
  let t1;
  let t2;
  let div2;
  let t3_value = formatCountdown(
    /*diff*/
    ctx[45]
  ) + "";
  let t3;
  let t4;
  let mounted;
  let dispose;
  function click_handler_5() {
    return (
      /*click_handler_5*/
      ctx[28](
        /*task*/
        ctx[38]
      )
    );
  }
  let if_block = (
    /*task*/
    ctx[38].description && create_if_block_52(ctx)
  );
  return {
    key: key_1,
    first: null,
    c() {
      div3 = element("div");
      div1 = element("div");
      div0 = element("div");
      t0 = text(t0_value);
      t1 = space();
      if (if_block)
        if_block.c();
      t2 = space();
      div2 = element("div");
      t3 = text(t3_value);
      t4 = space();
      attr(div0, "class", "pos-card-name");
      set_style(div0, "font-weight", "700");
      set_style(div0, "color", "var(--text-normal)");
      set_style(div0, "cursor", "pointer");
      attr(div2, "class", "pos-countdown");
      set_style(div2, "font-family", "var(--font-monospace), monospace");
      set_style(div2, "font-weight", "700");
      set_style(div2, "font-size", "0.9em");
      set_style(div2, "color", deadlineHue(
        /*diff*/
        ctx[45]
      ));
      set_style(div2, "text-shadow", "0 0 1px rgba(0,0,0,0.05)");
      attr(div3, "class", "pos-card pos-deadline-card");
      set_style(div3, "border-left", "4px solid " + deadlineHue(
        /*diff*/
        ctx[45]
      ), 1);
      set_style(div3, "background", "var(--background-secondary)");
      set_style(div3, "border", "1px solid var(--background-modifier-border)");
      set_style(div3, "border-radius", "8px");
      set_style(div3, "padding", "12px 16px");
      set_style(div3, "display", "flex");
      set_style(div3, "justify-content", "space-between");
      set_style(div3, "align-items", "center");
      this.first = div3;
    },
    m(target, anchor) {
      insert(target, div3, anchor);
      append(div3, div1);
      append(div1, div0);
      append(div0, t0);
      append(div1, t1);
      if (if_block)
        if_block.m(div1, null);
      append(div3, t2);
      append(div3, div2);
      append(div2, t3);
      append(div3, t4);
      if (!mounted) {
        dispose = listen(div0, "click", click_handler_5);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & /*countdownTasks*/
      16 && t0_value !== (t0_value = /*task*/
      ctx[38].name + ""))
        set_data(t0, t0_value);
      if (
        /*task*/
        ctx[38].description
      ) {
        if (if_block) {
          if_block.p(ctx, dirty);
        } else {
          if_block = create_if_block_52(ctx);
          if_block.c();
          if_block.m(div1, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (dirty[0] & /*countdownTasks, now*/
      24 && t3_value !== (t3_value = formatCountdown(
        /*diff*/
        ctx[45]
      ) + ""))
        set_data(t3, t3_value);
      if (dirty[0] & /*countdownTasks, now*/
      24) {
        set_style(div2, "color", deadlineHue(
          /*diff*/
          ctx[45]
        ));
      }
      if (dirty[0] & /*countdownTasks, now*/
      24) {
        set_style(div3, "border-left", "4px solid " + deadlineHue(
          /*diff*/
          ctx[45]
        ), 1);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div3);
      }
      if (if_block)
        if_block.d();
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_42(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.textContent = "Today";
      set_style(div, "font-size", "0.7em");
      set_style(div, "text-transform", "uppercase");
      set_style(div, "margin-top", "1px");
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
function create_each_block_3(ctx) {
  let div;
  let t0_value = (
    /*td*/
    ctx[42].label + ""
  );
  let t0;
  let t1;
  let t2;
  let if_block = (
    /*td*/
    ctx[42].isToday && create_if_block_42(ctx)
  );
  return {
    c() {
      div = element("div");
      t0 = text(t0_value);
      t1 = space();
      if (if_block)
        if_block.c();
      t2 = space();
      set_style(
        div,
        "color",
        /*td*/
        ctx[42].isToday ? "#A7C957" : "var(--text-muted)"
      );
      set_style(
        div,
        "font-weight",
        /*td*/
        ctx[42].isToday ? "800" : "600"
      );
      set_style(div, "font-size", "0.95em");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t0);
      append(div, t1);
      if (if_block)
        if_block.m(div, null);
      append(div, t2);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*timelineDates*/
      32 && t0_value !== (t0_value = /*td*/
      ctx2[42].label + ""))
        set_data(t0, t0_value);
      if (
        /*td*/
        ctx2[42].isToday
      ) {
        if (if_block) {
        } else {
          if_block = create_if_block_42(ctx2);
          if_block.c();
          if_block.m(div, t2);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (dirty[0] & /*timelineDates*/
      32) {
        set_style(
          div,
          "color",
          /*td*/
          ctx2[42].isToday ? "#A7C957" : "var(--text-muted)"
        );
      }
      if (dirty[0] & /*timelineDates*/
      32) {
        set_style(
          div,
          "font-weight",
          /*td*/
          ctx2[42].isToday ? "800" : "600"
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      if (if_block)
        if_block.d();
    }
  };
}
function create_each_block_22(ctx) {
  let div1;
  let div0;
  let t0;
  let t1_value = (
    /*task*/
    ctx[38].name + ""
  );
  let t1;
  let div0_title_value;
  let t2;
  let mounted;
  let dispose;
  function click_handler_4() {
    return (
      /*click_handler_4*/
      ctx[27](
        /*task*/
        ctx[38]
      )
    );
  }
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      t0 = text("\u{1F680} ");
      t1 = text(t1_value);
      t2 = space();
      attr(div0, "class", "pos-gantt-bar-pill");
      set_style(
        div0,
        "grid-column",
        /*pos*/
        ctx[39].gridStart + " / " + /*pos*/
        ctx[39].gridEnd
      );
      set_style(div0, "background", "linear-gradient(135deg, hsl(" + /*diffMs*/
      (ctx[35] > 0 ? getHueForRemaining(
        /*diffMs*/
        ctx[35]
      ) : 0) + ", 85%, 85%), hsl(" + /*diffMs*/
      (ctx[35] > 0 ? getHueForRemaining(
        /*diffMs*/
        ctx[35]
      ) : 0) + ", 80%, 90%))");
      set_style(div0, "color", "#101010");
      set_style(div0, "border", "1px solid rgba(0,0,0,0.12)");
      set_style(div0, "padding", "6px 12px");
      set_style(div0, "border-radius", "9999px");
      set_style(div0, "font-weight", "700");
      set_style(div0, "font-size", "0.78em");
      set_style(div0, "cursor", "pointer");
      set_style(div0, "text-overflow", "ellipsis");
      set_style(div0, "white-space", "nowrap");
      set_style(div0, "overflow", "hidden");
      set_style(div0, "box-shadow", "0 1px 3px rgba(0,0,0,0.05)");
      set_style(div0, "margin", "0 4px");
      set_style(div0, "transition", "transform 0.2s");
      attr(div0, "title", div0_title_value = `${/*task*/
      ctx[38].name} (Ends: ${/*task*/
      ctx[38].deadline})`);
      attr(div1, "class", "pos-gantt-row");
      set_style(div1, "display", "grid");
      set_style(div1, "grid-template-columns", "repeat(14, 1fr)");
      set_style(div1, "align-items", "center");
      set_style(div1, "border-bottom", "1px solid var(--background-modifier-border)");
      set_style(div1, "padding", "12px 0");
      set_style(
        div1,
        "background",
        /*idx*/
        ctx[41] % 2 === 0 ? "rgba(0,0,0,0.01)" : "transparent"
      );
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      append(div0, t0);
      append(div0, t1);
      append(div1, t2);
      if (!mounted) {
        dispose = listen(div0, "click", click_handler_4);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & /*deadlinedTasks*/
      1 && t1_value !== (t1_value = /*task*/
      ctx[38].name + ""))
        set_data(t1, t1_value);
      if (dirty[0] & /*deadlinedTasks*/
      1) {
        set_style(
          div0,
          "grid-column",
          /*pos*/
          ctx[39].gridStart + " / " + /*pos*/
          ctx[39].gridEnd
        );
      }
      if (dirty[0] & /*deadlinedTasks, now*/
      9) {
        set_style(div0, "background", "linear-gradient(135deg, hsl(" + /*diffMs*/
        (ctx[35] > 0 ? getHueForRemaining(
          /*diffMs*/
          ctx[35]
        ) : 0) + ", 85%, 85%), hsl(" + /*diffMs*/
        (ctx[35] > 0 ? getHueForRemaining(
          /*diffMs*/
          ctx[35]
        ) : 0) + ", 80%, 90%))");
      }
      if (dirty[0] & /*deadlinedTasks*/
      1 && div0_title_value !== (div0_title_value = `${/*task*/
      ctx[38].name} (Ends: ${/*task*/
      ctx[38].deadline})`)) {
        attr(div0, "title", div0_title_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_23(ctx) {
  let span;
  return {
    c() {
      span = element("span");
      span.textContent = "Today";
      set_style(span, "font-size", "0.75em");
      set_style(span, "text-transform", "uppercase");
      set_style(span, "color", "#A7C957");
      set_style(span, "font-weight", "700");
      set_style(span, "padding-right", "2px");
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
function create_each_block_12(ctx) {
  let div;
  let t0_value = (
    /*t*/
    ctx[34].name + ""
  );
  let t0;
  let t1;
  let div_title_value;
  let mounted;
  let dispose;
  function click_handler_3() {
    return (
      /*click_handler_3*/
      ctx[25](
        /*t*/
        ctx[34]
      )
    );
  }
  return {
    c() {
      div = element("div");
      t0 = text(t0_value);
      t1 = space();
      attr(div, "class", "pos-cal-task-pill");
      set_style(div, "font-size", "0.75em");
      set_style(div, "font-weight", "600");
      set_style(div, "padding", "2px 6px");
      set_style(div, "border-radius", "3px");
      set_style(div, "background", "hsl(" + (new Date(
        /*t*/
        ctx[34].deadline || ""
      ).getTime() - /*now*/
      ctx[3] > 0 ? getHueForRemaining(
        /*diffMs*/
        ctx[35]
      ) : 0) + ", 80%, 85%)");
      set_style(div, "color", "#101010");
      set_style(div, "border", "1px solid rgba(0,0,0,0.08)");
      set_style(div, "cursor", "pointer");
      set_style(div, "text-overflow", "ellipsis");
      set_style(div, "white-space", "nowrap");
      set_style(div, "overflow", "hidden");
      attr(div, "title", div_title_value = `${/*t*/
      ctx[34].name} (Deadline: ${/*t*/
      ctx[34].deadline})`);
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t0);
      append(div, t1);
      if (!mounted) {
        dispose = listen(div, "click", click_handler_3);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & /*deadlinedTasks, gridCells*/
      65 && t0_value !== (t0_value = /*t*/
      ctx[34].name + ""))
        set_data(t0, t0_value);
      if (dirty[0] & /*deadlinedTasks, gridCells, now*/
      73) {
        set_style(div, "background", "hsl(" + (new Date(
          /*t*/
          ctx[34].deadline || ""
        ).getTime() - /*now*/
        ctx[3] > 0 ? getHueForRemaining(
          /*diffMs*/
          ctx[35]
        ) : 0) + ", 80%, 85%)");
      }
      if (dirty[0] & /*deadlinedTasks, gridCells*/
      65 && div_title_value !== (div_title_value = `${/*t*/
      ctx[34].name} (Deadline: ${/*t*/
      ctx[34].deadline})`)) {
        attr(div, "title", div_title_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      mounted = false;
      dispose();
    }
  };
}
function create_each_block3(ctx) {
  let div2;
  let div0;
  let span;
  let t0_value = (
    /*cell*/
    ctx[30].dayNum + ""
  );
  let t0;
  let t1;
  let t2;
  let div1;
  let t3;
  let if_block = (
    /*cell*/
    ctx[30].isToday && create_if_block_23(ctx)
  );
  let each_value_1 = ensure_array_like(
    /*cellTasks*/
    ctx[31]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value_1.length; i += 1) {
    each_blocks[i] = create_each_block_12(get_each_context_12(ctx, each_value_1, i));
  }
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      span = element("span");
      t0 = text(t0_value);
      t1 = space();
      if (if_block)
        if_block.c();
      t2 = space();
      div1 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t3 = space();
      attr(div0, "class", "pos-day-number");
      set_style(
        div0,
        "font-weight",
        /*cell*/
        ctx[30].isToday ? "700" : "600"
      );
      set_style(div0, "font-size", "0.82em");
      set_style(
        div0,
        "color",
        /*cell*/
        ctx[30].isCurrentMonth ? "var(--text-normal)" : "var(--text-muted)"
      );
      set_style(div0, "display", "flex");
      set_style(div0, "justify-content", "space-between");
      set_style(div0, "align-items", "center");
      attr(div1, "class", "pos-day-tasks");
      set_style(div1, "display", "flex");
      set_style(div1, "flex-direction", "column");
      set_style(div1, "gap", "3px");
      set_style(div1, "overflow-y", "auto");
      set_style(div1, "flex", "1");
      attr(div2, "class", "pos-calendar-day-cell");
      set_style(
        div2,
        "background",
        /*cell*/
        ctx[30].isToday ? "var(--background-modifier-hover)" : "var(--background-primary)"
      );
      set_style(div2, "padding", "6px");
      set_style(div2, "display", "flex");
      set_style(div2, "flex-direction", "column");
      set_style(div2, "gap", "4px");
      set_style(div2, "min-height", "90px");
      set_style(
        div2,
        "border-top",
        /*cell*/
        ctx[30].isToday ? "2px solid #A7C957" : "none"
      );
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, div0);
      append(div0, span);
      append(span, t0);
      append(div0, t1);
      if (if_block)
        if_block.m(div0, null);
      append(div2, t2);
      append(div2, div1);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div1, null);
        }
      }
      append(div2, t3);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*gridCells*/
      64 && t0_value !== (t0_value = /*cell*/
      ctx2[30].dayNum + ""))
        set_data(t0, t0_value);
      if (
        /*cell*/
        ctx2[30].isToday
      ) {
        if (if_block) {
        } else {
          if_block = create_if_block_23(ctx2);
          if_block.c();
          if_block.m(div0, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (dirty[0] & /*gridCells*/
      64) {
        set_style(
          div0,
          "font-weight",
          /*cell*/
          ctx2[30].isToday ? "700" : "600"
        );
      }
      if (dirty[0] & /*gridCells*/
      64) {
        set_style(
          div0,
          "color",
          /*cell*/
          ctx2[30].isCurrentMonth ? "var(--text-normal)" : "var(--text-muted)"
        );
      }
      if (dirty[0] & /*deadlinedTasks, gridCells, now, openTaskFile*/
      4169) {
        each_value_1 = ensure_array_like(
          /*cellTasks*/
          ctx2[31]
        );
        let i;
        for (i = 0; i < each_value_1.length; i += 1) {
          const child_ctx = get_each_context_12(ctx2, each_value_1, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block_12(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(div1, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value_1.length;
      }
      if (dirty[0] & /*gridCells*/
      64) {
        set_style(
          div2,
          "background",
          /*cell*/
          ctx2[30].isToday ? "var(--background-modifier-hover)" : "var(--background-primary)"
        );
      }
      if (dirty[0] & /*gridCells*/
      64) {
        set_style(
          div2,
          "border-top",
          /*cell*/
          ctx2[30].isToday ? "2px solid #A7C957" : "none"
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      if (if_block)
        if_block.d();
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_fragment3(ctx) {
  let div3;
  let div1;
  let div0;
  let button0;
  let t1;
  let button1;
  let t3;
  let button2;
  let t5;
  let t6;
  let div2;
  let mounted;
  let dispose;
  let if_block0 = (
    /*viewMode*/
    ctx[2] === "calendar" && create_if_block_62(ctx)
  );
  function select_block_type(ctx2, dirty) {
    if (
      /*deadlinedTasks*/
      ctx2[0].length === 0
    )
      return create_if_block3;
    if (
      /*viewMode*/
      ctx2[2] === "calendar"
    )
      return create_if_block_14;
    if (
      /*viewMode*/
      ctx2[2] === "timeline"
    )
      return create_if_block_33;
    return create_else_block2;
  }
  let current_block_type = select_block_type(ctx, [-1, -1]);
  let if_block1 = current_block_type(ctx);
  return {
    c() {
      div3 = element("div");
      div1 = element("div");
      div0 = element("div");
      button0 = element("button");
      button0.textContent = "\u{1F4C5} Calendar";
      t1 = space();
      button1 = element("button");
      button1.textContent = "\u{1F4CA} Timeline";
      t3 = space();
      button2 = element("button");
      button2.textContent = "\u23F3 Countdowns";
      t5 = space();
      if (if_block0)
        if_block0.c();
      t6 = space();
      div2 = element("div");
      if_block1.c();
      attr(button0, "class", "pos-tab-btn");
      toggle_class(
        button0,
        "active",
        /*viewMode*/
        ctx[2] === "calendar"
      );
      attr(button1, "class", "pos-tab-btn");
      toggle_class(
        button1,
        "active",
        /*viewMode*/
        ctx[2] === "timeline"
      );
      attr(button2, "class", "pos-tab-btn");
      toggle_class(
        button2,
        "active",
        /*viewMode*/
        ctx[2] === "list"
      );
      attr(div0, "class", "pos-deadlines-modes");
      set_style(div0, "display", "flex");
      set_style(div0, "gap", "8px");
      attr(div1, "class", "pos-deadlines-header");
      set_style(div1, "display", "flex");
      set_style(div1, "justify-content", "space-between");
      set_style(div1, "align-items", "center");
      set_style(div1, "border-bottom", "1px solid var(--background-modifier-border)");
      set_style(div1, "padding-bottom", "10px");
      set_style(div1, "margin-bottom", "16px");
      set_style(div1, "flex-shrink", "0");
      set_style(div1, "flex-wrap", "wrap");
      set_style(div1, "gap", "10px");
      attr(div2, "class", "pos-deadlines-body");
      set_style(div2, "flex", "1");
      set_style(div2, "min-height", "0");
      set_style(div2, "overflow-y", "auto");
      attr(div3, "class", "pos-deadlines-workspace");
      set_style(div3, "display", "flex");
      set_style(div3, "flex-direction", "column");
      set_style(div3, "height", "100%");
    },
    m(target, anchor) {
      insert(target, div3, anchor);
      append(div3, div1);
      append(div1, div0);
      append(div0, button0);
      append(div0, t1);
      append(div0, button1);
      append(div0, t3);
      append(div0, button2);
      append(div1, t5);
      if (if_block0)
        if_block0.m(div1, null);
      append(div3, t6);
      append(div3, div2);
      if_block1.m(div2, null);
      if (!mounted) {
        dispose = [
          listen(
            button0,
            "click",
            /*click_handler*/
            ctx[22]
          ),
          listen(
            button1,
            "click",
            /*click_handler_1*/
            ctx[23]
          ),
          listen(
            button2,
            "click",
            /*click_handler_2*/
            ctx[24]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*viewMode*/
      4) {
        toggle_class(
          button0,
          "active",
          /*viewMode*/
          ctx2[2] === "calendar"
        );
      }
      if (dirty[0] & /*viewMode*/
      4) {
        toggle_class(
          button1,
          "active",
          /*viewMode*/
          ctx2[2] === "timeline"
        );
      }
      if (dirty[0] & /*viewMode*/
      4) {
        toggle_class(
          button2,
          "active",
          /*viewMode*/
          ctx2[2] === "list"
        );
      }
      if (
        /*viewMode*/
        ctx2[2] === "calendar"
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0 = create_if_block_62(ctx2);
          if_block0.c();
          if_block0.m(div1, null);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (current_block_type === (current_block_type = select_block_type(ctx2, dirty)) && if_block1) {
        if_block1.p(ctx2, dirty);
      } else {
        if_block1.d(1);
        if_block1 = current_block_type(ctx2);
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
      if (if_block0)
        if_block0.d();
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
function getDaysInMonth(y, m) {
  return new Date(y, m + 1, 0).getDate();
}
function getFirstDayOfWeek(y, m) {
  return new Date(y, m, 1).getDay();
}
function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}
function instance3($$self, $$props, $$invalidate) {
  let projectTasks;
  let deadlinedTasks;
  let year;
  let month;
  let monthName;
  let daysInMonth;
  let firstDayOfWeek;
  let gridCells;
  let timelineDates;
  let countdownTasks;
  let $tasksStore;
  component_subscribe($$self, tasksStore, ($$value) => $$invalidate(21, $tasksStore = $$value));
  let { app } = $$props;
  let { fileManager } = $$props;
  let { projectId } = $$props;
  let viewMode = "calendar";
  let now2 = Date.now();
  let timer;
  onMount(() => {
    timer = window.setInterval(
      () => {
        $$invalidate(3, now2 = Date.now());
      },
      1e3
    );
  });
  onDestroy(() => {
    window.clearInterval(timer);
  });
  let currentDate = /* @__PURE__ */ new Date();
  function prevMonth() {
    $$invalidate(16, currentDate = new Date(year, month - 1, 1));
  }
  function nextMonth() {
    $$invalidate(16, currentDate = new Date(year, month + 1, 1));
  }
  function goToToday() {
    $$invalidate(16, currentDate = /* @__PURE__ */ new Date());
  }
  function getGanttPosition(createdAtStr, deadlineStr) {
    const startD = createdAtStr ? new Date(createdAtStr) : /* @__PURE__ */ new Date();
    const endD = new Date(deadlineStr);
    const tStart = startD.toISOString().slice(0, 10);
    const tEnd = endD.toISOString().slice(0, 10);
    let startIndex = timelineDates.findIndex((td) => td.dateStr === tStart);
    let endIndex = timelineDates.findIndex((td) => td.dateStr === tEnd);
    if (startIndex === -1) {
      if (startD < timelineDates[0].d)
        startIndex = 0;
      else
        startIndex = 13;
    }
    if (endIndex === -1) {
      if (endD > timelineDates[13].d)
        endIndex = 13;
      else
        endIndex = 0;
    }
    if (startIndex > endIndex)
      startIndex = endIndex;
    return {
      gridStart: startIndex + 1,
      gridEnd: endIndex + 2
    };
  }
  function openTaskFile(taskId) {
    const file = app.vault.getAbstractFileByPath(`tasks/${taskId}.md`);
    if (file) {
      app.workspace.getLeaf("tab").openFile(file);
    }
  }
  const click_handler = () => $$invalidate(2, viewMode = "calendar");
  const click_handler_1 = () => $$invalidate(2, viewMode = "timeline");
  const click_handler_2 = () => $$invalidate(2, viewMode = "list");
  const click_handler_3 = (t) => openTaskFile(t.id);
  const func = (cell, t) => (t.deadline || "").startsWith(cell.dateStr);
  const click_handler_4 = (task) => openTaskFile(task.id);
  const click_handler_5 = (task) => openTaskFile(task.id);
  $$self.$$set = ($$props2) => {
    if ("app" in $$props2)
      $$invalidate(13, app = $$props2.app);
    if ("fileManager" in $$props2)
      $$invalidate(14, fileManager = $$props2.fileManager);
    if ("projectId" in $$props2)
      $$invalidate(15, projectId = $$props2.projectId);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*$tasksStore, projectId*/
    2129920) {
      $:
        $$invalidate(20, projectTasks = getProjectTasks($tasksStore, projectId));
    }
    if ($$self.$$.dirty[0] & /*projectTasks*/
    1048576) {
      $:
        $$invalidate(0, deadlinedTasks = projectTasks.filter((t) => t.deadline && !t.isCompleted));
    }
    if ($$self.$$.dirty[0] & /*currentDate*/
    65536) {
      $:
        $$invalidate(1, year = currentDate.getFullYear());
    }
    if ($$self.$$.dirty[0] & /*currentDate*/
    65536) {
      $:
        $$invalidate(17, month = currentDate.getMonth());
    }
    if ($$self.$$.dirty[0] & /*currentDate*/
    65536) {
      $:
        $$invalidate(7, monthName = currentDate.toLocaleString("default", { month: "long" }));
    }
    if ($$self.$$.dirty[0] & /*year, month*/
    131074) {
      $:
        $$invalidate(18, daysInMonth = getDaysInMonth(year, month));
    }
    if ($$self.$$.dirty[0] & /*year, month*/
    131074) {
      $:
        $$invalidate(19, firstDayOfWeek = getFirstDayOfWeek(year, month));
    }
    if ($$self.$$.dirty[0] & /*year, month, firstDayOfWeek, daysInMonth*/
    917506) {
      $:
        $$invalidate(6, gridCells = (() => {
          const cells = [];
          const prevMonthDays = getDaysInMonth(year, month - 1);
          const startDay = firstDayOfWeek;
          for (let i = startDay - 1; i >= 0; i--) {
            const prevDay = prevMonthDays - i;
            const d = new Date(year, month - 1, prevDay);
            cells.push({
              dateStr: d.toISOString().slice(0, 10),
              dayNum: prevDay,
              isCurrentMonth: false,
              isToday: isSameDay(d, /* @__PURE__ */ new Date())
            });
          }
          for (let i = 1; i <= daysInMonth; i++) {
            const d = new Date(year, month, i);
            cells.push({
              dateStr: d.toISOString().slice(0, 10),
              dayNum: i,
              isCurrentMonth: true,
              isToday: isSameDay(d, /* @__PURE__ */ new Date())
            });
          }
          const remaining = 42 - cells.length;
          for (let i = 1; i <= remaining; i++) {
            const d = new Date(year, month + 1, i);
            cells.push({
              dateStr: d.toISOString().slice(0, 10),
              dayNum: i,
              isCurrentMonth: false,
              isToday: isSameDay(d, /* @__PURE__ */ new Date())
            });
          }
          return cells;
        })());
    }
    if ($$self.$$.dirty[0] & /*deadlinedTasks*/
    1) {
      $:
        $$invalidate(4, countdownTasks = [...deadlinedTasks].sort((a, b) => new Date(a.deadline || "").getTime() - new Date(b.deadline || "").getTime()));
    }
  };
  $:
    $$invalidate(5, timelineDates = (() => {
      const dates = [];
      const today = /* @__PURE__ */ new Date();
      for (let i = -2; i < 12; i++) {
        const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
        dates.push({
          dateStr: d.toISOString().slice(0, 10),
          label: `${d.getMonth() + 1}/${d.getDate()}`,
          isToday: i === 0,
          d
        });
      }
      return dates;
    })());
  return [
    deadlinedTasks,
    year,
    viewMode,
    now2,
    countdownTasks,
    timelineDates,
    gridCells,
    monthName,
    prevMonth,
    nextMonth,
    goToToday,
    getGanttPosition,
    openTaskFile,
    app,
    fileManager,
    projectId,
    currentDate,
    month,
    daysInMonth,
    firstDayOfWeek,
    projectTasks,
    $tasksStore,
    click_handler,
    click_handler_1,
    click_handler_2,
    click_handler_3,
    func,
    click_handler_4,
    click_handler_5
  ];
}
var DeadlinesView = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance3, create_fragment3, safe_not_equal, { app: 13, fileManager: 14, projectId: 15 }, null, [-1, -1]);
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
function create_fragment4(ctx) {
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
function instance4($$self, $$props, $$invalidate) {
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
  const func = (id, m) => {
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
    func
  ];
}
var App3 = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance4, create_fragment4, safe_not_equal, { app: 0, fileManager: 1, plugin: 2 });
  }
};
var App_default = App3;

// src/ui/views/ProjectsView.svelte
var import_obsidian7 = require("obsidian");

// src/ui/views/components/ProjectTaskBoard.svelte
var import_obsidian5 = require("obsidian");
function get_each_context5(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[55] = list[i];
  child_ctx[57] = i;
  return child_ctx;
}
function get_each_context_13(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[55] = list[i];
  child_ctx[57] = i;
  return child_ctx;
}
function get_each_context_23(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[55] = list[i];
  child_ctx[57] = i;
  return child_ctx;
}
function get_each_context_32(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[55] = list[i];
  child_ctx[57] = i;
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
    ctx[55].description + ""
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
      128 && t_value !== (t_value = /*task*/
      ctx2[55].description + ""))
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
    ctx[55].name + ""
  );
  let t2;
  let t3;
  let t4;
  let div1;
  let span;
  let t5;
  let t6_value = (
    /*task*/
    ctx[55].weight + ""
  );
  let t6;
  let t7;
  let div4;
  let button0;
  let t9;
  let button1;
  let mounted;
  let dispose;
  let if_block0 = (
    /*dragOverStatus*/
    ctx[2] === "planned" && /*dragOverIndex*/
    ctx[3] === /*i*/
    ctx[57] && create_if_block_132(ctx)
  );
  function change_handler() {
    return (
      /*change_handler*/
      ctx[23](
        /*task*/
        ctx[55]
      )
    );
  }
  function click_handler_2() {
    return (
      /*click_handler_2*/
      ctx[24](
        /*task*/
        ctx[55]
      )
    );
  }
  let if_block1 = (
    /*task*/
    ctx[55].description && create_if_block_122(ctx)
  );
  function click_handler_3() {
    return (
      /*click_handler_3*/
      ctx[25](
        /*task*/
        ctx[55]
      )
    );
  }
  function click_handler_4() {
    return (
      /*click_handler_4*/
      ctx[26](
        /*task*/
        ctx[55]
      )
    );
  }
  function dragstart_handler(...args) {
    return (
      /*dragstart_handler*/
      ctx[27](
        /*task*/
        ctx[55],
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
      button0 = element("button");
      button0.textContent = "Edit";
      t9 = space();
      button1 = element("button");
      button1.textContent = "Delete";
      attr(input, "type", "checkbox");
      input.checked = input_checked_value = false;
      attr(input, "class", "pos-task-checkbox");
      attr(div0, "class", "pos-card-name");
      attr(div1, "class", "pos-ptc-meta");
      attr(div2, "class", "pos-ptc-body");
      attr(div3, "class", "pos-ptc-header");
      attr(button1, "class", "pos-del");
      attr(div4, "class", "pos-ptc-acts");
      attr(div5, "class", "pos-card pos-board-card");
      attr(div5, "draggable", "true");
      toggle_class(
        div5,
        "pos-dragging-source",
        /*dragId*/
        ctx[1] === /*task*/
        ctx[55].id
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
      append(div4, button0);
      append(div4, t9);
      append(div4, button1);
      if (!mounted) {
        dispose = [
          listen(input, "change", change_handler),
          listen(div0, "click", click_handler_2),
          listen(button0, "click", click_handler_3),
          listen(button1, "click", click_handler_4),
          listen(div5, "dragstart", dragstart_handler)
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
        ctx[57]
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
      128 && t2_value !== (t2_value = /*task*/
      ctx[55].name + ""))
        set_data(t2, t2_value);
      if (
        /*task*/
        ctx[55].description
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
      128 && t6_value !== (t6_value = /*task*/
      ctx[55].weight + ""))
        set_data(t6, t6_value);
      if (dirty[0] & /*dragId, planned*/
      130) {
        toggle_class(
          div5,
          "pos-dragging-source",
          /*dragId*/
          ctx[1] === /*task*/
          ctx[55].id
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
function create_if_block_92(ctx) {
  let div;
  let t_value = (
    /*task*/
    ctx[55].description + ""
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
      64 && t_value !== (t_value = /*task*/
      ctx2[55].description + ""))
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
    ctx[55].name + ""
  );
  let t2;
  let t3;
  let t4;
  let div1;
  let span;
  let t5;
  let t6_value = (
    /*task*/
    ctx[55].weight + ""
  );
  let t6;
  let t7;
  let div4;
  let button0;
  let t9;
  let button1;
  let mounted;
  let dispose;
  let if_block0 = (
    /*dragOverStatus*/
    ctx[2] === "backlog" && /*dragOverIndex*/
    ctx[3] === /*i*/
    ctx[57] && create_if_block_102(ctx)
  );
  function change_handler_1() {
    return (
      /*change_handler_1*/
      ctx[31](
        /*task*/
        ctx[55]
      )
    );
  }
  function click_handler_6() {
    return (
      /*click_handler_6*/
      ctx[32](
        /*task*/
        ctx[55]
      )
    );
  }
  let if_block1 = (
    /*task*/
    ctx[55].description && create_if_block_92(ctx)
  );
  function click_handler_7() {
    return (
      /*click_handler_7*/
      ctx[33](
        /*task*/
        ctx[55]
      )
    );
  }
  function click_handler_8() {
    return (
      /*click_handler_8*/
      ctx[34](
        /*task*/
        ctx[55]
      )
    );
  }
  function dragstart_handler_1(...args) {
    return (
      /*dragstart_handler_1*/
      ctx[35](
        /*task*/
        ctx[55],
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
      button0 = element("button");
      button0.textContent = "Edit";
      t9 = space();
      button1 = element("button");
      button1.textContent = "Delete";
      attr(input, "type", "checkbox");
      input.checked = input_checked_value = true;
      attr(input, "class", "pos-task-checkbox");
      attr(div0, "class", "pos-card-name");
      attr(div1, "class", "pos-ptc-meta");
      attr(div2, "class", "pos-ptc-body");
      attr(div3, "class", "pos-ptc-header");
      attr(button1, "class", "pos-del");
      attr(div4, "class", "pos-ptc-acts");
      attr(div5, "class", "pos-card pos-board-card");
      attr(div5, "draggable", "true");
      toggle_class(
        div5,
        "pos-dragging-source",
        /*dragId*/
        ctx[1] === /*task*/
        ctx[55].id
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
      append(div4, button0);
      append(div4, t9);
      append(div4, button1);
      if (!mounted) {
        dispose = [
          listen(input, "change", change_handler_1),
          listen(div0, "click", click_handler_6),
          listen(button0, "click", click_handler_7),
          listen(button1, "click", click_handler_8),
          listen(div5, "dragstart", dragstart_handler_1)
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
        ctx[57]
      ) {
        if (if_block0) {
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
      64 && t2_value !== (t2_value = /*task*/
      ctx[55].name + ""))
        set_data(t2, t2_value);
      if (
        /*task*/
        ctx[55].description
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
      64 && t6_value !== (t6_value = /*task*/
      ctx[55].weight + ""))
        set_data(t6, t6_value);
      if (dirty[0] & /*dragId, backlog*/
      66) {
        toggle_class(
          div5,
          "pos-dragging-source",
          /*dragId*/
          ctx[1] === /*task*/
          ctx[55].id
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
function create_if_block_82(ctx) {
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
function create_if_block_72(ctx) {
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
function create_if_block_63(ctx) {
  let div;
  let t_value = (
    /*task*/
    ctx[55].description + ""
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
      ctx2[55].description + ""))
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
    ctx[55].fixedDuration + ""
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
      ctx2[55].fixedDuration + ""))
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
      ctx[43](
        /*task*/
        ctx[55],
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
      ctx[55].fixedDuration || 30;
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (!mounted) {
        dispose = [
          listen(input, "click", stop_propagation(
            /*click_handler_1*/
            ctx[21]
          )),
          listen(input, "change", change_handler_3)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & /*running*/
      32 && input_value_value !== (input_value_value = /*task*/
      ctx[55].fixedDuration || 30) && input.value !== input_value_value) {
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
    ctx[55].name + ""
  );
  let t1;
  let t2;
  let t3;
  let div1;
  let span0;
  let t4;
  let t5_value = (
    /*task*/
    ctx[55].weight + ""
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
    ctx[55].weight + ""
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
  let t19;
  let button3;
  let mounted;
  let dispose;
  let if_block0 = (
    /*dragOverStatus*/
    ctx[2] === "running" && /*dragOverIndex*/
    ctx[3] === /*i*/
    ctx[57] && create_if_block_72(ctx)
  );
  function click_handler_10() {
    return (
      /*click_handler_10*/
      ctx[39](
        /*task*/
        ctx[55]
      )
    );
  }
  let if_block1 = (
    /*task*/
    ctx[55].description && create_if_block_63(ctx)
  );
  let if_block2 = (
    /*task*/
    ctx[55].isFixedDuration && /*task*/
    ctx[55].fixedDuration && create_if_block_53(ctx)
  );
  function click_handler_11() {
    return (
      /*click_handler_11*/
      ctx[40](
        /*task*/
        ctx[55]
      )
    );
  }
  function click_handler_12() {
    return (
      /*click_handler_12*/
      ctx[41](
        /*task*/
        ctx[55]
      )
    );
  }
  function change_handler_2(...args) {
    return (
      /*change_handler_2*/
      ctx[42](
        /*task*/
        ctx[55],
        ...args
      )
    );
  }
  let if_block3 = (
    /*task*/
    ctx[55].isFixedDuration && create_if_block_43(ctx)
  );
  function click_handler_13() {
    return (
      /*click_handler_13*/
      ctx[44](
        /*task*/
        ctx[55]
      )
    );
  }
  function click_handler_14() {
    return (
      /*click_handler_14*/
      ctx[45](
        /*task*/
        ctx[55]
      )
    );
  }
  function dragstart_handler_2(...args) {
    return (
      /*dragstart_handler_2*/
      ctx[46](
        /*task*/
        ctx[55],
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
      button2.textContent = "Edit";
      t19 = space();
      button3 = element("button");
      button3.textContent = "Delete";
      attr(div0, "class", "pos-card-name");
      attr(div1, "class", "pos-ptc-meta");
      attr(div2, "class", "pos-ptc-body");
      attr(div3, "class", "pos-ptc-header");
      attr(span2, "class", "pos-wg");
      attr(input, "type", "checkbox");
      input.checked = input_checked_value = /*task*/
      ctx[55].isFixedDuration;
      attr(label, "class", "pos-fixed");
      attr(button3, "class", "pos-del");
      attr(div4, "class", "pos-ptc-acts");
      attr(div5, "class", "pos-card pos-board-card");
      attr(div5, "draggable", "true");
      toggle_class(
        div5,
        "pos-dragging-source",
        /*dragId*/
        ctx[1] === /*task*/
        ctx[55].id
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
      append(div4, t19);
      append(div4, button3);
      if (!mounted) {
        dispose = [
          listen(div0, "click", click_handler_10),
          listen(button0, "click", click_handler_11),
          listen(button1, "click", click_handler_12),
          listen(input, "change", change_handler_2),
          listen(label, "click", stop_propagation(
            /*click_handler*/
            ctx[22]
          )),
          listen(button2, "click", click_handler_13),
          listen(button3, "click", click_handler_14),
          listen(div5, "dragstart", dragstart_handler_2)
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
        ctx[57]
      ) {
        if (if_block0) {
        } else {
          if_block0 = create_if_block_72(ctx);
          if_block0.c();
          if_block0.m(t0.parentNode, t0);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (dirty[0] & /*running*/
      32 && t1_value !== (t1_value = /*task*/
      ctx[55].name + ""))
        set_data(t1, t1_value);
      if (
        /*task*/
        ctx[55].description
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
      32 && t5_value !== (t5_value = /*task*/
      ctx[55].weight + ""))
        set_data(t5, t5_value);
      if (
        /*task*/
        ctx[55].isFixedDuration && /*task*/
        ctx[55].fixedDuration
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
      32 && t10_value !== (t10_value = /*task*/
      ctx[55].weight + ""))
        set_data(t10, t10_value);
      if (dirty[0] & /*running*/
      32 && input_checked_value !== (input_checked_value = /*task*/
      ctx[55].isFixedDuration)) {
        input.checked = input_checked_value;
      }
      if (
        /*task*/
        ctx[55].isFixedDuration
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
      34) {
        toggle_class(
          div5,
          "pos-dragging-source",
          /*dragId*/
          ctx[1] === /*task*/
          ctx[55].id
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
function create_if_block_25(ctx) {
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
function create_if_block_16(ctx) {
  let div;
  let t_value = (
    /*task*/
    ctx[55].description + ""
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
      16 && t_value !== (t_value = /*task*/
      ctx2[55].description + ""))
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
    ctx[55].name + ""
  );
  let t1;
  let t2;
  let t3;
  let div1;
  let span;
  let t4;
  let t5_value = (
    /*task*/
    ctx[55].weight + ""
  );
  let t5;
  let t6;
  let div4;
  let button0;
  let t8;
  let button1;
  let mounted;
  let dispose;
  let if_block0 = (
    /*dragOverStatus*/
    ctx[2] === "review" && /*dragOverIndex*/
    ctx[3] === /*i*/
    ctx[57] && create_if_block_25(ctx)
  );
  function click_handler_15() {
    return (
      /*click_handler_15*/
      ctx[49](
        /*task*/
        ctx[55]
      )
    );
  }
  let if_block1 = (
    /*task*/
    ctx[55].description && create_if_block_16(ctx)
  );
  function click_handler_16() {
    return (
      /*click_handler_16*/
      ctx[50](
        /*task*/
        ctx[55]
      )
    );
  }
  function click_handler_17() {
    return (
      /*click_handler_17*/
      ctx[51](
        /*task*/
        ctx[55]
      )
    );
  }
  function dragstart_handler_3(...args) {
    return (
      /*dragstart_handler_3*/
      ctx[52](
        /*task*/
        ctx[55],
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
      button0 = element("button");
      button0.textContent = "Edit";
      t8 = space();
      button1 = element("button");
      button1.textContent = "Delete";
      attr(div0, "class", "pos-card-name");
      attr(div1, "class", "pos-ptc-meta");
      attr(div2, "class", "pos-ptc-body");
      attr(div3, "class", "pos-ptc-header");
      attr(button1, "class", "pos-del");
      attr(div4, "class", "pos-ptc-acts");
      attr(div5, "class", "pos-card pos-board-card pos-completed");
      attr(div5, "draggable", "true");
      toggle_class(
        div5,
        "pos-dragging-source",
        /*dragId*/
        ctx[1] === /*task*/
        ctx[55].id
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
      append(div4, button0);
      append(div4, t8);
      append(div4, button1);
      if (!mounted) {
        dispose = [
          listen(div0, "click", click_handler_15),
          listen(button0, "click", click_handler_16),
          listen(button1, "click", click_handler_17),
          listen(div5, "dragstart", dragstart_handler_3)
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
        ctx[57]
      ) {
        if (if_block0) {
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
      16 && t1_value !== (t1_value = /*task*/
      ctx[55].name + ""))
        set_data(t1, t1_value);
      if (
        /*task*/
        ctx[55].description
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
      16 && t5_value !== (t5_value = /*task*/
      ctx[55].weight + ""))
        set_data(t5, t5_value);
      if (dirty[0] & /*dragId, review*/
      18) {
        toggle_class(
          div5,
          "pos-dragging-source",
          /*dragId*/
          ctx[1] === /*task*/
          ctx[55].id
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
function create_fragment5(ctx) {
  let div12;
  let div2;
  let h40;
  let t0;
  let t1_value = (
    /*planned*/
    ctx[7].length + ""
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
    ctx[6].length + ""
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
    ctx[5].length + ""
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
    ctx[4].length + ""
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
    ctx[7]
  );
  const get_key = (ctx2) => (
    /*task*/
    ctx2[55].id
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
    ctx[7].length && create_if_block_112(ctx)
  );
  let each_value_2 = ensure_array_like(
    /*backlog*/
    ctx[6]
  );
  const get_key_1 = (ctx2) => (
    /*task*/
    ctx2[55].id
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
    ctx[6].length && create_if_block_82(ctx)
  );
  let each_value_1 = ensure_array_like(
    /*running*/
    ctx[5]
  );
  const get_key_2 = (ctx2) => (
    /*task*/
    ctx2[55].id
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
    ctx[5].length && create_if_block_35(ctx)
  );
  let each_value = ensure_array_like(
    /*review*/
    ctx[4]
  );
  const get_key_3 = (ctx2) => (
    /*task*/
    ctx2[55].id
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
    ctx[4].length && create_if_block5(ctx)
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
            /*click_handler_5*/
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
            /*click_handler_9*/
            ctx[36]
          ),
          listen(
            div4,
            "dragover",
            /*dragover_handler_1*/
            ctx[37]
          ),
          listen(
            div4,
            "drop",
            /*drop_handler_1*/
            ctx[38]
          ),
          listen(
            div7,
            "dragover",
            /*dragover_handler_2*/
            ctx[47]
          ),
          listen(
            div7,
            "drop",
            /*drop_handler_2*/
            ctx[48]
          ),
          listen(
            div10,
            "dragover",
            /*dragover_handler_3*/
            ctx[53]
          ),
          listen(
            div10,
            "drop",
            /*drop_handler_3*/
            ctx[54]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*planned*/
      128 && t1_value !== (t1_value = /*planned*/
      ctx2[7].length + ""))
        set_data(t1, t1_value);
      if (dirty[0] & /*dragId, planned, handleDragStart, deleteTask, editTask, openTaskFile, updateStatus, dragOverStatus, dragOverIndex*/
      160142) {
        each_value_3 = ensure_array_like(
          /*planned*/
          ctx2[7]
        );
        each_blocks_3 = update_keyed_each(each_blocks_3, dirty, get_key, 1, ctx2, each_value_3, each0_lookup, div0, destroy_block, create_each_block_32, t4, get_each_context_32);
      }
      if (
        /*dragOverStatus*/
        ctx2[2] === "planned" && /*dragOverIndex*/
        ctx2[3] >= /*planned*/
        ctx2[7].length
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
      64 && t9_value !== (t9_value = /*backlog*/
      ctx2[6].length + ""))
        set_data(t9, t9_value);
      if (dirty[0] & /*dragId, backlog, handleDragStart, deleteTask, editTask, openTaskFile, updateStatus, dragOverStatus, dragOverIndex*/
      160078) {
        each_value_2 = ensure_array_like(
          /*backlog*/
          ctx2[6]
        );
        each_blocks_2 = update_keyed_each(each_blocks_2, dirty, get_key_1, 1, ctx2, each_value_2, each1_lookup, div3, destroy_block, create_each_block_23, t12, get_each_context_23);
      }
      if (
        /*dragOverStatus*/
        ctx2[2] === "backlog" && /*dragOverIndex*/
        ctx2[3] >= /*backlog*/
        ctx2[6].length
      ) {
        if (if_block1) {
        } else {
          if_block1 = create_if_block_82(ctx2);
          if_block1.c();
          if_block1.m(div3, t13);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (dirty[0] & /*running*/
      32 && t17_value !== (t17_value = /*running*/
      ctx2[5].length + ""))
        set_data(t17, t17_value);
      if (dirty[0] & /*dragId, running, handleDragStart, deleteTask, editTask, setFixed, toggleFixed, fileManager, openTaskFile, dragOverStatus, dragOverIndex*/
      241967) {
        each_value_1 = ensure_array_like(
          /*running*/
          ctx2[5]
        );
        each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key_2, 1, ctx2, each_value_1, each2_lookup, div6, destroy_block, create_each_block_13, t20, get_each_context_13);
      }
      if (
        /*dragOverStatus*/
        ctx2[2] === "running" && /*dragOverIndex*/
        ctx2[3] >= /*running*/
        ctx2[5].length
      ) {
        if (if_block2) {
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
      16 && t23_value !== (t23_value = /*review*/
      ctx2[4].length + ""))
        set_data(t23, t23_value);
      if (dirty[0] & /*dragId, review, handleDragStart, deleteTask, editTask, openTaskFile, dragOverStatus, dragOverIndex*/
      143646) {
        each_value = ensure_array_like(
          /*review*/
          ctx2[4]
        );
        each_blocks = update_keyed_each(each_blocks, dirty, get_key_3, 1, ctx2, each_value, each3_lookup, div9, destroy_block, create_each_block5, t26, get_each_context5);
      }
      if (
        /*dragOverStatus*/
        ctx2[2] === "review" && /*dragOverIndex*/
        ctx2[3] >= /*review*/
        ctx2[4].length
      ) {
        if (if_block3) {
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
function instance5($$self, $$props, $$invalidate) {
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
  function handleDragStart(e, id) {
    $$invalidate(1, dragId = id);
    if (e.dataTransfer) {
      e.dataTransfer.setData("text/plain", id);
    }
  }
  function handleDragOver(e, status) {
    e.preventDefault();
    if (!dragId)
      return;
    $$invalidate(2, dragOverStatus = status);
    const listEl = e.currentTarget.querySelector(".pos-board-list");
    if (!listEl)
      return;
    const cards = Array.from(listEl.querySelectorAll(".pos-board-card:not(.pos-dragging-source)"));
    let index = 0;
    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect();
      if (e.clientY < rect.top + rect.height / 2) {
        index = i;
        break;
      }
      index = i + 1;
    }
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
  const click_handler_2 = (task) => openTaskFile(task.id);
  const click_handler_3 = (task) => editTask(task);
  const click_handler_4 = (task) => deleteTask(task.id);
  const dragstart_handler = (task, e) => handleDragStart(e, task.id);
  const click_handler_5 = () => createPlannedTask("planned");
  const dragover_handler = (e) => handleDragOver(e, "planned");
  const drop_handler = (e) => handleDrop(e, "planned");
  const change_handler_1 = (task) => updateStatus(task, "planned");
  const click_handler_6 = (task) => openTaskFile(task.id);
  const click_handler_7 = (task) => editTask(task);
  const click_handler_8 = (task) => deleteTask(task.id);
  const dragstart_handler_1 = (task, e) => handleDragStart(e, task.id);
  const click_handler_9 = () => createPlannedTask("backlog");
  const dragover_handler_1 = (e) => handleDragOver(e, "backlog");
  const drop_handler_1 = (e) => handleDrop(e, "backlog");
  const click_handler_10 = (task) => openTaskFile(task.id);
  const click_handler_11 = (task) => fileManager.updateTask(task.id, { weight: Math.max(1, task.weight - 1) });
  const click_handler_12 = (task) => fileManager.updateTask(task.id, { weight: task.weight + 1 });
  const change_handler_2 = (task, e) => toggleFixed(task, e.currentTarget.checked);
  const change_handler_3 = (task, e) => setFixed(task, Number(e.currentTarget.value));
  const click_handler_13 = (task) => editTask(task);
  const click_handler_14 = (task) => deleteTask(task.id);
  const dragstart_handler_2 = (task, e) => handleDragStart(e, task.id);
  const dragover_handler_2 = (e) => handleDragOver(e, "running");
  const drop_handler_2 = (e) => handleDrop(e, "running");
  const click_handler_15 = (task) => openTaskFile(task.id);
  const click_handler_16 = (task) => editTask(task);
  const click_handler_17 = (task) => deleteTask(task.id);
  const dragstart_handler_3 = (task, e) => handleDragStart(e, task.id);
  const dragover_handler_3 = (e) => handleDragOver(e, "review");
  const drop_handler_3 = (e) => handleDrop(e, "review");
  $$self.$$set = ($$props2) => {
    if ("app" in $$props2)
      $$invalidate(18, app = $$props2.app);
    if ("fileManager" in $$props2)
      $$invalidate(0, fileManager = $$props2.fileManager);
    if ("projectId" in $$props2)
      $$invalidate(19, projectId = $$props2.projectId);
    if ("projectTasks" in $$props2)
      $$invalidate(20, projectTasks = $$props2.projectTasks);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*projectTasks*/
    1048576) {
      $:
        $$invalidate(7, planned = projectTasks.filter((t) => t.status === "planned"));
    }
    if ($$self.$$.dirty[0] & /*projectTasks*/
    1048576) {
      $:
        $$invalidate(6, backlog = projectTasks.filter((t) => t.status === "backlog"));
    }
    if ($$self.$$.dirty[0] & /*projectTasks*/
    1048576) {
      $:
        $$invalidate(5, running = projectTasks.filter((t) => t.status === "running"));
    }
    if ($$self.$$.dirty[0] & /*projectTasks*/
    1048576) {
      $:
        $$invalidate(4, review = projectTasks.filter((t) => t.status === "review"));
    }
  };
  return [
    fileManager,
    dragId,
    dragOverStatus,
    dragOverIndex,
    review,
    running,
    backlog,
    planned,
    handleDragStart,
    handleDragOver,
    handleDrop,
    createPlannedTask,
    editTask,
    openTaskFile,
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
    click_handler_4,
    dragstart_handler,
    click_handler_5,
    dragover_handler,
    drop_handler,
    change_handler_1,
    click_handler_6,
    click_handler_7,
    click_handler_8,
    dragstart_handler_1,
    click_handler_9,
    dragover_handler_1,
    drop_handler_1,
    click_handler_10,
    click_handler_11,
    click_handler_12,
    change_handler_2,
    change_handler_3,
    click_handler_13,
    click_handler_14,
    dragstart_handler_2,
    dragover_handler_2,
    drop_handler_2,
    click_handler_15,
    click_handler_16,
    click_handler_17,
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
      instance5,
      create_fragment5,
      safe_not_equal,
      {
        app: 18,
        fileManager: 0,
        projectId: 19,
        projectTasks: 20
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
  child_ctx[31] = list[i];
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
    ctx2[31].id
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
      if (dirty[0] & /*selectedTaskIds, sortedTasks, fileManager, editTask, openTaskFile, toggleSelection*/
      98657) {
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
    ctx[31].description + ""
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
      ctx2[31].description + ""))
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
    ctx[31].name + ""
  );
  let t1;
  let t2;
  let t3;
  let td2;
  let span1;
  let t4_value = (
    /*task*/
    ctx[31].status.toUpperCase() + ""
  );
  let t4;
  let span1_class_value;
  let t5;
  let td3;
  let t6_value = (
    /*task*/
    ctx[31].weight + ""
  );
  let t6;
  let t7;
  let td4;
  let t8_value = new Date(
    /*task*/
    ctx[31].createdAt
  ).toLocaleDateString() + "";
  let t8;
  let t9;
  let td5;
  let div1;
  let button0;
  let t11;
  let button1;
  let t13;
  let mounted;
  let dispose;
  function change_handler() {
    return (
      /*change_handler*/
      ctx[27](
        /*task*/
        ctx[31]
      )
    );
  }
  function click_handler_4() {
    return (
      /*click_handler_4*/
      ctx[28](
        /*task*/
        ctx[31]
      )
    );
  }
  let if_block = (
    /*task*/
    ctx[31].description && create_if_block_17(ctx)
  );
  function click_handler_5() {
    return (
      /*click_handler_5*/
      ctx[29](
        /*task*/
        ctx[31]
      )
    );
  }
  function click_handler_6() {
    return (
      /*click_handler_6*/
      ctx[30](
        /*task*/
        ctx[31]
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
      button0 = element("button");
      button0.textContent = "Edit";
      t11 = space();
      button1 = element("button");
      button1.textContent = "Delete";
      t13 = space();
      attr(input, "type", "checkbox");
      input.checked = input_checked_value = /*selectedTaskIds*/
      ctx[5].has(
        /*task*/
        ctx[31].id
      );
      attr(td0, "class", "pos-td-check");
      attr(span0, "class", "pos-td-task-title");
      attr(div0, "class", "pos-td-name-cell");
      attr(td1, "class", "pos-td-name");
      attr(span1, "class", span1_class_value = "pos-ptc-status-badge " + /*task*/
      ctx[31].status);
      attr(td2, "class", "pos-td-status");
      attr(td3, "class", "pos-td-weight font-mono");
      attr(td4, "class", "pos-td-date font-mono");
      attr(button1, "class", "pos-del");
      attr(div1, "class", "pos-grid-row-acts");
      attr(td5, "class", "pos-td-acts");
      toggle_class(
        tr,
        "selected",
        /*selectedTaskIds*/
        ctx[5].has(
          /*task*/
          ctx[31].id
        )
      );
      toggle_class(
        tr,
        "completed",
        /*task*/
        ctx[31].isCompleted
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
      append(div1, button0);
      append(div1, t11);
      append(div1, button1);
      append(tr, t13);
      if (!mounted) {
        dispose = [
          listen(input, "change", change_handler),
          listen(span0, "click", click_handler_4),
          listen(button0, "click", click_handler_5),
          listen(button1, "click", click_handler_6)
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
        ctx[31].id
      ))) {
        input.checked = input_checked_value;
      }
      if (dirty[0] & /*sortedTasks*/
      64 && t1_value !== (t1_value = /*task*/
      ctx[31].name + ""))
        set_data(t1, t1_value);
      if (
        /*task*/
        ctx[31].description
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
      ctx[31].status.toUpperCase() + ""))
        set_data(t4, t4_value);
      if (dirty[0] & /*sortedTasks*/
      64 && span1_class_value !== (span1_class_value = "pos-ptc-status-badge " + /*task*/
      ctx[31].status)) {
        attr(span1, "class", span1_class_value);
      }
      if (dirty[0] & /*sortedTasks*/
      64 && t6_value !== (t6_value = /*task*/
      ctx[31].weight + ""))
        set_data(t6, t6_value);
      if (dirty[0] & /*sortedTasks*/
      64 && t8_value !== (t8_value = new Date(
        /*task*/
        ctx[31].createdAt
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
            ctx[31].id
          )
        );
      }
      if (dirty[0] & /*sortedTasks*/
      64) {
        toggle_class(
          tr,
          "completed",
          /*task*/
          ctx[31].isCompleted
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
function create_fragment6(ctx) {
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
          ctx[22].call(select)
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
            ctx[21]
          ),
          listen(
            select,
            "change",
            /*select_change_handler*/
            ctx[22]
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
            ctx[23]
          ),
          listen(
            th2,
            "click",
            /*click_handler_1*/
            ctx[24]
          ),
          listen(
            th3,
            "click",
            /*click_handler_2*/
            ctx[25]
          ),
          listen(
            th4,
            "click",
            /*click_handler_3*/
            ctx[26]
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
function instance6($$self, $$props, $$invalidate) {
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
  const click_handler_4 = (task) => openTaskFile(task.id);
  const click_handler_5 = (task) => editTask(task);
  const click_handler_6 = (task) => fileManager.deleteTask(task.id);
  $$self.$$set = ($$props2) => {
    if ("app" in $$props2)
      $$invalidate(17, app = $$props2.app);
    if ("fileManager" in $$props2)
      $$invalidate(0, fileManager = $$props2.fileManager);
    if ("projectId" in $$props2)
      $$invalidate(18, projectId = $$props2.projectId);
    if ("projectTasks" in $$props2)
      $$invalidate(19, projectTasks = $$props2.projectTasks);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*projectTasks, searchQuery, statusFilter*/
    524294) {
      $:
        $$invalidate(20, filteredTasks = projectTasks.filter((task) => {
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
    1048600) {
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
    openTaskFile,
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
    click_handler_5,
    click_handler_6
  ];
}
var ProjectTaskGrid = class extends SvelteComponent {
  constructor(options) {
    super();
    init(
      this,
      options,
      instance6,
      create_fragment6,
      safe_not_equal,
      {
        app: 17,
        fileManager: 0,
        projectId: 18,
        projectTasks: 19
      },
      null,
      [-1, -1]
    );
  }
};
var ProjectTaskGrid_default = ProjectTaskGrid;

// src/ui/views/ProjectsView.svelte
function get_else_ctx(ctx) {
  const child_ctx = ctx.slice();
  const constants_0 = (
    /*$tasksStore*/
    child_ctx[7].filter((t) => t.project === /*selectedProject*/
    child_ctx[4].id).sort((a, b) => a.orderIndex - b.orderIndex)
  );
  child_ctx[19] = constants_0;
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
  let span;
  let t4_value = (
    /*selectedProject*/
    ctx[4].id + ""
  );
  let t4;
  let t5;
  let t6;
  let div2;
  let button1;
  let t8;
  let button2;
  let t10;
  let button3;
  let t12;
  let div3;
  let t13;
  let div4;
  let current_block_type_index;
  let if_block;
  let current;
  let mounted;
  let dispose;
  const if_block_creators = [create_if_block_18, create_else_block_1];
  const if_blocks = [];
  function select_block_type_1(ctx2, dirty) {
    if (
      /*projectTab*/
      ctx2[6] === "notes"
    )
      return 0;
    return 1;
  }
  function select_block_ctx(ctx2, index) {
    if (index === 1)
      return get_else_ctx(ctx2);
    return ctx2;
  }
  current_block_type_index = select_block_type_1(ctx, -1);
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
      span = element("span");
      t4 = text(t4_value);
      t5 = text(".md");
      t6 = space();
      div2 = element("div");
      button1 = element("button");
      button1.textContent = "\u{1F4C4} Notes";
      t8 = space();
      button2 = element("button");
      button2.textContent = "\u{1F4CB} Task Board";
      t10 = space();
      button3 = element("button");
      button3.textContent = "\u{1F4CA} Backlog Grid";
      t12 = space();
      div3 = element("div");
      t13 = space();
      div4 = element("div");
      if_block.c();
      attr(button0, "class", "pos-back-btn");
      attr(span, "class", "pos-editor-project-file");
      attr(div0, "class", "pos-editor-project-title");
      attr(div1, "class", "pos-editor-header-left");
      attr(button1, "class", "pos-tab-btn");
      toggle_class(
        button1,
        "active",
        /*projectTab*/
        ctx[6] === "notes"
      );
      attr(button2, "class", "pos-tab-btn");
      toggle_class(
        button2,
        "active",
        /*projectTab*/
        ctx[6] === "board"
      );
      attr(button3, "class", "pos-tab-btn");
      toggle_class(
        button3,
        "active",
        /*projectTab*/
        ctx[6] === "grid"
      );
      attr(div2, "class", "pos-editor-header-tabs");
      set_style(div3, "width", "100px");
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
      append(div0, t3);
      append(div0, span);
      append(span, t4);
      append(span, t5);
      append(header, t6);
      append(header, div2);
      append(div2, button1);
      append(div2, t8);
      append(div2, button2);
      append(div2, t10);
      append(div2, button3);
      append(header, t12);
      append(header, div3);
      append(div5, t13);
      append(div5, div4);
      if_blocks[current_block_type_index].m(div4, null);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            button0,
            "click",
            /*click_handler*/
            ctx[13]
          ),
          listen(
            button1,
            "click",
            /*click_handler_1*/
            ctx[14]
          ),
          listen(
            button2,
            "click",
            /*click_handler_2*/
            ctx[15]
          ),
          listen(
            button3,
            "click",
            /*click_handler_3*/
            ctx[16]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if ((!current || dirty & /*selectedProject*/
      16) && t2_value !== (t2_value = /*selectedProject*/
      ctx2[4].name + ""))
        set_data(t2, t2_value);
      if ((!current || dirty & /*selectedProject*/
      16) && t4_value !== (t4_value = /*selectedProject*/
      ctx2[4].id + ""))
        set_data(t4, t4_value);
      if (!current || dirty & /*projectTab*/
      64) {
        toggle_class(
          button1,
          "active",
          /*projectTab*/
          ctx2[6] === "notes"
        );
      }
      if (!current || dirty & /*projectTab*/
      64) {
        toggle_class(
          button2,
          "active",
          /*projectTab*/
          ctx2[6] === "board"
        );
      }
      if (!current || dirty & /*projectTab*/
      64) {
        toggle_class(
          button3,
          "active",
          /*projectTab*/
          ctx2[6] === "grid"
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
        ctx[12]
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
      2)
        projectshub_changes.app = /*app*/
        ctx2[1];
      if (dirty & /*fileManager*/
      4)
        projectshub_changes.fileManager = /*fileManager*/
        ctx2[2];
      if (dirty & /*plugin*/
      8)
        projectshub_changes.plugin = /*plugin*/
        ctx2[3];
      if (dirty & /*selectedProjectId*/
      1)
        projectshub_changes.onSelect = /*func*/
        ctx2[12];
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
function create_else_block_1(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block_27, create_else_block_2];
  const if_blocks = [];
  function select_block_type_2(ctx2, dirty) {
    if (
      /*projectTab*/
      ctx2[6] === "board"
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type_2(ctx, -1);
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
      current_block_type_index = select_block_type_2(ctx2, dirty);
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
function create_if_block_18(ctx) {
  let div4;
  let div0;
  let span;
  let t1;
  let button;
  let t3;
  let div3;
  let div2;
  let div1;
  let mounted;
  let dispose;
  return {
    c() {
      div4 = element("div");
      div0 = element("div");
      span = element("span");
      span.textContent = "\u{1F4C4} Note Preview";
      t1 = space();
      button = element("button");
      button.textContent = "Edit Note Natively \u2197";
      t3 = space();
      div3 = element("div");
      div2 = element("div");
      div1 = element("div");
      set_style(span, "font-weight", "700");
      set_style(span, "font-size", "0.85em");
      set_style(span, "color", "var(--text-muted)");
      set_style(span, "text-transform", "uppercase");
      set_style(span, "letter-spacing", "0.05em");
      set_style(span, "display", "flex");
      set_style(span, "align-items", "center");
      set_style(span, "gap", "6px");
      attr(button, "class", "pos-modal-primary");
      set_style(button, "padding", "4px 12px");
      set_style(button, "font-size", "0.85em");
      set_style(button, "font-weight", "600");
      attr(div0, "class", "pos-native-note-bar");
      set_style(div0, "display", "flex");
      set_style(div0, "justify-content", "space-between");
      set_style(div0, "align-items", "center");
      set_style(div0, "padding", "10px 16px");
      set_style(div0, "background", "var(--background-secondary)");
      set_style(div0, "border", "1px solid var(--background-modifier-border)");
      set_style(div0, "border-bottom", "none");
      set_style(div0, "border-radius", "8px 8px 0 0");
      set_style(div0, "flex-shrink", "0");
      attr(div1, "class", "markdown-preview-view markdown-rendered");
      set_style(div1, "color", "var(--text-normal)");
      set_style(div1, "line-height", "1.6");
      set_style(div1, "font-family", "var(--font-interface)");
      set_style(div1, "height", "100%");
      set_style(div2, "flex", "1");
      set_style(div2, "overflow-y", "auto");
      set_style(div2, "padding", "24px");
      set_style(div2, "min-height", "0");
      attr(div3, "class", "pos-editor-pane");
      set_style(div3, "border-radius", "0 0 8px 8px");
      set_style(div3, "flex", "1");
      set_style(div3, "min-height", "0");
      set_style(div3, "display", "flex");
      set_style(div3, "flex-direction", "column");
      set_style(div3, "overflow", "hidden");
      set_style(div3, "background", "var(--background-primary)");
      attr(div4, "class", "pos-project-split-workspace");
      set_style(div4, "flex-direction", "column");
      set_style(div4, "height", "100%");
    },
    m(target, anchor) {
      insert(target, div4, anchor);
      append(div4, div0);
      append(div0, span);
      append(div0, t1);
      append(div0, button);
      append(div4, t3);
      append(div4, div3);
      append(div3, div2);
      append(div2, div1);
      ctx[17](div1);
      if (!mounted) {
        dispose = listen(
          button,
          "click",
          /*handleOpenNoteNatively*/
          ctx[8]
        );
        mounted = true;
      }
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div4);
      }
      ctx[17](null);
      mounted = false;
      dispose();
    }
  };
}
function create_else_block_2(ctx) {
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
        ctx[19]
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
      if (dirty & /*app*/
      2)
        projecttaskgrid_changes.app = /*app*/
        ctx2[1];
      if (dirty & /*fileManager*/
      4)
        projecttaskgrid_changes.fileManager = /*fileManager*/
        ctx2[2];
      if (dirty & /*selectedProject*/
      16)
        projecttaskgrid_changes.projectId = /*selectedProject*/
        ctx2[4].id;
      if (dirty & /*$tasksStore, selectedProject*/
      144)
        projecttaskgrid_changes.projectTasks = /*projectTasks*/
        ctx2[19];
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
function create_if_block_27(ctx) {
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
        ctx[19]
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
      if (dirty & /*app*/
      2)
        projecttaskboard_changes.app = /*app*/
        ctx2[1];
      if (dirty & /*fileManager*/
      4)
        projecttaskboard_changes.fileManager = /*fileManager*/
        ctx2[2];
      if (dirty & /*selectedProject*/
      16)
        projecttaskboard_changes.projectId = /*selectedProject*/
        ctx2[4].id;
      if (dirty & /*$tasksStore, selectedProject*/
      144)
        projecttaskboard_changes.projectTasks = /*projectTasks*/
        ctx2[19];
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
function create_fragment7(ctx) {
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
  current_block_type_index = select_block_type(ctx, -1);
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
    p(ctx2, [dirty]) {
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
function instance7($$self, $$props, $$invalidate) {
  let activeProjects;
  let $projectsStore;
  let $tasksStore;
  component_subscribe($$self, projectsStore, ($$value) => $$invalidate(11, $projectsStore = $$value));
  component_subscribe($$self, tasksStore, ($$value) => $$invalidate(7, $tasksStore = $$value));
  let { app } = $$props;
  let { fileManager } = $$props;
  let { plugin } = $$props;
  let { selectedProjectId = null } = $$props;
  let selectedProject = null;
  let projectContent = "";
  let previewEl;
  let projectTab = "notes";
  async function loadProjectContent(id) {
    $$invalidate(9, projectContent = await fileManager.getProjectContent(id));
  }
  function handleOpenNoteNatively() {
    if (!selectedProject)
      return;
    const file = app.vault.getAbstractFileByPath(`projects/${selectedProject.id}.md`);
    if (file) {
      app.workspace.getLeaf("tab").openFile(file);
    }
  }
  const func = (id, m) => {
    $$invalidate(0, selectedProjectId = id);
  };
  const click_handler = () => $$invalidate(0, selectedProjectId = null);
  const click_handler_1 = () => $$invalidate(6, projectTab = "notes");
  const click_handler_2 = () => $$invalidate(6, projectTab = "board");
  const click_handler_3 = () => $$invalidate(6, projectTab = "grid");
  function div1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      previewEl = $$value;
      $$invalidate(5, previewEl);
    });
  }
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
    if ($$self.$$.dirty & /*$projectsStore*/
    2048) {
      $:
        $$invalidate(10, activeProjects = $projectsStore.filter((p) => p.status === "active"));
    }
    if ($$self.$$.dirty & /*selectedProjectId, activeProjects*/
    1025) {
      $: {
        if (selectedProjectId) {
          const proj = activeProjects.find((p) => p.id === selectedProjectId);
          if (proj) {
            $$invalidate(4, selectedProject = proj);
            loadProjectContent(selectedProjectId);
          } else {
            $$invalidate(4, selectedProject = null);
            $$invalidate(9, projectContent = "");
          }
        } else {
          $$invalidate(4, selectedProject = null);
          $$invalidate(9, projectContent = "");
          $$invalidate(6, projectTab = "notes");
        }
      }
    }
    if ($$self.$$.dirty & /*previewEl, projectContent, selectedProject, plugin*/
    568) {
      $: {
        if (previewEl && projectContent !== void 0 && selectedProject) {
          previewEl.empty();
          import_obsidian7.MarkdownRenderer.renderMarkdown(projectContent, previewEl, `projects/${selectedProject.id}.md`, plugin);
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
    projectTab,
    $tasksStore,
    handleOpenNoteNatively,
    projectContent,
    activeProjects,
    $projectsStore,
    func,
    click_handler,
    click_handler_1,
    click_handler_2,
    click_handler_3,
    div1_binding
  ];
}
var ProjectsView = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance7, create_fragment7, safe_not_equal, {
      app: 1,
      fileManager: 2,
      plugin: 3,
      selectedProjectId: 0
    });
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
