// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';
import Status from './icons/Status';
import CSSClassnames from '../utils/CSSClassnames';
import Intl from '../utils/Intl';
import { announce } from '../utils/Announcer';

const CLASS_ROOT = CSSClassnames.TOPOLOGY;
const STATUS_ICON = CSSClassnames.STATUS_ICON;
const COLOR_INDEX = CSSClassnames.COLOR_INDEX;
const BACKGROUND_COLOR_INDEX = CSSClassnames.BACKGROUND_COLOR_INDEX;

const Label = (props) => {
  const { children, ...restProps } = props;
  return (
    <span {...restProps} className={`${CLASS_ROOT}__label`}>{children}</span>
  );
};

class Part extends Component {
  render () {
    const {
      a11yTitle, align, children, className, demarcate, direction, justify,
      label, reverse, status, ...props
    } = this.props;
    const { intl } = this.context;
    let realChildren = 0;
    Children.forEach(children, (child) => {
      if (child) {
        realChildren += 1;
      }
    });
    const classes = classnames(
      `${CLASS_ROOT}__part`,
      {
        [`${CLASS_ROOT}__part--direction-${direction}`]: direction,
        [`${CLASS_ROOT}__part--justify-${justify}`]: justify,
        [`${CLASS_ROOT}__part--align-${align}`]: align,
        [`${CLASS_ROOT}__part--demarcate`]: demarcate,
        [`${CLASS_ROOT}__part--reverse`]: reverse,
        [`${CLASS_ROOT}__part--empty`]:
          (! status && ! label && realChildren === 0)
      },
      className
    );

    let statusIcon;
    if (status) {
      statusIcon = (
        <Status value={status} size='small' role='presentation'
          aria-hidden='true' />
      );
    }

    let labelLabel;
    if (label) {
      let hiddenProps;
      if (status) {
        // hide label if status is present and let aria-label handle
        // description
        hiddenProps = {
          role: 'presentation',
          'aria-hidden': true
        };
      }
      labelLabel = <Label {...hiddenProps}>{label}</Label>;
    }

    const role = !status && !label ? 'group' : 'row';
    const partMessage = a11yTitle || (
      role === 'group' ?
        Intl.getMessage(intl, 'Part') : `${status || ''} ${label}`
    );
    return (
      <div {...props} ref={(ref) => this._partRef = ref} className={classes}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
        tabIndex='-1' role={role} aria-label={partMessage}
        onFocus={() => {
          if (this._partRef) {
            const connects = this._partRef.getAttribute('data-connects');
            if (connects) {
              announce(connects, 'polite');
            }
          }
        }}>
        {statusIcon}
        {labelLabel}
        {children}
      </div>
    );
  }
}

Part.contextTypes = {
  intl: PropTypes.object
};

Part.propTypes = {
  a11yTitle: PropTypes.string,
  align: PropTypes.oneOf(['start', 'center', 'between', 'end', 'stretch']),
  demarcate: PropTypes.bool,
  direction: PropTypes.oneOf(['row', 'column']).isRequired,
  id: PropTypes.string,
  justify: PropTypes.oneOf(['start', 'center', 'between', 'end']),
  label: PropTypes.string,
  reverse: PropTypes.bool,
  status: PropTypes.string
};

Part.defaultProps = {
  demarcate: true,
  direction: 'row',
  justify: 'center',
  align: 'stretch'
};

class Parts extends Component {

  componentDidMount () {
    this._makeUniform();
  }

  componentDidUpdate () {
    this._makeUniform();
  }

  _makeUniform () {
    const { direction, uniform } = this.props;
    if (uniform) {
      let parts = this._componentRef.children;
      // clear old basis
      for (let i = 0; i < parts.length; i += 1) {
        parts[i].style.flexBasis = null;
      }
      // find max
      let max = 0;
      for (let i = 0; i < parts.length; i += 1) {
        if ('column' === direction) {
          max = Math.max(max, parts[i].offsetHeight);
        } else {
          max = Math.max(max, parts[i].offsetWidth);
        }
      }
      // set basis
      for (let i = 0; i < parts.length; i += 1) {
        parts[i].style.flexBasis = '' + max + 'px';
      }
    }
  }

  render () {
    const { a11yTitle, align, children, className, direction } = this.props;
    const { intl } = this.context;
    const classes = classnames(
      `${CLASS_ROOT}__parts`,
      {
        [`${CLASS_ROOT}__parts--direction-${direction}`]: direction,
        [`${CLASS_ROOT}__part--align-${align}`]: align
      },
      className
    );
    const partsMessage = a11yTitle || Intl.getMessage(intl, 'Parts');
    return (
      <div ref={ref => this._componentRef = ref} className={classes}
        tabIndex='-1' role='rowgroup' aria-label={partsMessage}>
        {children}
      </div>
    );
  }
}

Parts.contextTypes = {
  intl: PropTypes.object
};

Parts.propTypes = {
  align: PropTypes.oneOf(['start', 'center', 'between', 'end', 'stretch']),
  direction: PropTypes.oneOf(['row', 'column']).isRequired,
  uniform: PropTypes.bool
};

Parts.defaultProps = {
  direction: 'column'
};

/**
 * @description Visualize structure and connectivity.
 * 
 * 
 * import Topology from 'grommet/components/Topology';
 * 
 * <Topology a11yTitle='Server Topology'
 *   links={[{"colorIndex": "graph-1", "ids": ["s1p1", "s2p1"]}, {"colorIndex": "graph-1", "ids": ["s1p1", "s2p1"]}, {"colorIndex": "graph-1", "ids": ["s1p2", "s2p2"]}, {"colorIndex": "graph-2", "ids": ["em1p2", "em2p1"]}, {"colorIndex": "graph-2", "ids": ["em2p2", "em3p1"]}, {"colorIndex": "graph-2", "ids": ["em3p2", "em4p1"]}, {"colorIndex": "graph-2", "ids": ["em4p2", "em1p1"]}, {"colorIndex": "graph-2", "ids": ["s2p14", "s2p8"]}, {"colorIndex": "graph-2", "ids": ["em4p2", "s2p8"]}]}>
 *   <Parts direction='row'>
 *     <Part a11yTitle='rack'
 *       className='rack'
 *       direction='column'>
 *       <Part a11yTitle='switch'
 *         className='switch'
 *         direction='column'>
 *         <Parts direction='row'>
 *           <Part id='s1p1'
 *             status='ok'
 *             label='1'
 *             direction='column'
 *             demarcate={false} />
 *           <Part id='s1p2'
 *             status='ok'
 *             label='2'
 *             direction='column'
 *             demarcate={false} />
 *           <Part id='s1p3'
 *             status='ok'
 *             label='3'
 *             direction='column'
 *             demarcate={false} />
 *           <Part id='s1p4'
 *             status='ok'
 *             label='4'
 *             direction='column'
 *             demarcate={false} />
 *           <Part id='s1p5'
 *             status='ok'
 *             label='5'
 *             direction='column'
 *             demarcate={false} />
 *           <Part id='s1p6'
 *             status='ok'
 *             label='6'
 *             direction='column'
 *             demarcate={false} />
 *           <Part id='s1p7'
 *             status='ok'
 *             label='7'
 *             direction='column'
 *             demarcate={false} />
 *           <Part id='s1p8'
 *             status='ok'
 *             label='8'
 *             direction='column'
 *             demarcate={false} />
 *         </Parts>
 *         <M>
 *           HP 3100 SI
 *         </M>
 *       </Part>
 *       <Part a11yTitle='enclosure'
 *         className='enclosure'
 *         direction='column'>
 *         <Part className='em'
 *           label='HP Virtual Connect FlexFabric-20/40 F8 Module' />
 *         <Part className='em'
 *           label='HP Virtual Connect FlexFabric-20/40 F8 Module' />
 *         <Parts direction='row'>
 *           <Part className='em'>
 *             <Parts>
 *               <Part id='em1p1'
 *                 status='ok'
 *                 label='1'
 *                 demarcate={false}
 *                 align='center' />
 *               <Part id='em1p2'
 *                 status='ok'
 *                 label='2'
 *                 demarcate={false}
 *                 align='center' />
 *             </Parts>
 *           </Part>
 *           <Part a11yTitle='fan 1 ok'
 *             className='fan'
 *             status='ok'
 *             label='1'
 *             align='center' />
 *           <Part className='fan' />
 *           <Part a11yTitle='fan 3 ok'
 *             className='fan'
 *             status='ok'
 *             label='3'
 *             align='center' />
 *         </Parts>
 *         <Part className='em'
 *           label='HP Virtual Connect FlexFabric-20/40 F8 Module' />
 *         <Parts direction='row'>
 *           <Part className='em'>
 *             <Parts>
 *               <Part id='em2p1'
 *                 status='ok'
 *                 label='1'
 *                 demarcate={false}
 *                 align='center' />
 *               <Part id='em2p2'
 *                 status='ok'
 *                 label='2'
 *                 demarcate={false}
 *                 align='center' />
 *             </Parts>
 *           </Part>
 *           <Part className='fan'
 *             status='ok'
 *             label='4'
 *             align='center' />
 *           <Part className='fan'
 *             status='ok'
 *             label='5'
 *             align='center' />
 *           <Part className='fan'
 *             status='ok'
 *             label='6'
 *             align='center' />
 *         </Parts>
 *       </Part>
 *     </Part>
 *     <Part a11yTitle='rack'
 *       className='rack'
 *       direction='column'>
 *       <Part a11yTitle='switch'
 *         className='switch'
 *         direction='column'>
 *         <Parts direction='row'>
 *           <Part id='s2p1'
 *             status='ok'
 *             label='1'
 *             direction='column'
 *             demarcate={false} />
 *           <Part id='s2p2'
 *             status='ok'
 *             label='2'
 *             direction='column'
 *             demarcate={false} />
 *           <Part id='s2p3'
 *             status='ok'
 *             label='3'
 *             direction='column'
 *             demarcate={false} />
 *           <Part id='s2p4'
 *             status='ok'
 *             label='4'
 *             direction='column'
 *             demarcate={false} />
 *           <Part id='s2p5'
 *             status='ok'
 *             label='5'
 *             direction='column'
 *             demarcate={false} />
 *           <Part id='s2p6'
 *             status='ok'
 *             label='6'
 *             direction='column'
 *             demarcate={false} />
 *           <Part id='s2p7'
 *             status='ok'
 *             label='7'
 *             direction='column'
 *             demarcate={false} />
 *           <Part id='s2p8'
 *             status='ok'
 *             label='8'
 *             direction='column'
 *             demarcate={false} />
 *           <Part id='s2p9'
 *             status='ok'
 *             label='9'
 *             direction='column'
 *             demarcate={false} />
 *           <Part id='s2p10'
 *             status='ok'
 *             label='10'
 *             direction='column'
 *             demarcate={false} />
 *         </Parts>
 *         <M>
 *           HP 5920AF-24XG
 *         </M>
 *         <Parts direction='row'>
 *           <Part id='s2p11'
 *             status='ok'
 *             label='11'
 *             direction='column'
 *             demarcate={false}
 *             reverse={true} />
 *           <Part id='s2p12'
 *             status='ok'
 *             label='12'
 *             direction='column'
 *             demarcate={false}
 *             reverse={true} />
 *           <Part id='s2p13'
 *             status='ok'
 *             label='13'
 *             direction='column'
 *             demarcate={false}
 *             reverse={true} />
 *           <Part id='s2p14'
 *             status='ok'
 *             label='14'
 *             direction='column'
 *             demarcate={false}
 *             reverse={true} />
 *           <Part id='s2p15'
 *             status='ok'
 *             label='15'
 *             direction='column'
 *             demarcate={false}
 *             reverse={true} />
 *           <Part id='s2p16'
 *             status='ok'
 *             label='16'
 *             direction='column'
 *             demarcate={false}
 *             reverse={true} />
 *           <Part id='s2p17'
 *             status='ok'
 *             label='17'
 *             direction='column'
 *             demarcate={false}
 *             reverse={true} />
 *           <Part id='s2p18'
 *             status='ok'
 *             label='18'
 *             direction='column'
 *             demarcate={false}
 *             reverse={true} />
 *           <Part id='s2p19'
 *             status='ok'
 *             label='19'
 *             direction='column'
 *             demarcate={false}
 *             reverse={true} />
 *           <Part id='s2p20'
 *             status='ok'
 *             label='20'
 *             direction='column'
 *             demarcate={false}
 *             reverse={true} />
 *         </Parts>
 *       </Part>
 *       <Part a11yTitle='enclosure'
 *         className='enclosure'
 *         direction='column'>
 *         <Parts direction='row'>
 *           <Part className='em'>
 *             <Parts>
 *               <Part id='em3p1'
 *                 status='ok'
 *                 label='1'
 *                 demarcate={false}
 *                 align='center' />
 *               <Part id='em3p2'
 *                 status='ok'
 *                 label='2'
 *                 demarcate={false}
 *                 align='center' />
 *             </Parts>
 *           </Part>
 *           <Part className='fan'
 *             status='ok'
 *             label='1'
 *             align='center' />
 *           <Part className='fan'
 *             status='ok'
 *             label='2'
 *             align='center' />
 *           <Part className='fan'
 *             status='ok'
 *             label='3'
 *             align='center' />
 *         </Parts>
 *         <Part className='em'
 *           label='HP Virtual Connect FlexFabric-20/40 F8 Module' />
 *         <Parts direction='row'>
 *           <Part className='em'>
 *             <Parts>
 *               <Part id='em4p1'
 *                 status='ok'
 *                 label='1'
 *                 demarcate={false}
 *                 align='center' />
 *               <Part id='em4p2'
 *                 status='ok'
 *                 label='2'
 *                 demarcate={false}
 *                 align='center' />
 *             </Parts>
 *           </Part>
 *           <Part className='fan'
 *             status='ok'
 *             label='4'
 *             align='center' />
 *           <Part className='fan'
 *             status='ok'
 *             label='5'
 *             align='center' />
 *           <Part className='fan'
 *             status='ok'
 *             label='6'
 *             align='center' />
 *         </Parts>
 *       </Part>
 *     </Part>
 *   </Parts>
 * </Topology>
 */
export default class Topology extends Component {

  constructor(props, context) {
    super(props, context);

    this._layout = this._layout.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);

    this.state = {
      activeIds: {},
      height: 100,
      mouseActive: false,
      paths: [],
      width: 100
    };
  }

  componentDidMount () {
    const { links } = this.props;
    const { intl } = this.context;
    window.addEventListener('resize', this._onResize);
    this._layout();
    if (links && links.length > 0) {
      const connectsMap = {};
      links.forEach((link) => {
        const startId = link.ids[0];
        const startElement = document.getElementById(startId);
        const endId = link.ids[1];
        const endElement = document.getElementById(endId);
        if (startElement && endElement) {
          const startLabel = (
            startElement.getAttribute('aria-label') || startElement.innerText
          );
          const endLabel = (
            endElement.getAttribute('aria-label') || endElement.innerText
          );
          if (connectsMap[startId]) {
            connectsMap[startId].push(endLabel);
          } else {
            connectsMap[startId] = [endLabel];
          }

          if (connectsMap[endId]) {
            connectsMap[endId].push(startLabel);
          } else {
            connectsMap[endId] = [startLabel];
          }
        }
      });

      Object.keys(connectsMap).forEach((element) => {
        const targetElement = document.getElementById(element);
        const connectsMessage = Intl.getMessage(intl, 'Connects With');
        targetElement.setAttribute('data-connects',
          `${connectsMessage}: (${connectsMap[element].join()})`
        );
      });
    }
  }

  componentWillReceiveProps (nextProps) {
    this._layout();
  }

  componentWillUnmount () {
    clearTimeout(this._resizeTimer);
    window.removeEventListener('resize', this._onResize);
  }

  _coords (id, containerRect) {
    var result;
    let element = document.getElementById(id);
    if (! element) {
      console.warn('!!! Topology is unable to find the link target with id:',
        id);
      result = [0, 0];
    } else {
      let rect = element.getBoundingClientRect();
      // see if the element has a status child, use that if it does
      let statusElements = element.querySelectorAll(`.${STATUS_ICON}`);
      if (statusElements.length === 1) {
        rect = statusElements[0].getBoundingClientRect();
      }
      result = [
        rect.left - containerRect.left + (rect.width / 2),
        rect.top - containerRect.top + (rect.height / 2)
      ];
    }
    return result;
  }

  _buildPaths (contents) {
    const { linkOffset, links } = this.props;
    const { activeIds } = this.state;
    const rect = contents.getBoundingClientRect();

    const paths = links.map((link, linkIndex) => {
      let commands = '';
      let active = false;

      let p1 = this._coords(link.ids[0], rect);
      link.ids.forEach((id, idIndex) => {
        if (activeIds[id]) {
          active = true;
        }
        if (idIndex > 0) {
          const p2 = this._coords(id, rect);
          const delta = [Math.abs(p1[0] - p2[0]), Math.abs(p1[1] - p2[1])];
          commands += ` M${p1[0]},${p1[1]}`;
          let cp1;
          let cp2;

          if (delta[0] > delta[1]) {
            // larger X delta
            cp1 = [p1[0],
              Math.min(p1[1], p2[1]) +
                Math.max(linkOffset, (delta[1] / 2)) + (linkIndex * 2)];
            cp2 = [p2[0], cp1[1]];
          } else {
            // larger Y delta or equal
            let cp1xDelta =
              Math.max(linkOffset, (delta[0] / 2) + (linkIndex * 2));
            if (p1[0] > p2[0]) {
              cp1 = [Math.min(p2[0] + cp1xDelta, rect.width), p1[1]];
            } else {
              cp1 = [Math.max(0, p1[0] - cp1xDelta), p1[1]];
            }
            cp2 = [cp1[0], p2[1]];
          }

          commands +=
            ` C${cp1[0]},${cp1[1]} ${cp2[0]},${cp2[1]} ${p2[0]},${p2[1]}`;
          p1 = p2;
        }
      });

      const classes = classnames(
        `${CLASS_ROOT}__path`, {
          [`${CLASS_ROOT}__path--active`]: active,
          [`${COLOR_INDEX}-${link.colorIndex}`]: link.colorIndex
        }
      );

      return (
        <path key={linkIndex} fill='none' className={classes} d={commands} />
      );
    });

    return paths;
  }

  _layout () {
    const contents = findDOMNode(this._contentsRef);
    if (contents) {
      this.setState({
        width: contents.scrollWidth,
        height: contents.scrollHeight,
        paths: this._buildPaths(contents)
      });
    }
  }

  _onResize () {
    // debounce
    clearTimeout(this._resizeTimer);
    this._resizeTimer = setTimeout(this._layout, 50);
  }

  _activate (element) {
    let topology = this._topologyRef;
    let activeIds = {};
    while (element && element !== topology) {
      let id = element.getAttribute('id');
      if (id) {
        activeIds[id] = true;
      }
      element = element.parentNode;
    }
    this.setState({ activeIds: activeIds }, this._layout);
  }

  _onMouseMove (event) {
    // debounce
    clearTimeout(this._mouseMoveTimer);
    this._mouseMoveTimer =
      setTimeout(this._activate.bind(this, event.target), 100);
  }

  _onMouseLeave () {
    clearTimeout(this._mouseMoveTimer);
    this.setState({ activeIds: {} }, this._layout);
  }

  render () {
    const {
      a11yTitle, children, className, links, onBlur, onFocus, onMouseDown,
      onMouseUp, ...props
    } = this.props;
    delete props.linkOffset;
    const { focus, height, mouseActive, paths, width } = this.state;
    const { intl } = this.context;
    const classes = classnames( CLASS_ROOT, {
      [`${CLASS_ROOT}--focus`]: focus
    }, className );

    var colorKeys = [];
    var colors = {};
    links.forEach(link => {
      if (link.colorIndex && ! colors[link.colorIndex]) {
        colorKeys.push(<div key={link.colorIndex}
          className={`${BACKGROUND_COLOR_INDEX}-${link.colorIndex}`} />);
        colors[link.colorIndex] = true;
      }
    });

    const topologyMessage = a11yTitle || Intl.getMessage(intl, 'Topology');
    return (
      <div ref={ref => this._topologyRef = ref} {...props} className={classes}
        aria-label={topologyMessage} tabIndex='0' role='group'
        onMouseDown={(event) => {
          this.setState({ mouseActive: true });
          if (onMouseDown) {
            onMouseDown(event);
          }
        }}
        onMouseUp={(event) => {
          this.setState({ mouseActive: false });
          if (onMouseUp) {
            onMouseUp(event);
          }
        }}
        onFocus={(event) => {
          if (mouseActive === false) {
            this.setState({ focus: true });
          }
          if (onFocus) {
            onFocus(event);
          }
        }}
        onBlur={(event) => {
          this.setState({ focus: false });
          if (onBlur) {
            onBlur(event);
          }
        }}>
        <svg className={`${CLASS_ROOT}__links`} role='presentation'
          width={width} height={height} viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio='xMidYMid meet'>
          {paths}
        </svg>
        <div ref={ref => this._contentsRef = ref}
          className={`${CLASS_ROOT}__contents`}
          onMouseMove={this._onMouseMove}
          onMouseLeave={this._onMouseLeave}>
          {children}
        </div>
        <div className={`${CLASS_ROOT}__color-key`} role='presentation'>
          {colorKeys}
        </div>
      </div>
    );
  }

}

Topology.contextTypes = {
  intl: PropTypes.object
};

Topology.propTypes = {
  a11yTitle: PropTypes.string,
  /**
   * @property {PropTypes.object[]} links - An array of: {ids: [<id>, ...], colorIndex: <string>}. The ids should reference id properties of contained Topology.Part components.
   */
  links: PropTypes.arrayOf(
    PropTypes.shape({
      colorIndex: PropTypes.string,
      ids: PropTypes.arrayOf(PropTypes.string).isRequired
    })
  ),
  linkOffset: PropTypes.number
};

Topology.defaultProps = {
  links: [],
  linkOffset: 18
};

Topology.Parts = Parts;
Topology.Part = Part;
Topology.Label = Label;
