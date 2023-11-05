/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => AutoScrollPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  speed: "0.2"
};
var allowedSpeeds = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.5, 2];
var ribbonActiveClassName = "autoscroll-ribbon-active";
var AutoScrollPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.active = false;
    this.currentTop = 0;
    this.nextTop = 0;
  }
  stopScroll(text = "Stopping Auto Scroller") {
    window.clearInterval(this.intervalId);
    this.active = false;
    this.ribbonIconEl.removeClass(ribbonActiveClassName);
    new import_obsidian.Notice(text);
  }
  performScroll() {
    const view = app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
    if (view) {
      const editor = view.editor;
      const { top, left } = editor.getScrollInfo();
      if (this.nextTop - this.currentTop > 1) {
        editor.scrollTo(left, this.nextTop);
        const { top: newTop, left: newLeft } = editor.getScrollInfo();
        this.currentTop = newTop;
        if (newTop === this.nextTop) {
          this.stopScroll("Scrolled to the end!");
        }
      } else {
        this.currentTop = top;
        this.nextTop += this.speed;
      }
    }
  }
  increaseSpeed() {
    const currentSpeedIndex = allowedSpeeds.indexOf(this.speed) || allowedSpeeds.indexOf(0.5);
    if (currentSpeedIndex === allowedSpeeds.length - 1) {
      this.speed = allowedSpeeds[0];
    } else {
      this.speed = allowedSpeeds[currentSpeedIndex + 1];
    }
    new import_obsidian.Notice("Setting speed to " + this.speed);
  }
  async onload() {
    this.active = false;
    await this.loadSettings();
    this.speed = parseFloat(this.settings.speed);
    this.ribbonIconEl = this.addRibbonIcon("double-down-arrow-glyph", `Auto Scroller (speed ${this.speed})`, (evt) => {
      if (evt.button === 0) {
        const currentState = this.active;
        if (currentState) {
          this.stopScroll();
        } else {
          new import_obsidian.Notice("Starting Auto Scroller");
          this.ribbonIconEl.addClass(ribbonActiveClassName);
          this.active = true;
          this.speed = parseFloat(this.settings.speed);
          this.intervalId = this.registerInterval(window.setInterval(() => this.performScroll(), 10));
        }
      } else {
        this.increaseSpeed();
      }
    });
    this.addSettingTab(new AutoScrollSettingTab(this.app, this));
  }
  onunload() {
    window.clearInterval(this.intervalId);
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
var AutoScrollSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app2, plugin) {
    super(app2, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    const speedOptions = allowedSpeeds.reduce((acc, speed) => {
      const strSpeed = `${speed}`;
      acc[strSpeed] = strSpeed;
      return acc;
    }, {});
    containerEl.createEl("h2", { text: "Settings for Autoscroll Plugin" });
    new import_obsidian.Setting(containerEl).setName("Default scrolling speed").setDesc("The amount of pixels to pass in 10 ms").addDropdown((dropdown) => dropdown.addOptions(speedOptions).onChange(async (value) => {
      this.plugin.settings.speed = value;
      await this.plugin.saveSettings();
    }));
  }
};
