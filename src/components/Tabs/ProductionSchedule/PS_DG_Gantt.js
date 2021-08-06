
import React, { useState, createRef, useEffect } from 'react';
import Spinner from '../../UI/Spinner';
import CheckBox from "devextreme/ui/check_box";
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  LoadPanel,
  SearchPanel,
  Summary, 
  TotalItem,
  GroupItem,
  Sorting
} from 'devextreme-react/data-grid';
import { makeStyles } from '@material-ui/core/styles';

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

const ProductionScheduleChart = (props) => {
    const { data, shopInfo, getStartDateIndex, getEndDateIndex} = props;
    const [ loaded, setLoaded ] = useState(false);
    const [ jobs, setJobs ] = useState(null);
    const [ columns, setColumns ] = useState(null);
    const [ expanded, setExpanded ] = useState(true);
    const [ hint, setHint ] = useState("");
    const [ totalUnits, setTotalUnits ] = useState(0);
    const [ totalEmps, setTotalEmps ] = useState(0);
    const [ totalUnitsPerWeek, setTotalUnitsPerWeek ] = useState(0);

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

    const renderRow = (row) => {
      if (row.rowType === "data") {
        if (!row.data.booked) {
          row.rowElement.style.backgroundColor = "cyan";
        } else if (row.data.header) {
          row.rowElement.style.backgroundColor = "#a8a8a8";
        } 
      } 
      else if (row.rowType === "group" && shopInfo[0]) {
        let shopStyling = shopInfo.find(shop => shop.shop === row.data.key);
        row.rowElement.style.backgroundColor = shopStyling.colorkey;
        row.rowElement.style.color = shopStyling.fontColor;
      }
    }

    return (
    <div>
      {loaded 
        ? <div>
          <DataGrid
            dataSource={data}
            showRowLines
            columnAutoWidth
            autoExpandAll
            highlightChanges
            repaintChangesOnly
            twoWayBindingEnabled
            columnResizingMode="nextColumn"
            wordWrapEnabled
            showColumnLines={true}
            onCellPrepared={cellPrepared}
            onRowPrepared={renderRow}
          >

            <GroupPanel visible autoExpandAll/>
            <SearchPanel visible highlightCaseSensitive={false} />
            <Grouping autoExpandAll={expanded} />
            <Sorting mode="multiple" />
            <LoadPanel enabled showIndicator  />

            <Column 
              dataField="shop" 
              groupIndex={0} 
            />
            <Column fixed allowSorting 
              dataField="jobNumber" 
              caption="Job Number" 
              alignment="center"
            />
            <Column fixed 
              minWidth={'10vw'} 
              dataField="jobName" 
              caption="Job Name & Wall Type" 
              cellRender={jobWallCell} 
              alignment="left"
            />
            <Column fixed allowSorting 
              dataField="start" 
              caption="Shop Start Date" 
              alignment="center"
              defaultSortOrder="asc"
            />
            <Column fixed 
              dataField="end" 
              caption="End Date" 
              alignment="center"
            />
            
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

              <TotalItem
                column="units"
                summaryType="sum"
              />
              <TotalItem
                column="unitsPerWeek"
                summaryType="sum"
              />
              <TotalItem
                column="employees"
                summaryType="sum"
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
