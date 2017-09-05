// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Button from './Button';
import CheckBox from './CheckBox';
import FormattedMessage from './FormattedMessage';
import Form from './Form';
import FormField from './FormField';
import Footer from './Footer';
import Heading from './Heading';
import Paragraph from './Paragraph';
import Box from './Box';

import CSSClassnames from '../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.LOGIN_FORM;

/**
 * 
 * @description The form used to log in.
 * 
 * ```js
 * import LoginForm from 'grommet/components/LoginForm';
 * 
 * <LoginForm onSubmit={...}
 *   logo={<Logo />}
 *   title='Sample Title'
 *   secondaryText='Sample secondary text'
 *   forgotPassword={<Anchor href='#'
 *   label='Forgot password?' />} />
 * ```
 */
export default class LoginForm extends Component {

  constructor(props, context) {
    super(props, context);

    this._onSubmit = this._onSubmit.bind(this);
    this._onUsernameChange = this._onUsernameChange.bind(this);
    this._onPasswordChange = this._onPasswordChange.bind(this);
    this._onRememberMeChange = this._onRememberMeChange.bind(this);
    this._onChange = this._onChange.bind(this);

    this.state = {
      password: '',
      rememberMe: props.defaultValues.rememberMe,
      username: props.defaultValues.username
    };
  }

  componentDidMount () {
    if (this.usernameRef) {
      this.usernameRef.focus();
    }
  }

  _onChange (args) {
    const { onChange } = this.props;

    if (onChange) {
      onChange(args);
    }
  }

  _onUsernameChange (event) {
    const username = event.target.value;
    this.setState({ username });
    this._onChange({ event, username });
  }

  _onPasswordChange (event) {
    const password = event.target.value;
    this.setState({ password });
    this._onChange({ event, password });
  }

  _onRememberMeChange (event) {
    const rememberMe = event.target.checked;
    this.setState({ rememberMe });
    this._onChange({ event, rememberMe });
  }

  _onSubmit (event) {
    event.preventDefault();
    const { onSubmit } = this.props;
    let { password, rememberMe, username } = this.state;

    username = username.trim();

    if (onSubmit) {
      onSubmit({username, password, rememberMe});
    }
  }

  render () {
    const {
      align, errors, forgotPassword,
      logo, onSubmit, rememberMe, secondaryText, title, usernameType
    } = this.props;

    const classes = classnames(CLASS_ROOT, this.props.className);
    const center = ! align || 'stretch' === align || 'center' === align;

    const errorsNode = errors.map((error, index) => {
      if (error) {
        let errorMessage;
        if (React.isValidElement(error)) {
          errorMessage = error;
        } else {
          errorMessage = <FormattedMessage id={error} defaultMessage={error} />;
        }
        return (
          <div key={index} className='error'>
            {errorMessage}
          </div>
        );
      }
      return undefined;
    });

    let titleNode;
    if (title) {
      titleNode = <Heading strong={true}>{title}</Heading>;
    }

    let secondaryTextNode;
    if (secondaryText) {
      secondaryTextNode = (
        <Paragraph align={align} margin="none">{secondaryText}</Paragraph>
      );
    }

    let rememberMeNode;
    if (rememberMe) {
      const rememberMeLabel = (
        <FormattedMessage id="Remember me" defaultMessage="Remember me" />
      );

      rememberMeNode = (
        <CheckBox label={rememberMeLabel} checked={this.state.rememberMe}
          onChange={this._onRememberMeChange} />
      );
    }

    const username = usernameType === 'email' ? (
      <FormattedMessage id="Email" defaultMessage="Email" />
    ) : (
      <FormattedMessage id="Username" defaultMessage="Username" />
    );

    const password = (
      <FormattedMessage id="Password" defaultMessage="Password" />
    );
    const login = <FormattedMessage id="Log In" defaultMessage="Log In" />;

    return (
      <Form className={classes} pad="medium" onSubmit={this._onSubmit}>
        <Box align={align}>
          {logo}
          {titleNode}
          {secondaryTextNode}
        </Box>
        <fieldset>
          <FormField htmlFor="username" label={username}>
            <input type={usernameType} ref={ref => this.usernameRef = ref}
              value={this.state.username}
              onChange={this._onUsernameChange} />
          </FormField>
          <FormField htmlFor="password" label={password}>
            <input type="password" value={this.state.password}
              onChange={this._onPasswordChange} />
          </FormField>
          {errorsNode}
        </fieldset>
        <Footer size="small" direction="column"
          align={center ? 'stretch' : 'start'}
          pad={{vertical: 'none', between: 'medium'}}>
          {rememberMeNode}
          <Button primary={true} fill={center}
            type={onSubmit ? "submit" : "button"}
            label={login}
            onClick={onSubmit ? this._onSubmit : undefined} />
          {forgotPassword}
        </Footer>
      </Form>
    );
  }

}

LoginForm.propTypes = {
  /**
   * @property {['start', 'center', 'end', 'stretch']} align - How to align the contents along the cross axis.
   */
  align: PropTypes.oneOf(['start', 'center', 'end', 'stretch']),
  /**
   * @property {PropTypes.shape} defaultValues - Default values for username and rememberMe
   */
  defaultValues: PropTypes.shape({
    username: PropTypes.string,
    rememberMe: PropTypes.bool
  }),
  /**
   * @property {[PropTypes.string,PropTypes.node]} errors - An array of error messages. Use this if there is a failure to log in.
   */
  errors: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ])),
  /**
   * @property {PropTypes.node} forgotPassword - A link that would take the user to a new page.
   */
  forgotPassword: PropTypes.node,
  /**
   * @property {PropTypes.node} logo - A react node. Best suited to an svg element or a custom component containing an svg element.
   */
  logo: PropTypes.node,
  /**
   * @property {PropTypes.func} onSubmit - Function that will be called with the username, password and rememberMe provided.
   */
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  /**
   * @property {PropTypes.bool} rememberMe - Whether to include a remember me input.
   */
  rememberMe: PropTypes.bool,
  /**
   * @property {PropTypes.string} secondaryText - Secondary text related to the product.
   */
  secondaryText: PropTypes.string,
  /**
   * @property {PropTypes.string} title - The product name.
   */
  title: PropTypes.string,
  /**
   * @property {PropTypes.string} usernameType - The type of username input. Defaults to email.
   */
  usernameType: PropTypes.string
};

LoginForm.defaultProps = {
  align: 'center',
  defaultValues: {
    username: '',
    rememberMe: false
  },
  errors: [],
  usernameType: 'email'
};
