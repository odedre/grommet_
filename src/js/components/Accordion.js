// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import List from './List';

import CSSClassnames from '../utils/CSSClassnames';
import Props from '../utils/Props';

const CLASS_ROOT = CSSClassnames.ACCORDION;

/**
 * 
 * @description A collapsible accordion component.
 * 
 * @example 
 * import Accordion from 'grommet/components/Accordion';
 * import AccordionPanel from 'grommet/components/AccordionPanel';
 * 
 * <Accordion>
 *   <AccordionPanel heading='First Title'>
 *     <Paragraph>
 *       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
 *     </Paragraph>
 *   </AccordionPanel>
 *   <AccordionPanel heading='Second Title'>
 *     <Paragraph>
 *       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
 *     </Paragraph>
 *   </AccordionPanel>
 * </Accordion>
 * ```
 */
export default class Accordion extends Component {

  constructor(props, context) {
    super(props, context);
    this._onPanelChange = this._onPanelChange.bind(this);

    let active;
    // active in state should always be an array
    if (typeof this.props.active === 'number') {
      active = [this.props.active];
    } else {
      active = this.props.active || [];
    }
    this.state = {
      active: active
    };
  }

  componentWillReceiveProps (newProps) {
    if (newProps.active !== this.props.active) {
      this.setState({ active: newProps.active || [] });
    }
  }

  _onPanelChange (index) {
    let active = [...this.state.active];
    const { onActive, openMulti } = this.props;

    const activeIndex = active.indexOf(index);
    if (activeIndex > -1) {
      active.splice(activeIndex, 1);
    } else {
      if (openMulti) {
        active.push(index);
      } else {
        active = [index];
      }
    }
    this.setState({active: active}, () => {
      if (onActive) {
        if (!openMulti) {
          onActive(active[0]);
        } else {
          onActive(active);
        }
      }
    });
  }

  render () {
    const { animate, className, children } = this.props;

    const classes = classnames(
      CLASS_ROOT,
      className
    );

    const accordionChildren = React.Children.map(children, (child, index) => {
      return React.cloneElement(child, {
        active: this.state.active.indexOf(index) > -1,
        onChange: () => {
          this._onPanelChange(index);
        },
        animate
      });
    });

    const restProps = Props.omit(this.props, Object.keys(Accordion.propTypes));
    return (
      <List role='tablist' className={classes} {...restProps}>
        {accordionChildren}
      </List>
    );
  }
}

Accordion.propTypes = {
  /**
   * @property {PropTypes.number|PropTypes.number[]} active - Optional active panels to be opened by default.
   */
  active: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number)
  ]),
  /**
   * @property {PropTypes.bool} animate - Transition content in & out with a slide down animation. Defaults to true.
   */
  animate: PropTypes.bool,
  /**
   * @property {PropTypes.func} onActive - Function that will be called when the Accordion changes the currently active panels.
   */
  onActive: PropTypes.func,
  /**
   * @property {PropTypes.bool} openMulti - Allow multiple panels to be opened at once. Defaults to false.
   */
  openMulti: PropTypes.bool
};

Accordion.defaultProps = {
  openMulti: false,
  animate: true
};
