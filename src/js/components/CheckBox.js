// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CSSClassnames from '../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.CHECK_BOX;

/**
 *
 * @description A check box in a web form. We have a separate component from the browser base so we can style it.
 * 
 * @example
 *  import CheckBox from 'grommet/components/CheckBox';
 * 
 * <CheckBox label='Sample label'
 *   toggle={false}
 *   disabled={false}
 *   reverse={false} />
 * 
 */

export default class CheckBox extends Component {
  render () {
    const {
      checked, className, disabled, label, name, onChange, reverse, toggle,
      ...props
    } = this.props;
    const classes = classnames(
      CLASS_ROOT,
      {
        [`${CLASS_ROOT}--toggle`]: toggle,
        [`${CLASS_ROOT}--disabled`]: disabled,
        [`${CLASS_ROOT}--reverse`]: reverse
      },
      className
    );

    let hidden;
    if (disabled && checked) {
      hidden = (
        <input name={name} type='hidden' value='true'/>
      );
    }

    const children = [
      <span key='checkbox'>
        <input {...props} tabIndex='0' className={`${CLASS_ROOT}__input`}
          name={name} type='checkbox'
          disabled={disabled}
          checked={checked}
          onChange={onChange} />
        <span className={`${CLASS_ROOT}__control`}>
          <svg className={`${CLASS_ROOT}__control-check`} viewBox='0 0 24 24'
            preserveAspectRatio='xMidYMid meet'>
            <path fill='none' d='M6,11.3 L10.3,16 L18,6.2' />
          </svg>
        </span>
      </span>,
      <span key='label' className={`${CLASS_ROOT}__label`}>
        {label}
      </span>
    ];

    return (
      <label className={classes} htmlFor={props.id}>
        {reverse ? children.reverse() : children}
        {hidden}
      </label>
    );
  }

}

CheckBox.propTypes = {
  /**
   * @property {PropTypes.bool} checked - Same as React <input checked={} />.
   */
  checked: PropTypes.bool,
  /**
   * @property {PropTypes.bool} disabled - Same as React <input disabled={} />. Also adds a hidden input element with the same name so form submissions work.
   */
  disabled: PropTypes.bool,
  /**
   * @property {PropTypes.string} id - The DOM id attribute value to use for the underlying <input/> element.
   */
  id: PropTypes.string,
  /**
   * @property {PropTypes.node} label - Label text to place next to the control.
   */
  label: PropTypes.node,
  /**
   * @property {PropTypes.string} name - The DOM name attribute value to use for the underlying <input/> element.
   */
  name: PropTypes.string,
  /**
   * @property {PropTypes.func} onChange - Same as React <input onChange={} />.
   */
  onChange: PropTypes.func,
  /**
   * @property {PropTypes.bool} reverse - Whether to show the label in front of the checkbox. Defaults to false.
   */
  reverse: PropTypes.bool,
  /**
   * @property {PropTypes.bool} toggle - Whether to visualize it as a toggle switch. Defaults to false.
   */
  toggle: PropTypes.bool
};
