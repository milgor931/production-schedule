
import React, { useState, createRef, useEffect } from 'react';
import Spinner from '../../UI/Spinner';
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
  FilterRow, 
  RemoteOperations
} from 'devextreme-react/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  blueColumn: {
      backgroundColor: "#00c7d9",
      color: 'white'
  }
}));

const AllActivities = (props) => {
    const [ data, setData] = useState([]);
    const [ loaded, setLoaded ] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        axios.get("https://ww-production-schedule-default-rtdb.firebaseio.com/jobs.json")
        .then(response => {
            response.data ? setData(Object.values(response.data)) : setData([]);
            setLoaded(true);
        })
        .catch(error => {
            alert(error);
        })
    }, [ ])


    const renderRow = (row) => {
      if (row.rowType === "data") {
        if (!row.data.booked) {
          row.rowElement.style.backgroundColor = "#b6cdd1";
        } else if (row.data.header) {
          row.rowElement.style.backgroundColor = "#a8a8a8";
        }
      } 
    }

    const handleUpdate = (row) => {
        if (row.data) {
            row = row.data;
        }
        row.shopName = row.shop;
        row.title = row.jobName;
        axios.put(`https://ww-production-schedule-default-rtdb.firebaseio.com/jobs/${row.id}.json`, row)
        .then(response => {
            setData([ ...data ])
        })
        .catch(error => alert(error))
    }

    const rowRemoved = (row) => {
        // setData([ Object.assign(data, row.data) ])
        axios.delete(`https://ww-production-schedule-default-rtdb.firebaseio.com/jobs/${row.data.id}.json`)
        .then(response => {
            // setData([ ...data ])
        })
        .catch(error => alert(error))
    }

    const onRowInit = (row) => {
        row.data.booked = false;
        row.data.shop = "";
        row.data.shopName = "";
        row.data.jobName = "job name";
        row.data.title = "job name";
        row.data.wallType = "wall type";
        row.data.start = new Date();
        row.data.fieldStart = new Date();
        row.data.id = row.data.__KEY__;
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
            // onCellPrepared={cellPrepared}
            onRowPrepared={renderRow}
            cellHintEnabled

          >

            <GroupPanel visible={false} autoExpandAll/>
            <SearchPanel visible highlightCaseSensitive={false} />
            <Grouping autoExpandAll />
            {/* <FilterRow visible={true} /> */}
            <Sorting mode="multiple" />

            <Editing
              mode="batch"
              allowUpdating
              allowDeleting
              allowAdding
              useIcons
              allowSorting
            />

            <Column type="buttons">
                <Button name="edit" />
                <Button name="delete" />
            </Column>

            <Column
                dataField="jobNumber" 
                dataType="string"
                caption="Job Number" 
                alignment="center" 
            >
                <RequiredRule />
            </Column>

            <Column 
                dataField="jobName" 
                dataType="string"
                caption="Job Name" 
                alignment="left">
                    <RequiredRule />
            </Column>

            <Column
                dataField="startShopDrawings"
                dataType="date"
                caption="Start Shop Drawings"
                alignment="center"
            >
                 
            </Column>

            <Column
                dataField="startMetalMiscTakeoff"
                dataType="date"
                caption="Start Metal and Misc Takeoff"
                alignment="center"
            >
                <RequiredRule />
            </Column>

            <Column
                dataField="startGlassTakeoff"
                dataType="date"
                caption="Start Glass Takeoff"
                alignment="center"
            >
                <RequiredRule />
            </Column>

            <Column
                dataField="startDoorSchedule"
                dataType="date"
                caption="Start Door Schedule"
                alignment="center"
            >
                <RequiredRule />
            </Column>

            <Column
                dataField="startShopUseBrakeShapes"
                dataType="date"
                caption="Start Shop Use Brake Shapes"
                alignment="center"
            >
                <RequiredRule />
            </Column>

            <Column
                dataField="panelFabs"
                dataType="date"
                caption="Panel Fabs"
                alignment="center"
            >
                <RequiredRule />
            </Column>

            <Column
                dataField="panelRelease"
                dataType="date"
                caption="Panel Release"
                alignment="center"
            >
                <RequiredRule />
            </Column>

            <Column
                dataField="fabDrawings"
                dataType="date"
                caption="Fab Drawings"
                alignment="center"
            >
                <RequiredRule />
            </Column>

            <Column
                dataField="start"
                dataType="date"
                caption="Shop Start"
                alignment="center"
            >
                <RequiredRule />
            </Column>

            <Column
                dataField="fieldStart"
                dataType="date"
                caption="Field Start"
                alignment="center"
            >
                <RequiredRule />
            </Column>
          </DataGrid>
        </div>
      : <Spinner />
      }
      </div>
    );
}

export default AllActivities;
