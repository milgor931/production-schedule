
import React, { useState, useEffect } from 'react';
import Spinner from '../../UI/Spinner';
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  SearchPanel,
  Editing,
  Sorting
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
    const { data, handleUpdate, rowRemoved, onRowInit } = props;
    const [ loaded, setLoaded ] = useState(true);
    const classes = useStyles();

    const renderRow = (row) => {
      if (row.rowType === "data") {
        if (!row.data.booked) {
          row.rowElement.style.backgroundColor = "cyan";
        } else if (row.data.header) {
          row.rowElement.style.backgroundColor = "#a8a8a8";
        }
      } 
    }

    return (
    <div style={{margin: '3vw'}}>
      {loaded 
        ? <div>
          <DataGrid
            dataSource={data}
            showBorders
            showRowLines
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
              mode="cell"
              allowUpdating
              allowDeleting
              useIcons
              allowSorting
            />

            {/* <Column type="buttons">
                <Button name="edit" />
                <Button name="delete" />
            </Column> */}

            <Column
                dataField="jobNumber" 
                dataType="string"
                caption="Job Number" 
                alignment="center" 
                allowEditing={false}
            >
            </Column>

            <Column 
                dataField="jobName" 
                dataType="string"
                caption="Job Name" 
                alignment="left"
                allowEditing={false}
            >
            </Column>

            <Column
                dataField="PM"
                dataType="string"
                caption="PM"
                alignment="center"
                minWidth={200}
            >
                {/* <RequiredRule /> */}
            </Column>

            <Column
                dataField="startShopDrawings"
                dataType="date"
                caption="Start Shop Drawings"
                alignment="center"
                allowEditing={false}
            >
                 
            </Column>

            <Column
                dataField="startMetalMiscTakeoff"
                dataType="date"
                caption="Start Metal and Misc Takeoff"
                alignment="center"
                allowEditing={false}
            >
            </Column>

            <Column
                dataField="glassTakeoff"
                dataType="date"
                caption="Start Glass Takeoff"
                alignment="center"
                allowEditing={false}
            >
            </Column>

            <Column
                dataField="doorSchedule"
                dataType="date"
                caption="Start Door Schedule"
                alignment="center"
                allowEditing={false}
            >
            </Column>

            <Column
                dataField="startShopUseBrakeShapes"
                dataType="date"
                caption="Start Shop Use Brake Shapes"
                alignment="center"
                allowEditing={false}
            >
            </Column>

            <Column
                dataField="panelFabs"
                dataType="date"
                caption="Panel Fabs"
                alignment="center"
                allowEditing={false}
            >
            </Column>

            <Column
                dataField="panelRelease"
                dataType="date"
                caption="Panel Release"
                alignment="center"
                allowEditing={false}
            >
            </Column>

            <Column
                dataField="fabDrawings"
                dataType="date"
                caption="Fab Drawings"
                alignment="center"
                allowEditing={false}
            >
            </Column>

            <Column
                dataField="start"
                dataType="date"
                caption="Shop Start"
                alignment="center"
                allowEditing={false}
            >
            </Column>

            <Column
                dataField="fieldStart"
                dataType="date"
                caption="Field Start"
                alignment="center"
                allowEditing={false}
            >
            </Column>
          </DataGrid>
        </div>
      : <Spinner />
      }
      </div>
    );
}

export default AllActivities;
