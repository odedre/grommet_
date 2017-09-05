// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CSSClassnames from '../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.FORM_FIELD;

/**
 * @description A field in a web form.
 * 
 * @example
 * import FormField from 'grommet/components/FormField';
 * 
 * <Form>
 *   <FormField label='Sample label'
 *     help='sample help'
 *     error='sample error'>
 *     <TextInput />
 *   </FormField>
 * </Form>
 * 
 */
export default class FormField extends Component {

  constructor(props, context) {
    super(props, context);

    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onClick = this._onClick.bind(this);

    this.state = { focus: false };
  }

  componentDidMount () {
    const contentsElement = this.contentsRef;
    if (contentsElement) {
      const inputElements = (
        contentsElement.querySelectorAll('input, textarea, select')
      );
      if (inputElements.length === 1) {
        this._inputElement = inputElements[0];
        this._inputElement.addEventListener('focus', this._onFocus);
        this._inputElement.addEventListener('blur', this._onBlur);
      }
    }
  }

  componentWillUnmount () {
    if (this._inputElement) {
      this._inputElement.removeEventListener('focus', this._onFocus);
      this._inputElement.removeEventListener('blur', this._onBlur);
      delete this._inputElement;
    }
  }

  _onFocus () {
    this.setState({focus: true});
  }

  _onBlur () {
    this.setState({focus: false});
  }

  _onClick () {
    if (this._inputElement) {
      this._inputElement.focus();
    }
  }

  render () {
    const {
      children, className, help, hidden, htmlFor, label, size, strong, error,
      ...props
    } = this.props;

    const classes = classnames(
      CLASS_ROOT,
      {
        [`${CLASS_ROOT}--focus`]: this.state.focus,
        [`${CLASS_ROOT}--hidden`]: hidden,
        [`${CLASS_ROOT}--text`]: htmlFor,
        [`${CLASS_ROOT}--size-${size}`]: size,
        [`${CLASS_ROOT}--strong`]: strong,
        [`${CLASS_ROOT}--error`]: error
      },
      className
    );

    const fieldError = (error)
      ? <span className={CLASS_ROOT + "__error"}>{error}</span>
      : undefined;

    const fieldHelp = (help !== null && help !== undefined)
      ? <span className={CLASS_ROOT + "__help"}>{this.props.help}</span>
      : undefined;

    const labelNode = (label) ? (
      <label className={CLASS_ROOT + "__label"} htmlFor={htmlFor}>
        {label}
      </label>
    ) : undefined;

    return (
      <div className={classes} {...props} onClick={this._onClick}>
        {fieldError}
        {labelNode}
        {fieldHelp}
        <span ref={ref => this.contentsRef = ref}
          className={CLASS_ROOT + "__contents"}>
          {children}
        </span>
      </div>
    );
  }

}

FormField.propTypes = {
  /**
   * @property {PropTypes.node} error - Validation errors.
   */
  error: PropTypes.node,
  /**
   * @property {PropTypes.node} help - Helpful text.
   */
  help: PropTypes.node,
  /**
   * @property {PropTypes.bool} hidden - Whether the FormField should be hidden. Defaults to false. This property will most likely be removed in Grommet 2.0. Consider using React state to manage the FormFields you want to show/hide.
   */
  hidden: PropTypes.bool,
  /**
   * @property {PropTypes.string} htmlFor - Id of the input element that the label should be associated with.
   */
  htmlFor: PropTypes.string,
  /**
   * @property {PropTypes.node} label - Label for the field.
   */
  label: PropTypes.node,
  /**
   * @property {medium|large} size - The size of the input text font. Defaults to medium. This property will most likely be removed in Grommet 2.0.
   */
  size: PropTypes.oneOf(['medium', 'large']),
  /**
   * @property {PropTypes.bool} strong - Whether the text for the input field should be strong. Defaults to false. This property will most likely be removed in Grommet 2.0.
   */
  strong: PropTypes.bool
};

FormField.defaultProps = {
  size: 'medium',
  strong: false
};
