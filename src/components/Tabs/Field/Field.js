
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

const Field = (props) => {
  const { field, jobsites, jobs, shops, toMS, toDays, toWeeks, toMondayDate, handleUpdate, rowInserted, rowUpdated, rowRemoved } = props;
  const [expanded, setExpanded] = useState(true);
  const [data, setData] = useState([]);
  const [today, setToday] = useState(new Date());
  const [columns, setColumns] = useState([]);
  const [totalEmps, setTotalEmps] = useState(0);
  const datagrid = useRef(null);

  useEffect(() => {
    calculateForOffSets();
  }, [field])

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
    })

    setData(newJobs);

    let total = 0;

    field.forEach(row => {
      let jobIndex = newJobs.findIndex(j => j.jobName === row.jobName);
      if (jobIndex != -1) {
        let fieldOffset = toOffset(toMondayDate(newJobs[jobIndex].fieldStart));
        newJobs[jobIndex][(fieldOffset + row.offsetFromField).toString()] = row.numberOfEmployees;
        total += row.numberOfEmployees;
      }
    })

    setTotalEmps(total);
    setColumns(newCols);
  }

  const jobsiteUpdated = (row) => {
    axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/jobsites/${row.data.__KEY__}.json`, row.data)
    .catch(error => console.log(error))
  }

  const jobsiteRemoved = (row) => {
    axios.delete(`https://ww-production-schedule-default-rtdb.firebaseio.com/data/jobsites/${row.data.__KEY__}.json`)
    .catch(error => console.log(error))
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

    if (cell.data) {
      let isDate = typeof cell.data[cell.column.dataField] === "number";

      if (isDate) {
        cell.cellElement.style.backgroundColor = "#5eafff";
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

            <Grid item style={{marginTop: "20px"}}>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Edit Jobsites</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <DataGrid
                    dataSource={jobsites}
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
                    onRowUpdated={jobsiteUpdated}
                    onRowRemoved={jobsiteRemoved}
                    onRowInserted={jobsiteUpdated}
                  >
                    <Editing
                      mode="cell"
                      allowUpdating
                      allowDeleting
                      allowAdding
                      useIcons
                    />

                    <Column type="buttons">
                      <Button name="delete" />
                    </Column>

                    <Column
                      dataField="jobsite"
                      caption="Jobsite"
                      alignment="left"
                    />
                  </DataGrid>
                </AccordionDetails>
              </Accordion>
            </Grid>

            <Grid item>
              <DataGrid
                dataSource={field}
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
                  dataField="jobsiteGroup"
                  caption="Jobsite"
                  alignment="left"
                  groupIndex={0}
                  calculateGroupValue="jobsite"
                />
                <Column
                  dataField="jobNameGroup"
                  caption="Job"
                  alignment="left"
                  width={300}
                  groupIndex={1}
                  calculateGroupValue="jobName"
                />

                <Column
                  dataField="jobsite"
                  caption="Jobsite"
                  alignment="left"
                  calculateGroupValue="jobsite"
                  minWidth={250}
                >
                  <Lookup
                    dataSource={jobsites}
                    displayExpr="jobsite"
                    valueExpr="jobsite"
                  />
                  <RequiredRule />
                </Column>
                <Column
                  dataField="jobName"
                  caption="Job"
                  alignment="left"
                  minWidth={250}
                  calculateGroupValue="jobName"
                >
                  <Lookup
                    dataSource={jobs}
                    displayExpr="jobName"
                    valueExpr="jobName"
                  />
                  <RequiredRule />
                </Column>
                <Column
                  dataField="fieldStart"
                  caption="Field Start"
                  dataType="date"
                  alignment="center"
                  defaultSortOrder="asc"
                  allowEditing={false}
                  calculateCellValue={row => {
                    let job = jobs.find(job => job.jobName === row.jobName);
                    return job && job.fieldStart;
                  }}
                >
                </Column>

                <Column
                  dataField="offsetFromField"
                  caption="Offset From Field Start"
                  dataType="number"
                  alignment="center"
                >
                  <RequiredRule />
                </Column>

                <Column
                  dataField="numberOfEmployees"
                  caption="Number of Employees"
                  dataType="number"
                  alignment="center"
                >
                  <RequiredRule />
                </Column>
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
            column="employees"
            summaryType="sum"
            customizeText={item => `Total Employees: ${totalEmps}`}
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
        />

        <Column fixed
          dataField="fieldStart"
          caption="Field Start"
          alignment="center"
          defaultSortOrder="asc"
        />

        <Column fixed
          dataField="employees"
          caption="Avg. # of Employees"
          alignment="center"
          calculateCellValue={row => {
            let cols = datagrid.current.instance.getVisibleColumns().slice(5).filter(col => row[col.dataField]).map(col => row[col.dataField]);
            const rowTotal = cols.length > 0 ? cols.reduce((total, col) => total + col) : 0;
            const avgEmployees = rowTotal > 0 ? Math.ceil(rowTotal / cols.length) : 0;
            return avgEmployees;
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

export default Field;
