import cx from "classnames";
import PropTypes from "prop-types";
import { Component } from "react";

import CS from "metabase/css/core/index.css";
import { PLUGIN_LOGO_ICON_COMPONENTS } from "metabase/plugins";

class DefaultLogoIcon extends Component {
  static defaultProps = {
    height: 30,
    alt: "GalaxyOneLogoSetup",
  };

  render() {
    const { height, width } = this.props;
    return (
      <img
        src="./app/assets/img/logo.png"
        alt="GalaxyOneLogoWelcome"
        // width={width || 400}
        height={height || 100}
      />
    );
  }
}

export default function LogoIcon(props) {
  return <DefaultLogoIcon {...props} />;
}
