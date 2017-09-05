// (C) Copyright 2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import Box from './Box';
import AscIcon from './icons/base/LinkDown';
import DescIcon from './icons/base/LinkUp';

/**
 * @description A table header that can be used as a sort control.
 * 
 * ```js
 * import TableHeader from 'grommet/components/TableHeader';
 * 
 * <Table>
 *   <TableHeader labels={['Name', 'Note']}
 *     sortIndex={0}
 *     sortAscending={true}
 *     onSort={...} />
 *   <tbody>
 *     <TableRow>
 *       <td>
 *         Alan
 *       </td>
 *       <td>
 *         plays accordion
 *       </td>
 *     </TableRow>
 *     <TableRow>
 *       <td>
 *         Chris
 *       </td>
 *       <td>
 *         drops the mic
 *       </td>
 *     </TableRow>
 *     <TableRow>
 *       <td>
 *         Tracy
 *       </td>
 *       <td>
 *         travels the world
 *       </td>
 *     </TableRow>
 *   </tbody>
 * </Table>
 * ```
 */
export default class TableHeader extends Component {

  _onSort (index) {
    const { onSort, sortAscending, sortIndex } = this.props;
    let nextAscending;
    if (index !== sortIndex) {
      nextAscending = false;
    } else {
      nextAscending = ! sortAscending;
    }
    onSort(index, nextAscending);
  }

  render () {
    const { labels, onSort, sortAscending, sortIndex, ...props } = this.props;

    const cells = labels.map((label, index) => {
      let content;
      let options = {};

      if (Array.isArray(label)) {
        [content, options = {}] = label;
      } else {
        content = label;
        options.sortable = !!onSort;
      }

      if (sortIndex >= 0) {
        let sortIndicator;
        if (index === sortIndex) {
          sortIndicator = (
            sortAscending ?
              <AscIcon /> : <DescIcon />
          );
        }
        content = (
          <Box direction='row' justify='start' align='center'
            pad={{ between: 'small' }}>
            <span>{content}</span>
            {sortIndicator}
          </Box>
        );

        if (options.sortable) {
          content = (
            <Button plain={true} fill={true}
              onClick={this._onSort.bind(this, index)}>
              {content}
            </Button>
          );
        }
      }

      return <th key={index}>{content}</th>;
    });

    return (
      <thead {...props}>
        <tr>
          {cells}
        </tr>
      </thead>
    );
  }
}

TableHeader.propTypes = {
  /**
   * @property {[PropTypes.node,PropTypes.array]} labels - Header cell contents.
   */
  labels: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.array
  ])).isRequired,
  /**
   * @property {PropTypes.func} onSort - Function that will be called when the user clicks on a header cell. It is passed the index of the cell and which direction to sort in.
   */
  onSort: PropTypes.func, // (index, ascending?)
  /**
   * @property {PropTypes.bool} sortAscending - Indicates which direction the sort is currenly going.
   */
  sortAscending: PropTypes.bool,
  /**
   * @property {PropTypes.number} sortIndex - Indicates which cell is currently being sorted on.
   */
  sortIndex: PropTypes.number
};
