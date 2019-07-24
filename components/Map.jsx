import React from 'react';
import { observer, decorate } from 'mobx-react';

// import styled from 'react-emotion';
import styled from '@emotion/styled'
import { css } from 'emotion'


import GridCell from './GridCell.jsx';

const Transform = observer(styled('div')`
  transform: translate3d(${({ viewport: { x, y } }) => `${x}px,${y}px`}, 0);
`);

const GridCellDebug = observer(
  ({ cell, selected }) =>
    !selected
      ? null
      : [
          <text x={cell.center.x - 20} y={cell.center.y - 10}>
            ({cell.x},{cell.y})
          </text>,
          <text x={cell.center.x - 20} y={cell.center.y + 10}>
            ({selected.x - cell.x},{selected.y - cell.y})
          </text>
        ]
);

const Map = observer(class Map extends React.Component {
  componentDidMount() {
    document.addEventListener('mouseup', this.props.app.mouseUp);
    document.addEventListener('mousemove', this.props.app.mouseMove);
  }
  componentWillUnmount() {
    document.removeEventListener('mouseup', this.props.app.mouseUp);
    document.removeEventListener('mousemove', this.props.app.mouseMove);
  }

  render() {
    const { app } = this.props;
    let selectedCell = null;
    if (app.selected) {
      selectedCell = (
        <GridCell
          key={app.selected.id}
          ref={app.selected.ref}
          cell={app.selected}
          selected={app.selected}
          onClick={app.setSelected}
        />
      );
    }

    return (
      <Transform viewport={app.viewport} onMouseDown={app.mouseDown}>
        <svg width={app.gridWidth} height={app.gridHeight}>
          <g>
            {app.cells.map(cell => (
              <GridCell
                key={cell.id}
                ref={cell.ref}
                cell={cell}
                selected={app.selected}
                onClick={app.setSelected}
              />
            ))}
          </g>
          {selectedCell}
          <g>
            {app.cells.map(cell => <GridCellDebug key={cell.id} cell={cell} />)}
          </g>
        </svg>
      </Transform>
    );
  }
});

module.exports = Map;