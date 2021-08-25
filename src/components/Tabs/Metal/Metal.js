
import React, { useState, useRef, useEffect } from 'react';
import DataGrid, {
  Column,
  Grouping,
  LoadPanel,
  SearchPanel,
  Summary,
  TotalItem,
  Sorting,
  Editing,
  Button,
  RequiredRule,
  Lookup
} from 'devextreme-react/data-grid';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';

const Metal = (props) => {
  const { metal, jobs, shops, toMS, toDays, toWeeks, toMondayDate, handleUpdate, rowInserted, rowUpdated, rowRemoved } = props;
  const [expanded, setExpanded] = useState(true);
  const [data, setData] = useState([]);
  const [today, setToday] = useState(new Date());
  const [columns, setColumns] = useState([]);
  const datagrid = useRef(null);

  useEffect(() => {
    calculateForOffSets();
  }, [ metal ])

  const convertToDate = (value) => {
    let thisMonday = today.getTime() + toMS(1 - today.getDay())
    let date = (value * 7);
    date = new Date(toMS(date) + thisMonday);
    return date.toLocaleDateString();
  }

  const toOffset = (date) => {
    return toWeeks(jobs[0].start, date);
  }

  const calculateForOffSets = () => {
    let end = jobs[jobs.length - 1];
    let startOffset = toOffset(toMondayDate(today));
    let newCols = [];

    for (let i = startOffset; i <= end.offset + end.weeks; i++) {
      newCols.push({ offset: i, date: convertToDate(i - startOffset) });
    }

    let newJobs = JSON.parse(JSON.stringify(jobs));


    newJobs.forEach(job => {
      job.fieldStart = new Date(job.fieldStart);
      job.start = new Date(job.start);
      job.offsets = [];
      for (let w = 0; w <= job.weeks; w++) {
        job.offsets.push((job.offset + w).toString());
      }
    })

    setData(newJobs);

    metal.forEach(row => {
      let job = newJobs.findIndex(j => j.jobName === row.jobName)
      if (job != -1) {
        newJobs[job][toOffset(toMondayDate(new Date(row.weekStart))).toString()] = row.lbs;
      }
    })

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
      let isDate = cell.data.offsets.includes(cell.column.dataField.toString());

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

  return (
    <div style={{ margin: "3vw" }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"

        >
          <Typography>Adjust Columns</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container direction="column">
            <Grid item>
              <input type="checkbox" style={{ width: "30px" }} id="expand" name="expand" defaultChecked value={expanded} onChange={() => setExpanded(!expanded)} />
              <label htmlFor="expand">Expand All</label>
            </Grid>
            <Grid item>
              <DataGrid
                dataSource={metal}
                showRowLines
                showBorders
                allowColumnResizing
                columnAutoWidth
                highlightChanges
                repaintChangesOnly
                twoWayBindingEnabled
                wordWrapEnabled
                autoExpandAll
                highlightChanges
                onRowUpdated={rowUpdated}
                onRowRemoved={rowRemoved}
                onRowInserted={rowInserted}
              >
                <Editing
                  mode="cell"
                  allowUpdating
                  allowDeleting
                  allowAdding
                  useIcons
                />

                <Grouping autoExpandAll={expanded} />
                {/* <LoadPanel enabled showIndicator /> */}

                <Column type="buttons">
                  <Button name="delete" />
                </Column>

                <Column
                  dataField="job"
                  groupIndex={0}
                  calculateGroupValue="jobName"
                  groupCellRender={row => {
                    return <div style={{ fontSize: "15px" }}>{row.value}</div>
                  }}
                />
                <Column
                  dataField="jobName"
                  caption="Job"
                  alignment="left"
                  width={300}
                >
                  <Lookup
                    dataSource={jobs}
                    displayExpr="jobName"
                    valueExpr="jobName"
                  />
                </Column>
                <Column
                  dataField="weekStart"
                  caption="Week"
                  dataType="date"
                  alignment="center"
                  defaultSortOrder="asc"
                >
                  <RequiredRule />
                </Column>

                <Column
                  dataField="lbs"
                  caption="lbs for Week"
                  dataType="number"
                  alignment="center"
                />
              </DataGrid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

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
        ref={datagrid}
      >

        <SearchPanel visible highlightCaseSensitive={false} />
        <Grouping autoExpandAll={expanded} />
        <Sorting mode="multiple" />
        <LoadPanel enabled showIndicator />

        <Summary recalculateWhileEditing>
          <TotalItem
            column="lbs"
            summaryType="sum"
            showInColumn="lbs"
            customizeText={item => `Total Pounds: ${item.value}`}
          />
        </Summary>

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

        <Column fixed
          dataField="lbs"
          caption="lbs"
          alignment="center"
          calculateCellValue={row => {
            let cols = datagrid.current.instance.getVisibleColumns().slice(5).filter(col => row[col.dataField]).map(col => row[col.dataField]);
            const rowTotal = cols.length > 0 ? cols.reduce((total, col) => total + col) : 0;
            return rowTotal;
          }}
        />

        {columns.map(col => (
          <Column
            key={col.offset}
            dataField={col.offset.toString()}
            caption={col.date}
            alignment="center"
            dataType="number"
          />
        ))}

      </DataGrid>
    </div>
  );
}

export default Metal;
