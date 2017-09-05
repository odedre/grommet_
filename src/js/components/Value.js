// (C) Copyright 2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CSSClassnames from '../utils/CSSClassnames';
import { announce } from '../utils/Announcer';

const CLASS_ROOT = CSSClassnames.VALUE;
const COLOR_INDEX = CSSClassnames.COLOR_INDEX;

/**
 * @description Value component, focusing on a single number.
 * 
 * ```js
 * import Value from 'grommet/components/Value';
 * 
 * <Value value={75}
 *   icon={<Globe />}
 *   label='Sample label'
 *   trendIcon={<LinkUp />}
 *   units='%'
 *   responsive={true}
 *   reverse={true} />
 * ```
 */
export default class Value extends Component {

  componentDidUpdate () {
    if (this.props.announce) {
      announce(this.valueRef.textContent);
    }
  }

  render () {
    const {
      active, align, className, colorIndex, icon, label, responsive,
      size, trendIcon, units, value, reverse, ...props
    } = this.props;
    delete props.announce;
    const classes = classnames(
      CLASS_ROOT,
      {
        [`${CLASS_ROOT}--${size}`]: size,
        [`${CLASS_ROOT}--align-${align}`]: align,
        [`${COLOR_INDEX}-${colorIndex}`]: colorIndex,
        [`${CLASS_ROOT}--responsive`]: responsive,
        [`${CLASS_ROOT}--interactive`]: props.onClick,
        [`${CLASS_ROOT}--active`]: active
      },
      className
    );

    let unitsSpan;
    if (units) {
      unitsSpan = (
        <span className={`${CLASS_ROOT}__units`}>
          {units}
        </span>
      );
    }

    let labelSpan;
    if (label) {
      labelSpan = (
        <span className={`${CLASS_ROOT}__label`}>
          {label}
        </span>
      );
    }

    let contentNode;
    if (reverse) {
      contentNode = (
        <div>
          <span className={`${CLASS_ROOT}__value`}>
            {value}
          </span>
          {unitsSpan}
          {icon}
        </div>
      );
    } else {
      contentNode = (
        <div>
          {icon}
          <span className={`${CLASS_ROOT}__value`}>
            {value}
          </span>
          {unitsSpan}
        </div>
      );
    }

    return (
      <div ref={(ref) => this.valueRef = ref} {...props} className={classes}>
        <div className={`${CLASS_ROOT}__annotated`}>
          {contentNode}
          {trendIcon}
        </div>
        {labelSpan}
      </div>
    );
  }

}

Value.propTypes = {
  /**
   * @property {PropTypes.bool} active - The horizontal alignment of the label. Defaults to center.
   */
  active: PropTypes.bool,
  align: PropTypes.oneOf(['start', 'center', 'end']),
  announce: PropTypes.bool,
  /**
   * @property {PropTypes.string} colorIndex - The color identifier to use for the text color. For example: neutral-1. See Color for possible values.
   */
  colorIndex: PropTypes.string,
  /**
   * @property {PropTypes.node} icon - Optional icon element to place next to the value. See Icon.
   */
  icon: PropTypes.node,
  /**
   * @property {PropTypes.string|PropTypes.node} label - Optional short description of the value.
   */
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /**
   * @property {PropTypes.func} onClick - Click handler.
   */
  onClick: PropTypes.func,
  /**
   * @property {PropTypes.bool} responsive - Whether the font size and spacing should adapt to the resolution. This is useful when used in combination with a Meter that is responsively adjusting. Defaults to false.
   */
  responsive: PropTypes.bool,
  /**
   * @property {['xsmall', 'small', 'medium', 'large', 'xlarge']} size - The size of the value. Defaults to medium.
   */
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large', 'xlarge']),
  /**
   * @property {PropTypes.node} trendIcon - Optional icon element to place next to the value indicating the trend. For example, a LinkUp icon. See Icon.
   */
  trendIcon: PropTypes.node,
  /**
   * @property {PropTypes.bool} reverse - Whether to reverse the order of icon and value nodes. Defaults to false.
   */
  reverse: PropTypes.bool,
  /**
   * @property {PropTypes.number|PropTypes.string|PropTypes.node} value - The value itself.
   */
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string,
    PropTypes.node]),
  /**
   * @property {PropTypes.string|PropTypes.node} units - Optional units to display next to the value.
   */  
  units: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

Value.defaultProps = {
  align: 'center',
  announce: false
};
