
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

const AllActivities = (props) => {
    const { data, handleUpdate } = props;
    const [ loaded, setLoaded ] = useState(true);
    const jobs = data.jobs ? data.jobs : [];
    const shopdrawings = data.shopdrawings ? data.shopdrawings : [];
    const fabmatrix = data.fabmatrix ? data.fabmatrix : [];

    const renderRow = (row) => {
      if (row.rowType === "data" && !row.data.booked) {
          row.rowElement.style.backgroundColor = "cyan";
      } 
    }

    return (
    <div style={{margin: '3vw'}}>
      {loaded 
        ? <div>
          <DataGrid
            dataSource={jobs}
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
            onRowUpdated={handleUpdate}
            onRowPrepared={renderRow}
            cellHintEnabled

          >

            <GroupPanel visible={false} autoExpandAll/>
            <SearchPanel visible highlightCaseSensitive={false} />
            <Grouping autoExpandAll />
            <Sorting mode="multiple" />

            <Editing
              mode="cell"
              allowUpdating
              useIcons
              allowSorting
              allowDeleting={false}
            />

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
                calculateCellValue={row => {
                    let date = shopdrawings.find(item => item.jobName === row.jobName);
                    return date ? new Date(date.start).toLocaleDateString() : "";
                }}
            >
                 
            </Column>

            <Column
                dataField="metalTakeoff"
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
                dataField="shopUseBrakeShapesAndSteel"
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
                calculateCellValue={row => {
                    let date = fabmatrix.find(item => item.jobKey=== row.__KEY__);
                    row.fabDrawings = date && new Date(date.start);
                    return date ? row.fabDrawings.toLocaleDateString() : date;
                }}
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
