
import React, { useState, createRef, useEffect } from 'react';
import Spinner from '../Spinner';
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
  RemoteOperations
} from 'devextreme-react/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const ProductionScheduleChart = (props) => {
    const { data, getStartDateIndex, getEndDateIndex} = props;
    const [ loaded, setLoaded ] = useState(false);
    const [ jobs, setJobs ] = useState(null);
    const [ columns, setColumns ] = useState(null);
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

        console.log(cols)
        data.forEach(job => {
            job.offsets = [];
            for (let w = 0; w < job.weeks; w++) {
                job.offsets.push(job.offset + w)
            }
        })

        setColumns(cols.map((row, index) => 
            <Column
                key={index}
                dataField={row}
                caption={convertToDate(row)}
                minWidth={50}
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
            if (cell.data.offsets.includes(cell.column.dataField)) {
              cell.cellElement.style.backgroundColor = "#3f50b5";
            } else if (!cell.data.booked && cell.column.caption === "jobName") {
              cell.cellElement.style.backgroundColor = "#9cf5ff";
            } else {
              cell.cellElement.style.backgroundColor = "white";
            }
       }
       
    }

    return (
    <div>
      {loaded 
        ? <div>
          <DataGrid
            dataSource={data}
            columnAutoWidth
            highlightChanges
            repaintChangesOnly
            onRowPrepared={renderRow}
            twoWayBindingEnabled
            columnResizingMode="nextColumn"
            wordWrapEnabled
            autoExpandAll
            highlightChanges
            showColumnLines={false}
            onCellPrepared={cellPrepared}
          >

            <GroupPanel visible autoExpandAll/>
            <SearchPanel visible highlightCaseSensitive={false} />
            <Grouping autoExpandAll />
            <Sorting mode="multiple" />

            <Column dataField="shop" groupIndex={0} />
            <Column dataField="jobName" caption="Job Name & Wall Type" cellRender={jobWallCell} alignment="left" />
            <Column allowSorting dataField="jobNumber" caption="Job Number" alignment="center"/>
            <Column allowSorting dataField="start" caption="Shop Start Date" alignment="center"/>
            <Column dataField="end" caption="End Date" alignment="center"/>
            
            {columns}

            <Summary recalculateWhileEditing>
              <GroupItem
                column="units"
                summaryType="sum"
                customizeText={data => `Total Units: ` + data.value}
              />
              <GroupItem
                column="emps"
                summaryType="sum"
                customizeText={data => `Total Emps: ` + data.value}
              />
              <GroupItem
                column="unitsPerWeek"
                summaryType="sum"
                customizeText={data => `Total Units/Week: ` + data.value}
              />
            </Summary>

          </DataGrid>
        </div>
      : <Spinner />
      }
      </div>
    );
}

export default ProductionScheduleChart;
