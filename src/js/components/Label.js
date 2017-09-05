// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CSSClassnames from '../utils/CSSClassnames';
import { announce } from '../utils/Announcer';

const CLASS_ROOT = CSSClassnames.LABEL;

/**
 * @description A simple text label. This could be used to annotate a [Value](#) to indicate what the value refers to. Or, it can annotate a [Card](#) to indicate a category.
 * 
 * @example
 * import Label from 'grommet/components/Label';
 * 
 * <Label>
 *   {contents}
 * </Label>
 */
export default class Label extends Component {

  componentDidUpdate () {
    if (this.props.announce) {
      announce(this.labelRef.textContent);
    }
  }

  render () {
    const {
      align, children, className, labelFor, margin, size, truncate, uppercase,
      ...props
    } = this.props;
    delete props.announce;
    let labelMargin = margin ? margin : ('small' === size ? 'none' : 'medium');
    let classes = classnames(
      CLASS_ROOT,
      {
        [`${CLASS_ROOT}--truncate`]: truncate,
        [`${CLASS_ROOT}--uppercase`]: uppercase,
        [`${CLASS_ROOT}--margin-${labelMargin}`]: labelMargin,
        [`${CLASS_ROOT}--${size}`]: size,
        [`${CLASS_ROOT}--align-${align}`]: align
      },
      className
    );

    return (
      <label ref={(ref) => this.labelRef = ref} {...props}
        className={classes} htmlFor={labelFor}>
        {children}
      </label>
    );
  }
}

Label.propTypes = {
  /**
   * @property {start|center|end} align - Text alignment. Defaults to inherit.
   */
  align: PropTypes.oneOf(['start', 'center', 'end']),
  /**
   * @property {PropTypes.bool} announce - Whether the label should announce dynamic content changes to a screen-reader using an aria-live region.
   */
  announce: PropTypes.bool,
  /**
   * @property {PropTypes.string} labelFor - ID of the form element that the label is for. Optional.
   */
  labelFor: PropTypes.string,
  /**
   * @property {none|small|medium|large} margin - The margin around the Label. Defaults to none when the size prop is set to small, otherwise medium.
   */
  margin: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  /**
   * @property {small|medium|large} size - The size of the Label. Defaults to medium.
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * @property {PropTypes.bool} truncate - Restrict the text to a single line and truncate with ellipsis if it is too long to all fit. Defaults to false.
   */
  truncate: PropTypes.bool,
  /**
   * @property {PropTypes.bool} uppercase - Convert the label to uppercase. Defaults to false.
   */
  uppercase: PropTypes.bool
};

Label.defaultProps = {
  size: 'medium'
};
