
import React, { useState, createRef, useEffect } from 'react';
import Gantt, { Tasks, Toolbar, Item } from 'devextreme-react/gantt';
import Spinner from '../Spinner';
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  Pager,
  Paging,
  SearchPanel,
  Editing,
  Summary, 
  TotalItem,
  MasterDetail,
  GroupItem,
  RemoteOperations
} from 'devextreme-react/data-grid';
import axios from "axios";


const ProductionScheduleGantt = (props) => {

    const { data, handleUpdate } = props;
    const [ loaded, setLoaded ] = useState(false);
    const [ scaleType, setScaleType ] = useState('weeks');
    const [ taskTitlePosition, setTaskTitlePosition ] = useState('inside');

    useEffect(() => {
      data && setLoaded(true);
    }, [ data ])

    return (
    <div style={{margin: '50px'}}>
      {loaded 
        ? <Gantt
            keyExpr="id"
            taskListWidth={500}
            height={'auto'}
            taskTitlePosition={taskTitlePosition}
            scaleType={scaleType}
            showResources={false}
            showRowLines
            showColumnLines
            showBorders
            onTaskEditDialogShowing={data => data.cancel = true}
          >

          <Tasks dataSource={data} />

          <Toolbar>
            <Item name="undo" />
            <Item name="redo" />
            <Item name="separator" />
            <Item name="collapseAll" />
            <Item name="expandAll" />
            <Item name="separator" />
            <Item name="addTask" />
            <Item name="deleteTask" />
            <Item name="separator" />
            <Item name="zoomIn" />
            <Item name="zoomOut" />
          </Toolbar>

          <Column dataField="jobName" caption="Job Name"alignment="left"/>
          <Column dataField="jobNumber" caption="Job Number" alignment="left"/>

        </Gantt>
      : <Spinner />
      }
      </div>
    );
}

export default ProductionScheduleGantt;
