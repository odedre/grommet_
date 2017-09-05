// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CSSClassnames from '../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.PARAGRAPH;

/**
 * @description A paragraph of text
 * 
 * ```js
 * import Paragraph from 'grommet/components/Paragraph';
 * 
 * <Paragraph>
 *   Raised on hip-hop and foster care, defiant city kid Ricky
 * gets a fresh start in the New Zealand countryside. He quickly finds himself
 * at home with his new foster family
 * </Paragraph>
 * ```
 */
export default class Paragraph extends Component {
  render () {
    const {
      align, children, className, margin, size, width, ...props
    } = this.props;
    const classes = classnames(
      CLASS_ROOT,
      {
        [`${CLASS_ROOT}--${size}`]: size,
        [`${CLASS_ROOT}--align-${align}`]: align,
        [`${CLASS_ROOT}--margin-${margin}`]: margin,
        [`${CLASS_ROOT}--width-${width}`]: width
      },
      className
    );

    return (
      <p {...props} className={classes}>
        {children}
      </p>
    );
  }
}

Paragraph.propTypes = {
  /**
   * @property {['start', 'center', 'end']} align - Text alignment. Defaults to inherit.
   */
  align: PropTypes.oneOf(['start', 'center', 'end']),
  /**
   * @property {['none', 'small', 'medium', 'large']} margin - Vertical margin.
   */
  margin: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  /**
   * @property {['small', 'medium', 'large', 'xlarge']} size - The size of the Paragraph text. Defaults to medium.
   */
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  width: PropTypes.oneOf(['small', 'medium', 'large'])
};
