// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CSSClassnames from '../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.FORM;

/**
 * 
 * @description A web form.
 * 
 * @example
 * import Form from 'grommet/components/Form';
 * // Please see the documentation for each
 * // field's component for further example
 * // details of that component.
 * 
 * <Form>
 *   <Header>
 *     <Heading>
 *       Sample Header
 *     </Heading>
 *   </Header>
 *   <FormFields>
 *     <fieldset>
 *       <Paragraph>
 *         You must acknowledge the destructive aspects of this action.
 *       </Paragraph>
 *       <FormField>
 *         <CheckBox id='agree'
 *           name='agree'
 *           label='I acknowledge that I may lose data.' />
 *       </FormField>
 *     </fieldset>
 *     <t />
 *   </FormFields>
 *   <Footer pad={{"vertical": "medium"}}>
 *     <Button label='Submit'
 *       type='submit'
 *       primary={true}
 *       onClick={...} />
 *   </Footer>
 * </Form>
 * 
 */
export default class Form extends Component {
  render () {
    const { className, compact, fill, pad, plain, ...props } = this.props;
    const classes = classnames(
      CLASS_ROOT,
      {
        [`${CLASS_ROOT}--compact`]: compact,
        [`${CLASS_ROOT}--fill`]: fill,
        [`${CLASS_ROOT}--pad-${pad}`]: typeof pad === 'string',
        [`${CLASS_ROOT}--pad-horizontal-${pad.horizontal}`]:
          typeof pad === 'object' && 'horizontal' in pad,
        [`${CLASS_ROOT}--pad-vertical-${pad.vertical}`]:
          typeof pad === 'object' && 'vertical' in pad,
        [`${CLASS_ROOT}--plain`]: plain
      },
      className
    );

    return (
      <form {...props} className={classes} onSubmit={this.props.onSubmit}>
        {this.props.children}
      </form>
    );
  }
}

Form.propTypes = {
  /**
   * @property {PropTypes.bool} compact - Whether to render the form in a compact style.
   */
  compact: PropTypes.bool,
  fill: PropTypes.bool,
  /**
   * @property {PropTypes.func} onSubmit - A function called when the user submits the form.
   */
  onSubmit: PropTypes.func,
  /**
   * @property {none|small|medium|large|PropTypes.object} pad - The amount of padding to put around the contents. An object can be specified to distinguish horizontal and vertical padding: {horizontal: none|small|medium|large, vertical: none|small|medium|large}. Defaults to none.
   */
  pad: PropTypes.oneOfType([
    PropTypes.oneOf(['none', 'small', 'medium', 'large']),
    PropTypes.shape({
      horizontal: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
      vertical: PropTypes.oneOf(['none', 'small', 'medium', 'large'])
    })
  ]),
  /**
   * @property {PropTypes.bool} plain - Whether the children should control the form width. Defaults to false.
   */
  plain: PropTypes.bool
};

Form.defaultProps = {
  compact: false,
  fill: false,
  pad: 'none'
};
