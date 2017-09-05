// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Box from './Box';
import Intl from '../utils/Intl';
import CSSClassnames from '../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.TITLE;

/**
 * @description Title component usually rendered inside a Header.
 * 
 * ```js
 * import Title from 'grommet/components/Title';
 * 
 * <Title>
 *   {contents}
 * </Title>
 * ```
 */
export default class Title extends Component {

  render () {
    const {
      a11yTitle, children, className, responsive, truncate, ...props
    } = this.props;
    const { intl } = this.context;
    const classes = classnames(
      CLASS_ROOT,
      {
        [`${CLASS_ROOT}--responsive`]: responsive,
        [`${CLASS_ROOT}--truncate`]: truncate,
        [`${CLASS_ROOT}--interactive`]: props.onClick
      },
      className
    );

    const boxTitle = a11yTitle || Intl.getMessage(intl, 'Title');

    let content;
    if( typeof children === 'string' ) {
      content = (
        <span>{children}</span>
      );
    } else if (Array.isArray(children)) {
      content = children.map((child, index) => {
        if (child && typeof child === 'string') {
          return <span key={index}>{child}</span>;
        }
        return child;
      });
    } else {
      content = children;
    }

    return (
      <Box {...props} align="center" direction="row" responsive={false}
        className={classes} a11yTitle={boxTitle}>
        {content}
      </Box>
    );
  }

}

Title.propTypes = {
  /**
   * @property {PropTypes.string} a11yTitle - Custom title used by screen readers. Default is 'Title'. Only used if onClick handler is specified.
   */
  a11yTitle: PropTypes.string,
  /**
   * @property {PropTypes.func} onClick - Click handler.
   */
  onClick: PropTypes.func,
  /**
   * @property {PropTypes.bool} responsive - Whether to only display the logo when the display area narrows.
   */
  responsive: PropTypes.bool,
  /**
   * @property {PropTypes.bool} truncate - Restrict the text to a single line and truncate with ellipsis if it is too long to all fit. Defaults to true.
   */
  truncate: PropTypes.bool
};

Title.contextTypes = {
  intl: PropTypes.object
};

Title.defaultProps = {
  responsive: true,
  truncate: true
};
