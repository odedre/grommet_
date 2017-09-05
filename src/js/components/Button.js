// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CSSClassnames, { namespace } from '../utils/CSSClassnames';

import Box from './Box';

const CLASS_ROOT = CSSClassnames.BUTTON;

function getHoverModifier(hoverIndicator) {
  if (hoverIndicator) {
    if (typeof hoverIndicator === 'object') {
      if (hoverIndicator.background) {
        if (typeof hoverIndicator.background === 'string') {
          const prefix = `${namespace}background-hover-color-index-`;
          return `${prefix}${hoverIndicator.background}`;
        }
        return `${CLASS_ROOT}--hover-background`;
      }
    } else if (typeof hoverIndicator === 'string') {
      return (`${CLASS_ROOT}--hover-${hoverIndicator}`);
    }
  }
}

/**
 * @description A button. We have a separate component from the browser base so we can style it.
 * 
 * @example
 * import Button from 'grommet/components/Button';
 * 
 * <Button icon={<Edit />}
 *   label='Label'
 *   onClick={...}
 *   href='#'
 *   primary={true}
 *   secondary={true}
 *   accent={true}
 *   critical={true}
 *   plain={true}
 *   path='/' />
 * 
 */
export default class Button extends Component {

  constructor () {
    super();
    this._onClick = this._onClick.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this.state = {
      mouseActive: false,
      focus: false
    };
  }

  _onClick (event) {
    const { method, onClick, path} = this.props;
    const { router } = this.context;
    const modifierKey = event.ctrlKey || event.metaKey;

    if (modifierKey && !onClick) {
      return true;
    }

    event.preventDefault();

    if ('push' === method) {
      (router.history || router).push(path);
    } else if ('replace' === method) {
      (router.history || router).replace(path);
    }

    if (onClick) {
      onClick(...arguments);
    }
  }

  _onMouseDown (event) {
    const { onMouseDown } = this.props;
    this.setState({ mouseActive: true });
    if (onMouseDown) {
      onMouseDown(event);
    }
  }

  _onMouseUp (event) {
    const { onMouseUp } = this.props;
    this.setState({ mouseActive: false });
    if (onMouseUp) {
      onMouseUp(event);
    }
  }

  _onFocus (event) {
    const { onFocus } = this.props;
    const { mouseActive } = this.state;
    if (mouseActive === false) {
      this.setState({ focus: true });
    }
    if (onFocus) {
      onFocus(event);
    }
  }

  _onBlur (event) {
    const { onBlur } = this.props;
    this.setState({ focus: false });
    if (onBlur) {
      onBlur(event);
    }
  }

  render () {
    const {
      a11yTitle, accent, align, box, children, className, critical, fill,
      hoverIndicator, href, icon, label, onClick, path, plain, primary, reverse,
      secondary, type, ...props
    } = this.props;
    delete props.method;
    const { router } = this.context;

    let buttonIcon;
    if (icon) {
      buttonIcon = <span className={`${CLASS_ROOT}__icon`}>{icon}</span>;
    }

    let buttonLabel;
    if (label) {
      buttonLabel = <span className={`${CLASS_ROOT}__label`}>{label}</span>;
    }

    let adjustedHref;
    if (router && router.createPath) {
      adjustedHref = (path && router) ?
        router.createPath(path) : href;
    } else {
      adjustedHref = (path && router && router.history) ?
        router.history.createHref(
          { pathname: path }
        ) : href;
    }

    const classes = classnames(
      CLASS_ROOT,
      {
        [`${CLASS_ROOT}--box`]: box,
        [`${CLASS_ROOT}--critical`]: critical,
        [`${CLASS_ROOT}--focus`]: this.state.focus,
        [`${CLASS_ROOT}--primary`]: primary,
        [`${CLASS_ROOT}--secondary`]: secondary,
        [`${CLASS_ROOT}--accent`]: accent,
        [`${CLASS_ROOT}--disabled`]:
          !onClick &&
          !adjustedHref &&
          ['reset', 'submit'].indexOf(type) === -1,
        [`${CLASS_ROOT}--fill`]: fill,
        [`${CLASS_ROOT}--plain`]: (
          plain || box || Children.count(children) > 0 || (icon && ! label)
        ),
        [`${CLASS_ROOT}--align-${align}`]: align,
        [getHoverModifier(hoverIndicator)]: hoverIndicator
      },
      className
    );

    let adjustedOnClick = (path && router ? this._onClick : onClick);

    let Tag = adjustedHref ? 'a' : 'button';
    let buttonType;
    if (!adjustedHref) {
      buttonType = type;
    }

    let boxProps;
    if (box) {
      // Let the root element of the Button be a Box element with tag prop
      boxProps = {
        tag: Tag
      };
      Tag = Box;
    }

    const first = reverse ? buttonLabel : buttonIcon;
    const second = reverse ? buttonIcon : buttonLabel;

    return (
      <Tag {...props} {...boxProps} href={adjustedHref} type={buttonType}
        className={classes} aria-label={a11yTitle}
        onClick={adjustedOnClick}
        disabled={
          !onClick &&
          !adjustedHref &&
          ['reset', 'submit'].indexOf(type) === -1
        }
        onMouseDown={this._onMouseDown} onMouseUp={this._onMouseUp}
        onFocus={this._onFocus} onBlur={this._onBlur}>
        {first}
        {second}
        {children}
      </Tag>
    );
  }
}

Button.propTypes = {
  a11yTitle: PropTypes.string,
  /**
   * @property {PropTypes.bool} accent - Whether this is an accent button.
   */
  accent: PropTypes.bool,
  align: PropTypes.oneOf(['start', 'center', 'end']),
  /**
   * @property {PropTypes.bool} box - Whether the button should support Box props. This is useful if you want your children to be a flexbox container. Default is false.
   */
  box: PropTypes.bool,
  /**
   * @property {PropTypes.bool} critical - Whether this is a critical button.
   */
  critical: PropTypes.bool,
  /**
   * @property {PropTypes.bool} fill - Whether the button expands to fill all of the available width and height.
   */
  fill: PropTypes.bool,
  /**
   * @property {background|PropTypes.object} hoverIndicator - Optional. The hover indicator to apply when the user is mousing over the button. An object can be also be specified for color index support: {background: 'neutral-2'}. This prop is meant to be used only with plain Buttons.
   */
  hoverIndicator: PropTypes.oneOfType([
    PropTypes.oneOf(['background']),
    PropTypes.shape({
      background: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
      ])
    })
  ]),
  /**
   * @property {PropTypes.string} href - If specified, the button will behave like an anchor tag.
   */
  href: PropTypes.string,
  /**
   * @property {PropTypes.element} icon - Icon element to place in the button. See Icon.
   */
  icon: PropTypes.element,
  /**
   * @property {PropTypes.node} label - Label text to place in the button.
   */
  label: PropTypes.node,
  /**
   * @property {push|replace} method - Valid only when used with path. Indicates whether the browser history should be appended to or replaced. The default is push.
   */
  method: PropTypes.oneOf(['push', 'replace']),
  /**
   * @property {PropTypes.func} onClick - Click handler. Not setting this property and not specifying a path causes the Button to be disabled.
   */
  onClick: PropTypes.func,
  /**
   * @property {PropTypes.string} path - React-router path to navigate to when clicked.
   */
  path: PropTypes.string,
  /**
   * @property {PropTypes.bool} plain - Whether this is a plain button with no border or padding. Use this when wrapping children that provide the complete visualization of the control. Do not use plain with label or icon properties.
   */
  plain: PropTypes.bool,
  /**
   * @property {PropTypes.bool} primary - Whether this is a primary button. There should be at most one per page or screen.
   */
  primary: PropTypes.bool,
  reverse: PropTypes.bool,
  /**
   * @property {PropTypes.bool} secondary - Whether this is a secondary button.
   */
  secondary: PropTypes.bool,
  /**
   * @property {button|reset|submit} type - The type of button. Set the type to submit for the default button on forms. Defaults to button.
   */
  type: PropTypes.oneOf(['button', 'reset', 'submit'])
};

Button.defaultProps = {
  method: 'push',
  type: 'button'
};

Button.contextTypes = {
  router: PropTypes.object
};
