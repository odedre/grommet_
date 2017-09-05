// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Box from './Box';
import CSSClassnames from '../utils/CSSClassnames';
import Drop from '../utils/Drop';

const CLASS_ROOT = CSSClassnames.TIP;

/**
 * @description An attention getter used to highlight an aspect of the interface that might not be apparent at first glance. This should be used sparingly. Only one Tip should ever be shown on the screen at a time and only when it is referring to an action the user is likely to need or try imminitely.
 *
 * ```js
 * import Tip from 'grommet/components/Tip';
 * 
 * <Tip target='actions'
 *   onClose={...}>
 *   Available actions
 * </Tip>
 * ```
 */
export default class Tip extends Component {

  constructor (props) {
    super();
    this._getTarget = this._getTarget.bind(this);
    this._onResize = this._onResize.bind(this);
  }

  componentDidMount () {
    const { onClose, colorIndex } = this.props;
    const target = this._getTarget();
    if (target) {
      const rect = target.getBoundingClientRect();
      let align = {
        left: (
          rect.left < (window.innerWidth - rect.right) ? 'left' : undefined
        ),
        right: (
          rect.left >= (window.innerWidth - rect.right) ? 'right' : undefined
        ),
        top: (
          rect.top < (window.innerHeight - rect.bottom) ? 'bottom' : undefined
        ),
        bottom: (
          rect.top >= (window.innerHeight - rect.bottom) ? 'top' : undefined
        )
      };

      const classNames = classnames(
        `${CLASS_ROOT}__drop`, {
          [`${CLASS_ROOT}__drop--left`]: align.left,
          [`${CLASS_ROOT}__drop--right`]: align.right,
          [`${CLASS_ROOT}__drop--top`]: align.top,
          [`${CLASS_ROOT}__drop--bottom`]: align.bottom
        }
      );

      this._drop = new Drop(target, this._renderDropContent(), {
        align: align,
        className: classNames,
        colorIndex: colorIndex,
        responsive: false
      });

      target.addEventListener('click', onClose);
      target.addEventListener('blur', onClose);
      window.addEventListener('resize', this._onResize);
    }
  }

  componentWillUnmount () {
    const { onClose } = this.props;
    const target = this._getTarget();

    // if the drop was created successfully, remove it
    if (this._drop) {
      this._drop.remove();
    }
    if (target) {
      target.removeEventListener('click', onClose);
      target.removeEventListener('blur', onClose);
      window.removeEventListener('resize', this._onResize);
    }
  }

  _onResize () {
    if (this._drop) {
      this._drop.place();
    }
  }

  _getTarget () {
    const { target } = this.props;

    return (
      document.getElementById(target) ||
      document.querySelector(`.${target}`)
    );
  }

  _renderDropContent () {
    const { onClose } = this.props;
    return (
      <Box className={CLASS_ROOT}
        pad={{ horizontal: 'medium', vertical: 'small' }}
        onClick={onClose}>
        {this.props.children}
      </Box>
    );
  }

  render () {
    return <span />;
  }

}

Tip.propTypes = {
  /**
   * @property {PropTypes.string} colorIndex - The color identifier to use for the background color. For example: accent-1. Only accent colors are available for Tips. Defaults to accent-1
   */
  colorIndex: PropTypes.string,
  /**
   * @property {PropTypes.func} onClose - Called when the user clicks on the Tip, clicks on the target element, or when the target element loses focus.
   */
  onClose: PropTypes.func.isRequired,
  /**
   * @property {PropTypes.string} target - The DOM id or class of the element the Tip should be associated with. The id takes priority over class. If multiple classes are found, the first one will be used.
   */
  target: PropTypes.string.isRequired
};

Tip.defaultProps = {
  colorIndex: 'accent-1'
};
