// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Label from './Label';
import CSSClassnames from '../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.IMAGE;

/**
 * @description An Image
 * 
 * @example
 * import Image from 'grommet/components/Image';
 * 
 * <Image src='/img/carousel-1.png'
 *   alt='Sample alt'
 *   caption='Sample caption' />
 * 
 */
export default class Image extends Component {
  render () {
    const {
      align, caption, className, full, mask, size, fit, ...props
    } = this.props;
    const classes = classnames(
      CLASS_ROOT,
      {
        [`${CLASS_ROOT}--${size}`]: size,
        [`${CLASS_ROOT}--${fit}`]: fit,
        [`${CLASS_ROOT}--full`]: (
          fit ? true : (typeof full === 'boolean' && full)
        ),
        [`${CLASS_ROOT}--full-${full}`]: typeof full === 'string',
        [`${CLASS_ROOT}--mask`]: mask,
        [`${CLASS_ROOT}--align-top`]: align && align.top,
        [`${CLASS_ROOT}--align-bottom`]: align && align.bottom,
        [`${CLASS_ROOT}--align-left`]: align && align.left,
        [`${CLASS_ROOT}--align-right`]: align && align.right
      },
      className
    );

    const captionText = (typeof caption === 'string') ? caption : props.alt;
    const imgNode = (
      <img {...props} className={classes} />
    );

    const labelRoot = `${CLASS_ROOT}__caption`;
    const labelClasses = classnames(
      labelRoot,
      {
        [`${labelRoot}--${size}`]: size
      }
    );
    return caption && captionText ? (
      <span className={`${CLASS_ROOT}__container`}>
        {imgNode}
        <Label className={labelClasses}>
          {captionText}
        </Label>
      </span>
    ) : (
      imgNode
    );
  }
}

Image.propTypes = {
  /**
   * @property {PropTypes.element} align - How to align the image when full. You can specify one of top|bottom and/or one of left|right. If not provided, the image is centered.
   */
  align: PropTypes.shape({
    bottom: PropTypes.boolean,
    left: PropTypes.boolean,
    right: PropTypes.boolean,
    top: PropTypes.boolean
  }),
  /**
   * @property {PropTypes.string} alt - Alternate text for screen readers.
   */
  alt: PropTypes.string,
  /**
   * @property {PropTypes.bool|PropTypes.string} caption - Whether to add image caption or not. If set to true, caption text will be the image alt value. Also, caption can receive the text to be used instead of the default one.
   */
  caption: PropTypes.oneOfType([
    PropTypes.bool, PropTypes.string
  ]),
  /**
   * @property {contain|cover} fit - How the image should be scaled to fit in the container. Setting this property also sets full='true'.
   */
  fit: PropTypes.oneOf(['contain', 'cover']),
  /**
   * @property {true|horizontal|vertical|false]} full - Whether the image should expand to fill the available width and/or height.
   */
  full: PropTypes.oneOf([true, 'horizontal', 'vertical', false]),
  mask: PropTypes.bool,
  /**
   * @property {small|medium|large|thumb} size - The size of the Image. Defaults to medium.
   */
  size: PropTypes.oneOf(['small', 'medium', 'large', 'thumb']),
  /**
   * @property {PropTypes.string} src - The actual image file source.
   */
  src: PropTypes.string,
  title: PropTypes.string
};

Image.defaultProps = {
  size: 'medium'
};
