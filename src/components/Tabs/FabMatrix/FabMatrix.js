
import React, { useState, useEffect } from 'react';
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  SearchPanel,
  Editing,
  Button,
  RequiredRule,
  Lookup
} from 'devextreme-react/data-grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';

const FabMatrix = (props) => {
  const { data, handleUpdate, rows, weeks, toWeeks, toMondayDate, addDays } = props;
  const [expanded, setExpanded] = useState(false);
  const [columns, setColumns] = useState([]);
  const [fabMatrixData, setFabMatrixData] = useState([]);

  const jobs = data.jobs ? data.jobs : [];
  const fabmatrix = data.fabmatrix ? data.fabmatrix : [];

  useEffect(() => {
    fabmatrix.forEach(activity => {
      activity.start = new Date(activity.start);
      activity.end = new Date(activity.end);
    })
    createColumns();
    createRows();
  }, [])

  const createRows = () => {
    let newRows = JSON.parse(JSON.stringify(rows));

    fabmatrix.forEach(activity => {
      let numWeeksForProject = toWeeks(activity.start, activity.end);

      let activityDates = [];
      let start = toMondayDate(activity.start);

      for (let i = 0; i <= numWeeksForProject; i++) {
        let date = addDays(start, i * 7);
        activityDates.push(date);
      }

      for (let i = 0; i < weeks; i++) {
        activityDates.forEach(date => {
          if (date.toLocaleDateString() === newRows[i].date) {
            newRows[i][activity.employee] = activity.activity;
          }
        })
      }
    })

    setFabMatrixData(newRows);
  }

  const createColumns = () => {
    let cols = [...new Set(fabmatrix.map(item => item.employee))];
    setColumns(cols);
  }

  const rowUpdatedHandler = (rowData) => {
    const newData = { ...data, fabmatrix: fabmatrix };

    createColumns();

    rowData.component.beginCustomLoading();
    handleUpdate(newData).then((response) => {
      createRows();
      rowData.component.endCustomLoading();
    }
    );
  }

  const rowPrepared = (row) => {
    row.rowElement.style.backgroundColor = row.rowIndex % 2 ? "#b5bdc9" : "white";
  }

  const startDateRender = (row) => {
    let job = jobs.find(j => j.__KEY__ === row.data.jobKey);
    row.data.fabOffset = job && toWeeks(job.start, row.data.start);
    return (
      <div>
        {row.data.start && row.data.start.toLocaleDateString()}
        <br />
        {<p style={{ color: "#3f50b5" }}> {row.data.fabOffset} weeks before shop date </p>}
      </div>
    )
  }

  const startDateEdit = (row) => {
    let link = row.data.linkToShopDate;
    return (
      <div>
        {link
          ? <input
            placeholder="weeks before shop start"
            onChange={e => {
              let weeks = e.target.value;
              let job = jobs.find(job => job.__KEY__ === row.data.jobKey);
              let fabDate = addDays(job.start, weeks * 7)
              row.setValue(fabDate);
            }}
          />
          : <input
            type="text"
            placeholder="MM/DD/YYYY"
            onChange={e => {
              if ((new Date(e.target.value) !== "Invalid Date") && !isNaN(new Date(e.target.value))) {
                let d = new Date(e.target.value);
                d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
                row.setValue(d);
              }
              
            }}
          />
        }
      </div>
    )
  }

  const rowInit = (row) => {
    row.data.start = new Date();
    row.data.weeksBeforeStart = 6;
  }

  return (
    <div style={{ margin: '3vw' }}>
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
              <input type="checkbox" style={{ width: "30px" }} id="expand" name="expand" value={expanded} onChange={() => setExpanded(!expanded)} />
              <label htmlFor="expand">Expand All</label>
            </Grid>
            <Grid item>
              <DataGrid
                dataSource={fabmatrix}
                showRowLines
                showBorders
                allowColumnResizing
                columnAutoWidth
                highlightChanges
                repaintChangesOnly
                twoWayBindingEnabled
                columnResizingMode="widget"
                wordWrapEnabled
                autoExpandAll
                highlightChanges
                cellHintEnabled
                onInitNewRow={rowInit}
                onRowUpdated={rowUpdatedHandler}
                onRowRemoved={rowUpdatedHandler}
                onRowInserted={rowUpdatedHandler}
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
                  dataField="employeeName"
                  groupIndex={0}
                  calculateGroupValue="employee"
                  groupCellRender={row => {
                    return <div style={{ flexDirection: "row", display: "flex", alignItems: "center", fontSize: "15px" }}>{row.value}</div>
                  }}
                />
                <Column
                  dataField="employee"
                  caption="Employee"
                  dataType="string"
                  alignment="left"
                >
                  <RequiredRule />
                </Column>

                <Column
                  dataField="jobKey"
                  caption="Job"
                  alignment="left"
                  width={250}
                >
                  <Lookup
                    dataSource={jobs}
                    displayExpr="jobName"
                    valueExpr="__KEY__"
                  />
                </Column>

                <Column
                  dataField="shopStart"
                  caption="Shop Start Date"
                  allowEditing="false"
                  calculateCellValue={row => {
                    let job = jobs.find(job => job.__KEY__ === row.jobKey);
                    return job && job.start;
                  }}
                />

                <Column
                  dataField="linkToShopDate"
                  caption="Link To Shop Date?"
                  datatype="boolean"
                  alignment="center"
                  calculateCellValue={row => row.linkToShopDate ? row.linkToShopDate : false}
                />

                <Column
                  dataField="start"
                  caption="Start Date"
                  dataType="date"
                  alignment="center"
                  defaultSortOrder="asc"
                  minWidth="160"
                  cellRender={startDateRender}
                  editCellRender={startDateEdit}
                >
                  <RequiredRule />
                </Column>
                <Column
                  dataField="end"
                  caption="End Date"
                  dataType="date"
                  alignment="center"
                >
                  <RequiredRule />
                </Column>
                <Column
                  dataField="activity"
                  caption="Activity"
                  alignment="left"
                >
                  <RequiredRule />
                </Column>
              </DataGrid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <DataGrid
        dataSource={fabMatrixData}
        showBorders
        showRowLines
        allowColumnResizing
        columnAutoWidth
        highlightChanges
        repaintChangesOnly
        twoWayBindingEnabled
        wordWrapEnabled
        autoExpandAll
        highlightChanges
        onRowPrepared={rowPrepared}
      >

        <GroupPanel visible={false} autoExpandAll />
        <SearchPanel visible highlightCaseSensitive={false} />
        <Grouping autoExpandAll />

        <Editing
          mode="row"
          useIcons
          allowSorting={false}
        />

        <Column
          dataField="date"
          caption="Date"
          alignment="left"
          width={"auto"}
          allowEditing={false}
        />

        {columns.map(column => (
          <Column
            key={column}
            dataField={column}
            caption={column}
          />
        ))}

      </DataGrid>
    </div>
  );
}

export default FabMatrix;
