
import React, { useState, useEffect } from 'react';
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

const ProductionScheduleGantt = (props) => {
  const { data, toMondayDate, addDays, toWeeks } = props;
  const [expanded, setExpanded] = useState(true);
  const [columns, setColumns] = useState([]);

  const jobs = data.jobs ? data.jobs : [];
  const shops = data.shops ? data.shops : [];

  useEffect(() => {
    calculateForOffSets();
  }, [ data ])

  const convertToDate = (offset) => {
    const date = addDays(toMondayDate(jobs[0].start), offset * 7);
    return date.toLocaleDateString();
  }

  const calculateForOffSets = () => {
    let end = jobs[jobs.length - 1];
    let startOffset = toWeeks(jobs[0].start, new Date());
    let newCols = [];

    for (let i = startOffset; i <= end.offset + end.weeks; i++) {
      newCols.push({
        offset: i,
        date: convertToDate(i)
      });
    }
    setColumns(newCols);
  }


  const jobWallCell = (row) => {
    return (
      <div>
        <span>{row.data.jobName}</span>
        <br></br>
        <span style={{ color: "#5a87d1" }}>{row.data.wallType}</span>
      </div>
    )
  }

  const cellPrepared = (cell) => {
    let colorEntry = cell.rowType === "data" ? shops.find(shop => shop.__KEY__ === cell.data.groupKey) : "";
    let headerColor = cell.rowType === "data" && colorEntry ? colorEntry.colorkey : "white";
    
    if (cell.data && cell.data.offsets) {

      let offset = toWeeks(jobs[0].start, cell.data.start);
      cell.data.offset = offset

      let isDate = parseInt(cell.column.dataField) >= offset && parseInt(cell.column.dataField) <= offset + cell.data.weeks;
      
      if (isDate) {
        cell.cellElement.style.backgroundColor = headerColor;
      }
      if (cell.data.booked && cell.data.engineering && (cell.columnIndex <= 4 || isDate)) {
        cell.cellElement.style.backgroundColor = "#edada6";
      }
      if (!cell.data.booked && (cell.columnIndex <= 4 || isDate)) {
        cell.cellElement.style.backgroundColor = "cyan";
      }
      if (cell.column.caption === toMondayDate(cell.data.fieldStart).toLocaleDateString()) {
        cell.cellElement.style.borderLeft = "solid red 5px";
      }
    }

  }

  const renderRow = (row) => {
    if (row.rowType === "group") {
      let colorEntry = shops.find(shop => shop.__KEY___ === row.data.key);
      row.rowElement.style.backgroundColor = colorEntry ? colorEntry.colorkey : "white";
      row.rowElement.style.color = colorEntry ? colorEntry.fontColor : "black";
    }
  }

  return (
    <div>
      <input type="checkbox" style={{ width: "30px" }} id="expand" name="expand" defaultChecked value={expanded} onChange={() => setExpanded(!expanded)} />
      <label htmlFor="expand">Expand All</label>
      <DataGrid
        dataSource={jobs}
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

        <GroupPanel visible autoExpandAll />
        <SearchPanel visible highlightCaseSensitive={false} />
        <Grouping autoExpandAll={expanded} />
        <Sorting mode="multiple" />
        <LoadPanel enabled showIndicator />

        <Column
          dataField="shop"
          groupIndex={0}
          dataType="string"
          allowSorting={false}
          calculateGroupValue="groupKey"
          groupCellRender={row => {
            let shop = shops.find(shop => row.value === shop.__KEY__);
            return shop && <div style={{ flexDirection: "row", display: "flex", alignItems: "center", borderRadius: "10px", backgroundColor: shop.colorkey, padding: "10px", color: shop.fontColor, fontSize: "15px" }}><b style={{ fontSize: '20px' }}> {shop.shop}:  </b> &nbsp; Units: {row.summaryItems[0].value} | Units Per Week: {row.summaryItems[1].value} | Employees: {row.summaryItems[2].value}</div>
          }}
        />

        <Column fixed allowSorting
          dataField="jobNumber"
          caption="Job Number"
          alignment="center"
        />
        <Column fixed
          minWidth={'250px'}
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
          dataField="fieldStart"
          caption="Field Start"
          alignment="center"
        />

        {columns.map(col => (
          <Column
            key={col.offset}
            dataField={col.offset.toString()}
            caption={col.date}
          />
        ))}

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
  );
}

export default ProductionScheduleGantt;
