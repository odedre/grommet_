// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CSSClassnames from '../utils/CSSClassnames';
import Button from './Button';
import AddIcon from './icons/base/Add';
import SubtractIcon from './icons/base/Subtract';

const CLASS_ROOT = CSSClassnames.NUMBER_INPUT;
const INPUT = CSSClassnames.INPUT;

/**
 * @description A number input in a web form. We have a separate component from the browser base so we can style it.
 * ```js
 * import NumberInput from 'grommet/components/NumberInput';
 * 
 * <NumberInput value={10}
 *  onChange={...} />
 * ```
 */
export default class NumberInput extends Component {

  constructor(props, context) {
    super(props, context);

    this._onAdd = this._onAdd.bind(this);
    this._onSubtract = this._onSubtract.bind(this);
  }

  _fireChange () {
    let event;
    try {
      event = new Event('change', {
        'bubbles': true,
        'cancelable': true
      });
    } catch (e) {
      // IE11 workaround.
      event = document.createEvent('Event');
      event.initEvent('change', true, true);
    }
    // We use dispatchEvent to have the browser fill out the event fully.
    this._inputRef.dispatchEvent(event);
    // Manually dispatched events aren't delivered by React, so we notify too.
    this.props.onChange(event);
  }

  _onAdd () {
    const { max, step } = this.props;
    const input = this._inputRef;
    try {
      input.stepUp();
    } catch (e) {
      // IE11 workaround. See known issue #5 at
      // http://caniuse.com/#search=number
      let value = (parseFloat(input.value) || 0) + (step || 1);
      if (max !== undefined) {
        value = Math.min(value, max);
      }
      input.value = value;
    }
    this._fireChange();
  }

  _onSubtract () {
    const { min, step } = this.props;
    const input = this._inputRef;
    try {
      input.stepDown();
    } catch (e) {
      // IE11 workaround. See known issue #5 at
      // http://caniuse.com/#search=number
      let value = (parseFloat(input.value) || 0) - (step || 1);
      if (min !== undefined) {
        value = Math.max(value, min);
      }
      input.value = value;
    }
    this._fireChange();
  }

  render () {
    const { className, disabled, ...props } = this.props;

    const classes = classnames(
      CLASS_ROOT,
      {
        [`${CLASS_ROOT}--disabled`]: disabled
      },
      className
    );

    const onSubtract = (! disabled ? this._onSubtract : undefined);
    const onAdd = (! disabled ? this._onAdd : undefined);

    return (
      <span className={classes}>
        <input ref={ref => this._inputRef = ref} {...props}
          className={`${INPUT} ${CLASS_ROOT}__input`}
          type="number" tabIndex="0"
          disabled={disabled} />

        <Button icon={<SubtractIcon />}
          className={`${CLASS_ROOT}__subtract`} onClick={onSubtract} />

        <Button icon={<AddIcon />}
          className={`${CLASS_ROOT}__add`} onClick={onAdd} />
      </span>
    );
  }

}

NumberInput.propTypes = {
  /**
   * @property {PropTypes.number} defaultValue - Same as React <input defaultValue= >.
   */
  defaultValue: PropTypes.number,
  /**
   * @property {PropTypes.bool} disabled - Same as React <input disabled= >. Also adds a hidden input element with the same name so form submissions work.
   */
  disabled: PropTypes.bool,
  /**
   * @property {PropTypes.string} id - The DOM id attribute value to use for the underlying<input> element.
   */
  id: PropTypes.string,
  /**
   * @property {PropTypes.number} max - Maximum value.
   */
  max: PropTypes.number,
  /**
   * @property {PropTypes.number} min - Minimum value.
   */
  min: PropTypes.number,
  /**
   * @property {PropTypes.string} name - The DOM name attribute value to use for the underlying<input> element.
   */
  name: PropTypes.string,
  /**
   * @property {PropTypes.func} onChange - Same as React <input onChange= >.
   */
  onChange: PropTypes.func,
  /**
   * @property {PropTypes.number} step - Steps to increase and decrease by.
   */
  step: PropTypes.number,
  /**
   * @property {[PropTypes.number|PropTypes.string]} value -The value to put in the input. 
   */
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
