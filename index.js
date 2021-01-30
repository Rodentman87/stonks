/**
 * stonks
 *
 */

const { Plugin } = require("powercord/entities");
const { inject, uninject } = require("powercord/injector");
const { React, getModule } = require("powercord/webpack");

const Stonk = require("./Components/Stonk");

const Settings = require("./Components/Settings");

const componentTypesToCheck = ["u", "em", "strong"];

const tagRegex = /\$[A-Z]{1,5}/g;

module.exports = class Stonks extends (
  Plugin
) {
  async startPlugin() {
    powercord.api.settings.registerSettings("stonks", {
      category: this.entityID,
      label: "Stonks",
      render: Settings,
    });

    this.loadStylesheet("style.css");

    const parser = await getModule(["parse", "parseTopic"]);

    const process = this.process.bind(this);
    inject(`stonks`, parser, "parse", process);
  }

  process(args, res, ops = {}) {
    const final = [];
    res.forEach((piece) => {
      if (!(typeof piece === "string")) {
        if (componentTypesToCheck.includes(piece.type)) {
          // This piece of the message is one of the react elements I want to check, I can just run this function recursively
          piece.props.children = this.process({}, piece.props.children);
        }
        if (piece.type.name && piece.type.name === "StringPart") {
          // This is a Base64 tooltip caught by Message Tooltips
          piece.props.parts = this.process({}, piece.props.parts);
        }
        final.push(piece);
        return;
      }
      if (!piece.match(tagRegex)) {
        final.push(piece);
        return;
      }
      const words = piece.split(/(\$[A-Z]{1,5})/);
      words.forEach((word) => {
        if (!word.match(tagRegex)) {
          final.push(word);
          return;
        }
        final.push(
          React.createElement(Stonk, {
            symbol: word,
            link: this.settings.get(
              "link",
              "https://www.cnbc.com/quotes/{{symbol}}"
            ),
          })
        );
      });
    });
    return final;
  }

  pluginWillUnload() {
    uninject("stonks");
    powercord.api.settings.unregisterSettings("stonks");
  }
};
