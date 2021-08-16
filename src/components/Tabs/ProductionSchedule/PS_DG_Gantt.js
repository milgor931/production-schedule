
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
  Sorting,
  SortByGroupSummaryInfo
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
    const { data, shops, toMS, toDays } = props;
    const [ loaded, setLoaded ] = useState(false);
    const [ columns, setColumns ] = useState(null);
    const [ expanded, setExpanded ] = useState(true);

    useEffect(() => {
      calculateForOffSets();
      setLoaded(true);
    }, [ data ])

    const convertToDate = (value) => {
      let date = (value * 7) + toDays(new Date().getTime());
      date = new Date(toMS(date));
      return date.toLocaleDateString();
    }
  
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
      let colorEntry = cell.rowType === "data" ? shops.find(shop => shop.__KEY__ === cell.data.groupKey) : "";
      let headerColor = cell.rowType === "data" && colorEntry ? colorEntry.colorkey : "white";

      if (cell.data && cell.data.offsets) {
        let isDate = cell.data.offsets.includes(cell.column.dataField);
        if (isDate && cell.column.type === "date") {
          cell.cellElement.style.backgroundColor = headerColor;
        }
        if (!cell.data.booked && (cell.columnIndex <= 4 || isDate)) {
          cell.cellElement.style.backgroundColor = "cyan";
        }
        if (cell.column.caption === cell.data.fieldStart.toLocaleDateString()) {
          cell.cellElement.style.backgroundColor = "red";
        }
      }
       
    }

    const renderRow = (row) => {
      if (row.rowType === "group") {
          let colorEntry = shops.find(shop => shop.__KEY___=== row.data.key);
          row.rowElement.style.backgroundColor = colorEntry ? colorEntry.colorkey : "white";
          row.rowElement.style.color = colorEntry ? colorEntry.fontColor : "black";
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
              dataType="string"
              allowSorting={false}
              calculateGroupValue="groupKey"
              groupCellRender={row => {
                let shop = shops.find(shop => row.value === shop.__KEY__);
                return shop && <div style={{flexDirection: "row", display: "flex", alignItems: "center", borderRadius: "10px", backgroundColor: shop.colorkey, padding: "10px", color: shop.fontColor}}><b style={{fontSize: '20px'}}> {shop.shop}:  </b> &nbsp; Units: {row.summaryItems[0].value} | Units Per Week: {row.summaryItems[1].value} | Employees: {row.summaryItems[2].value}</div>
              }}
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

              <GroupItem
                column="groupIndex"
                summaryType="avg"
                name="groupIndex"
                customizeText={data => data.value}
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
            <SortByGroupSummaryInfo 
                summaryItem="groupIndex"
            />
          </DataGrid>
        </div>
      : <Spinner />
      }
      </div>
    );
}

export default ProductionScheduleChart;
