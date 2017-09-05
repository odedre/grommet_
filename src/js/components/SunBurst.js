// (C) Copyright 2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { baseUnit, translateEndAngle, arcCommands } from '../utils/Graphics';
import CSSClassnames from '../utils/CSSClassnames';
import Intl from '../utils/Intl';
import KeyboardAccelerators from '../utils/KeyboardAccelerators';
import { announce } from '../utils/Announcer';

const CLASS_ROOT = CSSClassnames.SUN_BURST;
const COLOR_INDEX = CSSClassnames.COLOR_INDEX;
const UNIT_FACTOR = baseUnit * 0.75;
const PAD_FACTOR = baseUnit * 8;

/**
 * @description A SunBurst visualization.
 * 
 * ```js
 * import SunBurst from 'grommet/components/SunBurst';
 * 
 * <Box direction='row'
 *   align='center'
 *   pad={{"between": "medium"}}>
 *   <SunBurst data={[{
 *   "label": "root-1",
 *   "value": 50,
 *   "colorIndex": "neutral-1",
 *   "children": [
 *     {
 *       "label": "sub-1",
 *       "value": 20,
 *       "colorIndex": "neutral-1",
 *       "total": 10,
 *       "children": [
 *         {"label": "leaf-1", "value": 5, "colorIndex": "neutral-1"},
 *         {"label": "leaf-2", "value": 1, "colorIndex": "neutral-1"}
 *       ]
 *     },
 *     {"label": "sub-2", "value": 20, "colorIndex": "neutral-1"},
 *     {"label": "sub-3", "value": 10, "colorIndex": "neutral-1"}
 *   ]
 * }, {
 *   "label": "root-2",
 *   "value": 30,
 *   "colorIndex": "neutral-2",
 *   "children": [
 *     {"label": "sub-4", "value": 15, "colorIndex": "neutral-2"},
 *     {"label": "sub-5", "value": 10, "colorIndex": "neutral-1"},
 *     {"label": "sub-6", "value": 5, "colorIndex": "neutral-3"}
 *   ]
 * }, {
 *   "label": "root-3",
 *   "value": 20,
 *   "colorIndex": "neutral-3",
 *   "children": [
 *     {"label": "sub-7", "value": 10, "colorIndex": "neutral-1"},
 *     {"label": "sub-8", "value": 7, "colorIndex": "neutral-1"},
 *     {"label": "sub-9", "value": 3, "colorIndex": "neutral-3"}
 *   ]
 * }]}
 *     active={[0, 0, 0]}
 *     label={<Legend series={[{
 *   "colorIndex": "neutral-1",
 *   "label": "root-1",
 *   "value": <Value value={50}\n    size='small' />
 * }, {
 *   "colorIndex": "neutral-1",
 *   "label": "sub-1",
 *   "value": <Value value={20}\n    size='small' />
 * }, {
 *   "colorIndex": "neutral-1",
 *   "label": "leaf-1",
 *   "value": <Value value={5}\n    size='small' />
 * }]} />}
 *     onActive={...}
 *     onClick={...} />
 *   <Legend series={[{"label": "on target", "colorIndex": "neutral-1"}, {"label": "over", "colorIndex": "neutral-2"}, {"label": "under", "colorIndex": "neutral-3"}]} />
 * </Box>
 * ```
 */
export default class SunBurst extends Component {

  constructor(props, context) {
    super(props, context);

    this._layout = this._layout.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onPreviousSunBurst = this._onPreviousSunBurst.bind(this);
    this._onNextSunBurst = this._onNextSunBurst.bind(this);
    this._onParentSunBurst = this._onParentSunBurst.bind(this);
    this._onChildSunBurst = this._onChildSunBurst.bind(this);
    this._onSunBurstFocus = this._onSunBurstFocus.bind(this);
    this._onSunBurstBlur = this._onSunBurstBlur.bind(this);
    this._onSunBurstClick = this._onSunBurstClick.bind(this);
    this._onActiveSunBurst = this._onActiveSunBurst.bind(this);
    this._announceSunBurst = this._announceSunBurst.bind(this);

    this.state = {
      height: 100, width: 100, activeSunBurst: [-1], mouseActive: false
    };

    this.sunBurstPaths = {};
  }

  componentDidMount () {
    window.addEventListener('resize', this._onResize);
    this._onResize();
  }

  componentWillReceiveProps (nextProps) {
    this._onResize();
  }

  componentWillUnmount () {
    clearTimeout(this._resizeTimer);
    window.removeEventListener('resize', this._onResize);
  }

  _onSunBurstFocus () {
    const { mouseActive } = this.state;
    this._keyboardHandlers = {
      left: this._onPreviousSunBurst,
      up: this._onParentSunBurst,
      right: this._onNextSunBurst,
      down: this._onChildSunBurst,
      enter: this._onSunBurstClick
    };
    KeyboardAccelerators.startListeningToKeyboard(
      this, this._keyboardHandlers
    );
    if (mouseActive === false) {
      this.setState({ focus: true });
    }
  }

  _onSunBurstBlur () {
    KeyboardAccelerators.stopListeningToKeyboard(
      this, this._keyboardHandlers
    );

    this.setState({ focus: false });
  }

  _announceSunBurst () {
    const { activeSunBurst } = this.state;

    const sunBurstRef = this.sunBurstPaths[activeSunBurst.join(',')];
    if (sunBurstRef) {
      announce(sunBurstRef.getAttribute('aria-label'));
    }
  }

  _onPreviousSunBurst (event) {
    event.preventDefault();
    const { onActive } = this.props;
    let previousSunBurst = this.state.activeSunBurst.slice();

    previousSunBurst[previousSunBurst.length - 1] -= 1;
    const id = previousSunBurst.join(',');
    if (this.sunBurstPaths[id]) {
      onActive(previousSunBurst);
      this.setState({ activeSunBurst: previousSunBurst },
        this._announceSunBurst);
    }

    //stop event propagation
    return true;
  }

  _onParentSunBurst (event) {
    event.preventDefault();
    const { onActive } = this.props;
    let parentSunBurst = this.state.activeSunBurst.slice(
      0, this.state.activeSunBurst.length - 1
    );

    const id = parentSunBurst.join(',');
    if (this.sunBurstPaths[id]) {
      onActive(parentSunBurst);
      this.setState({ activeSunBurst: parentSunBurst },
        this._announceSunBurst);
    }

    //stop event propagation
    return true;
  }

  _onChildSunBurst (event) {
    event.preventDefault();
    const { onActive } = this.props;
    let childSunBurst = this.state.activeSunBurst.slice();
    childSunBurst.push(0);

    const id = childSunBurst.join(',');
    if (this.sunBurstPaths[id]) {
      onActive(childSunBurst);
      this.setState({ activeSunBurst: childSunBurst },
        this._announceSunBurst);
    }

    //stop event propagation
    return true;
  }

  _onNextSunBurst (event) {
    event.preventDefault();
    const { onActive } = this.props;
    let nextSunBurst = this.state.activeSunBurst.slice();

    nextSunBurst[nextSunBurst.length - 1] += 1;
    const id = nextSunBurst.join(',');
    if (this.sunBurstPaths[id]) {
      onActive(nextSunBurst);
      this.setState({ activeSunBurst: nextSunBurst },
        this._announceSunBurst);
    }

    //stop event propagation
    return true;
  }

  _onSunBurstClick () {
    const { onClick } = this.props;
    const { activeSunBurst } = this.state;

    if (this.sunBurstPaths[activeSunBurst.join(',')] && onClick) {
      onClick(activeSunBurst);
    }
  }

  _onResize () {
    // debounce
    clearTimeout(this._resizeTimer);
    this._resizeTimer = setTimeout(this._layout, 50);
  }

  _layout () {
    const rect = this._containerRef.getBoundingClientRect();
    if (rect.width !== this.state.width || rect.height !== this.state.height) {
      this.setState({ height: rect.height, width: rect.width });
    }
  }

  _onActiveSunBurst (sunBurst) {
    const { onActive } = this.props;
    this.setState({
      activeSunBurst: sunBurst ? sunBurst : [-1]
    });
    if (sunBurst && onActive) {
      onActive(sunBurst);
    }
  }
  
  _renderData (path, data, total, centerX, centerY, radius, startAngle,
    endAngle, role, value) {

    const { active, onActive, onClick } = this.props;
    const { width } = this.state;
    const { intl } = this.context;
    const unit = width / UNIT_FACTOR;
    const ringPad = width / PAD_FACTOR;
    if (! total) {
      total = 0;
      data.forEach(datum => total += datum.value);
    }
    // reserve 1 degree per data item for margin between slices
    const padCount = (endAngle - startAngle === 360) ?
      data.length : data.length - 1;
    const anglePer = (endAngle - startAngle - padCount) / total;

    let result = [];
    data.forEach((datum, index) => {
      const datumPath = path.concat([index]);
      const colorIndex = datum.colorIndex || `graph-${(index % 4) + 1}`;
      const className = classnames(
        `${CLASS_ROOT}__slice`,
        `${COLOR_INDEX}-${colorIndex}`, {
          [`${CLASS_ROOT}__slice--hot`]: onActive || onClick,
          [`${CLASS_ROOT}__slice--active`]: (
            active && active.length === datumPath.length &&
            active.every((v,i) => v === datumPath[i])
          )
        }
      );
      const endAngle = translateEndAngle(startAngle, anglePer, datum.value);
      const commands = arcCommands(centerX, centerY, radius,
        startAngle, endAngle);

      const id = datumPath.join(',');

      const enterSelectMessage = `(${Intl.getMessage(intl, 'Enter Select')})`;
      let ariaLabel = `${datum.value} ${onClick ? enterSelectMessage : ''}`;

      result.push(
        <path ref={ref => this.sunBurstPaths[id] = ref} 
          key={`${datumPath}_${index}`}
          className={className} tabIndex={onClick ? '-1' : undefined}
          fill='none' strokeWidth={unit * 2} d={commands}
          aria-label={ariaLabel} role='row'
          onMouseOver={this._onActiveSunBurst.bind(this, datumPath)}
          onMouseOut={this._onActiveSunBurst.bind(this, undefined)}
          onFocus={this._onActiveSunBurst.bind(this, datumPath)}
          onBlur={this._onActiveSunBurst.bind(this, undefined)}
          onClick={onClick ? () => onClick(datumPath) : undefined} />
      );

      if (datum.children) {
        result = result.concat(this._renderData(datumPath,
          datum.children, datum.total,
          centerX, centerY, radius + (unit * 2) + ringPad,
          startAngle, endAngle, 'group', datum.value));
      }

      // + 1 is for margin between slices
      startAngle = endAngle + 1;
    });

    return (
      <g key={`${path}_${radius}_${total}`} role={role || 'rowgroup'}
        aria-label={value || total}>
        {result}
      </g>
    );
  }

  render () {
    const {
      a11yTitle, active, className, data, label, size, ...props
    } = this.props;
    delete props.onActive;
    delete props.onClick;
    const { focus, height, width } = this.state;
    const { intl } = this.context;
    const classes = classnames(
      CLASS_ROOT,
      {
        [`${CLASS_ROOT}--${size}`]: size,
        [`${CLASS_ROOT}--active`]: active
      },
      className
    );

    const unit = width / UNIT_FACTOR;
    const centerX = width / 2;
    const centerY = height / 2;
    let paths = this._renderData([], data, undefined, centerX, centerY,
      unit * 2, 0, 360);

    let labelElement;
    if (label) {
      labelElement = (
        <div className={`${CLASS_ROOT}__label`}>
          {label}
        </div>
      );
    }

    const sunBurstMessage = a11yTitle || Intl.getMessage(intl, 'SunBurst');
    const navigationHelpMessage = Intl.getMessage(intl, 'Navigation Help');

    const graphicClasses = classnames(
      `${CLASS_ROOT}__graphic`, {
        [`${CLASS_ROOT}__graphic--focus`]: focus
      }
    );
    return (
      <div ref={ref => this._containerRef = ref} {...props} className={classes}>
        <svg className={graphicClasses} tabIndex='0'
          viewBox={`0 0 ${width} ${height}`} role='group'
          aria-label={`${sunBurstMessage} (${navigationHelpMessage})`}
          onFocus={this._onSunBurstFocus} onBlur={this._onSunBurstBlur}
          onMouseDown={() => this.setState({ mouseActive: true })}
          onMouseUp={() => this.setState({ mouseActive: false })}>
          {paths}
        </svg>
        {labelElement}
      </div>
    );
  }

}

SunBurst.propTypes = {
  a11yTitle: PropTypes.string,
  /**
   * @property {PropTypes.number[]} active - The currently active index path, if any.
   */
  active: PropTypes.arrayOf(PropTypes.number),
  /**
   * @property {PropTypes.object[]} data - An array of objects describing the data. The value property must be specified. If the total property is specified, it sets the total value for the children. If not specified, the total is the sum of the values. The children property objects are the same structure as the items in the data array. NOTE: Currently the graphic does not work well at depths greater than three.
   */
  data: PropTypes.arrayOf(PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object),
    colorIndex: PropTypes.string,
    total: PropTypes.number, // sum of all values otherwise
    value: PropTypes.number.isRequired
  })),
  /**
   * @property {PropTypes.node} label - Label to show in a corner.
   */
  label: PropTypes.node,
  /**
   * @property {PropTypes.func} onActive - Hover handler. The hovered indexes are passed as the argument. When the user is ceases to hover over the component, undefined is passed as the argument.
   */
  onActive: PropTypes.func,
  /**
   * @property {PropTypes.func} onClick - Click handler. The clicked index path is passed as the argument.
   */
  onClick: PropTypes.func,
  /**
   * @property {['small', 'medium', 'large', 'xlarge', 'full']} size - The size of the SunBurst. Defaults to medium.
   */
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge', 'full'])
};

SunBurst.defaultProps = {
  size: 'medium'
};

SunBurst.contextTypes = {
  intl: PropTypes.object
};
