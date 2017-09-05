// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CSSClassnames from '../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.RADIO_BUTTON;

/**
 * @description A radio button in a web form. We have a separate component from the browser base so we can style it.
 * 
 * ```js
 * import RadioButton from 'grommet/components/RadioButton';
 * 
 * <FormField>
 *   <RadioButton id='choice1-1'
 *     name='choice1-1'
 *     label='Choice 1'
 *     checked={true}
 *     onChange={...} />
 *   <RadioButton id='choice1-2'
 *     name='choice1-2'
 *     label='Choice 2'
 *     checked={false}
 *     onChange={...} />
 * </FormField>
 * ```
 */
export default class RadioButton extends Component {
  render () {
    const { className, label, ...props } = this.props;
    const classes = classnames(
      CLASS_ROOT,
      {
        [`${CLASS_ROOT}--disabled`]: props.disabled
      },
      className
    );

    return (
      <label htmlFor={props.id} className={classes}>
        <input {...props} className={`${CLASS_ROOT}__input`}
          type="radio" />
        <span className={`${CLASS_ROOT}__control`} />
          <span className={`${CLASS_ROOT}__label`}>
            {label}
          </span>
      </label>
    );
  }
}

RadioButton.propTypes = {
  /**
   * @property {PropTypes.bool} checked - Same as React <input checked={} />.
   */
  checked: PropTypes.bool,
  /**
   * @property {PropTypes.bool} defaultChecked - Same as React <input defaultChecked={} />.
   */
  defaultChecked: PropTypes.bool,
  /**
   * @property {PropTypes.bool} disabled - Same as React <input disabled={} />.
   */
  disabled: PropTypes.bool,
  /**
   * @property {PropTypes.string} id - The DOM id attribute value to use for the underlying <input /> element.
   */
  id: PropTypes.string.isRequired,
  /**
   * @property {PropTypes.node} label - Label text to place next to the control.
   */
  label: PropTypes.node.isRequired,
  /**
   * @property {PropTypes.string} name - The DOM name attribute value to use for the underlying <input /> element.
   */
  name: PropTypes.string,
  /**
   * @property {PropTypes.func} onChange - Same as React <input onChange={} />.
   */
  onChange: PropTypes.func,
  /**
   * @property {PropTypes.string} value - The DOM value attribute to use for the underlying <input /> element.
   */
  value: PropTypes.string
};
