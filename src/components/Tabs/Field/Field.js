
import React, { useState, useEffect } from 'react';
import Spinner from '../../UI/Spinner';
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  SearchPanel,
  Editing,
  Summary, 
  TotalItem,
  GroupItem,
  Sorting,
  LoadPanel
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
    const { data, toMS, toDays } = props;
    const [ loaded, setLoaded ] = useState(true);
    const [ columns, setColumns ] = useState(null);
    const [ expanded, setExpanded ] = useState(true);


    useEffect(() => {
        if (data) {
            calculateForOffSets();
            setLoaded(true);
        }
    }, [ data ])

    const calculateForOffSets = () => {
      let cols = [];
      let end = data[data.length - 1];

      for (let i = 0; i <= end.offset + end.weeks; i++) {
          cols.push(i);
      }

      data.forEach(job => {
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
          />
      ))    
    }

    const convertToDate = (value) => {
      let date = (value * 7) + toDays(new Date().getTime());
      date = new Date(toMS(date));
      return date.toLocaleDateString();
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
    <div style={{margin: '3vw'}}>
      {loaded 
        ? <div>
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

            {/* <GroupPanel visible autoExpandAll/> */}
            <SearchPanel visible highlightCaseSensitive={false} />
            <Grouping autoExpandAll={expanded} />
            <Sorting mode="multiple" />
            <LoadPanel enabled />

            {/* <Column dataField="shop" groupIndex={0} /> */}
            <Column fixed allowSorting dataField="jobNumber" caption="Job Number" alignment="center"/>
            <Column fixed minWidth={'10vw'} dataField="jobName" caption="Job Name & Wall Type" cellRender={jobWallCell} alignment="left"/>
            <Column fixed allowSorting dataField="start" dataType="date" caption="Shop Start Date" alignment="center"/>
            <Column fixed dataField="fieldStart" caption="Field Start" dataType="date" alignment="center"/>
            <Column fixed dataField="hourUnits" caption="Hour-UNITS" dataType="number" alignment="center"/>
            
            {columns}

            <Summary recalculateWhileEditing>
              <GroupItem
                column="units"
                summaryType="sum"
                customizeText={data => {
                  return `Total Units: ` + data.value;
                }}
              />
  
            </Summary>

          </DataGrid>
        </div>
      : <Spinner />
      }
      </div>
    );
}

export default Field;
