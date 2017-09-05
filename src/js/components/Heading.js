// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CSSClassnames from '../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.HEADING;

/**
 * @description An HTML heading, one of h1, h2, h3, h4, h5, h6. See [Typography](#) for examples of all heading tags.
 * 
 * @example
 * import Heading from 'grommet/components/Heading';
 * 
 * <Heading strong={false}
 *   uppercase={true}
 *   truncate={true}>
 *   Sample Heading
 * </Heading>
 * 
 */
export default class Heading extends Component {
  render() {
    const {
      align, children, className, margin, size, strong, tag: Tag, truncate,
      uppercase, ...props
    } = this.props;
    const classes = classnames(
      CLASS_ROOT, {
        [`${CLASS_ROOT}--${size}`]: size,
        [`${CLASS_ROOT}--strong`]: strong,
        [`${CLASS_ROOT}--align-${align}`]: align,
        [`${CLASS_ROOT}--margin-${margin}`]: margin,
        [`${CLASS_ROOT}--truncate`]: truncate,
        [`${CLASS_ROOT}--uppercase`]: uppercase
      },
      className
    );

    return (
      <Tag {...props} className={classes}>
        {children}
      </Tag>
    );
  }
}

Heading.propTypes = {
  /**
   * @property {start|center|end} align - The horizontal alignment of the Heading. Defaults to start.
   */
  align: PropTypes.oneOf(['start', 'center', 'end']),
  /**
   * @property {none|small|medium|large} margin - The vertical margin below the Heading. Defaults to medium.
   */
  margin: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * @property {PropTypes.bool} strong - If the Heading should be bold. Defaults to false.
   */
  strong: PropTypes.bool,
  /**
   * @property {PropTypes.string} tag - Which HTML heading level should be used. Defaults to h1.
   */
  tag: PropTypes.string,
  /**
   * @property {PropTypes.bool} truncate - Restrict the text to a single line and truncate with ellipsis if it is too long to all fit. Defaults to false.
   */
  truncate: PropTypes.bool,
  /**
   * @property {PropTypes.bool} uppercase - Convert the heading to uppercase. Defaults to false.
   */
  uppercase: PropTypes.bool
};

Heading.defaultProps = {
  tag: 'h1'
};
