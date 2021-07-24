
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
    const { data, getStartDateIndex, getEndDateIndex} = props;
    const [ loaded, setLoaded ] = useState(false);
    const [ jobs, setJobs ] = useState(null);
    const [ columns, setColumns ] = useState(null);
    const [ expanded, setExpanded ] = useState(true);
    const [ hint, setHint ] = useState("");
    const [ totalUnits, setTotalUnits ] = useState(0);
    const [ totalEmps, setTotalEmps ] = useState(0);
    const [ totalUnitsPerWeek, setTotalUnitsPerWeek ] = useState(0);
    const classes = useStyles();

    useEffect(() => {
        if (data) {
            calculateForOffSets();
            setLoaded(true);
        }
    }, [ data ])

    const convertToDate = (value) => {
      let date = (value * 7) + convertMillisecondsToDays(new Date('7/1/2021').getTime());
      date = new Date(convertDaysToMilliseconds(date));
      return date.toLocaleDateString();
    }

    const convertDaysToMilliseconds = (days) => {
      return days * 24 * 60 * 60 * 1000;
    }
  
    const convertMillisecondsToDays = (ms) => {
      return Math.ceil( ms / (24 * 60 * 60 * 1000) );
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

    const toMS = (days) => {
        return days * 24 * 60 * 60 * 1000;
    }

    const toDays = (ms) => {
        return Math.ceil(ms / (24 * 60 * 60 * 1000));
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

    const renderRow = (row) => {
      if (row.rowType === "data") {
        if (!row.data.booked) {
          row.rowElement.style.backgroundColor = "#9cf5ff";
        } else if (row.data.header) {
          row.rowElement.style.backgroundColor = "#a8a8a8";
        }
      } 
    }

    const cellPrepared = (cell) => {
       if (cell.data && cell.data.offsets) {
          if (cell.data.offsets.includes(cell.column.dataField) && cell.column.type === "date") {
            cell.cellElement.style.backgroundColor = "#3f50b5";
          }
          else if (!cell.data.booked) {
            cell.cellElement.style.backgroundColor = "#b6cdd1";
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
            highlightChanges
            repaintChangesOnly
            onRowPrepared={renderRow}
            twoWayBindingEnabled
            columnResizingMode="nextColumn"
            wordWrapEnabled
            highlightChanges
            showColumnLines={true}
            onCellPrepared={cellPrepared}
            hoverStateEnabled
            hint={hint}
            onCellHoverChanged={row => {
              row.rowType === "data" && setHint(`${row.data.jobName} ${row.data.start.toLocaleDateString()} - ${row.data.end.toLocaleDateString()}`);
            }}
          >

            <GroupPanel visible autoExpandAll/>
            <SearchPanel visible highlightCaseSensitive={false} />
            <Grouping autoExpandAll={expanded} />
            <Sorting mode="multiple" />
            {/* <FilterRow visible={true} /> */}

            <Column dataField="shop" groupIndex={0} />
            <Column fixed minWidth={'10vw'} dataField="jobName" caption="Job Name & Wall Type" cellRender={jobWallCell} alignment="left"/>
            <Column allowSorting dataField="jobNumber" caption="Job Number" alignment="center"/>
            <Column allowSorting dataField="start" caption="Shop Start Date" alignment="center"/>
            <Column dataField="end" caption="End Date" alignment="center"/>
            
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
