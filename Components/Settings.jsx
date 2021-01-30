const { React } = require("powercord/webpack");
const { TextInput } = require("powercord/components/settings");

module.exports = class Settings extends (
  React.PureComponent
) {
  render() {
    return (
      <div>
        <TextInput
          note={
            "The link you want to have stocks take you to, put {{symbol}} in place of where the stock symbol goes"
          }
          onChange={(val) => this.props.updateSetting("link", val)}
          defaultValue={this.props.getSetting(
            "link",
            "https://www.cnbc.com/quotes/{{symbol}}"
          )}
          required={false}
        >
          Link location
        </TextInput>
      </div>
    );
  }
};
