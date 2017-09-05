// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Box from './Box';
import Paragraph from './Paragraph';
import CSSClassnames from '../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.QUOTE;
const BORDER_COLOR_INDEX = CSSClassnames.BORDER_COLOR_INDEX;

/**
 * @description A quote with a colored border.
 *
 * ```js
 * import Quote from 'grommet/components/Quote';
 * 
 * <Quote credit='Ricky Baker'>
 *   <Paragraph>
 *     Trees. Birds. Rivers. Sky.
 *   </Paragraph>
 *   <Paragraph>
 *     Running with my Uncle Hec
 *   </Paragraph>
 *   <Paragraph>
 *     Living forever.
 *   </Paragraph>
 * </Quote>
 * ```
 * 
 * Properties for [Box](#) are available.
 */
export default class Quote extends Component {
  render () {
    const {
      borderColorIndex, children, className, credit, emphasizeCredit,
      ...props
    } = this.props;

    const classes = classnames(
      CLASS_ROOT,
      {
        [`${BORDER_COLOR_INDEX}-${borderColorIndex}`]: borderColorIndex,
        [`${CLASS_ROOT}--small`]: 'small' === props.size,
        [`${CLASS_ROOT}--emphasize-credit`]: emphasizeCredit
      },
      className
    );

    if (props.size === 'small') {
      props.pad = { horizontal: 'medium', vertical: 'small' };
    }

    let creditElement;
    if (typeof credit === 'string') {
      let content = credit;
      if (emphasizeCredit) {
        content = <strong>{content}</strong>;
      }
      creditElement = (
        <Paragraph className={`${CLASS_ROOT}__credit`}>
          {content}
        </Paragraph>
      );
    } else {
      creditElement = credit;
    }

    return (
      <Box {...props} className={classes}>
        <div>
          {children}
          {creditElement}
        </div>
      </Box>
    );
  }
}

Quote.propTypes = {
  /**
   * @property {PropTypes.string} borderColorIndex - ColorIndex of the border.
   */
  borderColorIndex: PropTypes.string,
  /**
   * @property {['small', 'medium', 'large', 'full']} size - Width of the box containing the quote. Defaults to large.
   */
  size: PropTypes.oneOf(['small', 'medium', 'large', 'full']),
  /**
   * @property {PropTypes.string|PropTypes.element} credit - The name of the entity that the quote is credited to.
   */
  credit: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  /**
   * @property {PropTypes.bool} emphasizeCredit - Whether the quote credit should be bolded for emphasis. Defaults to true.
   */
  emphasizeCredit: PropTypes.bool,
  ...Box.propTypes
};

Quote.defaultProps = {
  pad: { horizontal: 'large', vertical: 'small' },
  size: 'large',
  emphasizeCredit: true
};
