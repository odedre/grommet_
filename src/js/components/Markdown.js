// (C) Copyright 2016 Hewlett Packard Enterprise Development LP

import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'markdown-to-jsx';
import deepAssign from 'deep-assign';
import Paragraph from './Paragraph';
import Table from './Table';
import Heading from './Heading';
import Anchor from './Anchor';
import Image from './Image';

/**
 * 
 * @description Render [markdown](#) content using Grommet components.
 *  
 * ```js
 * import Markdown from 'grommet/components/Markdown';
 * 
 * <Markdown components={{
 *   "h1": {"props": {"strong": true}},
 *   "h2": {"props": {"strong": true}},
 *   "p": {"props": {"size": "large"}},
 *   "img": {"props": {"size": "small"}}
 * }}
 *   content='
 * # H1
 * 
 * Paragraph [link](/).
 * 
 * ## H2
 * 
 * ![image](/img/carousel-1.png)
 * ' />
 * ```
 */

let GrommetMarkdown = (props) => {

  const { content, components } = props;

  const heading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    .reduce((heading, current) => {
      heading[current] = {
        component: Heading,
        props: {
          tag: current
        }
      };

      return heading;
    }, {});

  const options = deepAssign({
    a: {
      component: Anchor
    },
    img: {
      component: Image,
      props: {
        caption: true
      }
    },
    p: {
      component: Paragraph
    },
    table: {
      component: Table
    }
  }, heading, components);

  return (
    <Markdown options={{ overrides: options }}>
      {content}
    </Markdown>
  );
};

GrommetMarkdown.propTypes = {
  /**
   * @property {PropTypes.string} content - The markdown text to render.
   */
  content: PropTypes.string,
  /**
   * @property {PropTypes.shape} components - Set properties for components used in the markdown rendering. Possible components are 'a', 'h1-h6', 'img', and 'p'
   */
  components: PropTypes.shape({
    props: PropTypes.object
  })
};

GrommetMarkdown.defaultProps = {
  components: {},
  content: ''
};

export default GrommetMarkdown;
