const { React, getModuleByDisplayName } = require("powercord/webpack");

class SymbolLink extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { symbol } = this.props;

    const tag = symbol.match(/\$([A-Z]{1,5})/)[1];

    const url = this.props.link.replace("{{symbol}}", tag);

    return (
      <span {...this.props}>
        <a
          title={url}
          rel={"noreferrer noopener"}
          href={url}
          role={"button"}
          target={"_blank"}
        >
          {symbol}
        </a>
      </span>
    );
  }
}

module.exports = SymbolLink;
