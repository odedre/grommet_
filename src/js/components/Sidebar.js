// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Box from './Box';
import CSSClassnames from '../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.SIDEBAR;

/**
 * @description A full height, fixed width container. Usually a Sidebar is placed inside a [Split](#) component. A typical usage is for primary navigation, where it typically contains a [Header](#) and a [Menu](#). The Sidebar may or may not be always visible. If it comes and goes, it is typically controlled via a Title component inside a [Header](#) component residing in the other side of the Split.
 * 
 * Properties for [Box](#) are also available.
 * 
 * ```js
 * import Sidebar from 'grommet/components/Sidebar';
 * 
 * <Sidebar colorIndex='neutral-1'
 *   fixed={true}>
 *   <Header pad='medium'
 *     justify='between'>
 *     <Title>
 *       Title
 *     </Title>
 *   </Header>
 *   <Box flex='grow'
 *     justify='start'>
 *     <Menu primary={true}>
 *       <Anchor href='#'
 *         className='active'>
 *         First
 *       </Anchor>
 *       <Anchor href='#'>
 *         Second
 *       </Anchor>
 *       <Anchor href='#'>
 *         Third
 *       </Anchor>
 *     </Menu>
 *   </Box>
 *   <Footer pad='medium'>
 *     <Button icon={<User />} />
 *   </Footer>
 * </Sidebar>
 * ```
 */
export default class Sidebar extends Component {
  render () {
    const { children, className, fixed, full, size, ...props } = this.props;
    let classes = classnames(
      CLASS_ROOT,
      {
        [`${CLASS_ROOT}--fixed`]: fixed,
        [`${CLASS_ROOT}--full`]: full,
        [`${CLASS_ROOT}--${size}`]: size
      },
      className
    );

    return (
      <Box {...props} className={classes}>
        {children}
      </Box>
    );
  }
}

Sidebar.propTypes = {
  /**
   * @property {PropTypes.bool} fixed - Whether the sidebar height should be fixed at the full viewport size. Defaults to false.
   */
  fixed: PropTypes.bool,
  /**
   * @property {['xsmall', 'small', 'medium', 'large']} size - The size of the Sidebar. Defaults to medium.
   */
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large']),
  /**
   * @property {PropTypes.bool} full - Whether the sidebar should take up the full browser height or not. Defaults to true.
   */
  full: PropTypes.bool,
  ...Box.propTypes
};

Sidebar.defaultProps = {
  direction: 'column',
  full: true
};
