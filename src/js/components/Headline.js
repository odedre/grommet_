// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CSSClassnames from '../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.HEADLINE;

/**
 * @description Headline text, usually used in marketing pages.
 * 
 * @example
 * import Headline from 'grommet/components/Headline';
 * 
 * <Headline strong={true}>
 *   Sample Headline
 * </Headline>
 * 
 */
export default class Headline extends Component {
  render () {
    const {
      align, children, className, margin, size, strong, ...props
    } = this.props;
    const classes = classnames(
      CLASS_ROOT,
      {
        [`${CLASS_ROOT}--${size}`]: size,
        [`${CLASS_ROOT}--align-${align}`]: align,
        [`${CLASS_ROOT}--margin-${margin}`]: margin,
        [`${CLASS_ROOT}--strong`]: strong
      },
      className
    );

    return (
      <div {...props} className={classes}>
        {children}
      </div>
    );
  }
}

Headline.propTypes = {
  /**
   * @property {start|center|end} align - The horizontal alignment of the Headline. Defaults to start.
   */
  align: PropTypes.oneOf(['start', 'center', 'end']),
  /**
   * @property {none|small|medium|large} margin - The vertical margin below the Headline. Defaults to medium.
   */
  margin: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  /**
   * @property {small|medium|large|xlarge} size - The size of the Headline. Defaults to medium. Note: xlarge should only be used for short, single word situations.
   */
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  /**
   * @property {PropTypes.bool} strong - If the headline should be bold. Defaults to false.
   */
  strong: PropTypes.bool
};
