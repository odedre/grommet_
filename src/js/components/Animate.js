// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { TransitionGroup } from 'react-transition-group';
import classnames from 'classnames';
import CSSClassnames from '../utils/CSSClassnames';
import { findScrollParents } from '../utils/DOM';

const CLASS_ROOT = CSSClassnames.ANIMATE;

class AnimateChild extends Component {

  constructor(props, context) {
    super(props, context);
    const { enter, leave } = props;
    // leave will reuse enter if leave is not defined
    this.state = {
      enter: enter,
      leave: leave || enter,
      state: 'inactive'
    };
  }

  componentWillReceiveProps (nextProps) {
    const { enter, leave } = nextProps;
    this.setState({ enter: enter, leave: leave || enter });
    if (nextProps.visible !== this.props.visible) {
      const [ nextState, lastState ] = nextProps.visible ?
        [ 'enter', 'active' ] : [ 'leave', 'inactive' ];
      this._delay(nextState, this._done.bind(this, lastState));
    }
  }

  componentWillUnmount () {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = undefined;
    }
  }

  componentWillAppear (callback) {
    if (true === this.props.visible) {
      this._delay('enter', callback);
    }
  }

  componentWillEnter (callback) {
    if (true === this.props.visible) {
      this._delay('enter', callback);
    }
  }

  componentDidAppear () {
    this._done('active');
  }

  componentDidEnter () {
    this._done('active');
  }

  componentWillLeave (callback) {
    this._delay('leave', callback);
  }

  componentDidLeave (callback) {
    this._done('inactive');
  }

  _delay (state, callback) {
    const { delay } = this.state[state];
    // ensure we start out inactive in case we aren't being kept in the DOM
    if ('enter' === state) {
      this.setState({ state: 'inactive '});
    }
    clearTimeout(this._timer);
    this._timer = setTimeout(this._start.bind(this, state, callback),
      delay || 1);
  }

  _start (state, callback) {
    const { duration } = this.state[state];
    this.setState({ state });
    this._timer = setTimeout(callback, duration);
  }

  _done (state) {
    this.setState({ state });
  }

  render () {
    const { children } = this.props;
    const { enter, leave, state } = this.state;
    const animation = (this.state[state] || this.state.enter).animation;
    const className = classnames(
      `${CLASS_ROOT}__child`,
      `${CLASS_ROOT}__child--${animation}`,
      `${CLASS_ROOT}__child--${state}`
    );
    const duration = ('enter' === state || 'inactive' === state) ?
      enter.duration : leave.duration;
    const style = { transitionDuration: `${duration || 0}ms` };
    return <div className={className} style={style}>{children}</div>;
  }
}

AnimateChild.propTypes = {
  enter: PropTypes.shape({
    animation: PropTypes.string,
    duration: PropTypes.number,
    delay: PropTypes.number
  }).isRequired,
  leave: PropTypes.shape({
    animation: PropTypes.string,
    duration: PropTypes.number,
    delay: PropTypes.number
  }),
  visible: PropTypes.bool
};

AnimateChild.defaultProps = {
  visible: false
};

/**
 * @description An animation wrapper to transition components in & out.
 * 
 * @example
 *  import Animate from 'grommet/components/Animate';
 * 
 * <Box pad={{"between": "medium"}}
 *   align='center'>
 *   <Button label='Leave'
 *     primary={true}
 *     onClick={...} />
 *   <Animate enter={{"animation": "fade", "duration": 1000, "delay": 0}}
 *     keep={true}>
 *     <Box direction='row'>
 *       <Box colorIndex='light-2'
 *         margin='medium'
 *         pad='large'>
 *         <Value value={1} />
 *       </Box>
 *     </Box>
 *   </Animate>
 * </Box>
 * 
 */

export default class Animate extends Component {

  constructor(props, context) {
    super(props, context);
    this._checkScroll = this._checkScroll.bind(this);
    this.state = { visible: true === props.visible };
  }

  componentDidMount () {
    if ('scroll' === this.props.visible) {
      this._listenForScroll();
    }
  }

  componentWillReceiveProps (nextProps) {
    const { visible } = this.props;
    if (visible !== nextProps.visible) {
      if ('scroll' === visible) {
        this._unlistenForScroll();
      } else if ('scroll' === nextProps.visible) {
        this._listenForScroll();
      }
      this.setState({ visible: true === nextProps.visible });
    }
  }

  componentWillUnmount () {
    if ('scroll' === this.props.visible) {
      this._unlistenForScroll();
    }
  }

  _listenForScroll () {
    // add a time so that the finScrollParents function
    // get the right container sizes
    setTimeout(() => {
      const scrollParents = findScrollParents(findDOMNode(this.animateRef));
      scrollParents.forEach((scrollParent) => {
        scrollParent.addEventListener('scroll', this._checkScroll);
      }, this);
    }, 0);
  }

  _unlistenForScroll () {
    const scrollParents = findScrollParents(findDOMNode(this.animateRef));
    scrollParents.forEach((scrollParent) => {
      scrollParent.removeEventListener('scroll', this._checkScroll);
    }, this);
  }

  _checkScroll () {
    const { onAppear, onLeave } = this.props;
    const group = findDOMNode(this);
    const rect = group.getBoundingClientRect();

    if (rect.top < window.innerHeight) {
      this.setState({ visible: true }, () => {
        if (onAppear) {
          onAppear();
        }
      });
    } else {
      this.setState({ visible: false }, () => {
        if (onLeave) {
          onLeave();
        }
      });
    }
  }

  render () {
    const {
      enter, leave, className, children, component, keep, ...props
    } = this.props;
    delete props.onAppear;
    delete props.onLeave;
    delete props.visible;
    const { visible } = this.state;

    const classes = classnames( CLASS_ROOT, className );

    let animateChildren;
    if (keep || visible) {
      animateChildren = React.Children.map(children, (child, index) => (
        <AnimateChild key={index} enter={enter} leave={leave}
          visible={visible}>
          {child}
        </AnimateChild>
      ));
    }

    return (
      <TransitionGroup
        {...props}
        className={classes}
        component={component}
        ref={ref => this.animateRef = ref}
      >
        {animateChildren}
      </TransitionGroup>
    );
  }
}

const ANIMATIONS =
  ['fade', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'jiggle'];

Animate.propTypes = {
  /**
   * @property {PropTypes.string|PropTypes.func} component - Wrapping component. Defaults to <div/>.
   */
  component: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  /**
   * @property {PropTypes.object} enter - Animation when component is entering. Possible animations:fade|slide-up|slide-down|slide-left|slide-right
   */
  enter: PropTypes.shape({
    animation: PropTypes.oneOf(ANIMATIONS).isRequired,
    duration: PropTypes.number,
    delay: PropTypes.number
  }).isRequired,
  /**
   * @property {PropTypes.bool} keep - Whether to keep or remove element from the DOM. Defaults to false.
   */
  keep: PropTypes.bool,
  /**
   * @property {PropTypes.object} leave - Animation when component is leaving. Defaults to enter animation.
   */
  leave: PropTypes.shape({
    animation: PropTypes.oneOf(ANIMATIONS).isRequired,
    duration: PropTypes.number,
    delay: PropTypes.number
  }),
  /**
   * @property {PropTypes.func} onAppear - Callback for when the animation appears.
   */
  onAppear: PropTypes.func,
  /**
   * @property {PropTypes.func}onLeave - Callback for when the animation leaves.
   */
  onLeave: PropTypes.func,
  /**
   * @property {scroll|PropTypes.bool} visible - Toggle visibility. When set to scroll, the animation will happen when the component scrolls into view. Defaults to false.
   */
  visible: PropTypes.oneOfType([
    PropTypes.oneOf(['scroll']),
    PropTypes.bool
  ])
};

Animate.defaultProps = {
  component: 'div',
  enter: { animation: 'fade', duration: 300 },
  visible: true
};
