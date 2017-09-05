// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CSSClassnames from '../utils/CSSClassnames';
import { smallSize } from '../utils/Responsive';

const CLASS_ROOT = CSSClassnames.SPLIT;

/**
 * @description A full height container with two children laid out horizontally. Typical uses involve placing a [Sidebar](#) on the left for primary navigation and then main content on the right. The right side might contain a separate Split component to provide further content depth. Typically, you will want the top Split to be a direct child of the [App](#) component as this will provide the best responsive behavior across devices.
 * 
 * ```js
 * import Split from 'grommet/components/Split';
 * 
 * <Split separator={true}>
 *   <Box colorIndex='neutral-1'
 *     justify='center'
 *     align='center'
 *     pad='medium'>
 *     Left Side
 *   </Box>
 *   <Box colorIndex='neutral-2'
 *     justify='center'
 *     align='center'
 *     pad='medium'>
 *     Right Side
 *   </Box>
 * </Split>
 * ```
 */
export default class Split extends Component {

  constructor(props, context) {
    super(props, context);

    this._onResize = this._onResize.bind(this);
    this._layout = this._layout.bind(this);

    this.state = { responsive: undefined };
  }

  componentDidMount () {
    window.addEventListener('resize', this._onResize);
    this._layout();
  }

  componentWillReceiveProps (nextProps) {
    // If we change the number of visible children, trigger a resize event
    // so things like Table header can adjust. This will go away once
    // CSS supports per element media queries.
    // The 500ms delay is loosely tied to the CSS animation duration.
    // We want any animations to finish before triggering the resize.
    // TODO: consider using an animation end event instead of a timer.
    if (this._nonNullChildCount(nextProps) !==
      this._nonNullChildCount(this.props)) {
      clearTimeout(this._resizeTimer);
      this._resizeTimer = setTimeout(function () {
        var event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        window.dispatchEvent(event);
      }, 500);
    }
    this.setState({ relayout: true });
  }

  componentDidUpdate () {
    if (this.state.relayout) {
      this.setState({ relayout: false });
      this._layout();
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this._onResize);
  }

  // Support function for componentWillReceiveProps()
  _nonNullChildCount (props) {
    let result = 0;
    React.Children.forEach(props.children, function (child) {
      if (child) result += 1;
    });
    return result;
  }

  _onResize () {
    // debounce
    clearTimeout(this._resizeTimer);
    this._resizeTimer = setTimeout(this._layout, 50);
  }

  _setResponsive (responsive) {
    if (this.state.responsive !== responsive) {
      this.setState({responsive: responsive});
      if (this.props.onResponsive) {
        this.props.onResponsive(responsive);
      }
    }
  }

  _layout () {
    const splitElement = this.splitRef;
    if (splitElement) {
      if (splitElement.offsetWidth <= smallSize() &&
        this.props.showOnResponsive === 'priority') {
        this._setResponsive('single');
      } else {
        this._setResponsive('multiple');
      }
    }
  }

  render () {
    const {
      children, className, fixed, flex, priority, separator, ...props
    } = this.props;
    delete props.onResponsive;
    delete props.showOnResponsive;
    const { responsive } = this.state;
    const classes = classnames( CLASS_ROOT, className );

    const boxedChildren = !Array.isArray(children) ? children :
      children.map((child, index) => {
        if (!child) {
          // skip the empty children but keep original index
          // this avoid the right element to remount
          return undefined;
        }
        const lastChild = (index === children.length - 1);
        let hidden;
        let childFlex = true;
        // When we only have room to show one child, hide the appropriate one
        if ('single' === responsive &&
          (('left' === priority && index > 0) ||
          ('right' === priority && index === 0 &&
            children.length > 1))) {
          hidden = true;
        } else if (children.length > 1 &&
          ((flex === 'right' && index === 0) ||
          (flex === 'left' && lastChild))) {
          childFlex = false;
        } else {
          childFlex = true;
        }
        const classes = classnames(
          `${CLASS_ROOT}__column`,
          {
            [`${CLASS_ROOT}__column--fixed`]: fixed,
            [`${CLASS_ROOT}__column--hidden`]: hidden,
            [`${CLASS_ROOT}__column--flex`]: childFlex,
            [`${CLASS_ROOT}__column--separator`]: (separator && ! lastChild)
          }
        );
        // Don't use a Box here because we don't want to constrain the child
        // in a flexbox container.
        return (
          <div key={index} className={classes}>
            {child}
          </div>
        );
      });

    return (
      <div ref={ref => this.splitRef = ref} {...props} className={classes}>
        {boxedChildren}
      </div>
    );
  }
}

Split.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  /**
   * @property {PropTypes.bool} fixed - Whether each side should scroll independently.
   */
  fixed: PropTypes.bool,
  /**
   * @property {['left', 'right', 'both']} flex - Which side to give flexible space to. The default value is 'both'.
   */
  flex: PropTypes.oneOf(['left', 'right', 'both']),
  /**
   * @property {PropTypes.func} onResponsive - Function that will be called when the display area changes. When space is limited the 'columns' parameter will be set to 'single'. Otherwise 'columns' will be set to 'multiple'.
   */
  onResponsive: PropTypes.func,
  /**
   * @property {['left', 'right']} priority - Which side to prioritize when space is limited. The default value is 'right'.
   */
  priority: PropTypes.oneOf(['left', 'right']),
  /**
   * @property {PropTypes.bool} separator - Whether to include a separator between the children.
   */
  separator: PropTypes.bool,
  /**
   * @property {['priority', 'both']} showOnResponsive - Whether the Split should show both sides for mobile, or collapse down to just the priority side. The default value is 'priority'
   */
  showOnResponsive: PropTypes.oneOf(['priority', 'both'])
};

Split.defaultProps = {
  fixed: true,
  flex: 'both',
  priority: 'right',
  showOnResponsive: 'priority'
};
