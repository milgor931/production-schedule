
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

    const [ data, setData ] = useState([]);
    const [ loaded, setLoaded ] = useState(false);
    const [ scaleType, setScaleType ] = useState('weeks');
    const [ taskTitlePosition, setTaskTitlePosition ] = useState('inside');
    const [ selectedIndex, setSelectedIndex ] = useState(0);
    const [ startDate, setStartDate ] = useState();

    useEffect(() => {
      axios.get("https://ww-production-schedule-default-rtdb.firebaseio.com/jobs.json")
        .then(response => {
          setData(response.data);
        })
        .catch(error => {
          alert(error);
        })
    }, [])

    useEffect(() => {
      if (data.length > 0) {
        data.forEach(row => {
          convertDate(row)
          getOffset(row, data[getStartDateIndex()].start);
        })
        setStartDate(data[getStartDateIndex()].start);
        
        axios.put("https://ww-production-schedule-default-rtdb.firebaseio.com/jobs.json", JSON.stringify(data))
        .then(response => setLoaded(true))
      }
    }, [ data ])

    const saveChanges = (row) => {
      const rowData = row.changes[0].data;
      axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/jobs/${rowData.id}.json`, rowData)
      .then(response => console.log("changes saved"))
      .catch(error => alert(error))
    }

    const getStartDateIndex = () => {
      let s = convertMillisecondsToDays(new Date(data[0].start).getTime());
      let jobIndex = 0;
      data.forEach((job, index) => {
        if (convertMillisecondsToDays(new Date(job.start).getTime()) < s) {
          jobIndex = index;
        } 
      })
      return jobIndex;
    }

    const getOffset = (row, start) => {
      let days = convertMillisecondsToDays(new Date(row.start).getTime());
      row.offset = Math.ceil((days - convertMillisecondsToDays(new Date(start).getTime()))/7);
    }

    const convertDaysToMilliseconds = (days) => {
      return days * 24 * 60 * 60 * 1000;
    }

    const convertMillisecondsToDays = (ms) => {
      return Math.ceil(ms / (24 * 60 * 60 * 1000));
    }

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

    const jobWallCell = (data) => {
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

    const editJobWallCell = (data) => {
      return (
        <div>
            <input type="text" placeholder={data.data.title} name={data.data.title} onChange={e => data.data.title = e.target.value}/>
            <br></br>
            <input type="text" placeholder={data.data.wallType} name={data.data.wallType} onChange={e => data.data.wallType = e.target.value}/>
        </div>
      )
    }

    const renderRow = (row) => {
      if (row.rowType === "data") {
        if (!row.data.booked) {
          row.rowElement.style.backgroundColor = "#9cf5ff";
        } else if (row.data.header) {
          row.rowElement.style.backgroundColor = "#a8a8a8";
        }
      } 
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

    const updateRow = (row) => {
      let newData = data.filter(d => d.id !== row.data.id);
      setData([ ...newData, row.data ]);
    }

    return (
    <div style={{margin: '50px'}}>
      {loaded 
        ? <div className="widget-container">
            <Gantt
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

              <Column dataField="jobName" caption="Job Name & Wall Type" cellRender={jobWallCell} alignment="left"/>
              <Column dataField="jobNumber" caption="Job Number" alignment="left"/>
            </Gantt>
          </div>
      : <Spinner />
      }
      </div>
    );
}

export default ProductionScheduleGantt;
