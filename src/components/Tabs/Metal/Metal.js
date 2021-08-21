
import React, { useState, useRef, useEffect } from 'react';
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
  SortByGroupSummaryInfo,
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
  const { metal, jobs, shops, toMS, toDays, toWeeks } = props;
  const [loaded, setLoaded] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [today, setToday] = useState(new Date());
  const datagridRef = useRef(null);

  useEffect(() => {
    calculateForOffSets();
  }, [])

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

    let thisMonday = new Date(today.getTime() + toMS(1 - today.getDay()));
    let startOffset = toOffset(thisMonday);

    let newCols = [];

    // push offsets which turn into the dates i <= end.offset + end.weeks
    for (let i = 0; i <= end.offset + end.weeks; i++) {
      newCols.push(startOffset + i);
      if (i < 100) {
        datagridRef.current.instance.addColumn({ dataField: startOffset + i, caption: convertToDate(startOffset + i - startOffset), type: "date" });
      }
    }

    // set up offsets for each job
    jobs.forEach(job => {
      job.offsets = [];
      for (let w = 0; w <= job.weeks; w++) {
        job.offsets.push(job.offset + w);
      }
    })
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
      let colorEntry = shops.find(shop => shop.__KEY___ === row.data.key);
      row.rowElement.style.backgroundColor = colorEntry ? colorEntry.colorkey : "white";
      row.rowElement.style.color = colorEntry ? colorEntry.fontColor : "black";
    }
  }

  const rowInserted = (row) => {
    axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/metal/${row.data.__KEY__}.json`, row.data)
      .then(response => response)
      .catch(error => console.log(error))
  }

  const rowUpdated = (row) => {
    axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/metal/${row.data.__KEY__}.json`, row.data)
      .then(response => response)
      .catch(error => console.log(error))
  }

  const rowRemoved = (row) => {
    axios.delete(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/metal/${row.data.__KEY__}.json`)
      .then(response => response)
      .catch(error => console.log(error))
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
              {/* <CheckBox
                text="Expand Rows"
                value={expanded}
                onValueChanged={() => setExpanded(!expanded)}
                style={{ marginBottom: '20px' }}
              /> */}
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
        ref={datagridRef}
      >

        {/* <GroupPanel visible autoExpandAll /> */}
        <SearchPanel visible highlightCaseSensitive={false} />
        <Grouping autoExpandAll={expanded} />
        <Sorting mode="multiple" />
        <LoadPanel enabled showIndicator />

        <Summary recalculateWhileEditing>
          <TotalItem
            column="pounts"
            summaryType="sum"
          />
        </Summary>

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
        <Column fixed
          dataField="lbs"
          caption="lbs"
          alignment="center"
        />
      </DataGrid>
    </div>
  );
}

export default Metal;
