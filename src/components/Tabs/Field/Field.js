
import React, { useState, createRef, useEffect } from 'react';
import Spinner from '../../UI/Spinner';
import CheckBox from "devextreme/ui/check_box";
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
  Sorting,
  RemoteOperations,
  FilterRow
} from 'devextreme-react/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  dateColumn: {
    backgroundColor: "rgb(0, 0, 0)"
  }
}));

const Field = (props) => {
    const [ loaded, setLoaded ] = useState(false);
    const [ jobs, setJobs ] = useState(null);
    const [ columns, setColumns ] = useState(null);
    const [ expanded, setExpanded ] = useState(true);
    const [ hint, setHint ] = useState("");
    const [ totalUnits, setTotalUnits ] = useState(0);
    const [ totalEmps, setTotalEmps ] = useState(0);
    const [ totalUnitsPerWeek, setTotalUnitsPerWeek ] = useState(0);
    const [ data, setData ] = useState(null);

    useEffect(() => {
      axios.get("https://ww-production-schedule-default-rtdb.firebaseio.com/jobs.json")
      .then(response => {
          response.data ? setData(Object.values(response.data)) : setData([]);
      })
      .catch(error => {
          alert(error);
      })
  }, [])

    useEffect(() => {
        if (data) {
            calculateForOffSets();
            setLoaded(true);
        }
    }, [ data ])

    const convertDaysToMilliseconds = (days) => {
      return days * 24 * 60 * 60 * 1000;
    }
  
    const convertMillisecondsToDays = (ms) => {
      return Math.ceil( ms / (24 * 60 * 60 * 1000) );
    }

    const convertToDate = (value) => {
      let date = (value * 7) + convertMillisecondsToDays(new Date('7/1/2021').getTime());
      date = new Date(convertDaysToMilliseconds(date));
    }

    const calculateForOffSets = () => {
      let cols = [];
      let start = data[getStartDateIndex()].start;
      let end = data[getEndDateIndex()];

      for (let i = 0; i <= end.offset + end.weeks; i++) {
          cols.push(i);
      }

      data.forEach(job => {
          setTotalUnits(total => total + parseInt(job.units));
          setTotalEmps(total => total + parseInt(job.emps));
          setTotalUnitsPerWeek(total => total + parseInt(job.unitsPerWeek));
          job.offsets = [];
          for (let w = 1; w <= job.weeks; w++) {
              job.offsets.push(job.offset + w);
          }
      })

      setColumns(cols.map((row, index) => 
          <Column
              key={index}
              dataField={row}
              caption={convertToDate(row)}
              minWidth={50}
              type="date"
              // cssClass={classes.dateColumn}
          />
      ))    
  }

    const convertDate = (row) => {
      row.start = new Date(row.start);
      row.fieldStart = new Date(row.fieldStart);
      let start = row.start.getTime();
      let weeks = Math.ceil(row.units/row.unitsPerWeek);
      row.weeks = weeks;
      let time = weeks * 7 * 24 * 60 * 60 * 1000;
      time = start + time;
      row.end = new Date(time);
  }
  
  const getStartDateIndex = () => {
      let s = convertMillisecondsToDays(new Date(data[0].start).getTime());
      let jobIndex = 0;
      data.forEach((job, index) => {
          if (convertMillisecondsToDays(new Date(job.start).getTime()) < s) {
              jobIndex = index;
              s = convertMillisecondsToDays(new Date(job.start).getTime());
          } 
      })
      return jobIndex;
  }

  const getEndDateIndex = () => {
      let s = convertMillisecondsToDays(new Date(data[0].start).getTime());
      let jobIndex = 0;
      data.forEach((job, index) => {
          if (convertMillisecondsToDays(new Date(job.start).getTime()) > s) {
              jobIndex = index;
              s = convertMillisecondsToDays(new Date(job.start).getTime());
          } 
      })
      return jobIndex;
  }

  const getOffset = (row, start) => {
      let days = convertMillisecondsToDays(new Date(row.start).getTime());
      row.offset = Math.ceil((days - convertMillisecondsToDays(new Date(start).getTime()))/7);
  }

  const handleUpdate = (row) => {
      if (row.data) {
          row = row.data;
      }
      row.shopName = row.shop;
      row.title = row.jobName;
      axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/jobs/${row.id}.json`, row)
      .then(response => {
          setData([ ...data ])
      })
      .catch(error => alert(error))
  }

  const rowRemoved = (row) => {
      // setData([ Object.assign(data, row.data) ])
      axios.delete(`https://ww-production-schedule-default-rtdb.firebaseio.com/jobs/${row.data.id}.json`)
      .then(response => {
          // setData([ ...data ])
      })
      .catch(error => alert(error))
  }

  const onRowInit = (row) => {
      row.data.booked = false;
      row.data.shop = "";
      row.data.shopName = "";
      row.data.jobName = "job name";
      row.data.title = "job name";
      row.data.wallType = "wall type";
      row.data.start = new Date();
      row.data.fieldStart = new Date();
      row.data.id = row.data.__KEY__;
  }

    const jobWallCell = (data) => {
      return (
        <div>
          <span>{data.data.jobName}</span>
          <br></br>
          <span style={{color: "#5a87d1"}}>{data.data.wallType}</span>
        </div>
      )
    }

    const cellPrepared = (cell) => {
       if (cell.data && cell.data.offsets) {
          if (cell.data.offsets.includes(cell.column.dataField) && cell.column.type === "date") {
            cell.cellElement.style.backgroundColor = "#3f50b5";
          }
          else if (!cell.data.booked) {
            cell.cellElement.style.backgroundColor = "cyan";
          }
       }
       
    }

    return (
    <div>
      {loaded 
        ? <div>
          {/* <CheckBox 
              text="Expand Rows"
              value={expanded}
              onValueChanged={setExpanded(!expanded)} 
          /> */}
          <DataGrid
            dataSource={data}
            columnAutoWidth
            autoExpandAll
            showRowLines
            highlightChanges
            repaintChangesOnly
            twoWayBindingEnabled
            columnResizingMode="nextColumn"
            wordWrapEnabled
            highlightChanges
            showColumnLines={true}
            onCellPrepared={cellPrepared}
            hoverStateEnabled
            
          >

            <GroupPanel visible autoExpandAll/>
            <SearchPanel visible highlightCaseSensitive={false} />
            <Grouping autoExpandAll={expanded} />
            <Sorting mode="multiple" />

            <Column dataField="shop" groupIndex={0} />
            <Column fixed allowSorting dataField="jobNumber" caption="Job Number" alignment="center"/>
            <Column fixed minWidth={'10vw'} dataField="jobName" caption="Job Name & Wall Type" cellRender={jobWallCell} alignment="left"/>
            <Column fixed allowSorting dataField="start" dataType="date" caption="Shop Start Date" alignment="center"/>
            <Column fixed dataField="end" caption="End Date" dataType="date" alignment="center"/>
            
            {columns}

            <Summary recalculateWhileEditing>
              <GroupItem
                column="units"
                summaryType="sum"
                customizeText={data => {
                  return `Total Units: ` + data.value;
                }}
              />
              <GroupItem
                column="emps"
                summaryType="sum"
                customizeText={data => {
                  return `Total Emps: ` + data.value;
                }}
              />
              <GroupItem
                column="unitsPerWeek"
                summaryType="sum"
                customizeText={data => {
                  return `Total Units/Week: ` + data.value;
                }}
              />
            </Summary>

          </DataGrid>

          <Paper style={{marginTop: '50px', width: '100%', padding: '10px'}}>
            <Typography color="primary">
              <b>TOTALS</b>
            </Typography>
            <Typography color="primary">
              Total Units For All Shops: <b>{totalUnits}</b>
            </Typography>
            <Typography color="primary">
              Total Units/Week For All Shops: <b>{totalUnitsPerWeek}</b>
            </Typography>
            <Typography color="primary">
              Total Employees For All Shops: <b>{totalEmps}</b>
            </Typography>
          </Paper>
        </div>
      : <Spinner />
      }
      </div>
    );
}

export default Field;
