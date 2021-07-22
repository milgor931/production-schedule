
import React, { useState, createRef, useEffect } from 'react';
import Spinner from '../Spinner';
import CheckBox from "devextreme/ui/check_box";
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  Pager,
  Paging,
  RowDragging,
  SearchPanel,
  Editing,
  Summary, 
  Sorting,
  RequiredRule,
  TotalItem,
  MasterDetail,
  GroupItem,
  Button,
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
    const { data, handleUpdate, rowAdded, rowRemoved, onRowInit } = props;
    const [ loaded, setLoaded ] = useState(false);
    const classes = useStyles();

    useEffect(() => {
      data && setLoaded(true);
    }, [ data ])

    const onReorder = (e) => {
      const visibleRows = e.component.getVisibleRows();
      const newTasks = [...data];
      const toIndex = newTasks.indexOf(visibleRows[e.toIndex].data);
      const fromIndex = newTasks.indexOf(e.itemData);

      newTasks.splice(fromIndex, 1);
      newTasks.splice(toIndex, 0, e.itemData);

      let shop = data[toIndex].shop;
      e.itemData.shop = shop;

      handleUpdate(e.itemData);
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

    const editJobWallCell = (data) => {
      return (
        <div>
          <input type="text" placeholder={data.data.jobName} name={data.data.jobName} onChange={e => data.data.jobName = e.target.value}/>
          <br></br>
          <input type="text" placeholder={data.data.wallType} name={data.data.wallType} onChange={e => data.data.wallType = e.target.value}/>
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

    const shopDropDown = (row) => {
      return (
        <FormControl className={classes.formControl}>
          <Select
            value={row.data.shop}
            onChange={e => row.data.shop = e.target.value}
            displayEmpty
            className={classes.selectEmpty}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Shop A">Shop A</MenuItem>
            <MenuItem value="Shop B">Shop B</MenuItem>
          </Select>
          {/* <FormHelperText>Without label</FormHelperText> */}
        </FormControl>
      )
    }

    const jobNumberRender = (row) => {
      if (!row.data.booked) {
        row.data.jobNumber = "Could book in 90 days";
        row.column.allowEditing = false;
      } else if (row.data.booked && row.data.jobNumber === "Could book in 90 days") {
        row.data.jobNumber = "";
        row.column.allowEditing = true;
      }
      return row.data.jobNumber;
    }

    const cellPrepared = (cell) => {
      if (cell.column.dataField === "weeks" || cell.column.dataField === "offset" || cell.column.dataField === "end") {
        cell.cellElement.style.backgroundColor = "#c2c4c4";
      }
    }

    return (
    <div>
      {loaded 
        ? <div>
          <DataGrid
            dataSource={data}
            showBorders
            allowColumnResizing
            columnAutoWidth
            highlightChanges
            repaintChangesOnly
            onRowPrepared={renderRow}
            twoWayBindingEnabled
            columnResizingMode="nextColumn"
            wordWrapEnabled
            autoExpandAll
            highlightChanges
            onInitNewRow={onRowInit}
            // onInitialized={onRowInit}
            onRowUpdated={handleUpdate}
            onRowInserted={handleUpdate}
            onRowRemoved={rowRemoved}
            onCellPrepared={cellPrepared}
          >

            <GroupPanel visible autoExpandAll/>
            <SearchPanel visible highlightCaseSensitive={false} />
            <Grouping autoExpandAll />
            <Sorting mode="multiple" />

            <Editing
              mode="cell"
              allowUpdating
              allowDeleting
              allowAdding
              useIcons
              allowSorting
            />

            <RowDragging
              allowReordering
              onReorder={onReorder}
              showDragIcons
            />

            <Column type="buttons">
              <Button name="edit" />
              <Button name="delete" />
            </Column>
            <Column 
              dataField="shop" 
              groupIndex={0} 
              dataType="string"
            />
            {/* <Column dataField="shop" caption="Shop" editCellRender={shopDropDown}/> */}

            <Column
              dataField="booked" 
              alignment="center"
            >
              {/* <RequiredRule /> */}
            </Column>
            <Column 
              dataField="jobName" 
              dataType="string"
              caption="Job Name & Wall Type" 
              cellRender={jobWallCell} 
              editCellRender={editJobWallCell} 
              alignment="left">
              <RequiredRule />
            </Column>
            <Column
             dataField="jobNumber" 
             dataType="string"
             caption="Job Number" 
             alignment="center" 
             cellRender={jobNumberRender} >
              <RequiredRule />
            </Column>
            <Column
             dataField="customer" 
             dataType="string"
             caption="Customer" 
             alignment="center" >
              <RequiredRule />
            </Column>
            <Column 
              dataField="unitsPerWeek" 
              dataType="number"
              caption="Units/Week" 
              alignment="center" >
              <RequiredRule />
            </Column>
            <Column
             allowSorting 
             dataField="start" 
             dataType="date"
             caption="Shop Start Date" 
             alignment="center">
              <RequiredRule />
            </Column>
            <Column
             dataField="fieldStart" 
             dataType="date"
             cption="Field Start Date" 
             alignment="center" >
              <RequiredRule />
            </Column>
            <Column 
              dataField="units" 
              dataType="number"
              caption="Units" 
              alignment="center">
              <RequiredRule />
            </Column>
            <Column 
              dataField="emps" 
              dataType="number"
              caption="Emps" 
              alignment="center">
              <RequiredRule />
            </Column>
            
            <Column dataField="weeks" caption="Weeks" alignment="center" allowEditing={false}>
              {/* <RequiredRule /> */}
            </Column>
            <Column dataField="end" caption="End Date" alignment="center" allowEditing={false} allowEditing={false} >
              {/* <RequiredRule /> */}
            </Column>
            <Column dataField="offset" caption="Offset" allowEditing={false} alignment="center">
              {/* <RequiredRule /> */}
            </Column>
            
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
