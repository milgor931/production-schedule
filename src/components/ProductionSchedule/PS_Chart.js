
import React, { useState, createRef } from 'react';
import { tasks, dependencies, resources, resourceAssignments } from '../../data.js';
import Gantt, { Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing, Toolbar, Item, Validation, ContextMenu } from 'devextreme-react/gantt';


const ProductionScheduleChart = (props) => {

    const [ scaleType, setScaleType ] = useState('weeks');
    const [ taskTitlePosition, setTaskTitlePosition ] = useState('inside');
    const [ selectedIndex, setSelectedIndex ] = useState(0);

    const itemTitleRender = (tab) => {
        return <span>{tab.name}</span>;
    }

    const itemComponentRender = (tab) => {
        return tab.component;
    }

    const onSelectionChanged = (selected) => {
        if (selected.name === "selectedIndex") {
            setSelectedIndex(selected.ID);
        }
    }

    const ganttRef = createRef();

    const update = () => {

    }

    const empUnitCell = (data) => {
      return (
        <div>
            <span style={{color: "#5a87d1", marginRight: "30px"}}>{data.data.emps}</span>
            <br></br>
            <span style={{color: "green", marginLeft: "30px"}}>{data.data.units}</span>
        </div>
      )
    }

    const jobWallCell = (data) => {
      
      // console.log(data.cellElement.style)
      if (!data.data.booked && data.cellElement) {
        data.cellElement.style.backgroundColor = "#9cf5ff"
      }

      // title is actually the job name 
      return (
        <div>
            <span>{data.data.title}</span>
            <br></br>
            <span style={{color: "#5a87d1"}}>{data.data.wallType}</span>
        </div>
      )
    }

    const onCustomCommand = (e) => {
      if(e.name == 'edit') {
          alert("you are editing")
      } else if (e.name == "delete") {
        console.log(e)
      }
    };

    const onTaskEditShowing = (e) => {
      e.hiddenFields = ["Resources"];
    }

    const editCell = (cell) => {
      return (
        <input type="text" />
      )
    }

    const renderCell = (cell, t) => {
      if (!cell.data.booked && cell.cellElement) {
        cell.cellElement.style.backgroundColor = "#9cf5ff"
      }

      return (
        <div>
            <span>{cell.data[t]}</span>
        </div>
      )
    }

    const calculateEndDate = (row) => {
      console.log(row.start);

      // row.end = row.start.getTime();

      return row.end

    }

    const convertDate = (row) => {
      if (!row.header) {

        row.start = new Date(row.start);
        let start = row.start.getTime();


        let weeks = Math.ceil(row.units/row.unitsPerWeek);
        row.weeks = weeks;
        let time = weeks * 7 * 24 * 60 * 60 * 1000;
        time = start + time;

        row.end = new Date(time);
        
        
      }

      return row.end;
    }

    const editCellRender = (cell) => {
      return (
        <input type="text" />
      )
    }

    return (
      <div>
        <div className="widget-container">
          <Gantt
            taskListWidth={500}
            height={window.innerHeight}
            taskTitlePosition={taskTitlePosition}
            scaleType={scaleType}
            showResources={false}
            showRowLines={true}
            showColumnLines={false}
            showBorders={true}
            onCustomCommand={onCustomCommand}
            onTaskEditDialogShowing={data => data.cancel = true}
            onTaskDblClick={task => {
              console.log(task)
            }}
          >

            <Tasks dataSource={tasks} />
            {/* <Dependencies dataSource={dependencies} />
            <Resources dataSource={resources} />

            <ResourceAssignments dataSource={resourceAssignments} /> */}

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

            <ContextMenu>
                <Item text="Edit Row" name="edit"></Item>
                <Item text="Delete Row" name="delete"></Item>
            </ContextMenu>   

            <Column dataField="jobName" caption="Job Name & Wall Type" editinCellRender={editCellRender} cellRender={jobWallCell} alignment="left" editCellRender={editCell}/>
            <Column dataField="jobNumber" caption="Job Number" alignment="center"/>
            <Column dataField="customer" caption="Customer" alignment="center" />
            <Column dataField="unitsPerWeek" caption="Units/Week" alignment="center" />
            <Column dataField="start" caption="Shop Start Date" alignment="center"/>
            <Column dataField="weeks" caption="Weeks" alignment="center"/>
            <Column dataField="end" caption="End Date" alignment="center" calculateCellValue={convertDate} />
            <Column dataField="fieldStart" caption="Field Start Date" alignment="center" />
            <Column dataField="emps" caption="Emps/Units" cellRender={empUnitCell} alignment="center"/>

            <Editing 
              enabled={false} 
              allowResourceAdding={false}
              allowResourceDeleting={false}
              allowResourceUpdating={false}
              allowTaskResourceUpdating={false}
            />
          </Gantt>
        </div>
      </div>
    );
}

export default ProductionScheduleChart;
