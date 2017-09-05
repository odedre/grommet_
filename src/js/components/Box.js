// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import KeyboardAccelerators from '../utils/KeyboardAccelerators';
import Intl from '../utils/Intl';
import Props from '../utils/Props';
import { checkDarkBackground } from '../utils/DOM';
import SkipLinkAnchor from './SkipLinkAnchor';
import CSSClassnames from '../utils/CSSClassnames';
import { announce } from '../utils/Announcer';

const CLASS_ROOT = CSSClassnames.BOX;
const BACKGROUND_COLOR_INDEX = CSSClassnames.BACKGROUND_COLOR_INDEX;

/**
 * @description General purpose flexible box layout. This supports many, but not all, of the [flexbox](#) capabilities.
 * 
 * @example
 * import Box from 'grommet/components/Box';
 * 
 * <Box direction='row'
 *   justify='start'
 *   align='center'
 *   wrap={true}
 *   pad='medium'
 *   margin='small'
 *   colorIndex='light-2'
 *   onClick={...}
 *   onFocus={...}>
 *   <Value value={1}
 *     colorIndex='accent-1' />
 *   <Box direction='row'
 *     justify='start'
 *     align='center'
 *     wrap={true}
 *     pad='medium'
 *     margin='small'
 *     colorIndex='light-1'
 *     onClick={...}
 *     onFocus={...}>
 *     <Value value={2} />
 *   </Box>
 *   <Box direction='row'
 *     justify='start'
 *     align='center'
 *     wrap={true}
 *     pad='medium'
 *     margin='small'
 *     colorIndex='light-1'
 *     onClick={...}
 *     onFocus={...}>
 *     <Value value={3} />
 *   </Box>
 * </Box>
 * 
 */
export default class Box extends Component {

  constructor (props) {
    super(props);
    this.state = { mouseActive: false };
  }

  componentDidMount () {
    const { onClick } = this.props;
    if (onClick) {
      let clickCallback = () => {
        if (this.boxContainerRef === document.activeElement) {
          onClick();
        }
      };

      KeyboardAccelerators.startListeningToKeyboard(this, {
        enter: clickCallback,
        space: clickCallback
      });
    }

    this._setDarkBackground();
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.colorIndex !== this.props.colorIndex) {
      if (nextProps.colorIndex) {
        this.setState({ updateDarkBackground: true });
      } else {
        this.setState({ darkBackground: undefined });
      }
    }
  }

  componentDidUpdate () {
    if (this.props.announce) {
      announce(this.boxContainerRef.textContent);
    }
    if (this.state.updateDarkBackground) {
      this.setState({ updateDarkBackground: false });
      this._setDarkBackground();
    }
  }

  componentWillUnmount () {
    if (this.props.onClick) {
      KeyboardAccelerators.stopListeningToKeyboard(this);
    }
    if (this._checkBackground) {
      this._checkBackground.stop();
    }
  }

  _setDarkBackground () {
    const { colorIndex } = this.props;
    const box = findDOMNode(this.boxContainerRef);
    if (this._checkBackground) {
      this._checkBackground.stop();
    }
    this._checkBackground = checkDarkBackground(colorIndex, box,
      (darkBackground) => this.setState({ darkBackground }));
  }

  _normalize (string) {
    return string.replace('/', '-');
  }

  _addPropertyClass (classes, property, options = {}) {
    const value = (options.object || this.props)[property];
    const elementName = options.elementName || CLASS_ROOT;
    const prefix = options.prefix || property;
    if (value) {
      if (typeof value === 'string') {
        classes.push(`${elementName}--${prefix}-${this._normalize(value)}`);
      } else if (typeof value === 'object') {
        Object.keys(value).forEach((key) => {
          this._addPropertyClass(classes, key, {
            object: value, prefix: `${prefix}-${key}` });
        });
      } else {
        classes.push(`${elementName}--${this._normalize(prefix)}`);
      }
    }
  }

  _backgroundContextClass (darkBackground) {
    let result;
    if (undefined === darkBackground) {
      result = `${BACKGROUND_COLOR_INDEX}--pending`;
    } else if (darkBackground) {
      result = `${BACKGROUND_COLOR_INDEX}--dark`;
    } else {
      result = `${BACKGROUND_COLOR_INDEX}--light`;
    }
    return result;
  }

  render () {
    const {
      a11yTitle, appCentered, backgroundImage, children, className,
      colorIndex, containerClassName, focusable, full, id, onClick, onBlur,
      onFocus, onMouseDown, onMouseUp, pad, primary, role, size, tabIndex,
      tag, texture
    } = this.props;
    const { darkBackground, mouseActive } = this.state;
    let classes = [CLASS_ROOT];
    let containerClasses = [`${CLASS_ROOT}__container`];
    let restProps = Props.omit(this.props, Object.keys(Box.propTypes));
    this._addPropertyClass(classes, 'full');
    if (full && full.responsive === undefined) {
      // default is true for backwards compatibility sake
      classes.push(`${CLASS_ROOT}--full-responsive`);
    }
    this._addPropertyClass(classes, 'direction');
    this._addPropertyClass(classes, 'justify');
    this._addPropertyClass(classes, 'align');
    this._addPropertyClass(classes, 'alignContent',
      { prefix: 'align-content' });
    this._addPropertyClass(classes, 'alignSelf',
      { prefix: 'align-self' });
    this._addPropertyClass(classes, 'reverse');
    this._addPropertyClass(classes, 'responsive');
    this._addPropertyClass(classes, 'basis');
    this._addPropertyClass(classes, 'flex');
    this._addPropertyClass(classes, 'pad');
    this._addPropertyClass(classes, 'margin');
    this._addPropertyClass(classes, 'separator');
    this._addPropertyClass(classes, 'textAlign', { prefix: 'text-align' });
    this._addPropertyClass(classes, 'wrap');

    if (this.props.hasOwnProperty('flex')) {
      if (! this.props.flex) {
        classes.push(`${CLASS_ROOT}--flex-off`);
      }
    }
    if (size) {
      if (typeof size === 'object') {
        Object.keys(size).forEach((key) => {
          this._addPropertyClass(classes, key, { object: size });
        });
      } else {
        this._addPropertyClass(classes, 'size');
      }
      if (size) {
        if (!(size.width && size.width.max)) {
          // don't apply 100% max-width when size using size.width.max option
          classes.push(`${CLASS_ROOT}--size`);
        }
        if (size.width && size.width.max) {
          // allow widths to shrink, apply 100% width
          classes.push(`${CLASS_ROOT}--width-max`);
        }
      }
    }

    // needed to properly set flex-basis for 1/3 & 2/3 basis boxes
    if (pad && pad.between && children) {
      if (React.Children.count(children) % 3 === 0) {
        classes.push(`${CLASS_ROOT}--pad-between-thirds`);
      }
    }

    if (appCentered) {
      this._addPropertyClass(containerClasses, 'full',
        { elementName: `${CLASS_ROOT}__container` });
      if (colorIndex) {
        containerClasses.push(`${BACKGROUND_COLOR_INDEX}-${colorIndex}`);
        containerClasses.push(this._backgroundContextClass(darkBackground));
      }
      if (containerClassName) {
        containerClasses.push(containerClassName);
      }
    } else if (colorIndex) {
      classes.push(`${BACKGROUND_COLOR_INDEX}-${colorIndex}`);
      classes.push(this._backgroundContextClass(darkBackground));
    }

    let a11yProps = {};
    let clickableProps = {};
    if (onClick) {
      classes.push(CLASS_ROOT + "--clickable");
      clickableProps = {
        onMouseDown: (event) => {
          this.setState({ mouseActive: true });
          if (onMouseDown) {
            onMouseDown(event);
          }
        },
        onMouseUp: (event) => {
          this.setState({ mouseActive: false });
          if (onMouseUp) {
            onMouseUp(event);
          }
        },
        onFocus: (event) => {
          if (mouseActive === false) {
            this.setState({ focus: true });
          }
          if (onFocus) {
            onFocus(event);
          }
        },
        onBlur: (event) => {
          this.setState({ focus: false });
          if (onBlur) {
            onBlur(event);
          }
        }
      };
      if (focusable) {
        if (this.state.focus) {
          classes.push(`${CLASS_ROOT}--focus`);
        }
        let boxLabel = (typeof a11yTitle !== 'undefined') ?
          a11yTitle : Intl.getMessage(this.context.intl, 'Box');
        a11yProps.tabIndex = tabIndex || 0;
        a11yProps["aria-label"] = this.props['aria-label'] || boxLabel;
        a11yProps.role = role || 'group';
      }
    }

    let skipLinkAnchor;
    if (primary) {
      let mainContentLabel = (
        Intl.getMessage(this.context.intl, 'Main Content')
      );
      skipLinkAnchor = <SkipLinkAnchor label={mainContentLabel} />;
    }

    if (className) {
      classes.push(className);
    }

    let style = {};
    if (texture && 'string' === typeof texture) {
      if (texture.indexOf('url(') !== -1) {
        style.backgroundImage = texture;
      } else {
        style.backgroundImage = `url(${texture})`;
      }
    } else if (backgroundImage) {
      style.background = backgroundImage + " no-repeat center center";
      style.backgroundSize = "cover";
    }
    style = {...style, ...restProps.style};
    let textureMarkup;
    if ('object' === typeof texture) {
      textureMarkup = (
        <div className={CLASS_ROOT + "__texture"}>{texture}</div>
      );
    }

    const Component = tag;
    if (appCentered) {
      return (
        <div {...restProps} ref={(ref) => this.boxContainerRef = ref}
          className={containerClasses.join(' ')}
          style={style} role={role} {...a11yProps} {...clickableProps}>
          {skipLinkAnchor}
          <Component id={id} className={classes.join(' ')}>
            {textureMarkup}
            {children}
          </Component>
        </div>
      );
    } else {
      return (
        <Component {...restProps} ref={(ref) => this.boxContainerRef = ref}
          id={id} className={classes.join(' ')} style={style}
          role={role} tabIndex={tabIndex}
          onClick={onClick} {...a11yProps} {...clickableProps}>
          {skipLinkAnchor}
          {textureMarkup}
          {children}
        </Component>
      );
    }
  }

}

const FIXED_SIZES = ['xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge'];
const RELATIVE_SIZES = ['full', '1/2', '1/3', '2/3', '1/4', '3/4'];
const SIZES = FIXED_SIZES.concat(RELATIVE_SIZES);
const MARGIN_SIZES = ['small', 'medium', 'large', 'none'];
const PAD_SIZES = ['small', 'medium', 'large', 'xlarge', 'none'];

Box.propTypes = {
  /**
   * @property {PropTypes.string} a11yTitle - Custom title used by screen readers. Defaults to 'Box'. Only used if onClick handler is specified.
   */
  a11yTitle: PropTypes.string,
  announce: PropTypes.bool,
  /**
   * @property {start|center|end|baseline|stretch} align - How to align the contents along the cross axis.
   */
  align: PropTypes.oneOf(['start', 'center', 'end', 'baseline', 'stretch']),
  /**
   * @property {start|center|end|between|around|stretch} alignContent - How to align the contents when there is extra space in the cross axis. Defaults to stretch
   */
  alignContent: PropTypes.oneOf(['start', 'center', 'end', 'between',
    'around', 'stretch']),
  /**
   * @property {start|center|end|stretch} alignSelf - How to align within its container along the cross axis.
   */  
  alignSelf: PropTypes.oneOf(['start', 'center', 'end', 'stretch']),
  /**
   * @property {PropTypes.bool} appCentered - Whether the box background should stretch across an App that is centered.
   */
  appCentered: PropTypes.bool,
  backgroundImage: PropTypes.string,
  /**
   * @property {SIZES} basis - Whether to use a fixed or relative size within its container.
   */
  basis: PropTypes.oneOf(SIZES),
  /**
   * @property {PropTypes.string} colorIndex - The color identifier to use for the background color. For example: 'neutral-1'. See Color for possible values.
   */
  colorIndex: PropTypes.string,
  containerClassName: PropTypes.string,
  /**
   * @property {row|column} direction - The orientation to layout the child components in. Defaults to column.
   */
  direction: PropTypes.oneOf(['row', 'column']),
  /**
   * @property {PropTypes.bool} focusable - Whether keyboard focus should be added for clickable Boxes. Defaults to true.
   */
  focusable: PropTypes.bool,
  /**
   * @property {grow|shrink|true|false} flex - Whether flex-grow and/or flex-shrink is true.
   */
  flex: PropTypes.oneOf(['grow', 'shrink', true, false]),
  /**
   * @property {PropTypes.bool|PropTypes.string|PropTypes.shape} full - Whether the width and/or height should take the full viewport size.]
   */
  full: PropTypes.oneOfType(
    [
      PropTypes.bool,
      PropTypes.string,
      PropTypes.shape({
        vertical: PropTypes.bool,
        horizontal: PropTypes.bool,
        responsive: PropTypes.bool
      })
    ]
  ),
  /**
   * @property {PropTypes.func} onClick - Optional click handler.
   */
    // remove in 1.0?
  onClick: PropTypes.func,
  /**
   * @property {start|center|between|end|around} justify - How to align the contents along the main axis.
   */
  justify: PropTypes.oneOf(['start', 'center', 'between', 'end', 'around']),
  /**
   * @property {none|small|medium|large} margin - The amount of margin around the box. An object can be specified to distinguish horizontal margin, vertical margin, and margin on a particular side of the box: {horizontal: none|small|medium|large, vertical: none|small|medium|large, top|left|right|bottom: none|small|medium|large}. Defaults to none.
   */
  margin: PropTypes.oneOfType([
    PropTypes.oneOf(MARGIN_SIZES),
    PropTypes.shape({
      bottom: PropTypes.oneOf(MARGIN_SIZES),
      horizontal: PropTypes.oneOf(MARGIN_SIZES),
      left: PropTypes.oneOf(MARGIN_SIZES),
      right: PropTypes.oneOf(MARGIN_SIZES),
      top: PropTypes.oneOf(MARGIN_SIZES),
      vertical: PropTypes.oneOf(MARGIN_SIZES)
    })
  ]),
  /**
   * @property {none|small|medium|large} pad - The amount of padding to put around the contents. An object can be specified to distinguish horizontal padding, vertical padding, and padding between child components: {horizontal: none|small|medium|large, vertical: none|small|medium|large, between: none|small|medium|large}. Defaults to none. Padding set using between only affects components based on the direction set (adds horizontal padding between components for row, or vertical padding between components for column).
   */
  pad: PropTypes.oneOfType([
    PropTypes.oneOf(PAD_SIZES),
    PropTypes.shape({
      between: PropTypes.oneOf(PAD_SIZES),
      horizontal: PropTypes.oneOf(PAD_SIZES),
      vertical: PropTypes.oneOf(PAD_SIZES)
    })
  ]),
  /**
   * @property {PropTypes.bool} primary - Whether this is a primary Box that will receive skip to main content anchor. Defaults to false.
   */
  primary: PropTypes.bool,
  /**
   * @property {PropTypes.bool} reverse - Whether to reverse the order of the child components.

   */
  reverse: PropTypes.bool,
  /**
   * @property {PropTypes.bool} responsive - Whether children laid out in a row direction should be switched to a column layout when the display area narrows. Defaults to true.
   */
  responsive: PropTypes.bool,
  role: PropTypes.string,
  /**
   * @property {top|bottom|left|right|horizontal|vertical|all|none} separator - Add a separator.
   */
  separator: PropTypes.oneOf(['top', 'bottom', 'left', 'right',
    'horizontal', 'vertical', 'all', 'none']),
  /**
   * @property {auto|xsmall|small|medium|large|xlarge|xxlarge|full|PropTypes.object} size - The width of the Box. Defaults to auto. An object can be specified to distinguish width, height (with additional min and max options for width and height). E.g. {height: small, width: {max: large}}.
   */
    size: PropTypes.oneOfType([
    PropTypes.oneOf(['auto', 'xsmall', 'small', 'medium', 'large',
      'xlarge', 'xxlarge', 'full']), // remove in 1.0?, use basis
    PropTypes.shape({
      height: PropTypes.oneOfType([
        PropTypes.oneOf(SIZES),
        PropTypes.shape({
          max: PropTypes.oneOf(FIXED_SIZES),
          min: PropTypes.oneOf(FIXED_SIZES)
        })
      ]),
      width: PropTypes.oneOfType([
        PropTypes.oneOf(SIZES),
        PropTypes.shape({
          max: PropTypes.oneOf(FIXED_SIZES),
          min: PropTypes.oneOf(FIXED_SIZES)
        })
      ])
    })
  ]),
  /**
   * @property {PropTypes.string} tag - The DOM tag to use for the element. Defaults to div.

   */
  tag: PropTypes.string,
  /**
   * @property {left|center|right} textAlign - Set text-align for the Box contents.

   */
  textAlign: PropTypes.oneOf(['left', 'center', 'right']),
  /**
   * @property {PropTypes.node|PropTypes.string} texture - A texture image URL to apply to the background.
   */
  texture: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string
  ]),
  /**
   * @property {PropTypes.bool} wrap - Whether children can wrap if they can't all fit. Defaults to false.
   */
  wrap: PropTypes.bool
};

Box.contextTypes = {
  intl: PropTypes.object
};

Box.defaultProps = {
  announce: false,
  direction: 'column',
  pad: 'none',
  tag: 'div',
  responsive: true,
  focusable: true
};
